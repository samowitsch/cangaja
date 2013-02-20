var renderStats, updateStats

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

// the Game object
Game = (function () {
    var Game = {
        fps:60,
        width:640,
        height:480,
        width2:640 / 2,
        height2:480 / 2,
        bound:new CG.Bound(0, 0, 640, 480).setName('game'),
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

            back3 = new CG.Sprite(Game.asset.getImageByName('back3'), new CG.Point(320, 240))
            back3.name = 'back3'
            mainlayer.addElement(back3)



            //create Box2D World
            b2world = new CG.B2DWorld('box2d-world')
            b2world.debug = 1

            //create circle element with image
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, 310, -200, false)

            //create box element with image
            b2world.createBox('btn-back', Game.asset.getImageByName('btn-back'), 420, -500, false)

            //create polybody with image
            b2world.createPolyBody('ballon', Game.asset.getImageByName('ballon'), Game.asset.getJsonByName('ballon'), 350, -250, false, false)
            b2world.createPolyBody('rainbow', Game.asset.getImageByName('rainbow_256'), Game.asset.getJsonByName('rainbow_256'), 250, -400, false, false)
            b2world.createPolyBody('powerstar', Game.asset.getImageByName('powerstar75'), Game.asset.getJsonByName('powerstar75'), 200, -150, false, false)

            // bridge test
            // name, image, x, y, length, segments, segmentHeight, scale
            b2world.createBridge('chain', Game.asset.getImageByName('chain'), 20, 280, 620, 27, 3)

            // rope test
            // name, image, x, y, length, segments, segmentHeight, scale
            b2world.createRope('chain-v', Game.asset.getImageByName('chain-v'), 580, 0, 200, 8, 3)

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
                    b = b2world.getBodyAt(mousex / 40, mousey / 40)
                    console.log([b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
                }
                if (evt.keyCode == 73) { //i
                    body = b2world.getBodyAt(mousex / 40, mousey / 40)
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
                    body = b2world.deleteBodyAt(mousex / 40, mousey / 40)
                }
            };


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
            small.draw('Box2D example. Press s for new star, b for new glowball, r for new rainbow.', xpos, ypos + 56)
            small.draw('Try moving the elements with the mouse;-)', xpos, ypos + 56 + small.getLineHeight())
            small.draw('Press d to delete an element, i for apply impulse to object below mouse pointer', xpos, ypos + 56 + (2 * small.getLineHeight()))

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