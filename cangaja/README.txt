/*

Features:
+ Sound using buzz.js
+ Input handling with hammer.js
+ Director
+ Screens
+ Layers
+ Sprites
+ Animations
+ Collision handling
+ Emitter
+ Particle
+ Morphing
+ Translation
+ Map support (Tiled .tmx) inspired by diddy Monkey framework
+ Font support (Glyphdesigner EZ Gui Text) inspired by fantomengine Monkey framework
+ TexturePacker support (TexturePacker Generic XML with no crop/rotation)

Wish list:
+ Sequence 'rewind'?'
+ add class Writer or Text for writing text using update/draw => it can be an element of a layer
+ object pooling
+ Asset fallback by ...ByName('') to filename if no name is specified


Performance tweeks and tipps:
+ parseInt is removed at critical places
+ updateAnimation of class Map is a cpu eater ;o)
+ delete works only for properties
+ delete objects with: obj = null

Bad things:
+ Mediaasset, Mobile Safari cant fire onload on images ;o(
+ avoid creating & deleting objects => object pooling?

*/