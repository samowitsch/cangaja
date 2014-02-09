var renderStats,
    mainscreen,
    mainlayer,
    gamescreen,
    gamelayer,
    settingsscreen,
    settingslayer,
    abadi,
    small,
    hammer,
    canvas,
    mousex = 0,
    mousey = 0,
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
Game = (function () {
    var Game = {
        path: '',
        fps: 60,
        width: 640,
        height: 480,
        width2: 640 / 2,
        height2: 480 / 2,
        bound: new CG.Bound({x: 0, y: 0, width: 640, height: 480}).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {}, //new CG.MediaAsset(Game), //initialize media asset with background image
        director: new CG.Director(),
        renderer: new CG.CanvasRenderer(),
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.canvas = CG.canvas = document.getElementById("canvas")
            Game.ctx = CG.ctx = Game.canvas.getContext("2d")
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
                .addImage('media/img/back1.jpg', 'back1')
                .addImage('media/img/back2.jpg', 'back2')
                .addImage('media/img/back3.jpg', 'back3')
                //add image for texturepacker file
                .addImage('media/img/texturepacker.png', 'texturepacker')
                //add texturepacker file
                .addXml('media/img/texturepacker.xml', 'texturepacker-xml')
                //texturepacker json is also supported
                .addJson('media/img/texturepacker.json', 'texturepacker-json')


                .startPreLoad()
        },
        create: function () {
            //initialize Touch/Click handling with hammer.js
            Game.touchinit()


            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))
            //tp.loadXml(Game.asset.getXmlByName('texturepacker-xml'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())


            //create font objects
            abadi = new CG.Font().loadFont({font: Game.asset.getFontByName('abadi')})
            small = new CG.Font().loadFont({font: Game.asset.getFontByName('small')})

            //screens and layers
            mainscreen = new CG.Screen({name: 'mainscreen'})
            mainlayer = new CG.Layer({name: 'mainlayer'})

            gamescreen = new CG.Screen({name: 'gamescreen'})
            gamelayer = new CG.Layer({name: 'gamelayer'})

            settingsscreen = new CG.Screen({name: 'settingsscreen'})
            settingslayer = new CG.Layer({name: 'settingslayer'})

            //assign backgrounds to the different layers
            var back1 = new CG.Sprite({
                image: Game.asset.getImageByName('back1'),
                position: new CG.Point(Game.width2, Game.height2)
            })
            back1.name = 'back1'
            mainlayer.addElement(back1)

            var back2 = new CG.Sprite({
                image: Game.asset.getImageByName('back2'),
                position: new CG.Point(Game.width2, Game.height2)
            })
            back2.name = 'back2'
            gamelayer.addElement(back2)

            var back3 = new CG.Sprite({
                image: Game.asset.getImageByName('back3'),
                position: new CG.Point(Game.width2, Game.height2)
            })
            back3.name = 'back3'
            settingslayer.addElement(back3)

            //sprite 1
            var spr1 = new CG.Sprite({
                image: Game.asset.getImageByName('glowball-50'),
                position: new CG.Point(50, 100)
            })
            spr1.name = 'spr1'
            spr1.xspeed = 2
            spr1.yspeed = 2
            spr1.boundsMode = 'bounce'
            settingslayer.addElement(spr1)


            //Simple Button
            var back = new CG.Button({
                image: Game.asset.getImageByName('btn-back-color'),
                position: new CG.Point(Game.width2, 400),
                text: 'BACK TO MAIN SCREEN',
                font: small,
                callback: Callback.Back
            })
            back.name = 'back'

            gamelayer.addElement(back)
            settingslayer.addElement(back)


            //Buttons as Menu
            var menu = new CG.Menu({x: Game.width2, y: 200, margin: 10})
            var button1 = new CG.Button({
                image: Game.asset.getImageByName('btn-back-color'),
                position: new CG.Point(Game.width2, 100),
                text: '(SCALE)',
                font: small,
                callback: Callback.Scale
            })
            button1.name = '#mbutton 1#'
            menu.addButton(button1)

            var button2 = new CG.Button({
                image: Game.asset.getImageByName('btn-back-color'),
                position: new CG.Point(Game.width2, 100),
                text: '(FADE)',
                font: small,
                callback: Callback.Fade
            })
            button2.name = '#mbutton 2#'
            menu.addButton(button2)
            mainlayer.addElement(menu)

            var button3 = new CG.Button({
                image: Game.asset.getImageByName('btn-back-color'),
                position: new CG.Point(Game.width2, 100),
                text: '(SLIDE)',
                font: small,
                callback: Callback.Slide
            })
            button3.name = '#mbutton 3#'
            menu.addButton(button3)
            mainlayer.addElement(menu)


            //add screen and layers to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))
                .addScreen(gamescreen.addLayer(gamelayer))
                .addScreen(settingsscreen.addLayer(settingslayer))


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
        }
    }

    return Game
}())

var Callback = {
    Back: function () {
        Game.director.setDirection(CG.LEFT).nextScreen('mainscreen', 'slide', 50)
    },
    Scale: function () {
        Game.director.nextScreen('gamescreen', 'scale', 15)
    },
    Fade: function () {
        Game.director.nextScreen('settingsscreen', 'fade', 30)
    },
    Slide: function () {
        Game.director.setDirection(CG.RIGHT).nextScreen('settingsscreen', 'slide', 50)
    }
}