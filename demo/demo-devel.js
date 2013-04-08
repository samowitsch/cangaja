var loadjson = true  //test json map loader

var delta
var then = Date.now();
var mousePos
var mousedown = false
var mouseup
var bm
var renderStats
var hammer
var mySound
var myShoot
var angl, xs = 0, ys = 0
var ri = 0

var sliderx = 0
var slidery = 0

//screen 1 menu
var screen = new CG.Screen('menuscreen')
var layerfront = new CG.Layer('layerfront')
var layermiddle = new CG.Layer('layermiddle')

//screen2 emitter demo
var screen2 = new CG.Screen('emitter')
var layeremitter = new CG.Layer('layeremitter')

//screen3 sprites demo
var screen3 = new CG.Screen('sprites')
var layersprites = new CG.Layer('layersprites')

//screen4 follower/collission/attach demo
var screen4 = new CG.Screen('follower')
var layerrunner = new CG.Layer('layerrunner')
var layerfollower = new CG.Layer('layerfollower')
var layerfollowersmoke = new CG.Layer('layerfollowersmoke')

//screen5 animation/attach demo
var screen5 = new CG.Screen('animation')
var layeranimation = new CG.Layer('animation')
var layeranimationsmoke = new CG.Layer('layeranimationsmoke')

//screen6 tilemap demo
var screen6 = new CG.Screen('map')
var layermap = new CG.Layer('map')

//screen7 menu & callback demo
var screen7 = new CG.Screen('menu')
var layermenu = new CG.Layer('menu')

//screen8 bitmap demo
var screen8 = new CG.Screen('bitmap')
var layerbitmap = new CG.Layer('bitmap')


var colmsg = ''

var asset, circle, circlesmoke, tween, squence, button, font, font2, menu, mapcol = 0, mapcollisiontext = ''
var morph = new CG.Morph('sinus', 0.25, 1, 1)
var map = new CG.Map(640, 480)
var tp = new CG.TexturePacker()


window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 640
    can.height = 480
    can.id = 'canvas'
    document.body.appendChild(can)

    //mouse move
    can.addEventListener('mousemove', function (evt) {
        var rect = can.getBoundingClientRect(), root = document.documentElement;
        CG.mouse.x = evt.clientX - canvas.offsetLeft;
        CG.mouse.y = evt.clientY - canvas.offsetTop;
    }, false);

    Game.preload()
};


