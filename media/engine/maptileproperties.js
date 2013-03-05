/**
 * @description MapTileProperties
 *
 * @class CG.MapTileProperties
 * @extend Class
 */
CG.Class.extend('MapTileProperties', {
    /**
     * @method init
     * @constructor
     * @return {*}
     */
    init:function () {
        /**
         * @property animated
         * @type {Boolean}
         */
        this.animated = false
        /**
         * @property animDelay
         * @type {Number}
         */
        this.animDelay = 0
        /**
         * @property animDirection
         * @type {Number}
         */
        this.animDirection = 0 // >0 = forward, <0 = backward, 0 = paused
        /**
         * @property animNext
         * @type {Number}
         */
        this.animNext = 0
        /**
         * @property delayTimer
         * @type {Number}
         */
        this.delayTimer = 0
        return this
    }
})


