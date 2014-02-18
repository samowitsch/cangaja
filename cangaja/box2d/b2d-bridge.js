/**
 * @description
 *
 * B2DBridge is a simple wrapper that creates a bridge with segments.
 * Just play with the params to get a good result.
 *
 * @class CG.B2DBridge
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DBridge', {
    /**
     * Options:
     * name {string}
     * image {mixed}
     * x {number}
     * y (number}
     * length {number}
     * segments {number}
     * segmentHeight {number}
     * world {object}
     * scale {number}
     *
     @example
     var e = new CG.B2DBridge({
           name: 'player',
           image: this.asset.getImageByName('glowball'),
           x: 100,
           y: 100,
           length: 600,
           segments: 20
           segmentHeight: 4,
           world: b2world,
           scale: 40
     })
     *
     *
     * @method init
     * @constructor
     * @param options {Object}
     * @return {*}
     */
    init: function (options) {

        CG._extend(this, {
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
             * @property length
             * @type {Number}
             */
            length: 0,
            /**
             * @property segments
             * @type {Number}
             */
            segments: 0,
            /**
             * @property segmentWidth
             * @type {Number}
             */
            segmentWidth: 0,
            /**
             * @property segmentHeight
             * @type {Number}
             */
            segmentHeight: 0,
            /**
             * @property anchor
             * @type {b2Vec2}
             */
            anchor: new b2Vec2(),
            /**
             * @property prevBodf
             * @type {Object}
             */
            prevBody: {},
            /**
             * @property bodyGroup
             * @type {Array}
             */
            bodyGroup: [],
            /**
             * @property bodyCount
             * @type {Number}
             */
            bodyCount: 0,
            /**
             * @property lowerAngle
             * @type {Number}
             */
            lowerAngle: -25,
            /**
             * @property upperAngle
             * @type {Number}
             */
            upperAngle: 25,
            /**
             * @property enableLimit
             * @type {boolean}
             */
            enableLimit: true
        })

        this._super(options)
        this.instanceOf = 'B2DBridge'

        this.setImage(this.image)

        /**
         * @property segmentWidth
         * @type {Number}
         */
        this.segmentWidth = ((this.length - this.x) / this.segments) / 2


        // BridgeStart

        this.fixtureDef = new b2FixtureDef()
        this.bodyShapeCircle = new b2CircleShape()
        this.bodyDef = new b2BodyDef()
        this.bodyDef.userData = this.id
        this.bodyShapeCircle.m_radius = this.segmentHeight / this.scale
        this.fixtureDef.density = this.density
        this.fixtureDef.restitution = this.restitution
        this.fixtureDef.friction = this.friction
        this.fixtureDef.shape = this.bodyShapeCircle
        this.bodyDef.position.SetXY(this.x / this.scale, this.y / this.scale)
        this.body = this.bodyGroup[0] = this.world.CreateBody(this.bodyDef)
        this.bodyGroup[0].CreateFixture(this.fixtureDef)
        this.prevBody = this.bodyGroup[0]

        // BridgeEnd
        this.bodyDef.position.SetXY(this.length / this.scale, this.y / this.scale)
        this.bodyDef.userData = this.id
        this.bodyGroup[1] = this.world.CreateBody(this.bodyDef)
        this.bodyGroup[1].CreateFixture(this.fixtureDef)

        // bridge elements
        this.fixtureDef = new b2FixtureDef()
        this.bodyShapePoly = new b2PolygonShape()
        this.bodyDef = new b2BodyDef()
        this.bodyDef.userData = this.id
        this.bodyShapePoly.SetAsBox(this.segmentWidth / this.scale, this.segmentHeight / this.scale)
        this.bodyDef.type = box2d.b2BodyType.b2_dynamicBody
        this.fixtureDef.shape = this.bodyShapePoly
        this.fixtureDef.density = this.density
        this.fixtureDef.restitution = this.restitution
        this.fixtureDef.friction = this.friction
        this.jointDef = new b2RevoluteJointDef()
        this.jointDef.lowerAngle = this.lowerAngle / CG.Const_180_PI
        this.jointDef.upperAngle = this.upperAngle / CG.Const_180_PI
        this.jointDef.enableLimit = this.enableLimit

        for (var i = 0, l = this.segments; i < l; i++) {
            this.bodyDef.position.SetXY(((this.x + this.segmentWidth) + (this.segmentWidth * 2) * i) / this.scale, this.y / this.scale)
            this.bodyGroup[i + 2] = this.world.CreateBody(this.bodyDef)
            this.bodyGroup[i + 2].CreateFixture(this.fixtureDef)
            this.anchor.SetXY((this.x + (this.segmentWidth * 2) * i) / this.scale, this.y / this.scale)
            this.jointDef.Initialize(this.prevBody, this.bodyGroup[i + 2], this.anchor)
            this.world.CreateJoint(this.jointDef)
            this.prevBody = this.bodyGroup[i + 2]
            this.bodyCount = i + 2
        }

        this.anchor.SetXY((this.x + (this.segmentWidth * 2) * this.segments - 1) / this.scale, this.y / this.scale)
        this.jointDef.Initialize(this.prevBody, this.bodyGroup[1], this.anchor)
        this.world.CreateJoint(this.jointDef)

        return this
    },
    draw: function () {
        for (var i = 2; i <= this.bodyCount; i++) {

            this.body = this.bodyGroup[i]

            Game.renderer.draw(this)

        }
    }
})


