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
    init:function (name, opt) {
        this.name = name || ''
        this.debug = false

        this.x = 0
        this.y = 0

        this.elements = []

        this.world = new b2World(
            new b2Vec2(0, 10), //gravity
            opt.sleep || true        //allow sleep
        )

        this.uid = 0 //uid counter for elements

        this.scale = 40


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
            this.mouseDownAt(mousex, mousey);
        } else if (this.isMouseDown()) {
            this.mouseUp();
        }

        this.elements.forEach(function (element) {
            element.update()
        }, this)


    },
    draw:function () {
        Game.b_ctx.save()
        Game.b_ctx.translate(this.x, this.y)
        if (this.debug) {
            this.world.DrawDebugData()
            this.world.ClearForces()
        }
        this.elements.forEach(function (element) {
            element.draw()
        }, this)
        Game.b_ctx.restore()
    },
    /**
     *
     * @param obj      object    custom B2D object
     */
    addCustom:function (obj) {
        this.uid = this.uid + 1
        obj.id.uid = this.uid
        this.elements.push(obj)
    },
    /**
     *
     * @param id      string      id or name to identify
     * @param image   mixed       path to image, image or tpimage from asset
     * @param x       integer     the x position
     * @param y       integer     the y position
     * @param stat    boolean     is the body static or dynamic
     */
    createBox:function (id, image, x, y, stat) {
        this.uid = this.uid + 1
        var entity = new CG.B2DRectangle(this.world, id, image, x, y, this.scale, stat)
        entity.id.uid = this.uid
        this.elements.push(entity)
    },
    /**
     *
     * @param id      string    id or name to identify
     * @param start   CG.Point  start o fline
     * @param end     CG.Point  end of line
     */
    createLine:function (id, start, end) {
        this.uid = this.uid + 1
        var entity = new CG.B2DLine(this.world, id, new b2Vec2(start.x / this.scale, start.y / this.scale), new b2Vec2(end.x / this.scale, end.y / this.scale), this.scale)
        entity.id.uid = this.uid
        this.elements.push(entity)
    },
    /**
     *
     * @param id      string      id or name to identify
     * @param image   mixed       path to image, image or tpimage from asset
     * @param radius  integer     the radius
     * @param x       integer     the x position
     * @param y       integer     the y position
     * @param stat    boolean     is the body static or dynamic
     */
    createCircle:function (id, image, radius, x, y, stat) {
        this.uid = this.uid + 1
        var entity = new CG.B2DCircle(this.world, id, image, radius, x, y, this.scale, stat)
        entity.id.uid = this.uid
        this.elements.push(entity)
    },
    /**
     *
     * @param id        string      id or name to identify
     * @param image     mixed       path to image, image or tpimage from asset
     * @param jsonpoly  string      json file from PhysicsEditor from asset
     * @param x         integer     the x position
     * @param y         integer     the y position
     * @param stat      boolean     is the body static or dynamic
     * @param bullet    boolean     bullet option
     */
    createPolyBody:function (id, image, jsonpoly, x, y, stat, bullet) {
        this.uid = this.uid + 1
        var entity = new CG.B2DPolygon(this.world, id, image, jsonpoly, x, y, this.scale, stat, bullet)
        entity.id.uid = this.uid
        this.elements.push(entity)
    },
    /**
     *
     * @param id          string      id or name to identify
     * @param image         mixed       path to image, image or tpimage from asset
     * @param x             integer     the x position
     * @param y             integer     the y position
     * @param length        integer     the length/width of the bridge
     * @param segments      integer     segments of the bridge
     * @param segmentHeight integer     height of a segment
     * @return {*}
     */
    createBridge:function (id, image, x, y, length, segments, segmentHeight) {
        this.uid = this.uid + 1
        var entity = new CG.B2DBridge(this.world, id, image, x, y, length, segments, segmentHeight, this.scale)
        entity.id.uid = this.uid
        this.elements.push(entity)
    },
    /**
     *
     * @param id            string      id or name to identify
     * @param image         mixed       path to image, image or tpimage from asset
     * @param x             integer     the x position
     * @param y             integer     the y position
     * @param length        integer     the length/width of the bridge
     * @param segments      integer     segments of the bridge
     * @param segmentHeight integer     height of a segment
     * @return {*}
     */
    createRope:function (id, image, x, y, length, segments, segmentHeight) {
        this.uid = this.uid + 1
        var entity = new CG.B2DRope(this.world, id, image, x, y, length, segments, segmentHeight, this.scale)
        entity.id.uid = this.uid
        this.elements.push(entity)
    },
    mouseDownAt:function (x, y) {
        if (!this.mouseJoint) {
            var body = this.getBodyAt(x, y)
            if (body) {
                var md = new b2MouseJointDef()
                md.bodyA = this.world.GetGroundBody()
                md.bodyB = body
                md.target.Set((x - this.x) / this.scale, (y - this.y) / this.scale)
                md.collideConnected = true
                md.maxForce = 300.0 * body.GetMass()
                this.mouseJoint = this.world.CreateJoint(md)
                body.SetAwake(true);
            }
        } else {
            this.mouseJoint.SetTarget(new b2Vec2((x - this.x) / this.scale, (y - this.y) / this.scale))
        }
    },
    mouseUp:function () {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
    },
    getBodyAt:function (x, y) {
        var worldx = (x - this.x) / this.scale;
        var worldy = (y - this.y) / this.scale

        var mousePVec = new b2Vec2(worldx, worldy)  //b2world offset for x and y!!!
        var aabb = new b2AABB()
        aabb.lowerBound.Set(worldx - 0.001, worldy - 0.001)
        aabb.upperBound.Set(worldx + 0.001, worldy + 0.001)

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
                if (this.elements[i].body.m_userData.uid == body.m_userData.uid) {
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
    },
    addContactListener:function (callbacks) {
        var listener = new Box2D.Dynamics.b2ContactListener;
        if (callbacks.BeginContact) listener.BeginContact = function (contact) {
            callbacks.BeginContact(contact.GetFixtureA().GetBody().GetUserData(),
                contact.GetFixtureB().GetBody().GetUserData());
        }
        if (callbacks.EndContact) listener.EndContact = function (contact) {
            callbacks.EndContact(contact.GetFixtureA().GetBody().GetUserData(),
                contact.GetFixtureB().GetBody().GetUserData());
        }
        if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
            callbacks.PostSolve(contact.GetFixtureA().GetBody().GetUserData(),
                contact.GetFixtureB().GetBody().GetUserData(),
                impulse.normalImpulses[0]);
        }
        this.world.SetContactListener(listener);
    },
    getBodySpec:function (b) {
        return {x:b.GetPosition().x, y:b.GetPosition().y, a:b.GetAngle(), c:{x:b.GetWorldCenter().x, y:b.GetWorldCenter().y}};
    }

})


