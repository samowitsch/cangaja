var renderStats, canvas, abadi, small, gill, mainscreen, mainlayer, back, Game, xpos = 10, ypos = 10,
    fizzxLoader

window.onload = function () {
    canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
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
        this.asset.addImage('media/img/back1.jpg', 'back1')
            .addImage('media/font/small.png', 'small')
            .addFont('media/font/small.txt', 'small')
            .addImage('media/font/abadi_ez.png', 'abadi')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addJson('media/fizzx/exported.json', 'fizzx')
            .startPreLoad()
    },
    create: function () {
        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))
        small = new CG.Font().loadFont(this.asset.getFontByName('small'))

        //screen and layer
        mainscreen = new CG.Screen('mainscreen')
        mainlayer = new CG.Layer('mainlayer')

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        fizzxLoader = new CG.B2DFizzXLoader(Game.asset.getJsonByName('fizzx').src, {}, 10, 10)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('FizzX Box2D Importer Demo', xpos, ypos + 50)
    }
})