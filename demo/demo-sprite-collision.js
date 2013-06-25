var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()

var ri = 0
var mapcollisiontext = ''


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
        canvas: {},
        ctx: {},
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
                .addFont('media/font/abadi_ez.txt', 'abadi')
                .addImage('media/img/hunter.png', 'hunter')

                //texturepacker
                .addImage('media/img/texturepacker.png', 'texturepacker')
                .addJson('media/img/texturepacker.json', 'texturepacker-json')

                .startPreLoad()
        },
        create:function () {

            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')
            collisionlayer = new CG.Layer('collisionlayer')

            //add screen to Director
            Game.director
                .addScreen(mainscreen.addLayer(collisionlayer))
                .addScreen(mainscreen.addLayer(mainlayer))

            //
            rocket = new CG.Sprite(Game.asset.getImageByName('rocket'), new CG.Point(Game.width2, Game.height2))
            rocket.name = 'rocket'
            rocket.boundingradius = 80
            rocket.xscale = 0.5
            rocket.yscale = 0.5
            mainlayer.addElement(rocket)

            //this sprite follows the rocket with a fixed speed
            collision = new CG.Sprite(Game.asset.getImageByName('gem'), new CG.Point(250, 200))
            collision.name = 'rockethunter-1'
            collision.boundingradius = 80
            collision.xscale = 0.5
            collision.yscale = 0.5
            collisionlayer.addElement(collision)

            //this sprite follows the rocket with a fixed step rate
            collision = new CG.Sprite(Game.asset.getImageByName('gem'), new CG.Point(500, 400))
            collision.name = 'rockethunter-2'
            collision.boundingradius = 80
            collision.xscale = 0.5
            collision.yscale = 0.5
            collisionlayer.addElement(collision)

            //this sprite follows the rocket with a fixed speed
            collision = new CG.Sprite(Game.asset.getImageByName('gem'), new CG.Point(500, 200))
            collision.name = 'rockethunter-1'
            collision.boundingradius = 80
            collision.xscale = 0.5
            collision.yscale = 0.5
            collisionlayer.addElement(collision)

            //this sprite follows the rocket with a fixed step rate
            collision = new CG.Sprite(Game.asset.getImageByName('gem'), new CG.Point(250, 400))
            collision.name = 'rockethunter-2'
            collision.boundingradius = 80
            collision.xscale = 0.5
            collision.yscale = 0.5
            collisionlayer.addElement(collision)


            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            Game.loop()
        },
        loop:function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.anim1();
            }
        },
        anim1:function () {
            Game.update()
            Game.draw()
        },
        update:function () {
            //update here what ever you want

            //clear collisiontext
            spritecollisiontext = ''
            mainlayer.getElementByName('rocket').alpha = 1
            mainlayer.getElementByName('rocket').checkCollision(collisionlayer.elements, callbackCollisionTest)


            var rocky = mainlayer.getElementByName('rocket')
            ri += 0.007
            rocky.position.x = Game.bound.width / 2 + (Game.bound.width / 3 * Math.cos(ri * 3 - Math.cos(ri))) >> 0
            rocky.position.y = Game.bound.height / 2 + (Game.bound.height / 2 * -Math.sin(ri * 2.3 - Math.cos(ri))) >> 0

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
            small.drawText('Sprite class example.', xpos, ypos + 56)
            small.drawText('This sprite example shows the collision function.', xpos, ypos + 56 + small.getLineHeight())
            small.drawText(spritecollisiontext, xpos, ypos + 56 + (small.getLineHeight() * 2))

            // draw Game.b_canvas to the canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit:function () {
        },
        touchhandler:function () {
        }
    }

    return Game
}())

/**
 * callback for map collision detection.
 * for the moment the map object sends the depending sprite and the tile as arguments
 */
function callbackCollisionTest(obj1, obj2) {
    mainlayer.getElementByName('rocket').alpha = 0.3
    spritecollisiontext = 'Rocket collision!'
}
