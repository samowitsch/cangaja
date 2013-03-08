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
     * @constructor
     * @method init
     * @param image {string, image} image imagepath or image object
     * @param position {point} position object
     * @param startframe {number} startframe startframe of atlas image
     * @param endframe {number} endframe endframe of atlas image
     * @param framewidth {number} framewidth width of frame to cut
     * @param frameheight {number} frameheight height of frame to cut
     * @return {*}
     */
    init:function (image, position, startframe, endframe, framewidth, frameheight) {
        this._super(image, position)

        //from asset?
        if (typeof image == 'string') {
            this.image = new Image()
            this.image.src = image
        } else {
            this.image = image
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
        this.startframe = startframe - 1
        /**
         @property endframe {Number}
         */
        this.endframe = endframe - 1
        /**
         @property width {Number}
         */
        this.width = framewidth
        /**
         @property height {Number}
         */
        this.height = frameheight

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
    update:function () {
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
    draw:function () {
        this.updateDiff()

        Game.b_ctx.save()
        Game.b_ctx.globalAlpha = this.alpha
        Game.b_ctx.translate(this.position.x, this.position.y)
        if (this.frames == 1) {
            Game.b_ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.xscale, this.image.height * this.yscale)
        }
        else {
            this.fx = this.currentframe * this.width

            if ((this.fx / this.image.width) > 0) {
                this.fx = this.fx % this.image.width
            }
            this.fy = Math.floor(this.width * this.currentframe / this.image.width) * this.height

            Game.b_ctx.rotate(this.rotation * CG.Const_PI_180)
            try {
                Game.b_ctx.drawImage(this.image, this.fx, this.fy, this.width, this.height, 0 - this.xhandle, 0 - this.yhandle, this.width * this.xscale, this.height * this.yscale)
            } catch (e) {

            }
        }
        Game.b_ctx.restore()
    }
})

