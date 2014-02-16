/**
 * @description
 *
 * B2DRope is a simple wrapper that creates a rope with segments.
 * Just play with the params to get a good result.
 *
 * @class CG.B2DRope
 * @extends CG.B2DEntity
 */

CG.B2DEntity.extend('B2DRope', {
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
     var e = new CG.B2DRope({
           name: 'player',
           image: this.asset.getImageByName('glowball'),
           x: 100,
           y: 100,
           length: 600,
           segments: 20
           segmentWidth: 4,
           world: b2world,
           scale: 40
     })
     *
     * @method init
     * @constructor
     * @param options {Object}
     * @return {*}
     */
    init: function (options) {
        this._super()
        this.instanceOf = 'B2DRope'

        CG._extend(this, {
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
             * @property segmentHeight
             * @type {Number}
             */
            segmentHeight: 0,
            /**
             * @property segmentWidth
             * @type {*}
             */
            segmentWidth: 0,
            /**
             * @property anchor
             * @type {b2Vec2}
             */
            anchor: new b2Vec2(),
            /**
             * @property prevBody
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
             * @property body
             * @type {object}
             */
            body: {},
            /**
             * @property density
             * @type {Number}
             */
            density: 1.0,
            /**
             * @property restitution
             * @type {Number}
             */
            restitution: 0.2,
            /**
             * @property friction
             * @type {Number}
             */
            friction: 0.2,
            /**
             * @property lowerAngle
             * @type {Number}
             */
            lowerAngle: -25,
            /**
             * @property upperAngle
             * @type {Number}
             */
            upperAngle: 25

        })

        if (options) {
            CG._extend(this, options)
            this.setImage(this.image)
        }

        this.segmentHeight = ((this.length - this.y) / this.segments) / 2

        // RopeStart
        this.fixtureDef = new b2FixtureDef()
        this.bodyShapeCircle = new b2CircleShape()
        this.bodyDef = new b2BodyDef()
        this.bodyDef.userData = this.id
        this.bodyShapeCircle.m_radius = this.segmentWidth / this.scale
        this.fixtureDef.density = this.density
        this.fixtureDef.restitution = this.restitution
        this.fixtureDef.friction = this.friction
        this.fixtureDef.shape = this.bodyShapeCircle
        this.bodyDef.position.SetXY(this.x / this.scale, this.y / this.scale)
        this.body = this.bodyGroup[0] = this.world.CreateBody(this.bodyDef)
        this.bodyGroup[0].CreateFixture(this.fixtureDef)
        this.prevBody = this.bodyGroup[0]

        // RopeSegments
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
        this.jointDef.enableLimit = true


        for (var i = 0, l = this.segments; i < l; i++) {
            this.bodyDef.position.SetXY(this.x / this.scale, ((this.y + this.segmentHeight) + (this.segmentHeight * 2) * i) / this.scale)
            this.bodyGroup[i + 1] = this.world.CreateBody(this.bodyDef)
            this.bodyGroup[i + 1].CreateFixture(this.fixtureDef)
            this.anchor.SetXY(this.x / this.scale, (this.y + (this.segmentHeight * 2) * i) / this.scale)
            this.jointDef.Initialize(this.prevBody, this.bodyGroup[i + 1], this.anchor)
            this.world.CreateJoint(this.jointDef)
            this.prevBody = this.bodyGroup[i + 1]
            this.bodyCount = i + 1
        }

        return this

    },

    draw: function () {
        for (var i = 1; i <= this.bodyCount; i++) {

            this.body = this.bodyGroup[i]

            Game.renderer.draw(this)

        }
    }
})


