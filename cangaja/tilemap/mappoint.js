/**
 * @description
 *
 * CG.MapPoint. Support now for name, gid and x/y-position values. No tilemap properties at the moment.
 *
 * @class CG.MapPoint
 * @extends CG.Class
 *
 */
CG.Class.extend('MapPoint', {
    /**
     * @method init
     * @constructor
     * @param position {point} position point
     * @param mapoffset {point} mapoffset reference to the current map position
     * @param name {string} name of the tile
     * @param gid {Number} gid number of tilemap editor
     * @return {*}
     */
    init:function (position, mapoffset, name, gid) {
        /**
         * @property initposition
         * @type {CG.Point}
         */
        this.initposition = position || new CG.Point(0, 0)
        /**
         * @property mapoffset
         * @type {CG.Point}
         */
        this.mapoffset = mapoffset || new CG.Point(0, 0)
        /**
         * @property gid
         * @type {Number}
         */
        this.gid = gid
        /**
         * @property name
         * @type {*}
         */
        this.name = name
        /**
         * @property position
         * @type {CG.Point}
         */
        this.position = new CG.Point(position.x, position.y) //for reference use
        return this
    },

    update:function () {
        this.position.x = this.initposition.x - this.mapoffset.x
        this.position.y = this.initposition.y - this.mapoffset.y
    }
})


