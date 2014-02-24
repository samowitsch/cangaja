var renderStats, mainscreen, mainlayer, canvas, Game, abadi, small, map,
    tp = new CG.AtlasTexturePacker(), ri = 0,
    mapcollisiontext = '', xpos = 10, ypos = 10

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

        rocket = new CG.Sprite({
            image: this.asset.getImageByName('rocket'),
            position: new CG.Point(this.width2, this.height2)
        })
        rocket.name = 'rocket'
        rocket.boundingradius = 80
        rocket.xscale = 0.5
        rocket.yscale = 0.5
        mainlayer.addElement(rocket)

        //create tilemap
        map = new CG.Map()
        map.loadMapXml(this.asset.getXmlByName('map1'))
            //add element to map object for collision detection, the collision check is called for every tile in the drawMap method
            .addElement(rocket)

        //set layer 1 to check for collision
        map.layertocheck = 1

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        //clear collisiontext
        mapcollisiontext = ''

        var rocky = mainlayer.getElementByName('rocket')
        ri += 0.007
        rocky.position.x = this.bound.width / 2 + (this.bound.width / 3 * Math.cos(ri * 3 - Math.cos(ri))) >> 0
        rocky.position.y = this.bound.height / 2 + (this.bound.height / 2 * -Math.sin(ri * 2.3 - Math.cos(ri))) >> 0
        renderStats.update();
    },
    beforeDraw: function () {
        map.drawMap(0, 0, 0, 0, this.bound.width, this.bound.height, this.callbacks.callbackMapCollision)
        this._super()
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Map class example.', xpos, ypos + 56)
        small.drawText('This map example shows how to detect a sprite to tilemap collision.', xpos, ypos + 56 + small.getLineHeight())
        small.drawText(mapcollisiontext, xpos, ypos + 56 + (small.getLineHeight() * 2))
    },
    callbacks: {
        callbackMapCollision: function (sprite, tile) {
            if (tile instanceof CG.MapTileProperties) {
                mapcollisiontext = 'Collision: ' + sprite.name + ' hits ' + tile.name
            }
        }
    }
})
