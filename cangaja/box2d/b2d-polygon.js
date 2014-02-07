/**
 * @description
 *
 * B2DPolygon  is a simple b2PolygonShape wrapper element with basic physics properties.
 * It uses PhysicsEditor json files, use export Lime + Corona (json).
 * Supported options for now are friction, density and bounce and would be set to B2DPolygon.
 *
 * @class CG.B2DPolygon
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DPolygon', {
    /**
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param image     {mixed}       path to image, image or atlasimage from asset
     * @param jsonpoly  {string}      json file from PhysicsEditor from asset
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param b2BodyType      {box2d.b2BodyType}     Box2D bodytype constant
     * @param bullet    {Boolean}     bullet option
     * @return {*}
     */
    init: function (world, name, image, jsonpoly, x, y, scale, b2BodyType, bullet) {
        this._super(name, image, world, x, y, scale)
        this.instanceOf = 'B2DPolygon'
        /**
         * @property polys
         * @type {Array}
         */
        this.polys = new Array()
        /**
         * @property jsondata
         * @type {*}
         */
//        this.jsondata = jsonpoly.data[jsonpoly.name]
        this.jsondata = jsonpoly.data[name]
        /**
         * @property vecs
         * @type {Array}
         */
        this.vecs = new Array()
        this.vecs = this.getPolysFromJson(jsonpoly) // build grouped b2vecs from physicseditor
        //@TODO get alternative polys from bitmap contourTrace & triangulation?

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

        //this.bodyDef.linearDamping = options.linearDamping
        //this.bodyDef.angularDamping = options.angularDamping
        //this.bodyDef.fixedRotation = true

        /**
         * @property body
         * @type {b2Body}
         */
        this.body = this.world.CreateBody(this.bodyDef)

        for (var i = 0, l = this.vecs.length; i < l; i++) {
            this.bodyShapePoly = new b2PolygonShape
            this.bodyShapePoly.bounce = this.jsondata[i].restitution        //value from physics editor
            this.makeVecsCentroid(this.vecs[i])
            this.bodyShapePoly.SetAsArray(this.vecs[i], this.vecs[i].length)
            this.fixDef.density = this.jsondata[i].density                  //value from physics editor
            this.fixDef.friction = this.jsondata[i].friction                //value from physics editor
            //this.fixDef.restitution = 0

            this.fixDef.shape = this.bodyShapePoly
            this.body.CreateFixture(this.fixDef)
        }
        return this

    },
    /**
     * @description extract the polygons out of the PhysicsEditor json file and collect them into an array
     *
     * Physicseditor json example
     @example
     {

         "ballon": [

                 {
                     "density": 0.05, "friction": 0.5, "bounce": 0,
                     "filter": { "categoryBits": 1, "maskBits": 65535 },
                     "shape": [   98.5, 210  ,  98.5, 212  ,  92, 215.5  ,  82.5, 205  ,  91.5, 206  ,  97, 207.5  ]
                 }  ,
                 {
                     "density": 0.05, "friction": 0.5, "bounce": 0,
                     "filter": { "categoryBits": 1, "maskBits": 65535 },
                     "shape": [   81.5, 213  ,  82.5, 205  ,  92, 215.5  ,  83, 215.5  ]
                 }  ,

     * @method getPolysFromJson
     * @return {Array}
     */
    getPolysFromJson: function () {
        var vecs = []
        for (var i = 0, l = this.jsondata.length; i < l; i++) {
            var poly = this.jsondata[i].shape
            var temp = []
            for (var i2 = 0, l2 = poly.length; i2 < l2; i2 = i2 + 2) {
                var vec = new b2Vec2(poly[i2] / this.scale, poly[i2 + 1] / this.scale)
                temp.push(vec)
            }
            vecs.push(temp)
        }
        return vecs
    },
    /**
     * @description use the CG.Bitmap traceContour method to get the shape of an bitmap. The result are 'only' triangulated polygons. Better results with concave polygons are calculated with Physicseditor, see getPolysFromJson.
     * @todo final implemenation
     *
     @example
     // example code from demo-bitmap-contour.js
     bitmap = new CG.Bitmap(Game.width, Game.height)
     bitmap.loadImage(Game.asset.getImageByName('star-contour-test'))
     var contour = bitmap.traceContour()
     var lightedContour = bitmap.lightenCountur(contour)
     var triangulatedContour = bitmap.triangulateContour(lightedContour)

     * @method getPolysFromBitmapTrace
     * @param image
     * @returns {Array}
     */
    getPolysFromBitmapTrace: function (image) {
        var vecs = []
        return vecs
    },
    /**
     * The origin of the vertices from physicseditor is top/left. This method makes the vecs centroid (centered origin) depending on image size.
     * @todo put this stuff into getPolysFromJson?
     *
     * @method makeVecsCentroid
     * @param vecs
     */
    makeVecsCentroid: function (vecs) {
        var xcenter = this.xhandle / this.scale,
            ycenter = this.yhandle / this.scale
        for (var p = 0, pl = vecs.length; p < pl; p++) {
            vecs[p].x = vecs[p].x - xcenter
            vecs[p].y = vecs[p].y - ycenter
        }
    }
})


