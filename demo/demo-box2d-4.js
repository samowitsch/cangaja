var renderStats, mainscreen, mainlayer, canvas, Game, abadi, small, b2world,
    mousex = 0, mousey = 0, mousedown = false, xpos = 10, ypos = 10,
    tp = new CG.AtlasTexturePacker()

window.onload = function () {

    canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};

CG.B2DWorld.extend('B2DTestbed', {
    init: function (options) {
        this._super(options)

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

CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('mousedown', function (e) {
            CG.mousedown = this.mousedown = true
        }.bind(this), true);

        this.canvas.addEventListener('mouseup', function () {
            CG.mousedown = this.mousedown = false
        }.bind(this), true);

        this.canvas.addEventListener('mousemove', function (evt) {
            mousex = evt.clientX - this.canvas.offsetLeft
            mousey = evt.clientY - this.canvas.offsetTop
            CG.mouse = this.mouse = {
                x: evt.clientX - this.canvas.offsetLeft,
                y: evt.clientY - this.canvas.offsetTop
            }
        }.bind(this), false)
    },
    preload: function () {
        this.asset
            .addFont('media/font/small.txt', 'small', 'small')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/img/glowball-50.png', 'glowball')
            .startPreLoad()
    },
    create: function () {

        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})

        //create Box2D World
        b2world = new CG.B2DTestbed({name: 'box2d-world'})
        b2world.debug = 1

        //create circle element with image
        b2world.createCircle({name: 'glowball', image: this.asset.getImageByName('glowball'), radius: 23, x: 510, y: -200})
        b2world.createCircle({name: 'glowball', image: this.asset.getImageByName('glowball'), radius: 23, x: 410, y: -300})
        b2world.createCircle({name: 'glowball', image: this.asset.getImageByName('glowball'), radius: 23, x: 310, y: -100})
        b2world.createCircle({name: 'glowball', image: this.asset.getImageByName('glowball'), radius: 23, x: 210, y: -400})
        b2world.createCircle({name: 'glowball', image: this.asset.getImageByName('glowball'), radius: 23, x: 110, y: 0})

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

        b2world.createChainShape({
            name: 'chaneshape',
            points: chainArray,
            x: 0,
            y: 200
        })

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

        document.onkeydown = function (evt) {
            if (evt.keyCode == 71) { //g
                b = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                console.log([b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
            }
            if (evt.keyCode == 73) { //i
                body = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                b2world.applyImpulse(body, 270, 25)
            }
            if (evt.keyCode == 66) { //b
                b2world.createCircle({
                    name: 'glowball',
                    image: this.asset.getImageByName('glowball'),
                    radius: 23,
                    x: this.mouse.x,
                    y: this.mouse.y
                })
            }
            if (evt.keyCode == 68) { //d
                body = b2world.deleteBodyAt(this.mouse.x, this.mouse.y)
            }

            console.log(evt.keyCode)
        }.bind(this);

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        renderStats.update();
    },
    draw: function () {
        //text stuff
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Box2D example. b2ChainShape. Press B for new ball, D to delete balls.', xpos, ypos + 56)
    }
})