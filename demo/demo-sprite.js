var renderStats, mainscreen, mainlayer, canvas,
    abadi, small, xpos = 10, ypos = 10

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
        this.asset.addImage('media/font/small.png', 'small')
            .addFont('media/font/small.txt', 'small')
            .addImage('media/font/abadi_ez.png', 'abadi')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/img/glowball-50.png', 'glowball')
            .startPreLoad()
    },
    create: function () {
        //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
        abadi = new CG.Font().loadFont({font: Game.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: Game.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})

        //add screen to Director
        Game.director.addScreen(mainscreen.addLayer(mainlayer))

        //sprite 1
        spr1 = new CG.Sprite({
            name: 'spr1',
            image: Game.asset.getImageByName('glowball'),
            position: new CG.Point(50, 100)
        })
        mainlayer.addElement(spr1)

        //sprite 2
        spr2 = new CG.Sprite({
            name: 'spr2',
            image: Game.asset.getImageByName('glowball'),
            position: new CG.Point(200, 100),
            rotationspeed: 1
        })
        mainlayer.addElement(spr2)

        //sprite 3
        spr3 = new CG.Sprite({
            name: 'spr3',
            image: Game.asset.getImageByName('glowball'),
            position: new CG.Point(400, 100),
            alpha: 0.5,
            xscale: 0.5,
            yscale: 0.5
        })
        mainlayer.addElement(spr3)

        //sprite 4
        spr4 = new CG.Sprite({
            name: 'spr4',
            image: Game.asset.getImageByName('glowball'),
            position: new CG.Point(50, 200),
            xspeed: 2,
            boundsMode: 'bounce'
        })
        mainlayer.addElement(spr4)

        //sprite 5
        spr5 = new CG.Sprite({
            name: 'spr5',
            image: Game.asset.getImageByName('glowball'),
            position: new CG.Point(50, 300),
            xspeed: 2,
            boundsMode: 'slide'
        })
        mainlayer.addElement(spr5)

        //sprite 6
        spr6 = new CG.Sprite({
            name: 'spr6',
            image: Game.asset.getImageByName('glowball'),
            position: new CG.Point(50, 300),
            xspeed: 1,
            yspeed: 1,
            bound: new CG.Bound({
                x: 0,
                y: 400,
                width: 640,
                height: 80
            }),
            boundsMode: 'bounce'
        })
        mainlayer.addElement(spr6)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this._super()
    },
    update: function () {
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Sprite class example.', xpos, ypos + 50)
        small.drawText('SIMPLE SPRITE', spr1.position.x + 20, spr1.position.y + 20)
        small.drawText('SPRITE WITH ROTATION', spr2.position.x + 20, spr2.position.y + 20)
        small.drawText('ALPHA 0.5 / SCALE 0.5', spr3.position.x + 20, spr3.position.y + 20)
        small.drawText('MODE BOUNCE', spr4.position.x + 20, spr4.position.y + 20)
        small.drawText('MODE SLIDE', spr5.position.x + 20, spr5.position.y + 20)
        small.drawText('CUSTOM BOUND', spr6.position.x + 20, spr6.position.y + 20)
    }
})