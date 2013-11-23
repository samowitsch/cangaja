
/**
 * extend B2DPolygon and define own bodyDef/fixDef and some additional properties/methods
 */
CG.B2DPolygon.extend('B2DPlayer', {
    init: function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {

        this.bodyDef = new b2BodyDef
        this.bodyDef.fixedRotation = true
        this.bodyDef.allowSleep = false
        this.bodyDef.bullet = true

        this.fixDef = new b2FixtureDef
        this.fixDef.restitution = 0.1
        this.linearDamping = 0
        this.angularDamping = 0

        this.jump = false
        this.max_hor_vel = 11
        this.max_ver_vel = 11

        this.points = 0
        this.offhor = 20
        this.offver = 20

        // this.font = new CG.Font().loadFont(Game.asset.getFontByName('blobby-points'))

        // this.ballcontacts = 0

        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)
    },
    addVelocity: function (vel) {
        var v = this.body.GetLinearVelocity();

        v.SelfAdd(vel);

        //check for max horizontal and vertical velocities and then set
        if (Math.abs(v.y) > this.max_ver_vel) {
            v.y = this.max_ver_vel * v.y / Math.abs(v.y);
        }

        if (Math.abs(v.x) > this.max_hor_vel) {
            v.x = this.max_hor_vel * v.x / Math.abs(v.x);
        }

        //set the new velocity
        this.body.SetLinearVelocity(v);

//        if (vel.y < 0) {
//            this.jump = true
//        }
    },
    applyImpulse: function (degrees, power) {
        if (this.body) {
            this.body.ApplyLinearImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
                Math.sin(degrees * (Math.PI / 180)) * power),
                this.body.GetWorldCenter());
        }
    }
})

/**
 * extend B2DPlayer with additional font drawing
 */
CG.B2DPlayer.extend('B2DRightPlayer', {
    init: function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {
        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)

        this.shadow = new CG.Sprite(Game.asset.getImageByName('beachvolleyball-shadow'), new CG.Point((this.body.GetPosition().x + 58) * this.scale, Game.height - 50))
        this.shadow.xscale = 1.3
        this.shadow.name = 'beachvolleyball-shadow'
        mainlayer.addElement(this.shadow)

    },
    draw: function () {
        this._super()
        this.font.drawText('' + this.points, Game.width - this.offhor - this.font.getTextWidth('' + this.points), this.offver)

    },
    update: function () {
        this._super()
        this.shadow.position.x = (this.body.GetPosition().x + 1.45) * this.scale
        this.shadow.xscale = this.shadow.yscale = (this.body.GetPosition().y * this.scale) / 250
    }
})

/**
 * extend B2DPlayer with additional font drawing
 */
CG.B2DPlayer.extend('B2DLeftPlayer', {
    init: function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {
        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)

        // this.shadow = new CG.Sprite(Game.asset.getImageByName('beachvolleyball-shadow'), new CG.Point((this.body.GetPosition().x + 58) * this.scale, Game.height - 50))
        // this.shadow.xscale = 1.3
        // this.shadow.name = 'beachvolleyball-shadow'
        // mainlayer.addElement(this.shadow)
    },
    draw: function () {
        this._super()
        // this.font.drawText('' + this.points, this.offhor, this.offver)

    },
    update: function () {
        this._super()
        // this.shadow.position.x = (this.body.GetPosition().x + 1.45) * this.scale
        // this.shadow.xscale = this.shadow.yscale = (this.body.GetPosition().y * this.scale) / 250
    }
})