/**
 * @description class Morph to manipulate objects in size and so on
 *
 * @constructor
 * @augments Entity
 *
 * @param {string} mode type of the morph object
 * @param {integer} min min value
 * @param {integer} max max value
 * @param {integer} speed speed value
 */
CG.Entity.extend('Morph', {
    init:function (mode, min, max, speed) {
        this.mode = mode
        this.min = min
        this.max = max
        this.speed = speed
        this.angle = 0
        this.rad = this.max - this.min
        this.val = 0
    },
    update:function () {
        switch (this.mode) {
            case 'sinus':
                var rad = this.angle * CG.Const_PI_180
                this.val = this.rad * Math.sin(rad)
                if (this.val < 0) {
                    this.val = this.val * -1
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
     * @description get the current value
     *
     * @return {float}
     */
    getVal:function () {
        return this.val
    }
})



