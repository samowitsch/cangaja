var renderStats
var can

var mainscreen, mainlayer

var spineboy, goblins, dragon, powerup, spinosaurus

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 800
    can.height = 600
    can.id = 'canvas'
    document.body.appendChild(can)

    can.addEventListener('mousedown', function (evt) {

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
    }, false)

    Game.preload()
};

// the Game object
Game = (function () {
    var Game = {
        path: '',
        fps: 60,
        width: 800,
        height: 600,
        width2: 800 / 2,
        height2: 600 / 2,
        bound: new CG.Bound(0, 0, 800, 600).setName('game'),
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
            Game.canvas = document.getElementById("canvas")
            Game.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset()

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //Asset preloading font files
            Game.asset
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

            abadi = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
//            mainscreen.xscale = 0.5
//            mainscreen.yscale = 0.5
            mainlayer = new CG.Layer('mainlayer')

            //add screen to Director
            Game.director.addScreen(mainscreen.addLayer(mainlayer))


            //spine animation
            spinosaurus = new CG.SpineAnimation(
                Game.asset.getJsonByName('spinosaurus-json'),
                Game.asset.getTextByName('spinosaurus-atlas'),
                new CG.Point(Game.width2, 600),
                1,  //experimental scale
                function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
                    spineObject.skeleton.setSlotsToSetupPose();
                    spineObject.state.setAnimationByName(0, "animation", true);
                }
            )
            mainlayer.addElement(spinosaurus)

            dragon = new CG.SpineAnimation(
                Game.asset.getJsonByName('dragon-json'),
                Game.asset.getTextByName('dragon-atlas'),
                new CG.Point(Game.width2, 600),
                1,  //experimental scale
                function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
                    spineObject.skeleton.setSlotsToSetupPose();
                    spineObject.state.setAnimationByName(0, "flying", true);
                }
            )
            mainlayer.addElement(dragon)

            powerup = new CG.SpineAnimation(
                Game.asset.getJsonByName('powerup-json'),
                Game.asset.getTextByName('powerup-atlas'),
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
                Game.asset.getJsonByName('spineboy-json'),
                Game.asset.getTextByName('spineboy-atlas'),
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
                Game.asset.getJsonByName('goblins-json'),
                Game.asset.getTextByName('goblins-atlas'),
                new CG.Point(Game.width - 160, 550),
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

            Game.loop()
        },
        loop: function () {
            requestAnimationFrame(Game.loop);
            Game.update()
            Game.draw()
        },
        update: function () {
            //update here what ever you want
            Game.director.update()

            spineboy.skeleton.getRootBone().x += 3
            if (spineboy.skeleton.getRootBone().x > 850) {
                spineboy.skeleton.getRootBone().x = -100
            }

            dragon.skeleton.getRootBone().x += 2
            if (dragon.skeleton.getRootBone().x > 1100) {
                dragon.skeleton.getRootBone().x = -350
            }


        },
        draw: function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            var xpos = 10
            var ypos = 10

            Game.director.draw()

            abadi.drawText('cangaja - Canvas Game JavaScript FW', xpos, ypos)

            small.drawText('Spine Animation class example. Click with mouse in canvas.', xpos, ypos + 50)


            Game.ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            renderStats.update();
        }
    }

    return Game
}())