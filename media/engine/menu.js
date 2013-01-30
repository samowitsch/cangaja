/**
 * @description class Menu
 *
 * @constructor
 * @augments Entity
 *
 * @param {integer} x the x position
 * @param {integer} y the y position
 * @param {integer} margin the margin between the menu buttons
 */
CG.Entity.extend('Menu', {
    init:function (x, y, margin) {
        this.x = x
        this.y = y
        this.margin = margin
        this.step = this.y
        this.buttons = []
        return this
    },
    /**
     * @description add a button to the menu
     *
     * @param {button} button
     */
    addButton:function (button) {
        this.buttons.push(button)
    },

    update:function () {
        this.buttons.forEach(function (button) {
            button.update()
        }, this)
    },

    draw:function () {
        this.buttons.forEach(function (button) {
            button.position.x = this.x
            button.position.y = this.step
            button.draw()
            this.step += button.height
            this.step += this.margin
        }, this)
        this.step = this.y
    }
})


