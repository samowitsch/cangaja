var renderStats, updateStats

var mainscreen, mainlayer

var rightplayer, leftplayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()
var collision = {direction:'', overlap:0}

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


CG.B2DWorld.extend('B2DTestbed', {
    init:function (name, opt) {
        this._super(name, opt)

        this.createLine('L', new CG.Point(0, -300), new CG.Point(0, Game.height))
        this.createLine('R', new CG.Point(Game.width, -300), new CG.Point(Game.width, Game.height))
        this.createLine('G', new CG.Point(0, Game.height - 50), new CG.Point(Game.width, Game.height - 50))


        this.createLine('N', new CG.Point(Game.width2 - 10, Game.height2 - 50), new CG.Point(Game.width2 - 10, Game.height))
        this.createLine('N', new CG.Point(Game.width2 + 10, Game.height2 - 50), new CG.Point(Game.width2 + 10, Game.height))

    }
})

CG.B2DPolygon.extend('B2DPlayer', {
    init:function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {

        this.bodyDef = new b2BodyDef
        this.bodyDef.fixedRotation = true
        this.bodyDef.allowSleep = false

        this.fixDef = new b2FixtureDef
        this.fixDef.restitution = 0
        this.linearDamping = 0
        this.angularDamping = 0

        this.jump = false
        this.max_hor_vel = 4
        this.max_ver_vel = 7


        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)
    },
    addVelocity:function (vel) {
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

        if (vel.y < 0) {
            this.jump = true
        }
    },
    applyImpulse:function (degrees, power) {
        if (this.body) {
            this.body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
                Math.sin(degrees * (Math.PI / 180)) * power),
                this.body.GetWorldCenter());
        }
    }
})


CG.B2DPlayer.extend('B2DRightPlayer', {
    init:function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {
        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)
        self = this
        //document.addEventListener('keydown', self.rightControl, false)
    },
    rightControl:function (e) {
        var keyCode = e.keyCode
        if (keyCode == 37) { //left
            self.addVelocity(new b2Vec2(-3, 0))

        }
        if (keyCode == 38) { //up
            if (self.jump == false) {
                //self.applyImpulse(270, self.hor_impulse)
                self.addVelocity(new b2Vec2(0, -6))
            }
            self.jump = true
        }
        if (keyCode == 39) { //right
            self.addVelocity(new b2Vec2(3, 0))
        }
    }
})


CG.B2DPlayer.extend('B2DLeftPlayer', {
    init:function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {
        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)
        self = this
        //document.addEventListener('keydown', self.leftControl, false)
    },
    leftControl:function (e) {
        var keyCode = e.keyCode
        if (keyCode == 65) { // a - left
            self.addVelocity(new b2Vec2(-3, 0))
        }
        if (keyCode == 87) { // w - up
            if (self.jump == false) {
                //self.applyImpulse(270, self.hor_impulse)
                self.addVelocity(new b2Vec2(0, -6))
            }
            self.jump = true
        }
        if (keyCode == 68) { // d - right
            self.addVelocity(new b2Vec2(3, 0))
        }
    }
})


// the Game object
Game = (function () {
    var Game = {
        fps:60,
        width:gw,
        height:gh,
        width2:gw / 2,
        height2:gh / 2,
        bound:new CG.Bound(0, 0, gw, gh).setName('game'),
        b_canvas:false,
        b_ctx:false,
        asset:new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director:new CG.Director(),
        delta:new CG.Delta(60),
        preload:function () {
            //canvas for ouput
            canvas = document.getElementById("canvas")
            ctx = canvas.getContext("2d")

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont('media/font/small.txt', 'small', 'small')
                .addFont('media/font/abadi_ez.txt', 'abadi')
                .addImage('media/img/glowball-50.png', 'glowball')
                .addImage('media/img/ballon.png', 'ballon')
                .addImage('media/img/back3.jpg', 'back3')

                //physics engine
                .addJson('media/img/ballon.json', 'ballon')

                //texturepacker
                .addImage('media/img/texturepacker.png', 'texturepacker')
                .addJson('media/img/texturepacker.json', 'texturepacker-json')

                .startPreLoad()
        },
        create:function () {

            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            back3 = new CG.Sprite(Game.asset.getImageByName('back3'), new CG.Point(320, 240))
            back3.name = 'back3'
            mainlayer.addElement(back3)


            var opt = {sleep:false}
            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world', opt)
            b2world.debug = 1


            rightplayer = new CG.B2DRightPlayer(b2world.world, 'right', Game.asset.getImageByName('ballon'), Game.asset.getJsonByName('ballon'), 425, 200, b2world.scale, false, false)
            b2world.addCustom(rightplayer)
            leftplayer = new CG.B2DLeftPlayer(b2world.world, 'left', Game.asset.getImageByName('ballon'), Game.asset.getJsonByName('ballon'), 150, 200, b2world.scale, false, false)
            b2world.addCustom(leftplayer)

            b2world.addContactListener({
                BeginContact:function (idA, idB) {
                    //console.log('BeginContact');
                },

                PostSolve:function (idA, idB, impulse) {
                    //console.log(['PostSolve', idA, idB, impulse]);
                    if ((idA.name == 'left' || idA.name == 'right') && idB.name == "G") {
                        b2world.elements[idA.uid - 1].jump = false
                    }
//                    var entityA = world[idA];
//                    var entityB = world[idB];
                }
            });

            //add it to a CGLayer
            mainlayer.addElement(b2world)

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

            document.onkeydown = function (evt) {
                var keyCode = evt.keyCode

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
                        leftplayer.addVelocity(new b2Vec2(0, -6))
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
                        rightplayer.addVelocity(new b2Vec2(0, -6))
                    }
                }
                if (keyCode == 39) { //right
                    rightplayer.addVelocity(new b2Vec2(3, 0))
                }

            };


            Game.loop()
        },
        loop:function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.anim1();
            }
        },
        anim1:function () {
            Game.update()
            Game.draw()
        },
        update:function () {
            //update here what ever you want

            Game.director.update()
        },
        draw:function () {
            ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            //draw all elements that the director has
            Game.director.draw()


            //text stuff
            abadi.draw('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.draw('Box2D example. Experimental', xpos, ypos + 56)
            small.draw('Use cursor keys to controll one ball ;-)', xpos, ypos + 56 + small.getLineHeight())
            //small.draw('Press d to delete an element, i for apply impulse to object below mouse pointer', xpos, ypos + 56 + (2 * small.getLineHeight()))

            // draw Game.b_canvas to the canvas
            ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        },
        touchinit:function () {
        },
        touchhandler:function () {
        }
    }

    return Game
}())