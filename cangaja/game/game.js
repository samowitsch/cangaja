/**
 * @description
 *
 * CG.Game - this class is the starting point for a cangaja game. The default object name of the instantiatet object has to be 'Game'!
 * @class CG.Game
 * @extends Class
 */

CG.Class.extend('Game', {
    /**
     * @method init
     * @constructor
     * @param canvas
     * @param options
     */
    init: function (canvas, options) {
        /**
         @property canvas {object}
         */
        switch (typeof canvas) {
            case 'object':
                this.canvas = canvas
                break
            case 'string':
                this.canvas = document.getElementById(canvas)
                break
            default:
                throw 'no canvas element defined'
                break
        }
        /**
         @property ctx {Object}
         */
        this.ctx = this.canvas.getContext('2d')
        /**
         @property fps {Number}
         */
        this.fps = 60
        /**
         @property width {Number}
         */
        this.width = this.canvas.width
        /**
         @property height {Number}
         */
        this.height = this.canvas.height
        /**
         @property width2 {Number}
         */
        this.width2 = this.width / 2
        /**
         @property height2 {Number}
         */
        this.height2 = this.height / 2
        /**
         @property b_canvas {Object}
         */
        this.b_canvas = document.createElement('canvas')
        this.b_canvas.width = this.width
        this.b_canvas.height = this.height
        /**
         @property b_ctx {Object}
         */
        this.b_ctx = this.b_canvas.getContext('2d')
        /**
         @property asset {CG.MediaAsset}
         */
        this.asset = new CG.MediaAsset(this)
        /**
         @property director {CG.Director}
         */
        this.director = new CG.Director()
        /**
         @property renderer {CG.CanvasRenderer}
         */
        this.renderer = new CG.CanvasRenderer()
        /**
         @property delta {CG.Delta}
         */
        this.delta = new CG.Delta(this.fps)
        /**
         @property bound {CG.Bound}
         */
        this.bound = new CG.Bound(0, 0, this.width, this.height)

        this.preload()
    },
    /**
     * @description child classes that extends CG.Game defines here all needed stuff to preload with CG.MediaAsset.
     * @method preload
     */
    preload: function () {
    },
    /**
     * @description child classes that extends CG.Game could use this method to create all needed stuff.
     * @method create
     */
    create: function () {
        this.loop()
    },
    /**
     * @description this is the central (game) loop
     * @method loop
     */
    loop: function () {
        requestAnimationFrame(this.loop.bind(this))
        this.beforeUpdate()
        this.update()
        this.beforeDraw()
        this.draw()
        this.afterDraw()
    },
    /**
     * @description in this method all CG.Director elements are updated.
     * @method beforeUpdate
     */
    beforeUpdate: function(){
        this.director.update()
    },
    /**
     * @method update
     */
    update: function () {
    },
    /**
     * @description in this method all CG.Director elements are rendered to the canvas. after that the draw method is executed and some custom drawing is possible.
     * @method beforeDraw
     */
    beforeDraw: function () {
        this.director.draw()
    },
    /**
     * @description
     * @method draw
     */
    draw: function () {

    },
    /**
     * @description this is the final draw method. it draws the b_canvas buffer to the canvas
     * @method afterDraw
     */
    afterDraw: function () {
        this.ctx.clearRect(0, 0, this.bound.width, this.bound.height)

        // draw buffer b_canvas to the canvas
        this.ctx.drawImage(this.b_canvas, 0, 0)

        // clear the b_canvas
        this.b_ctx.clearRect(0, 0, this.bound.width, this.bound.height)
    }
})


/*


 How to extend the game class


 //extend the base game class
 CG.Game.extend('MyGame', {
 init: function (canvas, options) {
 //call init from super class
 this._super(canvas, options)
 },
 preload: function (){
 this.asset
 .addImage('media/font/small.png', 'small')
 .addJson('media/img/spritetestphysics.json', 'spritetestphysics')
 .startPreLoad()

 },
 create: function () {

 //after creation start game loop
 this.loop()
 },
 update: function () {
 //call super class to update director class
 this._super()
 },
 draw: function () {
 //call super class to draw director class
 this._super()
 }
 })


 var Game = new CG.MyGame('canvas')





 CG.Game.extend('MyGame', {
 preload: function (){
 this.asset
 .addImage('media/font/small.png', 'small')
 .addJson('media/img/spritetestphysics.json', 'spritetestphysics')
 .startPreLoad()

 },
 create: function () {

 //after creation start game loop
 this.loop()
 },
 update: function () {
 //call super class to update director class
 this._super()
 },
 draw: function () {
 //call super class to draw director class
 this._super()
 }
 })


 */