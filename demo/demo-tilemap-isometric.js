var renderStats, mainscreen, mainlayer, canvas, Game, abadi, small, map, xpos = 10, ypos = 10

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
            .addImage('media/img/hunter.png', 'hunter')
            .addXml('media/map/isometric_grass_and_water.tmx', 'map1')
            .startPreLoad()
    },
    create: function () {
        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        //create tilemap
        map = new CG.Map()
        map.loadMapXml(this.asset.getXmlByName('map1'))

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        renderStats.update();
    },
    draw: function () {
        map.drawMap(0, 0, -150, 300, Game.bound.width, Game.bound.height, this.callbacks.callbackMapCollision)
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Map class example. It uses a isometric tilemap.', xpos, ypos + 50)
    },
    callbacks: {
        callbackMapCollision: function () {
        }
    }
})