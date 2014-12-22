CG.B2DEntity.extend('B2DPlayer', {
    /**
     * @method init
     * @constructor
     * @param options     {Object}
     * @return {*}
     */
    init: function (options) {
        this._super(options)
        this.instanceOf = 'B2DRectangle'

        this.setImage(this.image)

        this.vecs = []

        this.onLadder = false
        this.onGround = false
        this.isJumping = false
        this.isFalling = false

        this.animState = ''
        this.animDelay = 6
        this.animStanding = new CG.Sprite({
            name: 'player',
            image: Game.asset.getImageByName('player'),
            position: new CG.Point(250, 100),
            delay: 6
        })
        this.animWalkingLeft = new CG.Animation({
            name: 'player-anim',
            image: Game.asset.getImageByName('player-anim'),
            position: new CG.Point(250, 100),
            startFrame: 4,
            endFrame: 6,
            width: 38,
            height: 45,
            delay: 6
        })
        this.animWalkingRight = new CG.Animation({
            name: 'player-anim',
            image: Game.asset.getImageByName('player-anim'),
            position: new CG.Point(250, 100),
            startFrame: 7,
            endFrame: 9,
            width: 38,
            height: 45,
            delay: 6
        })
        this.animClimbing = new CG.Animation({
            name: 'player-anim',
            image: Game.asset.getImageByName('player-anim'),
            position: new CG.Point(250, 100),
            startFrame: 10,
            endFrame: 12,
            width: 38,
            height: 45,
            delay: 6
        })
        this.animCurrent = this.animStanding

        /**
         * @property bodyDef.type
         * @type {box2d.b2BodyType.b2_staticBody/box2d.b2BodyType.b2_dynamicBody/box2d.b2BodyType.b2_kinematicBody/box2d.b2BodyType.b2_bulletBody}
         */
        this.bodyDef.type = this.bodyType

        /**
         * @property bodyDef.position.x
         * @type {Number}
         */
        this.bodyDef.position.x = this.x / this.scale
        /**
         * @property bodyDef.position.y
         * @type {Number}
         */
        this.bodyDef.position.y = this.y / this.scale
        /**
         * @property bodyDef.userData
         * @type {*}
         */
        this.bodyDef.userData = this.id
        /**
         * @property body
         * @type {b2Body}
         */
        this.body = this.world.CreateBody(this.bodyDef)

        // main body collision polygon
        var collisionShape = [
            {x: -0.2, y: -0.52},
            {x: 0.2, y: -0.52},
            {x: 0.05, y: 0.54},
            {x: 0.03, y: 0.55},
            {x: -0.03, y: 0.55},
            {x: -0.05, y: 0.54}
        ]

        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsArray(
            collisionShape,
            collisionShape.length
        )

        this.body.CreateFixture(this.fixDef)

        //this.fixDef = new b2FixtureDef
        //this.fixDef.shape = new b2CircleShape(10.0)
        //this.body.CreateFixture(this.fixDef)

        // sensor at bottom of player
        var sensorShape = [
            {x: 0.2, y: 0.52},
            {x: 0.2, y: 0.60},
            {x: -0.2, y: 0.60},
            {x: -0.2, y: 0.52}
        ]
        this.fixDef = new b2FixtureDef
        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsArray(
            sensorShape,
            sensorShape.length
        )
        this.fixDef.isSensor = true
        this.body.CreateFixture(this.fixDef)

        this.initKeyBoard()

        return this
    },
    draw: function () {
        this.animCurrent.draw()
    },
    update: function () {
        this._super()

        if (stick.active && !this.isJumping && !this.isFalling) {
            var move = new b2Vec2(0, 0)
            //if (b2world.player.onGround || b2world.player.onLadder) {
            move.SelfAdd(new b2Vec2(4 * stick.normal.x, 0))
            if (stick.normal.x > 0) {
                this.setAnimWalkRight()
            } else {
                this.setAnimWalkLeft()
            }
            this.setAnimDelay(stick.normal.x)
            //}
            if (b2world.player.onLadder) {
                move.SelfAdd(new b2Vec2(0, 4 * stick.normal.y))
                this.setAnimClimbing()
                this.setAnimDelay(stick.normal.y)
            }
            this.body.SetLinearVelocity(move)
        } else {
            this.setAnimDelay(0)
        }

        this.animCurrent.update()
    },
    initKeyBoard: function () {
        window.onkeydown = function (evt) {
            this.setAnimDelay(1)
            if (evt.keyCode == 37) { //cursor left
                this.body.SetLinearVelocity(new b2Vec2(-3, 0))
                this.setAnimWalkLeft()
            }
            if (evt.keyCode == 38) { //cursor up
                if (this.onLadder) {
                    this.body.SetLinearVelocity(new b2Vec2(0, -5))
                    this.setAnimClimbing()
                } else {
                    this.body.ApplyForce(new b2Vec2(0, -100), this.body.GetWorldCenter())
                }
            }
            if (evt.keyCode == 39) { //cursor right
                this.body.SetLinearVelocity(new b2Vec2(3, 0))
                this.setAnimWalkRight()
            }
            if (evt.keyCode == 40) { //cursor down
                this.body.SetLinearVelocity(new b2Vec2(0, 5))
                this.setAnimClimbing()
            }
        }.bind(this)

    },
    setAnimWalkLeft: function () {
        if (this.animState === 'left') return
        this.animWalkingLeft.position.x = this.animCurrent.position.x
        this.animWalkingLeft.position.y = this.animCurrent.position.y
        this.animWalkingLeft.delay = this.animCurrent.delay
        this.animCurrent = this.animWalkingLeft
        this.animState = 'left'
    },
    setAnimWalkRight: function () {
        if (this.animState === 'right') return
        this.animWalkingRight.position.x = this.animCurrent.position.x
        this.animWalkingRight.position.y = this.animCurrent.position.y
        this.animWalkingRight.delay = this.animCurrent.delay
        this.animCurrent = this.animWalkingRight
        this.animState = 'right'
    },
    setAnimClimbing: function () {
        if (this.animState === 'climb') return
        this.animClimbing.position.x = this.animCurrent.position.x
        this.animClimbing.position.y = this.animCurrent.position.y
        this.animClimbing.delay = this.animCurrent.delay
        this.animCurrent = this.animClimbing
        this.animState = 'climb'
    },
    setAnimDelay: function (faculty) {
        this.animCurrent.delay = this.animDelay / Math.abs(faculty)
    },
    startJump: function () {
        if (!this.isJumping && !this.onLadder && !this.isFalling) {
            this.isJumping = true
            this.body.SetLinearVelocity(new b2Vec2(5 * stick.normal.x, -5))
        }
    },
    startFalling: function () {
        if (!this.isJumping && !this.onGround && !this.onLadder && !this.isFalling) {
            this.isFalling = true
            this.body.SetLinearVelocity(new b2Vec2(3 * stick.normal.x, 4))
        }
    }
})


