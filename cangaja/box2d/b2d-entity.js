/**
 * @description
 *
 * B2DEntity is the base class with properties for all B2D objects.
 * This class handles also the drawings for all classes.
 *
 ```

 var e = new CG.B2DEntity({
   name: 'player',
   image: new CG.Point(100,100),
   world: b2world,
   x: 10,
   y: 20,
   scale: 40
 })

 ```
 *
 * @class CG.B2DEntity
 * @extends CG.Entity
 */

CG.Entity.extend('B2DEntity', {
    /**
     * Options:
     * name {string} id or name to identify
     * image {mixed} path to image, image or atlasimage from asset
     * world {object} reference to world of B2DWorld
     * x {number} the x position
     * y {number} the y position
     * scale {number} the world scale of B2DWorld
     *
     * @method init
     * @constructor
     * @param options {object}
     * @return {*}
     */

    init: function (options) {
        this._super()
        this.instanceOf = 'B2DEntity'

        CG._extend(this, {
            /**
             * @property world
             * @type {}
             */
            world: {},
            /**
             * @property scale
             * @type {}
             */
            scale: {},
            /**
             * @property body
             * @type {}
             */
            body: {},
            /**
             * @property body
             * @type {b2Body}
             */
            bodyType: box2d.b2BodyType.b2_dynamicBody,
            /**
             * @property bullet
             * @type {b2Body}
             */
            bullet: false,
            /**
             * @property alpha
             * @type {Number}
             */
            alpha: 1,
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
             * @property scale
             * @type {Number}
             */
            scale: 40,
            /**
             * @property id
             * @type {Object}
             */
            id: {name: '', uid: 0},
            /**
             * @property world
             * @type {b2World}
             */
            world: {},
            /**
             * @property isHit
             * @type {Boolean}
             */
            isHit: false,
            /**
             * @property strength
             * @type {Number}
             */
            strength: 100,
            /**
             * @property dead
             * @type {Boolean}
             */
            dead: false,
            /**
             * @property angle
             * @type {Number}
             */
            angle: 0,
            /**
             * @property density
             * @type {Number}
             */
            density: 1.0,
            /**
             * @property restitution
             * @type {Number}
             */
            restitution: 0.1,
            /**
             * @property friction
             * @type {Number}
             */
            friction: 1,
            /**
             * @property allowSleep
             * @type {boolean}
             */
            allowSleep: true,
            /**
             * @property awake
             * @type {boolean}
             */
            awake: true,
            /**
             * @property fixedRotation
             * @type {boolean}
             */
            fixedRotation: false,
            /**
             * @property bodyDef
             * @type {b2BodyDef}
             */
            bodyDef: new b2BodyDef,
            /**
             * @property fixDef
             * @type {b2FixtureDef}
             */
            fixDef: new b2FixtureDef
        })

        if (options) {
            CG._extend(this, options)
            this.id.name = options.name
        }

        /**
         * @property bodyDef.alowSleep
         * @type {Boolean}
         */
        this.bodyDef.allowSleep = this.allowSleep
        /**
         * @property bodyDef.awake
         * @type {Boolean}
         */
        this.bodyDef.awake = this.awake
        /**
         * @property bodyDef.bullet
         * @type {Boolean}
         */
        this.bodyDef.bullet = this.bullet
        /**
         * @property bodyDef.angle
         * @type {number}
         */
        this.bodyDef.angle = this.angle
        /**
         * @property bodyDef.fixedRotation
         * @type {Boolean}
         */
        this.bodyDef.fixedRotation = this.fixedRotation
        /**
         * @property fixDef.density
         * @type {Number}
         */
        this.fixDef.density = this.density
        /**
         * @property fixDef.friction
         * @type {Number}
         */
        this.fixDef.friction = this.friction
        /**
         * @property fixDef.restitution
         * @type {Number}
         */
        this.fixDef.restitution = this.restitution

        return this
    },
    /**
     * @method hit
     * @param impulse
     * @param source
     */
    hit: function (impulse, source) {
        this.isHit = true;
        if (this.strength) {
            this.strength -= impulse;
            if (this.strength <= 0) {
                this.dead = true
            }
        }
    },
    update: function () {
    },
    draw: function () {

        Game.renderer.draw(this)

    },
    /**
     * @method addVelocity
     * @param b2Vec2
     */
    addVelocity: function (b2Vec2) {
        var v = this.body.GetLinearVelocity();

        v.SelfAdd(b2Vec2);

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
    /**
     * @method applyImpulse
     * @param degrees
     * @param power
     */
    applyImpulse: function (degrees, power) {
        if (this.body) {
            this.body.ApplyLinearImpulse(new b2Vec2(Math.cos(degrees * CG.Const_PI_180) * power,
                Math.sin(degrees * CG.Const_PI_180) * power),
                this.body.GetWorldCenter())
        }
    },
    /**
     * @method setType
     * @param b2BodyType
     */
    setType: function (b2BodyType) {
        this.body.SetType(b2BodyType)
    },
    /**
     * @method setPosition
     * @param b2Vec2
     */
    setPosition: function (b2Vec2) {
        this.body.SetPosition(b2Vec2)
    },
    /**
     * @method getPosition
     */
    getPosition: function () {
        return this.body.GetPosition()
    }

})


