/**
 * @description class Vector
 *
 * @class CG.Vector
 * @extends CG.Point
 */
CG.Point.extend('Vector', {
    /**
     * @constructor
     * @method init
     * @param x {Number} the x position
     * @param y {Number} the y position
     * @param z {Number} the z position
     */
    init:function (x, y, z) {
        this._super(this, x, y)
        /**
         @property z {Number}
         */
        this.z = z || 0
    }
})



