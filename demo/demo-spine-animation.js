var renderStats, canvas, mainscreen, mainlayer, spineboy, goblins, dragon, powerup, spinosaurus, Game, abadi, small;
var xpos = 10, ypos = 10

//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 600
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};

CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('mousedown', function (e) {
            CG.mousedown = this.mousedown = true

            //spineboy stuff
            spineboy.state.setAnimationByName(0, "jump", false);
            spineboy.state.addAnimationByName(0, "walk", true, 0);

            //goblin stuff
            if (goblins.skeleton.skin.name == 'goblin') {
                goblins.skeleton.setSkinByName('goblingirl')
            } else {
                goblins.skeleton.setSkinByName('goblin')
            }
            goblins.skeleton.setSlotsToSetupPose()

        }.bind(this), true);

        this.canvas.addEventListener('mouseup', function () {
            CG.mousedown = this.mousedown = false
        }.bind(this), true);

        this.canvas.addEventListener('mousemove', function (evt) {
            CG.mouse = this.mouse = {
                x: evt.clientX - this.canvas.offsetLeft,
                y: evt.clientY - this.canvas.offsetTop
            }
        }.bind(this), false)
    },
    preload: function () {
        this.asset
            .addFont('media/font/small.txt', 'small', 'small')
            .addImage('media/font/small.png', 'small')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/font/abadi_ez.png', 'abadi_ez')

            //preloading spineboy
            .addText('media/spine/alien.atlas', 'alien-atlas')
            .addJson('media/spine/alien.json', 'alien-json')
            .addImage('media/spine/alien.png', 'alien')

            .startPreLoad()
    },
    create: function () {

        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
//            mainscreen.xscale = 0.5
//            mainscreen.yscale = 0.5
        mainlayer = new CG.Layer({name: 'mainlayer'})

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        //spine animation
        alien = new CG.SpineAnimation({
                spinejson: this.asset.getJsonByName('alien-json'),
                spineatlas: this.asset.getTextByName('alien-atlas'),
                position: new CG.Point(300, 400),
                scale: 1,  //experimental scale
                callback: function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
                    spineObject.skeleton.setSlotsToSetupPose();
                    spineObject.state.setAnimationByName(0, "run", true);
                }
            }
        )
        mainlayer.addElement(alien)


        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Spine Animation class example. Click with mouse in canvas.', xpos, ypos + 50)
    }
})