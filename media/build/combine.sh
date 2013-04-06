#!/bin/bash

#chmod ugo+x combine.sh 

#concat all files
cat ../engine/cangaja.js \
../engine/string.js \
../engine/renderer.js \
../engine/delta.js \
../engine/entity.js \
../engine/point.js \
../engine/vector.js \
../engine/rectangle.js \
../engine/bound.js \
../engine/buffer.js \
../engine/sprite.js \
../engine/tpimage.js \
../engine/texturepacker.js \
../engine/animation.js \
../engine/bitmap.js \
../engine/button.js \
../engine/menu.js \
../engine/mediaasset.js \
../engine/font.js \
../engine/text.js \
../engine/director.js \
../engine/screen.js \
../engine/layer.js \
../engine/maptilelayer.js \
../engine/maptileproperties.js \
../engine/mappoint.js \
../engine/maparea.js \
../engine/map.js \
../engine/sequence.js \
../engine/translate.js \
../engine/morph.js \
../engine/particle.js \
../engine/emitter.js \
../engine/lib/Box2d.js \
../engine/b2d-vars.js \
../engine/b2d-entity.js \
../engine/b2d-circle.js \
../engine/b2d-line.js \
../engine/b2d-rectangle.js \
../engine/b2d-polygon.js \
../engine/b2d-rope.js \
../engine/b2d-bridge.js \
../engine/b2d-world.js > ../engine/lib/cangaja.js

echo "Files merged."

#running yuicompressor
java -jar yuicompressor-2.4.7.jar ../engine/lib/cangaja.js -o ../engine/lib/cangaja.min.js --charset utf-8
echo "Minified standard version."


#concat all libs
cat ../engine/lib/cangaja.js ../engine/lib/buzz.js ../engine/lib/hammer.js ../js/stats.js > ../engine/lib/cangaja.all.js
echo "generated lib version, added libs buzz and hammer."

#running yuicompressor
java -jar yuicompressor-2.4.7.jar ../engine/lib/cangaja.all.js -o ../engine/lib/cangaja.all.min.js --charset utf-8
echo "Minified lib version."


#add intro to minified file
#cat ../engine/intro.js ../engine/lib/cangaja.min.js > ../engine/lib/cangaja.min.js
#echo "Added intro to minified file."
