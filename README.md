# cangaja - Canvas Game JavaScript Framework

cangaja is a javascript canvas project that i have started to explore the html canvas features.

## Featurelist for now:

* sound features using [Buzz!]
* touch handling using [Hammer]
* working with [Ejecta] on iOS, but [Buzz!] and [Hammer] don't work there!
* Mediaasset class (preload and handle files/data)
* Director class (with screen handling/fading)
* Screen class
* Bitmap class
* Layer class
* Sprite class
* Animation class
* Map class
* Button class
* Menu class
* Collision handling (rectangle, circle, no pixelperfect collision at the moment)
* Emitter class (point, line, rectangle, explosion)
* Particle class
* Morphing class
* Translation class (linear, circle, bezier)
* Sequence class (handles multiple Translations)
* Tilemap support orthogonal/isometric ([Tiled Map Editor] .tmx files format xml or csv)
* Font support ([Glyphdesigner] EZ Gui text files)
* TexturePacker support ([TexturePacker] generic XML file)
* Box2DHtml support ([Box2DHtml5])
* Destructible Terrain class
* PhysicsEditor support ([PhysicsEditor] use Lime + Corona JSON format for use in Box2D Wrapper)
* Spine 2D support ([Spine])

[Glyphdesigner]: http://www.71squared.com/glyphdesigner
[ParticleDesigner]: http://www.71squared.com/particledesigner
[PhysicsEditor]: http://www.codeandweb.com/physicseditor
[TexturePacker]: http://www.codeandweb.com/texturepacker
[Tiled Map Editor]: http://www.mapeditor.org
[Buzz!]: http://buzz.jaysalvat.com
[Hammer]: http://eightmedia.github.com/hammer.js/
[Ejecta]: http://impactjs.com/ejecta
[Box2DHtml5]: https://code.google.com/p/box2d-html5/
[Spine]: http://esotericsoftware.com

## Todo / wish list / bugs:

* Terrain destruction "bugs":
  - terrain destruction is very pragmatic. The terrain is deleted and replaced with another new generated terrain shape.
  - in some circumstances when clipping hole vertices and terrain vertices overlap, poly2tri "crashes"
* integrate gamepad stuff (http://www.html5rocks.com/en/tutorials/doodles/gamepad/ or https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library)
* Oneway/onesided Platforms Box2d
    http://www.box2d.org/forum/viewtopic.php?f=3&t=4985
    http://www.emanueleferonato.com/2010/03/02/understanding-box2ds-one-way-platforms-aka-clouds/
    http://gamedev.stackexchange.com/questions/47828/box2d-with-lines
    http://www.iforce2d.net/b2dtut/one-way-walls

* develop something similar to DiddyData. A config file to define files to preload and screens an layers to generate
* sprite positioning bug in slide demo?
* eliminate Array.forEach
* global renderer with webgl support and canvas 2d fallback?
* additional options argument for Box2D wrapper classes for detailed configuration?
* MapPolyLine and MapPolygon for use as b2ChainShape in Box2D Wrapper => oh, no! b2ChainShape not exists in box2dweb 2.1.x
* Tilemap => decision what to prefer => xml or json format?
* bugfixing Tilemap with tmx csv format is not animating correctly (tmx with xml and tilemap exported as json works!)
* fix missing rotation when follower sprite using TPImage
* add support for additional [Tiled Map Editor] features like object positioning(done!), object path and object group(done!)
* support [TexturePacker] cropping option
* class Sequence rewind feature
* create new class Writer or Text for textblocks and textscroller using update/draw => then it can be an element of a layer
* object pooling for all elements like sprites and so on...
* better code documentation and what license to use?
* clean up demo code ;o)
* z-index for objects useful?
* class bitmap method clearcircle is not working with Ejecta ;o(
* class text => textblock, alignment, textticker, textscroller features
* [ParticleDesigner] support?
* are sprites and other objects out of the game screen (Game.bound) => no drawing and/or not updating of this object?
* configurable handle for sprite, animation and button (maybe also button)
* add more features to the font class
* better input implementation, get rid of the global mousedown variable
* use the object group as bound as collision object
* additional method in map class for collision check

## Changelog:

* 2013-12-09 [added] - new class CG.Game
* 2013-12-06 [change] - class inheritance clenaup
* 2013-12-05 [feature] - basic spine support has landed ;o)
* 2013-11-06 [bugfix] - patched ClipperLib, treat useragent ejecta as useragent safari for ejecta usage. Otherwise cangaja is not working in ejecta.
* 2013-10-30 [added] - closure compiler for testing
             [change] - renamed classes: CG.TexturePacker => CG.AtlasTexturePacker and CG.TPImage => CG.AtlasImage
