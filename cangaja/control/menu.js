/**
 * @description
 *
 * CG.Menu collects buttons an displays them with the defined margin
 *
 ```

 var menu = new CG.Menu({
   x: 100,
   y: 100,
   margin: 10
 })

 button = new CG.Button({
    image: Game.asset.getImageByName('button'),
    position: new CG.Point(Game.width2, 100),
    text: 'Menu Button 1',
    font: font,
    callback: callbackTest
 })
 button.name = '#mbutton 1#'
 menu.addButton(button)

 button = new CG.Button({
    image: Game.asset.getImageByName('button'),
    position: new CG.Point(Game.width2, 100),
    text: 'Menu Button 2',
    font: font,
    callback: callbackTest
 })
 button.name = '#mbutton 2#'
 menu.addButton(button)

 button = new CG.Button({
    image: Game.asset.getImageByName('button'),
    position: new CG.Point(Game.width2, 100),
    text: 'Menu Button 3',
    font: font,
    callback: callbackTest
 })
 button.name = '#mbutton 3#'
 menu.addButton(button)

 // add the menu to the layer
 layermenu.addElement(menu)

 ```
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
     * margin {number}*
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
     * @description adds an CG.Button to the buttons array
     *
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


