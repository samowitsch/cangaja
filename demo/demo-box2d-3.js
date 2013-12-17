var renderStats, mainscreen, mainlayer, canvas, ctx, Game, b2world
var sfxWhistle, sfxCrowd, sfxNet, sfxIntro

var rightplayer, leftplayer, ball, startleft = false, startright = true

var mousex = 0, mousey = 0
var tp = new CG.AtlasTexturePacker()

var title = 'Tribute to blobby...'

window.onload = function () {

    canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};

/**
 * extend B2DWorld and create own objects in the constructor.
 */
CG.B2DWorld.extend('B2DTestbed', {
    init: function (name, opt) {
        this._super(name, opt)
        this.debug = 0

        this.addCustom(new CG.B2DBlobbyWall(this.world, 'L', new CG.Point(0, -500), new CG.Point(0, Game.height), this.scale))                                              //left "wall"
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'R', new CG.Point(Game.width, -500), new CG.Point(Game.width, Game.height), this.scale))                            //right "wall"
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'T', new CG.Point(0, -500), new CG.Point(Game.width, -500), this.scale))                                            //roof
        this.addCustom(new CG.B2DBlobbyGround(this.world, 'G', new CG.Point(0, Game.height - 50), new CG.Point(Game.width, Game.height - 50), this.scale))                  //ground
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'N', new CG.Point(Game.width2 - 10, Game.height2 - 43), new CG.Point(Game.width2 - 10, Game.height), this.scale))   //net part
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'N', new CG.Point(Game.width2, Game.height2 - 51), new CG.Point(Game.width2, Game.height), this.scale))             //net part
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'N', new CG.Point(Game.width2 + 10, Game.height2 - 43), new CG.Point(Game.width2 + 10, Game.height), this.scale))   //net part

        ball = new CG.B2DBall(this.world, 'beachvolleyball', Game.asset.getImageByName('beachvolleyball'), 38, 310, -200, this.scale, box2d.b2BodyType.b2_dynamicBody)
        this.addCustom(ball)

        rightplayer = new CG.B2DRightPlayer(this.world, 'blobby-egg-right', Game.asset.getImageByName('blobby-egg-right'), Game.asset.getJsonByName('blobbies'), Game.width - 175, 230, this.scale, box2d.b2BodyType.b2_dynamicBody, false)
        this.addCustom(rightplayer)
        leftplayer = new CG.B2DLeftPlayer(this.world, 'blobby-egg-left', Game.asset.getImageByName('blobby-egg-left'), Game.asset.getJsonByName('blobbies'), 50, 230, this.scale, box2d.b2BodyType.b2_dynamicBody, false)
        this.addCustom(leftplayer)

        this.addContactListener({
            BeginContact: function (idA, idB) {
                if ((idA.GetUserData().name == 'blobby-egg-left' || idA.GetUserData().name == 'blobby-egg-right') && idB.GetUserData().name == 'beachvolleyball') {
                    startleft = startright = false
                }
                //beachvolleyball hits the ground
                if (idA.GetUserData().name == 'G' && idB.GetUserData().name == 'beachvolleyball') {
                    if (ball.body.GetPosition().x * 40 > 400) {
                        startleft = true
                    } else {
                        startright = true
                    }
                    sfxWhistle.play()
                    sfxCrowd.play()
                }
                //ball hits net
                if (idA.GetUserData().name == 'N' && idB.GetUserData().name == 'beachvolleyball') {
                    sfxNet.play()
                }

                //players are landing on ground, set jump flag to false
                if (idA.GetUserData().name == 'G' && idB.GetUserData().name == 'blobby-egg-left') {
                    leftplayer.jump = false
                }
                if (idA.GetUserData().name == 'G' && idB.GetUserData().name == 'blobby-egg-right') {
                    rightplayer.jump = false
                }

                //players contact with beachvolleyball
                if ((idA.GetUserData().name == 'blobby-egg-left' || idA.GetUserData().name == 'blobby-egg-right') && idB.GetUserData().name == 'beachvolleyball') {
                    //console.log(['PostSolve', idA, idB, impulse]);
                    b2world.elements[idA.GetUserData().uid - 1].points += 1
                    if (idA.GetUserData().name == 'blobby-egg-right') {
                        leftplayer.points = 0
                        if (rightplayer.points > 4) {
                            //alert('rightplayer lost to much contacts')
                        }
                    } else if (idA.GetUserData().name == 'blobby-egg-left') {
                        rightplayer.points = 0
                        if (leftplayer.points > 4) {
                            //alert('leftplayer lost to much contacts')
                        }
                    }
                }
            },

            PostSolve: function (idA, idB, impulse) {

//                    var entityA = world[idA];
//                    var entityB = world[idB];
            },
            PreSolve: function (contact, oldManifold) {
//                console.log([contact, oldManifold])
                var fixtureA = contact.GetFixtureA();
                var fixtureB = contact.GetFixtureB();
            }
        });

    }
})

