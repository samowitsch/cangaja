/**
 * @description
 *
 * CG.Button represents a simple button class that can handle click, mouseover and callback functionality.
 *
 * @class CG.Button
 * @extends CG.Sprite
 *
 */
CG.Sprite.extend('Button', {
    /**
     * @method init
     * @constructor
     * @param image {image} image image path, image or atlasimage
     * @param position {CG.Point} position point
     * @param text {string} the button text
     * @param font {CG.Font} a CG.Font object for text rendering
     * @param clickedCallback {callback} callback function for click handling
     * @return {*}
     */
    init: function (image, position, text, font, clickedCallback) {
        this._super(image, position)
        this.instanceOf = 'Button'

        /**
         @property font {CG.Font}
         */
        this.font = font
        /**
         @property text {string}
         */
        this.text = text

        /**
         @property clickedCallback {callback}
         */
        this.clickedCallback = clickedCallback
        /**
         @property clickable {boolean}
         */
        this.clickable = true
        /**
         @property clicked {boolean}
         */
        this.clicked = false

        return this
    },
    update: function () {
        this.ifClicked()
        this.ifMouseOver()

        this.xhandle = (this.width * this.xscale / 2)
        this.yhandle = (this.height * this.yscale / 2)

        if (this.clicked) {
            if (this.clickedCallback) {
                this.clicked = false
                this.clickedCallback(this)
            }
        }
        this.updateDiff()
        this.updateMatrix()
    },
    draw: function () {
        if (this.visible == true) {

            Game.renderer.draw(this)

            this.font.drawText(this.text, this.position.x - (this.font.getTextWidth(this.text) / 2 >> 0), this.position.y - ((this.font.getFontSize() / 2) >> 0))


        }
    }
})


