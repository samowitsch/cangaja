var renderStats, mainscreen, mainlayer, canvas, ctx, Game, b2world
var sfxWhistle, sfxCrowd, sfxNet, sfxIntro

var rightplayer, leftplayer, ball, start = true, startleft = false, startright = true, contact = false, diff = 0

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
    init: function (options) {
        this._super(options)
        this.debug = 0

        this.createLine({name: 'L', startPoint: new CG.Point(0, -500), endPoint: new CG.Point(0, Game.height)})                                             //left "wall"
        this.createLine({name: 'R', startPoint: new CG.Point(Game.width, -500), endPoint: new CG.Point(Game.width, Game.height)})                           //right "wall"
        this.createLine({name: 'T', startPoint: new CG.Point(0, -500), endPoint: new CG.Point(Game.width, -500), scale: this.scale})                                           //roof
        this.createLine({name: 'G', startPoint: new CG.Point(0, Game.height - 50), endPoint: new CG.Point(Game.width, Game.height - 50)})                  //ground
        this.createLine({name: 'N', startPoint: new CG.Point(Game.width2 - 10, Game.height2 - 43), endPoint: new CG.Point(Game.width2 - 10, Game.height)})   //net part
        this.createLine({name: 'N', startPoint: new CG.Point(Game.width2, Game.height2 - 51), endPoint: new CG.Point(Game.width2, Game.height)})             //net part
        this.createLine({name: 'N', startPoint: new CG.Point(Game.width2 + 10, Game.height2 - 43), endPoint: new CG.Point(Game.width2 + 10, Game.height)})   //net part

        ball = new CG.B2DBall({
            world: this.world,
            name: 'beachvolleyball',
            image: Game.asset.getImageByName('beachvolleyball'),
            radius: 38,
            x: 310,
            y: -200,
            restitution: 0.5,
            scale: this.scale,
            bodyType: box2d.b2BodyType.b2_staticBody
        })
        ball.body.SetPosition(new b2Vec2(16, 4.5))
        this.addCustom(ball)

        rightplayer = new CG.B2DRightPlayer({
            name: 'blobby-egg-right',
            image: Game.asset.getImageByName('blobby-egg-right'),
            texturepacker: Game.asset.getJsonByName('blobbies'),
            x: Game.width - 115,
            y: 305,
            bullet: true,
            allowSleep: false,
            restitution: 0.05,
            fixedRotation: true,
            world: this.world,
            scale: this.scale
        })
        this.addCustom(rightplayer)

        leftplayer = new CG.B2DLeftPlayer({
            name: 'blobby-egg-left',
            image: Game.asset.getImageByName('blobby-egg-left'),
            texturepacker: Game.asset.getJsonByName('blobbies'),
            x: 110,
            y: 305,
            bullet: true,
            allowSleep: false,
            restitution: 0.05,
            fixedRotation: true,
            world: this.world,
            scale: this.scale
        })
        this.addCustom(leftplayer)

        this.addContactListener({
            BeginContact: function (idA, idB) {
                //players are landing on ground, set jump flag to false
                if (idA.GetUserData().name == 'G' && idB.GetUserData().name == 'blobby-egg-left') {
                    leftplayer.jump = false
                }
                if (idA.GetUserData().name == 'G' && idB.GetUserData().name == 'blobby-egg-right') {
                    rightplayer.jump = false
                }
            },

            PostSolve: function (idA, idB, impulse) {
                //beachvolleyball hits the ground
                if (idA.GetUserData().name == 'G' && idB.GetUserData().name == 'beachvolleyball') {
                    if (ball.getPosition().x * 40 > 400) {
                        startleft = true
//                        ball.setPosition(new b2Vec2(4, 4.5))
//                        ball.setType(box2d.b2BodyType.b2_staticBody)
                    } else {
                        startright = true
//                        ball.setPosition(new b2Vec2(16, 4.5))
//                        ball.setType(box2d.b2BodyType.b2_staticBody)
                    }
                    sfxWhistle.play()
                    sfxCrowd.play()
                    start = true
                }
                //ball hits net
                if (idA.GetUserData().name == 'N' && idB.GetUserData().name == 'beachvolleyball') {
                    sfxNet.play()
                }

                //players contact with beachvolleyball
                if ((idA.GetUserData().name == 'blobby-egg-left' || idA.GetUserData().name == 'blobby-egg-right') && idB.GetUserData().name == 'beachvolleyball') {
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
                    startleft = startright = false

                    contact = true

                    if (idA.GetUserData().name == 'blobby-egg-right')
                        diff = (idA.GetPosition().x - idA.GetLocalCenter().x) - (idB.GetPosition().x - idB.GetLocalCenter().x)
                    if (idA.GetUserData().name == 'blobby-egg-left')
                        diff = (idB.GetPosition().x - idB.GetLocalCenter().x) - (idA.GetPosition().x - idA.GetLocalCenter().x)
                }

            },
            PreSolve: function (contact, oldManifold) {
                var fixtureA = contact.GetFixtureA();
                var fixtureB = contact.GetFixtureB();
//                console.log(contact, fixtureA, fixtureB, oldManifold)
            }
        });

    }
})

