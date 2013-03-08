/**
 * @description
 *
 * CG.Bound is used at different places in the Cangaja FW.
 *
 * @class CG.Bound
 * @extends CG.Entity
 *
 */
CG.Entity.extend('Bound', {
    /**
     * @constructor
     * @method init
     * @param x {number} x the x position
     * @param y {number} y the y position
     * @param width {number} width the width of bound
     * @param height {number} height the height of bound
     * @return {*}
     */
    init:function (x, y, width, height) {
        this._super()
        /**
         * @property x
         * @type {Number}
         */
        this.x = x
        /**
         * @property y
         * @type {Number}
         */
        this.y = y
        /**
         * @property width
         * @type {Number}
         */
        this.width = width
        /**
         * @property height
         * @type {Number}
         */
        this.height = height
        return this
    },

    /**
     * @method setName
     * @param {string} name of the bounding box
     * @return {*}
     */
    setName:function (name) {
        this.name = name
        return this
    }
})


