var renderStats, mainscreen, mainlayer, Game, canvas, morph, morph2, abadi, small, spr1, spr2, xpos = 10, ypos = 10

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

        //some morph object
        morph = new CG.Morph('sinus', 0.25, 1, 3)
        mainlayer.addElement(morph)
        morph2 = new CG.Morph('sinus', 1, 1000, 1)
        mainlayer.addElement(morph2)

        //sprite 1
        spr1 = new CG.Sprite(this.asset.getImageByName('glowball'), new CG.Point(100, 200))
        spr1.name = 'spr1'
        spr1.xscale = 3
        spr1.yscale = 3
        mainlayer.addElement(spr1)

        //sprite 2
        spr2 = new CG.Sprite(this.asset.getImageByName('glowball'), new CG.Point(400, 240))
        spr2.name = 'spr2'
        spr2.xscale = 2
        spr2.yscale = 2
        mainlayer.addElement(spr2)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        //use the screen and layer methods to get an objecz
        mainscreen.getLayerByName('mainlayer').getElementByName('spr1').alpha = morph.getVal()
        mainscreen.getLayerByName('mainlayer').getElementByName('spr1').xscale = morph.getVal()

        //or use an object stored via variable
        spr1.yscale = morph.getVal()
        spr2.rotation = morph2.getVal()

        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Morph class example.', xpos, ypos + 50)
        small.drawText('Morph on alpha and size.', spr1.position.x + 20, spr1.position.y + 20)
        small.drawText('Morph on rotation', spr2.position.x + 20, spr2.position.y + 20)
    }
})