* 2013-10-17 [bugfix] - of terrain crash, the circle vertices has to be reversed to CCW(?)
* 2013-10-15 [added] - destructabel terrain class ;o)
* 2013-10-07 [added] - added libs Clipper and poly2tri
* 2013-10-07 [change] - removed box2dweb, added box2dhtml5 (Box2D 2.3.0), rework for box2dhtml5, misc updates
* 2013-04-17 [cleanup] - cleanup again
* 2013-04-08 [added] - added mode slide for director to switch screens
* 2013-04-07 [added] - started basic cangaja template for ejecta
* 2013-04-06 [added] - started basic cangaja template
* 2013-04-04 [cleanup] - a little folder structure cleanup
* 2013-04-02 [fixed] - preloader had wrong context
* 2013-03-05 [added] - apidoc generated with yuidoc
* 2013-02-22 [added] - added B2DLine class
* 2013-02-20 [added] - added working B2DBridge class
* 2013-02-13 [bugfix] - Box2D warpper => added name and uid to each object for correct deleting of objects
* 2013-02-10 [added] - dragging, deleting and apply impulse of/to Box2D objects
* 2013-02-05 [added] - first simple Box2D Wrapper with basic shapes: circle, rectangle and polybody
* 2013-01-24 [added] - Sprite to MapArea collision
* 2013-01-23 [misc] - purchased Webstorm JavaScript IDE, thats what i call a JS IDE!
* 2013-01-22 [change] - now finally rewritten for simple inheritance with no way back ;o)
* 2013-01-19 [added] - added a new scale transition mode between screens in Director class
* 2013-01-10 [change/bugfix] - rewrite of class Animation for more "inheritance style" and bugfix for correct midhandle
* 2012-12-30 [added] - added MapPoint and MapArea support to the loadMapXml method => this is also a todo for the json part
* 2012-12-29 [change] - changed comments to jsdoc style
* 2012-12-27 [bugfix] - found collision bug in AABB() method after rewrite of object positioning
                      - found bug when a Button is rotated => wrong label rotation
* 2012-12-27 [change] - classes Emitter, Sprite, Button and Animation are now using a Point Object for positioning
* 2012-12-25 [change] - cleanup of some useless class inheritances
* 2012-12-25 [change] - further changes to work with bounds in sprites => possible bound of a tilemap?
* 2012-12-24 [change] - changed all sources of Game.width/Game.height with Game.bound.width/Game.bound.height
* 2012-12-22 [added] - added class Bound to work with sprites and specialy sprites and bounds in tilemaps
* 2012-11-26 [change] - changed class hierarchy. removed most of ejecta specific code
* 2012-11-17 [bugfix] - bug in method entity => setImage(): image.width/-height <=> image.cutwidth/-height where wrong if TPImage is used
* 2012-10-09 [feature] - added Bitmap class with some functions
* 2012-10-09 [change] - little rewrite to work with [Ejecta]
* 2012-10-09 [bugfix] - class Tilemap with json source is animating again => forgotten property ;o)
* 2012-10-09 [feature] - added json support to Map class
* 2012-10-09 [feature] - added json support to Texturepacker class (indeed [Tiled Map Editor] can export to json)
* 2012-10-08 [rewrite] - first rewrite of class map
* 2012-10-02 [feature] - sprites have now the properties offsetx/offsety for the attached objects
                       - class animation/button inherits the attached object features ;o)
