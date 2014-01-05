/**
 * @description
 *
 * B2DTerrain looks similar to B2DPolygon but has more features for polygon manipulation like clipping and triangulation.
 *
 * @class CG.B2DTerrain
 * @extends CG.B2DEntity
 */


//@TODO code cleanup and description
//@TODO comment to polygon winding order for clipper (outer == CW; holes == CCW)

/*@TODO known pol2tri exceptions ;o(:
 'Cannot call method 'slice' of undefined',
 'poly2tri Intersecting Constraints',
 'poly2tri Invalid Triangle.index() call',
 '"null" is not an object (evaluating 'pb.y')',
 poly2tri Invalid Triangle.legalize() call
*/

CG.B2DEntity.extend('B2DTerrain', {
    /**
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param image     {mixed}       path to image, image or atlasimage from asset
     * @param terrainPoly  {array}      array of vertices to start terrain building
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param b2BodyType      {box2d.b2BodyType}     Box2D bodytype constant
     * @param bullet    {Boolean}     bullet option
     * @return {*}
     */
    init: function (world, name, image, terrainPoly, x, y, scale, b2BodyType, bullet) {
        this._super(name, image, world, x, y, scale)
        this.instanceOf = 'B2DTerrain'

        /**
         * @description bitmap for terrain
         * @property bitmap
         * @type {CG.Bitmap}
         */
        this.bitmap = new CG.Bitmap(Game.width, Game.height)
        this.bitmap.loadImage(image)
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
        /**
         * @description the generated triangles generated thru clipper and poly2tri
         * @property terrainTriangles
         * @type {Array}
         */
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
         * @type {box2d.b2BodyType.b2_staticBody/box2d.b2BodyType.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = b2BodyType || box2d.b2BodyType.b2_staticBody
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

        this.createTerrain()

        return this

    },
    /**
     * @method createTerrain
     */
    createTerrain: function () {
        this.body = this.world.CreateBody(this.bodyDef)

        try {
            for (var part = 0, len = this.terrainPoly.length; part < len; part++) {

                var outer = this.terrainPoly[part].outer
                if (typeof outer === 'undefined')
                    continue

                var swctx = new poly2tri.SweepContext(outer, {cloneArrays: true})

                if (this.terrainPoly[part].holes.length > 0) {
                    for (var i = 0, l = this.terrainPoly[part].holes.length; i < l; i++) {
                        swctx.addHole(this.terrainPoly[part].holes[i])
                    }
                }

                swctx.triangulate();

                this.terrainTriangles = this.terrainTriangles.concat(swctx.getTriangles() || [])

            }

            for (var i = 0, l = this.terrainTriangles.length; i < l; i++) {
                this.bodyShapePoly = new b2PolygonShape
                this.bodyShapePoly.bounce = 0.5
                this.bodyShapePoly.SetAsArray(this.getPolysFromTriangulation(this.terrainTriangles[i].points_), this.terrainTriangles[i].points_.length)

                this.fixDef.shape = this.bodyShapePoly
                this.body.CreateFixture(this.fixDef)
            }
        } catch (e) {
            console.log('error: createTerrain()', e)
            console.log(e.message)
            console.log(e.stack)
            console.log(this.terrainPoly)
            console.log(this.terrainTriangles)
        }
    },
    /**
     * @description deletes the terrain
     * @method deleteTerrain
     */
    deleteTerrain: function () {
        //remove triangles
        this.terrainTriangles = []
        //remove body from b2world
        this.world.DestroyBody(this.body)
    },
    /**
     * @description Using Clipper to clip a hole in a given polygonshape. Important: the outer polygon points have to be in CW orientation, the hole polygons must ordered in CCW
     *
     * @method clipTerrain
     * @param opt
     */
    clipTerrain: function (opt) {
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
        this.bitmap.clearCircle(opt.x, opt.y, opt.radius)
    },
    /**
     * @description this method uses the Clipper Lighten method to reduce vertices for better triangulation
     * @method lightenTerrain
     */
    lightenTerrain: function () {
        //use clipper to eliminate to much vertices
        var tolerance = 0.02

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
     * @description Experimental not working yet. Try to use the Clipperlib Clean method
     * @method cleanTerrain
     */
    cleanTerrain: function () {
        //use clipper to eliminate to much vertices
        var cleandelta = 0.1

        for (var part = 0, len = this.terrainPoly.length; part < len; part++) {
            var temp = ClipperLib.Clean(this.terrainPoly[part].outer, cleandelta * this.scale)
            this.terrainPoly[part].outer = temp[0]
            if (this.terrainPoly[part].holes.length > 0) {
                for (var i = 0, l = this.terrainPoly[part].holes.length; i < l; i++) {
                    var temp = ClipperLib.Clean(this.terrainPoly[part].holes[i], cleandelta * this.scale)
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

    draw: function(){

        Game.renderer.draw(this.bitmap)

    },

    // converts polygons to SVG path string
    polys2SvgImage: function (poly, scale) {
        var path = "", i, j;
        if (!scale)
            scale = 1;
        for (i = 0; i < poly.length; i++) {
            for (j = 0; j < poly[i].length; j++) {
                if (!j)
                    path += "M";
                else
                    path += "L";
                path += (poly[i][j].X / scale) + ", " + (poly[i][j].Y / scale);
            }
            path += "Z";
        }
        return path;

        /*
         svg = '<svg style="" width="800" height="600">';
         svg += '<defs><pattern id="back" patternUnits="userSpaceOnUse" width="990" height="534"><image xlink:href="imagetest.png" x="0" y="0" width="990" height="534"/></pattern></defs>';
         svg += '<path stroke="" fill="url(#back)" stroke-width="" d="' + polys2path(solution_polygons, scale) + '"/>';
         svg += '</svg>';
         */
    }
})