var Game = (function () {
    var Game = {
        path: '../',
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
        delta: new CG.Delta(60),
        preload: function () {
            //canvas for ouput
            Game.canvas = document.getElementById("canvas")
            Game.ctx = Game.canvas.getContext("2d")
            Game.asset = new CG.MediaAsset(Game.path + 'media/img/splash3.jpg', Game.ctx)

            //frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height

            //preload images
            Game.asset.addImage(Game.path + 'media/img/rocket.png', 'rocket')
                .addImage(Game.path + 'media/img/rocket2.png', 'rocket2')
                .addImage(Game.path + 'media/img/btn-back.png', 'button')
                .addImage(Game.path + 'media/img/exp1.png', 'exp1')
                .addImage(Game.path + 'media/img/exp2.png', 'exp2')
                .addImage(Game.path + 'media/img/exp3.png', 'exp3')
                .addImage(Game.path + 'media/img/exp4.png', 'exp4')
                .addImage(Game.path + 'media/img/exp5.png', 'exp5')
                .addImage(Game.path + 'media/img/expbig1.png', 'bigexplosion')
                .addImage(Game.path + 'media/img/burst.png', 'burst')
                .addImage(Game.path + 'media/img/ballon.png', 'ballon')
                .addImage(Game.path + 'media/img/sonne.png', 'sun')
                .addImage(Game.path + 'media/img/sonne-50.png', 'sun50')
                .addImage(Game.path + 'media/img/powerstar75.png', 'powerstar75')
                .addImage(Game.path + 'media/img/smoke50.png', 'smoke')
                .addImage(Game.path + 'media/img/cloud.png', 'cloud')
                .addImage(Game.path + 'media/img/raindrop.png', 'raindrop-old')
                .addImage(Game.path + 'media/img/rainbow_256.png', 'rainbow')
                .addImage(Game.path + 'media/img/glowball.png', 'glowball')
                .addImage(Game.path + 'media/img/glowball-50.png', 'glowball50')
                .addImage(Game.path + 'media/img/basketball.png', 'basketball')
                .addImage(Game.path + 'media/img/basketball-25.png', 'basketball25')
                .addImage(Game.path + 'media/img/hunter.png', 'hunter')
                .addImage(Game.path + 'media/img/crosshair.png', 'crosshair')
                //font
                .addFont(Game.path + 'media/font/small.txt', 'small', 'small')
                .addFont(Game.path + 'media/font/heiti.txt', 'heiti')
                .addFont(Game.path + 'media/font/gill.txt', 'gill')
                .addFont(Game.path + 'media/font/abadi_ez.txt', 'abadi')
                //tilemaps
                .addXml(Game.path + 'media/map/map-diddy-csv.tmx', 'map-diddy-csv')
                .addXml(Game.path + 'media/map/map.tmx', 'map1')
                .addXml(Game.path + 'media/map/map2.tmx', 'map2')
                .addXml(Game.path + 'media/map/othermap.tmx', 'othermap')
                .addXml(Game.path + 'media/map/isometric_grass_and_water.tmx', 'iso')
                .addXml(Game.path + 'media/map/sewers.tmx', 'sewers')
                //texturepacker
                .addImage(Game.path + 'media/img/texturepacker.png', 'texturepacker')
                .addXml(Game.path + 'media/img/texturepacker.xml', 'texturepacker-xml')
                //jsons
                .addJson(Game.path + 'media/img/texturepacker.json', 'texturepacker-json')
                .addJson(Game.path + 'media/map/map.json', 'map-json')

                .startPreLoad()
        },
        create: function () {
            //create texturepacker image in asset
            tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))
            //tp.loadXml(Game.asset.getXmlByName('texturepacker-xml'))
            Game.asset.images.push.apply(Game.asset.images, tp.getTPImages())


            //sfx
            mySound = new buzz.sound(Game.path + "media/sfx/serious", {
                formats: [ "ogg", "mp3"/*, "aac", "wav"*/ ],
                preload: true,
                autoplay: false,
                loop: true
            });
            myShoot = new buzz.sound(Game.path + "media/sfx/laser", {
                formats: [ "ogg", "mp3"/*, "aac", "wav"*/ ],
                preload: true,
                loop: false
            });

            mySound.play()

            console.log('create: sound')

            //            font = new CG.Font().loadFont(Game.asset.getFontByName('small'))
            font = new CG.Font().loadFont(Game.asset.getFontByName('heiti'))
            font2 = new CG.Font().loadFont(Game.asset.getFontByName('abadi'))
            //font.loadFont(Game.asset.getFontByName('small'))
            //font.loadFont('media/font/small.txt')
            console.log('create: font')

            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
            console.log('create: stats')

            createElements()
            console.log('create: elements')

            //experimental key handler
            document.onkeydown = function (evt) {
                console.log(evt)
            };
            console.log('create: experimental key handler')


            Game.director
                .addScreen(screen.addLayer(layermiddle).addLayer(layerfront))
                .addScreen(screen2.addLayer(layeremitter))
                .addScreen(screen3.addLayer(layersprites))
                .addScreen(screen4.addLayer(layerfollowersmoke).addLayer(layerfollower).addLayer(layerrunner))
                .addScreen(screen5.addLayer(layeranimationsmoke).addLayer(layeranimation))
                .addScreen(screen6.addLayer(layermap))
                .addScreen(screen7.addLayer(layermenu))
                .addScreen(screen8.addLayer(layerbitmap))
            console.log('create: director')


            if (loadjson) {
                map.loadMapJson(Game.asset.getJsonByName('map-json'))
                    .addElement(screen4.getLayerByName('layerrunner').getElementByName('rocket'))
                console.log('create: map => json source')
            } else {
                map.loadMapXml(Game.asset.getXmlByName('map1'))
                    .addElement(screen4.getLayerByName('layerrunner').getElementByName('rocket'))
                console.log('create: map => xml source')
            }
            map.visible = false
            //map.xspeed = 1
            //map.yspeed = 1
            map.layertocheck = 1    //set layer 1 to check for collision


            createMapElements()


            circle = new CG.Translate().initOval(layersprites.elements[layersprites.elements.length - 1], new CG.Point(320, 30), 15, 15, 0, 5)
            circlesmoke = new CG.Translate().initOval(layeremitter.getElementByName('smokey'), new CG.Point(320, 240), 250, 0, 1, 1.5)
            console.log('create: circle translate')


            sequence = new CG.Sequence()
            sequence.loop = true
            sequence.addTranslation(
                    new CG.Translate().initBezier(layersprites.elements[layersprites.elements.length - 2], 200, new CG.Point(500, 450), new CG.Point(100, 100), new CG.Point(-600, 600), new CG.Point(1200, -300)))
                .addTranslation(new CG.Translate().initTween(layersprites.elements[layersprites.elements.length - 2], 200, new CG.Point(100, 100), new CG.Point(550, 150)))
                .addTranslation(new CG.Translate().initTween(layersprites.elements[layersprites.elements.length - 2], 150, new CG.Point(550, 150), new CG.Point(100, 400)))
                .addTranslation(new CG.Translate().initTween(layersprites.elements[layersprites.elements.length - 2], 100, new CG.Point(100, 400), new CG.Point(550, 450))
                )
            console.log('create: sequence')

            Game.touchinit()
            console.log('create: touchinit()')

            Game.loop()
            console.log('create: jump into loop')

        },
        loop: function () {
            Game.delta.update()
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                var last = new Date()
                //    delta = (now - then) / (1000 / Game.fps)
                Game.run();
                Game.touchhandler()
                delta = (new Date() - last) / 1000
            }
        },
        run: function () {
            Game.update()
            Game.draw()
        },
        update: function () {

            //experimental key handler
            document.onkeydown = function (evt) {

                if (evt.keyIdentifier == 'Up') {
                    CG.mouse.y = CG.mouse.y - 20
                }
                if (evt.keyIdentifier == 'Down') {
                    CG.mouse.y = CG.mouse.y + 20
                }
                if (evt.keyIdentifier == 'CG.LEFT') {
                    CG.mouse.x = CG.mouse.x - 20
                }
                if (evt.keyIdentifier == 'Right') {
                    CG.mouse.x = CG.mouse.x + 20
                }
                layerrunner.getElementByName('rocket').x = CG.mouse.x
                layerrunner.getElementByName('rocket').y = CG.mouse.y

            };


            //experimental rocket movement
            var rocky = layerrunner.getElementByName('rocket')
            ri += 0.007
            rocky.position.x = Game.bound.width / 2 + (Game.bound.width / 3 * Math.cos(ri * 3 - Math.cos(ri))) >> 0
            rocky.position.y = Game.bound.height / 2 + (Game.bound.height / 2 * -Math.sin(ri * 2.3 - Math.cos(ri))) >> 0

            mapcollisiontext = ''

            circle.x1 = layersprites.getElementByName('rocket').x
            circle.y1 = layersprites.getElementByName('rocket').y
            circle.update()
            circlesmoke.update()

            morph.update()
            screen4.getLayerByName('layerfollower').getElementByName('sun').alpha = morph.getVal()
            screen4.getLayerByName('layerfollower').getElementByName('sun').xscale = morph.getVal()
            screen4.getLayerByName('layerfollower').getElementByName('sun').yscale = morph.getVal()

            //colission detection of rocket with objects on layer follower
            layerrunner.getElementByName('rocket').alpha = 1
            layerrunner.getElementByName('rocket').checkCollision(layerfollower.elements, callbackCollisionTest)

            map.xcol = CG.mouse.x
            map.ycol = CG.mouse.y

            crosshair.position.x = CG.mouse.x
            crosshair.position.y = CG.mouse.y

            map.update()

            sequence.update()

            Game.director.update()
        },
        draw: function () {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            map.drawMap(0, 0, CG.mouse.x * 2 >> 0, CG.mouse.y * 2 >> 0, Game.bound.width, Game.bound.height, callbackMapCollision)
            //        map.drawMap()
            //        map.draw()

            var ytext = 10
            font2.drawText('cangaja - Canvas Game JavaScript FW', 10, ytext)

            Game.director.draw()

            if (Game.director.getActiveScreenName() == 'follower') {
                font.drawText('Spritecollision: ' + colmsg, 10, ytext += 70)
                font.drawText('Map Tile Collision: ' + mapcollisiontext, 10, ytext += 20)
            }

            if (Game.director.getActiveScreenName() == 'bitmap') {
                if (CG.mouse.x < bm.bitmap_canvas.width && CG.mouse.y < bm.bitmap_canvas.height) {
                    data = bm.getPixel(CG.mouse.x, CG.mouse.y).data
                    font.drawText('Bitmap pixeldata: ' + data[0] + '/' + data[1] + '/' + data[2] + '/' + data[3], 10, ytext += 250)
                }
            }


            colmsg = ''


            Game.ctx.drawImage(Game.b_canvas, 0, 0)
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
            renderStats.update();
        },
        touchinit: function () {
            hammer = new Hammer(canvas);
            hammer.ontap = function (ev) {
                CG.mousedown = true
                CG.mouse.x = ev.position[0].x - canvas.offsetLeft //correct ontap value x
                CG.mouse.y = ev.position[0].y - canvas.offsetTop  //correct ontap value y
                clicked()

            };
            hammer.ondragstart = function (ev) {
            };
            hammer.ondrag = function (ev) {
                CG.mouse.x = ev.position.x
                CG.mouse.y = ev.position.y

            };
            hammer.ondragend = function (ev) {
            };
            hammer.onswipe = function (ev) {
            };

            hammer.ondoubletap = function (ev) {
            };
            hammer.onhold = function (ev) {
            };

            hammer.ontransformstart = function (ev) {
            };
            hammer.ontransform = function (ev) {
            };
            hammer.ontransformend = function (ev) {
            };

            hammer.onrelease = function (ev) {
            };
        },
        touchhandler: function () {
            CG.mousedown = false
        }
    }

    return Game
}())


