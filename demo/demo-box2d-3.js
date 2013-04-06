var renderStats, updateStats

var mainscreen, mainlayer

var can, canvas, ctx
var sfxWhistle,sfxCrowd,sfxNet,sfxIntro

var rightplayer, leftplayer, ball
var startleft = false, startright = true

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()
var collision = {direction: '', overlap: 0}

var gw = 800, gh = 480


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = gw
    can.height = gh
    can.id = 'canvas'
    document.body.appendChild(can)

    //mouse move


    can.addEventListener("mousedown", function (e) {
        mousedown = true;
    }, true);

    can.addEventListener("mouseup", function () {
        mousedown = false;
    }, true);

    can.addEventListener('mousemove', function (evt) {
        var rect = can.getBoundingClientRect(), root = document.documentElement;
        mousex = evt.clientX - canvas.offsetLeft;
        mousey = evt.clientY - canvas.offsetTop;
    }, false);

    Game.preload()
};

/**
 * extend B2DWorld and create own objects in the constructor.
 */
CG.B2DWorld.extend('B2DTestbed', {
    init: function (name, opt) {
        this._super(name, opt)
        this.debug = 0

        this.addCustom(new CG.B2DBlobbyWall(this.world, 'L', new CG.Point(0, -400), new CG.Point(0, Game.height), this.scale))
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'R', new CG.Point(Game.width, -400), new CG.Point(Game.width, Game.height), this.scale))
        this.addCustom(new CG.B2DBlobbyGround(this.world, 'G', new CG.Point(0, Game.height - 50), new CG.Point(Game.width, Game.height - 50), this.scale))
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'N', new CG.Point(Game.width2 - 10, Game.height2 - 43), new CG.Point(Game.width2 - 10, Game.height), this.scale))
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'N', new CG.Point(Game.width2, Game.height2 - 51), new CG.Point(Game.width2, Game.height), this.scale))
        this.addCustom(new CG.B2DBlobbyWall(this.world, 'N', new CG.Point(Game.width2 + 10, Game.height2 - 43), new CG.Point(Game.width2 + 10, Game.height), this.scale))

        ball = new CG.B2DBall(this.world, 'beachvolleyball', Game.asset.getImageByName('beachvolleyball'), 75, 310, -200, this.scale, false)
        this.addCustom(ball)

        rightplayer = new CG.B2DRightPlayer(this.world, 'blobby-egg-right', Game.asset.getImageByName('blobby-egg-right'), Game.asset.getJsonByName('blobbies'), Game.width - 175, 230, this.scale, false, false)
        this.addCustom(rightplayer)
        leftplayer = new CG.B2DLeftPlayer(this.world, 'blobby-egg-left', Game.asset.getImageByName('blobby-egg-left'), Game.asset.getJsonByName('blobbies'), 50, 230, this.scale, false, false)
        this.addCustom(leftplayer)

        this.addContactListener({
            BeginContact: function (idA, idB) {
                if ((idA.name == 'blobby-egg-left' || idA.name == 'blobby-egg-right') && idB.name == "beachvolleyball") {
                    startleft = startright = false
                }
                //beachvolleyball hits the ground
                if (idA.name == 'G' && idB.name == "beachvolleyball") {
                    if(ball.body.GetPosition().x * 40 > 400){
                        startleft = true
                    } else {
                        startright = true
                    }
                    sfxWhistle.play()
                    sfxCrowd.play()
                }
                //ball hits net
                if (idA.name == 'N' && idB.name == "beachvolleyball") {
                    sfxNet.play()
                }

                //players are landing on ground, set jump flag to false
                if ((idA.name == 'blobby-egg-left' || idA.name == 'blobby-egg-right') && idB.name == "G") {
                    b2world.elements[idA.uid - 1].jump = false
                }

                //players contact with beachvolleyball
                if ((idA.name == 'blobby-egg-left' || idA.name == 'blobby-egg-right') && idB.name == "beachvolleyball") {
                    //console.log(['PostSolve', idA, idB, impulse]);
                    b2world.elements[idA.uid - 1].points += 1
                    if (idA.name == 'blobby-egg-right') {
                        leftplayer.points = 0
                        if (rightplayer.points > 4) {
                            //alert('rightplayer lost to much contacts')
                        }
                    } else if (idA.name == 'blobby-egg-left') {
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

        v.Add(vel);

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
            this.body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
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
        this.fixDef.density = 2.5
        this.fixDef.friction = 0.2
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
    }
})


// the Game object
Game = (function () {
    var Game = {
        path: '../',
        fps: 60,
        width: gw,
        height: gh,
        width2: gw / 2,
        height2: gh / 2,
        bound: new CG.Bound(0, 0, gw, gh).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director: new CG.Director(),
        delta: new CG.Delta(60),
        preload: function () {

            //sfx
            sfxIntro = new buzz.sound(Game.path + "media/sfx/blobby-intro", {
                formats:[ "ogg", "mp3"/*, "aac", "wav"*/ ],
                preload:true,
                autoplay:true,
                loop:true
            });
            sfxCrowd = new buzz.sound(Game.path + "media/sfx/blobby-crowd", {
                formats:[ "ogg", "mp3"/*, "aac", "wav"*/ ],
                preload:true,
                autoplay:false,
                loop:false
            });
            sfxWhistle = new buzz.sound(Game.path + "media/sfx/blobby-whistle", {
                formats:[ "ogg", "mp3"/*, "aac", "wav"*/ ],
                preload:true,
                autoplay:false,
                loop:false
            });
            sfxNet = new buzz.sound(Game.path + "media/sfx/blobby-net", {
                formats:[ "ogg", "mp3"/*, "aac", "wav"*/ ],
                preload:true,
                autoplay:false,
                loop:false
            });

            //canvas for ouput
            Game.canvas = document.getElementById("canvas")
            Game.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset(Game.path + 'media/img/blobby-back.png', Game.ctx)

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont(Game.path + 'media/font/small.txt', 'small', 'small')

                //physics engine
                .addJson(Game.path + 'media/img/blobbies.json', 'blobbies')

                .addImage(Game.path + 'media/img/glowball-50.png', 'glowball')

                .addImage(Game.path + 'media/img/blobby-egg-left.png', 'blobby-egg-left')
                .addImage(Game.path + 'media/img/blobby-egg-right.png', 'blobby-egg-right')

                .addImage(Game.path + 'media/img/blobby-back.png', 'blobby-back')
                .addImage(Game.path + 'media/img/blobby-ctrl-right.png', 'ctrl-right')
                .addImage(Game.path + 'media/img/blobby-ctrl-left.png', 'ctrl-left')
                .addImage(Game.path + 'media/img/arrow-25.png', 'arrow')
                .addImage(Game.path + 'media/img/beachvolleyball.png', 'beachvolleyball')
                .addImage(Game.path + 'media/img/beachvolleyball-shadow.png', 'beachvolleyball-shadow')

                //font
                .addImage(Game.path + 'media/font/blobby-points.png', 'blobby-points')
                .addFont(Game.path + 'media/font/blobby-points.txt', 'blobby-points')

                //texturepacker
                .addImage(Game.path + 'media/img/texturepacker.png', 'texturepacker')
                .addJson(Game.path + 'media/img/texturepacker.json', 'texturepacker-json')

                .startPreLoad()
        },
        create: function () {

            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())

            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            back = new CG.Sprite(Game.asset.getImageByName('blobby-back'), new CG.Point(400, 240))
            back.name = 'back'
            mainlayer.addElement(back)


            ctrlleft = new CG.Sprite(Game.asset.getImageByName('ctrl-left'), new CG.Point(0 + 40, Game.height - 30))
            ctrlleft.name = 'ctrlleft'
            mainlayer.addElement(ctrlleft)
            ctrlright = new CG.Sprite(Game.asset.getImageByName('ctrl-right'), new CG.Point(Game.width - 40, Game.height - 30))
            ctrlright.name = 'ctrlright'
            mainlayer.addElement(ctrlright)


            var opt = {sleep: false}
            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world', opt)

            //add it to a CGLayer
            mainlayer.addElement(b2world)

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            document.onkeydown = function (evt) {
                var keyCode = evt.keyCode


                if (keyCode == 70) { //f
                    alert('FPS ?: ' + Game.delta.getFPS())
                }

                if (keyCode == 71) { //g
                    b = b2world.getBodyAt(mousex, mousey)
                    console.log([b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
                }
                if (keyCode == 73) { //i
                    body = b2world.getBodyAt(mousex, mousey)
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

            };


            Game.loop()
        },
        loop: function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.anim1();
            }
        },
        anim1: function () {
            Game.update()
            Game.draw()
            //Game.delta.update()
        },
        update: function () {
            //update here what ever you want
            Game.director.update()

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
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            //draw all elements that the director has
            Game.director.draw()

            //text stuff
            var dummytext = 'Tribute to blobby ;o)'
            small.drawText(dummytext, Game.width2 - (small.getTextWidth(dummytext) / 2), 10)

            // draw Game.b_canvas to the canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit: function () {
        },
        touchhandler: function () {
        }
    }

    return Game
}())