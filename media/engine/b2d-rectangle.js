/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DRectangle
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DRectangle', {
    init:function (world, name, image, x, y, scale, stat) {
        this._super(name, image, world, x, y, scale)

        this.stat = stat

        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }

        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsBox(this.width / scale * 0.5, this.height / scale * 0.5)
        this.bodyDef.position.x = this.x / this.scale
        this.bodyDef.position.y = this.y / this.scale
        this.bodyDef.userData = this.id
        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this
    }
})


