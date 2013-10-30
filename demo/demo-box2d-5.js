var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var tp = new CG.AtlasTexturePacker()
var collision = {direction: '', overlap: 0}


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 1024
    can.height = 768
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
    init: function (name) {
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
        fps: 60,
        width: 1024,
        height: 768,
        width2: 1024 / 2,
        height2: 768 / 2,
        bound: new CG.Bound(0, 0, 1024, 768).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director: new CG.Director(),
        delta: new CG.Delta(60),
        preload: function () {
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
        create: function () {

            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

            //put the texturepacker TPImages to the asset
            Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world')
            b2world.debug = 1

            //create circle element with image
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 510, -200, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 410, -300, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 310, -100, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 210, -400, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 110, 0, box2d.b2BodyType.b2_dynamicBody)

            var terrainPolys =
                [

                    {
                        outer: [
                            {x: 0, y: 100},
                            {x: 1024, y: 100},
                            {x: 1024, y: 768},
                            {x: 0, y: 768}
                        ],

                        holes: [

                        ]
                    }


//                    {
//                        outer: [
//                            {x: 0, y: 200},
//                            {x: 150, y: 280},
//                            {x: 200, y: 300},
//                            {x: 300, y: 290},
//                            {x: 320, y: 270},
//                            {x: 340, y: 290},
//                            {x: 440, y: 300},
//                            {x: 490, y: 280},
//                            {x: 640, y: 200},
//                            {x: 640, y: 480},
//                            {x: 0, y: 480}
//                        ],
//
//                        holes: [
//                            [
//                                {x: 150, y: 400},
//                                {x: 50, y: 375},
//                                {x: 100, y: 350}
//                            ],
//                            [
//                                {x: 450, y: 400},
//                                {x: 350, y: 375},
//                                {x: 400, y: 350}
//                            ],
//                            [
//                                {x: 550, y: 350},
//                                {x: 524, y: 370},
//                                {x: 500, y: 350}
//                            ]
//                        ]
//                    },
//                    {
//                        outer: [
//                            {x: 250, y: 130},
//                            {x: 275, y: 150},
//                            {x: 200, y: 180},
//                            {x: 190, y: 150}
//                        ],
//
//                        holes: [
//                            [
//                                {x: 210, y: 160},
//                                {x: 220, y: 150},
//                                {x: 200, y: 150}
//                            ]
//                        ]
//                    },
//                    {
//                        outer: [
//                            {x: 450, y: 80},
//                            {x: 475, y: 100},
//                            {x: 400, y: 130},
//                            {x: 390, y: 100}
//                        ],
//
//                        holes: [
//                            [
//                                {x: 410, y: 110},
//                                {x: 420, y: 100},
//                                {x: 400, y: 100}
//                            ]
//                        ]
//                    },
//                    {outer: [
//                        {"x": 350, "y": 100},
//                        {"x": 348.5316954888546, "y": 109.27050983124842},
//                        {"x": 344.27050983124843, "y": 117.6335575687742},
//                        {"x": 337.6335575687742, "y": 124.27050983124842},
//                        {"x": 329.27050983124843, "y": 128.5316954888546},
//                        {"x": 320, "y": 130},
//                        {"x": 310.72949016875157, "y": 128.5316954888546},
//                        {"x": 302.36644243122583, "y": 124.27050983124843},
//                        {"x": 295.72949016875157, "y": 117.6335575687742},
//                        {"x": 291.4683045111454, "y": 109.27050983124843},
//                        {"x": 290, "y": 100},
//                        {"x": 291.4683045111454, "y": 90.72949016875158},
//                        {"x": 295.72949016875157, "y": 82.3664424312258},
//                        {"x": 302.3664424312258, "y": 75.72949016875158},
//                        {"x": 310.72949016875157, "y": 71.46830451114539},
//                        {"x": 320, "y": 70},
//                        {"x": 329.27050983124843, "y": 71.46830451114539},
//                        {"x": 337.63355756877417, "y": 75.72949016875157},
//                        {"x": 344.27050983124843, "y": 82.3664424312258},
//                        {"x": 348.5316954888546, "y": 90.72949016875157}
//                    ],
//                        holes: []
//                    }

            ]

            b2world.createTerrain('terrain', false, terrainPolys, 0, 0, box2d.b2BodyType.b2_staticBody, false)

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
                Game.update()
                Game.draw()
            }
        },
        update: function () {
            //update here what ever you want


            if (key.isPressed("g")) {
                b = b2world.getBodyAt(mousex, mousey)
                console.log([b, b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
            }
            if (key.isPressed("i")) {
                body = b2world.getBodyAt(mousex, mousey)
                b2world.applyImpulse(body, 270, 25)
            }
            if (key.isPressed("b")) {
                b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, mousex, mousey, false)
            }
            if (key.isPressed("c")) {
                b2world.elements[5].clippTerrain({points: 16, radius: 40, x: mousex, y: mousey})
            }
            if (key.isPressed("d")) {
                if (b2world.debug == 0) {
                    b2world.debug = 1
                } else {
                    b2world.debug = 0
                }
            }
            if (key.isPressed("left")) {
                velo = b2world.elements[0].body.GetLinearVelocity()
                velo.SelfAdd(new b2Vec2(-5, 0))
                b2world.elements[0].body.SetLinearVelocity(velo)
            }
            if (key.isPressed("up")) {
                b2world.elements[0].body.ApplyForce(new b2Vec2(0, -500), b2world.elements[0].body.GetWorldCenter())
            }
            if (key.isPressed("right")) {
                velo = b2world.elements[0].body.GetLinearVelocity()
                velo.SelfAdd(new b2Vec2(5, 0))
                b2world.elements[0].body.SetLinearVelocity(velo)
            }

//                document.onkeydown = function (evt) {
//                if (evt.keyCode == 71) { //g
//                    b = b2world.getBodyAt(mousex, mousey)
//                    console.log([b, b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
//                }
//                if (evt.keyCode == 73) { //i
//                    body = b2world.getBodyAt(mousex, mousey)
//                    b2world.applyImpulse(body, 270, 25)
//                }
//                if (evt.keyCode == 66) { //b
//                    b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, mousex, mousey, false)
//                }
//                if (evt.keyCode == 67) { //c
//                    b2world.elements[5].clippTerrain({points: 16, radius: 40, x: mousex, y: mousey})
//                }
//                if (evt.keyCode == 68) { //d
////                    console.log('RESULT stringified')
////                    console.log(JSON.stringify(b2world.elements[5].terrainPoly))
////                    console.log('RESULT as object')
////                    console.log(b2world.elements[5].terrainPoly)
//                    if (b2world.debug == 0 ) {
//                        b2world.debug = 1
//                    } else {
//                        b2world.debug = 0
//                    }
//
//
////                    body = b2world.deleteBodyAt(mousex, mousey)
//                }
//                if (evt.keyCode == 37) { //cursor left
//                    velo = b2world.elements[0].body.GetLinearVelocity()
//                    velo.SelfAdd(new b2Vec2(-5, 0))
//                    b2world.elements[0].body.SetLinearVelocity(velo)
//                }
//                if (evt.keyCode == 38) { //cursor up
//                    b2world.elements[0].body.ApplyForce(new b2Vec2(0, -500), b2world.elements[0].body.GetWorldCenter())
//                }
//                if (evt.keyCode == 39) { //cursor right
//                    velo = b2world.elements[0].body.GetLinearVelocity()
//                    velo.SelfAdd(new b2Vec2(5, 0))
//                    b2world.elements[0].body.SetLinearVelocity(velo)
//                }
//
////                console.log(evt.keyCode)
//            };

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
            small.drawText('Destructible Terrain.', xpos, ypos + 56)
            small.drawText('C=clip hole, D=debugdraw on/off, B=new ball, I=impulse on body below mousepointer', xpos, ypos + 76)
            small.drawText('Triangles: ' + b2world.elements[5].terrainTriangles.length, xpos, ypos + 96)

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
})()