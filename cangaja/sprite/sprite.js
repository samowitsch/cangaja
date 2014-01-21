/**
 * @description
 *
 * CG.Sprite
 *
 * @class CG.Sprite
 * @extends CG.Entity
 */
CG.Entity.extend('Sprite', {
    /**
     * @method init
     * @constructor
     * @param image {image}  imgpath, image object or atlasimage object to use
     * @param position {CG.Point}  position object
     * @return {*}
     */
    init:function (image, position) {
        this._super('', position)
        this.instanceOf = 'Sprite'

        /**
         @property atlasimage {boolean}
         */
        this.setImage(image)

        /**
         @property bound {CG.Bound}
         */
        this.bound = Game.bound     //global bounds of game
        /**
         @property diffpoint {CG.Point}
         */
        this.diffpoint = new CG.Point(this.bound.x, this.bound.y)  //store diffpoint if bound is moving

        /**
         @property xspeed {Number}
         */
        this.xspeed = 0 //xspeed of the sprite
        /**
         @property yspeed {Number}
         */
        this.yspeed = 0
        /**
         @property boundsMode {false/string}
         */
        this.boundsMode = false // false, bounce or slide
        /**
         @property rotationspeed {integer/float}
         */
        this.rotationspeed = 0
        /**
         @property alpha {float}
         */
        this.alpha = 1
        /**
         @property followobject {boolean/object}
         */
        this.followobject = false   //object to follow
        /**
         @property followspeed {boolean/integer}
         */
        this.followspeed = false    //followspeed for follower in pixel, has prio over followsteps
        /**
         @property followsteps {boolean/integer}
         */
        this.followsteps = false    //followsteps between follower and target

        /**
         @property attachedobject {boolean}
         */
        this.attachedobject = false //attached object
        /**
         @property offsetx {Number}
         */
        this.offsetx = 0            //offset x for attached object
        /**
         @property offsety {Number}
         */
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
        this.updateDiff()
        this.updateMatrix()
    },
    draw:function () {

        Game.renderer.draw(this);

    },

    /**
     * @description Checks the bound if a boundMode (bounce or slide) is set
     * @method checkBound
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
     * @method updateDiff
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
     * @method follow
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
     * @method setBound
     * @param bound {CG.Bound} the bound
     */
    setBound:function (bound) {
        this.bound = bound
        return this
    },


    /**
     * @description if there is a attached object get its position
     * @method ifAttached
     */
    ifAttached:function () {
        if (this.attachedobject != false) {
            this.attachedobject.position._x = this.attachedobject.position.x = (this.position.x + this.offsetx)
            this.attachedobject.position._y = this.attachedobject.position.y = (this.position.y + this.offsety)
        }
    },

    /**
     * @description attach a reference of the given object to this object
     * @method attachObject
     */
    attachObject:function (obj) {
        this.attachedobject = obj
        return this
    },

    /**
     * @description removes the attached object reference
     * @method removeAttachedObject
     */
    removeAttachedObject:function () {
        this.attachedobject = null
        return this
    },

    /**
     * @description set the x offset of the attached object to this object
     * @method setAttachedOffsetX
     */
    setAttachedOffsetX:function (offsetx) {
        this.offsetx = offsetx
        return this
    },

    /**
     * @description set the y offset of the attached object to this object
     * @method setAttachedOffsetY
     */
    setAttachedOffsetY:function (offsety) {
        this.offsety = offsety
        return this
    }
})



