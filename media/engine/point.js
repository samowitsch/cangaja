/**
 * @description class Point
 *
 * @constructor
 * @augments Entity
 *
 * @param {integer} x the x position
 * @param {integer} y the y position
 */
CG.Entity.extend('Point', {
    init:function (x, y) {
        this.x = x || 0
        this.y = y || 0
    }
})