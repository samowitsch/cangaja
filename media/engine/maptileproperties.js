/**
 * @description MapTileProperties
 *
 * @constructor
 */
CG.Class.extend('MapTileProperties', {
    init: function () {
    this.animated = false
    this.animDelay = 0
    this.animDirection = 0 // >0 = forward, <0 = backward, 0 = paused
    this.animNext = 0
    this.delayTimer = 0
    return this
}
})