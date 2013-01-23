/**
 * @description Class Buffer for separate canvas rendering/buffering
 *
 * @constructor
 * @augments Entity
 * 
 * @param {integer} width of the buffer
 * @param {integer} height of the buffer
 * @param {string} buffername
 */
CG.Entity.extend('Buffer', {
    init: function (width, height, buffername) {
    this._super(buffername)
    this.b_canvas = document.createElement('canvas')
//    if(typeof(ejecta) !== 'undefined'){
//        this.b_canvas.width = w
//        this.b_canvas.height = h
//    }else{
    this.b_canvas.width = width
    this.b_canvas.height = height
//    }
    this.b_ctx = this.b_canvas.getContext('2d')
    return this
}
})