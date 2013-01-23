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

            //animation 1
            anim1 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(50, 100), 8, 14, 56, 64)
            anim1.name = 'anim1'
            anim1.delay = 6
            mainlayer.addElement(anim1)

            //animation 2
            anim2 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(200, 100), 8, 14, 56, 64)
            anim2.name = 'anim2'
            anim2.delay = 6
            anim2.rotationspeed = 1
            mainlayer.addElement(anim2)
            
            //animation 3
            anim3 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(400, 100), 8, 14, 56, 64)
            anim3.name = 'anim3'
            anim3.delay = 6
            anim3.alpha = 0.5
            anim3.xscale = 0.5
            anim3.yscale = 0.5
            mainlayer.addElement(anim3)

            //animation 4
            anim4 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(50, 200), 8, 14, 56, 64)
            anim4.name = 'anim3'
            anim4.delay = 6
            anim4.xspeed = -2
            anim4.boundsMode = "bounce"
            mainlayer.addElement(anim4)

            //animation 5
            anim5 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(50, 300), 8, 14, 56, 64)
            anim5.name = 'anim3'
            anim5.delay = 6
            anim5.xspeed = -2
            anim5.boundsMode = "slide"
            mainlayer.addElement(anim5)

            //animation 6
            anim6 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(50, 300), 8, 14, 56, 64)
            anim6.name = 'anim3'
            anim6.delay = 6
            anim6.xspeed = -1
            anim6.yspeed = 1
            anim6.boundsMode = "bounce"
            anim6.bound = new CG.Bound(0,300, 640, 180)
            mainlayer.addElement(anim6)


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
            
            small.draw('Animation class example.', xpos, ypos + 50)


            small.draw('SIMPLE ANIMATION', anim1.position.x + 20, anim1.position.y + 20)
            small.draw('ANIMATION WITH ROTATION', anim2.position.x + 20, anim2.position.y + 20)
            small.draw('ALPHA 0.5 / SCALE 0.5', anim3.position.x + 20, anim3.position.y + 20)
            small.draw('MODE BOUNCE', anim4.position.x + 20, anim4.position.y + 20)
            small.draw('MODE SLIDE', anim5.position.x + 20, anim5.position.y + 20)
            small.draw('CUSTOM BOUND', anim6.position.x + 20, anim6.position.y + 20)

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