var renderStats, updateStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup

var hammer
var bm


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    //mouse move
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
                .addImage('media/img/back3.jpg', 'cover')
                .addImage('media/img/back2.jpg', 'back')
                .addImage('media/img/crosshair.png', 'crosshair')

                .startPreLoad()
        },
        create:function () {

            // font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            //sprite for the background
            back = new CG.Sprite(Game.asset.getImageByName('back'), new CG.Point(Game.width2, Game.height2))
            back.name = 'back'
            mainlayer.addElement(back)

            //a bitmap that hides the background sprite
            bitmap = new CG.Bitmap(Game.width, Game.height)
            bitmap.loadImage(Game.asset.getImageByName('cover'))
            mainlayer.addElement(bitmap)

            //do something with the bitmap
            bitmap.clearCircle(100, 150, 50)
            bitmap.clearRect(480, 120, 100, 100)

            //a crosshair that follows the mouse pointer
            crosshair = new CG.Sprite(Game.asset.getImageByName('crosshair'), new CG.Point(Game.width2, Game.height2))
            crosshair.name = 'crosshair'
            mainlayer.addElement(crosshair)


            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
            updateStats = new Stats()
            document.body.appendChild(updateStats.domElement)


            //initialize hammer ;o)
            Game.touchinit()

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


            crosshair.position.x = mousex
            crosshair.position.y = mousey

            Game.director.update()
        },
        draw:function () {
            ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.draw('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.draw('Bitmap class example. Feel free to click ;o)', xpos, ypos + 50)
            small.draw('Bitmap.clearCircle()', 30, 210)
            small.draw('Bitmap.clearRect()', 480, 100)

            ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit:function () {
            hammer = new Hammer(canvas);
            hammer.ontap = function (ev) {
                mousedown = true
                mousex = ev.position[0].x - canvas.offsetLeft //correct ontap value x
                mousey = ev.position[0].y - canvas.offsetTop  //correct ontap value y
                clicked()
            };
            hammer.ondragstart = function (ev) {
            };
            hammer.ondrag = function (ev) {
                mousex = ev.position.x
                mousey = ev.position.y
            };
            hammer.ondragend = function (ev) {
            };
            hammer.onswipe = function (ev) {
            };

            hammer.ondoubletap = function (ev) {
            };
            hammer.onhold = function (ev) {
            };

            hammer.ontransformstart = function (ev) {
            };
            hammer.ontransform = function (ev) {
            };
            hammer.ontransformend = function (ev) {
            };

            hammer.onrelease = function (ev) {

            };
        },
        touchhandler:function () {
        }
    }

    return Game
}())

function clicked() {
    if (mousex > Game.width2) {
        bitmap.clearRect(mousex - 30, mousey - 30, 60, 60)
    } else {
        bitmap.clearCircle(mousex, mousey, 30)
    }
}