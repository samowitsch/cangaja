/**
 * @description class CG.Delta not really used at the moment ;o)
 *
 * @class CG.Delta
 * @extends Class
 *
 */


CG.Class.extend('Delta', {
    /**
     * @method init
     * @constructor
     * @param fps {Number}
     */
    init:function (fps) {
        /**
         * @property targetfps
         * @type {Number}
         */
        this.targetfps = fps
        /**
         * @property currentticks
         * @type {Number}
         */
        this.currentticks = 0
        /**
         * @property lastticks
         * @type {Date}
         */
        this.lastticks = Date.now()
        /**
         * @property frametime
         * @type {Number}
         */
        this.frametime = 0
        /**
         * @property delta
         * @type {Number}
         */
        this.delta = 0
    },

    update:function () {
        this.currentticks = Date.now()
        this.frametime = this.currentticks - this.lastticks
        this.delta = this.frametime / ( 1000 / this.targetfps)
        this.lastticks = this.currentticks
    },
    get:function () {
        return this.delta
    }
})


