var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.TexturePacker()
var collision = {direction:'', overlap:0}


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    //mouse move


    can.addEventListener('mousedown', function (e) {
        mousedown = true;
    }, true);

    can.addEventListener('mouseup', function () {
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
    init:function (name) {
        this._super(name)

        var fixDef = new b2FixtureDef
        fixDef.density = 1.0
        fixDef.friction = 0.5
        fixDef.restitution = 0.5

        var bodyDef = new b2BodyDef

        //create ground
        bodyDef.type = box2d.b2BodyType.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = Game.width2 / this.scale
        bodyDef.position.y = (Game.height / this.scale) - 1
        bodyDef.userData = 'ground'
        fixDef.shape = new b2PolygonShape
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox((Game.width / this.scale) / 2, 0.5 / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall1
        bodyDef.type = box2d.b2BodyType.b2_staticBody
        // positions the center of the object (not upper left!)
        bodyDef.position.x = 10 / this.scale
        bodyDef.position.y = (Game.height2 / this.scale) - 1
        bodyDef.userData = 'wall left'
        fixDef.shape = new b2PolygonShape;
        // half width, half height. eg actual height here is 1 unit
        fixDef.shape.SetAsBox(0.5 / 2, (Game.width / this.scale) / 2)
        this.world.CreateBody(bodyDef).CreateFixture(fixDef)


        //create wall2
        bodyDef.type = box2d.b2BodyType.b2_staticBody
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
        path: '',
        fps:60,
        width:640,
        height:480,
        width2:640 / 2,
        height2:480 / 2,
        bound:new CG.Bound(0, 0, 640, 480).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas:{},
        b_ctx:{},
        asset:{}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director:new CG.Director(),
        delta:new CG.Delta(60),
        preload:function () {
            //canvas for ouput
            Game.canvas = document.getElementById('canvas')
            Game.ctx = Game.canvas.getContext('2d')
            Game.asset = new CG.MediaAsset('media/img/splash3.jpg', Game.ctx)

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
                .addImage('media/img/hunter.png', 'hunter')
                .addImage('media/img/back3.jpg', 'back3')


                //tiled map
                .addJson('media/map/map-advanced-inner-outer.json', 'map1')

                //physics engine
                .addJson('media/img/ballon.json', 'ballon')
                .addJson('media/img/rainbow_256.json', 'rainbow_256')
                .addJson('media/img/powerstar75.json', 'powerstar75')

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

//            back3 = new CG.Sprite(Game.asset.getImageByName('back3'), new CG.Point(320, 240))
//            back3.name = 'back3'
//            mainlayer.addElement(back3)

            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world')
            b2world.debug = 1

            //create circle element with image
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 510, -200, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 410, -300, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 310, -100, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 210, -400, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 110, 0, false)

            chainArray = [
                new CG.Point(0, 0),
                new CG.Point(50, 10),
                new CG.Point(100, 100),
                new CG.Point(200, 100),
                new CG.Point(250, 50),
                new CG.Point(300, 70),
                new CG.Point(350, 100),
                new CG.Point(400, 200),
                new CG.Point(500, 150),
                new CG.Point(640, -100)
            ]

            b2world.createChainShape('chaneshape', chainArray, 0, 200, true)


            b2world.addContactListener({
                BeginContact:function (idA, idB) {
                    //console.log('BeginContact');
                },

                PostSolve:function (idA, idB, impulse) {
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
        loop:function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.update()
                Game.draw()
            }
        },
        update:function () {
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
                    b2world.createPolyBody('rainbow', Game.asset.getImageByName('rainbow_256'), Game.asset.getJsonByName('rainbow_256'), mousex, mousey, false, false)
                }
                if (evt.keyCode == 83) { //s
                    b2world.createPolyBody('powerstar', Game.asset.getImageByName('powerstar75'), Game.asset.getJsonByName('powerstar75'), mousex, mousey, false, false)
                }
                if (evt.keyCode == 66) { //b
                    b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, mousex, mousey, false)
                }
                if (evt.keyCode == 68) { //d
                    body = b2world.deleteBodyAt(mousex, mousey)
                }
                if(evt.keyCode == 37){ //cursor left
                    velo = b2world.elements[0].body.GetLinearVelocity()
                    velo.SelfAdd(new b2Vec2(-5,0))
                    b2world.elements[0].body.SetLinearVelocity(velo)
                }
                if(evt.keyCode == 38){ //cursor up
                    b2world.elements[0].body.ApplyForce(new b2Vec2(0, -500), b2world.elements[0].body.GetWorldCenter())
                }
                if(evt.keyCode == 39){ //cursor right
                    velo = b2world.elements[0].body.GetLinearVelocity()
                    velo.SelfAdd(new b2Vec2(5,0))
                    b2world.elements[0].body.SetLinearVelocity(velo)
                }

                console.log(evt.keyCode)
            };

            Game.director.update()
        },
        draw:function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            //draw all elements that the director has
            Game.director.draw()


            //text stuff
            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
            small.drawText('Box2D example. b2ChainShape. Press B for new ball, D to delete balls.', xpos, ypos + 56)

            // draw Game.b_canvas to the canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)

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