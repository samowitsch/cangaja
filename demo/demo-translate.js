var renderStats, mainscreen, mainlayer, Game, abadi, small, canvas, xpos = 10, ypos = 10, spr1, spr2, sequence, translate

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

        //sprite 1
        spr1 = new CG.Sprite({
            image: this.asset.getImageByName('glowball'),
            position: new CG.Point(50, 100)
        })
        spr1.name = 'spr1'
        mainlayer.addElement(spr1)


        //sequence for sprite 1
        sequence = new CG.Sequence()
        sequence.loop = true
        sequence.addTranslation(
                new CG.Translate().initBezier({
                    object: mainlayer.getElementByName('spr1'),
                    steps: 200,
                    startPoint: new CG.Point(500, 450),
                    endPoint: new CG.Point(100, 100),
                    control1: new CG.Point(-600, 600),
                    control2: new CG.Point(1200, -300)}))
            .addTranslation(
                new CG.Translate().initTween({
                    object: mainlayer.getElementByName('spr1'),
                    steps: 200,
                    startPoint: new CG.Point(100, 100),
                    endPoint: new CG.Point(550, 150)
                }))
            .addTranslation(
                new CG.Translate().initTween({
                    object: mainlayer.getElementByName('spr1'),
                    steps: 150,
                    startPoint: new CG.Point(550, 150),
                    endPoint: new CG.Point(100, 400)
                }))
            .addTranslation(
                new CG.Translate().initTween({
                    object: mainlayer.getElementByName('spr1'),
                    steps: 100,
                    startPoint: new CG.Point(100, 400),
                    endPoint: new CG.Point(550, 450)
                })
            )
        mainlayer.addElement(sequence)

        //sprite 2
        spr2 = new CG.Sprite({
            image: this.asset.getImageByName('glowball'),
            position: new CG.Point(50, 100)
        })
        spr2.name = 'spr2'
        mainlayer.addElement(spr2)

        //translate fro sprite 2
        translate = new CG.Translate().initTween({
            object: mainlayer.getElementByName('spr2'),
            steps: 150,
            startPoint: new CG.Point(550, 150),
            endPoint: new CG.Point(100, 400)
        })
        mainlayer.addElement(translate)

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
        small.drawText('Tranlation/Sequence class example.', xpos, ypos + 50)
        small.drawText('SEQUENCE with Loop', spr1.position.x - 60, spr1.position.y + 20)
        small.drawText('single TRANSLATE', spr2.position.x - 60, spr2.position.y + 20)
    }
})
