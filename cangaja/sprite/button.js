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
     * Options:
     * image {string} imgpath, image object or atlasimage object to use
     * position {CG.Point}
     * text {string}
     * font {CG.Font}
     * callback {function}
     *
     @example
     var s = new CG.Button({
           image: '../images/demo.png',
           position: new CG.Point(200,200),
           text: 'MyButton',
           font: heiti,
           callback: callbackFunction
         })
     *
     *
     * @method init
     * @constructor
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        this._super()
        this.instanceOf = 'Button'

        if (options) {
            CG._extend(this, options)
            this.setImage(this.image)
        }

        /**
         @property font {CG.Font}
         */
        /**
         @property text {string}
         */
        /**
         @property callback {callback}
         */
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
            if (this.callback) {
                this.clicked = false
                this.callback(this)
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


