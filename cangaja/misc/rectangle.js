/**
 * @description
 *
 * CG.Rectangle for click and mouseover handling, collision detection and AABB function
 *
 * @class CG.Rectangle
 * @extends CG.Entity
 *
 */
CG.Entity.extend('Rectangle', {
    /**
     * @constructor
     * @method init
     * @param position {CG.Point} position point
     * @param width {Number} width the width of rectangle
     * @param height {Number} height the height of rectangle
     * @return {*}
     */
    init:function (position, width, height) {
        /**
         @property position {CG.Point}
         */
        this.position = position || new CG.Point(0, 0)
        /**
         @property width {Number}
         */
        this.width = width || 0
        /**
         @property height {Number}
         */
        this.height = height || 0
        /**
         @property clickable {boolean}
         */
        this.clickable = false
        /**
         @property dragable {boolean}
         */
        this.dragable = false
        /**
         @property rotation {Number}
         */
        this.rotation = 0
        /**
         @property xscale {Number}
         */
        this.xscale = 1
        /**
         @property yscale {Number}
         */
        this.yscale = 1
        /**
         @property clicked {boolean}
         */
        this.clicked = false
        /**
         @property hover {boolean}
         */
        this.hover = false

        /**
         @property boundingradius {Number}
         */
        this.boundingradius = 0     //radius for circular collision bounds
        /**
         @property mapcollision {boolean}
         */
        this.mapcollision = false

        return this
    },
    /**
     * @description returns the bounds of rotated rectangle
     * @method AABB
     * @return {object} returns the calculated bounds
     */
    AABB:function () {
        //http://willperone.net/Code/coderr.php
        a = this.rotation * CG.Const_PI_180
        s = Math.sin(a);
        c = Math.cos(a);
        if (s < 0) s = -s;
        if (c < 0) c = -c;
        return {
            bw:this.height * this.xscale * s + this.width * this.yscale * c,
            bh:this.height * this.xscale * c + this.width * this.yscale * s
        }
    },
    /**
     * @description checks click inside of the rectangle, supports rotation
     * @method ifClicked
     * @return {true/false}
     */
    ifClicked:function () {
        if (CG.mousedown && this.clickable) {
            var dx = CG.mouse.x - this.position.x,
                dy = CG.mouse.y - this.position.y
            var h1 = Math.sqrt(dx * dx + dy * dy)
            var currA = Math.atan2(dy, dx)
            var newA = currA - (this.rotation * CG.Const_PI_180);
            var x2 = Math.cos(newA) * h1
            var y2 = Math.sin(newA) * h1
            if (x2 > -0.5 * (this.width * this.xscale) &&
                x2 < 0.5 * (this.width * this.xscale) &&
                y2 > -0.5 * (this.height * this.yscale) &&
                y2 < 0.5 * (this.height * this.yscale)) {
                this.clicked = true
                CG.mousedown = false
            }
        }
        return false
    },
    /**
     * @description checks if the mouse/pointer is over the rectangle
     * @method ifMouseOver
     */
    ifMouseOver:function () {
        var dx = CG.mouse.x - this.position.x,
            dy = CG.mouse.y - this.position.y
        var h1 = Math.sqrt(dx * dx + dy * dy)
        var currA = Math.atan2(dy, dx)
        var newA = currA - (this.rotation * CG.Const_PI_180)
        var x2 = Math.cos(newA) * h1
        var y2 = Math.sin(newA) * h1
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
    checkCollision:function (objects, callback) {
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
                                        direction = 'CG.LEFT'
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
                                overlap:overlap,
                                direction:direction
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
                                    direction = 'CG.LEFT'
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
                            overlap:overlap,
                            direction:direction
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


