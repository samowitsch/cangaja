var renderStats, mainscreen, mainlayer, canvas, Game, small, abadi, mousex, mousey,
    tp = new CG.AtlasTexturePacker(), xpos = 10, ypos = 10

//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
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
        tp.loadJson(this.asset.getJsonByName('texturepacker-json'))

        //put the texturepacker TPImages to the asset
        this.asset.images.push.apply(this.asset.images, tp.getAtlasImages())

        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))
        small = new CG.Font().loadFont(this.asset.getFontByName('small'))

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
        b2world.createCircle('glowball', this.asset.getImageByName('glowball'), 40, 310, -200, box2d.b2BodyType.b2_dynamicBody)

        //create box element with image
        b2world.createBox('btn-back', this.asset.getImageByName('btn-back'), 420, -500, box2d.b2BodyType.b2_dynamicBody)

        //create polybody with image
        b2world.createPolyBody('ballon', this.asset.getImageByName('ballon'), this.asset.getJsonByName('ballon'), 350, -250, box2d.b2BodyType.b2_dynamicBody, false)
        b2world.createPolyBody('rainbow_256', this.asset.getImageByName('rainbow_256'), this.asset.getJsonByName('rainbow_256'), 250, -400, box2d.b2BodyType.b2_dynamicBody, false)
        b2world.createPolyBody('powerstar75', this.asset.getImageByName('powerstar75'), this.asset.getJsonByName('powerstar75'), 200, -150, box2d.b2BodyType.b2_dynamicBody, false)

        // bridge test
        // name, image, x, y, length, segments, segmentHeight, scale
        b2world.createBridge('chain', this.asset.getImageByName('chain'), 20, 280, 620, 27, 3)

        // rope test
        // name, image, x, y, length, segments, segmentHeight, scale
        b2world.createRope('chain-v', this.asset.getImageByName('chain-v'), 580, 0, 200, 8, 3)

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
        this.director.addScreen(mainscreen.addLayer(mainlayer))


        document.onkeydown = function (evt) {
            if (evt.keyCode == 71) { //g get info show and in console
                b = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                console.log([b.m_userData.name, b.m_userData.uid, b.m_islandIndex])
            }
            if (evt.keyCode == 73) { //i impulse
                body = b2world.getBodyAt(this.mouse.x, this.mouse.y)
                b2world.applyImpulse(body, 270, 25)
            }
            if (evt.keyCode == 82) { //r new rainbow
                b2world.createPolyBody('rainbow_256', this.asset.getImageByName('rainbow_256'), this.asset.getJsonByName('rainbow_256'), this.mouse.x, this.mouse.y, box2d.b2BodyType.b2_dynamicBody, false)
            }
            if (evt.keyCode == 83) { //s new star
                b2world.createPolyBody('powerstar75', this.asset.getImageByName('powerstar75'), this.asset.getJsonByName('powerstar75'), this.mouse.x, this.mouse.y, box2d.b2BodyType.b2_dynamicBody, false)
            }
            if (evt.keyCode == 66) { //b new ball
                b2world.createCircle('glowball', this.asset.getImageByName('glowball'), 40, this.mouse.x, this.mouse.y, box2d.b2BodyType.b2_dynamicBody)
            }
            if (evt.keyCode == 68) { //d
                body = b2world.deleteBodyAt(this.mouse.x, this.mouse.y)
            }
        }.bind(this);

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)
        //after creation start game loop
        this.loop()
    },
    update: function () {
        //update here what ever you want
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Box2D example. Press s for new star, b for new glowball, r for new rainbow.', xpos, ypos + 56)
        small.drawText('Try moving the elements with the mouse;-)', xpos, ypos + 56 + small.getLineHeight())
        small.drawText('Press d to delete an element, i for apply impulse to object below mouse pointer', xpos, ypos + 56 + (2 * small.getLineHeight()))
    }
})