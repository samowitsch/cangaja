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
     * @param image {mixed} image imgpath, image object or atlasimage object to use for the particle
     */
    init: function (image) {
        this._super(image, new CG.Point(0, 0))
        this.instanceOf = 'Particle'
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
         * @property gravity
         * @type {Number}
         */
        this.gravity = 0
    },
    update: function () {
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
            this.xhandle = (this.width * this.xscale / 2)
            this.yhandle = (this.height * this.yscale / 2)

            this.updateMatrix()
        }
    },
    draw: function () {
        if (this.visible) {

            Game.renderer.draw(this)

        }
    }
})


