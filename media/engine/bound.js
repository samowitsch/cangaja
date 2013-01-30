/**
 * @description Class Bound extends Class Entity
 *
 * @constructor
 * @augments Entity
 *
 * @param {number} x the x position
 * @param {number} y the y position
 * @param {number} width the width of bound
 * @param {number} height the height of bound
 */
CG.Entity.extend('Bound', {
    init:function (x, y, width, height) {
        this._super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        return this
    },

    /**
     * @param {string} name of the bounding box
     */
    setName:function (name) {
        this.name = name
        return this
    }
})


