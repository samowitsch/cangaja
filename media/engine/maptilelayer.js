/**
 * @description MapTileLayer
 *
 * @class CG.MapTileLayer
 * @extends Class
 */
CG.Class.extend('MapTileLayer', {
    /**
     * @constructor
     * @method init
     * @return {*}
     */
    init:function () {
        /**
         * @property width
         * @type {Number}
         */
        this.width = 0
        /**
         * @property height
         * @type {Number}
         */
        this.height = 0
        /**
         * @property visible
         * @type {Boolean}
         */
        this.visible = true
        /**
         * @property opacity
         * @type {Number}
         */
        this.opacity = 1
        /**
         * @property tiles
         * @type {Array}
         */
        this.tiles = []
        return this
    }
})


