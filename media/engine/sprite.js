/**
 * @description the Sprite class
 *
 * @constructor
 * @auguments Rectangle
 *
 * @param {string, image, tpimage} imgpath, image object or tpimage object to use
 * @param {point} position object
 */
CG.Rectangle.extend('Sprite', {
    init:function (image, position) {
        this._super(position, 0, 0)

        this.atlasimage = false
        this.setImage(image)

        this.bound = Game.bound     //global bounds of game
        this.diffpoint = new CG.Point(this.bound.x, this.bound.y)  //store diffpoint if bound is moving

        //    this.x = x
        this.xspeed = 0
        this.xscale = 1
        this.xhandle = 0
        //    this.y = y
        this.yspeed = 0
        this.yscale = 1
        this.yhandle = 0
        this.boundsMode = false // false, bounce or slide
        this.rotation = 0
        this.rotationspeed = 0
        this.alpha = 1
        this.clicked = false

        this.followobject = false   //object to follow
        this.followspeed = false    //followspeed for follower in pixel, has prio ober followsteps
        this.followsteps = false    //followsteps between follower and target

        this.attachedobject = false //attached object
        this.offsetx = 0            //offset x for attached object
        this.offsety = 0            //offset y for attached object
        return this
    },
    update:function () {
        this.ifClicked()
        this.ifMouseOver()
        this.ifAttached()

        if (this.followobject) {
            this.follow()
        }

        this.position.x += this.xspeed
        this.position.y += this.yspeed
        this.rotation += this.rotationspeed
        this.xhandle = (this.width * this.xscale / 2)
        this.yhandle = (this.height * this.yscale / 2)

        if (this.boundsMode) {
            this.checkBound()
        }
    },
    draw:function () {
        this.updateDiff()

        Game.b_ctx.save()
        Game.b_ctx.globalAlpha = this.alpha
        Game.b_ctx.translate(this.position.x, this.position.y)
        if (this.atlasimage) {
            Game.b_ctx.rotate((this.rotation - this.imagerotation) * CG.Const_PI_180)
            Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - this.xhandle, 0 - this.yhandle, this.cutwidth * this.xscale, this.cutheight * this.yscale)
        } else {
            Game.b_ctx.rotate(this.rotation * CG.Const_PI_180)
            Game.b_ctx.drawImage(this.image, 0 - this.xhandle, 0 - this.yhandle, this.image.width * this.xscale, this.image.height * this.yscale)
        }
        Game.b_ctx.restore()
    },

    /**
     * Checks the bound if a boundMode (bounce or slide) is set
     */
    checkBound:function () {
        switch (this.boundsMode) {
            case 'bounce':
                if (this.position.x > ( this.bound.width - this.xhandle + this.bound.x )) {
                    this.position.x = this.bound.width - this.xhandle + this.bound.x
                    this.xspeed = this.xspeed * -1
                }
                else if (this.position.x < this.bound.x + this.xhandle) {
                    this.position.x = this.bound.x + this.xhandle
                    this.xspeed = this.xspeed * -1
                }
                if (this.position.y > ( this.bound.height - this.yhandle + this.bound.y )) {
                    this.position.y = this.bound.height - this.yhandle + this.bound.y
                    this.yspeed = this.yspeed * -1
                }
                else if (this.position.y < this.bound.y + this.yhandle) {
                    this.position.y = this.bound.y + this.yhandle
                    this.yspeed = this.yspeed * -1
                }
                break
            case 'slide':
                if (this.position.x > ( this.bound.width + this.xhandle + this.bound.x )) {
                    this.position.x = ( this.bound.x - this.xhandle )
                }
                else if (this.position.x < this.bound.x - this.xhandle) {
                    this.position.x = this.bound.x + this.bound.width + this.xhandle
                }
                if (this.position.y > (this.bound.height + this.yhandle + this.bound.y)) {
                    this.position.y = (this.bound.y - this.yhandle)
                }
                else if (this.position.y < this.bound.y - this.yhandle) {
                    this.position.y = this.bound.height + this.yhandle + this.bound.y
                }
                break
            default:
                break
        }
    },

    /**
     * @description calculate offset if bound is moving
     */
    updateDiff:function () {
        if (this.diffpoint.x !== this.bound.x) {
            this.position.x += this.bound.x - this.diffpoint.x
        }
        if (this.diffpoint.y !== this.bound.y) {
            this.position.y += this.bound.y - this.diffpoint.y
        }
        this.diffpoint.x = this.bound.x
        this.diffpoint.y = this.bound.y
    },
    /**
     * @description is there an attached element, this sprite will follow it depending on followspeed or followsteps it follows different
     */
    follow:function () {
        if (this.followspeed) {
            //constant follow speed between objects
            angl = Math.atan2(this.followobject.position.x - this.position.x, this.followobject.position.y - this.position.y) * CG.Const_180_PI
            xs = this.followspeed * Math.sin(angl * CG.Const_PI_180)
            ys = this.followspeed * Math.cos(angl * CG.Const_PI_180)

            this.xspeed = xs
            this.yspeed = ys
            this.rotation = angl * -1

        } else if (this.followsteps) {
            //constant steps between objetcs
            angl = Math.atan2(this.followobject.position.x - this.position.x, this.followobject.position.y - this.position.y) * CG.Const_180_PI
            this.rotation = angl * -1
            if (this.followobject.position.x != this.position.x) {
                distx = this.followobject.position.x - this.position.x
                this.xspeed = distx / this.followsteps //>> 0
            } else {
                this.xspeed = 0
            }
            if (this.followobject.position.y != this.position.y) {
                disty = this.followobject.position.y - this.position.y
                this.yspeed = disty / this.followsteps //>> 0
            } else {
                this.yspeed = 0
            }
        }
    },

    /**
     * @description set the bound of the sprite
     *
     * @param {bound} bound the bound
     */
    setBound:function (bound) {
        this.bound = bound
        return this
    },


    /**
     * @description if there is a attached object get its position
     */
    ifAttached:function () {
        if (this.attachedobject != false) {
            this.attachedobject.position._x = this.attachedobject.position.x = (this.position.x + this.offsetx)
            this.attachedobject.position._y = this.attachedobject.position.y = (this.position.y + this.offsety)
        }
    },

    /**
     * @description attach a reference of the given object to this object
     */
    attachObject:function (obj) {
        this.attachedobject = obj
        return this
    },

    /**
     * @description removes the attached object reference
     */
    removeAttachedObject:function () {
        this.attachedobject = false
        return this
    },

    /**
     * @description set the x offset of the attached object to this object
     */
    setAttachedOffsetX:function (offsetx) {
        this.offsetx = offsetx
        return this
    },

    /**
     * @description set the y offset of the attached object to this object
     */
    setAttachedOffsetY:function (offsety) {
        this.offsety = offsety
        return this
    }
})



