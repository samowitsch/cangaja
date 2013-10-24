/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description
 *
 * B2DWorld is a Box2dWeb wrapper with basic and easy methods for creating Box2d Objects like
 * lines, circles, rectangles, polybodies, ropes and bridges. Custom B2D Objects that extends
 * one of the basic B2D objects can added to the B2DWorld with the addCustom method.
 * The CG.B2DWorld can attached to an CG.Screen object as layer. The B2DWorld will handle
 * all physics and drawings.
 *
 * @class CG.B2DWorld
 * @xtend CG.Layer
 */

CG.Layer.extend('B2DWorld', {
    /**
     * @method init
     * @constructor
     * @param name {String} name of the b2dworld
     * @param opt {object} additional options
     */
    init: function (name, opt) {

        this.framerate = 1 / 30

        /**
         * @property opt
         * @type {object}
         */
        opt = opt || {}

        /**
         * @property name
         * @type {String}
         */
        this.name = name || ''
        /**
         * @property debug
         * @type {Boolean}
         */
        this.debug = false
        /**
         * @property x
         * @type {Number}
         */
        this.x = 0
        /**
         * @property y
         * @type {Number}
         */
        this.y = 0
        /**
         * @property elements
         * @type {Array}
         */
        this.elements = []

        /**
         * @property world
         * @type {b2World}
         */
        this.world = new b2World(
            new b2Vec2(0, 10), //gravity
            opt.sleep || true        //allow sleep
        )
        /**
         * @property uid
         * @type {Number}
         */
        this.uid = 0 //uid counter for elements
        /**
         * @property scale
         * @type {Number}
         */
        this.scale = 40

        /**
         * add m_groundBody for use with b2MouseJoint
         */
        this.world.m_groundBody = this.world.CreateBody(new b2BodyDef());


        //setup debug draw
        var debugDraw = new b2DebugDraw({
            scale: this.scale,
            canvas: Game.b_canvas,
            ctx: Game.b_ctx,
            flags: box2d.b2DrawFlags.e_shapeBit | box2d.b2DrawFlags.e_jointBit
        })
        this.world.SetDebugDraw(debugDraw)

    },
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
    draw: function () {
        Game.b_ctx.save()
        Game.b_ctx.translate(this.x, this.y)

        //TODO ? place for CanvasRenderer ?

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
     * Custom extended objects can be added to the B2DWork with this method.
     *
     * @method addCustom
     * @param obj      object    custom B2D object
     */
    addCustom: function (obj) {
        this.uid = this.uid + 1
        obj.id.uid = this.uid
        this.elements.push(obj)
    },
    /**
     * @description
     *
     * createBox creates a basic Box2D rectangle with some default settings.
     *
     * @method createBox
     * @param id      {String}      id or name to identify
     * @param image   {mixed}       path to image, image or tpimage from asset
     * @param x       {Number}     the x position
     * @param y       {Number}     the y position
     * @param stat    {Boolean}     is the body static or dynamic
     */
    createBox: function (id, image, x, y, stat) {
        this.uid = this.uid + 1
        var entity = new CG.B2DRectangle(this.world, id, image, x, y, this.scale, stat)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * createLine creates a basic Box2D line with some default settings.
     *
     * @method createLine
     * @param id      {String}    id or name to identify
     * @param start   {CG.Point}  start o fline
     * @param end     {CG.Point}  end of line
     */
    createLine: function (id, start, end) {
        this.uid = this.uid + 1
        var entity = new CG.B2DLine(this.world, id, new b2Vec2(start.x / this.scale, start.y / this.scale), new b2Vec2(end.x / this.scale, end.y / this.scale), this.scale)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * createCircle creates a basic Box2D circle with some default settings
     *
     * @method createCircle
     * @param id      {String}      id or name to identify
     * @param image   {mixed}       path to image, image or tpimage from asset
     * @param radius  {Number}     the radius
     * @param x       {Number}     the x position
     * @param y       {Number}     the y position
     * @param stat    {Boolean}     is the body static or dynamic
     */
    createCircle: function (id, image, radius, x, y, stat) {
        this.uid = this.uid + 1
        var entity = new CG.B2DCircle(this.world, id, image, radius, x, y, this.scale, stat)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * createPolyBody creates a Box2D polybody. A PhysicsEditor json (Lime + Corona JSON Exporter) file is needed for this
     * Box2D object. The polygonshape and some settings like density, bounce and friction are
     * taken from the json file at the moment.
     *
     * @method createPolyBody
     * @param id        {String}      id or name to identify
     * @param image     {mixed}       path to image, image or tpimage from asset
     * @param jsonpoly  {String}      json file from PhysicsEditor from asset
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param stat      {Boolean}     is the body static or dynamic
     * @param bullet    {Boolean}     bullet option
     */
    createPolyBody: function (id, image, jsonpoly, x, y, stat, bullet) {
        this.uid = this.uid + 1
        var entity = new CG.B2DPolygon(this.world, id, image, jsonpoly, x, y, this.scale, stat, bullet)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * createTerrain
     *
     * @method createPolyBody
     * @param id        {String}      id or name to identify
     * @param image     {mixed}       path to image, image or tpimage from asset
     * @param terrainpoly  {Array}      array of vertices to start terrain building
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param stat      {Boolean}     is the body static or dynamic
     * @param bullet    {Boolean}     bullet option
     */
    createTerrain: function (id, image, terrainpoly, x, y, stat, bullet) {
        this.uid = this.uid + 1
        var entity = new CG.B2DTerrain(this.world, id, image, terrainpoly, x, y, this.scale, stat, bullet)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * createChainShape
     *
     * @method createChainShape
     * @param id        {String}      id or name to identify
     * @param vertices  {array}      vertices for chainshape CG.Point array
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     */
    createChainShape: function (id, vertices, x, y, stat) {
        this.uid = this.uid + 1
        var entity = new CG.B2DChainShape(this.world, id, vertices, x, y, this.scale, stat)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * This method creates a B2D bridge. Just play with the params to get a good result!
     *
     * @method createBridge
     * @param id          {String}      id or name to identify
     * @param image         {mixed}       path to image, image or tpimage from asset
     * @param x             {Number}     the x position
     * @param y             {Number}     the y position
     * @param length        {Number}     the length/width of the bridge
     * @param segments      {Number}     segments of the bridge
     * @param segmentHeight {Number}     height of a segment
     * @return {*}
     */
    createBridge: function (id, image, x, y, length, segments, segmentHeight) {
        this.uid = this.uid + 1
        var entity = new CG.B2DBridge(this.world, id, image, x, y, length, segments, segmentHeight, this.scale)
        entity.id.uid = this.uid
        this.elements.push(entity)
        return entity
    },
    /**
     * @description
     *
     * This method creates a B2D rope. Just play with the params to get a good result!
     *
     * @method createRope
     * @param id            {String}      id or name to identify
     * @param image         {mixed}       path to image, image or tpimage from asset
     * @param x             {Number}     the x position
     * @param y             {Number}     the y position
     * @param length        {Number}     the length/width of the bridge
     * @param segments      {Number}     segments of the bridge
     * @param segmentHeight {Number}     height of a segment
     * @return {*}
     */
    createRope: function (id, image, x, y, length, segments, segmentHeight) {
        this.uid = this.uid + 1
        var entity = new CG.B2DRope(this.world, id, image, x, y, length, segments, segmentHeight, this.scale)
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
            console.log(body)
            if (body) {
                var md = new b2MouseJointDef()
                md.bodyA = this.world.m_groundBody
                md.bodyB = body
                md.target.SetXY((x - this.x) / this.scale, (y - this.y) / this.scale)
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
        aabb.lowerBound.SetXY(worldx - 0.001, worldy - 0.001)
        aabb.upperBound.SetXY(worldx + 0.001, worldy + 0.001)

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
                    this.world.DestroyBody(body)
                    return true
                }
            }
        }
        return false
    },
    /**
     * @method isMouseDown
     * @return {Boolean}
     */
    isMouseDown: function () {
        return (this.mouseJoint != null);
    },
    /**
     * @method removeElementByIndex
     * @param index
     */
    removeElementByIndex: function (index) {
        this.elements.splice(index, 1);
    },
    /**
     * @method applyImpulse
     * @param body
     * @param degrees
     * @param power
     */
    applyImpulse: function (body, degrees, power) {
        if (body) {
            body.ApplyLinearImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
                Math.sin(degrees * (Math.PI / 180)) * power),
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


