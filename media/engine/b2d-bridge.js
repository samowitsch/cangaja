/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DBridge
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DBridge', {
    init:function (world, name, image, radius, x, y, scale, stat) {
        this._super()
        this.world = world

        //TODO rewrite for bridge

//        this.id = {name:name, uid:0}
//
//        this.setImage(image)
//        this.x = x
//        this.y = y
//        this.scale = scale
//        this.stat = stat
//
//        this.xhandle = (this.width / 2)
//        this.yhandle = (this.height / 2)
//
//        if (this.stat) {
//            this.bodyDef.type = b2Body.b2_staticBody
//        } else {
//            this.bodyDef.type = b2Body.b2_dynamicBody
//        }
//
//        this.fixDef.shape = new b2PolygonShape
//        this.fixDef.shape.SetAsBox(this.width / scale * 0.5, this.height / scale * 0.5)
//        this.bodyDef.position.x = this.x / this.scale
//        this.bodyDef.position.y = this.y / this.scale
//        this.bodyDef.userData = this.id
//        this.body = this.world.CreateBody(this.bodyDef)
//        this.body.CreateFixture(this.fixDef)
//
//        return this

    },

/*

 Method CreateBridge:Void(world:b2World, img:Image, x:Float, y:Float, length:Float, segments:Int, segHeight:float, physScale:Float)
     Self.physScale = physScale
     Self.entityType="bridge"
     Self.img = img
     If img <> Null
     Self.img.SetHandle(Self.img.Width() / 2, Self.img.Height() / 2)
     Endif

     Local anchor:b2Vec2	= New b2Vec2()
     Local prevBody:b2Body
     Local segWidth:Float = ((length-x)/segments)/2

     '// BridgeStart
     Self.fixtureDef		= New b2FixtureDef()
     Self.bodyShapeCircle= New b2CircleShape()
     Self.bodyDef		= New b2BodyDef()
     Self.bodyShapeCircle.m_radius= segHeight / physScale
     Self.fixtureDef.density 	= 20.0
     Self.fixtureDef.restitution = 0.2
     Self.fixtureDef.friction 	= 0.2
     Self.fixtureDef.shape=Self.bodyShapeCircle
     Self.bodyDef.position.Set(x / physScale, y / physScale)
     Self.bodyGroup[0] = world.CreateBody(bodyDef)
     Self.bodyGroup[0].CreateFixture(fixtureDef)
     prevBody = Self.bodyGroup[0]

     '// BridgeEnd
     Self.bodyDef.position.Set(length / physScale, y / physScale)
     Self.bodyGroup[1] = world.CreateBody(bodyDef)
     Self.bodyGroup[1].CreateFixture(fixtureDef)

     '// BridgeSegments
     Self.fixtureDef		= New b2FixtureDef()
     Self.bodyShapePoly	= New b2PolygonShape()
     Self.bodyDef		= New b2BodyDef()
     Self.bodyShapePoly.SetAsBox(segWidth / physScale, segHeight / physScale)
     Self.bodyDef.type 	= b2Body.b2_Body
     Self.fixtureDef.shape 	= bodyShapePoly
     Self.fixtureDef.density = 20.0
     Self.fixtureDef.restitution = 0.2
     Self.fixtureDef.friction= 0.2
     Self.jointDef 		= New b2RevoluteJointDef()
     Self.jointDef.lowerAngle = -25 / (180/Constants.PI)
     Self.jointDef.upperAngle = 25 / (180/Constants.PI)
     Self.jointDef.enableLimit = True

     For Local i:Int = 0 To segments-1
     bodyDef.position.Set(((x+segWidth) + (segWidth*2) * i) / physScale, y / physScale)
     Self.bodyGroup[i+2] = world.CreateBody(bodyDef)
     Self.bodyGroup[i+2].CreateFixture(fixtureDef)
     anchor.Set((x + (segWidth*2) * i)/ physScale, y / physScale)
     jointDef.Initialize(prevBody, Self.bodyGroup[i+2], anchor)
     world.CreateJoint(jointDef)
     prevBody = Self.bodyGroup[i+2]
     Self.bodyCount = i+2
     Next
     anchor.Set((x + (segWidth*2) * segments-1) / physScale, y / physScale)
     jointDef.Initialize(prevBody, Self.bodyGroup[1], anchor)
     world.CreateJoint(jointDef)
 End

*/
    draw:function () {
        //TODO rewrite for bridge

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


