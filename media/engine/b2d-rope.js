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
    /**
     *
     * @param world         object      reference to world of B2DWorld
     * @param name          string      id or name to identify
     * @param image         mixed       path to image, image or tpimage from asset
     * @param x             integer     the x position
     * @param y             integer     the y position
     * @param length        integer     the length/width of the bridge
     * @param segments      integer     segments of the bridge
     * @param segmentWidth  integer     width of a segment
     * @param scale         integer     the world scale of B2DWorld
     * @return {*}
     */
    init:function (world, name, image, x, y, length, segments, segmentWidth, scale) {
        this._super(name, image, world, x, y, scale)

        this.length = length
        this.segments = segments
        this.segmentHeight = ((this.length - this.y) / this.segments) / 2
        this.segmentWidth = segmentWidth
        this.anchor = new b2Vec2()
        this.prevBody = {}

        this.bodyGroup = []
        this.bodyCount = 0

        // RopeStart
        this.fixtureDef = new b2FixtureDef()
        this.bodyShapeCircle = new b2CircleShape()
        this.bodyDef = new b2BodyDef()
        this.bodyDef.userData = this.id
        this.bodyShapeCircle.m_radius = this.segmentWidth / this.scale
        this.fixtureDef.density = 1.0
        this.fixtureDef.restitution = 0.2
        this.fixtureDef.friction = 0.2
        this.fixtureDef.shape = this.bodyShapeCircle
        this.bodyDef.position.Set(this.x / this.scale, this.y / this.scale)
        this.body = this.bodyGroup[0] = this.world.CreateBody(this.bodyDef)
        this.bodyGroup[0].CreateFixture(this.fixtureDef)
        this.prevBody = this.bodyGroup[0]

        // RopeSegments
        this.fixtureDef = new b2FixtureDef()
        this.bodyShapePoly = new b2PolygonShape()
        this.bodyDef = new b2BodyDef()
        this.bodyDef.userData = this.id
        this.bodyShapePoly.SetAsBox(this.segmentWidth / this.scale, this.segmentHeight / this.scale)
        this.bodyDef.type = b2Body.b2_dynamicBody
        this.fixtureDef.shape = this.bodyShapePoly
        this.fixtureDef.density = 20.0
        this.fixtureDef.restitution = 0.2
        this.fixtureDef.friction = 0.2
        this.jointDef = new b2RevoluteJointDef()
        this.jointDef.lowerAngle = -25 / (180 / Math.PI)
        this.jointDef.upperAngle = 25 / (180 / Math.PI)
        this.jointDef.enableLimit = true


        for (var i = 0, l = this.segments; i < l; i++) {
            this.bodyDef.position.Set(this.x / this.scale, ((this.y + this.segmentHeight) + (this.segmentHeight * 2) * i) / this.scale)
            this.bodyGroup[i + 1] = this.world.CreateBody(this.bodyDef)
            this.bodyGroup[i + 1].CreateFixture(this.fixtureDef)
            this.anchor.Set(this.x / this.scale, (this.y + (this.segmentHeight * 2) * i) / this.scale)
            this.jointDef.Initialize(this.prevBody, this.bodyGroup[i + 1], this.anchor)
            this.world.CreateJoint(this.jointDef)
            this.prevBody = this.bodyGroup[i + 1]
            this.bodyCount = i + 1
        }

        return this

    },

    draw:function () {
        for (var i = 1; i <= this.bodyCount; i++) {
            var x = this.bodyGroup[i].GetPosition().x
            var y = this.bodyGroup[i].GetPosition().y
            var r = this.bodyGroup[i].GetAngle()
            Game.b_ctx.save()
            Game.b_ctx.globalAlpha = this.alpha
            Game.b_ctx.translate(x * this.scale, y * this.scale)
            if (this.atlasimage) {
                Game.b_ctx.rotate(r - this.imagerotation) // * CG.Const_PI_180)
                Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - this.xhandle, 0 - this.yhandle, this.cutwidth, this.cutheight)
            } else {
                Game.b_ctx.rotate(r) // * CG.Const_PI_180)
                Game.b_ctx.drawImage(this.image, 0 - this.xhandle, 0 - this.yhandle, this.image.width, this.image.height)
            }
            Game.b_ctx.restore()
        }
    }
})


