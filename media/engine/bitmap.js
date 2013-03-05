/**
 * @description Class Bitmap extends Class Buffer
 *
 * @class CG.Bitmap
 * @extends CG.Entity
 *
 */
CG.Entity.extend('Bitmap', {
    /**
     * @method init
     * @constructor
     * @param width {Number} width the width for the buffer
     * @param height {Number} height the height for the buffer
     * @return {*}
     */
    init:function (width, height) {
        this._super(this)
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
     * @param {string, image, tpimage} imgpath, image object or tpimage object to use
     */
    loadImage:function (image) {
        this.setImage(image)
        this.drawImageToBuffer()
        return this
    },


    update:function () {
    },

    draw:function () {
        Game.b_ctx.drawImage(this.bitmap_canvas, this.x, this.y)
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


