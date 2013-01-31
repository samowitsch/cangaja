/**
 * @description B2DLayer
 *
 * @constructor
 * @augments Layer
 *
 * @param {string} layername the name of the layer
 */
CG.Layer.extend('B2DLayer', {
    init:function (layername) {
        this._super(layername)

        return this
    },
    //TODO maybe not needed
    update:function () {
        this._super.update()
    },
    //TODO maybe not needed
    draw:function () {
        this._super.draw()
    }
})