function createMapElements() {

    pointstest = map.getPointsByName('coin')

    for (var i = 0, l = pointstest.length; i < l; i++) {
        diamond = new CG.Sprite(Game.asset.getImageByName('gem'), pointstest[i].position)
        diamond.name = 'diamond'
        diamond.boundingradius = 80
        layerfollower.addElement(diamond)
    }

    // TEST 1
    areastest = map.getAreasByName('enemies-hor')[0]

    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
    ballon.name = 'ballon'
    ballon.boundsMode = 'slide'
    ballon.xspeed = -1
    ballon.bound = areastest.bound
    ballon.yspeed = 0
    ballon.xscale = 0.4
    ballon.yscale = 0.4
    layerfollower.addElement(ballon)

    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
    ballon.name = 'ballon'
    ballon.boundsMode = 'slide'
    ballon.xspeed = 1
    ballon.bound = areastest.bound
    ballon.yspeed = 0
    ballon.xscale = 0.4
    ballon.yscale = 0.4
    layerfollower.addElement(ballon)

    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
    ballon.name = 'ballon'
    ballon.boundsMode = 'slide'
    ballon.yspeed = -1
    ballon.bound = areastest.bound
    ballon.xscale = 0.2
    ballon.yscale = 0.2
    layerfollower.addElement(ballon)

    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
    ballon.name = 'ballon'
    ballon.boundsMode = 'slide'
    ballon.yspeed = 1
    ballon.bound = areastest.bound
    ballon.xscale = 0.2
    ballon.yscale = 0.2
    layerfollower.addElement(ballon)

    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 0))
    ballon.name = 'ballon'
    ballon.boundsMode = 'bounce'
    ballon.xspeed = 1
    ballon.yspeed = 1
    ballon.bound = areastest.bound
    ballon.xscale = 0.2
    ballon.yscale = 0.2
    layerfollower.addElement(ballon)

    areastest2 = map.getAreasByName('enemies-ver')[0]
    sun = new CG.Sprite(Game.asset.getImageByName('sun'), new CG.Point(0, 0))
    sun.name = 'little'
    sun.boundsMode = 'bounce'
    sun.xspeed = 1
    sun.yspeed = 1
    sun.xscale = 0.2
    sun.yscale = 0.2
    sun.bound = areastest2.bound
    layerfollower.addElement(sun)


    areastest3 = map.getAreasByName('anim-ver')[0]

    run = new CG.Animation(Game.asset.getImageByName('hunter'), false, 8, 14, 56, 64)
    run.boundsMode = 'bounce'
    run.xspeed = 2
    run.yspeed = 2
    run.name = 'runner1'
    run.delay = 6
    run.xscale = 0.5
    run.yscale = 0.5
    run.bound = areastest3.bound
    layerfollower.addElement(run)

    areastest3 = map.getAreasByName('anim-hor')[0]
    run = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(0, 0), 8, 14, 56, 64)
    run.boundsMode = 'slide'
    run.xspeed = 2
    run.name = 'runner2'
    run.delay = 6
    run.xscale = 0.5
    run.yscale = 0.5
    run.bound = areastest3.bound
    layerfollower.addElement(run)

    run = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(0, 0), 8, 14, 56, 64)
    run.boundsMode = 'slide'
    run.xspeed = -2
    run.name = 'runner3'
    run.delay = 6
    run.xscale = 0.5
    run.yscale = 0.5
    run.bound = areastest3.bound
    layerfollower.addElement(run)

    run = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(0, 0), 8, 14, 56, 64)
    run.boundsMode = 'slide'
    run.yspeed = 2
    run.name = 'runner4'
    run.delay = 6
    run.xscale = 0.5
    run.yscale = 0.5
    run.bound = areastest3.bound
    layerfollower.addElement(run)

    run = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(0, 0), 8, 14, 56, 64)
    run.boundsMode = 'slide'
    run.yspeed = -2
    run.name = 'runner5'
    run.delay = 6
    run.xscale = 0.5
    run.yscale = 0.5
    run.bound = areastest3.bound
    layerfollower.addElement(run)


}


