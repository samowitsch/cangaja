/**
 * @description class Rectangle for click and mouseover handling, collision detection and AABB function
 *
 * @constructor
 * @augments Entity
 *
 * @param {point} position point
 * @param {integer} width the width of rectangle
 * @param {integer} height the height of rectangle
 */
CG.Entity.extend('Rectangle', {
    init: function (position, width, height) {
        this.position = position || new CG.Point(0, 0)
        this.width = width || 0
        this.height = height || 0
        this.clickable = false
        this.dragable = false
        this.rotation = 0
        this.xscale = 1
        this.yscale = 1
        this.clicked = false
        this.hover = false

        this.boundingradius = 0     //radius for circular collision bounds
        this.mapcollision = false

        return this
    },
    /**
    * @description returns the bounds of rotated rectangle
    *
    * @return {object} returns the calculated bounds
    */
    AABB: function() {
        //http://willperone.net/Code/coderr.php
        a = this.rotation * Const_PI_180
        s = Math.sin(a);
        c = Math.cos(a);
        if (s < 0) s = -s;
        if (c < 0) c = -c;
        return {
            bw: this.height * this.xscale * s + this.width * this.yscale * c,
            bh: this.height * this.xscale * c + this.width * this.yscale * s
        }
    },
    /**
    * @description checks click inside of the rectangle, supports rotation
    *
    * @return {true/false}
    */
    ifClicked: function() {
        if ( mousedown && this.clickable )
        {
            var dx = mousex - this.position.x,
            dy = mousey - this.position.y
            var h1 = Math.sqrt(dx * dx + dy * dy)
            var currA = Math.atan2(dy, dx)
            var newA = currA - (this.rotation * Const_PI_180);
            var x2 = Math.cos(newA) * h1
            var y2 = Math.sin(newA) * h1
            if ( x2 > -0.5 * (this.width * this.xscale) &&
                x2 < 0.5 * (this.width * this.xscale) &&
                y2 > -0.5 * (this.height * this.yscale) &&
                y2 < 0.5 * (this.height * this.yscale) )
                {
                this.clicked = true
                mousedown = false
            }
        }
        return false
    },
    /**
    * @description checks if the mouse/pointer is over the rectangle
    */
    ifMouseOver: function() {
        var dx = mousex - this.position.x,
        dy = mousey - this.position.y
        var h1 = Math.sqrt(dx * dx + dy * dy)
        var currA = Math.atan2(dy, dx)
        var newA = currA - (this.rotation * Const_PI_180)
        var x2 = Math.cos(newA) * h1
        var y2 = Math.sin(newA) * h1
        if ( x2 > -0.5 * (this.width * this.xscale) &&
            x2 < 0.5 * (this.width * this.xscale) &&
            y2 > -0.5 * (this.height * this.yscale) &&
            y2 < 0.5 * (this.height * this.yscale) )
            {
            this.hover = true
        } else {
            this.hover = false
        }
    },
    /**
    * @description checks if there is a collision of the given objects to this object http://devmag.org.za/2009/04/13/basic-collision-detection-in-2d-part-1/
    *
    * @param {array} objects a array of objects to check for collision
    * @param {callback} callback what to do after collision?
    */
    checkCollision: function(objects, callback){
        objects.forEach(function(obj, index) {
            if ( this.boundingradius > 0 && obj.boundingradius > 0 )
            {
                //check boundingradius for circuar collision
                distx = this.position.x - obj.position.x
                disty = this.position.y - obj.position.y
                dist = Math.sqrt((distx * distx)+(disty*disty))
                if(dist <= (this.boundingradius / 2 * this.xscale + obj.boundingradius / 2 * obj.yscale)){
                    callback(this, obj)
                }
            } else {
                //if boundingradius is 0, fallback to bounding collision
                if ( (this.position.y + this.AABB().bh/2) >= obj.position.y - obj.AABB().bh/2 &&
                    this.position.y - this.AABB().bh/2 <= (obj.position.y + obj.AABB().bh/2) &&
                    (this.position.x + this.AABB().bw/2) >= obj.position.x - obj.AABB().bw/2 &&
                    this.position.x - this.AABB().bw/2 <= (obj.position.x + obj.AABB().bw/2) )
                    {
                    callback(this, obj)
                }

            }
        }, this)
    }

})