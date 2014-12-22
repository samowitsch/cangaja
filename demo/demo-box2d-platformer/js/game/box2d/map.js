/**
 * @description
 *
 * @class CG.Box2DMap
 * @extends CG.Map
 *
 */
CG.Map.extend('Box2DMap', {
    /**
     * @method init
     * @constructor
     * @return {*}
     */
    init: function (options) {
        this._super()

        CG._extend(this, {
            /**
             * polyline objects for box2dworld => CG.Chainshape
             */
            grounds: [],
            /**
             * rectangle objects for box2dworld => CG.Rectangle
             */
            ladders: [],
            /**
             * bridges objects for box2dworld => CG.Bridge
             */
            bridges: []
        })

        CG._extend(this, options)
        return this
    },
    /**
     * @description
     *
     * Custom json loader
     *
     * @method loadMapJson
     * @param jsonfile {string/object} jsonfile path or mediaasset object with data of tiled map xml
     */
    loadMapJson: function (jsonfile) {
        this.changemap = ''
        this.animated = false
        this.layers = []

        //from asset
        if (typeof jsonfile == 'string') {
            this.json = JSON.parse(loadString(jsonfile))
        } else {
            this.json = jsonfile.data
        }

        this.removeXmlData()

        //get map
        this.orientation = this.json.orientation
        this.mapColumns = this.json.width
        this.mapRows = this.json.height
        this.tilewidth = this.json.tilewidth
        this.tileheight = this.json.tileheight

        //tilesets
        for (var i = 0, l = this.json.layers.length; i < l; i++) {
            var type = this.json.layers[i].type

            if (type === 'tilelayer') {
                //get tilemap data of layer
                var tl = new CG.MapTileLayer()
                tl.tiles = this.json.layers[i].data
                tl.name = this.json.layers[i].name
                tl.width = this.json.layers[i].width
                tl.height = this.json.layers[i].height
                tl.opacity = this.json.layers[i].opacity
                tl.visible = this.json.layers[i].visible
                this.layers.push(tl)
            }
            else if (type === 'objectgroup') {
                //get tilemap data of grouplayer
                var objectgroup = objects = this.json.layers[i],
                    objects = objectgroup.objects


                for (o in objects) {
                    if (o < objects.length) {

                        var obj = objects[o]

                        if (objectgroup.name === 'ladder') {
                            this.ladders.push(obj)
                        }
                        else if (objectgroup.name === 'ground') {
                            this.grounds.push(obj)
                        }
                        else if (objectgroup.name === 'bridge') {
                            this.bridges.push(obj)
                        }
                    }
                }
            }
        }


        //get tile properties
        this.atlas.src = 'media/map/' + this.json.tilesets[0].image

        this.atlaswidth = this.json.tilesets[0].imagewidth
        this.atlasheight = this.json.tilesets[0].imageheight
        this.atlastranscol = this.json.tilesets[0].transparentcolor

        this.tileproperties = Array(parseInt((this.atlaswidth / this.tilewidth)) * parseInt((this.atlasheight / this.tileheight)))
        var tiles = this.json.tilesets[0].tileproperties

        var time = new Date().getTime()

        for (var id in tiles) {
            var tprop = new CG.MapTileProperties()
            var tile = tiles[id]
            tprop.name = tile.name
            tprop.animDelay = parseInt(tile.anim_delay)
            tprop.delayTimer = (tprop.animDelay > 0) ? time : 0
            tprop.animated = (tprop.animDelay > 0) ? true : false
            tprop.animNext = parseInt(tile.anim_next)
            if (tprop.animDelay > 0) {
                this.animated = true
            }
            tprop.animDirection = parseInt(tile.anim_direction)
            this.tileproperties[id] = tprop

        }
        return this
    }
})