function createElements() {

    bm = new CG.Bitmap(300, 300)
    bm.loadImage(Game.asset.getImageByName('texturepacker'))
    layerbitmap.addElement(bm)
    bm.clearCircle(50, 50, 50)
    bm.clearRect(120, 120, 50, 50)

    crosshair = new CG.Sprite(Game.asset.getImageByName('crosshair'), new CG.Point(320, 240))
    crosshair.name = 'crosshair'
    layerbitmap.addElement(crosshair)

    layeranimationsmoke.addElement(new CG.Emitter(new CG.Point(50, 50))
        .setName('animationsmoke')
        .activateFadeout()
        .setGravity(-0.02)
        .initAsPoint(Game.asset.getImageByName('little-smoke'))
        //        .setEmitterPosition(new CG.Point(50, 50))
    )

    run1 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(280, Game.height2), 1, 7, 56, 64)
    run1.name = 'runner1'
    run1.delay = 6
    run1.attachObject(layeranimationsmoke.getElementByName('animationsmoke'))
        .setAttachedOffsetX(20)
        .setAttachedOffsetY(-25)


    layeranimation.addElement(run1)

    run2 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(360, Game.height2), 8, 14, 56, 64)
    run2.name = 'runner2'
    run2.delay = 6
    layeranimation.addElement(run2)

    run3 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(440, Game.height2), 16, 24, 56, 64)
    run3.name = 'runner3'
    run3.delay = 6
    layeranimation.addElement(run3)

    run4 = new CG.Animation(Game.asset.getImageByName('hunter'), new CG.Point(200, Game.height2), 31, 47, 56, 64)
    run4.name = 'runner3'
    run4.delay = 6
    layeranimation.addElement(run4)


    rocket = new CG.Sprite(Game.asset.getImageByName('rocket'), new CG.Point(Game.width2, Game.height2))
    rocket.name = 'rocket'
    rocket.boundsMode = 'slide'
    rocket.boundingradius = 80
    rocket.xscale = 0.5
    rocket.yscale = 0.5


    layerfollowersmoke.addElement(new CG.Emitter(new CG.Point(50, 50))
        .setName('smoke1')
        .setMaxParticles(10)
        .setCreationTime(500)
        .activateFadeout()
        .setGravity(-0.01)
        .initAsPoint(Game.asset.getImageByName('little-smoke'))
        //        .setEmitterPosition(new CG.Point(50, 50))
    )

    layerfollowersmoke.addElement(new CG.Emitter(new CG.Point(100, 50))
        .setName('smoke2')
        .setMaxParticles(10)
        .setCreationTime(500)
        .activateFadeout()
        .setGravity(-0.01)
        .initAsPoint(Game.asset.getImageByName('little-smoke'))
        //        .setEmitterPosition(new CG.Point(100, 50))
    )


    hunter = new CG.Sprite(Game.asset.getImageByName('rocket2'), new CG.Point(Game.width2, Game.height2))
    hunter.name = 'rockethunter-1'
    hunter.boundsMode = 'slide'
    hunter.boundingradius = 80
    hunter.xscale = 0.25
    hunter.yscale = 0.25
    hunter.followspeed = 2
    hunter.followobject = rocket
    hunter.attachedobject = layerfollowersmoke.getElementByName('smoke1')
    layerfollower.addElement(hunter)

    hunter = new CG.Sprite(Game.asset.getImageByName('rocket2'), new CG.Point(Game.width2, Game.height2))
    hunter.name = 'rockethunter-2'
    hunter.boundsMode = 'slide'
    hunter.boundingradius = 80
    hunter.xscale = 0.25
    hunter.yscale = 0.25
    hunter.followsteps = 40
    hunter.followobject = rocket
    hunter.attachedobject = layerfollowersmoke.getElementByName('smoke2')
    layerfollower.addElement(hunter)

    layerrunner.addElement(rocket)

    //Test emitter

    layeremitter.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
        .setName('splashi')
        .setParticleSpeed(0)
        .setPLifetime(15)
        .setGravity(0)
        .initAsRectangle(Game.asset.getImageByName('splash'), Game.width, Game.height)
        .setProtation(0)
        //        .setEmitterPosition(new CG.Point(320,240))
        .activateFadeout()
    )

    layeremitter.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height + 20))
        .setName('sunny')
        .setParticleSpeed(2)
        .setGravity(0.02)
        .initAsLine(Game.asset.getImageByName('sun50'), Game.height, CG.UP)
        .setProtation(2)
        //        .setEmitterPosition(new CG.Point(320,500))
        .activateFadeout()
    )


    layeremitter.addElement(new CG.Emitter(new CG.Point(Game.width2, -20))
        .setName('rainy')
        .setParticleSpeed(2)
        .setGravity(0.03)
        .initAsLine(Game.asset.getImageByName('raindrop'), Game.height, CG.DOWN)
        //        .setEmitterPosition(new CG.Point(320,-20))
        .activateFadeout()
    )


    layeremitter.addElement(new CG.Emitter(new CG.Point(-25, Game.height2))
        .setName('glowy')
        .setGravity(0)
        .setParticleSpeed(2)
        .setProtation(1)
        .initAsLine(Game.asset.getImageByName('glowball50'), 40, CG.RIGHT)
        //        .setEmitterPosition(new CG.Point(-25,240))
        .activateFadeout()
    )

    layeremitter.addElement(new CG.Emitter(new CG.Point(Game.width + 15, Game.height2))
        .setName('bally')
        .setParticleSpeed(2)
        .setProtation(-1)
        .setGravity(0)
        .initAsLine(Game.asset.getImageByName('basketball-25'), 40, CG.LEFT)
        //        .setEmitterPosition(new CG.Point(655,240))
        .activateFadeout()
    )

    layeremitter.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
        .setName('explodi-stars')
        .activateFadeout()
        .setProtation(2)
        .setGravity(0)
        .initAsExplosion(Game.asset.getImageByName('powerstar75'), -2, 2)
        //        .setEmitterPosition(new CG.Point(320, 240))
    )

    layeremitter.addElement(new CG.Emitter(new CG.Point(Game.width2, Game.height2))
        .setName('smokey')
        .activateFadeout()
        .setGravity(-0.05)
        .initAsPoint(Game.asset.getImageByName('smoke'))
        //        .setEmitterPosition(new CG.Point(320, 240))
    )


    layeremitter.addElement(new CG.Emitter(new CG.Point(160, 120))
        .setName('smokey')
        .setMaxParticles(100)
        .activateFadeout()
        .setGravity(0)
        .setProtation(5)
        .setParticleSpeed(1)
        .setPLifetime(10)
        .setCreationTime(10)
        .initAsCorona(Game.asset.getImageByName('littlestar'), 100)
        //        .setEmitterPosition(new CG.Point(160, 120))
    )

    sun = new CG.Sprite(Game.asset.getImageByName('sun'), new CG.Point(480, 100))
    sun.name = 'sun'
    sun.boundingradius = 150
    sun.xspeed = 1
    sun.boundsMode = 'slide'
    sun.xscale = 1
    sun.yscale = 1
    layerfollower.addElement(sun)


    cloud = new CG.Sprite(Game.asset.getImageByName('cloud'), new CG.Point(150, 150))
    cloud.name = 'cloud'
    cloud.xscale = 0.75
    cloud.yscale = 0.75
    cloud.xspeed = 0.5
    cloud.yspeed = -0.25
    cloud.boundsMode = 'slide'
    layersprites.addElement(cloud)


    cloud = new CG.Sprite(Game.asset.getImageByName('cloud'), new CG.Point(250, 200))
    cloud.name = 'cloud'
    cloud.xscale = 0.75
    cloud.yscale = 0.75
    cloud.xspeed = -0.25
    cloud.yspeed = 0.5
    cloud.boundsMode = 'slide'
    layersprites.addElement(cloud)


    rainbow = new CG.Sprite(Game.asset.getImageByName('rainbow'), new CG.Point(125, 200))
    rainbow.name = 'rainbow'
    rainbow.xspeed = -0.1
    rainbow.boundsMode = 'slide'
    layersprites.addElement(rainbow)


    for (i = 0; i < 10; i++) {
        cloud = new CG.Sprite(Game.asset.getImageByName('cloud'), new CG.Point(300 + (10 * i), 200 + (5 * i)))
        cloud.name = 'cloud'
        cloud.alpha = 0.4
        cloud.xscale = 0.5
        cloud.yscale = 0.5
        cloud.xspeed = 0.13 * (i / 20)
        cloud.yspeed = 0.15 + (i / 20)
        cloud.boundsMode = 'slide'
        layersprites.addElement(cloud)
    }
    delete cloud


    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(550, 240))
    ballon.name = 'ballon'
    ballon.boundsMode = 'bounce'
    ballon.xspeed = 1.5
    ballon.yspeed = -1.5
    ballon.xscale = 0.25
    ballon.yscale = 0.25
    layersprites.addElement(ballon)

    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(0, 450))
    ballon.name = 'ballon'
    ballon.boundsMode = 'bounce'
    ballon.xspeed = -1
    ballon.yspeed = 1
    ballon.rotation = 90
    ballon.xscale = 0.4
    ballon.yscale = 0.4
    layersprites.addElement(ballon)


    ballon = new CG.Sprite(Game.asset.getImageByName('ballon'), new CG.Point(320, 240))
    ballon.name = 'ballon'
    ballon.boundsMode = 'bounce'
    ballon.xspeed = -1
    ballon.yspeed = 1.5
    ballon.xscale = 0.2
    ballon.yscale = 0.2
    ballon.rotationspeed = 5
    layersprites.addElement(ballon)
    delete ballon


    glow = new CG.Sprite(Game.asset.getImageByName('glowball'), new CG.Point(-150, -150))
    glow.name = 'glow'
    glow.boundsMode = 'bounce'
    glow.xspeed = 1.5
    glow.yspeed = 0.5
    glow.xscale = 0.2
    glow.yscale = 0.2
    //    glow.rotationspeed = 0.5
    glow.alpha = 0.5
    layersprites.addElement(glow)
    delete glow

    basketball = new CG.Sprite(Game.asset.getImageByName('basketball'), new CG.Point(150, 330))
    basketball.name = 'basketball'
    basketball.boundsMode = 'bounce'
    basketball.xspeed = 0.5
    basketball.yspeed = 2
    basketball.rotationspeed = -5
    basketball.xscale = 0.25
    basketball.yscale = 0.25
    basketball.alpha = 0.5
    basketball.setBound(new CG.Bound(50, 50, 200, 200))  //setting the bound of the sprite
    layersprites.addElement(basketball)
    delete basketball


    ybutton = 100
    button1 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton), 'Emitter&Particle', font, cbToEmitterdemo)
    button1.name = 'emitter'
    layerfront.addElement(button1)

    button2 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Sprite&Translation', font, cbToSpritedemo)
    button2.name = 'sprite'
    layerfront.addElement(button2)

    button3 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Animation', font, cbToAnimationdemo)
    button3.name = 'animation'
    layerfront.addElement(button3)


    button4 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Follower&Coll.(Sprite&Map)', font, cbToFollowerdemo)
    button4.name = 'collision'
    layerfront.addElement(button4)

    button5 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Map Demo', font, cbToMapdemo)
    button5.name = 'map'
    layerfront.addElement(button5)

    button6 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Menu&Callback Demo', font, cbToMenudemo)
    button6.name = 'menu'
    layerfront.addElement(button6)

    button7 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Bitmap Demo', font, cbToBitmapdemo)
    button7.name = 'menu'
    layerfront.addElement(button7)


    back = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, Game.height - 30), 'back to Main', font, cbBackToMain)
    back.name = 'back'

    layeremitter.addElement(back)
    layersprites.addElement(back)
    layerfollower.addElement(back)
    layeranimation.addElement(back)
    layermap.addElement(back)
    layermenu.addElement(back)
    layerbitmap.addElement(back)


    ybutton = 100
    mbutton1 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton), 'Map 1 mit Anim.', font, cbToMapChange)
    mbutton1.name = 'map1'
    layermap.addElement(mbutton1)

    mbutton2 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Map 2 mit Anim.', font, cbToMapChange)
    mbutton2.name = 'map2'
    layermap.addElement(mbutton2)

    mbutton3 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Iso Demo', font, cbToMapChange)
    mbutton3.name = 'iso'
    layermap.addElement(mbutton3)

    mbutton4 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Sewers Demo', font, cbToMapChange)
    mbutton4.name = 'sewers'
    layermap.addElement(mbutton4)

    mbutton5 = new CG.Button(Game.asset.getImageByName('btn-back-color'), new CG.Point(Game.width2, ybutton += 50), 'Othermap ;o)', font, cbToMapChange)
    mbutton5.name = 'othermap'
    layermap.addElement(mbutton5)


    menu = new CG.Menu(320, 100, 10)
    button = new CG.Button(Game.asset.getImageByName('button'), new CG.Point(Game.width2, 100), 'Menu Button 1', font, callbackTest)
    button.name = '#mbutton 1#'
    menu.addButton(button)
    button = new CG.Button(Game.asset.getImageByName('button'), new CG.Point(Game.width2, 100), 'Menu Button 2', font, callbackTest)
    button.name = '#mbutton 2#'
    menu.addButton(button)
    button = new CG.Button(Game.asset.getImageByName('button'), new CG.Point(Game.width2, 100), 'Menu Button 3', font, callbackTest)
    button.name = '#mbutton 3#'
    menu.addButton(button)
    layermenu.addElement(menu)


    rotclick = new CG.Sprite(Game.path + 'media/img/rot-click.png', new CG.Point(Game.width2, Game.height2))
    rotclick.name = 'transme'
    rotclick.clickable = true
    rotclick.xscale = 1
    rotclick.yscale = 1
    rotclick.rotationspeed = 1
    layersprites.addElement(rotclick)

    rotclick = new CG.Sprite(Game.path + 'media/img/rot-click.png', new CG.Point(Game.width2, Game.height2))
    rotclick.name = '### rotation click ;o) ###'
    rotclick.clickable = true
    rotclick.xscale = 0.5
    rotclick.yscale = 0.5
    rotclick.rotation = 0
    layersprites.addElement(rotclick)
}


