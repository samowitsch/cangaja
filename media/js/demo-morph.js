var renderStats, updateStats

var mainscreen,mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup
var morph, morph2


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
            .addFont('media/font/abadi_ez.txt','abadi')
            .addImage('media/img/glowball-50.png','glowball')

            .startPreLoad()
        },
        create: function() {

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            //some morph object
            morph = new CG.Morph('sinus', 0.25, 1, 3)
            mainlayer.addElement(morph)
            morph2 = new CG.Morph('sinus', 1, 1000, 1)
            mainlayer.addElement(morph2)

            //sprite 1
            spr1 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(100, 200))
            spr1.name = 'spr1'
            spr1.xscale = 3
            spr1.yscale = 3
            mainlayer.addElement(spr1)

            //sprite 2
            spr2 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(400, 240))
            spr2.name = 'spr2'
            spr2.xscale = 2
            spr2.yscale = 2
            mainlayer.addElement(spr2)

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

            //use the screen and layer methods to get an objecz
            mainscreen.getLayerByName('mainlayer').getElementByName('spr1').alpha = morph.getVal()
            mainscreen.getLayerByName('mainlayer').getElementByName('spr1').xscale = morph.getVal()

            //or use an object stored via variable
            spr1.yscale = morph.getVal()
            spr2.rotation = morph2.getVal()

            //update all stuff attached to the director screen => layers => elements in layers
            Game.director.update()
        },
        draw: function() {
            ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            //draw all stuff attached to the director screen => layers => elements in layers
            Game.director.draw()

            abadi.draw('cangaja - Canvas Game JavaScript FW', xpos, ypos)

            small.draw('Morph class example.', xpos, ypos + 50)


            small.draw('Morph on alpha and size.', spr1.position.x + 20, spr1.position.y + 20)
            small.draw('Morph on rotation', spr2.position.x + 20, spr2.position.y + 20)

            ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit: function() {
        },
        touchhandler: function(){
        }
    }

    return Game
}())