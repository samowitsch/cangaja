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
            this.bodyDef.position.Set(((this.x + this.segmentWidth) + (this.segmentWidth * 2) * i) / this.scale, this.y / this.scale)
            this.bodyGroup[i + 1] = this.world.CreateBody(this.bodyDef)
            this.bodyGroup[i + 1].CreateFixture(this.fixtureDef)
            this.anchor.Set((this.x + (this.segmentWidth * 2) * i) / this.scale, this.y / this.scale)
            this.jointDef.Initialize(this.prevBody, this.bodyGroup[i + 1], this.anchor)
            this.world.CreateJoint(this.jointDef)
            this.prevBody = this.bodyGroup[i + 1]
            this.bodyCount = i + 1
        }

        return this

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


    /*

     Method Draw:Void(ratio:Float = 1.0)
     Local f :b2Fixture
     Local s :b2Shape
     Local xf :b2Transform

     If Self.debugDraw = True
     If Self.bodyCount > 0 'Draw MultiBody
     For Local i:Int=0 to Self.bodyCount
     xf = Self.bodyGroup[i].m_xf
     f = Self.bodyGroup[i].GetFixtureList()
     While ( f <> Null )
     s = f.GetShape()
     DrawShape(s, xf, Self.debugColor)
     f = f.m_next
     End
     Next
     Else
     xf = Self.body.m_xf
     f = Self.body.GetFixtureList()
     While ( f <> Null )
     s = f.GetShape()
     DrawShape(s, xf, Self.debugColor)
     f = f.m_next
     End
     Endif
     SetColor(255,255,255)
     ElseIf Self.img <> Null
     If Self.bodyCount > 0
     If Self.entityType="bridge" 'Draw Bridge
     For Local i:Int=2 to Self.bodyCount
     Local x:Float = Self.bodyGroup[i].GetPosition().x
     Local y:Float = Self.bodyGroup[i].GetPosition().y
     Local r:Float	= RadToDeg(Self.bodyGroup[i].GetAngle()) * -1
     DrawImage(Self.img, x * Self.physScale, y * Self.physScale, r, 1.0, 1.0, 0)
     Next
     EndIf
     If Self.entityType="rope" 'Draw Rope
     For Local i:Int=1 to Self.bodyCount
     Local x:Float = Self.bodyGroup[i].GetPosition().x
     Local y:Float = Self.bodyGroup[i].GetPosition().y
     Local r:Float	= RadToDeg(Self.bodyGroup[i].GetAngle()) * -1
     DrawImage(Self.img, x * Self.physScale, y * Self.physScale, r, 1.0, 1.0, 0)
     Next
     EndIf
     Else
     Local x:Float	= Self.body.GetPosition().x
     Local y:Float	= Self.body.GetPosition().y
     Local r:Float	= RadToDeg(Self.body.GetAngle()) * -1
     DrawImage(Self.img, x * Self.physScale, y * Self.physScale, r, 1.0, 1.0, 0)
     EndIf
     Endif
     End

     */

})