* 2012-10-02 [fix] particles in emitter pool now sorted correctly after particle reanimation ;o)
* 2012-09-27 [feature] sprites can have a attached object and control its position for now
* 2012-09-27 [cleanup] index.html
* 2012-09-22 [fix] class button now using the font size for centering the text. glypghdesigners lineheight vary very much.
* 2012-09-14 [feature] added type corona to the emitter class
* 2012-09-19 [cleanup] class translate
* 2012-09-16 [fix] fixed wrong width/height when using rotated tpimage
* 2012-09-16 [speed] for loops optimized
* 2012-09-14 [feature] added type rectangle to the emitter class
* 2012-09-14 [fix] Mediaasset last image is not preloading => bug in MediaAsset getImageByName()

## Class inheritance

+ Class
  + Atlas-Image
  + Atlas-TexturePacker
  + Bound
  + Buffer
  + Director
  + Emitter
  + Entity
    + B2DEntity
      + B2DCircle
      + B2DRectangle
      + B2DPolygon
      + B2DLine
      + B2DBridge
      + B2DRope
      + B2DChainShape
    + Bitmap
    + Font
    + Map
    + Sprite
      + Animation
      + Button
      + Particle
    + SpineAnimation
  + Game
  + Layer
    + B2DWorld
  + MapPoints
  + MapAreas
  + MapTileLayer
  + MapTileProperties
  + MediaAsset
  + Menu
  + Morph
  + Point
    + Vector
  + Screen
  + Sequence
  + Translate

## Framework logic

+ Game
  + MediaAsset
  + Director
    + Screen
      + Layer
        + Animation
        + Button
        + Emitter
        + Map
        + Menu
        + SpineAnimation
        + Sprite
        + B2DWorld
          + B2DCircle
          + B2DRectangle
          + B2DPolygon
          + B2DLine
          + B2DBridge
          + B2DRope
          + B2DChainShape

# Examples #

## Mediaasset preloading ##

```js
//preload all needed files
Game.asset.addImage('media/img/rocket.png', 'rocket')
//image
.addImage('media/img/burst.png','burst')
//font glypgdesigner
.addFont('media/font/gill.txt','gill')
//tilemap xml
.addXml('media/map/map-diddy-csv.tmx','map-diddy-csv')
//texturepacker image
.addImage('media/img/texturepacker.png','texturepacker')
//texturepacker xml
.addXml('media/img/texturepacker.xml','texturepacker-xml')
//texturepacker json
.addJson('media/img/texturepacker.json','texturepacker-json')
//tilemap json
.addJson('media/map/map.json','map-json')
//start preload
.startPreLoad()


//getting asset stuff
Game.asset.getImageByName('name')
Game.asset.getFontByName('name')
Game.asset.getXmlByName('name')
Game.asset.getJsonByName('name')
```

## Texturepacker example ##

```js
var tp = new CG.AtlasTexturePacker()

//load texturepacker json file (recommended for ejecta use)
tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

//the same example for texturepacker xml file
tp.loadXml(Game.asset.getXmlByName('texturepacker-xml'))

//add Texturepacker AtlasImages to mediaasset images
Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())
```

## Font (Glyphdesigner) example ##

```js
//create font and load font file
font = new CG.Font().loadFont(Game.asset.getFontByName('heiti'))

//draw some text
font.drawText('Hello world ;o)', xpos, ypos)
```


## Director example ##

```js
//create director
var director = new CG.Director()

//adding screen and layer object to director
director.addScreen(
    new CG.Screen('screenname').addLayer('layername')
)

//fade screen to another screen with duration 5
director.nextScreen('anotherscreen', 5)

//update all attached dircetor objects in game loop
director.update()

//draw all attached director objects in game loop
director.draw()

```

