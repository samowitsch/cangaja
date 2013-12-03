/**
 * @description
 *
 * CG.Delta not really used at the moment ;o)
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
    init: function (fps) {
        /**
         * @property targetfps
         * @type {Number}
         */
        this.targetfps = fps
        /**
         * @property currenttime
         * @type {Number}
         */
        this.currenttime = 0
        /**
         * @property lasttime
         * @type {Number}
         */
        this.lasttime = Date.now()
        /**
         * @property elapsedtime
         * @type {Number}
         */
        this.elapsedtime = 0
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
        /**
         * @property fps
         * @type {Number}
         */
        this.fps = 0
    },

    update: function () {
        var delta = (Date.now() - this.lasttime) / 1000
        this.fps = 1 / delta
        this.lasttime = Date.now()
    },
    getDelta: function () {
        return this.delta
    },
    getFPS: function () {
        return this.fps
    }
})


