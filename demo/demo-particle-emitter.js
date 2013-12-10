var renderStats, mainscreen, mainlayer, smokey, canvas, Game, abadi, small, smokey, mousex = 0, mousey = 0, mousedown = false, tp = new CG.AtlasTexturePacker(), xpos = 10, ypos = 10

window.onload = function () {
    canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    canvas.addEventListener("mousedown", function (e) {
        mousedown = true;
    }, true);

    canvas.addEventListener("mouseup", function () {
        mousedown = false;
    }, true);

    canvas.addEventListener('mousemove', function (evt) {
        var rect = canvas.getBoundingClientRect(), root = document.documentElement;
        mousex = evt.clientX - canvas.offsetLeft;
        mousey = evt.clientY - canvas.offsetTop;
    }, false);

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

        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))
        small = new CG.Font().loadFont(this.asset.getFontByName('small'))

        //screen and layer
        mainscreen = new CG.Screen('mainscreen')
        mainlayer = new CG.Layer('mainlayer')

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        mainlayer.addElement(new CG.Emitter(new CG.Point(this.width2, this.height2))
            .setName('splashi')
            .setParticleSpeed(0)
            .setPLifetime(40)
            .setMaxParticles(100)
            .setGravity(0)
            .setCreationTime(1)
            .initAsRectangle(this.asset.getImageByName('splash'), this.width, this.height)
            .setProtation(0)
            .activateFadeout()
        )

        mainlayer.addElement(new CG.Emitter(new CG.Point(this.width2, this.height + 20))
            .setName('sunny')
            .setParticleSpeed(2)
            .setMaxParticles(100)
            .setGravity(0.02)
            .initAsLine(this.asset.getImageByName('sonne-50'), this.height, CG.UP)
            .setProtation(2)
            .activateFadeout()
        )

        mainlayer.addElement(new CG.Emitter(new CG.Point(this.width2, -20))
            .setName('rainy')
            .setParticleSpeed(2)
            .setMaxParticles(100)
            .setGravity(0.03)
            .setCreationTime(1)
            .initAsLine(this.asset.getImageByName('raindrop'), this.height, CG.DOWN)
            .activateFadeout()
        )

        mainlayer.addElement(new CG.Emitter(new CG.Point(-25, this.height2))
            .setName('glowy')
            .setGravity(0)
            .setParticleSpeed(2)
            .setMaxParticles(100)
            .setCreationTime(1)
            .setProtation(2)
            .initAsLine(this.asset.getImageByName('glowball-50'), 40, CG.RIGHT)
            .activateFadeout()
        )

        mainlayer.addElement(new CG.Emitter(new CG.Point(this.width + 15, this.height2))
            .setName('bally')
            .setParticleSpeed(2)
            .setMaxParticles(100)
            .setProtation(-1)
            .setCreationTime(1)
            .setGravity(0)
            .initAsLine(this.asset.getImageByName('basketball-25'), 40, CG.LEFT)
            .activateFadeout()
        )

        mainlayer.addElement(new CG.Emitter(new CG.Point(this.width2, this.height2))
            .setName('explodi-stars')
            .activateFadeout()
            .setMaxParticles(100)
            .setProtation(2)
            .setGravity(0)
            .initAsExplosion(this.asset.getImageByName('powerstar75'), -2, 2)
        )

        smokey = new CG.Emitter(new CG.Point(this.width2, this.height2))
            .setName('smokey')
            .activateFadeout()
            .setMaxParticles(100)
            .setCreationTime(1)
            .setGravity(-0.05)
            .initAsPoint(this.asset.getImageByName('smoke50'))

        mainlayer.addElement(smokey)

        mainlayer.addElement(new CG.Emitter(new CG.Point(160, 120))
            .setName('smokey')
            .setMaxParticles(100)
            .activateFadeout()
            .setGravity(0.25)
            .setProtation(5)
            .setParticleSpeed(0.5)
            .setPLifetime(50)
            .setCreationTime(1)
            .initAsCorona(this.asset.getImageByName('littlestar'), 100)
        )

        renderStats = new Stats()

        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        smokey.position._x = mousex
        smokey.position._y = mousey
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Particle/Emitter class example.', xpos, ypos + 50)
    }
})