## Sprite example ##

```js
//create sprite
cloud = new CG.Sprite(Game.asset.getImageByName('cloud'), 150, 150)
cloud.name = 'cloud'
cloud.xscale = 0.75
cloud.yscale = 0.75
cloud.xspeed = 0.5
cloud.yspeed = -0.25
cloud.boundsMode = 'slide'

//add sprite to layer
director.getScreenByName('screenname')
    .getLayerByName('layername')
    .addElement(cloud)

//or add sprite direct to layer object
layersprites.addElement(cloud)
```

## Animation example ##

```js
//create animation object
expl = new CG.Animation('media/img/burst.png', mousex, mousey, 1, 256, 256, 256)
expl.yspeed = -1
expl.name = 'expl'
expl.loop = false
expl.delay = 2
expl.rotation = Math.floor((Math.random() * 180) + 1)
expl.rotationspeed = Math.floor((Math.random() * 3) + 1)

//add animation to layer
layermiddle.addElement(expl)
```

## Bitmap example ##

```js
bm = new CG.Bitmap(300,300)
//load and draw a image to the buffer
bm.loadImage(Game.asset.getImageByName('texturepacker'))
//adding buffer as element to a layer
Game.director.getScreenByName('menuscreen').getLayerByName('layerback').addElement(test)
//clear a circular region of the bitmap
bm.clearCircle(50,50,50)
//clear a rectangular region of the bitmap
bm.clearRect(0,0,50,150)
// clear the buffer
bm.clearBuffer()
// and draw the loaded image back to the buffer
bm.drawImageToBuffer()
```


## Tilemap example ##

```js
var map = new CG.Map(640, 480)

//loading a tiles tilemap as xml into map, supported is csv and xml
map.loadMapXml(Game.asset.getXmlByName("name-in-asset"))

//loading a tiles tilemap as json format (recommended for ejecta use)
map.loadMapJson(Game.asset.getJsonByName("name-in-asset"))

//example in game loop
map.drawMap(mousex*2>>0, mousey*2>>0, Game.bound.width, Game.bound.height, 0, 0, callbackMapCollision)
```


## setting alternative bound instead of game bound (canvas) to sprite example ##

```js
Game.director.getScreenByName('sprites')
    .getLayerByName('layersprites')
    .getElementByName('glow')
    .setBound(
        new CG.Bound (200,0,400,400)
    )
```

## spine example. creating a SpineAnimation object with MediaAsset loaded spine data.

```js
spineboy = new CG.SpineAnimation(
    Game.asset.getJsonByName('spineboy-json'),
    Game.asset.getTextByName('spineboy-atlas'),
    new CG.Point(160, 550),
    1,  //experimental scale
    function (spineObject) {
        spineObject.stateData.setMixByName("walk", "jump", 0.2);
        spineObject.stateData.setMixByName("jump", "walk", 0.4);
        spineObject.state.setAnimationByName(0, "walk", true, 0);
    }
)
mainlayer.addElement(spineboy)
```

## experimental Game object example

