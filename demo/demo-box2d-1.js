var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()
var collision = {direction: '', overlap: 0}


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
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
    init: function (name) {
        this._super(name)

        var fixDef = new b2FixtureDef
        fixDef.density = 1.0
        fixDef.friction = 0.5
        fixDef.restitution = 0.5

        var bodyDef = new b2BodyDef

        //create ground
        bodyDef.type = b2Body.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = Game.width2 / this.scale
        bodyDef.position.y = (Game.height / this.scale) - 1
        bodyDef.userData = 'ground'
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox((Game.width / this.scale) / 2, 0.5 / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall1
        bodyDef.type = b2Body.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = 10 / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        bodyDef.userData = 'wall left'
        fixDef.shape = new b2PolygonShape;
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall2
        bodyDef.type = b2Body.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = (Game.width - 10) / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        bodyDef.userData = 'wall right'
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)

    }
})


// the Game object
Game = (function () {
    var Game = {
        path: '../',
        fps: 60,
        width: 640,
        height: 480,
        width2: 640 / 2,
        height2: 480 / 2,
        bound: new CG.Bound(0, 0, 640, 480).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director: new CG.Director(),
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.canvas = document.getElementById("canvas")
            Game.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset('media/img/splash3.jpg', Game.ctx)

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont(Game.path + 'media/font/small.txt', 'small', 'small')
                .addFont(Game.path + 'media/font/abadi_ez.txt', 'abadi')
                .addImage(Game.path + 'media/img/glowball-50.png', 'glowball')
                .addImage(Game.path + 'media/img/hunter.png', 'hunter')
                .addImage(Game.path + 'media/img/back3.jpg', 'back3')


                //tiled map
                .addJson(Game.path + 'media/map/map-advanced-inner-outer.json', 'map1')

                //physics engine
                .addJson(Game.path + 'media/img/ballon.json', 'ballon')
                .addJson(Game.path + 'media/img/rainbow_256.json', 'rainbow_256')
                .addJson(Game.path + 'media/img/powerstar75.json', 'powerstar75')

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

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            back3 = new CG.Sprite(Game.asset.getImageByName('back3'), new CG.Point(320, 240))
            back3.name = 'back3'
            mainlayer.addElement(back3)


            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world')
            b2world.debug = 0

            //create circle element with image
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 310, -200, false)

            //create box element with image
            b2world.createBox('btn-back', Game.asset.getImageByName('btn-back'), 420, -500, false)

            //create polybody with image
            b2world.createPolyBody('ballon', Game.asset.getImageByName('ballon'), Game.asset.getJsonByName('ballon'), 350, -250, false, false)
            b2world.createPolyBody('rainbow_256', Game.asset.getImageByName('rainbow_256'), Game.asset.getJsonByName('rainbow_256'), 250, -400, false, false)
            b2world.createPolyBody('powerstar75', Game.asset.getImageByName('powerstar75'), Game.asset.getJsonByName('powerstar75'), 200, -150, false, false)

            // bridge test
            // name, image, x, y, length, segments, segmentHeight, scale
            b2world.createBridge('chain', Game.asset.getImageByName('chain'), 20, 280, 620, 27, 3)

            // rope test
            // name, image, x, y, length, segments, segmentHeight, scale
            b2world.createRope('chain-v', Game.asset.getImageByName('chain-v'), 580, 0, 200, 8, 3)

            b2world.addContactListener({
                BeginContact: function (idA, idB) {
                    //console.log('BeginContact');
                },

                PostSolve: function (idA, idB, impulse) {
                    //console.log(['PostSolve', idA, idB, impulse]);
//                    if (impulse < 0.1) return;
//                    var entityA = world[idA];
//                    var entityB = world[idB];
//                    entityA.hit(impulse, entityB);
//                    entityB.hit(impulse, entityA);
                }
            });

            //add it to a CGLayer
            mainlayer.addElement(b2world)

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))

            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)

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
        },
        update: function () {
            //update here what ever you want


            document.onkeydown = function (evt) {
                if (evt.keyCode == 71) { //g
                    b = b2world.getBodyAt(mousex, mousey)
                    console.log([b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
                }
                if (evt.keyCode == 73) { //i
                    body = b2world.getBodyAt(mousex, mousey)
                    b2world.applyImpulse(body, 270, 25)
                }
                if (evt.keyCode == 82) { //r
                    b2world.createPolyBody('rainbow_256', Game.asset.getImageByName('rainbow_256'), Game.asset.getJsonByName('rainbow_256'), mousex, mousey, false, false)
                }
                if (evt.keyCode == 83) { //s
                    b2world.createPolyBody('powerstar75', Game.asset.getImageByName('powerstar75'), Game.asset.getJsonByName('powerstar75'), mousex, mousey, false, false)
                }
                if (evt.keyCode == 66) { //b
                    b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, mousex, mousey, false)
                }
                if (evt.keyCode == 68) { //d
                    body = b2world.deleteBodyAt(mousex, mousey)
                }
            };


            Game.director.update()
        },
        draw: function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            //draw all elements that the director has
            Game.director.draw()


            //text stuff
            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.drawText('Box2D example. Press s for new star, b for new glowball, r for new rainbow.', xpos, ypos + 56)
            small.drawText('Try moving the elements with the mouse;-)', xpos, ypos + 56 + small.getLineHeight())
            small.drawText('Press d to delete an element, i for apply impulse to object below mouse pointer', xpos, ypos + 56 + (2 * small.getLineHeight()))

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