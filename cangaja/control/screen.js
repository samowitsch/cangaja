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
     * Options:
     * name {string}
     *
     @example
     var s = new CG.Screen({
           name: 'menuscreen'
         })
     *
     * @constructor
     * @method init
     * @param options
     * @return {*}
     */
    init: function (options) {
        CG._extend(this, {
            /**
             * @property name
             * @type {string}
             */
            name: '',
            /**
             * @property position
             * @type {CG.Point}
             */
            position: new CG.Point(0, 0),
            /**
             * @property xscale
             * @type {Number}
             */
            xscale: 1,
            /**
             * @property yscale
             * @type {Number}
             */
            yscale: 1,
            /**
             * @property layers
             * @type {Array}
             */
            layers: []
        })

        if (options) {
            CG._extend(this, options)
        }

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
        for (var i = 0, l = this.layers.length; i < l; i++) {
            if (this.xscale !== 1 || this.yscale !== 1) {
                Game.b_ctx.translate((Game.width - (Game.width * this.xscale)) / 2, (Game.height - (Game.height * this.yscale)) / 2)
                Game.b_ctx.scale(this.xscale, this.yscale)

                this.layers[i].draw()

            } else {
                // if layers have a fixed position the layer stays always on top left
                // this is usefull for tilemaps. they have its own mapoffset
                // TODO: may find a better solution
                if (this.layers[i].fixedPosition) {
                    Game.b_ctx.translate(0, 0)
                } else {
                    Game.b_ctx.translate(this.position.x, this.position.y)
                }
                this.layers[i].draw()
            }
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


