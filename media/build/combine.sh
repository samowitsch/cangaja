#!/bin/bash

#chmod ugo+x combine.sh 

cat ../engine/cangaja.js ../engine/string.js ../engine/delta.js ../engine/entity.js ../engine/point.js ../engine/vector.js ../engine/rectangle.js ../engine/bound.js ../engine/buffer.js ../engine/sprite.js ../engine/tpimage.js ../engine/texturepacker.js ../engine/animation.js ../engine/bitmap.js ../engine/button.js ../engine/menu.js ../engine/mediaasset.js ../engine/font.js ../engine/director.js ../engine/screen.js ../engine/layer.js ../engine/maptilelayer.js ../engine/maptileproperties.js ../engine/mappoint.js ../engine/maparea.js ../engine/map.js ../engine/sequence.js ../engine/translate.js ../engine/morph.js ../engine/particle.js ../engine/emitter.js ../engine/lib/Box2DWeb.js ../engine/b2d-vars.js ../engine/b2d-contactlistener.js ../engine/b2d-entity.js ../engine/b2d-layer.js ../engine/b2d-world.js > ../engine/lib/cangaja.js

echo "Files merged."

java -jar yuicompressor-2.4.7.jar ../engine/lib/cangaja.js -o ../engine/lib/cangaja.min.js --charset utf-8

echo "File minified."