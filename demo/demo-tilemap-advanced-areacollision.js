var renderStats, mainscreen, mainlayer, canvas, Game, map, abadi, small,
    tp = new CG.AtlasTexturePacker(), xpos = 10, ypos = 10,
    collision = {direction: '', overlap: 0}

window.onload = function () {
    canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};

CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method
    },
    preload: function () {
        this.asset.addFont('media/font/small.txt', 'small', 'small')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/img/glowball-50.png', 'glowball')
            .addImage('media/img/ballon.png', 'ballon')
            .addImage('media/img/hunter.png', 'hunter')
            //tiled map
            .addJson('media/map/map-advanced-inner-outer.json', 'map1')
            //texturepacker
            .addImage('media/img/texturepacker.png', 'texturepacker')
            .addJson('media/img/texturepacker.json', 'texturepacker-json')
            .startPreLoad()
    },
    create: function () {
        //create texturepacker image in asset
        tp.loadJson(this.asset.getJsonByName('texturepacker-json'))

        //put the texturepacker TPImages to the asset
        this.asset.images.push.apply(this.asset.images, tp.getAtlasImages())

        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        //create tilemap
        map = new CG.Map({
            width: 640,
            height: 480
        })
        map.loadMapJson(this.asset.getJsonByName('map1'))

        //assign sprite to group object b2 of tiled map
        glowball = new CG.Sprite({
            image: this.asset.getImageByName('glowball'),
            position: new CG.Point(100, 450)
        })
        glowball.name = 'ballon'
        glowball.boundsMode = 'bounce'
        glowball.xspeed = -1
        glowball.yspeed = 2
        glowball.rotationspeed = 5
        glowball.bound = map.getAreasByName('bound1')[0].bound
        glowball.xscale = 0.5
        glowball.yscale = 0.5
        mainlayer.addElement(glowball)

        ballon = new CG.Sprite({
            image: this.asset.getImageByName('ballon'),
            position: new CG.Point(100, 250)
        })
        ballon.name = 'ballon'
        ballon.boundsMode = 'bounce'
        ballon.xspeed = 3
        ballon.yspeed = -1
        ballon.rotationspeed = 5
        ballon.bound = map.getAreasByName('bound1')[0].bound
        ballon.xscale = 0.1
        ballon.yscale = 0.1
        mainlayer.addElement(ballon)

        map.addElement(ballon)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        ballon.checkCollision([glowball], this.callbacks.callbackCollision)
        ballon.checkCollision(map.areas, this.callbacks.callbackMapAreaCollision)
        glowball.checkCollision(map.areas, this.callbacks.callbackMapAreaCollision)
        renderStats.update();
    },
    beforeDraw: function () {
        //draw only layer 0
        map.renderlayer = 0
        map.drawMap(0, 0, 0, 0, this.bound.width, this.bound.height, this.callbacks.callbackMapCollision)
        this._super()
    },
    draw: function () {
        //draw only layer 1
        map.renderlayer = 1
        map.drawMap(0, 0, 0, 0, this.bound.width, this.bound.height, this.callbacks.callbackMapCollision)

        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Map class example.', xpos, ypos + 56)
        small.drawText('Use areamaps instead of single tiles for collision check.', xpos, ypos + 56 + small.getLineHeight())
        small.drawText('Collision from ' + collision.direction + " with overlap of " + collision.overlap + "", xpos, ypos + 56 + (small.getLineHeight() * 2))
        small.drawText('Collision to maparea', ballon.position.x - 40, ballon.position.y + 20)
    },
    callbacks: {
        callbackCollision: function (ballon, glowball, coll) {
            if (coll.direction == 'top') {
                ballon.position.y -= coll.overlap
                ballon.yspeed = ballon.yspeed * -1
                glowball.yspeed = glowball.yspeed * -1
            } else if (coll.direction == 'bottom') {
                ballon.position.y += coll.overlap
                ballon.yspeed = ballon.yspeed * -1
                glowball.yspeed = glowball.yspeed * -1
            } else if (coll.direction == 'left') {
                ballon.position.x -= coll.overlap
                ballon.xspeed = ballon.xspeed * -1
                glowball.xspeed = glowball.xspeed * -1
            } else if (coll.direction == 'right') {
                ballon.position.x += coll.overlap
                ballon.xspeed = ballon.xspeed * -1
                glowball.xspeed = glowball.xspeed * -1
            }
        },
        callbackMapAreaCollision: function (obj, maparea, coll) {
            if (coll.direction == 'top' || coll.direction == 'bottom') {
                obj.position.y -= coll.overlap
                obj.yspeed = obj.yspeed * -1
            } else {
                obj.position.x -= coll.overlap
                obj.xspeed = obj.xspeed * -1
            }
            obj.rotationspeed *= -1

            collision = coll
        },
        callbackMapCollision: function () {
        }
    }
})