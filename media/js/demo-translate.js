var renderStats, updateStats

var mainscreen,mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup


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
            .addImage('media/img/hunter.png','hunter')


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

            //sprite 1
            spr1 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(50, 100))
            spr1.name = 'spr1'
            mainlayer.addElement(spr1)


            //sequence for sprite 1
            sequence = new CG.Sequence()
            sequence.loop = true
            sequence.addTranslation(
                new CG.Translate().initBezier(mainlayer.getElementByName('spr1'),200,new CG.Point(500,450),new CG.Point(100,100),new CG.Point(-600,600), new CG.Point(1200,-300)))
            .addTranslation(new CG.Translate().initTween(mainlayer.getElementByName('spr1'), 200, new CG.Point(100, 100), new CG.Point(550, 150)))
            .addTranslation(new CG.Translate().initTween(mainlayer.getElementByName('spr1'), 150, new CG.Point(550, 150), new CG.Point(100, 400)))
            .addTranslation(new CG.Translate().initTween(mainlayer.getElementByName('spr1'), 100, new CG.Point(100, 400), new CG.Point(550, 450))
                )
            mainlayer.addElement(sequence)


            //sprite 2
            spr2 = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(50, 100))
            spr2.name = 'spr2'
            mainlayer.addElement(spr2)
            
            //translate fro sprite 2
            translate = new CG.Translate().initTween(mainlayer.getElementByName('spr2'), 150, new CG.Point(550, 150), new CG.Point(100, 400))
            mainlayer.addElement(translate)
            



            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
            updateStats = new Stats()
            document.body.appendChild(updateStats.domElement)

            Game.loop()
        },
        loop: function(){
            requestAnimationFrame(Game.loop);
            if(Game.asset.ready==true){
                Game.anim1();
            }
        },
        anim1: function() {
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

            small.draw('Tranlation/Sequence class example.', xpos, ypos + 50)

            small.draw('SEQUENCE with Loop', spr1.position.x - 60, spr1.position.y + 20)
            small.draw('single TRANSLATE', spr2.position.x - 60, spr2.position.y + 20)


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