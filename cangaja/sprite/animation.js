/**
 * @description
 *
 * CG.Animation extends CG.Sprite and add support for animations ;o) It needs atlas files with fixed framesizes and with following animation frames.
 * For example you can use Timeline FX generated graphics.
 *
 * @class CG.Animation
 * @extends CG.Sprite
 */
CG.Sprite.extend('Animation', {
    /**
     * Options:
     * image {string} imgpath, image object or atlasimage object to use
     * position {CG.Point}
     * startframe {number}
     * endframe {number}
     * width {number}
     * height {number}
     *
     @example
     var s = new CG.Animation({
           image: '../images/demo.png',
           position: new CG.Point(200,200),
           startframe: 5,
           endframe: 6,
           width: 10,
           height: 20
         })
     *
     * @constructor
     * @method init
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        this._super()
        this.instanceOf = 'Animation'

        if (options) {
            CG._extend(this, options)
//            this.setImage(this.image)
        }

        /**
         @property loop {boolean}
         */
        this.loop = true
        /**
         @property status {Number}
         */
        this.status = 0
        /**
         @property currentframe {Number}
         */
        this.currentframe = 0
        /**
         @property frames {Number}
         */
        this.frames = 0
        /**
         @property startframe {Number}
         */
        this.startframe = this.startframe - 1
        /**
         @property endframe {Number}
         */
        this.endframe = this.endframe - 1
        /**
         @property width {Number}
         */
        /**
         @property height {Number}
         */

        if (this.startframe === undefined && this.endframe === undefined) {
            this.frames = 1
            this.startframe = 0
            this.endframe = 0
        } else {
            this.currentframe = this.startframe - 1
            this.frames = this.endframe - this.startframe + 1
        }

        /**
         @property fx {Number}
         */
        this.fx = 0
        /**
         @property fy {Number}
         */
        this.fy = 0

        /**
         @property delay {Number}
         */
        this.delay = 0
        /**
         @property tempdelay {Number}
         */
        this.tempdelay = 0

        return this
    },
    update: function () {
        //animation specific stuff
        if (this.status == 0) {
            this.tempdelay += 1
            if (this.tempdelay >= this.delay) {
                this.tempdelay = 0
                if (this.frames > 1) {
                    this.currentframe += 1
                    if ((this.currentframe - this.startframe) >= this.frames) {
                        if (this.loop === false) {
                            this.status = 1 //time to say good by, elements would be deleted at the moment
                        } else {
                            this.currentframe = this.startframe
                        }
                    }
                }
            }
        }
        //update all other stuff in the parent class
        this._super()
    },
    draw: function () {

        Game.renderer.draw(this)

    }
})

