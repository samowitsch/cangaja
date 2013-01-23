/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


CG.Class.extend('Delta', {
    init:function (fps) {
        this.targetfps = fps
        this.currentticks = 0
        this.lastticks = Date.now()
        this.frametime = 0
        this.delta = 0
    },

    update:function () {
        this.currentticks = Date.now()
        this.frametime = this.currentticks - this.lastticks
        this.delta = this.frametime / ( 1000 / this.targetfps)
        this.lastticks = this.currentticks
    },
    get:function () {
        return this.delta
    }
})