var renderStats, canvas, abadi, small, gill, mainscreen, mainlayer, back, Game, xpos = 10, ypos = 10

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
            .addImage('media/font/gill.png', 'gill')
            .addFont('media/font/gill.txt', 'gill')
            .addImage('media/font/abadi_ez.png', 'abadi')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .startPreLoad()
    },
    create: function () {
        abadi = new CG.Font().loadFont({
            font: this.asset.getFontByName('abadi')
        })
        small = new CG.Font().loadFont({
            font: this.asset.getFontByName('small')
        })
        gill = new CG.Font().loadFont({
            font: this.asset.getFontByName('gill')
        })

        //screen and layer
        mainscreen = new CG.Screen({
            name: 'mainscreen'
        })
        mainlayer = new CG.Layer({
            name: 'mainlayer'
        })

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        //sprite for the background
        back = new CG.Sprite({
            image: this.asset.getImageByName('back1'),
            position: new CG.Point(this.width2, this.height2)
        })
        back.xscale = back.yscale = 1.3
        back.name = 'back'
        mainlayer.addElement(back)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('This is a little font class demo!', xpos, ypos + 50)
        small.drawText('With different fonts generated with Glyphdesigner.', xpos, ypos + 120)
        small.drawText('It has only some basic features at the moment.', xpos, ypos + 120 + small.getLineHeight())
        gill.drawText('äöüß?áà', xpos, ypos + 180)
        gill.drawText('ÄÖÜ~§$%&', xpos, ypos + 180 + gill.getLineHeight())
    }
})