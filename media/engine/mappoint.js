/**
 * @description class MapPoint. Support now for name, gid and x/y-position values. No tilemap properties at the moment.
 *
 * @constructor
 *
 * @param {point} position point
 * @param {point} mapoffset reference to the current map position
 * @param {string} name of the tile
 * @param {Number} gid number of tilemap editor
 */
CG.Class.extend('MapPoint', {
    init:function (position, mapoffset, name, gid) {
        //initial values
        this.initposition = position || new CG.Point(0, 0)
        this.mapoffset = mapoffset || new CG.Point(0, 0)
        this.gid = gid
        this.name = name

        //for reference use
        this.position = new CG.Point(position.x, position.y)
        return this
    },

    update:function () {
        this.position.x = this.initposition.x - this.mapoffset.x
        this.position.y = this.initposition.y - this.mapoffset.y
    }
})


