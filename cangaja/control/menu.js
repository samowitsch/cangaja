/**
 * @description
 *
 * CG.Menu
 *
 * @class CG.Menu
 * @extends CG.Class
 *
 */
CG.Class.extend('Menu', {
    /**
     * @method init
     * @constructor
     * @param x {Number} x the x position
     * @param y {Number} y the y position
     * @param margin {Number} margin the margin between the menu buttons
     * @return {*}
     */
    init:function (x, y, margin) {
        /**
         * @property x
         * @type {Number}
         */
        this.x = x
        /**
         * @property y
         * @type {Number}
         */
        this.y = y
        /**
         * @property margin
         * @type {Number}
         */
        this.margin = margin
        /**
         * @property step
         * @type {*}
         */
        this.step = this.y
        /**
         * @property buttons
         * @type {Array}
         */
        this.buttons = []
        return this
    },
    /**
     * @method addButton
     *
     * @param {button} button
     */
    addButton:function (button) {
        this.buttons.push(button)
    },

    update:function () {
        this.buttons.forEach(function (button) {
            button.update()
        })
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


