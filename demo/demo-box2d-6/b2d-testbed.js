CG.B2DWorld.extend('B2DTestbed', {
    init: function (options) {
        this._super(options)

        var fixDef = new b2FixtureDef
        fixDef.density = 1.0
        fixDef.friction = 0.5
        fixDef.restitution = 0.5

        var bodyDef = new b2BodyDef

        //create ground
        bodyDef.type = box2d.b2BodyType.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = Game.width2 / this.scale
        bodyDef.position.y = (Game.height / this.scale)
        bodyDef.userData = 'ground'
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox((Game.width / this.scale) / 2, 0.5 / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall1
        bodyDef.type = box2d.b2BodyType.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = 10 / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        bodyDef.userData = 'wall left'
        fixDef.shape = new b2PolygonShape;
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)

        //create wall2
        bodyDef.type = box2d.b2BodyType.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = (Game.width - 10) / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        bodyDef.userData = 'wall right'
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)

        clonk = new CG.Clonk({
            world: this.world,
            name: 'spritetestphysics',
            image: Game.asset.getImageByName('spritetestphysics'),
            texturepacker: Game.asset.getJsonByName('spritetestphysics'),
            x: 350,
            y: 10,
            scale: this.scale
        })

        this.addCustom(clonk)

    },
    /**
     * @Author Christian Schmitt
     *
     * @description
     *
     * Get a Static B2D body at the give x, y position.
     *
     * @method getBodyAt
     * @param x {Number}
     * @param y {Number}
     * @return {*}
     */
    getStaticBodyAt: function (x, y) {
        var worldx = (x - this.x) / this.scale;
        var worldy = (y - this.y) / this.scale

        var mousePVec = new b2Vec2(worldx, worldy)  //b2world offset for x and y!!!
        var aabb = new b2AABB()
        aabb.lowerBound.SetXY(worldx - 0.001, worldy - 0.001)
        aabb.upperBound.SetXY(worldx + 0.001, worldy + 0.001)

        // Query the world for overlapping shapes.

        var selectedBody = null;
        this.world.QueryAABB(function (fixture) {
            if (fixture.GetBody().GetType() == box2d.b2BodyType.b2_staticBody) {
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
     * @Author Christian Schmitt
     *
     * @description
     *
     * Get a list of Static B2D bodys at the give x, y position.
     *
     * @method getStaticBodyListAt
     * @param x {Number}
     * @param y {Number}
     * @return {*}
     */
    getStaticBodyListAt: function (x, y, radius1, radius2) {
        var node = this.world.GetBodyList();
        console.log(x,y,radius1,radius2,this,node)
        while (node) {
            var body = node
            if (typeof body === 'object') {
                // if ( body.GetUserData() !== null && body.GetUserData().name === 'rock') {
                if (body.GetUserData() !== null && body.GetUserData().name === 'rock' && body.GetType() !== box2d.b2BodyType.b2_dynamicBody) {

                    var bodyPos = body.GetPosition();
                    var distx = x - bodyPos.x * 40;
                    var disty = y - bodyPos.y * 40;
                    var dist = Math.sqrt((distx * distx) + (disty * disty));

                    if (dist < radius1 + radius2) {
                        body.SetType(box2d.b2BodyType.b2_dynamicBody);
                    }
                }
                node = body.GetNext()
            }
        }
    }
})