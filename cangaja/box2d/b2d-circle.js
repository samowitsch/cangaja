/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


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
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param image     {mixed}       path to image, image or tpimage from asset
     * @param radius    {Number}     json file from PhysicsEditor from asset
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param b2BodyType      {box2d.b2BodyType}     Box2D bodytype constant
     * @return {*}
     */
    init:function (world, name, image, radius, x, y, scale, b2BodyType) {
        this._super(name, image, world, x, y, scale)
        /**
         * @property radius
         * @type {Number}
         */
        this.radius = this.width / 2
        /**
         * @property bodyDef.type
         * @type {box2d.b2_staticBody/box2d.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = b2BodyType || box2d.b2BodyType.b2_staticBody

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


