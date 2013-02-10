/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DWorld
 * @augments Layer
 * @constructor
 */

CG.Layer.extend('B2DWorld', {
    init:function (name) {
        this.name = name || ''
        this.debug = false

        this.elements = []

        this.world = new b2World(
            new b2Vec2(0, 10), //gravity
            true                 //allow sleep
        )


        this.scale = 40

        var fixDef = new b2FixtureDef
        fixDef.density = 1.0
        fixDef.friction = 0.5
        fixDef.restitution = 0.5

        var bodyDef = new b2BodyDef

        //create ground
        bodyDef.type = b2Body.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = Game.width2 / this.scale
        bodyDef.position.y = (Game.height / this.scale) - 1
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox((Game.width / this.scale) / 2, 0.5 / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall1
        bodyDef.type = b2Body.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = 10 / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        fixDef.shape = new b2PolygonShape;
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall2
        bodyDef.type = b2Body.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = (Game.width - 10) / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //setup debug draw
        var debugDraw = new b2DebugDraw()
        debugDraw.SetSprite(Game.b_ctx)
        debugDraw.SetDrawScale(this.scale)
        debugDraw.SetFillAlpha(0.3)
        debugDraw.SetLineThickness(1.0)
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
        this.world.SetDebugDraw(debugDraw)

    },
    update:function () {

        this.world.Step(
            1 / 60   //frame-rate
            , 10       //velocity iterations
            , 10       //position iterations
        )

        if (mousedown) {
            this.mouseDownAt(mousex / this.scale, mousey / this.scale);
        } else if (this.isMouseDown()) {
            this.mouseUp();
        }

        this.elements.forEach(function (element) {
            element.update()
        }, this)


    },
    draw:function () {

        if (this.debug) {
            this.world.DrawDebugData()
            this.world.ClearForces()
        }
        this.elements.forEach(function (element) {
            element.draw()
        }, this)

    },
    createBox:function (image, x, y, scale, stat) {
        var entity = new CG.B2DRectangle(this.world, image, x, y, scale, false)
        this.elements.push(entity)
    },
    createCircle:function (image, radius, x, y, scale, stat) {
        var entity = new CG.B2DCircle(this.world, image, radius, x, y, scale, stat)
        this.elements.push(entity)
    },
    createPolyBody:function (image, jsonpoly, x, y, scale, stat, bullet) {
        var entity = new CG.B2DPolygon(this.world, image, jsonpoly, x, y, scale, stat, bullet)
        this.elements.push(entity)
    },
    createBridge:function () {

    },
    createRope:function () {

    },
    mouseDownAt:function (x, y) {
        if (!this.mouseJoint) {
            var body = this.getBodyAt(x, y)
            if (body) {
                var md = new b2MouseJointDef()
                md.bodyA = this.world.GetGroundBody()
                md.bodyB = body
                md.target.Set(x, y)
                md.collideConnected = true
                md.maxForce = 300.0 * body.GetMass()
                this.mouseJoint = this.world.CreateJoint(md)
                body.SetAwake(true);
            }
        } else {
            this.mouseJoint.SetTarget(new b2Vec2(x, y))
        }
    },
    mouseUp:function () {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
    },
    getBodyAt:function (x, y) {
        var mousePVec = new b2Vec2(x, y);
        var aabb = new b2AABB();
        aabb.lowerBound.Set(x - 0.001, y - 0.001);
        aabb.upperBound.Set(x + 0.001, y + 0.001);

        // Query the world for overlapping shapes.

        var selectedBody = null;
        this.world.QueryAABB(function (fixture) {
            if (fixture.GetBody().GetType() != b2Body.b2_staticBody) {
                if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                    selectedBody = fixture.GetBody();
                    return false;
                }
            }
            return true;
        }, aabb);
        return selectedBody;
    },
    deleteBodyAt:function (x, y) {
        body = this.getBodyAt(x, y)
        if (body) {
            for (var i = 0, l = this.elements.length; i < l; i++) {
                //if b2entity found delete entity and b2body
                if (this.elements[i].body.m_islandIndex == body.m_islandIndex) {
                    this.removeElementByIndex(i)
                    this.world.DestroyBody(body)
                    return true
                }
            }
        }
        return false
    },
    isMouseDown:function () {
        return (this.mouseJoint != null);
    },
    removeElementByIndex:function (index) {
        this.elements.splice(index, 1);
    },
    applyImpulse:function (body, degrees, power) {
        if (body) {
            body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
                Math.sin(degrees * (Math.PI / 180)) * power),
                body.GetWorldCenter());
        }
    }

})


