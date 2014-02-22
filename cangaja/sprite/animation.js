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
     * startFrame {number}
     * endFrame {number}
     * width {number}
     * height {number}
     *
     @example
     var s = new CG.Animation({
           image: '../images/demo.png',
           position: new CG.Point(200,200),
           startFrame: 5,
           endFrame: 6,
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
        this._super(options)
        this.instanceOf = 'Animation'

        CG._extend(this, {
            /**
             @property loop {boolean}
             */
            loop: true,
            /**
             @property status {Number}
             */
            status: 0,
            /**
             @property currentFrame {Number}
             */
            currentFrame: 0,
            /**
             @property frames {Number}
             */
            frames: 0,
            /**
             @property startFrame {Number}
             */
            startFrame: 1,
            /**
             @property endFrame {Number}
             */
            endFrame: 1,
            /**
             @property fx {Number}
             */
            fx: 0,
            /**
             @property fy {Number}
             */
            fy: 0,
            /**
             @property delay {Number}
             */
            delay: 0,
            /**
             @property tempdelay {Number}
             */
            tempdelay: 0
        })


        if (options) {
            CG._extend(this, options)
//            this.setImage(this.image)
        }

        this.startFrame = this.startFrame - 1
        this.endFrame = this.endFrame - 1

        if (this.startFrame === undefined && this.endFrame === undefined) {
            this.frames = 1
            this.startFrame = 0
            this.endFrame = 0
        } else {
            this.currentFrame = this.startFrame - 1
            this.frames = this.endFrame - this.startFrame + 1
        }


        return this
    },
    update: function () {
        //animation specific stuff
        if (this.status == 0) {
            this.tempdelay += 1
            if (this.tempdelay >= this.delay) {
                this.tempdelay = 0
                if (this.frames > 1) {
                    this.currentFrame += 1
                    if ((this.currentFrame - this.startFrame) >= this.frames) {
                        if (this.loop === false) {
                            this.status = 1 //time to say good by, elements would be deleted at the moment
                        } else {
                            this.currentFrame = this.startFrame
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

