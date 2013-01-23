/**
 * @description class Vector
 *
 * @constructor
 * @augments Point
 *
 * @param {integer} x the x position
 * @param {integer} y the y position
 * @param {integer} z the z position
 */
CG.Point.extend('Vector', {
    init: function (x, y, z) {
        this._super(this, x, y)
        this.z = z || 0
    }
})