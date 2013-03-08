/**
 * @description
 *
 * CG.MapArea. Support now for name and the bound values.
 *
 * @class CG.MapArea
 * @extends CG.Class
 */
CG.Class.extend('MapArea', {
    /**
     * @constructor
     * @method init
     * @param bound {CG.Bound} bound of area
     * @param mapoffset {CG.Point} mapoffset reference to the current map position
     * @param name {string} name of the group
     * @param type {false/string} type (a property) of area for collision detection or what ever ;o)
     * @return {*}
     */
    init:function (bound, mapoffset, name, type) {
        /**
         * @property initbound
         * @type {CG.Bound}
         */
        this.initbound = bound || new CG.Bound(0, 0, 0, 0)
        /**
         * @property mapoffset
         * @type {CG.Point}
         */
        this.mapoffset = mapoffset || new CG.Point(0, 0)
        /**
         * @property name
         * @type {String}
         */
        this.name = name
        /**
         * @property type
         * @type {String}
         */
        this.type = type || false       //false, inner or outer

        /**
         * @property bound
         * @type {CG.Bound}
         */
        this.bound = new CG.Bound(bound.x, bound.y, bound.width, bound.height)
        return this
    },

    update:function () {
        this.bound.x = this.initbound.x - this.mapoffset.x
        this.bound.y = this.initbound.y - this.mapoffset.y
    }
})


