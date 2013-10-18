/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description
 *
 * B2DTerrain
 *
 * @class CG.B2DPolygon
 * @extends CG.B2DEntity
 */


//@TODO code cleanup and description
//@TODO comment to polygon winding order for clipper (outer == CW; holes == CCW)

CG.B2DEntity.extend('B2DTerrain', {
    /**
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param image     {mixed}       path to image, image or tpimage from asset
     * @param terrainPoly  {array}      array of vertices to start terrain building
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param stat      {Boolean}     is the body static or dynamic
     * @param bullet    {Boolean}     bullet option
     * @return {*}
     */
    init: function (world, name, image, terrainPoly, x, y, scale, stat, bullet) {
        this._super(name, image, world, x, y, scale)
        /**
         * @property stat
         * @type {*}
         */
        this.stat = stat || false
        /**
         * @property polys
         * @type {Array}
         */
        this.polys = new Array()
        /**
         * @property terrainpoly
         * @type {*}
         */
        this.terrainPoly = terrainPoly

        this.terrainTriangles = []

        /**
         * @property holes
         * @type {Array}
         */
        this.holes = []
        /**
         * @property xhandle
         * @type {Number}
         */
        this.xhandle = 0
        /**
         * @property yhandle
         * @type {Number}
         */
        this.yhandle = 0

        /**
         * @property bodyDef.type
         * @type {b2Body.b2_staticBody/b2Body.b2_dynamicBody}
         */
        if (this.stat) {
            this.bodyDef.type = box2d.b2BodyType.b2_staticBody
        } else {
            this.bodyDef.type = box2d.b2BodyType.b2_dynamicBody
        }
        /**
         * @property bodyDef.position
         */
        this.bodyDef.position.SetXY(this.x / this.scale, this.y / this.scale)
        /**
         * @property bodyDef.userData
         * @type {*}
         */
        this.bodyDef.userData = this.id
        /**
         * @property bullet
         * @type {*}
         */
        this.bullet = bullet || false
        /**
         * @property bodyDef.bullet
         * @type {*}
         */
        this.bodyDef.bullet = this.bullet


        /**
         * @property body
         * @type {b2Body}
         */

        this.createTerrain()

        return this

    },
    createTerrain: function () {
        // @TODO poly2tri
        this.body = this.world.CreateBody(this.bodyDef)

        for (var part = 0, len = this.terrainPoly.length; part < len; part++) {
            try {
                var swctx = new poly2tri.SweepContext(this.terrainPoly[part].outer, {cloneArrays: true})

                if (this.terrainPoly[part].holes.length > 0) {
                    for (var i = 0, l = this.terrainPoly[part].holes.length; i < l; i++) {
                        swctx.addHole(this.terrainPoly[part].holes[i])
                    }
                }

                swctx.triangulate();

                this.terrainTriangles = this.terrainTriangles.concat(swctx.getTriangles() || [])
            } catch (e) {
                console.log(e)
            }
        }

        for (var i = 0, l = this.terrainTriangles.length; i < l; i++) {
            this.bodyShapePoly = new b2PolygonShape
            this.bodyShapePoly.bounce = 0.5
            this.bodyShapePoly.SetAsArray(this.getPolysFromTriangulation(this.terrainTriangles[i].points_), this.terrainTriangles[i].points_.length)
            this.fixDef.density = 0.5
            this.fixDef.friction = 0.5
            //this.fixDef.restitution = 0
            //this.fixDef.density = 10

            this.fixDef.shape = this.bodyShapePoly
            this.body.CreateFixture(this.fixDef)
        }
    },
    deleteTerrain: function () {
        //remove triangles
        this.terrainTriangles = []
        //remove body from b2world
        this.world.DestroyBody(this.body)
    },
    clippTerrain: function (opt) {
        var newhole = this.createCircle(opt)

        //add new hole to all contour terrainPolys
        for (var part = 0, len = this.terrainPoly.length; part < len; part++) {
            this.terrainPoly[part].holes.push(newhole)
        }

        //use clipper to calculate new terrainPolys
        var tempPolys = []
        var subj_polygons = []
        var clip_polygons = []
        for (var part = 0, len = this.terrainPoly.length; part < len; part++) {
            subj_polygons = [this.terrainPoly[part].outer]
            clip_polygons = []
            if (this.terrainPoly[part].holes.length > 0) {
                for (var i = 0, l = this.terrainPoly[part].holes.length; i < l; i++) {
                    clip_polygons.push(this.terrainPoly[part].holes[i])
                }
            }
            var cpr = new ClipperLib.Clipper()
            cpr.AddPolygons(subj_polygons, ClipperLib.PolyType.ptSubject)
            cpr.AddPolygons(clip_polygons, ClipperLib.PolyType.ptClip)

            var solution_polygons = new ClipperLib.ExPolygons()
            cpr.Execute(ClipperLib.ClipType.ctDifference, solution_polygons, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero)
            if (solution_polygons.length > 0) {
                for (var spoly = 0, slen = solution_polygons.length; spoly < slen; spoly++) {
                    tempPolys.push(solution_polygons[spoly])
                }
            }
        }
        this.terrainPoly = tempPolys
        this.lightenTerrain()
//        this.cleanTerrain()
        this.deleteTerrain()
        this.createTerrain()
    },
    /**
     * @description this method uses the Clipper Lighten mehtod to reduces vertices for better triangulation
     * @method lightenTerrain
     */
    lightenTerrain: function () {
        //use clipper to eliminate to much vertices
        var tolerance = 0.015

        for (var part = 0, len = this.terrainPoly.length; part < len; part++) {
            var temp = ClipperLib.Lighten(this.terrainPoly[part].outer, tolerance * this.scale)
            this.terrainPoly[part].outer = temp[0]
            if (this.terrainPoly[part].holes.length > 0) {
                for (var i = 0, l = this.terrainPoly[part].holes.length; i < l; i++) {
                    var temp = ClipperLib.Lighten(this.terrainPoly[part].holes[i], tolerance * this.scale)
                    this.terrainPoly[part].holes[i] = temp[0]
                }
            }
        }
    },
    /**
     * experimental not working yet
     */
    cleanTerrain: function () {
        //use clipper to eliminate to much vertices
        var tolerance = 0.015

        for (var part = 0, len = this.terrainPoly.length; part < len; part++) {
            var temp = ClipperLib.Clean(this.terrainPoly[part].outer, tolerance * this.scale)
            this.terrainPoly[part].outer = temp[0]
            if (this.terrainPoly[part].holes.length > 0) {
                for (var i = 0, l = this.terrainPoly[part].holes.length; i < l; i++) {
                    var temp = ClipperLib.Clean(this.terrainPoly[part].holes[i], tolerance * this.scale)
                    this.terrainPoly[part].holes[i] = temp[0]
                }
            }
        }
    },
    /**
     * @description extract the triangles out of poly2tri array
     *
     * @method getPolysFromJson
     * @return {Array}
     */
    getPolysFromTriangulation: function (pointsArray) {
        var vecs = []
        for (var i = 0, l = pointsArray.length; i < l; i++) {
            var poly = pointsArray[i]
            vecs.push(new b2Vec2(poly.x / this.scale, poly.y / this.scale))
        }
        return vecs
    },
    /**
     * @description creates a ccw wise circle vertices array for clipping
     *
     * @method createCircle
     * @param {object} opts example {points: 16, radius: 30, x: 320, y: 240}
     * @returns {Array}
     */
    createCircle: function (opts) {
        var angle = 2 * Math.PI / opts.points
        var circleArray = []
        for (var i = 0; i < opts.points; i++) {
            circleArray.push({x: opts.x + opts.radius * Math.cos(angle * i), y: opts.y + opts.radius * Math.sin(angle * i)})
        }
        return circleArray.reverse()
    },
    update: function () {

    },
    draw: function () {

    }
})