```js
window.onload = function() {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    //mouse move handler
    can.addEventListener('mousemove', function(evt) {
        var rect = can.getBoundingClientRect(), root = document.documentElement;
        mousex = evt.clientX - canvas.offsetCG.LEFT;
        mousey = evt.clientY - canvas.offsetTop;
    }, false);

    //jump into the game object ;o)
    Game.preload()
};

var Game = {
    path: '', //optional path depending on file/folder structure
    fps: 60,
    width: 640,
    height: 480,
    width2: 640 / 2,
    height2: 480 / 2,
    bound: new CG.Bound(0,0,640,480).setName('game'),
    canvas: {},
    ctx: {},
    b_canvas: {},
    b_ctx: {},
    asset: new CG.MediaAsset('media/img/splash3.jpg'),
    director: new CG.Director(),
    delta: new CG.Delta(60),
    preload: function(){
        //canvas for ouput
        canvas = document.getElementById("canvas")
        ctx = canvas.getContext("2d")

        //canvas buffer
        Game.b_canvas = document.createElement('canvas')
        Game.b_ctx = Game.b_canvas.getContext('2d')
        Game.b_canvas.width = Game.bound.width
        Game.b_canvas.height = Game.bound.height

        //preload images
        Game.asset.addImage('rocket','media/img/rocket.png')
        .addImage('bigexplosion','media/img/expbig1.png')
        .addFont('gill2','media/font/gill2.txt')
        .addXML('sewers','media/map/sewers.tmx')
        .startPreLoad()
    //after preload jump to Game.create
    },
    create: function() {
        //buzz: create/load sound objects
        mySound = new buzz.sound("media/sfx/serious", {
            formats: [ "ogg", "mp3", "aac", "wav" ],
            preload: true,
            autoplay: true,
            loop: true
        });
        myShoot = new buzz.sound("media/sfx/laser", {
            formats: [ "ogg", "mp3", "aac", "wav" ],
            preload: true,
            loop: false
        });
        mySound.play()

        //screen
        mainscreen = new CG.Screen('mainscreen')

        //layer
        mainlayer = new CG.Layer('mainlayer')

        //elements: buttons, animations, sprites, emitter
        //button
        button1 = new CG.Button(Game.asset.getImageByName('button'), 320, ybutton, 'Start', font, callBackFunction)
        button1.name = 'start'
        mainlayer.addElement(button1)

        //sprite
        sun = new CG.Sprite(Game.asset.getImageByName('sun'), 480, 100)
        sun.name = 'sun'
        sun.boundingradius = 150
        sun.xspeed = 1
        sun.boundsMode = 'slide'
        sun.xscale = 1
        sun.yscale = 1
        mainlayer.addElement(sun)

        //emitter
        mainlayer.addElement(new CG.Emitter()
            .setName('explodi')
            .activateFadeout()
            .setProtation(2)
            .setGravity(0)
            .initAsExplosion(Game.asset.getImageByName('powerstar75'), -2, 2)
            .setEmitterPosition(320, 240))




        //create needed stuff and add it to the director: screens => layers => elements
        Game.director
        .addScreen(mainscreen.addLayer(mainlayer))

        Game.touchinit()
        Game.loop()

    },
    loop: function(){
        Game.delta.update()
        requestAnimationFrame(Game.loop);
        if(Game.asset.ready==true){
            var last = new Date()
            //    delta = (now - then) / (1000 / Game.fps)
            Game.run();
            Game.touchhandler()
            delta = (new Date() - last) / 1000
        }
    },
    run: function() {
        Game.update()
        Game.draw()
    },
    update: function() {
        Game.director.update()
    },
    draw: function() {
        //clear ctx
        ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

        //place custom drawings here

        //draw all elements handled by the director or its screens/layers/elements
        Game.director.draw()

        //draw buffer to ctx
        ctx.drawImage(Game.b_canvas, 0, 0)
        //clear buffer
        Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
    },
    touchinit: function() {
        hammer = new Hammer(canvas);
        hammer.on('tap', function(ev) {
            mousedown = true
            mousex = ev.position[0].x - canvas.offsetCG.LEFT //correct ontap value x
            mousey = ev.position[0].y - canvas.offsetTop  //correct ontap value y

        });
        hammer.on('dragstart', function(ev) {

        });
        hammer.on('drag', function(ev) {
            mousex = ev.position.x
            mousey = ev.position.y
        });
        hammer.on('dragend', function(ev) {

        });
        hammer.on('swipe', function(ev) {

        });

        hammer.on('doubletap', function(ev) {

        });
        hammer.on('hold', function(ev) {

        });

        hammer.on('transformstart', function(ev) {

        });
        hammer.on('transform', function(ev) {

        });
        hammer.on('transformend', function(ev) {

        });

        hammer.on('release', function(ev) {

        });
    },
    touchhandler: function(){
        mousedown = false
    }
}
```