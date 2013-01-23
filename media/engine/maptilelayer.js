/**
 * @description MapTileLayer
 *
 * @constructor
 */
CG.Class.extend('MapTileLayer', {
    init: function () {
    this.width = 0
    this.height = 0
    this.visible = true
    this.opacity = 1
    this.tiles = []
    return this
}
})