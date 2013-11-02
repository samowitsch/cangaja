var renderStats

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
        clock: new Clock(60),
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
        asset:{}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director:new CG.Director(),
        renderer: new CG.CanvasRenderer(),
        delta:new CG.Delta(60),
        preload:function () {
            //canvas for ouput
            Game.canvas = document.getElementById("canvas")
            Game.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset('media/img/splash3.jpg', Game.ctx)

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont('media/font/small.txt', 'small', 'small')
                .addFont('media/font/heiti.txt', 'heiti')
                .addFont('media/font/gill.txt', 'gill')
                .addFont('media/font/abadi_ez.txt', 'abadi')
                .startPreLoad()
        },
        create:function () {

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            heiti = new CG.Font().loadFont(Game.asset.getFontByName('heiti'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            gill = new CG.Font().loadFont(Game.asset.getFontByName('gill'))

            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            Game.loop()
        },
        loop:function () {
            Game.clock.tick()
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
        },
        draw:function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.drawText('This is a little font class demo!', xpos, ypos + 50)
            small.drawText('With different fonts generated with Glyphdesigner.', xpos, ypos + 120)
            small.drawText('It has only some basic features at the moment.', xpos, ypos + 120 + small.getLineHeight())
            gill.drawText('äöüß?áà', xpos, ypos + 180)
            gill.drawText('ÄÖÜ~§$%&', xpos, ypos + 180 + gill.getLineHeight())


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