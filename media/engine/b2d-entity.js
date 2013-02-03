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
    init:function (name) {
        this._super(name)
        this.atlasimage = false
        this.scale = 0
        this.alpha = 1

        this.body = {}

        this.bodyDef = new b2BodyDef

        this.fixDef = new b2FixtureDef
        this.fixDef.density = 1.0
        this.fixDef.friction = 0.5
        this.fixDef.restitution = 0.5

        return this
    },
    createBox:function (world, image, x, y, scale, stat) {
        this.world = world
        this.setImage(image)
        this.scale = scale
        this.x = x
        this.y = y
        this.stat = stat

        //create dynamic circle object
        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }

        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsBox(this.width / scale * 0.5, this.height / scale * 0.5)
        this.bodyDef.position.x = this.x / this.scale
        this.bodyDef.position.y = this.y / this.scale
        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)


    },
    createCircle:function (world, image, radius, x, y, scale, stat) {
        this.world = world
        this.scale = scale
        this.setImage(image)

        this.radius = this.width / 2
        this.x = x
        this.y = y
        this.stat = stat || false


        //create dynamic circle object
        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }
        this.fixDef.shape = new b2CircleShape(this.radius / this.scale)
        this.bodyDef.position.x = this.x / this.scale
        this.bodyDef.position.y = this.y / this.scale

        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

    },
    createPolyBody:function () {

    },
    createBridge:function () {

    },
    createRope:function () {

    },
    update:function () {
        this.xhandle = (this.width / 2)
        this.yhandle = (this.height / 2)
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


