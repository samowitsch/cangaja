/**
 * @description
 *
 * CG.Screen is a child of CG.Director and a container to collect/group CG.Layers and/or CG.B2DWorld
 *
 * @class CG.Screen
 * @extends CG.Class
 *
 * @param {string} screenname the name of the screen
 */
CG.Class.extend('Screen', {
    /**
     * @constructor
     * @method init
     * @param screenname
     * @return {*}
     */
    init: function (screenname) {
        this.name = (screenname) ? screenname : ''

        /**
         * @property position
         * @type {CG.Point}
         */
        this.position = new CG.Point(0, 0)
        /**
         * @property xscale
         * @type {Number}
         */
        this.xscale = 1
        /**
         * @property yscale
         * @type {Number}
         */
        this.yscale = 1
        /**
         * @property layers
         * @type {Array}
         */
        this.layers = []
        return this
    },
    create: function () {

    },
    /**
     * @method update
     */
    update: function () {
        for (var i = 0, l = this.layers.length; i < l; i++) {
            this.layers[i].update()
        }
    },
    /**
     * @method draw
     */
    draw: function () {
        Game.b_ctx.save()
        if (this.xscale !== 1 || this.yscale !== 1) {
            Game.b_ctx.translate((Game.width - (Game.width * this.xscale)) / 2, (Game.height - (Game.height * this.yscale)) / 2)
            Game.b_ctx.scale(this.xscale, this.yscale)
        } else {
            Game.b_ctx.translate(this.position.x, this.position.y)
        }
        for (var i = 0, l = this.layers.length; i < l; i++) {
            this.layers[i].draw()
        }

        Game.b_ctx.restore()
    },

    /**
     * @description add a CG.Layer object to the layer array
     * @method addLayer
     * @param {layer} layer to add
     */
    addLayer: function (layer) {
        this.layers.push(layer)
        return this
    },

    /**
     * @description find CG.Layer by name
     * @method getLayerByName
     * @param {string} layername find layer by name
     * @return {boolean/layer}
     */
    getLayerByName: function (layername) {
        for (var i = 0, l = this.layers.length; i < l; i++) {
            if (this.layers[i].name == layername) {
                return this.layers[i]
            }
        }
        return false
    }
})


