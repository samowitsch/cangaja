#!/bin/bash

#chmod ugo+x combine.sh 

#concat box2dhtml5 version
echo "> Building box2dhtml5 version."
echo ""

cat ../cangaja/lib/clipper.js \
../cangaja/lib/poly2tri.js \
../cangaja/cangaja.js \
../cangaja/clock.js \
../cangaja/string.js \
../cangaja/renderer.js \
../cangaja/delta.js \
../cangaja/entity.js \
../cangaja/point.js \
../cangaja/vector.js \
../cangaja/rectangle.js \
../cangaja/bound.js \
../cangaja/buffer.js \
../cangaja/sprite.js \
../cangaja/texturepacker/tpimage.js \
../cangaja/texturepacker/texturepacker.js \
../cangaja/animation.js \
../cangaja/bitmap.js \
../cangaja/button.js \
../cangaja/menu.js \
../cangaja/mediaasset.js \
../cangaja/font.js \
../cangaja/text.js \
../cangaja/director.js \
../cangaja/screen.js \
../cangaja/layer.js \
../cangaja/tilemap/maptilelayer.js \
../cangaja/tilemap/maptileproperties.js \
../cangaja/tilemap/mappoint.js \
../cangaja/tilemap/maparea.js \
../cangaja/tilemap/map.js \
../cangaja/sequence.js \
../cangaja/translate.js \
../cangaja/morph.js \
../cangaja/particle.js \
../cangaja/emitter.js \
../cangaja/lib/box2dhtml5/box2d-html5.js \
../cangaja/lib/box2dhtml5/b2DebugDraw.js \
../cangaja/box2d/b2d-vars-html5.js \
../cangaja/box2d/b2d-entity.js \
../cangaja/box2d/b2d-circle.js \
../cangaja/box2d/b2d-line.js \
../cangaja/box2d/b2d-rectangle.js \
../cangaja/box2d/b2d-polygon.js \
../cangaja/box2d/b2d-terrain.js \
../cangaja/box2d/b2d-chainshape.js \
../cangaja/box2d/b2d-rope.js \
../cangaja/box2d/b2d-bridge.js \
../cangaja/box2d/b2d-world.js > ../cangaja/lib/cangaja.js



#../cangaja/lib/box2d.js/box2d.min.js \
#../cangaja/lib/box2d.js/embox2d-helpers.js \
#../cangaja/lib/box2d.js/embox2d-html5canvas-debugDraw.js \

#../cangaja/lib/Box2dWeb/Box2d.js \
#../cangaja/box2d/b2d-vars.js \


echo "> Files merged."
echo ""

#running yuicompressor
java -jar yuicompressor-2.4.8.jar ../cangaja/lib/cangaja.js -o ../cangaja/lib/cangaja.min.js --charset utf-8
echo "> Minified standard version."
echo ""


#concat all libs
cat ../cangaja/lib/cangaja.js ../cangaja/lib/buzz.js ../cangaja/lib/hammer.js ../cangaja/lib/stats.js > ../cangaja/lib/cangaja.all.js
echo "> generated lib version, added libs buzz and hammer."
echo ""

#running yuicompressor
java -jar yuicompressor-2.4.8.jar ../cangaja/lib/cangaja.all.js -o ../cangaja/lib/cangaja.all.min.js --charset utf-8
echo "> Minified lib version."
echo ""


#add intro to minified file
#cat ../cangaja/intro.js ../cangaja/lib/cangaja.min.js > ../cangaja/lib/cangaja.min.js
#echo "> Added intro to minified file."
#echo ""

#copy also to the template folders
cp ../cangaja/lib/cangaja.all.js ../templates/html5/cangaja.all.js
cp ../cangaja/lib/cangaja.all.min.js ../templates/html5/cangaja.all.min.js
cp ../cangaja/lib/cangaja.all.js ../templates/ejecta/cangaja.all.js
cp ../cangaja/lib/cangaja.all.min.js ../templates/ejecta/cangaja.all.min.js

echo "> copied cangaja lib to template folders (html5 & ejecta)"
echo ""
