var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.AtlasTexturePacker()


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
                .addImage('media/img/glowball-50.png', 'glowball')
                .addImage('media/img/ballon.png', 'ballon')
                .addImage('media/img/hunter.png', 'hunter')

                //tiled map
                .addXml('media/map/map-advanced.tmx', 'map1')

                //texturepacker
                .addImage('media/img/texturepacker.png', 'texturepacker')
                .addJson('media/img/texturepacker.json', 'texturepacker-json')

                .startPreLoad()
        },
        create: function () {

            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())

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
            map.loadMapXml(Game.asset.getXmlByName('map1'))

            //get position points from object layer of tiled
            pointstest = map.getPointsByName('coin')

            //create for every point a sprite and add it to the mainlayer
            for (var i = 0, l = pointstest.length; i < l; i++) {

                diamond = new CG.Sprite(Game.asset.getImageByName('gem'), pointstest[i].position)
                diamond.name = 'diamond'
                diamond.boundingradius = 80
                mainlayer.addElement(diamond)
            }

            //assign sprite to group object b1 of tiled map
            ballon1 = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
            ballon1.name = 'ballon1'
            ballon1.boundsMode = 'bounce'
            ballon1.xspeed = 2
            ballon1.yspeed = 1
            ballon1.bound = map.getAreasByName('b1')[0].bound
            ballon1.xscale = 0.3
            ballon1.yscale = 0.3
            mainlayer.addElement(ballon1)

            //assign sprite to group object b2 of tiled map
            ballon2 = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
            ballon2.name = 'ballon2'
            ballon2.boundsMode = 'bounce'
            ballon2.xspeed = 1
            ballon2.yspeed = 2
            ballon2.bound = map.getAreasByName('b2')[0].bound
            ballon2.xscale = 0.2
            ballon2.yscale = 0.2
            mainlayer.addElement(ballon2)

            //assign sprite to group object b3 of tiled map
            ballon3 = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
            ballon3.name = 'ballon3'
            ballon3.boundsMode = 'bounce'
            ballon3.rotationspeed = 1
            ballon3.xspeed = 1
            ballon3.yspeed = 1
            ballon3.bound = map.getAreasByName('b3')[0].bound
            ballon3.xscale = 0.2
            ballon3.yscale = 0.2
            mainlayer.addElement(ballon3)

            //assign sprite to group object b4 of tiled map
            ballon4 = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
            ballon4.name = 'ballon4'
            ballon4.boundsMode = 'bounce'
            ballon4.rotationspeed = 8
            ballon4.xspeed = 1
            ballon4.yspeed = 1
            ballon4.bound = map.getAreasByName('b4')[0].bound
            ballon4.xscale = 0.1
            ballon4.yscale = 0.1
            mainlayer.addElement(ballon4)


            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            Game.loop()
        },
        loop: function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.anim1();
            }
        },
        anim1: function () {
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

            //draw the map in the background
            map.drawMap(0, 0, 0, 0, Game.bound.width, Game.bound.height, callbackMapCollision)

            //draw all elements that the director has
            Game.director.draw()

            //text stuff
            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.drawText('Map class example.', xpos, ypos + 56)
            small.drawText('The Tiled mapeditor has a object layer with different object types.', xpos, ypos + 56 + small.getLineHeight())
            small.drawText('The object group is used for bound (ballons) and the tile object is used', xpos, ypos + 56 + (small.getLineHeight() * 2))
            small.drawText('as a point (diamonds). Tilemap collision detection is also possible.', xpos, ypos + 56 + (small.getLineHeight() * 3))
            small.drawText('Bound b1 of map', ballon1.position.x - 40, ballon1.position.y + 20)
            small.drawText('Bound b2 of map', ballon2.position.x - 40, ballon2.position.y + 20)
            small.drawText('Bound b3 of map', ballon3.position.x - 40, ballon3.position.y + 20)
            small.drawText('Bound b4 of map', ballon4.position.x - 40, ballon4.position.y + 20)

            // draw Game.b_canvas to the canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit: function () {
        },
        touchhandler: function () {
        }
    }

    return Game
}())

function callbackMapCollision() {

}