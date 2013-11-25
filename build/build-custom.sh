#!/bin/bash

#chmod ugo+x combine.sh 

#concat box2dhtml5 version
echo "> Building box2dhtml5 version."
echo ""

cat ../cangaja/base/base.js \
../cangaja/lib-ext/keymaster.js \
../cangaja/lib-ext/poly2tri.js \
../cangaja/lib-ext/clipper.js \
../cangaja/lib-ext/spine.js \
../cangaja/base/clock.js \
../cangaja/base/string.js \
../cangaja/renderer/canvasrenderer.js \
../cangaja/base/delta.js \
../cangaja/base/entity.js \
../cangaja/base/point.js \
../cangaja/base/vector.js \
../cangaja/base/rectangle.js \
../cangaja/base/bound.js \
../cangaja/base/buffer.js \
../cangaja/sprite/sprite.js \
../cangaja/atlas/atlas-image.js \
../cangaja/atlas/atlas-texturepacker.js \
../cangaja/sprite/animation.js \
../cangaja/base/bitmap.js \
../cangaja/sprite/button.js \
../cangaja/control/menu.js \
../cangaja/control/mediaasset.js \
../cangaja/text/font.js \
../cangaja/text/text.js \
../cangaja/control/director.js \
../cangaja/control/screen.js \
../cangaja/control/layer.js \
../cangaja/tilemap/maptilelayer.js \
../cangaja/tilemap/maptileproperties.js \
../cangaja/tilemap/mappoint.js \
../cangaja/tilemap/maparea.js \
../cangaja/tilemap/map.js \
../cangaja/control/sequence.js \
../cangaja/control/translate.js \
../cangaja/control/morph.js \
../cangaja/sprite/particle.js \
../cangaja/control/emitter.js \
../cangaja/lib-ext/box2dhtml5/box2d-html5.js \
../cangaja/lib-ext/box2dhtml5/b2DebugDraw.js \
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


echo "> Files merged."
echo ""




#running yuicompressor
java -jar yuicompressor-2.4.8.jar ../cangaja/lib/cangaja.js -o ../cangaja/lib/cangaja.min.js --charset utf-8
echo "> Minified standard version (yuicompressor)."
echo ""

#running closure compiler
#java -jar compiler.jar --js=../cangaja/lib/cangaja.js --js_output_file=../cangaja/lib/cangaja-closure.min.js
#echo "> Minified standard version (closure compiler)."
#echo ""





#concat all libs
cat ../cangaja/lib/cangaja.js ../cangaja/lib-ext/buzz.js ../cangaja/lib-ext/hammer.js ../cangaja/lib-ext/stats.js > ../cangaja/lib/cangaja.all.js
echo "> generated lib version, added libs buzz and hammer."
echo ""

#running yuicompressor
java -jar yuicompressor-2.4.8.jar ../cangaja/lib/cangaja.all.js -o ../cangaja/lib/cangaja.all.min.js --charset utf-8
echo "> Minified lib version (yuicompressor)."
echo ""

#running closure compiler
#java -jar compiler.jar --js=../cangaja/lib/cangaja.all.js --js_output_file=../cangaja/lib/cangaja-closure.all.min.js
#echo "> Minified lib version (closure compiler)."
#echo ""




#add intro to minified file
#cat ../cangaja/base/intro.js ../cangaja/lib/cangaja.min.js > ../cangaja/lib/cangaja.min.js
#echo "> Added intro to minified file."
#echo ""

#copy also to the template folders
cp ../cangaja/lib/cangaja.all.js ../templates/html5/cangaja.all.js
cp ../cangaja/lib/cangaja.all.min.js ../templates/html5/cangaja.all.min.js
cp ../cangaja/lib/cangaja.all.js ../templates/ejecta/cangaja.all.js
cp ../cangaja/lib/cangaja.all.min.js ../templates/ejecta/cangaja.all.min.js

echo "> copied cangaja lib to template folders (html5 & ejecta)"
echo ""
