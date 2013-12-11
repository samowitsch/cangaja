/**
 * @description
 *
 * CG.Morph to manipulate objects in size and so on.
 *
 * @class CG.Morph
 * @extends CG.Class
 *
 */
CG.Class.extend('Morph', {
    /**
     * @method init
     * @constructor
     * @param mode {string} mode type of the morph object, at the moment only "sinus" possible ;o)
     * @param min {Number} min min value
     * @param max {Number} max max value
     * @param speed {Number} speed speed value
     */
    init:function (mode, min, max, speed) {
        /**
         * @property mode
         * @type {String}
         */
        this.mode = mode
        /**
         * @property min
         * @type {Number}
         */
        this.min = min
        /**
         * @property max
         * @type {Number}
         */
        this.max = max
        /**
         * @property speed
         * @type {Number}
         */
        this.speed = speed
        /**
         * @property angle
         * @type {Number}
         */
        this.angle = 0
        /**
         * @property rad
         * @type {Number}
         */
        this.rad = this.max - this.min
        /**
         * @property _val
         * @type {Number}
         * @protected
         */
        this._val = 0
    },
    update:function () {
        switch (this.mode) {
            case 'sinus':
                var rad = this.angle * CG.Const_PI_180
                this._val = this.rad * Math.sin(rad)
                if (this._val < 0) {
                    this._val = this._val * -1
                }
                this.angle += this.speed

                if (this.angle > 360) {
                    this.angle = 0 + (this.angle - 360)
                }
                break
        }
        return this
    },
    draw:function () {

    },
    /**
     * @method getVal
     *
     * @return {float}
     */
    getVal:function () {
        return this._val
    }
})



