//ejecta stuff start
ejecta.include('cangaja.all.js');

var w = window.innerWidth;
var h = window.innerHeight;
var w2 = w / 2;
var h2 = h / 2;

var canvas = document.getElementById('canvas');
canvas.width = w;
canvas.height = h;

var ctx = canvas.getContext('2d');
//ejecta stuff start



var mainscreen, mainlayer

// the Game object
Game = (function () {
    var Game = {
        path: '',
        fps: 60,
        width: 0,
        height: 0,
        width2: 0,
        height2: 0,
        bound: new CG.Bound(0, 0, w, h).setName('game'),
        canvas: {},
        ctx: {},
        b_canvas: {},
        b_ctx: {},
        asset: {},
        director: new CG.Director(),
        delta: new CG.Delta(60),
        mouse: {x: 0, y: 0},
        start: {x: 0, y: 0},
        end: {x: 0, y: 0},
        init: function (init) {
            Game.width = init.width
            Game.width2 = Game.width / 2
            Game.height = init.height
            Game.height2 = Game.height / 2

            if (init.place) {
                //create canvas element programaticaly
                Game.canvas = CG.canvas = document.createElement('canvas')
                Game.canvas.width = init.width
                Game.canvas.height = init.height
                Game.canvas.id = 'canvas'

                //append to body tag
                init.place.appendChild(Game.canvas)
                Game.ctx = CG.ctx = Game.canvas.getContext("2d")

            } else {
                Game.canvas = CG.canvas = canvas
                Game.ctx = CG.ctx = ctx
            }

            //add needed eventlistener or use included hammer.js
            document.addEventListener('touchmove', function (evt) {
                console.log('move', evt.touches[0].pageX, evt.touches[0].pageY);
                CG.mouse = Game.mouse = {
                    x: evt.touches[0].pageX,
                    y: evt.touches[0].pageY
                }
                evt.preventDefault();
            }, false)

            document.addEventListener('touchstart', function (evt) {
                console.log('start', evt.touches[0].pageX, evt.touches[0].pageY);
                CG.mousedown = true
                CG.start = Game.start = {
                    x: evt.touches[0].pageX,
                    y: evt.touches[0].pageY
                }
                evt.preventDefault();
            }, false);

            document.addEventListener('touchend', function (evt) {
                console.log('end', evt.changedTouches[0].pageX, evt.changedTouches[0].pageY);
                CG.mousedown = false
                CG.end = Game.end = {
                    x: evt.changedTouches[0].pageX,
                    y: evt.changedTouches[0].pageY
                }
                evt.preventDefault();
            }, false);

            document.addEventListener('devicemotion', function (ev) {
                var accel = ev.accelerationIncludingGravity;
                //console.log(accel.x, accel.y, accel.z);
            }, false);


            Game.asset = new CG.MediaAsset('', Game.ctx)

            //create frame buffer
            Game.b_canvas = document.createElement('canvas')
            Game.b_ctx = Game.b_canvas.getContext('2d')
            Game.b_canvas.width = Game.bound.width
            Game.b_canvas.height = Game.bound.height
        },
        preload: function () {
            //adding files here for preloading
            Game.asset
                //example adding font (glyphdesigner)
                //.addFont(Game.path + 'media/font/small.txt', 'small', 'small')

                //example adding json (texturepacker)
                .addJson(Game.path + 'media/img/texturepacker.json', 'json')

                //example adding xml (tiled)
                //.addXml(Game.path + 'media/map/map-advanced.tmx', 'map1')

                //example adding iamge
                .addImage(Game.path + 'media/img/example.jpg', 'example')

                //start preloading and jump later to Game.create
                .startPreLoad()
        },
        create: function () {

            //screen and layer
            mainscreen = new CG.Screen('mainscreen')
            mainlayer = new CG.Layer('mainlayer')
            mainscreen.addLayer(mainlayer)


            example = new CG.Sprite(Game.asset.getImageByName('example'), new CG.Point(Game.width2, Game.height2))
            example.name = 'back'
            mainlayer.addElement(example)


            //add screen to Director
            Game.director.addScreen(mainscreen)


            //start gane loop
            Game.loop()
        },
        loop: function () {
            requestAnimationFrame(Game.loop);
            if (Game.asset.ready == true) {
                Game.run();
            }
        },
        run: function () {
            Game.update()
            Game.draw()
        },
        update: function () {
            //game logic, update here what ever you want

            //update all director elements
            Game.director.update()
        },
        draw: function () {
            //clear the canvas
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

            //draw all director elements
            Game.director.draw()

            //draw buffer to canvas
            Game.ctx.drawImage(Game.b_canvas, 0, 0)
            //clear the buffer
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)

        },
        touchinit: function () {
        },
        touchhandler: function () {
        }
    }

    return Game
}())


Game.init({
    place: false,
    width: w,
    height: h
})
Game.preload()
