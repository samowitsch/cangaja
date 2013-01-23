/**
 * @description button class, can handle click and mouseover.
 * 
 * @constructor
 * @augments Sprite
 *
 * @param {string, image, tpimage} imgpath, image object or tpimage object to use
 * @param {point} position object
 * @param {string} text the text for the button label
 * @param {Font} font Font object for text drawing
 * @param {callback} callback callback function for click event
 */
CG.Sprite.extend('Button', {
    init: function (image, position, text, font, clickedCallback) {
        this._super(image, position)

        this.font = font
        this.clickedCallback = clickedCallback
        this.clicked = false
        this.clickable = true

        this.text = text
        return this
    },
    update: function() {
        this.ifClicked()
        this.ifMouseOver()
        this.ifAttached()

        if ( this.clicked )
        {
            if ( this.clickedCallback )
            {
                this.clicked = false
                this.clickedCallback(this)
            }
        }
    },
    draw: function() {
        Game.b_ctx.save()
        Game.b_ctx.translate(this.position.x, this.position.y)
        if ( this.atlasimage )
        {
            var r = this.rotation
            Game.b_ctx.rotate((r - this.imagerotation) * Const_PI_180)
            Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - (this.cutwidth / 2), 0 - (this.cutheight / 2), this.cutwidth * this.xscale, this.cutheight * this.yscale)
            Game.b_ctx.rotate(this.imagerotation * Const_PI_180)
        } else {
            Game.b_ctx.rotate(r * Const_PI_180)
            Game.b_ctx.drawImage(this.image, 0 - (this.image.width * this.xscale / 2), 0 - (this.image.height * this.yscale / 2), this.image.width * this.xscale, this.image.height * this.yscale)
        }
        this.font.draw(this.text, 0 - (this.font.getLength(this.text) / 2 >> 0), 0 - ((this.font.getFontSize() / 2) >> 0))
        Game.b_ctx.restore()
    }
})