var renderStats

var mainscreen, mainlayer

var mousedown = false
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
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())


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
            hammer.ontap = function (ev) {
                CG.mousedown = true
                CG.mouse.x = ev.position[0].x - canvas.offsetLeft //correct ontap value x
                CG.mouse.y = ev.position[0].y - canvas.offsetTop  //correct ontap value y
            };
            hammer.ondragstart = function (ev) {
            };
            hammer.ondrag = function (ev) {
                CG.mouse.x = ev.position.x
                CG.mouse.y = ev.position.y


                //log = document.getElementById('log')
                //log.innerHTML = 'x: ' + mousex + "   y: " + mousey + '  back[' + layerback.elements.length + '] ' + '  middle[' + layermiddle.elements.length + '] ' + '  front[' + layerfront.elements.length + '] '

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

function buttonCallback(obj) {
    alert('Clicked button')
    console.log(['clicked & execute callback', obj])
}
