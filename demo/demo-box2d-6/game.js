var renderStats, mainscreen, mainlayer, abadi, small, mousex = 0, mousey = 0, currentx = 0, currenty = 0, mousedown = false, leftplayer, xpos = 10, ypos = 0,
    tp = new CG.AtlasTexturePacker(),
    terrainBody, clipPoints = 12, clipRadius = 20, b2world

CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('mousedown', function (evt) {
            CG.mousedown = this.mousedown = true
            mousex = (evt.clientX - this.canvas.offsetLeft) / 2 >> 0
            mousey = (evt.clientY - this.canvas.offsetTop) / 2 >> 0
            CG.mouse = this.mouse = {
                x: (evt.clientX - this.canvas.offsetLeft) / 2 >> 0,
                y: (evt.clientY - this.canvas.offsetTop) / 2 >> 0
            }
        }.bind(this), true);

        this.canvas.addEventListener('mouseup', function () {
            CG.mousedown = this.mousedown = false
        }.bind(this), true);

        this.canvas.addEventListener('mousemove', function (evt) {
            mousex = (evt.clientX - this.canvas.offsetLeft) / 2 >> 0
            mousey = (evt.clientY - this.canvas.offsetTop) / 2 >> 0
            CG.mouse = this.mouse = {
                x: (evt.clientX - this.canvas.offsetLeft) / 2 >> 0,
                y: (evt.clientY - this.canvas.offsetTop) / 2 >> 0
            }
        }.bind(this), false)
    },
    preload: function () {
        this.asset
            .addFont('media/font/small.txt', 'small', 'small')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/img/basketball-25.png', 'basketball-25')
            .addImage('media/img/TestTerrain.png', 'testTerrain')
            .addImage('media/img/TerrainBackground.png', 'back')
            .addImage('media/img/spritetestphysics.png', 'spritetestphysics')
            .addImage('media/img/colorwheel.png', 'colorwheel')
            .addJson('media/img/spritetestphysics.json', 'spritetestphysics')
            .startPreLoad()
    },
    create: function () {

        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))
        small = new CG.Font().loadFont(this.asset.getFontByName('small'))

        //screen and layer
        mainscreen = new CG.Screen('mainscreen')
        mainlayer = new CG.Layer('mainlayer')

        //sprite for the background
        back = new CG.Sprite(this.asset.getImageByName('back'), new CG.Point(this.width2, this.height2))
        back.name = 'back'
        mainlayer.addElement(back)

        //create Box2D World
        b2world = new CG.B2DTestbed('box2d-world')
        b2world.debug = 0

        //create circle element with image
        //static rocks

        for (var i = 0; i < 50; i++) {
            var x = Math.random() * this.width
            var y = Math.random() * this.height
            if (y < 90) y += 90;
            b2world.createCircle('rock', this.asset.getImageByName('colorwheel'), 8, x, y, box2d.b2BodyType.b2_staticBody)
        }

        //dynamic basketball-25s:
        b2world.createCircle('basketball-25', this.asset.getImageByName('basketball-25'), 12, 340, -800, box2d.b2BodyType.b2_dynamicBody)
        b2world.createCircle('basketball-25', this.asset.getImageByName('basketball-25'), 12, 310, -100, box2d.b2BodyType.b2_dynamicBody)
        b2world.createCircle('basketball-25', this.asset.getImageByName('basketball-25'), 12, 320, -400, box2d.b2BodyType.b2_dynamicBody)
        b2world.createCircle('basketball-25', this.asset.getImageByName('basketball-25'), 12, 330, -600, box2d.b2BodyType.b2_dynamicBody)

        //a bitmap that hides the background sprite
        bitmap = new CG.Bitmap(this.width, this.height)
        bitmap.loadImage(this.asset.getImageByName('testTerrain'))
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
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        document.onkeydown = function (evt) {
            if (evt.keyCode == 71) { //g
                b = b2world.getBodyAt(this.mouse.x, this.mouse.y)
            }
            if (evt.keyCode == 73) { //i
                body = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                b2world.applyImpulse(body, 270, 10)
            }
            if (evt.keyCode == 66) { //b
                b2world.createCircle('basketball-25', this.asset.getImageByName('basketball-25'), 12, this.mouse.x, this.mouse.y, box2d.b2BodyType.b2_dynamicBody)
            }
            if (evt.keyCode == 67 || this.mousedown == true) { //c
                bitmap.clearCircle(this.mouse.x, this.mouse.y, clipRadius)
                terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: this.mouse.x, y: this.mouse.y})
                b2world.getStaticBodyListAt(this.mouse.x, this.mouse.y, 16, 0)
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

        }.bind(this);

        //after creation start game loop
        this.loop()
    },
    update: function () {
        if (this.mousedown == true && (currentx !== this.mouse.x || currenty !== this.mouse.y)) {

            //speed up some thing with no pixelperfect clipping
            var offset = 10
            if ((((currentx - this.mouse.x) <= -offset) || ((currentx - this.mouse.x) >= offset)) ||
                (((currenty - this.mouse.y) <= -offset) || ((currenty - this.mouse.y) >= offset))) {
                bitmap.clearCircle(this.mouse.x, this.mouse.y, clipRadius)
                terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: this.mouse.x, y: this.mouse.y})
                b2world.getStaticBodyListAt(this.mouse.x, this.mouse.y, 16, 0)
                currentx = this.mouse.x
                currenty = this.mouse.y
            }
        }
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('C=clip hole, O=debugdraw on/off, B=new ball, I=impulse on body below mousepointer, WASD=Player', xpos, ypos + 45)
        small.drawText('Triangles: ' + terrainBody.terrainTriangles.length + ', box2d bodycount:' + b2world.world.GetBodyCount() + ', CG.B2World elements:' + b2world.elements.length, xpos, ypos + 65)

    }
})
