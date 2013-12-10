var renderStats, mainscreen, mainlayer, followerlayer, canvas, Game,
    abadi, small, rocket,
    tp = new CG.AtlasTexturePacker(),
    ri = 0
var xpos = 10,
    ypos = 10

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

        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))
        small = new CG.Font().loadFont(this.asset.getFontByName('small'))

        //screen and layer
        mainscreen = new CG.Screen('mainscreen')
        mainlayer = new CG.Layer('mainlayer')
        followerlayer = new CG.Layer('followerlayer')

        //add screen to Director
        this.director
            .addScreen(mainscreen.addLayer(mainlayer))
            .addScreen(mainscreen.addLayer(followerlayer))

        rocket = new CG.Sprite(this.asset.getImageByName('rocket'), new CG.Point(this.width2, this.height2))
        rocket.name = 'rocket'
        rocket.boundingradius = 80
        rocket.xscale = 0.5
        rocket.yscale = 0.5
        mainlayer.addElement(rocket)

        //this sprite follows the rocket with a fixed speed
        hunter1 = new CG.Sprite(this.asset.getImageByName('rocket2'), new CG.Point(this.width2, this.height2))
        hunter1.name = 'rockethunter-1'
        hunter1.boundingradius = 80
        hunter1.xscale = 0.25
        hunter1.yscale = 0.25
        hunter1.followspeed = 2
        hunter1.followobject = rocket
        followerlayer.addElement(hunter1)

        //this sprite follows the rocket with a fixed step rate
        hunter2 = new CG.Sprite(this.asset.getImageByName('rocket2'), new CG.Point(this.width2, this.height2))
        hunter2.name = 'rockethunter-2'
        hunter2.boundingradius = 80
        hunter2.xscale = 0.25
        hunter2.yscale = 0.25
        hunter2.followsteps = 40
        hunter2.followobject = rocket
        followerlayer.addElement(hunter2)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this._super()
    },
    update: function () {
        ri += 0.007
        rocket.position.x = this.bound.width / 2 + (this.bound.width / 3 * Math.cos(ri * 3 - Math.cos(ri))) >> 0
        rocket.position.y = this.bound.height / 2 + (this.bound.height / 2 * -Math.sin(ri * 2.3 - Math.cos(ri))) >> 0
        renderStats.update();
    },
    draw: function () {
        //text stuff
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Sprite class example.', xpos, ypos + 56)
        small.drawText('This sprite example shows the follower function.', xpos, ypos + 56 + small.getLineHeight())
    }
})