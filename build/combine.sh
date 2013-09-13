#!/bin/bash

#chmod ugo+x combine.sh 


if [[ "$1" == "embox2d" ]]
then

#concat embox2d version
echo "Building embox2d version."

cat ../cangaja/cangaja.js \
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
../cangaja/lib/embox2d/box2d.min.js \
../cangaja/lib/embox2d/embox2d-helpers.js \
../cangaja/lib/embox2d/embox2d-html5canvas-debugDraw.js \
../cangaja/box2d/b2d-entity.js \
../cangaja/box2d/b2d-circle.js \
../cangaja/box2d/b2d-line.js \
../cangaja/box2d/b2d-rectangle.js \
../cangaja/box2d/b2d-polygon.js \
../cangaja/box2d/b2d-rope.js \
../cangaja/box2d/b2d-bridge.js \
../cangaja/box2d/b2d-world.js > ../cangaja/lib/cangaja.js

else

#concat box2dweb version
echo "Building box2dweb version."

cat ../cangaja/cangaja.js \
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
../cangaja/lib/Box2dWeb/Box2d.js \
../cangaja/box2d/b2d-vars.js \
../cangaja/box2d/b2d-entity.js \
../cangaja/box2d/b2d-circle.js \
../cangaja/box2d/b2d-line.js \
../cangaja/box2d/b2d-rectangle.js \
../cangaja/box2d/b2d-polygon.js \
../cangaja/box2d/b2d-rope.js \
../cangaja/box2d/b2d-bridge.js \
../cangaja/box2d/b2d-world.js > ../cangaja/lib/cangaja.js

fi


#../cangaja/lib/box2d.js/box2d.min.js \
#../cangaja/lib/box2d.js/embox2d-helpers.js \
#../cangaja/lib/box2d.js/embox2d-html5canvas-debugDraw.js \

#../cangaja/lib/Box2dWeb/Box2d.js \
#../cangaja/box2d/b2d-vars.js \


echo "Files merged."

#running yuicompressor
java -jar yuicompressor-2.4.7.jar ../cangaja/lib/cangaja.js -o ../cangaja/lib/cangaja.min.js --charset utf-8
echo "Minified standard version."


#concat all libs
cat ../cangaja/lib/cangaja.js ../cangaja/lib/buzz.js ../cangaja/lib/hammer.js ../cangaja/lib/stats.js > ../cangaja/lib/cangaja.all.js
echo "generated lib version, added libs buzz and hammer."

#running yuicompressor
java -jar yuicompressor-2.4.7.jar ../cangaja/lib/cangaja.all.js -o ../cangaja/lib/cangaja.all.min.js --charset utf-8
echo "Minified lib version."


#add intro to minified file
#cat ../cangaja/intro.js ../cangaja/lib/cangaja.min.js > ../cangaja/lib/cangaja.min.js
#echo "Added intro to minified file."

#copy also to the template folders
cp ../cangaja/lib/cangaja.all.js ../templates/html5/cangaja.all.js
cp ../cangaja/lib/cangaja.all.min.js ../templates/html5/cangaja.all.min.js
cp ../cangaja/lib/cangaja.all.js ../templates/ejecta/cangaja.all.js
cp ../cangaja/lib/cangaja.all.min.js ../templates/ejecta/cangaja.all.min.js
