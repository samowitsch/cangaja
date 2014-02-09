/**
 * @description
 *
 * CG.Entity the base class of Cangaja
 *
 * @class CG.Entity
 * @extends CG.Class
 */

CG.Class.extend('Entity', {
    /**
     * Options:
     * name {string}
     * position {CG.Point}
     *
     @example
        var e = new CG.Entity({
           name: 'player',
           position: new CG.Point(100,100)
         })
     *
     * @constructor
     * @method init
     * @param options {Object} the name of the Entity
     */
    init: function (options) {

        CG._extend(this, {
            name: '',
            position: new CG.Point(0, 0),
            /**
             @description visibility option
             @property visible {boolean}
             */
            visible: true,
            /**
             @description Transform object for matrix transformation
             @property transform {Transform}
             */
            transform: new Transform(),
            /**
             @property width {Number}
             */
            width: 0,
            /**
             @property height {Number}
             */
            height: 0,
            /**
             @property dragable {boolean}
             */
            dragable: true,
            /**
             @property rotation {Number}
             */
            rotation: 0,
            /**
             @property xscale {Number}
             */
            xscale: 1,
            /**
             @property xhandle {Number}
             */
            xhandle: 0,
            /**
             @property yscale {Number}
             */
            yscale: 1,
            /**
             @property yhandle {Number}
             */
            yhandle: 0,
            /**
             @property hover {boolean}
             */
            hover: false,
            /**
             @property boundingradius {Number}
             */
            boundingradius: 0,     //radius for circular collision bounds
            /**
             @property mapcollision {boolean}
             */
            mapcollision: false
        })

        if (options) {
            CG._extend(this, options)
        }
        return this
    },
    update: function () {
    },
    updateMatrix: function () {
        this.transform.reset()
        this.transform.translate(this.position.x, this.position.y)
        this.transform.rotate(this.rotation * CG.Const_PI_180)
        this.transform.scale(this.xscale, this.yscale)
    },
    draw: function () {
        throw {
            name: 'Entity Error',
            message: 'Subclass has no draw method.'
        }
    },
    /**
     * @description initialize image for object. for now => sprite, particle, buffer, bitmap and button use it
     * @method setImage
     * @param {image} image image path, image or atlasimage
     */
    setImage: function (image) {
        this.atlasimage = false
        if (image) {
            if (image instanceof CG.AtlasImage) {
                //AtlasImage from MediaAsset
                this.image = Game.asset.getImageByName(image.atlasname)
                this.imagerotation = image.rotation //|| 0
                this.xoffset = image.xoffset
                this.yoffset = image.yoffset
                this.width = image.width
                this.height = image.height
                this.atlasimage = true
                if (this.imagerotation !== 0) {
                    this.cutwidth = image.height
                    this.cutheight = image.width
                    this.xhandle = this.height / 2
                    this.yhandle = this.width / 2
                } else {
                    this.cutwidth = image.width
                    this.cutheight = image.height
                    this.xhandle = this.width / 2
                    this.yhandle = this.height / 2
                }
            } else if (typeof image == 'string' && image != '') {
                //path to image
                this.image = new Image()
                this.image.src = image
                this.image.onload = function () {
                    this.width = this.image.width
                    this.height = this.image.height
                    this.xhandle = this.width / 2
                    this.yhandle = this.height / 2
                }
            } else {
                //image from MediaAsset
                this.image = image
                this.width = this.image.width
                this.height = this.image.height
                this.xhandle = this.width / 2
                this.yhandle = this.height / 2
            }
        }
    },
    /**
     * @description returns the bounds of rotated rectangle
     * @method AABB
     * @return {object} returns the calculated bounds
     */
    AABB: function () {
        //http://willperone.net/Code/coderr.php
        var a = this.rotation * CG.Const_PI_180,
            s = Math.sin(a),
            c = Math.cos(a)

        if (s < 0) s = -s
        if (c < 0) c = -c
        return {
            bw: this.height * this.xscale * s + this.width * this.yscale * c,
            bh: this.height * this.xscale * c + this.width * this.yscale * s
        }
    },
    /**
     * @description checks click inside of the rectangle, supports rotation
     * @method ifClicked
     * @return {true/false}
     */
    ifClicked: function () {
        if (CG.mousedown && this.clickable) {
            var dx = CG.mouse.x - this.position.x,
                dy = CG.mouse.y - this.position.y,
                h1 = Math.sqrt(dx * dx + dy * dy),
                currA = Math.atan2(dy, dx),
                newA = currA - (this.rotation * CG.Const_PI_180),
                x2 = Math.cos(newA) * h1,
                y2 = Math.sin(newA) * h1

            if (x2 > -0.5 * (this.width * this.xscale) &&
                x2 < 0.5 * (this.width * this.xscale) &&
                y2 > -0.5 * (this.height * this.yscale) &&
                y2 < 0.5 * (this.height * this.yscale)) {
                this.clicked = true
                CG.mousedown = false
            } else {
                this.clicked = false
            }
        }
    },
    /**
     * @description checks if the mouse/pointer is over the rectangle
     * @method ifMouseOver
     */
    ifMouseOver: function () {
        var dx = CG.mouse.x - this.position.x,
            dy = CG.mouse.y - this.position.y,
            h1 = Math.sqrt(dx * dx + dy * dy),
            currA = Math.atan2(dy, dx),
            newA = currA - (this.rotation * CG.Const_PI_180),
            x2 = Math.cos(newA) * h1,
            y2 = Math.sin(newA) * h1

        if (x2 > -0.5 * (this.width * this.xscale) &&
            x2 < 0.5 * (this.width * this.xscale) &&
            y2 > -0.5 * (this.height * this.yscale) &&
            y2 < 0.5 * (this.height * this.yscale)) {
            this.hover = true
        } else {
            this.hover = false
        }
    },
    /**
     * @description checks if there is a collision of the given objects to this object http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/
     * @method checkCollision
     * @param objects {array} a array of objects to check for collision => Sprites, Animations, MapAreas
     * @param callback {callback} what to do after collision?
     */
    checkCollision: function (objects, callback) {
        objects.forEach(function (obj, index) {
                if (obj.className == 'MapArea') {
                    if ((this.position.y + this.AABB().bh / 2) >= obj.bound.y &&
                        this.position.y - this.AABB().bh / 2 <= (obj.bound.y + obj.bound.height) &&
                        (this.position.x + this.AABB().bw / 2) >= obj.bound.x &&
                        this.position.x - this.AABB().bw / 2 <= (obj.bound.x + obj.bound.width )) {
                        if (obj.type === 'outer') {

                            w = 0.5 * (this.width + obj.bound.width)
                            h = 0.5 * (this.height + obj.bound.height)
                            dx = this.position.x - (obj.bound.width / 2 + obj.bound.x)
                            dy = this.position.y - (obj.bound.height / 2 + obj.bound.y)

                            if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
                                /* collision! */
                                wy = w * dy;
                                hx = h * dx;

                                if (wy > hx) {
                                    if (wy > -hx) {
                                        direction = 'bottom'
                                        overlap = ((this.position.y - this.AABB().bh / 2) - (obj.bound.y + obj.bound.height)) >> 0
                                    } else {
                                        direction = 'left'
                                        overlap = ((this.position.x + this.AABB().bw / 2) - obj.bound.x) >> 0
                                    }
                                } else {
                                    if (wy > -hx) {
                                        direction = 'right'
                                        overlap = ((this.position.x - this.AABB().bw / 2) - (obj.bound.x + obj.bound.width)) >> 0
                                    } else {
                                        direction = 'top'
                                        overlap = ((this.position.y + this.AABB().bh / 2) - obj.bound.y) >> 0
                                    }
                                }
                            }

                            collision = {
                                overlap: overlap,
                                direction: direction
                            }
                            //callback arguments: this => the sprite, obj => the maparea if needed, collision => {collison direction, offset}
                            callback(this, obj, collision)
                        }
                    }
                }
                else if (this.boundingradius > 0 && obj.boundingradius > 0) {
                    //check boundingradius for circuar collision
                    distx = this.position.x - obj.position.x
                    disty = this.position.y - obj.position.y
                    dist = Math.sqrt((distx * distx) + (disty * disty))
                    if (dist <= (this.boundingradius / 2 * this.xscale + obj.boundingradius / 2 * obj.yscale)) {
                        collision = false //dummy
                        callback(this, obj, collision)
                    }
                }
                else {
                    //if boundingradius is 0, fallback to bounding collision
                    if ((this.position.y + this.AABB().bh / 2) >= obj.position.y - obj.AABB().bh / 2 &&
                        this.position.y - this.AABB().bh / 2 <= (obj.position.y + obj.AABB().bh / 2) &&
                        (this.position.x + this.AABB().bw / 2) >= obj.position.x - obj.AABB().bw / 2 &&
                        this.position.x - this.AABB().bw / 2 <= (obj.position.x + obj.AABB().bw / 2)) {

                        w = 0.5 * (this.width + obj.width)
                        h = 0.5 * (this.height + obj.height)
                        dx = this.position.x - obj.position.x
                        dy = this.position.y - obj.position.y

                        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
                            /* collision! */
                            wy = w * dy;
                            hx = h * dx;

                            if (wy > hx) {
                                if (wy > -hx) {
                                    direction = 'bottom'
                                    overlap = ((this.position.y - this.AABB().bh / 2) - (obj.position.y - obj.AABB().bh / 2)) >> 0
                                } else {
                                    direction = 'left'
                                    overlap = ((this.position.x + this.AABB().bw / 2) - (obj.position.x + obj.AABB().bw / 2)) >> 0
                                }
                            } else {
                                if (wy > -hx) {
                                    direction = 'right'
                                    overlap = ((this.position.x - this.AABB().bw / 2) - (obj.position.x - obj.AABB().bw / 2)) >> 0
                                } else {
                                    direction = 'top'
                                    overlap = ((this.position.y + this.AABB().bh / 2) - (obj.position.y + obj.AABB().bh / 2)) >> 0
                                }
                            }
                        }

                        collision = {
                            overlap: overlap,
                            direction: direction
                        }

                        callback(this, obj, collision)
                    }
                }
            },
            this
        )
        return this
    }
})


