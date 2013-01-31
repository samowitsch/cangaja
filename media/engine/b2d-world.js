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

        for (var i = 0; i < 10; i++) {
            //create dynamic circle object
            bodyDef.type = b2Body.b2_dynamicBody
            fixDef.shape = new b2CircleShape(
                Math.random() + 0.1 //radius
            );
            bodyDef.position.x = Math.random() * 5
            bodyDef.position.y = Math.random() * 10
            this.world.CreateBody(bodyDef).CreateFixture(fixDef)
        }

        // create dynamic polygon object
        bodyDef.type = b2Body.b2_dynamicBody
        fixDef.shape = new b2PolygonShape
        fixDef.shape.SetAsBox(
            Math.random() + 0.1 //half width
            , Math.random() + 0.1 //half height
        );
        bodyDef.position.x = Math.random() * 5
        bodyDef.position.y = Math.random() * 10
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
        );

    },
    draw:function () {
        this.world.DrawDebugData()
        this.world.ClearForces()
    },
    createBox:function (image, x, y, scale, stat) {
        var entity = new CG.B2DEntity()
        entity.createBox(this.world, image, 0, 0, 1, false)
        this.elements.push(entity)
    },
    createSphere:function () {
        var entity = new CG.B2DEntity()
        entity.createBox(this.world, image, 10, 0, 0, 1, false)
        this.elements.push(entity)
    },
    createPolyBody:function () {

    },
    createBridge:function () {

    },
    createRope:function () {

    }

})


