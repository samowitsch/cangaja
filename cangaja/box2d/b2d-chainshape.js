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
     * Options:
     * name {string}
     * points {array}
     * x {number}
     * y (number}
     * world {object}
     * scale {number}
     *
     @example
     var e = new CG.B2DChainShape({
           name: 'player',
           points: [new CG.Point(10,10), new CG.Point(300,50), new CG.Point(450,10)],
           x: 100,
           y: 100,
           world: b2world,
           scale: 40
     })
     *
     *
     * @method init
     * @constructor
     * @param options {Object}
     * @return {*}
     */
    init:function (options) {
        this._super()
        this.instanceOf = 'B2DChainShape'

        CG._extend(this, {

            /**
             * @property polys
             * @type {Array}
             */
            vertices: [],
            /**
             * @property bodyType
             * @type {box2d.b2BodyType}
             */
            bodyType: box2d.b2BodyType.b2_staticBody
        })

        if (options) {
            CG._extend(this, options)
            this.id.name = options.name
        }

        this.vertices = this.convertRealWorldPointToBox2DVec2(this.points)

        /**
         * @property bodyDef.type
         * @type {box2d.b2BodyType.b2_staticBody/box2d.b2BodyType.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = this.bodyType
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
     * convertRealWorldPointToBox2DVec2 converts real world vectors to box2d world vecs depending on scale
     *
     * @method convertRealWorldPointToBox2DVec2
     * @param {Array} vertices CG.Point array
     * @return {Array} vecs b2Vec2  with box2d world scale
     */
    convertRealWorldPointToBox2DVec2:function (vertices) {
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


