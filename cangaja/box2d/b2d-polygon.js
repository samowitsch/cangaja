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
    init:function (world, name, image, jsonpoly, x, y, scale, b2BodyType, bullet) {
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
         * @property vecs
         * @type {Array}
         */
        this.vecs = new Array()
        this.vecs = this.getPolysFromJson(jsonpoly) // build grouped b2vecs from physicseditor

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
     * @method getPolysFromJson
     * @return {Array}
     */
    getPolysFromJson:function () {
        var vecs = []
        for (var i = 0, l = this.jsondata.length; i < l; i++) {
            poly = this.jsondata[i].shape
            var temp = []
            for (var i2 = 0, l2 = poly.length; i2 < l2; i2 = i2 + 2) {
                vec = new b2Vec2(poly[i2] / this.scale, poly[i2 + 1] / this.scale)
                temp.push(vec)
            }
            vecs.push(temp)
        }
        return vecs
    }
})


