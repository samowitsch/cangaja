/**
 * @description
 *
 * CG.Particle
 *
 * @class CG.Particle
 * @extends CG.Sprite
 *
 */

CG.Sprite.extend('Particle', {
    /**
     * @constructor
     * @method init
     * @param image {mixed} image imgpath, image object or tpimage object to use for the particle
     */
    init:function (image) {
        this._super(image, new CG.Point(0, 0))
        /**
         * @property lifetime
         * @type {Number}
         */
        this.lifetime = 100
        /**
         * @property currtime
         * @type {Number}
         */
        this.currtime = this.lifetime
        /**
         * @property aging
         * @type {Number}
         */
        this.aging = 1
        /**
         * @property fadeout
         * @type {Boolean}
         */
        this.fadeout = false
        /**
         * @property alpha
         * @type {Number}
         */
        this.alpha = 1
        /**
         * @property gravity
         * @type {Number}
         */
        this.gravity = 0
    },
    update:function () {
        if (this.visible) {
            if (this.fadeout) {
                this.alpha = this.currtime / this.lifetime
                if (this.alpha <= 0) {
                    this.visible = false
                }
            }
            this.currtime -= this.aging
            if (this.currtime < 0) {
                this.visible = false
            }

            this.position.x += this.xspeed
            this.position.y += this.yspeed
            this.yspeed += this.gravity
            this.rotation += this.rotationspeed
        }
    },
    draw:function () {
        if (this.visible) {
            Game.b_ctx.save()
            Game.b_ctx.globalAlpha = this.alpha
            Game.b_ctx.translate(this.position.x, this.position.y)
            if (this.atlasimage) {
                Game.b_ctx.rotate((this.rotation - this.imagerotation) * CG.Const_PI_180)
                Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - (this.cutwidth / 2), 0 - (this.cutheight / 2), this.cutwidth * this.xscale, this.cutheight * this.yscale)
                Game.b_ctx.rotate((this.rotation + this.imagerotation) * CG.Const_PI_180)
            } else {
                Game.b_ctx.rotate(this.rotation * CG.Const_PI_180)
                Game.b_ctx.drawImage(this.image, 0 - (this.image.width * this.xscale / 2), 0 - (this.image.height * this.yscale / 2), this.image.width * this.xscale, this.image.height * this.yscale)
            }
            Game.b_ctx.restore()
        }
    }
})


