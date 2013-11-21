var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup


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
        path: '',
        fps: 60,
        width: 640,
        height: 480,
        width2: 640 / 2,
        height2: 480 / 2,
        bound: new CG.Bound(0, 0, 640, 480).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: new CG.MediaAsset(),
        director: new CG.Director(),
        renderer: new CG.CanvasRenderer(),
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.b_canvas = document.getElementById("canvas")
            WebGL2D.enable(Game.b_canvas)
            Game.b_ctx = Game.b_canvas.getContext("webgl-2d")

            //Asset preloading font files
            Game.asset

                .addImage('media/font/small.png', 'small')
                .addFont('media/font/small.txt', 'small')

                .addImage('media/font/abadi_ez.png', 'abadi')
                .addFont('media/font/abadi_ez.txt', 'abadi')

                .addImage('media/img/glowball-50.png', 'glowball')

                .startPreLoad()
        },
        create: function () {

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            //sprite 1
            spr1 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(50, 100))
            spr1.name = 'spr1'
            mainlayer.addElement(spr1)

            //sprite 2
            spr2 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(200, 100))
            spr2.rotationspeed = 1
            spr2.name = 'spr2'
            mainlayer.addElement(spr2)


            //sprite 3
            spr3 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(400, 100))
            spr3.alpha = 0.5
            spr3.xscale = 0.5
            spr3.yscale = 0.5
            spr3.name = 'spr3'
            mainlayer.addElement(spr3)

            //sprite 4
            spr4 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(50, 200))
            spr4.xspeed = 2
            spr4.boundsMode = 'bounce'
            spr4.name = 'spr4'
            mainlayer.addElement(spr4)

            //sprite 5
            spr5 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(50, 300))
            spr5.xspeed = 2
            spr5.boundsMode = 'slide'
            spr5.name = 'spr5'
            mainlayer.addElement(spr5)

            //sprite 6
            spr6 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(50, 300))
            spr6.xspeed = 1
            spr6.yspeed = 1
            spr6.bound = new CG.Bound(0, 400, 640, 80)
            spr6.boundsMode = 'bounce'
            spr6.name = 'spr6'
            mainlayer.addElement(spr6)


            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            Game.loop()
        },
        loop: function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.run();
            }
        },
        run: function () {
            Game.update()
            Game.draw()
        },
        update: function () {
            //update here what ever you want
            Game.director.update()
        },
        draw: function () {
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)

            small.drawText('Sprite class example.', xpos, ypos + 50)


            small.drawText('SIMPLE SPRITE', spr1.position.x + 20, spr1.position.y + 20)
            small.drawText('SPRITE WITH ROTATION', spr2.position.x + 20, spr2.position.y + 20)
            small.drawText('ALPHA 0.5 / SCALE 0.5', spr3.position.x + 20, spr3.position.y + 20)
            small.drawText('MODE BOUNCE', spr4.position.x + 20, spr4.position.y + 20)
            small.drawText('MODE SLIDE', spr5.position.x + 20, spr5.position.y + 20)
            small.drawText('CUSTOM BOUND', spr6.position.x + 20, spr6.position.y + 20)

//            Game.ctx.drawImage(Game.b_canvas, 0, 0)
//            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit: function () {
        },
        touchhandler: function () {
        }
    }

    return Game
}())