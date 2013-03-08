/**
 * @description
 *
 * CG.Map supports loading and rendering maps from the editor Tiled.
 * XML and JSON file types are supported.
 * XML => supported tiled encodings are csv and xml (see settings!). base64, base64(gzip) and base64(zlib) are not supported!
 *
 * Supported types of the object layer are:
 * - object/group (rectangle?)
 * - tile element, reference point is bottom/CG.LEFT
 *
 * These object layer types are used to generate Point and Bound objects and can be used to position sprites, what ever in the map.
 *
 * @class CG.Map
 * @extends CG.Entity
 *
 * TODO spacing and margin ?
 * TODO own buffer for drawing => split screen possible?
 * TODO update & draw method 50%
 *
 */
CG.Entity.extend('Map', {
    /**
     * @method init
     * @constructor
     * @param width {Number} width of the map
     * @param height {Number} height of the map
     * @param mapname {string} mapname
     * @return {*}
     */
    init:function (width, height, mapname) {
        this._super(mapname)

        /**
         * @property elements
         * @type {Array}
         */
        this.elements = [] //how handle elements in maps? experimental collision detection at the moment with only one
        //point and areas from tilemap editor
        //using as references for external objects in layers?
        //how to handle the relative position to the position of the map?

        /**
         * @property points
         * @type {Array}
         */
        this.points = [] // position points (tiles) of tilemap editor => position point and type?
        /**
         * @property areas
         * @type {Array}
         */
        this.areas = [] // group objects e.g. area for objects of tilemap editor => bound and type?
        /**
         * @property position
         * @type {CG.Point}
         */
        this.position = new CG.Point(0, 0) // needed as relative point for points and areas
        /**
         * @property changemap
         * @type {String}
         */
        this.changemap = ''
        /**
         * @description
         *
         * If set to true the map is being updated with method updateAnimation.
         * See also method description of updateAnimation!
         *
         * @property animated
         * @type {Boolean}
         */
        this.animated = false //performance eater if true ;o(
        /**
         * @property animDelayFactor
         * @type {Number}
         */
        this.animDelayFactor = 20
        /**
         * @property atlas
         * @type {Image}
         */
        this.atlas = new Image()
        /**
         * @property atlaswidth
         * @type {Number}
         */
        this.atlaswidth = 0
        /**
         * @property atlasheight
         * @type {Number}
         */
        this.atlasheight = 0
        /**
         * @property atlastranscol
         * @type {String}
         */
        this.atlastranscol = '' //
        //ejecta has no DOMParser!
        if (typeof(ejecta) == 'undefined') {
            /**
             * @property xml
             * @type {String}
             */
            this.xml = ''
            /**
             * @property parser
             * @type {DOMParser}
             */
            this.parser = new DOMParser()
            /**
             * @property xmlDoc
             * @type {String}
             */
            this.xmlDoc = ''
        }
        /**
         * @property json
         * @type {Object}
         */
        this.json = {}
        /**
         * @description
         *
         * The tiled layer are parsed into separate layers
         *
         * @property layers
         * @type {Array}
         */
        this.layers = [] //can contain maptilelayer or objectlayer
        /**
         * @description
         *
         * Defines the layer to draw:
         * all - for all layers
         * name - the name of layer to draw
         * index - array index of layer
         *
         * @property renderlayer
         * @type {String}
         */
        this.renderlayer = 'all' //render layer: all for all layers, name of layer or array index for example 0 ;o)
        /**
         * @property tileproperties
         * @type {Array}
         */
        this.tileproperties = [] //properties of the tiles
        /**
         * @property orientation
         * @type {String}
         */
        this.orientation = ''
        /**
         * @property width
         * @type {Number}
         */
        this.width = 0
        /**
         * @property height
         * @type {Number}
         */
        this.height = 0
        /**
         * @property tilewidth
         * @type {Number}
         */
        this.tilewidth = 0
        /**
         * @property tileheight
         * @type {Number}
         */
        this.tileheight = 0
        /**
         * @property tileset
         * @type {Object}
         */
        this.tileset = {
            tilewidth:0,
            tileheight:0,
            offsetx:0,
            offsety:0,
            spacing:0,
            margin:0
        }
        /**
         * @property xspeed
         * @type {Number}
         */
        this.xspeed = 0
        /**
         * @property yspeed
         * @type {Number}
         */
        this.yspeed = 0
        /**
         * @property xscale
         * @type {Number}
         */
        this.xscale = 1
        /**
         * @property yscale
         * @type {Number}
         */
        this.yscale = 1
        /**
         * @property alpha
         * @type {Number}
         */
        this.alpha = 1
        /**
         * @property wrapX
         * @deprecated
         * @type {Boolean}
         */
        this.wrapX = false //stuff from diddy?
        /**
         * @property wrapY
         * @deprecated
         * @type {Boolean}
         */
        this.wrapY = false //stuff from diddy?
        /**
         * @property layertocheck
         * @type {Number}
         */
        this.layertocheck = 0 //as default use layer 0 for collision detection
        return this
    },
    /**
     * @description
     *
     * Load and parse an xml tilemap file. It can handle the tiled XML and CSV format.
     * All other formats are not supported!
     *
     * @method loadMapXml
     * @param xmlfile {string/object} xmlfile path or mediaasset object with data of tiled map xml
     */
    loadMapXml:function (xmlfile) {
        this.changemap = ''
        this.animated = false
        this.layers = []

        //from asset
        if (typeof xmlfile == 'string') {
            this.xml = loadString(xmlfile)
        } else {
            this.xml = xmlfile.data
        }
        this.removeJsonData()

        this.xmlDoc = this.parser.parseFromString(this.xml, 'text/xml')

        //get map
        var tilemap = map.xmlDoc.getElementsByTagName('map')[0]
        this.orientation = tilemap.getAttribute('orientation')
        this.width = parseInt(tilemap.getAttribute('width'))
        this.height = parseInt(tilemap.getAttribute('height'))
        this.tilewidth = parseInt(tilemap.getAttribute('tilewidth'))
        this.tileheight = parseInt(tilemap.getAttribute('tileheight'))

        var childcount = tilemap.childElementCount

        //tilemap.firstElementChild.nextElementSibling.nextElementSibling
        var element = tilemap.firstElementChild
        for (i = 0; i < childcount; i++) {
            console.log('>' + element.nodeName)
            switch (element.nodeName) {
                case 'tileset':
                    //read tileset settings
                    //only one tileset for the moment
                    this.tileset.tilewidth = parseInt(element.getAttribute('tilewidth'))
                    this.tileset.tileheight = parseInt(element.getAttribute('tileheight'))
                    if (element.getAttribute('spacing')) {
                        this.tileset.spacing = parseInt(element.getAttribute('spacing'))
                    }
                    if (element.getAttribute('margin')) {
                        this.tileset.margin = parseInt(element.getAttribute('margin'))
                    }
                    if (element.getElementsByTagName('tileoffset')[0]) {
                        this.tileset.offsetx = parseInt(element.getElementsByTagName('tileoffset')[0].getAttribute('x'))
                        this.tileset.offsety = parseInt(element.getElementsByTagName('tileoffset')[0].getAttribute('y'))
                    }
                    var image = element.getElementsByTagName('image')[0]
                    this.atlas.src = 'media/map/' + image.getAttribute('source')

                    this.atlaswidth = parseInt(image.getAttribute('width'))
                    this.atlasheight = parseInt(image.getAttribute('height'))
                    this.atlastranscol = image.getAttribute('trans')

                    break
                case 'layer':
                    //get tilemap data of layer
                    var tl = new CG.MapTileLayer()
                    data = element.getElementsByTagName('data')[0]

                    if (data.getAttribute('encoding') == 'csv') {
                        tl.tiles = data.textContent.replace(/(\r\n|\n|\r)/gm, '').split(',')
                        console.log('map encoding csv [layer ' + i + ']')
                    } else if (data.getAttribute('encoding') == 'base64' && data.getAttribute('compression') == 'gzip') {
                        throw 'base64 gzip compressed map format not supported at the moment'
                    } else if (data.getAttribute('encoding') == 'base64' && data.getAttribute('compression') == 'zlib') {
                        throw 'base64 zlib compressed map format not supported at the moment'
                    } else if (data.getAttribute('encoding') == 'base64') {
                        throw 'base64 map format not supported at the moment'
                    } else {
                        console.log('map encoding xml [layer ' + i + ']')
                        var tiles = element.getElementsByTagName('tile')
                        for (x in tiles) {
                            if (x < tiles.length) {
                                tl.tiles[x] = parseInt(tiles[x].getAttribute('gid'))
                            }
                        }
                    }

                    tl.name = element.getAttribute('name')
                    tl.width = parseInt(element.getAttribute('width'))
                    tl.height = parseInt(element.getAttribute('height'))
                    if (element.getAttribute('opacity')) {
                        tl.opacity = parseFloat(element.getAttribute('opacity'))
                    }
                    if (element.getAttribute('visible') === '0') {
                        tl.visible = false
                    }
                    this.layers.push(tl)
                    break
                case 'objectgroup':
                    //get tilemap data of grouplayer
                    console.log('grouplayer found')
                    var objects = element.getElementsByTagName('object')
                    for (o in objects) {
                        if (o < objects.length) {
                            var obj = objects[o]
                            var name = obj.getAttribute('name')
                            if (obj.getAttribute('gid')) {
                                //tile as object/point
                                this.points.push(
                                    new CG.MapPoint(
                                        new CG.Point(
                                            parseInt(obj.getAttribute('x')), parseInt(obj.getAttribute('y'))), this.position, obj.getAttribute('name'), parseInt(obj.getAttribute('gid'))))
                                console.log('tile as oject found: ' + name)
                                console.log(obj)
                            } else if (obj.getAttribute('width')) {
                                type = false
                                properties = obj.getElementsByTagName('property')
                                console.log(properties.length)
                                for (var p = 0, l = properties.length; p < l; p++) {
                                    if (properties[p].getAttribute('name') == 'type') {
                                        type = properties[p].getAttribute('value')
                                    }
                                }

                                //object group
                                this.areas.push(
                                    new CG.MapArea(
                                        new CG.Bound(
                                            parseInt(obj.getAttribute('x')), parseInt(obj.getAttribute('y')), parseInt(obj.getAttribute('width')), parseInt(obj.getAttribute('height'))), this.position, obj.getAttribute('name'), type))
                                console.log('group object found: ' + name)
                                console.log(obj)
                            } else if (obj.getElementsByTagName('polygon').length > 0) {
                                console.log('polygon found: ' + name)
                            } else if (obj.getElementsByTagName('polyline').length > 0) {
                                console.log('polyline found: ' + name)
                            }
                        }
                    }
                    break

            }
            element = element.nextElementSibling
        }


        //get tile properties
        this.tileproperties = Array(parseInt((this.atlaswidth / this.tilewidth)) * parseInt((this.atlasheight / this.tileheight)))
        var tiles = map.xmlDoc.getElementsByTagName('tileset')[0].getElementsByTagName('tile')
        var time = new Date().getTime()
        for (i in tiles) {
            var tprop = new CG.MapTileProperties()
            var tile = tiles[i]

            if (i < this.tileproperties.length) {
                var id = tile.getAttribute('id')
                var properties = tile.getElementsByTagName('properties')[0].getElementsByTagName('property')
                for (p in properties) {
                    if (p < properties.length) {
                        var tp = properties[p]
                        var elem = tp.getAttribute('name')
                        var value = tp.getAttribute('value')
                        if (elem == 'name') {
                            tprop.name = value
                        } else if (elem == 'anim_delay') {
                            tprop.animDelay = parseInt(value)
                            tprop.delayTimer = time
                            this.animated = true
                        } else if (elem == 'anim_direction') {
                            tprop.animDirection = parseInt(value)
                        } else if (elem == 'anim_next') {
                            tprop.animNext = parseInt(value)
                            tprop.animated = true
                        }
                    }
                }
                this.tileproperties[id] = tprop
            }
        }
        return this
    },

    /**
     * @description
     *
     * Load and parse an tilemap json file. Use the tiled json export.
     * Hopefully the json format has the same functionality as the xml loader ;o)
     *
     * @method loadMapJson
     * @param jsonfile {string/object} jsonfile path or mediaasset object with data of tiled map xml
     */
    loadMapJson:function (jsonfile) {
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
        this.width = this.json.width
        this.height = this.json.height
        this.tilewidth = this.json.tilewidth
        this.tileheight = this.json.tileheight

        //tilesets
        for (i = 0, l = this.json.layers.length; i < l; i++) {
            switch (this.json.layers[i].type) {
                case 'tilelayer':
                    //get tilemap data of layer
                    var tl = new CG.MapTileLayer()
                    tl.tiles = this.json.layers[i].data
                    tl.name = this.json.layers[i].name
                    tl.width = this.json.layers[i].width
                    tl.height = this.json.layers[i].height
                    tl.opacity = this.json.layers[i].opacity
                    tl.visible = this.json.layers[i].visible
                    this.layers.push(tl)
                    break
                case 'objectgroup':
                    //get tilemap data of grouplayer
                    console.log('grouplayer found')
                    var objects = this.json.layers[i].objects
                    for (o in objects) {
                        if (o < objects.length) {
                            var obj = objects[o]
                            var name = obj.name
                            if (obj.gid) {
                                //tile as object/point
                                this.points.push(
                                    new CG.MapPoint(
                                        new CG.Point(
                                            parseInt(obj.x), parseInt(obj.y)), this.position, obj.name, parseInt(obj.gid)))

                                console.log('tile as oject found: ' + name)
                                console.log(obj)
                            } else if (obj.width) {
                                //object group
                                this.areas.push(
                                    new CG.MapArea(
                                        new CG.Bound(
                                            parseInt(obj.x), parseInt(obj.y), parseInt(obj.width), parseInt(obj.height)), this.position, obj.name, obj.properties.type))

                                console.log('group object found: ' + name)
                                console.log(obj)
                            } else if (obj.polygon) {
                                console.log('polygon found: ' + name)
                            } else if (obj.polyline) {
                                console.log('polyline found: ' + name)
                            }
                        }
                    }
                    break

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

        for (id in tiles) {
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
    },


    /**
     * @description
     *
     * This is the main method for map drawing. Orthogonal maps works very well. Isometric maps are not well implemented yet.
     *
     * @method drawMap
     *
     * @param sx {Number} sx top left coord for canvas drawing
     * @param sy {Number} sy top left coord for canvas drawing
     * @param bx {Number} bx top left x coord of bound in tilemap
     * @param by {Number} by top left y coord of bound in tilemap
     * @param bw {Number} bw width of bound in tilemap
     * @param bh {Number} bh height of bound in tilemap
     * @param callback {callback} callback for collision handling - callback(obj,maptileproperties)
     */
    drawMap:function (sx, sy, bx, by, bw, bh, callback) {
        this.position.x = bx
        this.position.y = by

        this.bx = bx || this.bx || 0
        this.by = by || this.by || 0
        this.bw = bw || Game.bound.width
        this.bh = bh || Game.bound.height
        this.sx = sx || this.sx || 0
        this.sy = sy || this.sy || 0
        this.callback = callback || false

        //update all points an areas
        this.updatePointsAndAreas()

        if (this.changemap != '') {
            this.loadMap(this.changemap)
        }
        if (this.visible) {
            this.updateAnimation()
            if (this.layers.length > 0) {
                for (var layer = 0, l = this.layers.length; layer < l; layer++) {
                    var tl = this.layers[layer]
                    //render control, render by name, layer number or 'all''
                    if (this.renderlayer == tl.name || this.renderlayer == layer || this.renderlayer == 'all') {
                        // MAP ORTHOGONAL
                        if (this.orientation == 'orthogonal' && tl.visible == true) {
                            modx = (this.bx * this.xscale) % this.tilewidth
                            mody = (this.by * this.yscale) % this.tileheight
                            y = this.by
                            my = Math.floor(parseFloat(this.by) / parseFloat(this.tileheight)) >> 0

                            var tmpy = (this.by + this.bh + this.tileheight)
                            while (y < tmpy) {
                                x = this.bx //- this.tilewidth
                                mx = Math.floor(parseFloat(this.bx) / parseFloat(this.tilewidth)) >> 0

                                var tmpx = (this.bx + this.bw + this.tilewidth)
                                while (x < tmpx) {
                                    if ((this.wrapX || (mx >= 0 && mx < this.width)) && (this.wrapY || (my >= 0 && my < this.height))) {
                                        mx2 = mx
                                        my2 = my

                                        while (mx2 < 0) {
                                            mx2 += this.width
                                        }

                                        while (mx2 >= this.width) {
                                            mx2 -= this.width
                                        }

                                        while (my2 < 0) {
                                            my2 += this.height
                                        }

                                        while (my2 >= this.height) {
                                            my2 -= this.height
                                        }

                                        gid = tl.tiles[mx2 + my2 * tl.width] - 1

                                        if (gid >= 0) {
                                            if (modx < 0) {
                                                modx += this.tilewidth
                                            }
                                            if (mody < 0) {
                                                mody += this.tileheight
                                            }
                                            rx = x - modx - this.bx
                                            ry = y - mody - this.by


                                            //time for collision detection?
                                            //limit to specific tilemap layer?
                                            //collision depending on bounds and direction (xspeed/yspeed)?
                                            //include some layer functionality here and render some sprites between map layers?
                                            if (this.elements.length > 0 && this.layertocheck == l) {
                                                for (var o = 0, l = this.elements.length; o < l; o++) {
                                                    if (this.checkMapCollision(this.elements[0], rx, ry)) {
                                                        this.callback(this.elements[o], this.tileproperties[gid])
                                                    }
                                                }
                                            }


                                            //margin/spacing?
                                            cx = (gid % (this.atlaswidth / this.tilewidth)) * this.tilewidth
                                            cy = Math.floor(this.tilewidth * gid / this.atlaswidth) * this.tileheight

                                            Game.b_ctx.save()
                                            Game.b_ctx.globalAlpha = this.layers[layer].opacity
                                            Game.b_ctx.translate(rx, ry)
                                            try {
                                                Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileheight, this.sx, this.sy, this.tilewidth * this.xscale, this.tileheight * this.yscale)
                                            } catch (e) {
                                            }
                                            Game.b_ctx.restore()
                                        }
                                    }
                                    x = x + this.tilewidth
                                    mx += 1
                                }
                                y = y + this.tileheight
                                my += 1
                            }
                        }
                        // MAP ISOMETRIC
                        else if (this.orientation == 'isometric') {
                            var t = tl.width + tl.height
                            for (var y = 0; y < t; y++) {
                                var ry = y
                                var rx = 0
                                while (ry >= tl.height) {
                                    ry -= 1
                                    rx += 1
                                }


                                while (ry >= 0 && rx < tl.width) {
                                    var gid = tl.tiles[rx + ry * tl.width]
                                    var xpos = (rx - ry - 1) * this.tilewidth / 2 - bx
                                    var ypos = (rx + ry + 1) * this.tileheight / 2 - by
                                    if (xpos > -this.tileset.tilewidth && xpos < bw && ypos > -this.tileset.tileheight && ypos < bh) {
                                        if (gid > 0) {
                                            cx = ((gid - 1) % (this.atlaswidth / this.tilewidth)) * this.tilewidth
                                            cy = Math.floor(this.tilewidth * (gid - 1) / this.atlaswidth) * this.tileset.tileheight
                                            Game.b_ctx.save()
                                            Game.b_ctx.globalAlpha = this.layers[layer].opacity
                                            Game.b_ctx.translate(xpos, ypos)
                                            try {
                                                Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileset.tileheight, 0, 0, this.tilewidth * this.xscale, this.tileset.tileheight * this.yscale)
                                            } catch (e) {

                                            }
                                            Game.b_ctx.restore()
                                        }
                                    }
                                    ry -= 1
                                    rx += 1
                                }
                            }
                        }
                    }
                    //                else {
                    //                    throw 'unknown orientation: ' + this.orientation
                    //                }
                }
            }
        }
    },

    /**
     * @description
     *
     * Update all areas and points elements.
     *
     * @method updatePointsAndAreas
     */
    updatePointsAndAreas:function () {
        this.points.forEach(function (point, index) {
            point.update()
        }, this)
        this.areas.forEach(function (area, index) {
            area.update()
        }, this)
    },


    /**
     * @description
     *
     * Get all point(s) with the given name in the points
     *
     * @method getPointsByName
     *
     * @param name {string} name of the points to return
     * @return {false/array} returns false or an array with point(s)
     */
    getPointsByName:function (name) {
        points = []
        for (var i = 0, l = this.points.length; i < l; i++) {
            if (this.points[i].name === name) {
                points.push(this.points[i])
            }
        }
        if (points.length > 0) {
            return points
        }
        return false
    },

    /**
     * @description
     *
     * Get all areas with the given name
     *
     * @method getAreasByName
     *
     * @param name {string} name of the area(s) to return
     * @return {false/array} returns false or an array with area(s)
     */
    getAreasByName:function (name) {
        areas = []
        for (var i = 0, l = this.areas.length; i < l; i++) {
            if (this.areas[i].name === name) {
                areas.push(this.areas[i])
            }
        }
        if (areas.length > 0) {
            return areas
        }
        return false
    },


    /**
     * @description
     *
     * Defines layer drawing, See property options
     *
     * @method setLayerToRender
     *
     * @param mixed {mixed} mixed define the map layer(s) to render 'all' (string) for all layers, array index (integer) for layer to render or 'name' (string) of layer to render'
     */
    setLayerToRender:function (mixed) {
        this.renderlayer = mixed
        return this
    },

    /**
     * @description
     *
     * The update method is not complete yet and only experimental.
     * At the final stage the methods updateAnimation and updatePointsAndAreas have to be called from here!
     * Then also a map class can be added to a layer as an element for auto update/draw from Game.director!
     *
     * @method update
     */
    update:function () {
        //TODO automatic movement of map or other stuff?
        this.bx += this.xspeed
        this.by += this.yspeed
        if (this.getBounds().width - Game.bound.width < this.bx) {
            this.xspeed = this.xspeed * -1
        }
        if (this.bx < 0) {
            this.xspeed = this.xspeed * -1
        }
        if (this.getBounds().height - Game.bound.height < this.by) {
            this.yspeed = this.yspeed * -1
        }
        if (this.by < 0) {
            this.yspeed = this.yspeed * -1
        }
        return this
    },

    /**
     * yust calls drawMap ;o)
     */
    draw:function () {
        this.drawMap(this.bx, this.by, this.bw, this.bh, this.sx, this.sy, this.callback)
        return this
    },

    /**
     * @description
     *
     * Get the bounds of the map
     *
     * @method getBounds
     */
    getBounds:function () {
        return {
            width:this.width * this.tilewidth,
            height:this.height * this.tileheight
        }
    },

    /**
     * @description
     *
     * Updates all tilemap properties of the map.
     *
     * Supported custom tiled map properties for now are (see also tilemap examples):
     * anim_delay       => time to used to display an switch to next tile
     * anim_direction   => direction for next tile 1 = jump forward, -1 = jump back
     * anim_next        => defines the offset
     *
     * With this tile properties it is possible to define tilemap animations.
     * These must be defined in the tilemap property window with key/value pairs
     *
     * @method updateAnimation
     */
    updateAnimation:function () {
        // update if map is visible
        if (this.visible && this.animated) {
            if (this.layers.length > 0) {
                for (var layer = 0, l = this.layers.length; layer < l; layer++) {
                    var newtime = new Date().getTime()
                    for (t = 0; t < this.layers[layer].tiles.length; t++) {
                        var tile = this.layers[layer].tiles[t]
                        if (tile > 0) {
                            try {
                                var tprop = this.tileproperties[tile - 1]
                                if (tprop.animated && tprop.animDirection != 0) {
                                    if (newtime > (tprop.delayTimer + (tprop.animDelay / this.animDelayFactor))) {
                                        switch (tprop.animDirection) {
                                            case 1:
                                                this.layers[layer].tiles[t] += tprop.animNext
                                                this.tileproperties[tile - 1 + tprop.animNext].delayTimer = newtime
                                                break
                                            case -1:
                                                this.layers[layer].tiles[t] -= tprop.animNext
                                                this.tileproperties[tile - 1 - tprop.animNext].delayTimer = newtime
                                                break
                                            default:
                                                break
                                        }
                                    }
                                }
                            } catch (e) {

                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * @description
     *
     * Adds a object to the element array, used at the moment for collision detection to tilemap.
     *
     * @method addElement
     *
     * @param {obj} element to to add to elements array
     */
    addElement:function (element) {
        this.elements.push(element)
        return this
    },

    /**
     * @description
     * Checks if the attached element collides with an tile of the tilemap
     *
     * @method checkMapCollision
     *
     * @param {obj} element to check for
     * @param {Number} rx current rx of rendermap method
     * @param {Number} ry current ry of rendermap method
     *
     * @return {boolean} returns true or false
     */
    checkMapCollision:function (element, rx, ry) {
        //TODO return detailed collision object or offsets instead of true?
        if (element.boundingradius > 0) {
            //circular collision
            xr = element.boundingradius / 2 * element.xscale
            yr = element.boundingradius / 2 * element.yscale
            if (element.position.x + xr >= rx && element.position.x - xr <= rx + this.tilewidth && element.position.y + yr >= ry && element.position.y - yr <= ry + this.tileheight) {
                return true
            }
        } else {
            //bounding collision
            xw = element.width / 2 * element.xscale
            yh = element.height / 2 * element.yscale
            if (element.position.x + xw >= rx && element.position.x - xw <= rx + this.tilewidth && element.position.y + yh >= ry && element.position.y - yh <= ry + this.tileheight) {
                return true
            }
        }
        return false
    },

    /**
     * @description
     *
     * Checks if a external object(s) collides with the areas of the tiled map.
     * This can be elements from an layer or the map itself.
     *
     * @param {Array} objarray to check for a areas collision
     * @param {Callback} callback what should happen
     */
    checkElementsToAreasCollision:function (objarray, callback) {
        for (var o = 0, ol = objarray.length; o < ol; o++) {

            obj = objarray[o].checkCollision(this.areas, callback)
        }
        return this
    },

    /**
     * @description removes the json data of the map object
     * @method removeJsonData
     */
    removeJsonData:function () {
        this.json = {}
        return this
    },
    /**
     * @description removes the xml data of the map object
     * @method removeXmlData
     */
    removeXmlData:function () {
        this.xml = ''
        //this.parser = new DOMParser()
        this.xmlDoc = ''
        return this
    }
})


