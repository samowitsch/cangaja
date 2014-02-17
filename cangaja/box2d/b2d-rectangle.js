/**
 * @description
 *
 * B2DRectangle is a simple b2PolygonShape wrapper element with basic physics properties.
 *
 * @class CG.B2DRectangle
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DRectangle', {
    /**
     * Options:
     * name {string}
     * image {mixed}
     * x {number}
     * y (number}
     * world {object}
     * scale {number}
     * bodyType {box2d.b2BodyType}
     *
     @example
     var e = new CG.B2DRectangle({
           name: 'player',
           image: this.asset.getImageByName('glowball'),
           x: 100,
           y: 100,
           world: b2world,
           scale: 40,
           bodyType: box2d.b2BodyType.b2_staticBody
     })
     *
     * @method init
     * @constructor
     * @param options     {Object}
     * @return {*}
     */
    init:function (options) {
        this._super()
        this.instanceOf = 'B2DRectangle'

        if (options) {
            CG._extend(this, options)
            this.id.name = options.name
            this.setImage(this.image)
        }

        /**
         * @property bodyDef.stat
         * @type {box2d.b2BodyType.b2_staticBody/box2d.b2BodyType.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = this.bodyType

        /**
         * @property fixDef.shape
         * @type {b2PolygonShape}
         */
        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsBox(this.width / this.scale * 0.5, this.height / this.scale * 0.5)
        /**
         * @property bodyDef.position.x
         * @type {Number}
         */
        this.bodyDef.position.x = this.x / this.scale
        /**
         * @property bodyDef.position.y
         * @type {Number}
         */
        this.bodyDef.position.y = this.y / this.scale
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
    }
})


