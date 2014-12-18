/**
 * @description
 *
 * B2DLine is a simple b2PolygonShape wrapper. There is no visible drawing
 * now in the canvas for now. It can be used to build walls, ground,. ,.
 *
 ```

 var e = new CG.B2DLine({
   name: 'groundline',
   startPoint: new CG.Point(10,10),
   endPoint: new CG.Point(500,10),
   world: b2world,
   scale: 40
 })

 ```
 *
 * @class CG.B2DLine
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DLine', {
    /**
     * Options:
     * name {string} id or name to identify
     * startPoint {CG.Point}
     * endPoint {CG.Point}
     * world {object} reference to world of B2DWorld
     * scale {number} the world scale of B2DWorld
     *
     * @method init
     * @constructor
     * @param options {Object}
     * @return {*}
     */
    init: function (options) {

        CG._extend(this, {
            /**
             * @property body
             * @type {}
             */
            body: {},
            /**
             * @property startPoint
             * @type {b2Vec2}
             */
            startPoint: new b2Vec2(0, 0),
            /**
             * @property endPoint
             * @type {b2Vec2}
             */
            endPoint: new b2Vec2(0, 0)
        })

        this._super(options)
        this.instanceOf = 'B2DLine'

        this.convertPoints()

        /**
         * @property fixDef.shape
         * @type {b2PolygonShape}
         */
        this.fixDef.shape = new b2EdgeShape()
        this.fixDef.shape.Set(this.startPoint, this.endPoint)
        /**
         * @property bodyDef.type
         * @type {Number}
         */
        this.bodyDef.type = box2d.b2BodyType.b2_staticBody
        /**
         * @property bodyDef.position
         */
        this.bodyDef.position.SetXY(0 / this.scale, 0 / this.scale)
        /**
         * @property bodyDef.userData
         * @type {*}
         */
        this.bodyDef.userData = this.id
        /**
         * @property body
         * @type {b2Body}
         */
        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this
    },
    convertPoints: function () {
        this.startPoint.x = this.startPoint.x / this.scale
        this.startPoint.y = this.startPoint.y / this.scale
        this.endPoint.x = this.endPoint.x / this.scale
        this.endPoint.y = this.endPoint.y / this.scale
    },
    update: function () {

    },
    draw: function () {

    }
})


