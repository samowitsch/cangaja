var mainscreen, mainlayer, accel


CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method

        //add needed eventlistener or use included hammer.js
        this.canvas.addEventListener('touchmove', function (evt) {
            CG.mouse = this.mouse = {
                x: evt.touches[0].pageX,
                y: evt.touches[0].pageY
            }
            console.log(JSON.stringify(this.mouse));
            evt.preventDefault();
        }.bind(this), false)

        this.canvas.addEventListener('touchstart', function (evt) {
            CG.mousedown = this.mousedown = true
            console.log(this.mousedown);
            evt.preventDefault();//Stops the default behavior
        }.bind(this), false);

        this.canvas.addEventListener('touchend', function (evt) {
            CG.mousedown = this.mousedown = false
            console.log(this.mousedown);
            evt.preventDefault();//Stops the default behavior
        }.bind(this), false);

        document.addEventListener('devicemotion', function (evt) {
            accel = evt.accelerationIncludingGravity;
            console.log(accel.x, accel.y, accel.z);
        }, false);
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
            image: this.asset.getImageByName('example'),
            position: new CG.Point(this.width2, this.height2)
        })
        mainlayer.addElement(example)

        //add screen to Director
        this.director.addScreen(mainscreen)
        //after creation start game loop
        this.loop()
    },
    update: function () {
    },
    draw: function () {
    }
})