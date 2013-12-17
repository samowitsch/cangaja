var mainscreen, mainlayer, canvas, Game


CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('mousedown', function (e) {
            CG.mousedown = this.mousedown = true
            console.log(CG.mousedown);
        }.bind(this), true);

        this.canvas.addEventListener('mouseup', function () {
            CG.mousedown = this.mousedown = false
            console.log(CG.mousedown);
        }.bind(this), true);

        this.canvas.addEventListener('mousemove', function (evt) {
            CG.mouse = this.mouse = {
                x: evt.clientX - this.canvas.offsetLeft,
                y: evt.clientY - this.canvas.offsetTop
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
        mainscreen = new CG.Screen('mainscreen')
        mainlayer = new CG.Layer('mainlayer')
        mainscreen.addLayer(mainlayer)

        example = new CG.Sprite(Game.asset.getImageByName('example'), new CG.Point(Game.width2, Game.height2))
        example.name = 'back'
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




canvas = document.createElement('canvas')
canvas.id = 'canvas'
document.body.appendChild(canvas)

Game = new CG.MyGame(canvas)
