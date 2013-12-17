/**
 * @description
 *
 * CG.Buffer for separate canvas rendering/buffering
 * @TODO to be removed?
 *
 * @class CG.Buffer
 * @extends CG.Class
 *
 */
CG.Class.extend('Buffer', {
    /**
     * @constructor
     * @method init
     * @param width {Number} width of the buffer
     * @param height {Number} height of the buffer
     * @return {*}
     */
    init:function (width, height) {
        /**
         * @property b_canvas
         * @type {HTMLElement}
         */
        this.b_canvas = document.createElement('canvas')

        /**
         * @property b_canvas.width
         * @type {*}
         */
        this.b_canvas.width = width
        /**
         * @property b_canvas.height
         * @type {*}
         */
        this.b_canvas.height = height

        /**
         * @property b_ctx
         * @type {CanvasRenderingContext2D}
         */
        this.b_ctx = this.b_canvas.getContext('2d')
        return this
    }
})


