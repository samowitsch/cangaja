var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
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
        path: '../',
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
        asset: {}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director: new CG.Director(),
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.canvas = CG.canvas = document.getElementById("canvas")
            Game.ctx = CG.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset(Game.path + 'media/img/splash3.jpg', Game.ctx)

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont(Game.path + 'media/font/small.txt', 'small', 'small')
                //add glyphdesigner file
                .addFont(Game.path + 'media/font/abadi_ez.txt', 'abadi')
                //add single image
                .addImage(Game.path + 'media/img/glowball-50.png', 'glowball')
                .addImage(Game.path + 'media/img/back1.jpg', 'back1')
                .addImage(Game.path + 'media/img/back2.jpg', 'back2')
                .addImage(Game.path + 'media/img/back3.jpg', 'back3')
                //add image for texturepacker file
                .addImage(Game.path + 'media/img/texturepacker.png', 'texturepacker')
                //add texturepacker file
                .addXml(Game.path + 'media/img/texturepacker.xml', 'texturepacker-xml')
                //texturepacker json is also supported
                .addJson(Game.path + 'media/img/texturepacker.json', 'texturepacker-json')


                .startPreLoad()
        },
        create: function () {
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

            //screens and layers
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            gamescreen = new CG.Screen('gamescreen')
            gamelayer = new CG.Layer('gamelayer')

            settingsscreen = new CG.Screen('settingsscreen')
            settingslayer = new CG.Layer('settingslayer')

            //assign backgrounds to the different layers
            back1 = new CG.Sprite(Game.asset.getImageByName('back1'), new CG.Point(320, 240))
            back1.name = 'back1'
            mainlayer.addElement(back1)

            back2 = new CG.Sprite(Game.asset.getImageByName('back2'), new CG.Point(320, 240))
            back2.name = 'back2'
            gamelayer.addElement(back2)

            back3 = new CG.Sprite(Game.asset.getImageByName('back3'), new CG.Point(320, 240))
            back3.name = 'back3'
            settingslayer.addElement(back3)

            //sprite 1
            spr1 = new CG.Sprite(Game.asset.getImageByName('glowball-50'), new CG.Point(50, 100))
            spr1.name = 'spr1'
            spr1.xspeed = 2
            spr1.yspeed = 2
            spr1.boundsMode = 'bounce'
            settingslayer.addElement(spr1)


            //add screen and layers to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))
                .addScreen(gamescreen.addLayer(gamelayer))
                .addScreen(settingsscreen.addLayer(settingslayer))

            //Simple Button
            back = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 400), 'BACK TO MAIN SCREEN', small, function () {
                Game.director.nextScreen('mainscreen', 'fade', 10)
            })
            back.name = 'back'

            gamelayer.addElement(back)
            settingslayer.addElement(back)


            //Buttons as Menu
            menu = new CG.Menu(Game.width2, 200, 10)
            button1 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), '(SCALE)', small, function () {
                Game.director.nextScreen('gamescreen', 'scale', 15)
            })
            button1.name = '#mbutton 1#'
            menu.addButton(button1)

            button2 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), '(FADE)', small, function () {
                Game.director.nextScreen('settingsscreen', 'fade', 30)
            })
            button2.name = '#mbutton 2#'
            menu.addButton(button2)
            mainlayer.addElement(menu)

            button3 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), '(SLIDE)', small, function () {
                Game.director.setDirection(CG.RIGHT).nextScreen('settingsscreen', 'slide', 100)
            })
            button3.name = '#mbutton 3#'
            menu.addButton(button3)
            mainlayer.addElement(menu)


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
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.drawText('Layer/Screen class example shows how to switch between screens.', xpos, ypos + 50)
            small.drawText('Possible transition modes for now are fade and scale.', xpos, ypos + 50 + small.getLineHeight())

            Game.ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit: function () {
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
        touchhandler: function () {
        }
    }

    return Game
}())