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
     * Options:
     * mode {string}
     * min {number}
     * max {number}
     * speed {number}
     *
     @example
     var e = new CG.Morph({
           name: 'player',
           position: new CG.Point(100,100)
         })
     *
     * @method init
     * @constructor
     * @param options {object}
     */
    init: function (options) {
        CG._extend(this, {
            /**
             * @property mode
             * @type {String}
             */
            mode: '',
            /**
             * @property min
             * @type {Number}
             */
            min: 0,
            /**
             * @property max
             * @type {Number}
             */
            max: 0,
            /**
             * @property speed
             * @type {Number}
             */
            speed: 0,
            /**
             * @property angle
             * @type {Number}
             */
            angle: 0,
            /**
             * @property rad
             * @type {Number}
             */
            rad: 0,
            /**
             * @property _val
             * @type {Number}
             * @protected
             */
            _val: 0
        })

        if (options) {
            CG._extend(this, options)
            this.rad = this.max - this.min
        }

        return this
    },
    update: function () {
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
    draw: function () {

    },
    /**
     * @method getVal
     *
     * @return {float}
     */
    getVal: function () {
        return this._val
    }
})



