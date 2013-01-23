var renderStats, updateStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup
var tp = new CG.TexturePacker()


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    Game.preload()
};

// the Game object
Game = (function () {
    var Game = {
        fps:60,
        width:640,
        height:480,
        width2:640 / 2,
        height2:480 / 2,
        bound:new CG.Bound(0, 0, 640, 480).setName('game'),
        b_canvas:false,
        b_ctx:false,
        asset:new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director:new CG.Director(),
        delta:new CG.Delta(60),
        preload:function () {
            //canvas for ouput
            canvas = document.getElementById("canvas")
            ctx = canvas.getContext("2d")

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
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())

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
                .setPLifetime(15)
                .setGravity(0)
                .initAsRectangle(Game.asset.getImageByName('splash'), Game.width, Game.height)
                .setProtation(0)
                //        .setEmitterPosition(new CG.Point(320,240))
                .activateFadeout()
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height + 20))
                .setName('sunny')
                .setParticleSpeed(2)
                .setGravity(0.02)
                .initAsLine(Game.asset.getImageByName('sonne-50'), Game.height, UP)
                .setProtation(2)
                //        .setEmitterPosition(new CG.Point(320,500))
                .activateFadeout()
            )


            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, -20))
                .setName('rainy')
                .setParticleSpeed(2)
                .setGravity(0.03)
                .initAsLine(Game.asset.getImageByName('raindrop'), Game.height, DOWN)
                //        .setEmitterPosition(new CG.Point(320,-20))
                .activateFadeout()
            )


            mainlayer.addElement(new CG.Emitter(new CG.Point(-25, Game.height2))
                .setName('glowy')
                .setGravity(0)
                .setParticleSpeed(2)
                .setProtation(1)
                .initAsLine(Game.asset.getImageByName('glowball-50'), 40, RIGHT)
                //        .setEmitterPosition(new CG.Point(-25,240))
                .activateFadeout()
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width + 15, Game.height2))
                .setName('bally')
                .setParticleSpeed(2)
                .setProtation(-1)
                .setGravity(0)
                .initAsLine(Game.asset.getImageByName('basketball-25'), 40, LEFT)
                //        .setEmitterPosition(new CG.Point(655,240))
                .activateFadeout()
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
                .setName('explodi-stars')
                .activateFadeout()
                .setProtation(2)
                .setGravity(0)
                .initAsExplosion(Game.asset.getImageByName('powerstar75'), -2, 2)
                //        .setEmitterPosition(new CG.Point(320, 240))
            )

            mainlayer.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
                .setName('smokey')
                .activateFadeout()
                .setGravity(-0.05)
                .initAsPoint(Game.asset.getImageByName('smoke50'))
                //        .setEmitterPosition(new CG.Point(320, 240))
            )


            mainlayer.addElement(new CG.Emitter(new CG.Point(160, 120))
                .setName('smokey')
                .setMaxParticles(100)
                .activateFadeout()
                .setGravity(0)
                .setProtation(5)
                .setParticleSpeed(1)
                .setPLifetime(10)
                .setCreationTime(10)
                .initAsCorona(Game.asset.getImageByName('littlestar'), 100)
                //        .setEmitterPosition(new CG.Point(160, 120))
            )


            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
            updateStats = new Stats()
            document.body.appendChild(updateStats.domElement)

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
            updateStats.update()
            //update here what ever you want
            Game.director.update()
        },
        draw:function () {
            ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.draw('cangaja - Canvas Game JavaScript FW', xpos, ypos)

            small.draw('Particle/Emitter class example.', xpos, ypos + 50)


            //            small.draw('SIMPLE SPRITE', spr1.position.x + 20, spr1.position.y + 20)
            //            small.draw('SPRITE WITH ROTATION', spr2.position.x + 20, spr2.position.y + 20)
            //            small.draw('ALPHA 0.5 / SCALE 0.5', spr3.position.x + 20, spr3.position.y + 20)
            //            small.draw('MODE BOUNCE', spr4.position.x + 20, spr4.position.y + 20)
            //            small.draw('MODE SLIDE', spr5.position.x + 20, spr5.position.y + 20)
            //            small.draw('CUSTOM BOUND', spr6.position.x + 20, spr6.position.y + 20)

            ctx.drawImage(Game.b_canvas, 0, 0)
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