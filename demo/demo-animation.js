var renderStats, mainscreen, mainlayer, canvas, abadi, small, Game, xpos = 10, ypos = 10, anim1, anim2, anim3, anim4, anim5, anim6;

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
        Game.director.addScreen(mainscreen.addLayer(mainlayer))

        //animation 1
        anim1 = new CG.Animation({
            name: 'anim1',
            image: this.asset.getImageByName('hunter'),
            position: new CG.Point(50, 100),
            startFrame: 8,
            endFrame: 14,
            width: 56,
            height: 64,
            delay: 6
        })
        mainlayer.addElement(anim1)

        //animation 2
        anim2 = new CG.Animation({
            name: 'anim2',
            image: this.asset.getImageByName('hunter'),
            position: new CG.Point(200, 100),
            startFrame: 8,
            endFrame: 14,
            width: 56,
            height: 64,
            delay: 6,
            rotationspeed: 1
        })
        mainlayer.addElement(anim2)

        //animation 3
        anim3 = new CG.Animation({
            name: 'anim3',
            image: this.asset.getImageByName('hunter'),
            position: new CG.Point(400, 100),
            startFrame: 8,
            endFrame: 14,
            width: 56,
            height: 64,
            delay: 6,
            alpha: 0.5,
            xscale: 0.5,
            yscale: 0.5
        })
        mainlayer.addElement(anim3)

        //animation 4
        anim4 = new CG.Animation({
            name: 'anim4',
            image: this.asset.getImageByName('hunter'),
            position: new CG.Point(50, 200),
            startFrame: 8,
            endFrame: 14,
            width: 56,
            height: 64,
            delay: 6,
            xspeed: -2,
            boundsMode: 'bounce'
        })
        mainlayer.addElement(anim4)

        //animation 5
        anim5 = new CG.Animation({
            name: 'anim5',
            image: this.asset.getImageByName('hunter'),
            position: new CG.Point(50, 300),
            startFrame: 8,
            endFrame: 14,
            width: 56,
            height: 64,
            delay: 6,
            xspeed: -2,
            boundsMode: 'slide'
        })
        mainlayer.addElement(anim5)

        //animation 6
        anim6 = new CG.Animation({
            name: 'anim6',
            image: this.asset.getImageByName('hunter'),
            position: new CG.Point(50, 300),
            startFrame: 8,
            endFrame: 14,
            width: 56,
            height: 64,
            delay: 6,
            xspeed: -1,
            yspeed: 1,
            boundsMode: 'bounce',
            bound: new CG.Bound({
                x: 0,
                y: 300,
                width: 640,
                height: 180
            })
        })
        mainlayer.addElement(anim6)

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
        small.drawText('Animation class example.', xpos, ypos + 50)
        small.drawText('SIMPLE ANIMATION', anim1.position.x + 20, anim1.position.y + 20)
        small.drawText('ANIMATION WITH ROTATION', anim2.position.x + 20, anim2.position.y + 20)
        small.drawText('ALPHA 0.5 / SCALE 0.5', anim3.position.x + 20, anim3.position.y + 20)
        small.drawText('MODE BOUNCE', anim4.position.x + 20, anim4.position.y + 20)
        small.drawText('MODE SLIDE', anim5.position.x + 20, anim5.position.y + 20)
        small.drawText('CUSTOM BOUND', anim6.position.x + 20, anim6.position.y + 20)
    }
})