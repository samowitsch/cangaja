/**
 * @description
 *
 * CG.Point
 *
 * @class CG.Point
 * @extends CG.Class
 */
CG.Class.extend('Point', {
    /**
     * @constructor
     * @method init
     * @param x {Number} the x value of the point
     * @param y {Number} the y value of the point
     */
    init:function (x, y) {
        /**
         @property x {Number}
         */
        this.x = x || 0
        /**
         @property y {Number}
         */
        this.y = y || 0
    }
})