/**
 * extend B2DPolygon and define own bodyDef/fixDef and some additional properties/methods
 */
CG.B2DPolygon.extend('B2DPlayer', {
    init: function (options) {
        this._super(options)

        this.jump = false
        this.max_hor_vel = 11
        this.max_ver_vel = 11

        this.points = 0
        this.offhor = 20
        this.offver = 20

        this.font = new CG.Font().loadFont({font: Game.asset.getFontByName('blobby-points')})

        this.ballcontacts = 0

    }
})

/**
 * extend B2DPlayer with additional font drawing
 */
CG.B2DPlayer.extend('B2DRightPlayer', {
    init: function (options) {
        this._super(options)

        this.shadow = new CG.Sprite({image: Game.asset.getImageByName('beachvolleyball-shadow'), position: new CG.Point((this.body.GetPosition().x + 58) * this.scale, Game.height - 50)})
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
        this.shadow.position.x = (this.body.GetPosition().x) * this.scale
        this.shadow.xscale = this.shadow.yscale = (this.body.GetPosition().y * this.scale) / 250
    }
})

/**
 * extend B2DPlayer with additional font drawing
 */
CG.B2DPlayer.extend('B2DLeftPlayer', {
    init: function (options) {
        this._super(options)

        this.shadow = new CG.Sprite({image: Game.asset.getImageByName('beachvolleyball-shadow'), position: new CG.Point((this.body.GetPosition().x + 58) * this.scale, Game.height - 50)})
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
        this.shadow.position.x = (this.body.GetPosition().x) * this.scale
        this.shadow.xscale = this.shadow.yscale = (this.body.GetPosition().y * this.scale) / 250
    }
})

/**
 * extend B2DCircle adding custom bodyDef/fixDef and control arrow (sprite)
 */
CG.B2DCircle.extend('B2DBall', {
    init: function (options) {

        this._super(options)


        this.arrow = new CG.Sprite({image: Game.asset.getImageByName('arrow'), position: new CG.Point(this.body.GetPosition().x * this.scale, 15)})
        this.arrow.name = 'arrow'
        mainlayer.addElement(this.arrow)
        this.shadow = new CG.Sprite({image: Game.asset.getImageByName('beachvolleyball-shadow'), position: new CG.Point(this.body.GetPosition().x * this.scale, Game.height - 50)})
        this.shadow.name = 'beachvolleyball-shadow'
        mainlayer.addElement(this.shadow)

    },
    update: function () {
        this._super()
        this.arrow.position.x = this.body.GetPosition().x * this.scale
        this.shadow.position.x = this.body.GetPosition().x * this.scale
        if (this.body.GetPosition().y * this.scale < 100) {
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

        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})

        back = new CG.Sprite({image: this.asset.getImageByName('blobby-back'), position: new CG.Point(400, 240)})
        back.name = 'back'
        mainlayer.addElement(back)


        ctrlleft = new CG.Sprite({image: this.asset.getImageByName('ctrl-left'), position: new CG.Point(0 + 40, this.height - 30)})
        ctrlleft.name = 'ctrlleft'
        mainlayer.addElement(ctrlleft)
        ctrlright = new CG.Sprite({image: this.asset.getImageByName('ctrl-right'), position: new CG.Point(this.width - 40, this.height - 30)})
        ctrlright.name = 'ctrlright'
        mainlayer.addElement(ctrlright)

        //create Box2D World
        b2world = new CG.B2DTestbed({name: 'box2d-world', sleep: false})

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
                    leftplayer.jump = true
                    leftplayer.addVelocity(new b2Vec2(0, -9))
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
                    rightplayer.jump = true
                    rightplayer.addVelocity(new b2Vec2(0, -9))
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
        if (contact && start) {
            ball.setType(box2d.b2BodyType.b2_dynamicBody)
            ball.addVelocity(new b2Vec2(diff * 3, -12))
            contact = false
            start = false
        }
        if (startleft) {
            ball.setPosition(new b2Vec2(4, 4.5))
            ball.setType(box2d.b2BodyType.b2_staticBody)
            startleft = false
            start = true
        } else if (startright) {
            ball.setPosition(new b2Vec2(16, 4.5))
            ball.setType(box2d.b2BodyType.b2_staticBody)
            startright = false
            start = true
        }
    },
    draw: function () {
        abadi.drawText(title, this.width2 - (abadi.getTextWidth(title) / 2), 10)
    }
})