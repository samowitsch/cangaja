/**
 * @description  class MapArea. Support now for name and the bound values.
 *
 * @constructor
 *
 * @param {bound} bound of area
 * @param {point} mapoffset reference to the current map position
 * @param {string} name of the group
 * @param {false/string} type (a property) of area for collision detection or what ever ;o)
 */
CG.Class.extend('MapArea', {
    init:function (bound, mapoffset, name, type) {
        //initial values
        this.initbound = bound || new CG.Bound(0, 0, 0, 0)
        this.mapoffset = mapoffset || new CG.Point(0, 0)
        this.name = name
        this.type = type || false       //false, inner or outer

        //for reference use
        this.bound = new CG.Bound(bound.x, bound.y, bound.width, bound.height)
        return this
    },

    update:function () {
        this.bound.x = this.initbound.x - this.mapoffset.x
        this.bound.y = this.initbound.y - this.mapoffset.y
    }
})


