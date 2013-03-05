/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DRectangle
 * @class CG.B2DRectangle
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DRectangle', {
    /**
     * @method init
     * @constructor
     * @param world     {Object}      reference to world of B2DWorld
     * @param name      {String}      id or name to identify
     * @param image     {mixed}     path to image, image or tpimage from asset
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @param stat      {Boolean}     is the body static or dynamic
     * @return {*}
     */
    init:function (world, name, image, x, y, scale, stat) {
        this._super(name, image, world, x, y, scale)
        /**
         * @πroperty stat
         * @type {*}
         */
        this.stat = stat
        /**
         * @property bodyDef.stat
         * @type {b2Body.b2_staticBody/b2Body.b2_dynamicBody}
         */
        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }
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


