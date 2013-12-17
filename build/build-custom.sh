#!/bin/bash

#chmod ugo+x combine.sh 

#concat box2dhtml5 version
echo "> Building box2dhtml5 version."
echo ""

cat ../cangaja/base/base.js \
../cangaja/game/game.js \
../cangaja/lib-ext/math/transform.js \
../cangaja/lib-ext/input/keymaster.js \
../cangaja/lib-ext/math/poly2tri/poly2tri.js \
../cangaja/lib-ext/math/clipper/clipper.js \
../cangaja/lib-ext/spine/spine.js \
../cangaja/base/clock.js \
../cangaja/base/string.js \
../cangaja/renderer/canvasrenderer.js \
../cangaja/base/delta.js \
../cangaja/base/entity.js \
../cangaja/base/point.js \
../cangaja/base/vector.js \
../cangaja/base/bound.js \
../cangaja/base/buffer.js \
../cangaja/sprite/sprite.js \
../cangaja/spine/spine-animation.js \
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
../cangaja/box2d/b2d-world.js > ../src/cangaja.js


echo "> Files merged."
echo ""




#running yuicompressor
java -jar yuicompressor-2.4.8.jar ../src/cangaja.js -o ../src/cangaja.min.js --charset utf-8
echo "> Minified standard version (yuicompressor)."
echo ""

#running closure compiler
#java -jar compiler.jar --js=../src/cangaja.js --js_output_file=../src/cangaja-closure.min.js
#echo "> Minified standard version (closure compiler)."
#echo ""





#concat all libs
cat ../cangaja/lib/cangaja.js ../cangaja/lib-ext/input/hammer.js ../cangaja/lib-ext/sound/buzz.js ../cangaja/lib-ext/util/stats.js > ../src/cangaja.all.js
echo "> generated lib version, added libs hammer, buzz and stats."
echo ""

#running yuicompressor
java -jar yuicompressor-2.4.8.jar ../src/cangaja.all.js -o ../src/cangaja.all.min.js --charset utf-8
echo "> Minified lib version (yuicompressor)."
echo ""

#running closure compiler
#java -jar compiler.jar --js=../src/cangaja.all.js --js_output_file=../src/cangaja-closure.all.min.js
#echo "> Minified lib version (closure compiler)."
#echo ""




#add intro to minified file
#cat ../cangaja/base/intro.js ../src/cangaja.min.js > ../src/cangaja.min.js
#echo "> Added intro to minified file."
#echo ""

#copy also to the template folders
#cp ../src/cangaja.all.js ../templates/html5/cangaja.all.js
#cp ../src/cangaja.all.min.js ../templates/html5/cangaja.all.min.js
#cp ../src/cangaja.all.js ../templates/ejecta/cangaja.all.js
#cp ../src/cangaja.all.min.js ../templates/ejecta/cangaja.all.min.js

#echo "> copied cangaja lib to template folders (html5 & ejecta)"
#echo ""
