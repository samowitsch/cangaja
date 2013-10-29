var terrainBody

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
                .addImage('media/img/TestTerrain.png', 'testTerrain')
                .addImage('media/img/hunter.png', 'hunter')
                .addImage('media/img/back3.jpg', 'back3')
                .addImage('media/img/TerrainBackground.png', 'back')
                .addImage('media/img/spritetestphysics.png', 'spritetestphysics')
                .addImage('media/img/sun.png', 'sun')
                .addImage('media/img/rock.png', 'rock')


                //tiled map
                .addJson('media/map/map-advanced-inner-outer.json', 'map1')
                .addJson('media/img/spritetestphysics.json', 'spritetestphysics')

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
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')

            //sprite for the background
            back = new CG.Sprite(Game.asset.getImageByName('back'), new CG.Point(Game.width2, Game.height2))
            back.name = 'back'
            mainlayer.addElement(back)

            //create Box2D World
            b2world = new CG.B2DTestbed('box2d-world')
            b2world.debug = 0

            //create circle element with image
            //static rocks

            for ( var i = 0; i < 100; i++) {
                var x = Math.random() * 1024
                var y = Math.random() * 768
                if (y < 200) y+=200;
                b2world.createCircle('rock', Game.asset.getImageByName('rock'), 16, x, y, true)

            }


            //dynamic glowballs:
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 340, -800, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 310, -100, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 320, -400, false)
            b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 36, 330, -600, false)


            //a bitmap that hides the background sprite
            bitmap = new CG.Bitmap(Game.width, Game.height)
            bitmap.loadImage(Game.asset.getImageByName('testTerrain'))
            mainlayer.addElement(bitmap)

            var terrainPolys =
                [

                    {
                        outer: [
                            {x: 0, y: 165},
                            {x: 1024, y: 165},
                            {x: 1024, y: 768},
                            {x: 0, y: 768}
                        ],

                        holes: [
                        ]
                    }
                ]

            terrainBody = b2world.createTerrain('terrain', false, terrainPolys, 0, 0, true, false)

            b2world.addContactListener({
                BeginContact: function (idA, idB) {
                },

                PostSolve: function (idA, idB, impulse) {
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


            document.onkeydown = function (evt) {
                if (evt.keyCode == 71) { //g
                    b = b2world.getBodyAt(mousex, mousey)
                    console.log([b, b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
                }
                if (evt.keyCode == 73) { //i
                    body = b2world.getBodyAt(mousex, mousey)
                    b2world.applyImpulse(body, 270, 10)
                }
                if (evt.keyCode == 66) { //b
                    b2world.createCircle('glowball', Game.asset.getImageByName('glowball'), 40, mousex, mousey, false)
                }
                if (evt.keyCode == 67) { //c
                    bitmap.clearCircle(mousex, mousey, 40)
                    terrainBody.clippTerrain({points: 16, radius: 40, x: mousex, y: mousey})

                    b2world.getStaticBodyListAt(mousex,mousey,34,0)

                }
                if (evt.keyCode == 	79) { //o
                    if (b2world.debug == 0 ) {
                        b2world.debug = 1
                    } else {
                        b2world.debug = 0
                    }
                }

                if (evt.keyCode == 65) { // a - left
                    leftplayer.addVelocity(new b2Vec2(-2, 0))
                }
                if (evt.keyCode == 87) { // w - up
                    leftplayer.addVelocity(new b2Vec2(0, -5))
                }
                if (evt.keyCode == 83) { // s - down
                    bitmap.clearCircle(leftplayer.body.GetPosition().x * 40 +40,leftplayer.body.GetPosition().y * 40+40, 40)
                    terrainBody.clippTerrain({points: 16, radius: 40, x: leftplayer.body.GetPosition().x * 40+40, y: leftplayer.body.GetPosition().y * 40+40})
                    b2world.getStaticBodyListAt(leftplayer.body.GetPosition().x *40, leftplayer.body.GetPosition().y * 40, 34, 0)
                }
                if (evt.keyCode == 83 && evt.keyCode == 65) { // s - down && a-left
                    bitmap.clearCircle(leftplayer.body.GetPosition().x * 40 -10,leftplayer.body.GetPosition().y * 40+40, 40)
                    terrainBody.clippTerrain({points: 16, radius: 40, x: leftplayer.body.GetPosition().x * 40-10, y: leftplayer.body.GetPosition().y * 40+40})
                }
                if (evt.keyCode == 83 && evt.keyCode == 68) { // s - down && d-right
                    bitmap.clearCircle(leftplayer.body.GetPosition().x * 40 +50,leftplayer.body.GetPosition().y * 40+40, 40)
                    terrainBody.clippTerrain({points: 16, radius: 40, x: leftplayer.body.GetPosition().x * 40+50, y: leftplayer.body.GetPosition().y * 40+40})
                }
                if (evt.keyCode == 68) { // d - right
                    leftplayer.addVelocity(new b2Vec2(2, 0))
                }

                if (evt.keyCode == 37) { //cursor left
                    velo = b2world.elements[1].body.GetLinearVelocity()
                    velo.SelfAdd(new b2Vec2(-5, 0))
                    b2world.elements[1].body.SetLinearVelocity(velo)
                }
                if (evt.keyCode == 38) { //cursor up
                    b2world.elements[1].body.ApplyForce(new b2Vec2(0, -500), b2world.elements[1].body.GetWorldCenter())
                }
                if (evt.keyCode == 39) { //cursor right
                    velo = b2world.elements[1].body.GetLinearVelocity()
                    velo.SelfAdd(new b2Vec2(5, 0))
                    b2world.elements[1].body.SetLinearVelocity(velo)
                }

//                console.log(evt.keyCode)
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
            small.drawText('Destructible Terrain.', xpos, ypos + 50)
            small.drawText('C=clip hole, O=debugdraw on/off, B=new ball, I=impulse on body below mousepointer, WASD=Player', xpos, ypos + 70)
            small.drawText('Triangles: ' + terrainBody.terrainTriangles.length , xpos, ypos + 90)

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