/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description
 *
 * B2DChainShape
 *
 * @class CG.B2DChainShape
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DChainShape', {
    /**
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param vertices  {array}      vertices for chainshape CG.Point array
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param stat     {Boolean}     true if static body
     * @return {*}
     */
    init:function (world, name, vertices, x, y, scale, stat) {
        this._super(name, false, world, x, y, scale)
        /**
         * @property stat
         * @type {*}
         */
        this.stat = stat || false
        /**
         * @property polys
         * @type {Array}
         */
        this.vertices = this.createVecs(vertices)
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
         * @property body
         * @type {b2Body}
         */
        /**
         * @property fixDef.shape
         * @type {b2CircleShape}
         */
        this.fixDef.shape = new b2ChainShape()
        this.fixDef.shape.CreateChain(this.vertices, this.vertices.length)

        /**
         * @property body
         * @type {b2Body}
         */
        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this

    },
    /**
     * @description
     *
     * createVec converts real world vectors to box2d world vecs depending on scale
     *
     * @method createVecs
     * @param {Array} vertices CG.Point array
     * @return {Array} vecs b2Vec2  with box2d world scale
     */
    createVecs:function (vertices) {
        var vecs = []
        for (var i = 0, l = vertices.length; i < l; i++) {
            var vec = new b2Vec2(vertices[i].x / this.scale, vertices[i].y / this.scale)
            vecs.push(vec)
        }
        return vecs
    },
    update:function () {

    },
    draw:function () {

    }

})

