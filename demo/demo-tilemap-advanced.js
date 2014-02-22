var renderStats, mainscreen, mainlayer, canvas, Game, map,
    tp = new CG.AtlasTexturePacker(), small, abadi, xpos = 10, ypos = 10

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
            .addXml('media/map/map-advanced.tmx', 'map1')
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
        map = new CG.Map(640, 480)
        map.loadMapXml(this.asset.getXmlByName('map1'))

        //get position points from object layer of tiled
        var pointstest = map.getPointsByName('coin')

        //create for every point a sprite and add it to the mainlayer
        for (var i = 0, l = pointstest.length; i < l; i++) {
            diamond = new CG.Sprite({image: this.asset.getImageByName('gem'), position: pointstest[i].position})
            diamond.name = 'diamond'
            diamond.boundingradius = 80
            mainlayer.addElement(diamond)
        }

        //assign sprite to group object b1 of tiled map
        ballon1 = new CG.Sprite({image: this.asset.getImageByName('ballon'), position: new CG.Point(0, 0)})
        ballon1.name = 'ballon1'
        ballon1.boundsMode = 'bounce'
        ballon1.xspeed = 2
        ballon1.yspeed = 1
        ballon1.bound = map.getAreasByName('b1')[0].bound
        ballon1.xscale = 0.3
        ballon1.yscale = 0.3
        mainlayer.addElement(ballon1)

        //assign sprite to group object b2 of tiled map
        ballon2 = new CG.Sprite({image: this.asset.getImageByName('ballon'), position: new CG.Point(0, 0)})
        ballon2.name = 'ballon2'
        ballon2.boundsMode = 'bounce'
        ballon2.xspeed = 1
        ballon2.yspeed = 2
        ballon2.bound = map.getAreasByName('b2')[0].bound
        ballon2.xscale = 0.2
        ballon2.yscale = 0.2
        mainlayer.addElement(ballon2)

        //assign sprite to group object b3 of tiled map
        ballon3 = new CG.Sprite({image: this.asset.getImageByName('ballon'), position: new CG.Point(0, 0)})
        ballon3.name = 'ballon3'
        ballon3.boundsMode = 'bounce'
        ballon3.rotationspeed = 1
        ballon3.xspeed = 1
        ballon3.yspeed = 1
        ballon3.bound = map.getAreasByName('b3')[0].bound
        ballon3.xscale = 0.2
        ballon3.yscale = 0.2
        mainlayer.addElement(ballon3)

        //assign sprite to group object b4 of tiled map
        ballon4 = new CG.Sprite({image: this.asset.getImageByName('ballon'), position: new CG.Point(0, 0)})
        ballon4.name = 'ballon4'
        ballon4.boundsMode = 'bounce'
        ballon4.rotationspeed = 8
        ballon4.xspeed = 1
        ballon4.yspeed = 1
        ballon4.bound = map.getAreasByName('b4')[0].bound
        ballon4.xscale = 0.1
        ballon4.yscale = 0.1
        mainlayer.addElement(ballon4)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        renderStats.update();
    },
    beforeDraw: function () {
        map.drawMap(0, 0, 0, 0, this.bound.width, this.bound.height, this.callbacks.callbackMapCollision)
        this._super()
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Map class example.', xpos, ypos + 56)
        small.drawText('The Tiled mapeditor has a object layer with different object types.', xpos, ypos + 56 + small.getLineHeight())
        small.drawText('The object group is used for bound (ballons) and the tile object is used', xpos, ypos + 56 + (small.getLineHeight() * 2))
        small.drawText('as a point (diamonds). Tilemap collision detection is also possible.', xpos, ypos + 56 + (small.getLineHeight() * 3))
        small.drawText('Bound b1 of map', ballon1.position.x - 40, ballon1.position.y + 20)
        small.drawText('Bound b2 of map', ballon2.position.x - 40, ballon2.position.y + 20)
        small.drawText('Bound b3 of map', ballon3.position.x - 40, ballon3.position.y + 20)
        small.drawText('Bound b4 of map', ballon4.position.x - 40, ballon4.position.y + 20)

    },
    callbacks: {
        callbackMapCollision: function () {

        }
    }
})