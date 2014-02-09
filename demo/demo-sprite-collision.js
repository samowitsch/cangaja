var renderStats, mainscreen, mainlayer, collisionlayer, collision, canvas,
    tp = new CG.AtlasTexturePacker(), ri = 0, spritecollisiontext, rocket, abadi, small, Game, xpos = 10, ypos = 10;

window.onload = function () {
    canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};

CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method
    },
    preload: function () {
        this.asset.addFont('media/font/small.txt', 'small', 'small')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/img/hunter.png', 'hunter')
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

        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})
        collisionlayer = new CG.Layer({name: 'collisionlayer'})

        //add screen to Director
        this.director
            .addScreen(mainscreen.addLayer(collisionlayer))
            .addScreen(mainscreen.addLayer(mainlayer))

        rocket = new CG.Sprite({
            image: this.asset.getImageByName('rocket'),
            position: new CG.Point(this.width2, this.height2)
        })
        rocket.name = 'rocket'
        rocket.boundingradius = 80
        rocket.xscale = 0.5
        rocket.yscale = 0.5
        mainlayer.addElement(rocket)

        //this sprite follows the rocket with a fixed speed
        collision = new CG.Sprite({
            image: this.asset.getImageByName('gem'),
            position: new CG.Point(250, 200)
        })
        collision.name = 'rockethunter-1'
        collision.boundingradius = 120
        collision.xscale = 1
        collision.yscale = 1
        collisionlayer.addElement(collision)

        //this sprite follows the rocket with a fixed step rate
        collision = new CG.Sprite({
            image:this.asset.getImageByName('gem'),
            position:new CG.Point(500, 400)
        })
        collision.name = 'rockethunter-2'
        collision.boundingradius = 80
        collision.xscale = 0.5
        collision.yscale = 0.5
        collisionlayer.addElement(collision)

        //this sprite follows the rocket with a fixed speed
        collision = new CG.Sprite({
            image: this.asset.getImageByName('gem'),
            position: new CG.Point(500, 200)
        })
        collision.name = 'rockethunter-1'
        collision.boundingradius = 80
        collision.xscale = 0.5
        collision.yscale = 0.5
        collisionlayer.addElement(collision)

        //this sprite follows the rocket with a fixed step rate
        collision = new CG.Sprite({
            image:this.asset.getImageByName('gem'),
            position:new CG.Point(250, 400)
        })
        collision.name = 'rockethunter-2'
        collision.boundingradius = 80
        collision.xscale = 0.5
        collision.yscale = 0.5
        collisionlayer.addElement(collision)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        //clear collisiontext
        spritecollisiontext = ''
        mainlayer.getElementByName('rocket').alpha = 1
        mainlayer.getElementByName('rocket').checkCollision(collisionlayer.elements, this.callbacks.collision)

        var rocky = mainlayer.getElementByName('rocket')
        ri += 0.007
        rocky.position.x = this.bound.width / 2 + (this.bound.width / 3 * Math.cos(ri * 3 - Math.cos(ri))) >> 0
        rocky.position.y = this.bound.height / 2 + (this.bound.height / 2 * -Math.sin(ri * 2.3 - Math.cos(ri))) >> 0

        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Sprite class example.', xpos, ypos + 56)
        small.drawText('This sprite example shows the collision function.', xpos, ypos + 56 + small.getLineHeight())
        small.drawText(spritecollisiontext, xpos, ypos + 56 + (small.getLineHeight() * 2))
    },
    callbacks: {
        collision: function (obj1, obj2) {
            mainlayer.getElementByName('rocket').alpha = 0.3
            spritecollisiontext = 'Rocket collision!'
        }
    }
})