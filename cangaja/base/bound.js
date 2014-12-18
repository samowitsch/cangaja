/**
 * @description
 *
 * CG.Bound is used at different places in the Cangaja FW.
 *
 ```

     var b = new CG.Bound({
           x: 0,
           y: 0,
           width: 120,
           height: 120
         })

 ```
 *
 * @class CG.Bound
 * @extends CG.Class
 *
 */
CG.Class.extend('Bound', {
    /**
     * Options:
     * x {number}
     * y {number}
     * width {number}
     * height {number}
     *
     *
     * @constructor
     * @method init
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        CG._extend(this, {
            /**
             * @property x
             * @type {Number}
             */
            x: 0,
            /**
             * @property y
             * @type {Number}
             */
            y: 0,
            /**
             * @property width
             * @type {Number}
             */
            width: 0,
            /**
             * @property height
             * @type {Number}
             */
            height: 0
        })

        if (options) {
            CG._extend(this, options)
        }
        return this
    },

    /**
     * @method setName
     * @param {string} name of the bounding box
     * @return {*}
     */
    setName: function (name) {
        this.name = name
        return this
    }
})


