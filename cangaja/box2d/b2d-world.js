/**
 * @description
 *
 * B2DWorld is a Box2dWeb wrapper with basic and easy methods for creating Box2d Objects like
 * lines, circles, rectangles, polybodies, ropes and bridges. Custom B2D Objects that extends
 * one of the basic B2D objects can added to the B2DWorld with the addCustom method.
 * The CG.B2DWorld can attached to an CG.Screen object as layer. The B2DWorld will handle
 * all physics and drawings.
 *
```

 var w = new CG.B2DWorld({
     name: 'box2d-world',
     scale: 40,
     debug: true,
     sleep: true
 })

 ```
 *
 * @class CG.B2DWorld
 * @xtend CG.Layer
 */

CG.Layer.extend('B2DWorld', {
    /**
     * Options:
     * name {string}
     * sleep {boolean}
     * scale {number}
     * debug {boolean}
     *
     * @method init
     * @constructor
     * @param options {object}
     */
    init: function (options) {

        CG._extend(this, {
            /**
             * @property framerate
             * @type {number}
             */
            framerate: 1 / 30,

            /**
             * @property name
             * @type {String}
             */
            name: '',
            /**
             * @property debug
             * @type {Boolean}
             */
            debug: false,
            /**
             * @property x
             * @type {Number}
             */
            x: 0,
            /**
             * @property y
             * @type {Number}
             */
            y: 0,
            /**
             * @property elements
             * @type {Array}
             */
            elements: [],

            /**
             * @property uid
             * @type {Number}
             */
            uid: 0, //uid counter for elements
            /**
             * @property scale
             * @type {Number}
             */
            scale: 40,
            /**
             * @property sleep
             * @type {Boolean}
             */
            sleep: true
        })

        if (options) {
            CG._extend(this, options)
        }

        /**
         * @property world
         * @type {b2World}
         */
        this.world = new b2World(
            new b2Vec2(0, 10), //gravity
            this.sleep
        )

        // add m_groundBody for use with b2MouseJoint
        this.world.m_groundBody = this.world.CreateBody(new b2BodyDef());

        //setup debug draw
        var debugDraw = new b2DebugDraw({
            scale: this.scale,
            canvas: Game.b_canvas,
            ctx: Game.b_ctx,
            flags: box2d.b2DrawFlags.e_shapeBit | box2d.b2DrawFlags.e_jointBit | box2d.b2DrawFlags.e_centerOfMassBit
        })
        this.world.SetDebugDraw(debugDraw)

    },
    /**
     * @method update
     */
    update: function () {

        this.world.Step(
            this.framerate   //frame-rate
            , 10       //velocity iterations
            , 10       //position iterations
        )

        if (CG.mousedown) {
            this.mouseDownAt(mousex, mousey);
        } else if (this.isMouseDown()) {
            this.mouseUp();
        }

        for (var i = 0, l = this.elements.length; i < l; i++) {
            this.elements[i].update()
        }


    },
    /**
     * @method draw
     */
    draw: function () {
        Game.b_ctx.save()
        Game.b_ctx.translate(this.x, this.y)

        for (var i = 0, l = this.elements.length; i < l; i++) {
            this.elements[i].draw()
        }

        if (this.debug) {
            this.world.DrawDebugData()
            this.world.ClearForces()
        }

        Game.b_ctx.restore()
    },
    /**
     * @description
     *
     * Custom extended objects can be added to the B2DWorld with this method.
     *
     * @method addCustom
     * @param obj      object    custom B2D object
     * @return {Object}
     */
    addCustom: function (obj) {
        this.uid = this.uid + 1
        obj.id.uid = this.uid
        this.elements.push(obj)
        return obj
    },
    /**
     * @description
     *
     * Checks if a B2D body Exists
     *
     * @method deleteBodyAt
     * @param body {Object}
     * @return {Boolean}
     */
    checkIfBodyExists: function (body) {
        if (body) {
            for (var i = 0, l = this.elements.length; i < l; i++) {
                //if b2entity found delete entity and b2body
                if (this.elements[i].body.m_userData.uid == body.m_userData.uid) {
                    return true
                }
            }
        }
        return false
    },
    /**
     * Options:
     * name {string}
     * image {mixed}  path to image, image or atlasimage from asset
     * x {number}
     * y {number}
     * bodyType {number}
     *
     @example
     b2world.createBox({
        name: 'glowball',
        image: this.asset.getImageByName('glowball'),
        radius: 22,
        x: this.mouse.x,
        y: this.mouse.y,
        bodyType: box2d.b2BodyType.b2_dynamicBody
     })
     * @description
     *
     * createBox creates a basic Box2D rectangle with some default settings.
     *
     * @method createBox
     * @param options {object}
     * @return {CG.B2DRectangle}
     */
    createBox: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DRectangle(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * startPoint {CG.Point}
     * endPoint {CG.Point}
     *
     @example
     b2world.createLine({
        name:'testline2',
        startPoint: new CG.Point(630, 200),
        endPoint: new CG.Point(150, 250)
     })
     *
     * @description
     *
     * createLine creates a basic Box2D line with some default settings.
     *
     * @method createLine
     * @param options {object}
     * @return {CG.B2DLine}
     */
    createLine: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DLine(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * image {mixed}  path to image, image or atlasimage from asset
     * radius {number}
     * x {number}
     * y {number}
     * bodyType {number}
     *
     @example
     b2world.createCircle({
        name: 'glowball',
        image: this.asset.getImageByName('glowball'),
        radius: 22,
        x: this.mouse.x,
        y: this.mouse.y,
        bodyType: box2d.b2BodyType.b2_dynamicBody
     })
     * @description
     *
     * createCircle creates a basic Box2D circle with some default settings
     *
     * @method createCircle
     * @param options {object}
     * @return {CG.B2DCircle}
     */
    createCircle: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DCircle(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * image {mixed}  path to image, image or atlasimage from asset
     * texturepacker {String}
     * x {number}
     * y {number}
     * bodyType {number}
     * bullet {boolean}
     *
     @example
     b2world.createPolyBody({
        name: 'powerstar75',
        image: this.asset.getImageByName('powerstar75'),
        texturepacker: this.asset.getJsonByName('powerstar75'),
        x: 200,
        y: -150,
        bodyType: box2d.b2BodyType.b2_dynamicBody,
        bullet: false
     })
     *
     * @description
     *
     * createPolyBody creates a Box2D polybody. A PhysicsEditor json (Lime + Corona JSON Exporter) file is needed for this
     * Box2D object. The polygonshape and some settings like density, bounce and friction are
     * taken from the json file at the moment.
     *
     * @method createPolyBody
     * @param options {object}
     * @return {CG.B2DPolygon}
     */
    createPolyBody: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DPolygon(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * image {mixed}
     * points {array}
     * x {number}
     * y {number}
     *
     @example
     var terrainPolys =
     [{
        	outer: [{
        		x: 0,
        		y: 100.5
        	}, {
        		x: 1024,
        		y: 100.5
        	}, {
        		x: 1024,
        		y: 768
        	}, {
        		x: 0,
        		y: 768
        	}],
        	holes: []
        }]

     b2world.createTerrain({
         name: 'terrain',
         image: false
         terrainShape: terrainPolys,
         x:0,
         y:0
     })
     *
     *
     * @description
     *
     * createTerrain
     *
     * @method createPolyBody
     * @param options {String}
     * @return {CG.B2DTerrain}
     */
    createTerrain: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DTerrain(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * points {array}
     * x {number}
     * y {number}
     *
     @example
     chainArray = [
         new CG.Point(0, 0),
         new CG.Point(50, 10),
         new CG.Point(100, 100),
         new CG.Point(200, 100),
         new CG.Point(250, 50),
         new CG.Point(300, 70)
     ]

     b2world.createChainShape({
         name: 'chaneshape',
         points: chainArray,
         x: 0,
         y: 200
     })
     *
     * @description
     *
     * createChainShape
     *
     * @method createChainShape
     * @param options {object}
     * @return {CG.B2DChainShape}
     */
    createChainShape: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DChainShape(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * image {mixed}  path to image, image or atlasimage from asset
     * x {number}
     * y {number}
     * length {number}
     * segments {number}
     * segmentHeight {number}
     *
     @example
     b2world.createBridge({
        name:'chain',
        image:this.asset.getImageByName('chain'),
        x: 20,
        y: 280,
        length: 620,
        segments: 27,
        segmentHeight: 3
     })
     *
     *
     * @description
     *
     * This method creates a B2D bridge. Just play with the params to get a good result!
     *
     * @method createBridge
     * @param options {object}
     * @return {CG.B2DBridge}
     */
    createBridge: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DBridge(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * Options:
     * name {string}
     * image {mixed}  path to image, image or atlasimage from asset
     * x {number}
     * y {number}
     * length {number}
     * segments {number}
     * segmentWidth {number}
     *
     @example
     b2world.createRope({
        name: 'chain-v',
        image: this.asset.getImageByName('chain-v'),
        x: 580,
        y: 0,
        length: 200,
        segments: 8,
        segmentWidth: 3
    })
     *
     *
     * @description
     *
     * This method creates a B2D rope. Just play with the params to get a good result!
     *
     * @method createRope
     * @param options {object}
     * @return {CG.B2DRope}
     */
    createRope: function (options) {
        options.world = this.world
        options.scale = this.scale
        this.uid = this.uid + 1
        var entity = new CG.B2DRope(options)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * Enables dragging B2D objects with the mouse.
     *
     * @method mouseDownAt
     * @param x {Number}
     * @param y {Number}
     */
    mouseDownAt: function (x, y) {
        if (!this.mouseJoint) {
            var body = this.getBodyAt(x, y)

            if (body) {
                var md = new b2MouseJointDef()
                md.bodyA = this.world.m_groundBody
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
    /**
     * @method mouseUp
     */
    mouseUp: function () {
        this.world.DestroyJoint(this.mouseJoint);
        this.mouseJoint = null;
    },
    /**
     * @description
     *
     * Get a B2D body at the give x, y position.
     *
     * @method getBodyAt
     * @param x {Number}
     * @param y {Number}
     * @return {*}
     */
    getBodyAt: function (x, y) {
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
    /**
     * @description
     *
     * Deletes a B2D body at the given x, y position
     *
     * @method deleteBodyAt
     * @param x {Number}
     * @param y (Number)
     * @return {Boolean}
     */
    deleteBodyAt: function (x, y) {
        body = this.getBodyAt(x, y)
        if (body) {
            for (var i = 0, l = this.elements.length; i < l; i++) {
                //if b2entity found delete entity and b2body
                if (this.elements[i].body.m_userData.uid == body.m_userData.uid) {
                    this.removeElementByIndex(i)
                    this.deleteBody(body)
                    return true
                }
            }
        }
        return false
    },
    /**
     * delete box2d body
     *
     * @param body
     */
    deleteBody: function (body) {
        this.world.DestroyBody(body)
    },
    /**
     * @method isMouseDown
     * @return {Boolean}
     */
    isMouseDown: function () {
        return (this.mouseJoint != null);
    },
    /**
     * delete cangaja element
     *
     * @method removeElementByIndex
     * @param index
     */
    removeElementByIndex: function (index) {
        this.elements.splice(index, 1);
    },
    /**
     * delete cangaja element
     *
     * @method removeElementByUid
     * @param uid
     */
    removeElementByUid: function (uid) {
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (typeof this.elements[i] === 'object' && typeof this.elements[i].id !== 'undefined') {
                if (this.elements[i].id.uid === uid) {
                    this.elements.splice(i, 1);
                }
            }
        }
    },
    /**
     * @method applyImpulse
     * @param body
     * @param degrees
     * @param power
     */
    applyImpulse: function (body, degrees, power) {
        if (body) {
            body.ApplyLinearImpulse(new b2Vec2(Math.cos(degrees * CG.Const_PI_180) * power,
                Math.sin(degrees * CG.Const_PI_180) * power),
                body.GetWorldCenter());
        }
    },
    /**
     * @method addContactListener
     * @param callbacks
     */
    addContactListener: function (callbacks) {
        var listener = new box2d.b2ContactListener;
        if (callbacks.BeginContact) listener.BeginContact = function (contact) {
            callbacks.BeginContact(contact.GetFixtureA().GetBody(),
                contact.GetFixtureB().GetBody());
        }
        if (callbacks.EndContact) listener.EndContact = function (contact) {
            callbacks.EndContact(contact.GetFixtureA().GetBody(),
                contact.GetFixtureB().GetBody());
        }
        if (callbacks.PostSolve) listener.PostSolve = function (contact, impulse) {
            callbacks.PostSolve(contact.GetFixtureA().GetBody(),
                contact.GetFixtureB().GetBody(),
                impulse.normalImpulses[0]);
        }
        if (callbacks.PreSolve) listener.PreSolve = function (contact, oldManifold) {
            callbacks.PreSolve(contact, oldManifold);
        }
        this.world.SetContactListener(listener);
    },
    /**
     * @method getBodySpec
     * @param b
     * @return {Object}
     */
    getBodySpec: function (b) {
        return {x: b.GetPosition().x, y: b.GetPosition().y, a: b.GetAngle(), c: {x: b.GetWorldCenter().x, y: b.GetWorldCenter().y}};
    }
})


