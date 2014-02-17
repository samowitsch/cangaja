/**
 * @description
 *
 * B2DCircle is a simple b2CircleShape wrapper element with basic physics properties.
 *
 * @class CG.B2DCirlce
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DCircle', {
    /**
     * Options:
     * name {string}
     * image {mixed}
     * radius {number}
     * x {number}
     * y (number}
     * world {object}
     * scale {number}
     * bodyType {box2d.b2BodyType}
     *
     @example
     var e = new CG.B2DCircle({
           name: 'player',
           image: this.asset.getImageByName('glowball'),
           radius: 20,
           x: 100,
           y: 100,
           world: b2world,
           scale: 40,
           bodyType: box2d.b2BodyType.b2_staticBody
     })
     *
     *
     * @method init
     * @constructor
     * @param options     {Object}
     * @return {*}
     */
    init:function (options) {
        this._super()
        this.instanceOf = 'B2DCircle'

        CG._extend(this, {
            /**
             * @property radius
             * @type {Number}
             */
            radius: 0
        })

        if (options) {
            CG._extend(this, options)
            this.id.name = options.name
            this.setImage(this.image)
        }

        /**
         * @property bodyDef.type
         * @type {box2d.b2BodyType.b2_staticBody/box2d.b2BodyType.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = this.bodyType

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
         * @property bdyDef.userData
         * @type {*}
         */
        this.bodyDef.userData = this.id
        /**
         * @property fixDef.shape
         * @type {b2CircleShape}
         */
        this.fixDef.shape = new b2CircleShape(this.radius / this.scale)

        /**
         * @property body
         * @type {b2Body}
         */
        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this

    }
})


