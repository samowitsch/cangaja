/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DRope
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DRope', {
    init:function (world, name, image, radius, x, y, scale, stat) {
        this._super()
        this.world = world

        //TODO rewrite for rope

//        this.id = {name:name, uid:0}
//
//        this.setImage(image)
//        this.scale = scale
//        this.radius = this.width / 2
//        this.x = x
//        this.y = y
//        this.stat = stat || false
//
//        this.xhandle = (this.width / 2)
//        this.yhandle = (this.height / 2)
//
//        if (this.stat) {
//            this.bodyDef.type = b2Body.b2_staticBody
//        } else {
//            this.bodyDef.type = b2Body.b2_dynamicBody
//        }
//        this.fixDef.shape = new b2CircleShape(this.radius / this.scale)
//        this.bodyDef.position.x = this.x / this.scale
//        this.bodyDef.position.y = this.y / this.scale
//        this.bodyDef.userData = this.id
//
//        this.body = this.world.CreateBody(this.bodyDef)
//        this.body.CreateFixture(this.fixDef)
//
//        return this

    },
    draw:function () {
        //TODO rewrite for rope

//        Game.b_ctx.save()
//        Game.b_ctx.globalAlpha = this.alpha
//        Game.b_ctx.translate(this.body.GetPosition().x * this.scale, this.body.GetPosition().y * this.scale)
//        if (this.atlasimage) {
//            Game.b_ctx.rotate((this.body.GetAngle() - this.imagerotation)) // * CG.Const_PI_180)
//            Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - this.xhandle, 0 - this.yhandle, this.cutwidth, this.cutheight)
//        } else {
//            Game.b_ctx.rotate(this.body.GetAngle()) // * CG.Const_PI_180)
//            Game.b_ctx.drawImage(this.image, 0 - this.xhandle, 0 - this.yhandle, this.image.width, this.image.height)
//        }
//        Game.b_ctx.restore()
    }

})


