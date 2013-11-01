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

        if (this.clicked) {
            if (this.clickedCallback) {
                this.clicked = false
                this.clickedCallback(this)
            }
        }
    },
    draw: function () {
        if (this.visible == true) {
            Game.b_ctx.save()
            Game.b_ctx.translate(this.position.x, this.position.y)
            if (this.atlasimage) {
                var r = this.rotation
                Game.b_ctx.rotate((r - this.imagerotation) * CG.Const_PI_180)
                Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - (this.cutwidth / 2), 0 - (this.cutheight / 2), this.cutwidth * this.xscale, this.cutheight * this.yscale)
                Game.b_ctx.rotate(this.imagerotation * CG.Const_PI_180)
            } else {
                Game.b_ctx.rotate(r * CG.Const_PI_180)
                Game.b_ctx.drawImage(this.image, 0 - (this.image.width * this.xscale / 2), 0 - (this.image.height * this.yscale / 2), this.image.width * this.xscale, this.image.height * this.yscale)
            }
            this.font.drawText(this.text, 0 - (this.font.getTextWidth(this.text) / 2 >> 0), 0 - ((this.font.getFontSize() / 2) >> 0))
            Game.b_ctx.restore()
        }
    }
})