/**
 * extend B2DLine and define/overwrite custom bodyDef and fixDef in constructor
 */
CG.B2DLine.extend('B2DBlobbyWall', {
    init: function (world, name, start, end, scale) {
        this.bodyDef = new b2BodyDef //'overwrite' class bodyDef
        this.bodyDef.allowSleep = true
        this.bodyDef.awake = false

        this.fixDef = new b2FixtureDef //'overwrite' class fixDef
        this.fixDef.density = 1.0
        this.fixDef.friction = 0.5
        this.fixDef.restitution = 0.5

        this._super(world, name, new b2Vec2(start.x / scale, start.y / scale), new b2Vec2(end.x / scale, end.y / scale), scale)
    }
})

/**
 * extend B2DLine and define/overwrite bodyDef and fixDef in constructor
 */
CG.B2DLine.extend('B2DBlobbyGround', {
    init: function (world, name, start, end, scale) {
        this.bodyDef = new b2BodyDef //'overwrite' class bodyDef
        this.bodyDef.allowSleep = true
        this.bodyDef.awake = false

        this.fixDef = new b2FixtureDef //'overwrite' class fixDef
        this.fixDef.density = 1.0
        this.fixDef.friction = 0.2
        this.fixDef.restitution = 0.2

        this._super(world, name, new b2Vec2(start.x / scale, start.y / scale), new b2Vec2(end.x / scale, end.y / scale), scale)
    }
})

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

        this.font = new CG.Font().loadFont(Game.asset.getFontByName('blobby-points'))

        this.ballcontacts = 0

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

        this.shadow = new CG.Sprite(Game.asset.getImageByName('beachvolleyball-shadow'), new CG.Point((this.body.GetPosition().x + 58) * this.scale, Game.height - 50))
        this.shadow.xscale = 1.3
        this.shadow.name = 'beachvolleyball-shadow'
        mainlayer.addElement(this.shadow)
    },
    draw: function () {
        this._super()
        this.font.drawText('' + this.points, this.offhor, this.offver)

    },
    update: function () {
        this._super()
        this.shadow.position.x = (this.body.GetPosition().x + 1.45) * this.scale
        this.shadow.xscale = this.shadow.yscale = (this.body.GetPosition().y * this.scale) / 250
    }
})

/**
 * extend B2DCircle adding custom bodyDef/fixDef and control arrow (sprite)
 */
CG.B2DCircle.extend('B2DBall', {
    init: function (world, name, image, radius, x, y, scale, stat) {
        this.bodyDef = new b2BodyDef //'overwrite' class bodyDef
        this.bodyDef.allowSleep = true
        this.bodyDef.awake = true
        this.bodyDef.bullet = true

        this.fixDef = new b2FixtureDef //'overwrite' class fixDef
        this.fixDef.density = 0.5
        this.fixDef.friction = 0.1
        this.fixDef.restitution = 0.55

        this._super(world, name, image, radius, x, y, scale, stat)


        this.arrow = new CG.Sprite(Game.asset.getImageByName('arrow'), new CG.Point(this.body.GetPosition().x * this.scale, 15))
        this.arrow.name = 'arrow'
        mainlayer.addElement(this.arrow)
        this.shadow = new CG.Sprite(Game.asset.getImageByName('beachvolleyball-shadow'), new CG.Point(this.body.GetPosition().x * this.scale, Game.height - 50))
        this.shadow.name = 'beachvolleyball-shadow'
        mainlayer.addElement(this.shadow)

    },
    update: function () {
        this._super()
        this.arrow.position.x = this.body.GetPosition().x * this.scale
        this.shadow.position.x = this.body.GetPosition().x * this.scale
        if (this.body.GetPosition().y* this.scale < 100) {
            this.shadow.xscale = this.shadow.yscale = 0.2
        } else {
            this.shadow.xscale = this.shadow.yscale = ( this.body.GetPosition().y * this.scale) / 400
        }
    }
})


/**
 * extend CG.Game
 */
CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('mousedown', function (e) {
            CG.mousedown = this.mousedown = true
        }.bind(this), true);

        this.canvas.addEventListener('mouseup', function () {
            CG.mousedown = this.mousedown = false
        }.bind(this), true);

        this.canvas.addEventListener('mousemove', function (evt) {
            CG.mouse = this.mouse = {
                x: evt.clientX - this.canvas.offsetLeft,
                y: evt.clientY - this.canvas.offsetTop
            }
        }.bind(this), false)
    },
    preload: function () {
        //sfx
        sfxIntro = new buzz.sound('media/sfx/blobby-intro', {
            formats: [ 'ogg', 'mp3'/*, 'aac', 'wav'*/ ],
            preload: true,
            autoplay: true,
            loop: true
        });
        sfxCrowd = new buzz.sound('media/sfx/blobby-crowd', {
            formats: [ 'ogg', 'mp3'/*, 'aac', 'wav'*/ ],
            preload: true,
            autoplay: false,
            loop: false
        });
        sfxWhistle = new buzz.sound('media/sfx/blobby-whistle', {
            formats: [ 'ogg', 'mp3'/*, 'aac', 'wav'*/ ],
            preload: true,
            autoplay: false,
            loop: false
        });
        sfxNet = new buzz.sound('media/sfx/blobby-net', {
            formats: [ 'ogg', 'mp3'/*, 'aac', 'wav'*/ ],
            preload: true,
            autoplay: false,
            loop: false
        });

        this.asset
            .addFont('media/font/abadi_ez.txt', 'abadi', 'abadi')

            //physics engine
            .addJson('media/img/blobbies.json', 'blobbies')

            .addImage('media/img/blobby-egg-left.png', 'blobby-egg-left')
            .addImage('media/img/blobby-egg-right.png', 'blobby-egg-right')

            .addImage('media/img/blobby-back.png', 'blobby-back')
            .addImage('media/img/blobby-ctrl-right.png', 'ctrl-right')
            .addImage('media/img/blobby-ctrl-left.png', 'ctrl-left')
            .addImage('media/img/arrow-25.png', 'arrow')
            .addImage('media/img/beachvolleyball.png', 'beachvolleyball')
            .addImage('media/img/beachvolleyball-shadow.png', 'beachvolleyball-shadow')

            //font
            .addImage('media/font/blobby-points.png', 'blobby-points')
            .addFont('media/font/blobby-points.txt', 'blobby-points')

            //texturepacker
            .addImage('media/img/texturepacker.png', 'texturepacker')
            .addJson('media/img/texturepacker.json', 'texturepacker-json')

            .startPreLoad()
    },
    create: function () {
        //create texturepacker image in asset
        tp.loadJson(this.asset.getJsonByName('texturepacker-json'))

        //put the texturepacker TPImages to the asset
        this.asset.images.push.apply(this.asset.images, tp.getAtlasImages())

        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))

        //screen and layer
        mainscreen = new CG.Screen('mainscreen')
        mainlayer = new CG.Layer('mainlayer')

        back = new CG.Sprite(this.asset.getImageByName('blobby-back'), new CG.Point(400, 240))
        back.name = 'back'
        mainlayer.addElement(back)


        ctrlleft = new CG.Sprite(this.asset.getImageByName('ctrl-left'), new CG.Point(0 + 40, this.height - 30))
        ctrlleft.name = 'ctrlleft'
        mainlayer.addElement(ctrlleft)
        ctrlright = new CG.Sprite(this.asset.getImageByName('ctrl-right'), new CG.Point(this.width - 40, this.height - 30))
        ctrlright.name = 'ctrlright'
        mainlayer.addElement(ctrlright)

        var opt = {sleep: false}
        //create Box2D World
        b2world = new CG.B2DTestbed('box2d-world', opt)

        //add it to a CGLayer
        mainlayer.addElement(b2world)

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        document.onkeydown = function (evt) {
            var keyCode = evt.keyCode

            if (keyCode == 71) { //g
                b = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                console.log([b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
            }
            if (keyCode == 73) { //i
                body = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                b2world.applyImpulse(body, 270, 200)
            }

            if (keyCode == 65) { // a - left
                leftplayer.addVelocity(new b2Vec2(-3, 0))
            }
            if (keyCode == 87) { // w - up
                if (leftplayer.jump == false) {
                    //self.applyImpulse(270, self.hor_impulse)
                    leftplayer.addVelocity(new b2Vec2(0, -9))
                    leftplayer.jump = true
                }
            }
            if (keyCode == 68) { // d - right
                leftplayer.addVelocity(new b2Vec2(3, 0))
            }

            if (keyCode == 37) { //left
                rightplayer.addVelocity(new b2Vec2(-3, 0))

            }
            if (keyCode == 38) { //up
                if (rightplayer.jump == false) {
                    //self.applyImpulse(270, self.hor_impulse)
                    rightplayer.addVelocity(new b2Vec2(0, -9))
                    rightplayer.jump = true
                }
            }
            if (keyCode == 39) { //right
                rightplayer.addVelocity(new b2Vec2(3, 0))
            }

        }.bind(this);

        //after creation start game loop
        this.loop()
    },
    update: function () {
        if (startleft == true) {
            ball.body.SetPosition(new b2Vec2(4, 4.5))
            //ball.body.SetAngularVelocity(0)
            ball.body.SetSleepingAllowed()
            ball.body.SetAngularVelocity(0)
        } else if (startright == true) {
            ball.body.SetPosition(new b2Vec2(16, 4.5))
            //ball.body.SetAngularVelocity(0)
            ball.body.SetSleepingAllowed()
            ball.body.SetAngularVelocity(0)
        }
    },
    draw: function () {
        abadi.drawText(title, this.width2 - (abadi.getTextWidth(title) / 2), 10)
    }
})