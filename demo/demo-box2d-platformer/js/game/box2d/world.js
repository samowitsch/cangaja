CG.B2DWorld.extend('B2DLevel', {
    init: function (name) {
        this._super(name)

        // add ground layers defined in map file
        this.addGround()
        // add ladders defined in map file
        this.addLadders()
        // add ladders defined in map file
        this.addBridges()

        this.playerRealWorldPosition = new CG.Point(150, 50)

        this.player = new CG.B2DPlayer({
            world: this.world,
            name: 'player',
            image: Game.asset.getImageByName('player'),
            fixedRotation: true,
            restitution: 0.01,
            friction: 3,
            density: 10,
            x: 125,
            y: 150,
            scale: this.scale
        })

        this.addCustom(this.player)

        this.addContactListener({
            BeginContact: function (idA, idB) {
                var d = [idA, idB]
                if (!navigator.isCocoonJS) {
                    console.log('Begincontact', JSON.stringify(idA.m_userData), JSON.stringify(idB.m_userData))
                }
                if (idA.m_userData.name === 'ladder' && idB.m_userData.name === 'player') {
                    b2world.player.body.SetGravityScale(0)
                    b2world.player.body.SetLinearDamping(10)
                    b2world.player.onLadder = true
                    b2world.player.isFalling = false
                    b2world.player.isJumping = false
                }
                if (idA.m_userData.name === 'ground' && idB.m_userData.name === 'player') {
                    b2world.player.onGround = true
                    b2world.player.isFalling = false
                    b2world.player.isJumping = false
                }
            },
            EndContact: function (idA, idB) {
                var d = [idA, idB]
                if (!navigator.isCocoonJS) {
                    console.log('EndContact', JSON.stringify(idA.m_userData), JSON.stringify(idB.m_userData))
                }
                if (idA.m_userData.name === 'ladder' && idB.m_userData.name === 'player') {
                    b2world.player.onLadder = false
                    b2world.player.body.SetGravityScale(1)
                    b2world.player.body.SetLinearDamping(0)
                    b2world.player.startFalling()
                }
                if (idA.m_userData.name === 'ground' && idB.m_userData.name === 'player') {
                    b2world.player.onGround = false
                    b2world.player.startFalling()
                }
            },
            PreSolve: function (contact, oldManifold) {
                var d = [contact, oldManifold]
            },
            PostSolve: function (idA, idB, impulse) {
                if (idA.m_userData.name === 'ground' && idB.m_userData.name === 'player') {
                    b2world.player.isFalling = false
                }
            }
        });

    },
    update: function () {
        var temp = this.player.body.GetPosition()
        this.player.animCurrent.position.x = this.playerRealWorldPosition.x = temp.x * this.scale >> 0
        this.player.animCurrent.position.y = this.playerRealWorldPosition.y = temp.y * this.scale >> 0

        this._super()
    },
    addGround: function () {
        for (var i = 0, l = map.grounds.length; i < l; i++) {
            var ground = map.grounds[i]

            var chainArray = []

            for (var iv = 0, il = ground.polyline.length; iv < il; iv++) {
                chainArray.push(new CG.Point(ground.polyline[iv].x, ground.polyline[iv].y))
            }

            this.createChainShape({
                name: 'ground',
                points: chainArray,
                friction: 0.12,
                restitution: 0,
                x: ground.x,
                y: ground.y
            })

        }
    },
    addLadders: function () {
        for (var i = 0, l = map.ladders.length; i < l; i++) {
            var ladder = map.ladders[i],
                ladderScaledWidth2 = ladder.width / this.scale / 2,
                ladderScaledHeight2 = ladder.height / this.scale / 2,
                fixDef = new b2FixtureDef,
                bodyDef = new b2BodyDef

            fixDef.density = 1.0
            fixDef.friction = 0.5
            fixDef.restitution = 0.5

            bodyDef.type = box2d.b2BodyType.b2_staticBody
            // positions the center of the object (not upper left!)
            bodyDef.position.x = ladder.x / this.scale + ladderScaledWidth2
            bodyDef.position.y = ladder.y / this.scale + ladderScaledHeight2
            bodyDef.userData = {name: 'ladder'}
            fixDef.shape = new b2PolygonShape
            // half width, half height. eg actual height here is 1 unit
            fixDef.shape.SetAsBox(ladderScaledWidth2, ladderScaledHeight2)
            var body = this.world.CreateBody(bodyDef).CreateFixture(fixDef)
            body.SetSensor(true)
            body.update = function () {
            }
            body.draw = function () {
            }
            this.addCustom({
                body: body,
                id: 0,
                draw: function () {
                },
                update: function () {
                }
            })

        }

    },
    addBridges: function () {
        for (var i = 0, l = map.bridges.length; i < l; i++) {


            var bridge = map.bridges[i],
                x = bridge.x,
                y = bridge.y,
                width = bridge.width

            console.log('Bridge', bridge)

            // bridge test
            this.createBridge({
                name: 'ground',
                image: Game.asset.getImageByName('chain'),
                x: x,
                y: y + 2,
                density: 10,
                friction: 1,
                length: x + width,
                segments: width / 25,
                segmentHeight: 3
            })
        }
    }
})