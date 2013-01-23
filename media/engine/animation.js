/**
 * @description Class Animation extends class Sprite and add support for animation ;o) needs atlas files with fixed framesizes and with following animation frames
 *
 * @constructor
 * @augments Sprite
 *
 * @param {string, image} image imagepath or image object
 * @param {point} position object
 * @param {number} startframe startframe of atlas image
 * @param {number} endframe endframe of atlas image
 * @param {number} framewidth width of frame to cut
 * @param {number} frameheight height of frame to cut
 */
CG.Sprite.extend('Animation', {
    init: function (image, position, startframe, endframe, framewidth, frameheight) {
        this._super(image, position)

        //from asset?
        if ( typeof image == 'string' )
        {
            this.image = new Image()
            this.image.src = image
        } else {
            this.image = image
        }

        this.loop = true
        this.status = 0

        this.currentframe = 0
        this.startframe = startframe - 1
        this.endframe = endframe - 1
        this.width = framewidth
        this.height = frameheight

        if ( this.startframe === undefined && this.endframe === undefined )
        {
            this.frames = 1
            this.startframe = 0
            this.endframe = 0
        } else {
            this.currentframe = this.startframe - 1
            this.frames = this.endframe - this.startframe + 1
        }

        this.fx = 0
        this.fy = 0

        this.delay = 0
        this.tempdelay = 0

        return this
    },
    update: function() {
        //animation specific stuff
        if ( this.status == 0 )
        {
            this.tempdelay += 1
            if ( this.tempdelay >= this.delay )
            {
                this.tempdelay = 0
                if ( this.frames > 1 )
                {
                    this.currentframe += 1
                    if ( (this.currentframe - this.startframe) >= this.frames )
                    {
                        if ( this.loop === false )
                        {
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
    draw: function() {
        this.updateDiff()

        Game.b_ctx.save()
        Game.b_ctx.globalAlpha = this.alpha
        Game.b_ctx.translate(this.position.x, this.position.y)
        if ( this.frames == 1 )
        {
            Game.b_ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.xscale, this.image.height * this.yscale)
        }
        else
        {
            this.fx = this.currentframe * this.width

            if ( (this.fx / this.image.width) > 0 )
            {
                this.fx = this.fx % this.image.width
            }
            this.fy = Math.floor(this.width * this.currentframe / this.image.width) * this.height

            Game.b_ctx.rotate(this.rotation * Const_PI_180)
            try {
                Game.b_ctx.drawImage(this.image, this.fx, this.fy, this.width, this.height, 0 - this.xhandle, 0 - this.yhandle, this.width * this.xscale, this.height * this.yscale)
            } catch (e) {

            }
        }
        Game.b_ctx.restore()
    }
})

