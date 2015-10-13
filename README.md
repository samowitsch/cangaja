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

* eliminate Array.forEach
* develop something similar to DiddyData. A config file to define files to preload and screens an layers to generate
* Terrain destruction "bugs":
  - terrain destruction is very pragmatic. The terrain is deleted and replaced with another new generated terrain shape.
  - in some circumstances when clipping hole vertices and terrain vertices overlap, poly2tri "crashes"
* integrate gamepad stuff (http://www.html5rocks.com/en/tutorials/doodles/gamepad/ or https://github.com/kallaspriit/HTML5-JavaScript-Gamepad-Controller-Library)
* Oneway/onesided Platforms Box2d
    http://www.box2d.org/forum/viewtopic.php?f=3&t=4985
    http://www.emanueleferonato.com/2010/03/02/understanding-box2ds-one-way-platforms-aka-clouds/
    http://gamedev.stackexchange.com/questions/47828/box2d-with-lines
    http://www.iforce2d.net/b2dtut/one-way-walls

* global renderer with webgl support and canvas 2d fallback?
* additional options argument for Box2D wrapper classes for detailed configuration?
* fix missing rotation when follower sprite using TPImage
* add support for additional [Tiled Map Editor] features like object positioning(done!), object path and object group(done!)
* support [TexturePacker] cropping option
* class Sequence rewind feature
* create new class Writer or Text for textblocks and textscroller using update/draw => then it can be an element of a layer
* object pooling for all elements like sprites and so on...
* better code documentation and what license to use?
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

## Changelog (or see GitHub ;o):

* 2014-12-25 [change] - a lot of changes and optimizations, API rewrite and so on
* 2014-02-02 [added] - traceContour and triangulation feature in CG.Bitmap class
* 2014-01-29 [update] - updated ClipperLib and poly2tri lib
* 2014-01-12 [bugfix] - fixed DebugDraw
             [change] - B2DPolygon origin is now midhandle
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
  + Atlas-Image (new API)
  + Atlas-TexturePacker
  + Bound (new API)
  + Buffer
  + Director (new API)
  + Emitter (new API)
  + Entity (new API)
    + B2DEntity
      + B2DBridge (new API)
      + B2DChainShape (new API)
      + B2DCircle (new API)
      + B2DLine (new API)
      + B2DPolygon (new API)
      + B2DRectangle (new API)
      + B2DRope (new API)
      + B2DTerrain (new API)
    + Bitmap (new API)
    + Font
    + Map
    + Sprite (new API)
      + Animation (new API)
      + Button (new API)
      + Particle (new API)
    + SpineAnimation (new API)
    + Text (new API)
  + Game
  + Layer (new API)
    + B2DWorld (new API: init, createCircle, createBox, createPoly, createBridge, createRope, createLine, createChainShape => Todo Rest ;o)
  + MapPoints
  + MapAreas
  + MapTileLayer
  + MapTileProperties
  + MediaAsset
  + Menu (new API)
  + Morph (new API)
  + Point
    + Vector
  + Screen (new API)
  + Sequence
  + Translate (new API)

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

For examples check the demos or take a look into the apidocs.