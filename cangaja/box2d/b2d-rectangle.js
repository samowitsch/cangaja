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
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param image     {mixed}     path to image, image or atlasimage from asset
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param b2BodyType      {box2d.b2BodyType}     Box2D bodytype constant
     * @return {*}
     */
    init:function (world, name, image, x, y, scale, b2BodyType) {
        this._super(name, image, world, x, y, scale)
        this.instanceOf = 'B2DRectangle'

        /**
         * @property bodyDef.stat
         * @type {box2d.b2BodyType.b2_staticBody/box2d.b2BodyType.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = b2BodyType || box2d.b2BodyType.b2_staticBody

        /**
         * @property fixDef.shape
         * @type {b2PolygonShape}
         */
        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsBox(this.width / scale * 0.5, this.height / scale * 0.5)
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


