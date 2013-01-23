var renderStats, updateStats

var mainscreen,mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()


//waiting to get started ;o)
window.onload = function() {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    Game.preload()
};

// the Game object
Game = (function(){
    var Game = {
        fps: 60,
        width: 640,
        height: 480,
        width2: 640 / 2,
        height2: 480 / 2,
        bound: new CG.Bound(0,0,640,480).setName('game'),
        b_canvas: false,
        b_ctx: false,
        asset: new CG.MediaAsset('media/img/splash3.jpg'),     //initialize media asset with background image
        director: new CG.Director(),
        delta: new CG.Delta(60),
        preload: function(){
            //canvas for ouput
            canvas = document.getElementById("canvas")
            ctx = canvas.getContext("2d")

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont('media/font/small.txt','small','small')
            //add glyphdesigner file
            .addFont('media/font/abadi_ez.txt','abadi')
            //add single image
            .addImage('media/img/glowball-50.png','glowball')
            .addImage('media/img/back1.jpg','back1')
            .addImage('media/img/back2.jpg','back2')
            .addImage('media/img/back3.jpg','back3')
            //add image for texturepacker file
            .addImage('media/img/texturepacker.png','texturepacker')
            //add texturepacker file
            .addXml('media/img/texturepacker.xml','texturepacker-xml')
            //texturepacker json is also supported
            .addJson('media/img/texturepacker.json','texturepacker-json')


            .startPreLoad()
        },
        create: function() {
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

            //define the director fademode
            .setFadeMode('scale')

            //Simple Button
            back = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 300), 'BACK TO MAIN SCREEN', small, backToMainCallback)
            back.name = 'back'
            gamelayer.addElement(back)
            settingslayer.addElement(back)


            //Buttons as Menu
            menu = new CG.Menu(Game.width2, 200, 10)
            button = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), 'GOTO GAME SCREEN', small, gameCallback)
            button.name = '#mbutton 1#'
            menu.addButton(button)
            button = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, 100), 'GOTO SETTINGS SCREEN', small, settingsCallback)
            button.name = '#mbutton 2#'
            menu.addButton(button)
            mainlayer.addElement(menu)




            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
            updateStats = new Stats()
            document.body.appendChild(updateStats.domElement)

            Game.loop()
        },
        loop: function(){
            requestAnimationFrame(Game.loop);
            if(Game.asset.ready==true){
                Game.run();
            }
        },
        run: function() {
            Game.update()
            Game.draw()
        },
        update: function() {
            updateStats.update()
            //update here what ever you want
            Game.director.update()
        },
        draw: function() {
            ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.draw('cangaja - Canvas Game JavaScript FW', xpos, ypos)

            small.draw('Layer/Screen class example shows how to switch between screens.', xpos, ypos + 50)
            small.draw('Possible transition modes for now are fade and scale.', xpos, ypos + 50 + small.getLineHeight())


            ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit: function() {
            hammer = new Hammer(canvas);
            hammer.ontap = function(ev) {
                mousedown = true
                mousex = ev.position[0].x - canvas.offsetLeft //correct ontap value x
                mousey = ev.position[0].y - canvas.offsetTop  //correct ontap value y
            };
            hammer.ondragstart = function(ev) {};
            hammer.ondrag = function(ev) {
                mousex = ev.position.x
                mousey = ev.position.y


            //log = document.getElementById('log')
            //log.innerHTML = 'x: ' + mousex + "   y: " + mousey + '  back[' + layerback.elements.length + '] ' + '  middle[' + layermiddle.elements.length + '] ' + '  front[' + layerfront.elements.length + '] '

            };
            hammer.ondragend = function(ev) {};
            hammer.onswipe = function(ev) {};

            hammer.ondoubletap = function(ev) {};
            hammer.onhold = function(ev) {};

            hammer.ontransformstart = function(ev) {};
            hammer.ontransform = function(ev) {};
            hammer.ontransformend = function(ev) {};

            hammer.onrelease = function(ev) {

            };
        },
        touchhandler: function(){
        }
    }

    return Game
}())

function backToMainCallback(obj){
    Game.director.nextScreen('mainscreen', 10)
}
function gameCallback(obj){
    Game.director.setFadeMode('scale')
    Game.director.nextScreen('gamescreen', 10)
}
function settingsCallback(obj){
    Game.director.setFadeMode('fade')
    Game.director.nextScreen('settingsscreen', 10)
}
