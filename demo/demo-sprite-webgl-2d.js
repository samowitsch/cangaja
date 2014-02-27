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
        bound: new CG.Bound({x: 0, y: 0, width: 640, height: 480}),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {},
        director: new CG.Director(),
        renderer: new CG.CanvasRenderer(),
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.canvas = Game.b_canvas = document.getElementById("canvas")
            WebGL2D.enable(Game.b_canvas)
            Game.ctx = Game.b_ctx = Game.b_canvas.getContext("webgl-2d")

            //Asset preloading font files
            Game.asset = new CG.MediaAsset(Game)
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
                rotationspeed: 1,
                name: 'spr2',
                image: Game.asset.getImageByName('glowball'),
                position: new CG.Point(200, 100)})
            mainlayer.addElement(spr2)


            //sprite 3
            spr3 = new CG.Sprite({
                image: Game.asset.getImageByName('glowball'),
                position: new CG.Point(400, 100),
                alpha: 0.5,
                xscale: 0.5,
                yscale: 0.5,
                name: 'spr3'
            })
            mainlayer.addElement(spr3)

            //sprite 4
            spr4 = new CG.Sprite({
                name: 'spr4',
                xspeed: 2,
                boundsMode: 'bounce',
                image: Game.asset.getImageByName('glowball'),
                position: new CG.Point(50, 200)
            })
            mainlayer.addElement(spr4)

            //sprite 5
            spr5 = new CG.Sprite({
                xspeed: 2,
                boundsMode: 'slide',
                name: 'spr5',
                image: Game.asset.getImageByName('glowball'),
                position: new CG.Point(50, 300)
            })
            mainlayer.addElement(spr5)

            //sprite 6
            spr6 = new CG.Sprite({
                image: Game.asset.getImageByName('glowball'),
                position: new CG.Point(50, 300),
                xspeed: 1,
                yspeed: 1,
                bound: new CG.Bound({x: 0, y: 400, width: 640, height: 80}),
                boundsMode: 'bounce',
                name: 'spr6'
            })

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

            small.drawText('Sprite class example. (WebGL-2D test)', xpos, ypos + 50)

            small.drawText('SIMPLE SPRITE', spr1.position.x + 20, spr1.position.y + 20)
            small.drawText('SPRITE WITH ROTATION', spr2.position.x + 20, spr2.position.y + 20)
            small.drawText('ALPHA 0.5 / SCALE 0.5', spr3.position.x + 20, spr3.position.y + 20)
            small.drawText('MODE BOUNCE', spr4.position.x + 20, spr4.position.y + 20)
            small.drawText('MODE SLIDE', spr5.position.x + 20, spr5.position.y + 20)
            small.drawText('CUSTOM BOUND', spr6.position.x + 20, spr6.position.y + 20)

            renderStats.update();
        },
        touchinit: function () {
        },
        touchhandler: function () {
        }
    }

    return Game
}())