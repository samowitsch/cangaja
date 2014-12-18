/**
 * @description
 *
 * CG.Particle
 *
 ```

     var s = new CG.Particle({
           image: '../images/demo.png'
         })

 ```
 *
 * @class CG.Particle
 * @extends CG.Sprite
 *
 */

CG.Sprite.extend('Particle', {
    /**
     * Options:
     * image {string} imgpath, image object or atlasimage object to use
     *
     * @constructor
     * @method init
     * @param image {mixed} image imgpath, image object or atlasimage object to use for the particle
     */
    init: function (options) {
        this._super()
        this.instanceOf = 'Particle'

        CG._extend(this, {

            /**
             * @property position
             * @type {CG.Point}
             */
            position: new CG.Point(0, 0),
            /**
             * @property lifetime
             * @type {Number}
             */
            lifetime: 100,
            /**
             * @property currtime
             * @type {Number}
             */
            currtime: this.lifetime,
            /**
             * @property aging
             * @type {Number}
             */
            aging: 1,
            /**
             * @property fadeout
             * @type {Boolean}
             */
            fadeout: false,
            /**
             * @property gravity
             * @type {Number}
             */
            gravity: 0
        })

        if (options) {
            CG._extend(this, options)
            this.setImage(this.image)
        }

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

            this.updateDiff()
            this.updateMatrix()
        }
    },
    draw: function () {
        if (this.visible) {

            Game.renderer.draw(this)

        }
    }
})


