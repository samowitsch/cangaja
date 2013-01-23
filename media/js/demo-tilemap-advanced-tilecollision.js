var renderStats, updateStats

var mainscreen,mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()

var ri = 0
var mapcollisiontext = ''


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
            .addImage('media/img/hunter.png','hunter')

            //tiled map
            .addXml('media/map/map-advanced.tmx','map1')

            //texturepacker
            .addImage('media/img/texturepacker.png','texturepacker')
            .addJson('media/img/texturepacker.json','texturepacker-json')

            .startPreLoad()
        },
        create: function() {

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

            rocket = new CG.Sprite(Game.asset.getImageByName('rocket'), new CG.Point(Game.width2, Game.height2))
            rocket.name = 'rocket'
            rocket.boundingradius = 80
            rocket.xscale = 0.5
            rocket.yscale = 0.5
            mainlayer.addElement(rocket)

            //create tilemap
            map = new CG.Map(640, 480)
            map.loadMapXml(Game.asset.getXmlByName('map1'))

            //add element to map object for collision detection, the collision check is called for every tile in the drawMap method
            .addElement(rocket)

            //set layer 1 to check for collision
            map.layertocheck = 1


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
            //update here what ever you want
            updateStats.update()

            //clear collisiontext
            mapcollisiontext = ''

            var rocky = mainlayer.getElementByName('rocket')
            ri +=0.007
            rocky.position.x = Game.bound.width/2+(Game.bound.width/3*Math.cos(ri*3-Math.cos(ri))) >> 0
            rocky.position.y = Game.bound.height/2+(Game.bound.height/2*-Math.sin(ri*2.3-Math.cos(ri))) >> 0

            Game.director.update()
        },
        draw: function() {
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
            small.draw('This map example shows how to detect a sprite to tilemap collision.', xpos, ypos + 56 + small.getLineHeight())
            small.draw(mapcollisiontext, xpos, ypos + 56 + (small.getLineHeight() * 2))


            // draw Game.b_canvas to the canvas
            ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
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

/**
 * callback for map collision detection.
 * for the moment the map object sends the depending sprite and the tile as arguments
 */
function callbackMapCollision(sprite,tile){
    if(tile instanceof CG.MapTileProperties){
        mapcollisiontext = 'Collision: ' + sprite.name + ' hits ' + tile.name
    }
}
