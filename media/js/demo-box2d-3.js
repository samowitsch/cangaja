var renderStats, updateStats

var mainscreen, mainlayer

var b2world

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
    init:function (name) {
        this._super(name)

        this.createLine('L', new CG.Point(0,-300), new CG.Point(0,Game.height))
        this.createLine('R', new CG.Point(Game.width,-300), new CG.Point(Game.width,Game.height))
        this.createLine('G', new CG.Point(0,Game.height), new CG.Point(Game.width,Game.height))


        this.createLine('N', new CG.Point(Game.width2-10,Game.height2), new CG.Point(Game.width2-10,Game.height))
        this.createLine('N', new CG.Point(Game.width2+10,Game.height2), new CG.Point(Game.width2+10,Game.height))

    }
})

CG.B2DPolygon.extend('B2DLeftPlayer', {
    init:function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {
        this._super(world, name, image, jsonpoly, x, y, scale, stat, bullet)

    },
    events:function(){
        document.addEventListener('keydown', function(evt){

            console.log(this, evt)


        })
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



            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world')
            b2world.debug = 1

            //create circle element with image
//            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 310, -200, false)
//            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 210, -100, false)
//            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 110, 0, false)

            //leftplayer = new CG.B2DLeftPlayer(b2world.world, 'ballon', Game.asset.getImageByName('ballon'), Game.asset.getJsonByName('ballon'), 350, -250, false, false)
            //b2world.addCustom(leftplayer)

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
                Game.anim1();
            }
        },
        anim1:function () {
            Game.update()
            Game.draw()
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
                    velo = b2world.elements[5].body.GetLinearVelocity()
                    velo.Add(new b2Vec2(-5,0))
                    b2world.elements[5].body.SetLinearVelocity(velo)
                    console.log(velo)
                }
                if(evt.keyCode == 38){ //cursor up
                    b2world.elements[5].body.ApplyForce(new b2Vec2(0, -500), b2world.elements[5].body.GetWorldCenter())
                }
                if(evt.keyCode == 39){ //cursor right
                    velo = b2world.elements[5].body.GetLinearVelocity()
                    velo.Add(new b2Vec2(5,0))
                    b2world.elements[5].body.SetLinearVelocity(velo)
                    console.log(velo)
                }

                console.log(evt.keyCode)
            };


            //  b2world.elements[0].body.ApplyForce(new b2Vec2(10, 0), b2world.elements[0].body.GetWorldCenter())
            //  demo = b2world.elements[0].body.GetLinearVelocity()
            //  demo.Add(velocity)
            //  b2world.elements[0].body.SetLinearVelocity()


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