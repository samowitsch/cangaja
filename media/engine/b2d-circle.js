/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DCircle
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DCircle', {
    init:function (world, id, image, radius, x, y, scale, stat) {
        this._super()
        this.world = world
        this.setImage(image)
        this.scale = scale
        this.radius = this.width / 2
        this.x = x
        this.y = y
        this.stat = stat || false

        this.xhandle = (this.width / 2)
        this.yhandle = (this.height / 2)

        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }
        this.fixDef.shape = new b2CircleShape(this.radius / this.scale)
        this.bodyDef.position.x = this.x / this.scale
        this.bodyDef.position.y = this.y / this.scale
        this.bodyDef.userData = id

        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this

    }
})


