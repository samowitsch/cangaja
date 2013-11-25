var terrainBody, clipPoints = 12, clipRadius = 20

// the Game object
Game = (function () {
    var Game = {
        path: '',
        fps: 60,
        width: 512,
        height: 384,
        width2: 512 / 2,
        height2: 384 / 2,
        bound: new CG.Bound(0, 0, 512, 384).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {}, //new CG.MediaAsset('media/img/splash3.jpg'), //initialize media asset with background image
        director: new CG.Director(),
        renderer: new CG.CanvasRenderer(),
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.canvas = document.getElementById('canvas')
            Game.ctx = Game.canvas.getContext('2d')
            Game.asset = new CG.MediaAsset('media/img/splash3.jpg')

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset.addFont('media/font/small.txt', 'small', 'small')
                .addFont('media/font/abadi_ez.txt', 'abadi')
                .addImage('media/img/basketball-25.png', 'basketball-25')
                .addImage('media/img/TestTerrain.png', 'testTerrain')
                .addImage('media/img/TerrainBackground.png', 'back')
                .addImage('media/img/spritetestphysics.png', 'spritetestphysics')
                .addImage('media/img/rock.png', 'rock')


                //tiled map
                .addJson('media/map/map-advanced-inner-outer.json', 'map1')
                .addJson('media/img/spritetestphysics.json', 'spritetestphysics')

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

            for (var i = 0; i < 1; i++) {
                var x = Math.random() * Game.width
                var y = Math.random() * Game.height
                if (y < 90) y += 90;
                b2world.createCircle('rock', Game.asset.getImageByName('rock'), 16, x, y, box2d.b2BodyType.b2_staticBody)
            }


            //dynamic basketball-25s:
            b2world.createCircle('basketball-25', Game.asset.getImageByName('basketball-25'), 25, 340, -800, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('basketball-25', Game.asset.getImageByName('basketball-25'), 25, 310, -100, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('basketball-25', Game.asset.getImageByName('basketball-25'), 25, 320, -400, box2d.b2BodyType.b2_dynamicBody)
            b2world.createCircle('basketball-25', Game.asset.getImageByName('basketball-25'), 25, 330, -600, box2d.b2BodyType.b2_dynamicBody)


            //a bitmap that hides the background sprite
            bitmap = new CG.Bitmap(Game.width, Game.height)
            bitmap.loadImage(Game.asset.getImageByName('testTerrain'))
            mainlayer.addElement(bitmap)

            var terrainPolys =
                [
                    {
                        outer: [
                            {x: 0.1, y: 82.5},
                            {x: 512.5, y: 82.5},
                            {x: 512.5, y: 384.5},
                            {x: 0.1, y: 384.5}
                        ],

                        holes: [
                        ]
                    }
                ]

            terrainBody = b2world.createTerrain('terrain', false, terrainPolys, 0, 0, box2d.b2BodyType.b2_staticBody, false)

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
            Game.update()
            Game.draw()
        },
        update: function () {
            //update here what ever you want

            if (mousedown == true) {
                bitmap.clearCircle(mousex, mousey, clipRadius)
                terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: mousex, y: mousey})
                b2world.getStaticBodyListAt(mousex, mousey, 16, 0)
            }

            document.onkeydown = function (evt) {
                if (evt.keyCode == 71) { //g
                    b = b2world.getBodyAt(mousex, mousey)
                }
                if (evt.keyCode == 73) { //i
                    body = b2world.getBodyAt(mousex, mousey)
                    b2world.applyImpulse(body, 270, 10)
                }
                if (evt.keyCode == 66) { //b
                    b2world.createCircle('basketball-25', Game.asset.getImageByName('basketball-25'), 40, mousex, mousey, box2d.b2BodyType.b2_dynamicBody)
                }
                if (evt.keyCode == 67 || mousedown == true) { //c
                    bitmap.clearCircle(mousex, mousey, clipRadius)
                    terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: mousex, y: mousey})
                    b2world.getStaticBodyListAt(mousex, mousey, 16, 0)
                }


                if (evt.keyCode == 79) { //o
                    if (b2world.debug == 0) {
                        b2world.debug = 1
                    } else {
                        b2world.debug = 0
                    }
                }

                if (evt.keyCode == 65) { // a - left
                    clonk.addVelocity(new b2Vec2(-2, 0))
                }
                if (evt.keyCode == 87) { // w - up
                    clonk.addVelocity(new b2Vec2(0, -5))
                }
                if (evt.keyCode == 83) { // s - down
                    bitmap.clearCircle(clonk.body.GetPosition().x * 40 + 40, clonk.body.GetPosition().y * 40 + 40, clipRadius)
                    terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: clonk.body.GetPosition().x * 40 + 40, y: clonk.body.GetPosition().y * 40 + 40})
                    b2world.getStaticBodyListAt(clonk.body.GetPosition().x * 40, clonk.body.GetPosition().y * 40, 16, 0)
                }
                if (evt.keyCode == 83 && evt.keyCode == 65) { // s - down && a-left
                    bitmap.clearCircle(clonk.body.GetPosition().x * 40 - 10, clonk.body.GetPosition().y * 40 + 40, clipRadius)
                    terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: clonk.body.GetPosition().x * 40 - 10, y: clonk.body.GetPosition().y * 40 + 40})
                }
                if (evt.keyCode == 83 && evt.keyCode == 68) { // s - down && d-right
                    bitmap.clearCircle(clonk.body.GetPosition().x * 40 + 50, clonk.body.GetPosition().y * 40 + 40, clipRadius)
                    terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: clonk.body.GetPosition().x * 40 + 50, y: clonk.body.GetPosition().y * 40 + 40})
                }
                if (evt.keyCode == 68) { // d - right
                    clonk.addVelocity(new b2Vec2(2, 0))
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
            small.drawText('Destructible Terrain.', xpos, ypos + 45)
            small.drawText('C=clip hole, O=debugdraw on/off, B=new ball, I=impulse on body below mousepointer, WASD=Player', xpos, ypos + 65)
            small.drawText('Triangles: ' + terrainBody.terrainTriangles.length + ', box2d bodycount:' + b2world.world.GetBodyCount() + ', CG.B2World elements:' + b2world.elements.length, xpos, ypos + 85)

            // draw Game.b_canvas to the canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)

            // clear the Game.b_canvas
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        }
    }

    return Game
})()