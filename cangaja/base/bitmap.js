/**
 * @description
 *
 * CG.Bitmap is a simple bitmap class.
 *
 ```

var b = new CG.Bitmap({
   width: 100,
   height: 100
 })

 ```
 *
 * @class CG.Bitmap
 * @extends CG.Entity
 *
 */

//@TODO add surface normal function (http://gamedev.tutsplus.com/tutorials/implementation/coding-destructible-pixel-terrain/, http://en.wikipedia.org/wiki/Surface_normal)
//@TODO add a raycast function ?

CG.Entity.extend('Bitmap', {
    /**
     * Options:
     * width {number}
     * height {number}
     *
     * @method init
     * @constructor
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        this.instanceOf = 'Bitmap'

        CG._extend(this, {
            /**
             @property x {Number}
             */
            x: 0,
            /**
             @property y {Number}
             */
            y: 0,
            /**
             @description tolerance for the getSquareValues method
             @property tolerance {Number}
             */
            tolerance: 128

        })

        if (options) {
            CG._extend(this, options)
        }

        /**
         @property bitmap_canvas {Object}
         */
        this.bitmap_canvas = document.createElement('canvas')
        /**
         @property bitmap_ctx {Context}
         */
        this.bitmap_ctx = this.bitmap_canvas.getContext('2d')
        /**
         @property bitmap_ctx.fillStyle {String}
         */
        this.bitmap_ctx.fillStyle = '#000000'
        /**
         @property bitmap_canvas.width {Number}
         */
        this.bitmap_canvas.width = this.width
        /**
         @property bitmap_canvas.height {Number}
         */
        this.bitmap_canvas.height = this.height


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
    loadImage: function (image) {
        this.setImage(image)
        this.drawImageToBuffer()
        return this
    },


    update: function () {
    },

    draw: function () {

        Game.renderer.draw(this)

    },


    /**
     * @method clearBuffer
     */
    clearBuffer: function () {
        this.bitmap_ctx.clearRect(0, 0, this.bitmap_canvas.width, this.bitmap_canvas.height)
        return this
    },

    /**
     * @method drawImageToBuffer
     */
    drawImageToBuffer: function () {
        if (this.image) {
            this.bitmap_ctx.drawImage(this.image, 0, 0)
        }
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
    clearRect: function (x, y, width, height) {
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
    clearCircle: function (x, y, radius) {
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
    getPixel: function (x, y) {
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
    getPixels: function (x, y, width, height) {
        return this.bitmap_ctx.getImageData(x, y, width, height)
    },
    /**
     * @method getPixelAlpha
     *
     * @param x
     * @param y
     * @returns {*}
     */
    getPixelAlpha: function (x, y) {
        return this.bitmap_ctx.getImageData(x, y, 1, 1).data[3]
    },
    /**
     * @method traceContour
     *
     * @description
     * trace the outer contour of an bitmap body clockwise (CW)
     * http://www.emanueleferonato.com/2013/03/01/using-marching-squares-algorithm-to-trace-the-contour-of-an-image/)
     *
     * @returns {Array}
     */
    traceContour: function () {
        var startPoint = this.getStartingPixel()
        var contourVector = []
        if (startPoint) {
            var pX = startPoint.x,
                pY = startPoint.y,
                stepX,
                stepY,
                prevX,
                prevY,
                closedLoop = false

            while (!closedLoop) {
                var squareValue = this.getSquareValue(pX, pY)
                switch (squareValue) {
                    /* going UP with these cases:

                     +---+---+   +---+---+   +---+---+
                     | 1 |   |   | 1 |   |   | 1 |   |
                     +---+---+   +---+---+   +---+---+
                     |   |   |   | 4 |   |   | 4 | 8 |
                     +---+---+  	+---+---+  	+---+---+

                     */
                    case 1 :
                    case 5 :
                    case 13 :
                        stepX = 0;
                        stepY = -1;
                        break;
                    /* going DOWN with these cases:

                     +---+---+   +---+---+   +---+---+
                     |   |   |   |   | 2 |   | 1 | 2 |
                     +---+---+   +---+---+   +---+---+
                     |   | 8 |   |   | 8 |   |   | 8 |
                     +---+---+  	+---+---+  	+---+---+

                     */
                    case 8 :
                    case 10 :
                    case 11 :
                        stepX = 0;
                        stepY = 1;
                        break;
                    /* going LEFT with these cases:

                     +---+---+   +---+---+   +---+---+
                     |   |   |   |   |   |   |   | 2 |
                     +---+---+   +---+---+   +---+---+
                     | 4 |   |   | 4 | 8 |   | 4 | 8 |
                     +---+---+  	+---+---+  	+---+---+

                     */
                    case 4 :
                    case 12 :
                    case 14 :
                        stepX = -1;
                        stepY = 0;
                        break;
                    /* going RIGHT with these cases:

                     +---+---+   +---+---+   +---+---+
                     |   | 2 |   | 1 | 2 |   | 1 | 2 |
                     +---+---+   +---+---+   +---+---+
                     |   |   |   |   |   |   | 4 |   |
                     +---+---+  	+---+---+  	+---+---+

                     */
                    case 2 :
                    case 3 :
                    case 7 :
                        stepX = 1;
                        stepY = 0;
                        break;
                    case 6 :
                        /* special saddle point case 1:

                         +---+---+
                         |   | 2 |
                         +---+---+
                         | 4 |   |
                         +---+---+

                         going LEFT if coming from UP
                         else going RIGHT

                         */
                        if (prevX == 0 && prevY == -1) {
                            stepX = -1;
                            stepY = 0;
                        }
                        else {
                            stepX = 1;
                            stepY = 0;
                        }
                        break;
                    case 9 :
                        /* special saddle point case 2:

                         +---+---+
                         | 1 |   |
                         +---+---+
                         |   | 8 |
                         +---+---+

                         going UP if coming from RIGHT
                         else going DOWN

                         */
                        if (prevX == 1 && prevY == 0) {
                            stepX = 0;
                            stepY = -1;
                        }
                        else {
                            stepX = 0;
                            stepY = 1;
                        }
                        break;
                }
                // moving onto next point
                pX += stepX;
                pY += stepY;
                // saving contour point
                contourVector.push({x: pX, y: pY});
                prevX = stepX;
                prevY = stepY;

                // if we returned to the first point visited, the loop has finished
                if (pX == startPoint.x && pY == startPoint.y) {
                    closedLoop = true;
                }
            }

        }
        return contourVector
    },
    /**
     * @method drawContour
     * @description draws the traced contour for debuging at the moment
     * @param vertices {Array}
     */
    drawContour: function (vertices) {
        this.bitmap_ctx.save()
        for (var i = 0; i < vertices.length; i++) {
            this.bitmap_ctx.fillStyle = '#f00'
            this.bitmap_ctx.fillRect(vertices[i].x, vertices[i].y, 1, 1);
        }
        this.bitmap_ctx.restore()
    },
    /**
     * @method lightenContour
     * @description removes points that doesn't affect much to the visual appearance. the order after ClipperLib.JS.Lighten is counter clockwise (CCW)
     * @param vertices
     * @param tolerance
     * @returns {Array}
     */
    lightenCountur: function (vertices, tolerance) {
        var tolerance = tolerance || 1
        return ClipperLib.JS.Lighten(vertices, tolerance)[0]
    },
    /**
     * @method triangulateContour
     * @param vertices
     * @returns {array.<Triangle>|*|Array}
     */
    triangulateContour: function (vertices) {
        var swctx = new poly2tri.SweepContext(vertices, {cloneArrays: true})
        swctx.triangulate();
        return swctx.getTriangles() || []
    },
    /**
     * @method getStartingPixel
     * @description scanline trace to get the first pixel
     * @returns {Object|false}
     */
    getStartingPixel: function () {
        for (var ys = 0; ys < this.height; ys++) {
            for (var xs = 0; xs < this.width; xs++) {
                if (this.getPixelAlpha(xs, ys) >= this.tolerance) {
                    return {x: xs, y: ys}
                }
            }
        }
        return false
    },
    /**
     * @method getSquareValue
     * @description get four squared pixels to trace a contour
     * @param x
     * @param y
     * @returns {number}
     */
    getSquareValue: function (x, y) {
        var squareValue = 0

        // check upper left pixel
        if (this.getPixelAlpha(x - 1, y - 1) >= this.tolerance) {
            squareValue += 1
        }
        // check upper pixel
        if (this.getPixelAlpha(x, y - 1) >= this.tolerance) {
            squareValue += 2
        }
        // check left pixel
        if (this.getPixelAlpha(x - 1, y) >= this.tolerance) {
            squareValue += 4
        }
        // checking pixel itself
        if (this.getPixelAlpha(x, y) >= this.tolerance) {
            squareValue += 8
        }
        return squareValue
    }
})


