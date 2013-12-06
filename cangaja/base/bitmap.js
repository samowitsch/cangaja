/**
 * @description
 *
 * CG.Bitmap is a simple bitmap class with basic features for bitmap manipulation at the moment.
 *
 * @class CG.Bitmap
 * @extends CG.Entity
 *
 */

//@TODO add margin squares function for contour finding => also for polygon path? (http://www.emanueleferonato.com/2013/03/01/using-marching-squares-algorithm-to-trace-the-contour-of-an-image/)
//@TODO add surface normal function (http://gamedev.tutsplus.com/tutorials/implementation/coding-destructible-pixel-terrain/, http://en.wikipedia.org/wiki/Surface_normal)
//@TODO add a raycast function ?

CG.Entity.extend('Bitmap', {
    /**
     * @method init
     * @constructor
     * @param width {Number} width the width for the buffer
     * @param height {Number} height the height for the buffer
     * @return {*}
     */
    init:function (width, height) {
        this.instanceOf = 'Bitmap'
        this.x = 0
        this.y = 0
        this.bitmap_canvas = document.createElement('canvas')
        this.bitmap_canvas.width = width
        this.bitmap_canvas.height = height
        this.bitmap_ctx = this.bitmap_canvas.getContext('2d')
        return this
    },
    /**
     * @description
     *
     * Loads an image and draws it to the buffer
     *
     * @method loadImage
     *
     * @param {string, image, atlasimage} imgpath, image object or atlasimage object to use
     */
    loadImage:function (image) {
        this.setImage(image)
        this.drawImageToBuffer()
        return this
    },


    update:function () {
    },

    draw:function () {

        Game.renderer.draw(this)

    },


    /**
     * @method clearBuffer
     */
    clearBuffer:function () {
        this.bitmap_ctx.clearRect(0, 0, this.bitmap_canvas.width, this.bitmap_canvas.height)
        return this
    },

    /**
     * @method drawImageToBuffer
     */
    drawImageToBuffer:function () {
        this.bitmap_ctx.drawImage(this.image, 0, 0)
        return this
    },


    /**
     * @method clearRect
     *
     * @param {Number} x the x position for clearRect
     * @param {Number} y the y position for clearRect
     * @param {Number} width the width for clearRect
     * @param {Number} height the height for clearRect
     */
    clearRect:function (x, y, width, height) {
        this.bitmap_ctx.save()
        this.bitmap_ctx.globalCompositeOperation = 'destination-out'
        this.bitmap_ctx.clearRect(x, y, width, height)
        this.bitmap_ctx.restore()
    },

    /**
     * @method clearCircle
     *
     * @param {Number} x the x position for clearCircle
     * @param {Number} y the y position for clearCircle
     * @param {Number} radius the radius for clearCircle
     */
    clearCircle:function (x, y, radius) {
        this.bitmap_ctx.save()
        this.bitmap_ctx.globalCompositeOperation = 'destination-out'
        this.bitmap_ctx.beginPath()
        this.bitmap_ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        this.bitmap_ctx.closePath()
        this.bitmap_ctx.fill()
        this.bitmap_ctx.restore()
    },

    /**
     * @method getPixel
     *
     * @param {Number} x the x position for getPixel
     * @param {Number} y the y position for getPixel
     * @returns {imagedata} data from canvas
     */
    getPixel:function (x, y) {
        return this.bitmap_ctx.getImageData(x, y, 1, 1)
    },

    /**
     * @method getPixels
     *
     * @param {Number} x the x position for getPixels
     * @param {Number} y the y position for getPixels
     * @param {Number} width for getPixels
     * @param {Number} height for getPixels
     * @returns {imagedata} data from canvas
     */
    getPixels:function (x, y, width, height) {
        return this.bitmap_ctx.getImageData(x, y, width, height)
    }
})


