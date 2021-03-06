var renderStats, mainscreen, mainlayer, abadi, small, mousex = 0, mousey = 0, currentx = 0, currenty = 0, mousedown = false, leftplayer, xpos = 10, ypos = 0,
    tp = new CG.AtlasTexturePacker(),
    terrainBody, clipPoints = 12, clipRadius = 20, b2world, terrainBody, myTerrain

CG.B2DTerrain.extend('MyTerrain', {
    init: function (options) {
        this._super(options)
    }
})

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

        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})

        //sprite for the background
        var back = new CG.Sprite({
            image: this.asset.getImageByName('back'),
            position: new CG.Point(this.width2, this.height2)
        })
        back.name = 'back'
        mainlayer.addElement(back)

        //create Box2D World
        b2world = new CG.B2DTestbed({name: 'box2d-world'})
        b2world.debug = 0

        //dynamic basketball-25s:
        b2world.createCircle({name: 'basketball-25', image: this.asset.getImageByName('basketball-25'), radius: 12, x: 50, y: -100, restitution: 0.9})
        b2world.createCircle({name: 'basketball-25', image: this.asset.getImageByName('basketball-25'), radius: 12, x: 150, y: -100, restitution: 0.6})
        b2world.createCircle({name: 'basketball-25', image: this.asset.getImageByName('basketball-25'), radius: 12, x: 250, y: -100, restitution: 0.3})
        b2world.createCircle({name: 'basketball-25', image: this.asset.getImageByName('basketball-25'), radius: 12, x: 330, y: -100, restitution: 0.15})

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

        myTerrain = new CG.MyTerrain({
            world: b2world.world,
            name: 'terrain',
            image: this.asset.getImageByName('testTerrain'),
            terrainShape: terrainPolys,
            x: 0,
            y: 0,
            scale: 40,
            density: 100,
            friction: 1
        })
        terrainBody = b2world.addCustom(myTerrain)

        b2world.addContactListener({
            BeginContact: function (idA, idB) {
            },

            PostSolve: function (idA, idB, impulse) {
            }
        });

        //add it to a CGLayer
        mainlayer.addElement(b2world)

        //create circle element with image
        //static rocks

        for (var i = 0; i < 50; i++) {
            var x = Math.random() * this.width
            var y = Math.random() * this.height
            if (y < 90) y += 90;
            b2world.createCircle({
                name: 'rock',
                image: this.asset.getImageByName('colorwheel'),
                radius: 8,
                restitution: 0.001,
                density: 1000,
                bullet: true,
                x: x,
                y: y,
                bodyType: box2d.b2BodyType.b2_staticBody
            })
        }


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
                b2world.createCircle({
                    name: 'basketball-25',
                    image: this.asset.getImageByName('basketball-25'),
                    radius: 12,
                    x: this.mouse.x,
                    y: this.mouse.y
                })
            }
            if (evt.keyCode == 67 || this.mousedown == true) { //c
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
                terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: clonk.body.GetPosition().x * 40 + 40, y: clonk.body.GetPosition().y * 40 + 40})
                b2world.getStaticBodyListAt(clonk.body.GetPosition().x * 40, clonk.body.GetPosition().y * 40, 16, 0)
            }
            if (evt.keyCode == 83 && evt.keyCode == 65) { // s - down && a-left
                terrainBody.clipTerrain({points: clipPoints, radius: clipRadius, x: clonk.body.GetPosition().x * 40 - 10, y: clonk.body.GetPosition().y * 40 + 40})
            }
            if (evt.keyCode == 83 && evt.keyCode == 68) { // s - down && d-right
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
