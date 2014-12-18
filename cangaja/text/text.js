/**
 * @description
 *
 * Future plans:
 * CG.Text => support for different text drawing modes like textblock, text alignment, text ticker or scroller.
 *
 ```

     var t = new CG.Text({
           font: abdi // the font object (CG.Font) to use
         })

 ```
 *
 * @class CG.Text
 * @extends CG.Entity
 */
CG.Entity.extend('Text', {
    /**
     * Options:
     * font {object}
     *
     * @method init
     * @param options
     * @constructor
     * @return {*}
     */

    init: function (options) {
        this.instanceOf = 'Text'

        CG._extend(this, {

            /**
             @property font {CG.Font}
             */

            /**
             * @property text {string}
             */
            text: '',

            /**
             * @property textcurrent {string}
             */
            textcurrent: '',

            /**
             * @property x {number} the x position
             */
            x: 0,

            /**
             * @property y {number} the y position
             */
            y: 0,

            /**
             * @property width {number} width of textbox
             */
            width: 0,

            /**
             * @property height {number} height of textbox
             */
            height: 0,

            /**
             * @property textAlign {string} alignment of text
             */
            textAlign: 'left' //left, right, centered
        })

        if (options) {
            CG._extend(this, options)
        }


        return this
    },
    initAsTextblock: function (font) {

        return this
    },
    initAsScroller: function () {

    },
    initAsTicker: function () {

    },
    /**
     * @method setText
     * @param text
     * @returns {*}
     */
    setText: function (text) {
        this.text = text
        return this
    },
    /**
     * @method update
     */
    update: function () {

    },
    /**
     * @method draw
     */
    draw: function () {

    }
})