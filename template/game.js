var mainscreen, mainlayer

//waiting to get started ;o)
window.onload = function () {

    Game.init({
        place: document.body,
        width: 640,
        height: 480
    })
    Game.preload()
};

// the Game object
Game = (function () {
    var Game = {
        path: '',
        fps: 60,
        width: 0,
        height: 0,
        width2: 0,
        height2: 0,
        bound: new CG.Bound(0, 0, 640, 480).setName('game'),
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

            //create canvas element programaticaly
            Game.canvas = document.createElement('canvas')
            Game.canvas.width = init.width
            Game.canvas.height = init.height
            Game.canvas.id = 'canvas'

            //append to body tag
            init.place.appendChild(Game.canvas)

            //add needed eventlistener or use included hammer.js
            Game.canvas.addEventListener("mousedown", function (e) {
                CG.mousedown = true
            }, true);

            Game.canvas.addEventListener("mouseup", function () {
                CG.mousedown = false
            }, true);

            Game.canvas.addEventListener('touchmove', function (evt) {
                CG.mouse = Game.mouse = {
                    x: evt.touches[0].pageX - Game.canvas.offsetLeft,
                    y: evt.touches[0].pageY - Game.canvas.offsetTop
                }
//                alert(JSON.stringify(Game.mouse))
                evt.preventDefault();
            }, false)

            Game.canvas.addEventListener("touchstart", function (evt) {
                CG.mousedown = true
                CG.start = Game.start = {
                    x: evt.touches[0].pageX - Game.canvas.offsetLeft,
                    y: evt.touches[0].pageY - Game.canvas.offsetTop
                }
//                alert(JSON.stringify(Game.start))
                evt.preventDefault();//Stops the default behavior
            }, false);

            Game.canvas.addEventListener("touchend", function (evt) {
                CG.mousedown = false
                CG.end = Game.end = {
                    x: evt.touches[0].pageX - Game.canvas.offsetLeft,
                    y: evt.touches[0].pageY - Game.canvas.offsetTop
                }
//                alert(JSON.stringify(Game.end))
                evt.preventDefault();//Stops the default behavior
            }, false);

            Game.canvas.addEventListener('mousemove', function (evt) {
                CG.mouse = Game.mouse = {
                    x: evt.clientX - Game.canvas.offsetLeft,
                    y: evt.clientY - Game.canvas.offsetTop
                }

//                console.log(JSON.stringify(Game.mouse));
            }, false);


            Game.ctx = Game.canvas.getContext("2d")
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
                //.addJson(Game.path + 'media/img/texturepacker.json', 'json')

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