function cbToEmitterdemo() {
    Game.director.nextScreen('emitter', 'fade', 50)
}
function cbToSpritedemo() {
    Game.director.nextScreen('sprites', 'fade', 50)
}
function cbToAnimationdemo() {
    Game.director.nextScreen('animation', 'fade', 50)
}
function cbToFollowerdemo() {
    map.visible = true

    Game.director.nextScreen('follower', 'fade', 50)
}
function cbToMapdemo() {
    map.visible = true
    Game.director.nextScreen('map', 'fade', 50)
}
function cbToMenudemo() {
    Game.director.nextScreen('menu', 'fade', 50)
}
function cbToBitmapdemo() {
    Game.director.nextScreen('bitmap', 'fade', 50)
}
function cbToMapChange() {
    map.loadMapXml(Game.asset.getXmlByName(this.name))
    //    map.loadMapJson(Game.asset.getJsonByName(this.name))
    console.log('cbToMapChange')
}


function cbBackToMain() {
    map.visible = false
    Game.director.nextScreen('menuscreen', 'fade', 5)
}


function callbackTest(obj) {
    console.log(['clicked & execute callback', obj])
}
function callbackCollisionTest(obj1, obj2) {
    //console.log(obj2.name)
    layerrunner.getElementByName('rocket').alpha = 0.3
    colmsg = 'Rocket collision!'
}
function callbackMapCollision(sprite, tile) {
    mapcol += 1
    if (tile instanceof MapTileProperties) {
        mapcollisiontext = sprite.name + ' hits ' + tile.name
    }
}


