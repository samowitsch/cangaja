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
     * Options:
     * name {string}
     * position {CG.Point}
     * mapOffset {CG.Point}
     * gid {Number}
     *
     @example
     var s = new CG.MapPoint({
           name: '',                            // name of the tile
           position: new CG.Point(200,200),     // position point
           mapOffset: new CG.Point(100,100),    // mapoffset reference to the current map position
           gid: 10                              // gid number of tilemap editor
         })
     *
     * @method init
     * @constructor
     * @param options {object}
     * @return {*}
     */
    init: function (options) {

        CG._extend(this, {
            /**
             * @property gid
             * @type {Number}
             */
            gid: 0,
            /**
             * @property name
             * @type {*}
             */
            name: '',
            /**
             * @property initPosition
             * @type {CG.Point}
             */
            initPosition: new CG.Point(0, 0),
            /**
             * @property position
             * @type {CG.Point}
             */
            position: new CG.Point(0, 0),
            ///**
            // * @property mapOffset
            // * @type {CG.Point}
            // */
            //mapOffset: new CG.Point(0, 0)
        })

        CG._extend(this, options)

        this.initPosition = this.position

        return this
    },

    update: function (mapOffset) {
        this.position.x = this.initPosition.x - mapOffset.x
        this.position.y = this.initPosition.y - mapOffset.y
    }
})


