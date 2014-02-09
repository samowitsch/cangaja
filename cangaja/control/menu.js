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
     * Options:
     * x {number}
     * y {number}
     * margin {number}
     *
     @example
     var m = new CG.Menu({
           x: 100,
           y: 100,
           margin: 10
         })
     *
     *
     * @method init
     * @constructor
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
             * @property margin
             * @type {Number}
             */
            margin: 0,
            /**
             * @property step
             * @type {*}
             */
            step: 0,
            /**
             * @property buttons
             * @type {Array}
             */
            buttons: []
        })

        if (options) {
            CG._extend(this, options)
            this.step = this.y
        }
        return this
    },
    /**
     * @method addButton
     *
     * @param {button} button
     */
    addButton: function (button) {
        this.buttons.push(button)
    },
    /**
     * @method update
     */
    update: function () {
        this.buttons.forEach(function (button) {
            button.update()
        })
    },
    /**
     * @method draw
     */
    draw: function () {
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


