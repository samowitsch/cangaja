var renderStats
var can

var mainscreen, mainlayer

var spineboy, goblins, dragon

var mousex = 0
var mousey = 0
var mousedown = false
var mouseup


//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
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
        width: 640,
        height: 480,
        width2: 640 / 2,
        height2: 480 / 2,
        bound: new CG.Bound(0, 0, 640, 480).setName('game'),
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
            Game.asset = new CG.MediaAsset('media/img/splash3.jpg')

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

                //preloading goblins
                .addJson('media/spine/dragon_atlas.json', 'dragon-atlas')
                .addJson('media/spine/dragon.json', 'dragon-json')
                .addImage('media/spine/dragon_atlas_0.png', 'dragon_0')           //image preloading not nessecary SpineAnimation class has also a preloader
                .addImage('media/spine/dragon_atlas_1.png', 'dragon_1')           //image preloading not nessecary SpineAnimation class has also a preloader

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
            spineboy = new CG.SpineAnimation(
                Game.asset.getJsonByName('spineboy-json').data,
                Game.asset.getTextByName('spineboy-atlas').data,
                new CG.Point(160, 400),
                function (spineObject) {
                    spineObject.stateData.setMixByName("walk", "jump", 0.2);
                    spineObject.stateData.setMixByName("jump", "walk", 0.4);
                    spineObject.state.setAnimationByName(0, "walk", true, 0);
                }
            )
            mainlayer.addElement(spineboy)


            goblins = new CG.SpineAnimation(
                Game.asset.getJsonByName('goblins-json').data,
                Game.asset.getTextByName('goblins-atlas').data,
                new CG.Point(Game.width - 160, 400),
                function (spineObject) {
                    spineObject.skeleton.setSkinByName("goblingirl");
                    spineObject.skeleton.setSlotsToSetupPose();
                    spineObject.state.setAnimationByName(0, "walk", true);
                }
            )
            mainlayer.addElement(goblins)


//            dragon = new CG.SpineAnimation(
//                Game.asset.getJsonByName('dragon-json').data,
//                Game.asset.getJsonByName('dragon-atlas').data,
//                new CG.Point(Game.width2, 400),
//                function (spineObject) {
//                    spineObject.skeleton.setSkinByName("goblingirl");
//                    spineObject.skeleton.setSlotsToSetupPose();
//                    spineObject.state.setAnimationByName(0, "flying", true);
//                }
//            )
//            mainlayer.addElement(dragon)








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
            if (spineboy.skeleton.getRootBone().x > 700) {
                spineboy.skeleton.getRootBone().x = -100
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