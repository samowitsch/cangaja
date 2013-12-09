var renderStats

var mainscreen, mainlayer, smokey

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup
var tp = new CG.AtlasTexturePacker()


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    can.addEventListener("mousedown", function (e) {
        mousedown = true;
    }, true);

    can.addEventListener("mouseup", function () {
        mousedown = false;
    }, true);

    can.addEventListener('mousemove', function (evt) {
        var rect = can.getBoundingClientRect(), root = document.documentElement;
        mousex = evt.clientX - canvas.offsetLeft;
        mousey = evt.clientY - canvas.offsetTop;
    }, false);

    Game.preload()
};

// the Game object
Game = (function () {
    var Game = {
        path: '',
        fps:60,
        width:640,
        height:480,
        width2:640 / 2,
        height2:480 / 2,
        bound:new CG.Bound(0, 0, 640, 480).setName('game'),
        canvas:{},
        ctx:{},
        b_canvas:{},
        b_ctx:{},
        asset:{}, //new CG.MediaAsset(Game), //initialize media asset with background image
        director:new CG.Director(),
        renderer: new CG.CanvasRenderer(),
        delta:new CG.Delta(60),
        preload:function () {
            //canvas for ouput
            Game.canvas = document.getElementById("canvas")
            Game.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset(Game)

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont('media/font/small.txt', 'small', 'small')
                .addFont('media/font/abadi_ez.txt', 'abadi')
                .addImage('media/img/glowball-50.png', 'glowball')
                //texturepacker
                .addImage('media/img/texturepacker.png', 'texturepacker')
                .addJson('media/img/texturepacker.json', 'texturepacker-json')

                .startPreLoad()
        },
        create:function () {

            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))


            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
                .setName('splashi')
                .setParticleSpeed(0)
                .setPLifetime(40)
                .setMaxParticles(100)
                .setGravity(0)
                .setCreationTime(1)
                .initAsRectangle(Game.asset.getImageByName('splash'), Game.width, Game.height)
                .setProtation(0)
                //        .setEmitterPosition(new CG.Point(320,240))
                .activateFadeout()
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height + 20))
                .setName('sunny')
                .setParticleSpeed(2)
                .setMaxParticles(100)
                .setGravity(0.02)
                .initAsLine(Game.asset.getImageByName('sonne-50'), Game.height, CG.UP)
                .setProtation(2)
                //        .setEmitterPosition(new CG.Point(320,500))
                .activateFadeout()
            )


            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, -20))
                .setName('rainy')
                .setParticleSpeed(2)
                .setMaxParticles(100)
                .setGravity(0.03)
                .setCreationTime(1)
                .initAsLine(Game.asset.getImageByName('raindrop'), Game.height, CG.DOWN)
                //        .setEmitterPosition(new CG.Point(320,-20))
                .activateFadeout()
            )


            mainlayer.addElement(new CG.Emitter(new CG.Point(-25, Game.height2))
                .setName('glowy')
                .setGravity(0)
                .setParticleSpeed(2)
                .setMaxParticles(100)
                .setCreationTime(1)
                .setProtation(2)
                .initAsLine(Game.asset.getImageByName('glowball-50'), 40, CG.RIGHT)
                //        .setEmitterPosition(new CG.Point(-25,240))
                .activateFadeout()
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width + 15, Game.height2))
                .setName('bally')
                .setParticleSpeed(2)
                .setMaxParticles(100)
                .setProtation(-1)
                .setCreationTime(1)
                .setGravity(0)
                .initAsLine(Game.asset.getImageByName('basketball-25'), 40, CG.LEFT)
                //        .setEmitterPosition(new CG.Point(655,240))
                .activateFadeout()
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
                .setName('explodi-stars')
                .activateFadeout()
                .setMaxParticles(100)
                .setProtation(2)
                .setGravity(0)
                .initAsExplosion(Game.asset.getImageByName('powerstar75'), -2, 2)
                //        .setEmitterPosition(new CG.Point(320, 240))
            )

            smokey = new CG.Emitter(new CG.Point(Game.width2, Game.height2))
                .setName('smokey')
                .activateFadeout()
                .setMaxParticles(100)
                .setCreationTime(1)
                .setGravity(-0.05)
                .initAsPoint(Game.asset.getImageByName('smoke50'))

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
                .initAsCorona(Game.asset.getImageByName('littlestar'), 100)
                //        .setEmitterPosition(new CG.Point(160, 120))
            )


            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            Game.loop()
        },
        loop:function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.run();
            }
        },
        run:function () {
            Game.update()
            Game.draw()
        },
        update:function () {
            //update here what ever you want

            smokey.position._x = mousex
            smokey.position._y = mousey
            Game.director.update()
        },
        draw:function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)

            small.drawText('Particle/Emitter class example.', xpos, ypos + 50)

            Game.ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit:function () {
        },
        touchhandler:function () {
        }
    }

    return Game
}())