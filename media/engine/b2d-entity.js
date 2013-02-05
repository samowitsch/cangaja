/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DEntity
 * @augments Entity
 * @constructor
 */

CG.Entity.extend('B2DEntity', {
    init:function () {

        this.body = {}

        this.bodyDef = new b2BodyDef
        this.bodyDef.allowSleep = true
        this.bodyDef.awake = true

        this.fixDef = new b2FixtureDef
        this.fixDef.density = 1.0
        this.fixDef.friction = 0.5
        this.fixDef.restitution = 0.5

        return this
    },
    update:function () {
    },
    draw:function () {
        Game.b_ctx.save()
        Game.b_ctx.globalAlpha = this.alpha
        Game.b_ctx.translate(this.body.GetPosition().x * this.scale, this.body.GetPosition().y * this.scale)
        if (this.atlasimage) {
            Game.b_ctx.rotate((this.body.GetAngle() - this.imagerotation)) // * CG.Const_PI_180)
            Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - this.xhandle, 0 - this.yhandle, this.cutwidth, this.cutheight)
        } else {
            Game.b_ctx.rotate(this.body.GetAngle()) // * CG.Const_PI_180)
            Game.b_ctx.drawImage(this.image, 0 - this.xhandle, 0 - this.yhandle, this.image.width, this.image.height)
        }
        Game.b_ctx.restore()
    }
})