function clicked() {
    if (Game.director.getActiveScreenName() == 'bitmap') {
        if (CG.mouse.x < bm.bitmap_canvas.width && CG.mouse.y < bm.bitmap_canvas.height) {
            bm.clearCircle(CG.mouse.x, CG.mouse.y, 10)
        }
    } else {
        var expl
        myShoot.play()
        if (CG.mouse.x % 2) {
            expl = new CG.Animation(Game.asset.getImageByName('exp' + (Math.floor((Math.random() * 5)) + 1)), new CG.Point(CG.mouse.x, CG.mouse.y), 1, 16, 64, 64)
            expl.yspeed = -2
            expl.delay = 5
        } else {
            if (CG.mouse.y % 2) {
                expl = new CG.Animation(Game.asset.getImageByName('bigexplosion'), new CG.Point(CG.mouse.x, CG.mouse.y), 1, 64, 256, 256)
            } else {
                expl = new CG.Animation(Game.asset.getImageByName('burst'), new CG.Point(CG.mouse.x, CG.mouse.y), 1, 256, 256, 256)
            }
            expl.yspeed = -1
            expl.delay = 0.5
        }

        expl.name = 'expl'
        expl.loop = false
        expl.xscale = 3
        expl.yscale = 3
        expl.rotation = Math.floor((Math.random() * 180) + 1.5)
        expl.rotationspeed = Math.floor((Math.random() * 3) + 1.5)

        layermiddle.addElement(expl)
    }
}