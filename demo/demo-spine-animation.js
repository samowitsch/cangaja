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
            .addText('media/spine/spineboy.atlas', 'spineboy-atlas')
            .addJson('media/spine/spineboy.json', 'spineboy-json')
            .addImage('media/spine/spineboy.png', 'spineboy')           //image preloading not nessecary SpineAnimation class has also a preloader

            //preloading goblins
            .addText('media/spine/goblins.atlas', 'goblins-atlas')
            .addJson('media/spine/goblins.json', 'goblins-json')
            .addImage('media/spine/goblins.png', 'goblins')           //image preloading not nessecary SpineAnimation class has also a preloader

            //preloading powerup
            .addText('media/spine/powerup.atlas', 'powerup-atlas')
            .addJson('media/spine/powerup.json', 'powerup-json')
            .addImage('media/spine/powerup.png', 'powerup')           //image preloading not nessecary SpineAnimation class has also a preloader

            //preloading spinoraurus
            .addText('media/spine/spinosaurus.atlas', 'spinosaurus-atlas')
            .addJson('media/spine/spinosaurus.json', 'spinosaurus-json')
            .addImage('media/spine/spinosaurus.png', 'spinosaurus')           //image preloading not nessecary SpineAnimation class has also a preloader

            //preloading spinoraurus
            .addText('media/spine/dragon.atlas', 'dragon-atlas')
            .addJson('media/spine/dragon.json', 'dragon-json')
            .addImage('media/spine/dragon.png', 'dragon')           //image preloading not nessecary SpineAnimation class has also a preloader

            .startPreLoad()
    },
    create: function () {

        abadi = new CG.Font().loadFont(this.asset.getFontByName('abadi'))
        small = new CG.Font().loadFont(this.asset.getFontByName('small'))

        //screen and layer
        mainscreen = new CG.Screen('mainscreen')
//            mainscreen.xscale = 0.5
//            mainscreen.yscale = 0.5
        mainlayer = new CG.Layer('mainlayer')

        //add screen to Director
        this.director.addScreen(mainscreen.addLayer(mainlayer))

        //spine animation
        spinosaurus = new CG.SpineAnimation(
            this.asset.getJsonByName('spinosaurus-json'),
            this.asset.getTextByName('spinosaurus-atlas'),
            new CG.Point(this.width2, 600),
            1,  //experimental scale
            function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
                spineObject.skeleton.setSlotsToSetupPose();
                spineObject.state.setAnimationByName(0, "animation", true);
            }
        )
        mainlayer.addElement(spinosaurus)

        dragon = new CG.SpineAnimation(
            this.asset.getJsonByName('dragon-json'),
            this.asset.getTextByName('dragon-atlas'),
            new CG.Point(this.width2, 600),
            1,  //experimental scale
            function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
                spineObject.skeleton.setSlotsToSetupPose();
                spineObject.state.setAnimationByName(0, "flying", true);
            }
        )
        mainlayer.addElement(dragon)

        powerup = new CG.SpineAnimation(
            this.asset.getJsonByName('powerup-json'),
            this.asset.getTextByName('powerup-atlas'),
            new CG.Point(200, 300),
            1,  //experimental scale
            function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
                spineObject.skeleton.setSlotsToSetupPose();
                spineObject.state.setAnimationByName(0, "animation", true);
            }
        )
        mainlayer.addElement(powerup)

        spineboy = new CG.SpineAnimation(
            this.asset.getJsonByName('spineboy-json'),
            this.asset.getTextByName('spineboy-atlas'),
            new CG.Point(160, 550),
            1,  //experimental scale
            function (spineObject) {
                spineObject.stateData.setMixByName("walk", "jump", 0.2);
                spineObject.stateData.setMixByName("jump", "walk", 0.4);
                spineObject.state.setAnimationByName(0, "walk", true, 0);
            }
        )
        mainlayer.addElement(spineboy)

        goblins = new CG.SpineAnimation(
            this.asset.getJsonByName('goblins-json'),
            this.asset.getTextByName('goblins-atlas'),
            new CG.Point(this.width - 160, 550),
            1,  //experimental scale
            function (spineObject) {
                spineObject.skeleton.setSkinByName("goblingirl");
                spineObject.skeleton.setSlotsToSetupPose();
                spineObject.state.setAnimationByName(0, "walk", true);
            }
        )
        mainlayer.addElement(goblins)

        renderStats = new Stats()
        document.body.appendChild(renderStats.domElement)

        //after creation start game loop
        this.loop()
    },
    update: function () {
        spineboy.skeleton.getRootBone().x += 3
        if (spineboy.skeleton.getRootBone().x > 850) {
            spineboy.skeleton.getRootBone().x = -100
        }

        dragon.skeleton.getRootBone().x += 2
        if (dragon.skeleton.getRootBone().x > 1100) {
            dragon.skeleton.getRootBone().x = -350
        }
        renderStats.update();
    },
    draw: function () {
        abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)
        small.drawText('Spine Animation class example. Click with mouse in canvas.', xpos, ypos + 50)
    }
})