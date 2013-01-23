var renderStats, updateStats

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
                .addImage('media/img/glowball-50.png', 'glowball')
                .addImage('media/img/ballon.png', 'ballon')
                .addImage('media/img/hunter.png', 'hunter')

                //tiled map
                .addJson('media/map/map-advanced-inner-outer.json', 'map1')

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

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))


            //create tilemap
            map = new CG.Map(640, 480)
            map.loadMapJson(Game.asset.getJsonByName('map1'))

            //assign sprite to group object b2 of tiled map
            ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(Game.width2, Game.height2))
            ballon.name = 'ballon'
            ballon.boundsMode = 'bounce'
            ballon.xspeed = 1
            ballon.yspeed = 2
            ballon.bound = map.getAreasByName('bound1')[0].bound
            ballon.xscale = 0.2
            ballon.yscale = 0.2
            mainlayer.addElement(ballon)

            map.addElement(ballon)

            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
            updateStats = new Stats()
            document.body.appendChild(updateStats.domElement)

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
            updateStats.update()
            //update here what ever you want

//            map.checkAreasCollision([ballon], callbackAreasCollision)

            Game.director.update()
        },
        draw:function () {
            ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            //draw the map in the background
            map.drawMap(0, 0, 0, 0, Game.bound.width, Game.bound.height, callbackMapCollision)

            //draw all elements that the director has
            Game.director.draw()

            //text stuff
            abadi.draw('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.draw('Map class example.', xpos, ypos + 56)
            //            small.draw('The Tiled mapeditor has a object layer with different object types.', xpos, ypos + 56 + small.getLineHeight())
            //            small.draw('The object group is used for bound (ballons) and the tile object is used', xpos, ypos + 56 + (small.getLineHeight() * 2))
            //            small.draw('as a point (diamonds). Tilemap collision detection is also possible.', xpos, ypos + 56 + (small.getLineHeight() * 3))
            small.draw('Bound b1 of map', ballon.position.x - 40, ballon.position.y + 20)

            // draw Game.b_canvas to the canvas
            ctx.drawImage(Game.b_canvas, 0, 0)

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

function callbackMapCollision() {

}

function callbackAreasCollision(obj, area) {
    console.log([obj, area])
}