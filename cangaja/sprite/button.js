/**
 * @description
 *
 * CG.Button represents a simple button class that can handle click,
 * mouseover and callback functionality.
 *
```

var s = new CG.Button({
   image: '../images/demo.png', // the image for the button
   position: new CG.Point(200,200), // position of the button
   text: 'MyButton',  // optional text
   font: heiti,  // a font object when
   callbacks: {
     clicked: function () {
        // do something if the button is clicked
     },
     hover: function () {
        // do something on hover
     }
   }
 })

 ```
 *
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
            if (this.callbacks.clicked) {
                this.clicked = false
                this.callbacks.clicked.apply(this)
            }
        }
        if (this.hover) {
            if (this.callbacks.hover) {
                this.hover = false
                this.callbacks.hover.apply(this)
            }
        }
        this.updateDiff()
        this.updateMatrix()
    },
    draw: function () {
        if (this.visible == true) {

            Game.renderer.draw(this)

            if (this.text) {
                this.font.drawText(this.text, this.position.x - (this.font.getTextWidth(this.text) / 2 >> 0), this.position.y - ((this.font.getFontSize() / 2) >> 0))
            }
        }
    }
})


