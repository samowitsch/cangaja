/**
 * @description
 * class Map supports loading and rendering maps from the editor Tiled.
 * XML and JSON file types are supported.
 * XML => supported tiled encodings are csv and xml (see settings!). base64, base64(gzip) and base64(zlib) are not supported!
 *
 * Supported types of the object layer are:
 * - object/group (rectangle?)
 * - tile element, reference point is bottom/left
 *
 * These object layer types are used to generate Point and Bound objects and can be used to position sprites, what ever in the map.
 *
 * @constructor
 * @augments Entity
 *
 * TODO spacing and margin ?
 * TODO own buffer for drawing => split screen possible?
 * TODO update & draw method 50%
 *
 * @param {integer} width of the map
 * @param {integer} height of the map
 * @param {string} mapname
 */
CG.Entity.extend('Map', {
    init: function(width, height, mapname) {
        this._super(mapname)

        this.elements = [] //how handle elements in maps? experimental collision detection at the moment with only one
        //point and areas from tilemap editor
        //using as references for external objects in layers?
        //how to handle the relative position to the position of the map?
        this.points = [] // position points (tiles) of tilemap editor => position point and type?
        this.areas = [] // group objects e.g. area for objects of tilemap editor => bound and type?
        this.position = new CG.Point(0, 0) // needed as relative point for points and areas
        this.changemap = ''

        this.animated = false //perfromance eater if true ;o(
        this.animDelayFactor = 20

        this.atlas = new Image()
        this.atlaswidth = 0
        this.atlasheight = 0
        this.atlastranscol = '' //
        //ejecta has no DOMParser!
        if(typeof(ejecta) == 'undefined') {
            this.xml = ''
            this.parser = new DOMParser()
            this.xmlDoc = ''
        }

        this.json = {}

        this.layers = [] //can contain maptilelayer or objectlayer
        this.renderlayer = 'all' //render layer: all for all layers, name of layer or array index for example 0 ;o)
        this.tileproperties = [] //properties of the tiles
        this.orientation = ''
        this.width = 0
        this.height = 0
        this.tilewidth = 0
        this.tileheight = 0
        this.tileset = {
            tilewidth: 0,
            tileheight: 0,
            offsetx: 0,
            offsety: 0,
            spacing: 0,
            margin: 0
        }

        this.xspeed = 0
        this.yspeed = 0


        this.xscale = 1
        this.yscale = 1
        this.alpha = 1

        this.wrapX = false //stuff from diddy?
        this.wrapY = false //stuff from diddy?
        //collision detection
        //this.elements = [] //if not empty elements would checked with checkMapCollision
        this.layertocheck = 0 //as default use layer 0 for collision detection
        return this
    },
    /**
     * @description loadMapXml - load and parse an xml tilemap file
     *
     * @param {string/object} xmlfile path or mediaasset object with data of tiled map xml
     */
    loadMapXml: function(xmlfile) {
        this.changemap = ''
        this.animated = false
        this.layers = []

        //from asset
        if(typeof xmlfile == 'string') {
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
        for(i = 0; i < childcount; i++) {
            console.log('>' + element.nodeName)
            switch(element.nodeName) {
            case 'tileset':
                //read tileset settings
                //only one tileset for the moment
                this.tileset.tilewidth = parseInt(element.getAttribute('tilewidth'))
                this.tileset.tileheight = parseInt(element.getAttribute('tileheight'))
                if(element.getAttribute('spacing')) {
                    this.tileset.spacing = parseInt(element.getAttribute('spacing'))
                }
                if(element.getAttribute('margin')) {
                    this.tileset.margin = parseInt(element.getAttribute('margin'))
                }
                if(element.getElementsByTagName('tileoffset')[0]) {
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

                if(data.getAttribute('encoding') == 'csv') {
                    tl.tiles = data.textContent.replace(/(\r\n|\n|\r)/gm, '').split(',')
                    console.log('map encoding csv [layer ' + i + ']')
                } else if(data.getAttribute('encoding') == 'base64' && data.getAttribute('compression') == 'gzip') {
                    throw 'base64 gzip compressed map format not supported at the moment'
                } else if(data.getAttribute('encoding') == 'base64' && data.getAttribute('compression') == 'zlib') {
                    throw 'base64 zlib compressed map format not supported at the moment'
                } else if(data.getAttribute('encoding') == 'base64') {
                    throw 'base64 map format not supported at the moment'
                } else {
                    console.log('map encoding xml [layer ' + i + ']')
                    var tiles = element.getElementsByTagName('tile')
                    for(x in tiles) {
                        if(x < tiles.length) {
                            tl.tiles[x] = parseInt(tiles[x].getAttribute('gid'))
                        }
                    }
                }

                tl.name = element.getAttribute('name')
                tl.width = parseInt(element.getAttribute('width'))
                tl.height = parseInt(element.getAttribute('height'))
                if(element.getAttribute('opacity')) {
                    tl.opacity = parseFloat(element.getAttribute('opacity'))
                }
                if(element.getAttribute('visible') === '0') {
                    tl.visible = false
                }
                this.layers.push(tl)
                break
            case 'objectgroup':
                //get tilemap data of grouplayer
                console.log('grouplayer found')
                var objects = element.getElementsByTagName('object')
                for(o in objects) {
                    if(o < objects.length) {
                        var obj = objects[o]
                        var name = obj.getAttribute('name')
                        if(obj.getAttribute('gid')) {
                            //tile as object/point
                            this.points.push(
                            new CG.MapPoint(
                            new CG.Point(
                            parseInt(obj.getAttribute('x')), parseInt(obj.getAttribute('y'))), this.position, obj.getAttribute('name'), parseInt(obj.getAttribute('gid'))))
                            console.log('tile as oject found: ' + name)
                            console.log(obj)
                        } else if(obj.getAttribute('width')) {
                            type = false
                            properties = obj.getElementsByTagName('property')
                            console.log(properties.length)
                            for(var p = 0, l = properties.length; p < l; p++) {
                                if(properties[p].getAttribute('name') == 'type') {
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
                        } else if(obj.getElementsByTagName('polygon').length > 0) {
                            console.log('polygon found: ' + name)
                        } else if(obj.getElementsByTagName('polyline').length > 0) {
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
        for(i in tiles) {
            var tprop = new CG.MapTileProperties()
            var tile = tiles[i]

            if(i < this.tileproperties.length) {
                var id = tile.getAttribute('id')
                var properties = tile.getElementsByTagName('properties')[0].getElementsByTagName('property')
                for(p in properties) {
                    if(p < properties.length) {
                        var tp = properties[p]
                        var elem = tp.getAttribute('name')
                        var value = tp.getAttribute('value')
                        if(elem == 'name') {
                            tprop.name = value
                        } else if(elem == 'anim_delay') {
                            tprop.animDelay = parseInt(value)
                            tprop.delayTimer = time
                            this.animated = true
                        } else if(elem == 'anim_direction') {
                            tprop.animDirection = parseInt(value)
                        } else if(elem == 'anim_next') {
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
     * @description loadMapJson - load and parse an tilemap json file
     *
     * @param {string/object} jsonfile path or mediaasset object with data of tiled map xml
     */
    loadMapJson: function(jsonfile) {
        this.changemap = ''
        this.animated = false
        this.layers = []

        //from asset
        if(typeof jsonfile == 'string') {
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
        for(i = 0, l = this.json.layers.length; i < l; i++) {
            switch(this.json.layers[i].type) {
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
                for(o in objects) {
                    if(o < objects.length) {
                        var obj = objects[o]
                        var name = obj.name
                        if(obj.gid) {
                            //tile as object/point
                            this.points.push(
                            new CG.MapPoint(
                            new CG.Point(
                            parseInt(obj.x), parseInt(obj.y)), this.position, obj.name, parseInt(obj.gid)))

                            console.log('tile as oject found: ' + name)
                            console.log(obj)
                        } else if(obj.width) {
                            //object group
                            this.areas.push(
                            new CG.MapArea(
                            new CG.Bound(
                            parseInt(obj.x), parseInt(obj.y), parseInt(obj.width), parseInt(obj.height)), this.position, obj.name, obj.properties.type))

                            console.log('group object found: ' + name)
                            console.log(obj)
                        } else if(obj.polygon) {
                            console.log('polygon found: ' + name)
                        } else if(obj.polyline) {
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

        for(id in tiles) {
            var tprop = new CG.MapTileProperties()
            var tile = tiles[id]
            tprop.name = tile.name
            tprop.animDelay = parseInt(tile.anim_delay)
            tprop.delayTimer = (tprop.animDelay > 0) ? time : 0
            tprop.animated = (tprop.animDelay > 0) ? true : false
            tprop.animNext = parseInt(tile.anim_next)
            if(tprop.animDelay > 0) {
                this.animated = true
            }
            tprop.animDirection = parseInt(tile.anim_direction)
            this.tileproperties[id] = tprop

        }
        return this
    },


    /**
     * @description drawMap - draws the map
     *
     * @param {integer} sx top left coord for canvas drawing
     * @param {integer} sy top left coord for canvas drawing
     * @param {integer} bx top left x coord of bound in tilemap
     * @param {integer} by top left y coord of bound in tilemap
     * @param {integer} bw width of bound in tilemap
     * @param {integer} bh height of bound in tilemap
     * @param {callback} callback for collision handling - callback(obj,maptileproperties)
     */
    drawMap: function(sx, sy, bx, by, bw, bh, callback) {
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

        if(this.changemap != '') {
            this.loadMap(this.changemap)
        }
        if(this.visible) {
            this.updateAnimation()
            if(this.layers.length > 0) {
                for(var layer = 0, l = this.layers.length; layer < l; layer++) {
                    var tl = this.layers[layer]
                    //render control, render by name, layer number or 'all''
                    if(this.renderlayer == tl.name || this.renderlayer == layer || this.renderlayer == 'all') {
                        // MAP ORTHOGONAL
                        if(this.orientation == 'orthogonal' && tl.visible == true) {
                            modx = (this.bx * this.xscale) % this.tilewidth
                            mody = (this.by * this.yscale) % this.tileheight
                            y = this.by
                            my = Math.floor(parseFloat(this.by) / parseFloat(this.tileheight)) >> 0

                            var tmpy = (this.by + this.bh + this.tileheight)
                            while(y < tmpy) {
                                x = this.bx //- this.tilewidth
                                mx = Math.floor(parseFloat(this.bx) / parseFloat(this.tilewidth)) >> 0

                                var tmpx = (this.bx + this.bw + this.tilewidth)
                                while(x < tmpx) {
                                    if((this.wrapX || (mx >= 0 && mx < this.width)) && (this.wrapY || (my >= 0 && my < this.height))) {
                                        mx2 = mx
                                        my2 = my

                                        while(mx2 < 0) {
                                            mx2 += this.width
                                        }

                                        while(mx2 >= this.width) {
                                            mx2 -= this.width
                                        }

                                        while(my2 < 0) {
                                            my2 += this.height
                                        }

                                        while(my2 >= this.height) {
                                            my2 -= this.height
                                        }

                                        gid = tl.tiles[mx2 + my2 * tl.width] - 1

                                        if(gid >= 0) {
                                            if(modx < 0) {
                                                modx += this.tilewidth
                                            }
                                            if(mody < 0) {
                                                mody += this.tileheight
                                            }
                                            rx = x - modx - this.bx
                                            ry = y - mody - this.by


                                            //time for collision detection?
                                            //limit to specific tilemap layer?
                                            //collision depending on bounds and direction (xspeed/yspeed)?
                                            //include some layer functionality here and render some sprites between map layers?
                                            if(this.elements.length > 0 && this.layertocheck == l) {
                                                for(var o = 0, l = this.elements.length; o < l; o++) {
                                                    if(this.checkMapCollision(this.elements[0], rx, ry)) {
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
                                            } catch(e) {}
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
                        else if(this.orientation == 'isometric') {
                            var t = tl.width + tl.height
                            for(var y = 0; y < t; y++) {
                                var ry = y
                                var rx = 0
                                while(ry >= tl.height) {
                                    ry -= 1
                                    rx += 1
                                }


                                while(ry >= 0 && rx < tl.width) {
                                    var gid = tl.tiles[rx + ry * tl.width]
                                    var xpos = (rx - ry - 1) * this.tilewidth / 2 - bx
                                    var ypos = (rx + ry + 1) * this.tileheight / 2 - by
                                    if(xpos > -this.tileset.tilewidth && xpos < bw && ypos > -this.tileset.tileheight && ypos < bh) {
                                        if(gid > 0) {
                                            cx = ((gid - 1) % (this.atlaswidth / this.tilewidth)) * this.tilewidth
                                            cy = Math.floor(this.tilewidth * (gid - 1) / this.atlaswidth) * this.tileset.tileheight
                                            Game.b_ctx.save()
                                            Game.b_ctx.globalAlpha = this.layers[layer].opacity
                                            Game.b_ctx.translate(xpos, ypos)
                                            try {
                                                Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileset.tileheight, 0, 0, this.tilewidth * this.xscale, this.tileset.tileheight * this.yscale)
                                            } catch(e) {

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
     * @description update all areas and points
     */
    updatePointsAndAreas: function() {
        this.points.forEach(function(point, index) {
            point.update()
        }, this)
        this.areas.forEach(function(area, index) {
            area.update()
        }, this)
    },



    /**
     * @description getPointsByName - get all point(s) with the given name
     *
     * @param {string} name of the points to return
     * @return {false/array} returns false or an array with point(s)
     */
    getPointsByName: function(name) {
        points = []
        for(var i = 0, l = this.points.length; i < l; i++) {
            if(this.points[i].name === name) {
                points.push(this.points[i])
            }
        }
        if(points.length > 0) {
            return points
        }
        return false
    },

    /**
     * @description getAreasByName - get all areas with the given name
     *
     * @param {string} name of the area(s) to return
     * @return {false/array} returns false or an array with area(s)
     */
    getAreasByName: function(name) {
        areas = []
        for(var i = 0, l = this.areas.length; i < l; i++) {
            if(this.areas[i].name === name) {
                areas.push(this.areas[i])
            }
        }
        if(areas.length > 0) {
            return areas
        }
        return false
    },



    /**
     * @description setLayerToRender - defines layer drawing, see param options
     *
     * @param {mixed} mixed define the map layer(s) to render 'all' (string) for all layers, array index (integer) for layer to render or 'name' (string) of layer to render'
     */
    setLayerToRender: function(mixed) {
        this.renderlayer = mixed
        return this
    },

    /**
     * @description the update method is not complete yet and only experimental
     * at the final stage the methods updateAnimation and updatePointsAndAreas have to be called from here!
     * Then also a map class can be added to a layer as an element for auto update/draw from Game.director!
     */
    update: function() {
        //TODO automatic movement of map or other stuff?
        this.bx += this.xspeed
        this.by += this.yspeed
        if(this.getBounds().width - Game.bound.width < this.bx) {
            this.xspeed = this.xspeed * -1
        }
        if(this.bx < 0) {
            this.xspeed = this.xspeed * -1
        }
        if(this.getBounds().height - Game.bound.height < this.by) {
            this.yspeed = this.yspeed * -1
        }
        if(this.by < 0) {
            this.yspeed = this.yspeed * -1
        }
        return this
    },

    /**
     * yust calls drawMap ;o)
     */
    draw: function() {
        this.drawMap(this.bx, this.by, this.bw, this.bh, this.sx, this.sy, this.callback)
        return this
    },

    /**
     * @description getBounds - get the bounds of the map
     */
    getBounds: function() {
        return {
            width: this.width * this.tilewidth,
            height: this.height * this.tileheight
        }
    },

    /**
     * @description updateAnimation - updates the map
     *
     * Supported custom tiled map properties for now are (see also tilemap examples):
     * anim_delay       => time to used to display an switch to next tile
     * anim_direction   => direction for next tile 1 = jump forward, -1 = jump back
     * anim_next        => defines the offset
     *
     * With this tile properties it is possible to define tilemap animations. These must be defined in the tilemap property window
     * with key/value pairs
     */
    updateAnimation: function() {
        // update if map is visible
        if(this.visible && this.animated) {
            if(this.layers.length > 0) {
                for(var layer = 0, l = this.layers.length; layer < l; layer++) {
                    var newtime = new Date().getTime()
                    for(t = 0; t < this.layers[layer].tiles.length; t++) {
                        var tile = this.layers[layer].tiles[t]
                        if(tile > 0) {
                            try {
                                var tprop = this.tileproperties[tile - 1]
                                if(tprop.animated && tprop.animDirection != 0) {
                                    if(newtime > (tprop.delayTimer + (tprop.animDelay / this.animDelayFactor))) {
                                        switch(tprop.animDirection) {
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
                            } catch(e) {

                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * @description addElement - adds a object to the element array, used at the moment for collision detection to tilemap
     *
     * @param {obj} element to to add to elements array
     */
    addElement: function(element) {
        this.elements.push(element)
        return this
    },

    /**
     * @description checkMapCollision - checks if the attached element
     * collides with an tile of the tilemap
     *
     * @param {obj} element to check for
     * @param {integer} rx current rx of rendermap method
     * @param {integer} ry current ry of rendermap method
     *
     * @return {boolean} returns true or false
     */
    checkMapCollision: function(element, rx, ry) {
        //TODO return detailed collision object or offsets instead of true?
        if(element.boundingradius > 0) {
            //circular collision
            xr = element.boundingradius / 2 * element.xscale
            yr = element.boundingradius / 2 * element.yscale
            if(element.position.x + xr >= rx && element.position.x - xr <= rx + this.tilewidth && element.position.y + yr >= ry && element.position.y - yr <= ry + this.tileheight) {
                return true
            }
        } else {
            //bounding collision
            xw = element.width / 2 * element.xscale
            yh = element.height / 2 * element.yscale
            if(element.position.x + xw >= rx && element.position.x - xw <= rx + this.tilewidth && element.position.y + yh >= ry && element.position.y - yh <= ry + this.tileheight) {
                return true
            }
        }
        return false
    },

    /**
     * @description checks if a external object collides
     * with the areas of the tiled map
     *
     * @param {objarray} objarray to check for a areas collision
     * @param {calback} callback what should happen
     */
    checkAreasCollision: function(objarray, callback) {
        for(var o = 0, ol = objarray.length; o < ol; o++) {
            for(var a = 0, al = this.areas.length; a < al; a++) {
                obj = objarray[o]
                area = this.areas[a]
                //TODO collision handling
                //compare area bound with sprite bound?
            }
        }
        return this
    },

    /**
     * @description removes the json data of the map object
     */
    removeJsonData: function() {
        this.json = {}
        return this
    },
    /**
     * @description removes the xml data of the map object
     */
    removeXmlData: function() {
        this.xml = ''
        //this.parser = new DOMParser()
        this.xmlDoc = ''
        return this
    }
})