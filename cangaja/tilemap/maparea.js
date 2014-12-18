/**
 * @description
 *
 * CG.MapArea. Support now for name and the bound values.
 *
 ```

 var ma = new CG.MapArea({
    name: obj.name,
    bound: new CG.Bound({
        x: parseInt(obj.x),
        y: parseInt(obj.y),
        width: parseInt(obj.width),
        height: parseInt(obj.height)
    }),
    mapOffset: this.position,
    type: obj.properties.type
})

 ```
 *
 * @class CG.MapArea
 * @extends CG.Class
 */
CG.Class.extend('MapArea', {
    /**
     * Options:
     * name {string}
     * bound {CG.Bound}
     * mapOffset {CG.Point}
     * type {mixed} false, inner or outer
     *
     * @constructor
     * @method init
     * @param options {Object}
     * @return {*}
     */
    init: function (options) {
        CG._extend(this, {
            /**
             * @property initbound
             * @type {CG.Bound}
             */
            initBound: new CG.Bound({
                x: 0,
                y: 0,
                width: 0,
                height: 0
            }),
            ///**
            // * @property mapoffset
            // * @type {CG.Point}
            // */
            //mapOffset: new CG.Point(0, 0),
            /**
             * @property name
             * @type {String}
             */
            name: '',
            /**
             * @property type
             * @type {String}
             */
            type: false,      //false, inner or outer

            /**
             * @property bound
             * @type {CG.Bound}
             */
            bound: new CG.Bound({
                x: 0,
                y: 0,
                width: 0,
                height: 0
            })
        })


        CG._extend(this, options)

        this.initBound = this.bound

        return this
    },

    update: function (mapOffset) {
        this.bound.x = this.initBound.x - mapOffset.x
        this.bound.y = this.initBound.y - mapOffset.y
    }
})


