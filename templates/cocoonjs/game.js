var mainscreen, mainlayer, canvas, Game


CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('touchstart', function (evt) {
            CG.mousedown = this.mousedown = true
            console.log(CG.mousedown);
        }.bind(this), true);

        this.canvas.addEventListener('touchend', function (evt) {
            CG.mousedown = this.mousedown = false
            console.log(CG.mousedown);
        }.bind(this), true);

        this.canvas.addEventListener('touchmove', function (evt) {
            CG.mouse = this.mouse = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            }
            console.log(JSON.stringify(this.mouse));
        }.bind(this), false)
    },
    preload: function () {
        this.asset
            //example adding font (glyphdesigner)
            //.addFont('media/font/small.txt', 'small', 'small')

            //example adding json (texturepacker)
            //.addJson('media/img/texturepacker.json', 'json')

            //example adding xml (tiled)
            //.addXml('media/map/map-advanced.tmx', 'map1')

            //example adding iamge
            .addImage('media/img/example.jpg', 'example')

            //start preloading and jump later to Game.init()
            .startPreLoad()
    },
    create: function () {

        //screen and layer
        mainscreen = new CG.Screen({name: 'mainscreen'})
        mainlayer = new CG.Layer({name: 'mainlayer'})
        mainscreen.addLayer(mainlayer)

        example = new CG.Sprite({
            image: Game.asset.getImageByName('example'),
            position: new CG.Point(Game.width2, Game.height2)
        })
        mainlayer.addElement(example)

        //add screen to Director
        Game.director.addScreen(mainscreen)
        //after creation start game loop
        this.loop()
    },
    update: function () {
    },
    draw: function () {
    }
})


// Screencanvas
// http://support.ludei.com/hc/en-us/articles/200862486-Screencanvas
canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas')
canvas.id = 'canvas'
document.body.appendChild(canvas)

Game = new CG.MyGame(canvas)
