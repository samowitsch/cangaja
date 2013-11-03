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
         @property clickedCallback {callback}
         */
        this.clickedCallback = clickedCallback
        /**
         @property clicked {boolean}
         */
        this.clicked = false
        /**
         @property clickable {boolean}
         */
        this.clickable = true
        /**
         @property visible {boolean}
         */
        this.visible = true

        /**
         @property text {string}
         */
        this.text = text
        return this
    },
    update: function () {
        this.ifClicked()
        this.ifMouseOver()
        this.ifAttached()

        this.xhandle = (this.width * this.xscale / 2)
        this.yhandle = (this.height * this.yscale / 2)


        if (this.clicked) {
            if (this.clickedCallback) {
                this.clicked = false
                this.clickedCallback(this)
            }
        }
    },
    draw: function () {
        if (this.visible == true) {

            Game.renderer.draw(this)

            Game.b_ctx.save()
            Game.b_ctx.translate(this.position.x, this.position.y)
            this.font.drawText(this.text, 0 - (this.font.getTextWidth(this.text) / 2 >> 0), 0 - ((this.font.getFontSize() / 2) >> 0))
            Game.b_ctx.restore()


        }
    }
})


