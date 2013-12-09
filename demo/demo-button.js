'use strict';

var renderStats,
    mainscreen,
    mainlayer,
    canvas,
    hammer,
    abadi,
    small,
    button,
    menu,
    mousedown = false,
    tp = new CG.AtlasTexturePacker();


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game.preload()
};

// the Game object
//Game = (function () {
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
                //add glyphdesigner file
                .addFont('media/font/abadi_ez.txt', 'abadi')
                //add single image
                .addImage('media/img/glowball-50.png', 'glowball')
                //add image for texturepacker file
                .addImage('media/img/texturepacker.png', 'texturepacker')
                //add texturepacker file
                .addXml('media/img/texturepacker.xml', 'texturepacker-xml')
                //texturepacker json is also supported
                .addJson('media/img/texturepacker.json', 'texturepacker-json')


                .startPreLoad()
        },
        create:function () {
            //initialize Touch/Click handling with hammer.js
            Game.touchinit()


            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))
            //tp.loadXml(Game.asset.getXmlByName('texturepacker-xml'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())


            //create font objects
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            //Simple Button
            button = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), 'Button', small, buttonCallback)
            button.name = 'button'
            mainlayer.addElement(button)


            //Buttons as Menu
            menu = new CG.Menu(Game.width2, 200, 10)
            button = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), 'Menu Button 1', small, buttonCallback)
            button.name = '#mbutton 1#'
            menu.addButton(button)
            button = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), 'Menu Button 2', small, buttonCallback)
            button.name = '#mbutton 2#'
            menu.addButton(button)
            button = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), 'Menu Button 3', small, buttonCallback)
            button.name = '#mbutton 3#'
            menu.addButton(button)
            mainlayer.addElement(menu)


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
            Game.director.update()
        },
        draw:function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            //draw all elements that the director has
            Game.director.draw()

            //text stuff
            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.drawText('Button/Menu class example with callback and input handling.', xpos, ypos + 50)

            // draw Game.b_canvas to the canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit:function () {
            hammer = new Hammer(canvas);
            hammer.on('tap', function (ev) {
                CG.mousedown = true
                CG.mouse.x = ev.gesture.center.pageX - canvas.offsetLeft; //correct ontap value x
                CG.mouse.y = ev.gesture.center.pageY - canvas.offsetTop;  //correct ontap value y
            })
            hammer.on('dragstart', function (ev) {
            })
            hammer.on('drag', function (ev) {
                CG.mouse.x = ev.gesture.center.pageX;
                CG.mouse.y = ev.gesture.center.pageY;
            })
            hammer.on('dragend', function (ev) {
            })
            hammer.on('swipe', function (ev) {
            })

            hammer.on('doubletap', function (ev) {
            })
            hammer.on('hold', function (ev) {
            })

            hammer.on('transformstart', function (ev) {
            })
            hammer.on('transform', function (ev) {
            })
            hammer.on('transformend', function (ev) {
            })
            hammer.on('release', function (ev) {

            })
        },
        touchhandler:function () {
        }
    }

//    return Game
//}())

function buttonCallback(obj) {
    console.log('clicked & execute callback', obj)
}
