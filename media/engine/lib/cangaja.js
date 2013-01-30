var CG = CG || {
    VERSION:1,

    //constants
    Const_PI_180: Math.PI / 180,
    Const_180_PI: 180 / Math.PI,
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4
};


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik M??ller
// fixes from Paul Irish and Tino Zijdel

    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * Inspired by base2 and Prototype
 */
(function () {
    var initializing = false,
        fnTest = /xyz/.test(function () {
            var xyz;
        }) ? /\b_super\b/ : /.*/;
    /* The base Class implementation (does nothing) */
    CG.Class = function () {
    };

    // See if a object is a specific class
    CG.Class.prototype.isA = function (className) {
        return this.className === className;
    };

    /* Create a new Class that inherits from this class */
    CG.Class.extend = function (className, prop, classMethods) {
        /* No name, don't add onto Q */
        if (!typeof className === "string") {
            classMethods = prop;
            prop = className;
            className = null;
        }
        var _super = this.prototype,
            ThisClass = this;

        /* Instantiate a base class (but only create the instance, */
        /* don't run the init constructor) */
        initializing = true;
        var prototype = new ThisClass();
        initializing = false;

        function _superFactory(name, fn) {
            return function () {
                var tmp = this._super;

                /* Add a new ._super() method that is the same method */
                /* but on the super-class */
                this._super = _super[name];

                /* The method only need to be bound temporarily, so we */
                /* remove it when we're done executing */
                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
            };
        }

        /* Copy the properties over onto the new prototype */
        for (var name in prop) {
            /* Check if we're overwriting an existing function */
            prototype[name] = typeof prop[name] === "function" &&
                typeof _super[name] === "function" &&
                fnTest.test(prop[name]) ?
                _superFactory(name, prop[name]) :
                prop[name];
        }

        /* The dummy class constructor */
        function Class() {
            /* All construction is actually done in the init method */
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        /* Populate our constructed prototype object */
        Class.prototype = prototype;

        /* Enforce the constructor to be what we expect */
        Class.prototype.constructor = Class;
        /* And make this class extendable */
        Class.extend = CG.Class.extend;

        /* If there are class-level Methods, add them to the class */
        if (classMethods) {
            CG._extend(Class, classMethods);
        }

        if (className) {
            /* Save the class onto Q */
            CG[className] = Class;

            /* Let the class know its name */
            Class.prototype.className = className;
            Class.className = className;
        }

        return Class;
    };
}())


////Class example, how to start from scratch
//CG.Class.extend("Entity",{
//    init: function(){
//        this.myprop = 'set from constructor'
//    }
//});
//
//
////Class example, how to start from scratch
//CG.Entity.extend("Point",{
//    init: function(x, y){
//        this._super()
//        this.x = x
//        this.y = y
//    }
//});
//
//
////Class example, how to start from scratch
//CG.Point.extend("Rectangle",{
//    init: function(x, y, w, h){
//        this._super(x, y)
//        this.w = w
//        this.h = h
//    },
//    move: function(){
//
//    }
//});


/**
 * string functions
 **/

function loadString(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
    if ((xhr.status == 200) || (xhr.status == 0)) return xhr.responseText;
    return "";
}


String.prototype.ltrim = function (clist) {
    if (clist) return this.replace(new RegExp('^[' + clist + ']+'), '')
    return this.replace(/^\s+/, '')
}
String.prototype.rtrim = function (clist) {
    if (clist) return this.replace(new RegExp('[' + clist + ']+$'), '')
    return this.replace(/\s+$/, '')
}
String.prototype.trim = function (clist) {
    if (clist) return this.ltrim(clist).rtrim(clist);
    return this.ltrim().rtrim();
}
String.prototype.startsWith = function (str) {
    return !this.indexOf(str);
}


/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


CG.Class.extend('Delta', {
    init:function (fps) {
        this.targetfps = fps
        this.currentticks = 0
        this.lastticks = Date.now()
        this.frametime = 0
        this.delta = 0
    },

    update:function () {
        this.currentticks = Date.now()
        this.frametime = this.currentticks - this.lastticks
        this.delta = this.frametime / ( 1000 / this.targetfps)
        this.lastticks = this.currentticks
    },
    get:function () {
        return this.delta
    }
})


/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description entity the base class
 * @constructor
 */

CG.Class.extend('Entity', {
    init:function (name) {
        this.name = name || ''
        this.visible = true
    },
    update:function () {
        throw {
            name:'Entity Error',
            message:'Subclass has no update method.'
        }
    },
    draw:function () {
        throw {
            name:'Entity Error',
            message:'Subclass has no draw method.'
        }
    },
    /**
     * @description initialize image for object. for now => sprite, particle, buffer, bitmap and button use it
     *
     * @param {image} image image path, image or tpimage
     */
    setImage:function (image) {
        this.atlasimage = false
        if (image instanceof CG.TPImage) {
            //TPImage from MediaAsset
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
            } else {
                this.cutwidth = image.width
                this.cutheight = image.height
            }
        } else if (typeof image == 'string') {
            //path to image
            this.image = new Image()
            this.image.src = image
            this.width = this.image.width
            this.height = this.image.height

        } else {
            //image from MediaAsset
            this.image = image
            this.width = this.image.width
            this.height = this.image.height
        }
    }
})


/**
 * @description class Point
 *
 * @constructor
 * @augments Entity
 *
 * @param {integer} x the x position
 * @param {integer} y the y position
 */
CG.Entity.extend('Point', {
    init:function (x, y) {
        this.x = x || 0
        this.y = y || 0
    }
})


/**
 * @description class Vector
 *
 * @constructor
 * @augments Point
 *
 * @param {integer} x the x position
 * @param {integer} y the y position
 * @param {integer} z the z position
 */
CG.Point.extend('Vector', {
    init:function (x, y, z) {
        this._super(this, x, y)
        this.z = z || 0
    }
})



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
    init:function (position, width, height) {
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
     *
     * @return {true/false}
     */
    ifClicked:function () {
        if (mousedown && this.clickable) {
            var dx = mousex - this.position.x,
                dy = mousey - this.position.y
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
                mousedown = false
            }
        }
        return false
    },
    /**
     * @description checks if the mouse/pointer is over the rectangle
     */
    ifMouseOver:function () {
        var dx = mousex - this.position.x,
            dy = mousey - this.position.y
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
     *
     * @param {array} objects a array of objects to check for collision => Sprites, Animations, MapAreas
     * @param {callback} callback what to do after collision?
     */
    checkCollision:function (objects, callback) {
        objects.forEach(function (obj, index) {
                if (obj.className == 'MapArea') {
                    if ((this.position.y + this.AABB().bh / 2) >= obj.bound.y &&
                        this.position.y - this.AABB().bh / 2 <= (obj.bound.y + obj.bound.height) &&
                        (this.position.x + this.AABB().bw / 2) >= obj.bound.x &&
                        this.position.x - this.AABB().bw / 2 <= (obj.bound.x + obj.bound.width )) {
                        if (obj.type === 'outer') {
                            //TODO return collision offset to callback? experimantal, comparing both objects midhandle

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
                        //TODO return collision offset to callback?
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
                        //TODO return collision offset to callback?

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


/**
 * @description Class Bound extends Class Entity
 *
 * @constructor
 * @augments Entity
 *
 * @param {number} x the x position
 * @param {number} y the y position
 * @param {number} width the width of bound
 * @param {number} height the height of bound
 */
CG.Entity.extend('Bound', {
    init:function (x, y, width, height) {
        this._super()
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        return this
    },

    /**
     * @param {string} name of the bounding box
     */
    setName:function (name) {
        this.name = name
        return this
    }
})


/**
 * @description Class Buffer for separate canvas rendering/buffering
 *
 * @constructor
 * @augments Entity
 *
 * @param {integer} width of the buffer
 * @param {integer} height of the buffer
 * @param {string} buffername
 */
CG.Entity.extend('Buffer', {
    init:function (width, height, buffername) {
        this._super(buffername)
        this.b_canvas = document.createElement('canvas')
//    if(typeof(ejecta) !== 'undefined'){
//        this.b_canvas.width = w
//        this.b_canvas.height = h
//    }else{
        this.b_canvas.width = width
        this.b_canvas.height = height
//    }
        this.b_ctx = this.b_canvas.getContext('2d')
        return this
    }
})


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



/**
 * @description texturepacker TPImage class
 *
 * @constructor
 *
 * @param {image} image imgpath, image object or tpimage object to use
 * @param {integer} xoffset of image in atlas file
 * @param {integer} yoffset of image in atlas file
 * @param {integer} width of image in atlas file
 * @param {integer} height of image in atlas file
 */
CG.Class.extend('TPImage', {
    init:function (image, xoffset, yoffset, width, height) {
        this.source = ''
        this.atlasimage = ''
        this.atlasname = ''
        this.image = image || ''    //imagepath
        this.name = image.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name
        this.xoffset = xoffset || 0
        this.yoffset = yoffset || 0
        this.width = width || 0
        this.height = height || 0
        this.rotation = 0
    }
})

/**
 *  @description TexturePacker class supports loading xml and json files from . . . TexturePacker ;o) No trimming at the moment, keep texturepacker settings simple! TexturePacker parses the xml/json and generates new CG.TPImage objects in the MediaAsset manager. These TPImages are only handled within Sprite, Particle and Button class.
 *
 *  @constructor
 */
CG.Class.extend('TexturePacker', {
    init:function () {
        if (typeof(ejecta) == 'undefined') {
            this.xml = ''
            this.xmlDoc = ''
            this.parser = new DOMParser() || {}
        }
        this.imagename = ''
        this.width = 0
        this.height = 0

        this.tpimages = []
        return this
    },
    /**
     * @description load a xml file from texturepacker
     *
     * @param {string/object} xmlfile path or mediaasset object with data of texturepacker xml
     */
    loadXml:function (xmlfile) {
        //from asset
        if (typeof xmlfile == 'string') {
            this.xml = loadString(xmlfile)
        } else {
            this.xml = xmlfile.data
        }

        this.xmlDoc = this.parser.parseFromString(this.xml, 'text/xml')

        this.imagename = this.xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('imagePath')
        this.width = parseInt(this.xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('width'))
        this.height = parseInt(this.xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('height'))

        var sprites = this.xmlDoc.getElementsByTagName('sprite')
        for (var i = 0, l = sprites.length; i < l; i++) {
            tpimage = new CG.TPImage(
                sprites[i].getAttribute('n'),
                parseInt(sprites[i].getAttribute('x')),
                parseInt(sprites[i].getAttribute('y')),
                parseInt(sprites[i].getAttribute('w')),
                parseInt(sprites[i].getAttribute('h'))
            )
            if (sprites[i].getAttribute('r') == 'y') {
                tpimage.rotation = 90
            }
            tpimage.atlasimage = this.imagename
            tpimage.source = 'xml'
            tpimage.atlasname = this.imagename.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name

            this.tpimages.push(tpimage)
        }
        return this
    },

    /**
     * @description load a json file from texturepacker
     *
     * @param {string/object} jsonfile path or mediaasset object with data of texturepacker json
     */
    loadJson:function (jsonfile) {
        //from asset
        if (typeof jsonfile == 'string') {
            this.json = JSON.parse(loadString(jsonfile))
        } else {
            this.json = jsonfile.data
        }
        //meta info from json file
        this.imagename = this.json.meta.image
        this.width = this.json.meta.size.w
        this.height = this.json.meta.size.h

        //loop thru all images
        for (var i = 0, l = this.json.frames.length; i < l; i++) {
            var image = this.json.frames[i]
            var tpimage = new CG.TPImage(
                image.filename,
                image.frame.x,
                image.frame.y,
                image.frame.w,
                image.frame.h
            )
            if (image.rotated === true) {
                tpimage.rotation = 90
                //            tpimage.width = this.json.frames[i].frame.w,
                //            tpimage.height = this.json.frames[i].frame.h
            }
            tpimage.atlasimage = this.imagename
            tpimage.source = 'json'
            tpimage.atlasname = this.imagename.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name

            this.tpimages.push(tpimage)
        }
        return this
    },

    /**
     * @description get all texturepacker images (Use array.push.apply(array, anotherarray) to append to Game.asset)
     *
     * @return {array} returns all tpimages of texturepacker file to use with Game.asset
     */
    getTPImages:function () {
        return this.tpimages
    }
})


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
    init:function (image, position, startframe, endframe, framewidth, frameheight) {
        this._super(image, position)

        //from asset?
        if (typeof image == 'string') {
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

        if (this.startframe === undefined && this.endframe === undefined) {
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

/**
 * @description Class Bitmap extends Class Buffer
 *
 * @constructor
 * @augments Entity
 *
 * @param {integer} width the width for the buffer
 * @param {integer} height the height for the buffer
 */
CG.Entity.extend('Bitmap', {
    init:function (width, height) {
        this._super(this)
        this.x = 0
        this.y = 0
        this.bitmap_canvas = document.createElement('canvas')
        this.bitmap_canvas.width = width
        this.bitmap_canvas.height = height
        this.bitmap_ctx = this.bitmap_canvas.getContext('2d')
        return this
    },
    /**
     * @description loads image and draws it to the buffer
     *
     * @param {string, image, tpimage} imgpath, image object or tpimage object to use
     */
    loadImage:function (image) {
        this.setImage(image)
        this.drawImageToBuffer()
        return this
    },


    update:function () {
    },

    draw:function () {
        Game.b_ctx.drawImage(this.bitmap_canvas, this.x, this.y)
    },


    /**
     * @description clearBuffer
     */
    clearBuffer:function () {
        this.bitmap_ctx.clearRect(0, 0, this.bitmap_canvas.width, this.bitmap_canvas.height)
        return this
    },

    /**
     * @description drawImageToBuffer
     */
    drawImageToBuffer:function () {
        this.bitmap_ctx.drawImage(this.image, 0, 0)
        return this
    },


    /**
     * @description clearRect
     *
     * @param {integer} x the x position for clearRect
     * @param {integer} y the y position for clearRect
     * @param {integer} width the width for clearRect
     * @param {integer} height the height for clearRect
     */
    clearRect:function (x, y, width, height) {
        this.bitmap_ctx.save()
        this.bitmap_ctx.globalCompositeOperation = 'destination-out'
        this.bitmap_ctx.clearRect(x, y, width, height)
        this.bitmap_ctx.restore()
    },

    /**
     * @description clearCircle
     *
     * @param {integer} x the x position for clearCircle
     * @param {integer} y the y position for clearCircle
     * @param {integer} radius the radius for clearCircle
     */
    clearCircle:function (x, y, radius) {
        this.bitmap_ctx.save()
        this.bitmap_ctx.globalCompositeOperation = 'destination-out'
        this.bitmap_ctx.beginPath()
        this.bitmap_ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
        this.bitmap_ctx.closePath()
        this.bitmap_ctx.fill()
        this.bitmap_ctx.restore()
    },

    /**
     * @description getPixel
     *
     * @param {integer} x the x position for getPixel
     * @param {integer} y the y position for getPixel
     * @returns {imagedata} data from canvas
     */
    getPixel:function (x, y) {
        return this.bitmap_ctx.getImageData(x, y, 1, 1)
    },

    /**
     * @description getPixels
     *
     * @param {integer} x the x position for getPixels
     * @param {integer} y the y position for getPixels
     * @param {integer} width for getPixels
     * @param {integer} height for getPixels
     * @returns {imagedata} data from canvas
     */
    getPixels:function (x, y, width, height) {
        return this.bitmap_ctx.getImageData(x, y, width, height)
    }
})


/**
 * @description button class, can handle click and mouseover.
 *
 * @constructor
 * @augments Sprite
 *
 * @param {string, image, tpimage} imgpath, image object or tpimage object to use
 * @param {point} position object
 * @param {string} text the text for the button label
 * @param {Font} font Font object for text drawing
 * @param {callback} callback callback function for click event
 */
CG.Sprite.extend('Button', {
    init:function (image, position, text, font, clickedCallback) {
        this._super(image, position)

        this.font = font
        this.clickedCallback = clickedCallback
        this.clicked = false
        this.clickable = true

        this.text = text
        return this
    },
    update:function () {
        this.ifClicked()
        this.ifMouseOver()
        this.ifAttached()

        if (this.clicked) {
            if (this.clickedCallback) {
                this.clicked = false
                this.clickedCallback(this)
            }
        }
    },
    draw:function () {
        Game.b_ctx.save()
        Game.b_ctx.translate(this.position.x, this.position.y)
        if (this.atlasimage) {
            var r = this.rotation
            Game.b_ctx.rotate((r - this.imagerotation) * CG.Const_PI_180)
            Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - (this.cutwidth / 2), 0 - (this.cutheight / 2), this.cutwidth * this.xscale, this.cutheight * this.yscale)
            Game.b_ctx.rotate(this.imagerotation * CG.Const_PI_180)
        } else {
            Game.b_ctx.rotate(r * CG.Const_PI_180)
            Game.b_ctx.drawImage(this.image, 0 - (this.image.width * this.xscale / 2), 0 - (this.image.height * this.yscale / 2), this.image.width * this.xscale, this.image.height * this.yscale)
        }
        this.font.draw(this.text, 0 - (this.font.getLength(this.text) / 2 >> 0), 0 - ((this.font.getFontSize() / 2) >> 0))
        Game.b_ctx.restore()
    }
})


/**
 * @description class Menu
 *
 * @constructor
 * @augments Entity
 *
 * @param {integer} x the x position
 * @param {integer} y the y position
 * @param {integer} margin the margin between the menu buttons
 */
CG.Entity.extend('Menu', {
    init:function (x, y, margin) {
        this.x = x
        this.y = y
        this.margin = margin
        this.step = this.y
        this.buttons = []
        return this
    },
    /**
     * @description add a button to the menu
     *
     * @param {button} button
     */
    addButton:function (button) {
        this.buttons.push(button)
    },

    update:function () {
        this.buttons.forEach(function (button) {
            button.update()
        }, this)
    },

    draw:function () {
        this.buttons.forEach(function (button) {
            button.position.x = this.x
            button.position.y = this.step
            button.draw()
            this.step += button.height
            this.step += this.margin
        }, this)
        this.step = this.y
    }
})


/*
 * Class MediaAsset
 * @param {string} image path to background image of preloader
 */

CG.Class.extend('MediaAsset', {
    init:function (image) {
        if (image) {
            this.image = new Image()
            this.image.src = image
        }
        this.ready = false

        this.images = []
        this.currimage = 0

        this.sounds = []
        this.currsound = 0

        this.xmls = []
        this.currxml = 0

        this.jsons = []
        this.currjson = 0

        this.fonts = []
        this.currfont = 0

        this.assetcount = 0
        this.assetcurrent = 0

        //progress
        this.width = 300
        this.height = 20
        this.radius = 10

        this.linewidth = 8
        this.bordercolor = 'white'
        this.progresscolor = 'red'
        this.shadowcolor = '#222'
        this.shadowblur = 6
        this.shadowoffsetx = 2
        this.shadowoffsety = 2

//return this
    },
    addImage:function (path, name) {
        this.assetcount += 1
        this.images.push({
            name:name || '', //optional
            path:path,
            img:new Image()
        })
        return this
    },
    addFont:function (path, name) {
        this.assetcount += 1
        this.fonts.push({
            name:name || '', //optional
            path:path,
            data:''
        })
        return this
    },
    addXml:function (path, name) {
        this.assetcount += 1
        this.xmls.push({
            name:name || '', //optional
            path:path,
            data:''
        })
        return this
    },
    addJson:function (path, name) {
        this.assetcount += 1
        this.jsons.push({
            name:name || '', //optional
            path:path,
            data:''
        })
        return this
    },
    getImageByName:function (name) {
        for (var i = 0, l = this.images.length; i < l; i++) {
            if (this.images[i].name == name) {
                if (this.images[i] instanceof CG.TPImage) {
                    return this.images[i]
                } else {
                    return this.images[i].img
                }
            }
        }
        throw new CG.MediaAssetException('No image with this name in asset.')
    },
    getImagesByName:function (name) {
        names = []
        for (var i = 0, l = this.images.length; i < l; i++) {
            if (this.images[i].name == name) {
                if (this.images[i] instanceof CG.TPImage) {
                    names.push(this.images[i])
                } else {
                    names.push(this.images[i].img)
                }
            }
        }
        if (names.length === 0) {
            throw new CG.MediaAssetException('No image with this name in asset.')
        }
        return names
    },
    getFontByName:function (name) {
        for (var i = 0, l = this.fonts.length; i < l; i++) {
            if (this.fonts[i].name == name) {
                return this.fonts[i]
            }
        }
        throw new CG.MediaAssetException('No font with this name in asset.')
    },
    getXmlByName:function (name) {
        for (var i = 0, l = this.xmls.length; i < l; i++) {
            if (this.xmls[i].name == name) {
                return this.xmls[i]
            }
        }
        throw new CG.MediaAssetException('No XML with this name in asset.')
    },
    getJsonByName:function (name) {
        for (var i = 0, l = this.jsons.length; i < l; i++) {
            if (this.jsons[i].name == name) {
                return this.jsons[i]
            }
        }
        throw new CG.MediaAssetException('No JSON with this name in asset.')
    },
    startPreLoad:function () {

        progress = 100 / this.assetcount * this.assetcurrent
        this.progressScreen(progress)

        if (this.currimage < this.images.length) {
            //BUG last image is not preloading
            this.images[this.currimage].img.onload = function () {
                console.log('loaded image (' + Math.floor(100 / (this.images.length - 1) * this.currimage) + ' %): ' + this.images[this.currimage].name)
                this.currimage += 1
                this.assetcurrent += 1
                this.startPreLoad()
            }.bind(this)
            this.images[this.currimage].img.src = this.images[this.currimage].path
        } else if (this.currfont < this.fonts.length) {
            //        if(typeof(ejecta) !== 'undefined'){
            //            this.fonts[this.currfont].data = ejecta.loadText(this.fonts[this.currfont].path)
            //        } else {
            this.fonts[this.currfont].data = loadString(this.fonts[this.currfont].path)
            //        }
            this.currfont += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currxml < this.xmls.length) {
            this.xmls[this.currxml].data = loadString(this.xmls[this.currxml].path)
            this.currxml += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currjson < this.jsons.length) {
            //        if(typeof(ejecta) !== 'undefined'){
            //            this.jsons[this.currjson].data = ejecta.loadJSON(this.jsons[this.currjson].path)
            //        } else {
            this.jsons[this.currjson].data = JSON.parse(loadString(this.jsons[this.currjson].path))
            //        }
            this.currjson += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currimage == this.images.length &&
            this.assetcount == this.assetcurrent) {
            this.ready = true
            Game.create()
        }
    },
    progressScreen:function (progress) {
        var x = (Game.bound.width - this.width) / 2
        var y = (Game.bound.height - this.height) / 2
        if (this.image) {
            Game.b_ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
        } else {
            Game.b_ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
        }
        Game.b_ctx.save()

        Game.b_ctx.fillStyle = this.progresscolor;
        Game.b_ctx.fillRect((Game.bound.width - this.width) / 2, (Game.bound.height - this.height) / 2, this.width / 100 * progress, this.height);

        Game.b_ctx.strokeStyle = this.bordercolor
        Game.b_ctx.shadowColor = this.shadowcolor
        Game.b_ctx.shadowBlur = this.shadowblur
        Game.b_ctx.shadowOffsetX = this.shadowoffsetx
        Game.b_ctx.shadowOffsetY = this.shadowoffsety
        Game.b_ctx.beginPath();
        Game.b_ctx.moveTo(x + this.radius, y);
        Game.b_ctx.lineTo(x + this.width - (1 * this.radius), y)
        Game.b_ctx.arcTo(x + this.width, y, x + this.width, y + this.radius, this.radius)
        Game.b_ctx.arcTo(x + this.width, this.radius * 2 + y, x + this.width - (1 * this.radius), this.radius * 2 + y, this.radius)
        Game.b_ctx.lineTo(x + this.radius, 2 * this.radius + y)
        Game.b_ctx.arcTo(x, 2 * this.radius + y, x, y, this.radius)
        Game.b_ctx.arcTo(x, y, 2 * this.radius + x, y, this.radius)
        Game.b_ctx.lineWidth = this.linewidth
        Game.b_ctx.stroke()
        Game.b_ctx.restore()
    }
})

function MediaAssetException(message) {
    this.message = message
}



/**
 * @description class Font supports loading and drawing font files (EZ GUI Text format) from Glyph Designer, (Hiero works also but need some modifications of the exportet files)
 *
 * @constructor
 * @augments Entity
 */
CG.Entity.extend('Font', {
    init:function () {
        //    Entity.call(this)
        this.atlas = new Image()
        this.fieldname = ''
        this.initText = ''
        this.chars = new Array(256) //?
        this.x = new Array(256)
        this.y = new Array(256)
        this.width = new Array(256)
        this.height = new Array(256)
        this.xoff = new Array(256)
        this.yoff = new Array(256)
        this.xadv = new Array(256)
        this.lineHeight = 0

        //info
        this.face = ''
        this.size = 0
        this.bold = 0
        this.italic = 0

        this.base = 0
        this.scaleW = 0
        this.scaleH = 0
        return this
    },

    update:function () {
        throw {
            name:'Font Error',
            message:'TODO, not defined yet.'
        }
    },

    draw:function (text, xpos, ypos) {
        currx = 0
        curry = 0
        c = 0

        currx = xpos
        curry = ypos

        for (var i = 0, l = text.length; i < l; i++) {
            Game.b_ctx.drawImage(this.atlas, this.x[text.charCodeAt(i)], this.y[text.charCodeAt(i)], this.width[text.charCodeAt(i)], this.height[text.charCodeAt(i)], currx, curry + this.yoff[text.charCodeAt(i)], this.width[text.charCodeAt(i)], this.height[text.charCodeAt(i)])
            currx += this.xadv[text.charCodeAt(i)]
        }
    },

    /**
     * @description get the line height of the current font
     *
     * @return {integer} lineheight
     */
    getLineHeight:function () {
        return this.lineHeight
    },

    /**
     * @description get the font size of the current font
     *
     * @return {integer} size - font size
     */
    getFontSize:function () {
        return this.size
    },

    /**
     * @description get the width of the given text
     *
     * @param {string} text
     * @return {integer} textwidth
     */
    getLength:function (text) {
        var textwidth = 0
        var c = 0
        for (var i = 0, l = text.length; i < l; i++) {
            textwidth += this.xadv[text.charCodeAt(i)]
        }
        return textwidth
    },

    /**
     * @description loadFont - load and parse the given fontfile
     *
     * @param {string/object} fontfile path or mediaasset object with data
     */
    loadFont:function (fontfile) {
        idnum = 0
        if (typeof fontfile == 'string') {
            this.initText = loadString(fontfile)
        } else {
            this.initText = fontfile.data
        }

        var lines = this.initText.split('\n')
        for (l in lines) {
            line = lines[l].trim()

            if (line.startsWith('info') || line == '') {
                var infodata = line.split(' ')
                for (i in infodata) {
                    var info = infodata[i]
                    if (info.startsWith('face=')) {
                        var face = info.split("=")
                        this.face = face[1].split('"').join('')
                    }
                    if (info.startsWith('size=')) {
                        var size = info.split("=")
                        this.size = parseInt(size[1])
                    }
                    if (info.startsWith('bold=')) {
                        var bold = info.split("=")
                        this.bold = parseInt(bold[1])
                    }
                    if (info.startsWith('italic=')) {
                        var italic = info.split("=")
                        this.italic = parseInt(italic[1])
                    }
                }
            }
            if (line.startsWith('padding')) {
                continue
            }
            if (line.startsWith('common')) {
                var commondata = line.split(' ')
                for (c in commondata) {
                    var common = commondata[c]
                    if (common.startsWith('lineHeight=')) {
                        var lnh = common.split("=")
                        this.lineHeight = parseInt(lnh[1])
                    }
                    if (common.startsWith('base=')) {
                        var base = common.split("=")
                        this.base = parseInt(base[1])
                    }
                    if (common.startsWith('scaleW=')) {
                        var scaleW = common.split("=")
                        this.scaleW = parseInt(scaleW[1])
                    }
                    if (common.startsWith('scaleH=')) {
                        var scaleH = common.split("=")
                        this.scaleH = parseInt(scaleH[1])
                    }
                }
            }
            if (line.startsWith('page')) {
                var pagedata = line.split(' ')
                for (p in pagedata) {
                    data = pagedata[p]
                    if (data.startsWith('file=')) {
                        var fn = data.split('=')
                        this.atlas.src = 'media/font/' + fn[1].split('"').join('')
                    }

                }
            }
            if (line.startsWith('chars')) {
                continue
            }
            if (line.startsWith('char')) {
                var linedata = line.split(' ')
                for (l in linedata) {
                    ld = linedata[l]
                    if (ld.startsWith('id=')) {
                        var idc = ld.split('=')
                        idnum = parseInt(idc[1])
                    }
                    if (ld.startsWith('x=')) {
                        var xc = ld.split('=')
                        this.x[idnum] = parseInt(xc[1])
                    }
                    if (ld.startsWith('y=')) {
                        var yc = ld.split('=')
                        this.y[idnum] = parseInt(yc[1])
                    }
                    if (ld.startsWith('width=')) {
                        var wc = ld.split('=')
                        this.width[idnum] = parseInt(wc[1])
                    }
                    if (ld.startsWith('height=')) {
                        var hc = ld.split('=')
                        this.height[idnum] = parseInt(hc[1])
                    }
                    if (ld.startsWith('xoffset=')) {
                        var xoc = ld.split('=')
                        this.xoff[idnum] = parseInt(xoc[1])
                    }
                    if (ld.startsWith('yoffset=')) {
                        var yoc = ld.split('=')
                        this.yoff[idnum] = parseInt(yoc[1])
                    }
                    if (ld.startsWith('xadvance=')) {
                        var advc = ld.split('=')
                        this.xadv[idnum] = parseInt(advc[1])
                    }
                }
            }
        }
        return this
    }
})


/**
 * @description Director the top instance for screens and so on in the control hierarchy
 *
 * @constructor
 */
CG.Class.extend('Director', {
    init:function () {
        this.screens = []
        this.activescreen = 0
        this.nextscreen = 0
        this.duration = 20
        this.alpha = 0
        this.fademode = 'fade'      //fade or scale
        this.color = 'rgb(0,0,0)'
        return this
    },
    update:function () {
        //handle screen fading
        switch (this.fademode) {
            case 'scale':
                //TODO modify code for scaling
                if (this.nextscreen != this.activescreen) {
                    this.screens[this.activescreen].xscale -= 0.4 / this.duration
                    this.screens[this.activescreen].yscale -= 0.4 / this.duration
                } else if (this.nextscreen == this.activescreen) {
                    this.screens[this.activescreen].xscale += 0.4 / this.duration
                    this.screens[this.activescreen].yscale += 0.4 / this.duration
                }

                if (this.screens[this.activescreen].xscale >= 1) {
                    this.screens[this.activescreen].xscale = this.screens[this.activescreen].yscale = 1
                    this.screens[this.nextscreen].xscale = this.screens[this.nextscreen].yscale = 1
                }

                if (this.screens[this.activescreen].xscale <= 0) {
                    this.screens[this.activescreen].xscale = this.screens[this.activescreen].yscale = 1
                    this.screens[this.nextscreen].xscale = this.screens[this.nextscreen].yscale = 0
                    this.activescreen = this.nextscreen
                }
                break
            case 'fade':
                // the fade is bound to the alpha value in the draw method
                if (this.nextscreen != this.activescreen && this.alpha < 1) {
                    this.alpha += 1 / this.duration
                } else if (this.nextscreen == this.activescreen && this.alpha != 0) {
                    this.alpha -= 1 / this.duration
                }
                if (this.alpha >= 1) {
                    this.activescreen = this.nextscreen
                    this.alpha = 1
                }
                if (this.alpha < 0) {
                    this.alpha = 0
                }
                break
        }
        this.screens[this.activescreen].update()
    },
    draw:function () {
        //draw active screen
        this.screens[this.activescreen].draw()
        //draw fading layer
        if (this.alpha > 0) {
            Game.b_ctx.save()
            Game.b_ctx.globalAlpha = this.alpha
            Game.b_ctx.fillStyle = this.color
            Game.b_ctx.fillRect(0, 0, Game.bound.width, Game.bound.height)
            Game.b_ctx.restore()
        }
    },
    /**
     * @description addScreen
     *
     * @param {screen} screen to add to the screen list
     */
    addScreen:function (screen) {
        this.screens.push(screen)
        return this
    },
    /**
     * @description  nextScreen
     *
     * @param {string} screenname to define nextscreen for fading
     * @param {integer} duration the duration for fading
     */
    nextScreen:function (screenname, duration) {
        if (this.getIndexOfScreen(screenname) != this.activescreen) {
            this.duration = duration
            this.nextscreen = this.getIndexOfScreen(screenname)
        }
    },

    /**
     * @description  getScreenByName
     *
     * @param {string} screenname to find screen by name
     * @return {false/screen} returns false or the screen object
     */
    getScreenByName:function (screenname) {
        for (var i = 0, l = this.screens.length; i < l; i++) {
            if (this.screens[i].name == screenname) {
                return this.screens[i]
            }
        }
        return false
    },

    /**
     * @description  getIndexOfScreen
     *
     * @param {string} screenname to find index of screen in screen array
     * @return {false/integer} return false or index number of the screen
     */
    getIndexOfScreen:function (screenname) {
        for (var i = 0, l = this.screens.length; i < l; i++) {
            if (this.screens[i].name == screenname) {
                return i
            }
        }
        return false
    },

    /**
     * @description  getActiveScreenName
     *
     * @return {string} the name of the active screen
     */
    getActiveScreenName:function () {
        return this.screens[this.activescreen].name
    },

    /**
     * @description  setFadeMode
     *
     * @return {string} fademode for screen transitions => fade or scale
     */
    setFadeMode:function (fademode) {
        if (fademode == 'scale') {
            this.fademode = fademode
            this.alpha = 0
        } else if (fademode == 'fade') {
            this.fademode = fademode
        }
        return this
    }
})


/**
 * @description class Screen container to collect/group Layers
 *
 * @constructor
 * @augments Entity
 *
 * @param {string} screenname the name of the screen
 */
CG.Entity.extend('Screen', {
    init:function (screenname) {
        this._super(screenname)
        this.xscale = 1
        this.yscale = 1
        var self = this
        this.layers = []
        return this
    },
    create:function () {

    },
    update:function () {
        this.layers.forEach(function (element, index) {
            element.update()
        }, this)
    },
    draw:function () {
        Game.b_ctx.save()
        if (this.xscale !== 1 || this.yscale !== 1) {
            Game.b_ctx.translate((Game.width - (Game.width * this.xscale)) / 2, (Game.height - (Game.height * this.yscale)) / 2)
            Game.b_ctx.scale(this.xscale, this.yscale)
        }
        this.layers.forEach(function (element, index) {
            element.draw()
        }, this)
        Game.b_ctx.restore()

    },

    /**
     * @description add a layer object to the layer array
     *
     * @param {layer} layer to add
     */
    addLayer:function (layer) {
        this.layers.push(layer)
        return this
    },

    /**
     * @description find layer by name
     *
     * @param {string} layername find layer by name
     * @return {false/layer}
     */
    getLayerByName:function (layername) {
        for (var i = 0, l = this.layers.length; i < l; i++) {
            if (this.layers[i].name == layername) {
                return this.layers[i]
            }
        }
        return false
    }
})


/**
 * @description class Layer container to collect/group sprites, buttons, menus, emitters and animations
 *
 * @constructor
 * @augments Entity
 *
 * @param {string} layername the name of the layer
 */
CG.Entity.extend('Layer', {
    init:function (layername) {
        this._super(layername)

        var self = this
        this.elements = []
        this.elementsToDelete = []
        return this
    },
    update:function () {
        if (this.visible == true) {
            this.elements.forEach(function (element, index) {
                element.update()
                if (element.status == 1) {
                    this.elementsToDelete.push(index)
                }
            }, this)

            if (this.elementsToDelete.length > 0) {
                this._deleteElements()
            }
        }
    },
    draw:function () {
        if (this.visible == true) {
            this.elements.forEach(function (element) {
                element.draw()
            }, this)
        }
    },
    _deleteElements:function () {
        this.elementsToDelete.reverse()
        this.elementsToDelete.forEach(this._deleteElement, this)
        this.elementsToDelete = []
    },
    _deleteElement:function (elementToDelete) {
        this.elements.splice(elementToDelete, 1)
    },

    /**
     * @description addElement
     *
     * @param {obj} element to add to elements array
     */
    addElement:function (element) {
        this.elements.push(element)
        return this
    },

    /**
     * @description getElementByName
     *
     * @param {string} elementname name of element to find in element array
     * @return {false/object} returns false or the searched object
     */
    getElementByName:function (elementname) {
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (this.elements[i].name == elementname) {
                return this.elements[i]
            }
        }
        return false
    },

    /**
     * @description getElementsByName
     *
     * @param {string} elementname name of element to find in element array
     * @return {array} returns a array of objects
     */
    getElementsByName:function (elementname) {
        elements = []
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (this.elements[i].name == elementname) {
                elements.push(this.elements[i])
            }
        }
        return elements
    }
})



/**
 * @description MapTileLayer
 *
 * @constructor
 */
CG.Class.extend('MapTileLayer', {
    init:function () {
        this.width = 0
        this.height = 0
        this.visible = true
        this.opacity = 1
        this.tiles = []
        return this
    }
})


/**
 * @description MapTileProperties
 *
 * @constructor
 */
CG.Class.extend('MapTileProperties', {
    init:function () {
        this.animated = false
        this.animDelay = 0
        this.animDirection = 0 // >0 = forward, <0 = backward, 0 = paused
        this.animNext = 0
        this.delayTimer = 0
        return this
    }
})


/**
 * @description class MapPoint. Support now for name, gid and x/y-position values. No tilemap properties at the moment.
 *
 * @constructor
 *
 * @param {point} position point
 * @param {point} mapoffset reference to the current map position
 * @param {string} name of the tile
 * @param {integer} gid number of tilemap editor
 */
CG.Class.extend('MapPoint', {
    init:function (position, mapoffset, name, gid) {
        //initial values
        this.initposition = position || new CG.Point(0, 0)
        this.mapoffset = mapoffset || new CG.Point(0, 0)
        this.gid = gid
        this.name = name

        //for reference use
        this.position = new CG.Point(position.x, position.y)
        return this
    },

    update:function () {
        this.position.x = this.initposition.x - this.mapoffset.x
        this.position.y = this.initposition.y - this.mapoffset.y
    }
})


/**
 * @description  class MapArea. Support now for name and the bound values.
 *
 * @constructor
 *
 * @param {bound} bound of area
 * @param {point} mapoffset reference to the current map position
 * @param {string} name of the group
 * @param {false/string} type (a property) of area for collision detection or what ever ;o)
 */
CG.Class.extend('MapArea', {
    init:function (bound, mapoffset, name, type) {
        //initial values
        this.initbound = bound || new CG.Bound(0, 0, 0, 0)
        this.mapoffset = mapoffset || new CG.Point(0, 0)
        this.name = name
        this.type = type || false       //false, inner or outer

        //for reference use
        this.bound = new CG.Bound(bound.x, bound.y, bound.width, bound.height)
        return this
    },

    update:function () {
        this.bound.x = this.initbound.x - this.mapoffset.x
        this.bound.y = this.initbound.y - this.mapoffset.y
    }
})


/**
 * @description
 * class Map supports loading and rendering maps from the editor Tiled.
 * XML and JSON file types are supported.
 * XML => supported tiled encodings are csv and xml (see settings!). base64, base64(gzip) and base64(zlib) are not supported!
 *
 * Supported types of the object layer are:
 * - object/group (rectangle?)
 * - tile element, reference point is bottom/CG.LEFT
 *
 * These object layer types are used to generate Point and Bound objects and can be used to position sprites, what ever in the map.
 *
 * @constructor
 * @augments Entity
 *
 * TODO spacing and margin ?
 * TODO own buffer for drawing => split screen possible?
 * TODO update & draw method 50%
 *
 * @param {integer} width of the map
 * @param {integer} height of the map
 * @param {string} mapname
 */
CG.Entity.extend('Map', {
    init:function (width, height, mapname) {
        this._super(mapname)

        this.elements = [] //how handle elements in maps? experimental collision detection at the moment with only one
        //point and areas from tilemap editor
        //using as references for external objects in layers?
        //how to handle the relative position to the position of the map?
        this.points = [] // position points (tiles) of tilemap editor => position point and type?
        this.areas = [] // group objects e.g. area for objects of tilemap editor => bound and type?
        this.position = new CG.Point(0, 0) // needed as relative point for points and areas
        this.changemap = ''

        this.animated = false //perfromance eater if true ;o(
        this.animDelayFactor = 20

        this.atlas = new Image()
        this.atlaswidth = 0
        this.atlasheight = 0
        this.atlastranscol = '' //
        //ejecta has no DOMParser!
        if (typeof(ejecta) == 'undefined') {
            this.xml = ''
            this.parser = new DOMParser()
            this.xmlDoc = ''
        }

        this.json = {}

        this.layers = [] //can contain maptilelayer or objectlayer
        this.renderlayer = 'all' //render layer: all for all layers, name of layer or array index for example 0 ;o)
        this.tileproperties = [] //properties of the tiles
        this.orientation = ''
        this.width = 0
        this.height = 0
        this.tilewidth = 0
        this.tileheight = 0
        this.tileset = {
            tilewidth:0,
            tileheight:0,
            offsetx:0,
            offsety:0,
            spacing:0,
            margin:0
        }

        this.xspeed = 0
        this.yspeed = 0


        this.xscale = 1
        this.yscale = 1
        this.alpha = 1

        this.wrapX = false //stuff from diddy?
        this.wrapY = false //stuff from diddy?
        //collision detection
        //this.elements = [] //if not empty elements would checked with checkMapCollision
        this.layertocheck = 0 //as default use layer 0 for collision detection
        return this
    },
    /**
     * @description loadMapXml - load and parse an xml tilemap file
     *
     * @param {string/object} xmlfile path or mediaasset object with data of tiled map xml
     */
    loadMapXml:function (xmlfile) {
        this.changemap = ''
        this.animated = false
        this.layers = []

        //from asset
        if (typeof xmlfile == 'string') {
            this.xml = loadString(xmlfile)
        } else {
            this.xml = xmlfile.data
        }
        this.removeJsonData()

        this.xmlDoc = this.parser.parseFromString(this.xml, 'text/xml')

        //get map
        var tilemap = map.xmlDoc.getElementsByTagName('map')[0]
        this.orientation = tilemap.getAttribute('orientation')
        this.width = parseInt(tilemap.getAttribute('width'))
        this.height = parseInt(tilemap.getAttribute('height'))
        this.tilewidth = parseInt(tilemap.getAttribute('tilewidth'))
        this.tileheight = parseInt(tilemap.getAttribute('tileheight'))

        var childcount = tilemap.childElementCount

        //tilemap.firstElementChild.nextElementSibling.nextElementSibling
        var element = tilemap.firstElementChild
        for (i = 0; i < childcount; i++) {
            console.log('>' + element.nodeName)
            switch (element.nodeName) {
                case 'tileset':
                    //read tileset settings
                    //only one tileset for the moment
                    this.tileset.tilewidth = parseInt(element.getAttribute('tilewidth'))
                    this.tileset.tileheight = parseInt(element.getAttribute('tileheight'))
                    if (element.getAttribute('spacing')) {
                        this.tileset.spacing = parseInt(element.getAttribute('spacing'))
                    }
                    if (element.getAttribute('margin')) {
                        this.tileset.margin = parseInt(element.getAttribute('margin'))
                    }
                    if (element.getElementsByTagName('tileoffset')[0]) {
                        this.tileset.offsetx = parseInt(element.getElementsByTagName('tileoffset')[0].getAttribute('x'))
                        this.tileset.offsety = parseInt(element.getElementsByTagName('tileoffset')[0].getAttribute('y'))
                    }
                    var image = element.getElementsByTagName('image')[0]
                    this.atlas.src = 'media/map/' + image.getAttribute('source')

                    this.atlaswidth = parseInt(image.getAttribute('width'))
                    this.atlasheight = parseInt(image.getAttribute('height'))
                    this.atlastranscol = image.getAttribute('trans')

                    break
                case 'layer':
                    //get tilemap data of layer
                    var tl = new CG.MapTileLayer()
                    data = element.getElementsByTagName('data')[0]

                    if (data.getAttribute('encoding') == 'csv') {
                        tl.tiles = data.textContent.replace(/(\r\n|\n|\r)/gm, '').split(',')
                        console.log('map encoding csv [layer ' + i + ']')
                    } else if (data.getAttribute('encoding') == 'base64' && data.getAttribute('compression') == 'gzip') {
                        throw 'base64 gzip compressed map format not supported at the moment'
                    } else if (data.getAttribute('encoding') == 'base64' && data.getAttribute('compression') == 'zlib') {
                        throw 'base64 zlib compressed map format not supported at the moment'
                    } else if (data.getAttribute('encoding') == 'base64') {
                        throw 'base64 map format not supported at the moment'
                    } else {
                        console.log('map encoding xml [layer ' + i + ']')
                        var tiles = element.getElementsByTagName('tile')
                        for (x in tiles) {
                            if (x < tiles.length) {
                                tl.tiles[x] = parseInt(tiles[x].getAttribute('gid'))
                            }
                        }
                    }

                    tl.name = element.getAttribute('name')
                    tl.width = parseInt(element.getAttribute('width'))
                    tl.height = parseInt(element.getAttribute('height'))
                    if (element.getAttribute('opacity')) {
                        tl.opacity = parseFloat(element.getAttribute('opacity'))
                    }
                    if (element.getAttribute('visible') === '0') {
                        tl.visible = false
                    }
                    this.layers.push(tl)
                    break
                case 'objectgroup':
                    //get tilemap data of grouplayer
                    console.log('grouplayer found')
                    var objects = element.getElementsByTagName('object')
                    for (o in objects) {
                        if (o < objects.length) {
                            var obj = objects[o]
                            var name = obj.getAttribute('name')
                            if (obj.getAttribute('gid')) {
                                //tile as object/point
                                this.points.push(
                                    new CG.MapPoint(
                                        new CG.Point(
                                            parseInt(obj.getAttribute('x')), parseInt(obj.getAttribute('y'))), this.position, obj.getAttribute('name'), parseInt(obj.getAttribute('gid'))))
                                console.log('tile as oject found: ' + name)
                                console.log(obj)
                            } else if (obj.getAttribute('width')) {
                                type = false
                                properties = obj.getElementsByTagName('property')
                                console.log(properties.length)
                                for (var p = 0, l = properties.length; p < l; p++) {
                                    if (properties[p].getAttribute('name') == 'type') {
                                        type = properties[p].getAttribute('value')
                                    }
                                }

                                //object group
                                this.areas.push(
                                    new CG.MapArea(
                                        new CG.Bound(
                                            parseInt(obj.getAttribute('x')), parseInt(obj.getAttribute('y')), parseInt(obj.getAttribute('width')), parseInt(obj.getAttribute('height'))), this.position, obj.getAttribute('name'), type))
                                console.log('group object found: ' + name)
                                console.log(obj)
                            } else if (obj.getElementsByTagName('polygon').length > 0) {
                                console.log('polygon found: ' + name)
                            } else if (obj.getElementsByTagName('polyline').length > 0) {
                                console.log('polyline found: ' + name)
                            }
                        }
                    }
                    break

            }
            element = element.nextElementSibling
        }


        //get tile properties
        this.tileproperties = Array(parseInt((this.atlaswidth / this.tilewidth)) * parseInt((this.atlasheight / this.tileheight)))
        var tiles = map.xmlDoc.getElementsByTagName('tileset')[0].getElementsByTagName('tile')
        var time = new Date().getTime()
        for (i in tiles) {
            var tprop = new CG.MapTileProperties()
            var tile = tiles[i]

            if (i < this.tileproperties.length) {
                var id = tile.getAttribute('id')
                var properties = tile.getElementsByTagName('properties')[0].getElementsByTagName('property')
                for (p in properties) {
                    if (p < properties.length) {
                        var tp = properties[p]
                        var elem = tp.getAttribute('name')
                        var value = tp.getAttribute('value')
                        if (elem == 'name') {
                            tprop.name = value
                        } else if (elem == 'anim_delay') {
                            tprop.animDelay = parseInt(value)
                            tprop.delayTimer = time
                            this.animated = true
                        } else if (elem == 'anim_direction') {
                            tprop.animDirection = parseInt(value)
                        } else if (elem == 'anim_next') {
                            tprop.animNext = parseInt(value)
                            tprop.animated = true
                        }
                    }
                }
                this.tileproperties[id] = tprop
            }
        }
        return this
    },

    /**
     * @description loadMapJson - load and parse an tilemap json file
     *
     * @param {string/object} jsonfile path or mediaasset object with data of tiled map xml
     */
    loadMapJson:function (jsonfile) {
        this.changemap = ''
        this.animated = false
        this.layers = []

        //from asset
        if (typeof jsonfile == 'string') {
            this.json = JSON.parse(loadString(jsonfile))
        } else {
            this.json = jsonfile.data
        }

        this.removeXmlData()

        //get map
        this.orientation = this.json.orientation
        this.width = this.json.width
        this.height = this.json.height
        this.tilewidth = this.json.tilewidth
        this.tileheight = this.json.tileheight

        //tilesets
        for (i = 0, l = this.json.layers.length; i < l; i++) {
            switch (this.json.layers[i].type) {
                case 'tilelayer':
                    //get tilemap data of layer
                    var tl = new CG.MapTileLayer()
                    tl.tiles = this.json.layers[i].data
                    tl.name = this.json.layers[i].name
                    tl.width = this.json.layers[i].width
                    tl.height = this.json.layers[i].height
                    tl.opacity = this.json.layers[i].opacity
                    tl.visible = this.json.layers[i].visible
                    this.layers.push(tl)
                    break
                case 'objectgroup':
                    //get tilemap data of grouplayer
                    console.log('grouplayer found')
                    var objects = this.json.layers[i].objects
                    for (o in objects) {
                        if (o < objects.length) {
                            var obj = objects[o]
                            var name = obj.name
                            if (obj.gid) {
                                //tile as object/point
                                this.points.push(
                                    new CG.MapPoint(
                                        new CG.Point(
                                            parseInt(obj.x), parseInt(obj.y)), this.position, obj.name, parseInt(obj.gid)))

                                console.log('tile as oject found: ' + name)
                                console.log(obj)
                            } else if (obj.width) {
                                //object group
                                this.areas.push(
                                    new CG.MapArea(
                                        new CG.Bound(
                                            parseInt(obj.x), parseInt(obj.y), parseInt(obj.width), parseInt(obj.height)), this.position, obj.name, obj.properties.type))

                                console.log('group object found: ' + name)
                                console.log(obj)
                            } else if (obj.polygon) {
                                console.log('polygon found: ' + name)
                            } else if (obj.polyline) {
                                console.log('polyline found: ' + name)
                            }
                        }
                    }
                    break

            }
        }


        //get tile properties
        this.atlas.src = 'media/map/' + this.json.tilesets[0].image

        this.atlaswidth = this.json.tilesets[0].imagewidth
        this.atlasheight = this.json.tilesets[0].imageheight
        this.atlastranscol = this.json.tilesets[0].transparentcolor

        this.tileproperties = Array(parseInt((this.atlaswidth / this.tilewidth)) * parseInt((this.atlasheight / this.tileheight)))
        var tiles = this.json.tilesets[0].tileproperties

        var time = new Date().getTime()

        for (id in tiles) {
            var tprop = new CG.MapTileProperties()
            var tile = tiles[id]
            tprop.name = tile.name
            tprop.animDelay = parseInt(tile.anim_delay)
            tprop.delayTimer = (tprop.animDelay > 0) ? time : 0
            tprop.animated = (tprop.animDelay > 0) ? true : false
            tprop.animNext = parseInt(tile.anim_next)
            if (tprop.animDelay > 0) {
                this.animated = true
            }
            tprop.animDirection = parseInt(tile.anim_direction)
            this.tileproperties[id] = tprop

        }
        return this
    },


    /**
     * @description drawMap - draws the map
     *
     * @param {integer} sx top CG.LEFT coord for canvas drawing
     * @param {integer} sy top CG.LEFT coord for canvas drawing
     * @param {integer} bx top CG.LEFT x coord of bound in tilemap
     * @param {integer} by top CG.LEFT y coord of bound in tilemap
     * @param {integer} bw width of bound in tilemap
     * @param {integer} bh height of bound in tilemap
     * @param {callback} callback for collision handling - callback(obj,maptileproperties)
     */
    drawMap:function (sx, sy, bx, by, bw, bh, callback) {
        this.position.x = bx
        this.position.y = by

        this.bx = bx || this.bx || 0
        this.by = by || this.by || 0
        this.bw = bw || Game.bound.width
        this.bh = bh || Game.bound.height
        this.sx = sx || this.sx || 0
        this.sy = sy || this.sy || 0
        this.callback = callback || false

        //update all points an areas
        this.updatePointsAndAreas()

        if (this.changemap != '') {
            this.loadMap(this.changemap)
        }
        if (this.visible) {
            this.updateAnimation()
            if (this.layers.length > 0) {
                for (var layer = 0, l = this.layers.length; layer < l; layer++) {
                    var tl = this.layers[layer]
                    //render control, render by name, layer number or 'all''
                    if (this.renderlayer == tl.name || this.renderlayer == layer || this.renderlayer == 'all') {
                        // MAP ORTHOGONAL
                        if (this.orientation == 'orthogonal' && tl.visible == true) {
                            modx = (this.bx * this.xscale) % this.tilewidth
                            mody = (this.by * this.yscale) % this.tileheight
                            y = this.by
                            my = Math.floor(parseFloat(this.by) / parseFloat(this.tileheight)) >> 0

                            var tmpy = (this.by + this.bh + this.tileheight)
                            while (y < tmpy) {
                                x = this.bx //- this.tilewidth
                                mx = Math.floor(parseFloat(this.bx) / parseFloat(this.tilewidth)) >> 0

                                var tmpx = (this.bx + this.bw + this.tilewidth)
                                while (x < tmpx) {
                                    if ((this.wrapX || (mx >= 0 && mx < this.width)) && (this.wrapY || (my >= 0 && my < this.height))) {
                                        mx2 = mx
                                        my2 = my

                                        while (mx2 < 0) {
                                            mx2 += this.width
                                        }

                                        while (mx2 >= this.width) {
                                            mx2 -= this.width
                                        }

                                        while (my2 < 0) {
                                            my2 += this.height
                                        }

                                        while (my2 >= this.height) {
                                            my2 -= this.height
                                        }

                                        gid = tl.tiles[mx2 + my2 * tl.width] - 1

                                        if (gid >= 0) {
                                            if (modx < 0) {
                                                modx += this.tilewidth
                                            }
                                            if (mody < 0) {
                                                mody += this.tileheight
                                            }
                                            rx = x - modx - this.bx
                                            ry = y - mody - this.by


                                            //time for collision detection?
                                            //limit to specific tilemap layer?
                                            //collision depending on bounds and direction (xspeed/yspeed)?
                                            //include some layer functionality here and render some sprites between map layers?
                                            if (this.elements.length > 0 && this.layertocheck == l) {
                                                for (var o = 0, l = this.elements.length; o < l; o++) {
                                                    if (this.checkMapCollision(this.elements[0], rx, ry)) {
                                                        this.callback(this.elements[o], this.tileproperties[gid])
                                                    }
                                                }
                                            }


                                            //margin/spacing?
                                            cx = (gid % (this.atlaswidth / this.tilewidth)) * this.tilewidth
                                            cy = Math.floor(this.tilewidth * gid / this.atlaswidth) * this.tileheight

                                            Game.b_ctx.save()
                                            Game.b_ctx.globalAlpha = this.layers[layer].opacity
                                            Game.b_ctx.translate(rx, ry)
                                            try {
                                                Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileheight, this.sx, this.sy, this.tilewidth * this.xscale, this.tileheight * this.yscale)
                                            } catch (e) {
                                            }
                                            Game.b_ctx.restore()
                                        }
                                    }
                                    x = x + this.tilewidth
                                    mx += 1
                                }
                                y = y + this.tileheight
                                my += 1
                            }
                        }
                        // MAP ISOMETRIC
                        else if (this.orientation == 'isometric') {
                            var t = tl.width + tl.height
                            for (var y = 0; y < t; y++) {
                                var ry = y
                                var rx = 0
                                while (ry >= tl.height) {
                                    ry -= 1
                                    rx += 1
                                }


                                while (ry >= 0 && rx < tl.width) {
                                    var gid = tl.tiles[rx + ry * tl.width]
                                    var xpos = (rx - ry - 1) * this.tilewidth / 2 - bx
                                    var ypos = (rx + ry + 1) * this.tileheight / 2 - by
                                    if (xpos > -this.tileset.tilewidth && xpos < bw && ypos > -this.tileset.tileheight && ypos < bh) {
                                        if (gid > 0) {
                                            cx = ((gid - 1) % (this.atlaswidth / this.tilewidth)) * this.tilewidth
                                            cy = Math.floor(this.tilewidth * (gid - 1) / this.atlaswidth) * this.tileset.tileheight
                                            Game.b_ctx.save()
                                            Game.b_ctx.globalAlpha = this.layers[layer].opacity
                                            Game.b_ctx.translate(xpos, ypos)
                                            try {
                                                Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileset.tileheight, 0, 0, this.tilewidth * this.xscale, this.tileset.tileheight * this.yscale)
                                            } catch (e) {

                                            }
                                            Game.b_ctx.restore()
                                        }
                                    }
                                    ry -= 1
                                    rx += 1
                                }
                            }
                        }
                    }
                    //                else {
                    //                    throw 'unknown orientation: ' + this.orientation
                    //                }
                }
            }
        }
    },

    /**
     * @description update all areas and points
     */
    updatePointsAndAreas:function () {
        this.points.forEach(function (point, index) {
            point.update()
        }, this)
        this.areas.forEach(function (area, index) {
            area.update()
        }, this)
    },


    /**
     * @description getPointsByName - get all point(s) with the given name
     *
     * @param {string} name of the points to return
     * @return {false/array} returns false or an array with point(s)
     */
    getPointsByName:function (name) {
        points = []
        for (var i = 0, l = this.points.length; i < l; i++) {
            if (this.points[i].name === name) {
                points.push(this.points[i])
            }
        }
        if (points.length > 0) {
            return points
        }
        return false
    },

    /**
     * @description getAreasByName - get all areas with the given name
     *
     * @param {string} name of the area(s) to return
     * @return {false/array} returns false or an array with area(s)
     */
    getAreasByName:function (name) {
        areas = []
        for (var i = 0, l = this.areas.length; i < l; i++) {
            if (this.areas[i].name === name) {
                areas.push(this.areas[i])
            }
        }
        if (areas.length > 0) {
            return areas
        }
        return false
    },


    /**
     * @description setLayerToRender - defines layer drawing, see param options
     *
     * @param {mixed} mixed define the map layer(s) to render 'all' (string) for all layers, array index (integer) for layer to render or 'name' (string) of layer to render'
     */
    setLayerToRender:function (mixed) {
        this.renderlayer = mixed
        return this
    },

    /**
     * @description the update method is not complete yet and only experimental
     * at the final stage the methods updateAnimation and updatePointsAndAreas have to be called from here!
     * Then also a map class can be added to a layer as an element for auto update/draw from Game.director!
     */
    update:function () {
        //TODO automatic movement of map or other stuff?
        this.bx += this.xspeed
        this.by += this.yspeed
        if (this.getBounds().width - Game.bound.width < this.bx) {
            this.xspeed = this.xspeed * -1
        }
        if (this.bx < 0) {
            this.xspeed = this.xspeed * -1
        }
        if (this.getBounds().height - Game.bound.height < this.by) {
            this.yspeed = this.yspeed * -1
        }
        if (this.by < 0) {
            this.yspeed = this.yspeed * -1
        }
        return this
    },

    /**
     * yust calls drawMap ;o)
     */
    draw:function () {
        this.drawMap(this.bx, this.by, this.bw, this.bh, this.sx, this.sy, this.callback)
        return this
    },

    /**
     * @description getBounds - get the bounds of the map
     */
    getBounds:function () {
        return {
            width:this.width * this.tilewidth,
            height:this.height * this.tileheight
        }
    },

    /**
     * @description updateAnimation - updates the map
     *
     * Supported custom tiled map properties for now are (see also tilemap examples):
     * anim_delay       => time to used to display an switch to next tile
     * anim_direction   => direction for next tile 1 = jump forward, -1 = jump back
     * anim_next        => defines the offset
     *
     * With this tile properties it is possible to define tilemap animations. These must be defined in the tilemap property window
     * with key/value pairs
     */
    updateAnimation:function () {
        // update if map is visible
        if (this.visible && this.animated) {
            if (this.layers.length > 0) {
                for (var layer = 0, l = this.layers.length; layer < l; layer++) {
                    var newtime = new Date().getTime()
                    for (t = 0; t < this.layers[layer].tiles.length; t++) {
                        var tile = this.layers[layer].tiles[t]
                        if (tile > 0) {
                            try {
                                var tprop = this.tileproperties[tile - 1]
                                if (tprop.animated && tprop.animDirection != 0) {
                                    if (newtime > (tprop.delayTimer + (tprop.animDelay / this.animDelayFactor))) {
                                        switch (tprop.animDirection) {
                                            case 1:
                                                this.layers[layer].tiles[t] += tprop.animNext
                                                this.tileproperties[tile - 1 + tprop.animNext].delayTimer = newtime
                                                break
                                            case -1:
                                                this.layers[layer].tiles[t] -= tprop.animNext
                                                this.tileproperties[tile - 1 - tprop.animNext].delayTimer = newtime
                                                break
                                            default:
                                                break
                                        }
                                    }
                                }
                            } catch (e) {

                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * @description addElement - adds a object to the element array, used at the moment for collision detection to tilemap
     *
     * @param {obj} element to to add to elements array
     */
    addElement:function (element) {
        this.elements.push(element)
        return this
    },

    /**
     * @description checkMapCollision - checks if the attached element
     * collides with an tile of the tilemap
     *
     * @param {obj} element to check for
     * @param {integer} rx current rx of rendermap method
     * @param {integer} ry current ry of rendermap method
     *
     * @return {boolean} returns true or false
     */
    checkMapCollision:function (element, rx, ry) {
        //TODO return detailed collision object or offsets instead of true?
        if (element.boundingradius > 0) {
            //circular collision
            xr = element.boundingradius / 2 * element.xscale
            yr = element.boundingradius / 2 * element.yscale
            if (element.position.x + xr >= rx && element.position.x - xr <= rx + this.tilewidth && element.position.y + yr >= ry && element.position.y - yr <= ry + this.tileheight) {
                return true
            }
        } else {
            //bounding collision
            xw = element.width / 2 * element.xscale
            yh = element.height / 2 * element.yscale
            if (element.position.x + xw >= rx && element.position.x - xw <= rx + this.tilewidth && element.position.y + yh >= ry && element.position.y - yh <= ry + this.tileheight) {
                return true
            }
        }
        return false
    },

    /**
     * @description checks if a external object(s) collides
     * with the areas of the tiled map. this can be elements from an layer or the map itself.
     *
     * @param {objarray} objarray to check for a areas collision
     * @param {calback} callback what should happen
     */
    checkElementsToAreasCollision:function (objarray, callback) {
        for (var o = 0, ol = objarray.length; o < ol; o++) {

            obj = objarray[o].checkCollision(this.areas, callback)
        }
        return this
    },

    /**
     * @description removes the json data of the map object
     */
    removeJsonData:function () {
        this.json = {}
        return this
    },
    /**
     * @description removes the xml data of the map object
     */
    removeXmlData:function () {
        this.xml = ''
        //this.parser = new DOMParser()
        this.xmlDoc = ''
        return this
    }
})


/**
 * @description class Sequence container to collect/group Translations
 *
 * @constructor
 * @augments Entity
 */
CG.Entity.extend('Sequence', {
    init:function (sequencename) {
        this._super(sequencename)
        this.current = 0
        this.loop = false
        this.translations = []
        return this
    },
    /**
     * @description add a translation object to the sequence array
     *
     * @param {translation} the translation object to add
     */
    addTranslation:function (translationobj) {
        this.translations.push(translationobj)
        return this
    },
    update:function (callback) {
        if (this.current < this.translations.length) {
            if (this.translations[this.current].finished === false) {
                this.translations[this.current].update()
            } else {
                this.current += 1
            }
        } else {
            if (this.loop) {
                this.reset()
            } else {
                //callback?
            }
        }
    },
    draw:function () {

    },
    reset:function () {
        for (var i = 0, l = this.translations.length; i < l; i++) {
            this.translations[i].reset()
        }
        this.current = 0
        return this
    }
})


/**
 * @description class Translate moving a object
 *
 * @constructor
 * @augments Entity
 */
CG.Entity.extend('Translate', {
    init:function () {
        this._super()
        this.type = ''

        this.tx = 0 //translated x value for the object
        this.ty = 0 //translated y value for the object

        this.x1 = 0
        this.y1 = 0
        this.x2 = 0
        this.y2 = 0

        this.bx = 0 //bézier x
        this.by = 0 //bézier y

        this.theobj = {}

        this.r1 = 0
        this.r2 = 0
        this.startangle = 0
        this.angle = 0
        this.speed = 0

        this.steps = 0
        this.step = 0
        this.positions = []
        this.finished = false
        return this
    },
    /**
     * @description initTween
     *
     * @param {obj} obj object to move
     * @param {integer} steps of tween
     * @param {point} startpoint of tween
     * @param {point} endpoint of tween
     * @return {this}
     */
    initTween:function (obj, steps, startpoint, endpoint) {
        this.type = 'tween'
        this.theobj = obj
        this.steps = steps
        this.x1 = startpoint.x
        this.y1 = startpoint.y
        this.x2 = endpoint.x
        this.y2 = endpoint.y

        var xstep = (this.x2 - this.x1) / this.steps
        var ystep = (this.y2 - this.y1) / this.steps
        var tx = this.x1 >> 0   //replace parseInt
        var ty = this.y1 >> 0   //replace parseInt
        //precalc positions and push to array
        for (var i = 0; i <= this.steps; i++) {
            this.positions.push(new CG.Point(tx, ty))
            tx += xstep
            ty += ystep
        }
        return this
    },

    /**
     * @description initOval
     * @param {obj} obj object to move
     * @param {point} centerpoint
     * @param {integer} radius1
     * @param {integer} radius2
     * @param {integer} startangle
     * @param {integer} rotation
     * @return {this}
     */
    initOval:function (obj, centerpoint, radius1, radius2, startangle, rotation) {
        this.type = 'oval'
        this.theobj = obj
        this.x1 = centerpoint.x
        this.y1 = centerpoint.y
        this.r1 = radius1
        this.r2 = radius2
        this.startangle = startangle
        this.speed = rotation

        return this
    },

    /**
     * @description initBezier
     * http://13thparallel.com/archive/bezier-curves/
     *
     * @param {obj} obj object to move
     * @param {integer} steps of bézier curve
     * @param {point} startpoint startpoint of bézier
     * @param {point} endpoint endpoint of bézier
     * @param {point} control1 point for bézier calculation (optional)
     * @param {point} control2 point for bézier calculation (optional)
     * @return {this}
     */
    initBezier:function (obj, steps, startpoint, endpoint, control1, control2) {
        this.type = 'bezier'
        this.theobj = obj  //first argument is always the object to handle
        this.steps = steps
        this.start = endpoint
        this.end = startpoint

        if (this.control2 == 'undefined' && this.control1 == 'undefined') {
            this.control2 = new CG.Point(this.start.x + 3 * (this.end.x - this.start.x) / 4, this.start.y + 3 * (this.end.y - this.start.y) / 4);
        } else {
            this.control2 = control2 || control1
        }
        this.control1 = control1 || new CG.Point(this.start.x + (this.end.x - this.start.x) / 4, this.start.y + (this.end.y - this.start.y) / 4)

        b1 = function (t) {
            return (t * t * t)
        }
        b2 = function (t) {
            return (3 * t * t * (1 - t))
        }
        b3 = function (t) {
            return (3 * t * (1 - t) * (1 - t))
        }
        b4 = function (t) {
            return ((1 - t) * (1 - t) * (1 - t))
        }

        for (var i = 0; i <= this.steps; i++) {
            percent = (1 / this.steps) * i;
            var pos = new CG.Point();
            pos.x = this.start.x * b1(percent) + this.control1.x * b2(percent) + this.control2.x * b3(percent) + this.end.x * b4(percent)
            pos.y = this.start.y * b1(percent) + this.control1.y * b2(percent) + this.control2.y * b3(percent) + this.end.y * b4(percent)
            this.positions.push(pos)
        }

        return this
    },
    draw:function () {
        //TODO layer integration ;o)
    },
    update:function () {
        var obj = this.theobj
        switch (this.type) {
            case 'bezier':
            case 'tween':
                if (this.step < this.steps) {
                    obj.position.x = obj.position._x = this.positions[this.step].x
                    obj.position.y = obj.position._y = this.positions[this.step].y
                    this.step += 1
                } else {
                    this.finished = true
                }
                break
            case 'oval':
                var rad = this.startangle * CG.Const_PI_180
                this.tx = this.x1 - (this.r1 * Math.cos(rad))
                this.ty = this.y1 - (this.r2 * Math.sin(rad))
                this.startangle += this.speed

                if (this.startangle > 360) {
                    this.startangle = 0 + (this.startangle - 360)
                }

                obj.position.x = obj.position._x = this.tx >> 0  //replace parseInt
                obj.position.y = obj.position._y = this.ty >> 0  //replace parseInt
                break
            default:
                break
        }
    },
    draw:function () {

    },
    reset:function () {
        this.step = 0
        this.finished = false
    }

})

/*
 function drawBezier() {
 var C1 = new coord(objDragger[0].x(), objDragger[0].y());
 var C2 = new coord(objDragger[1].x(), objDragger[1].y());
 var C3 = new coord(objDragger[2].x(), objDragger[2].y());
 var C4 = new coord(objDragger[3].x(), objDragger[3].y());

 for(var i=0; i<numPixels; i++) {
 percent = (1/numPixels) * i;
 var pos = getBezier(percent, C1, C2, C3, C4);
 objPixels[i].moveTo(pos.x, pos.y);
 }
 }


 //====================================================================================
 // getBezier() - calculates a given position along a Bezier curve specified by 2,3 or
 //               4 control points.
 //====================================================================================

 //Bezier functions:
 B1 = function(t) { return (t*t*t); }
 B2 = function(t) { return (3*t*t*(1-t)); }
 B3 = function(t) { return (3*t*(1-t)*(1-t)); }
 B4 = function(t) { return ((1-t)*(1-t)*(1-t)); }

 //coordinate constructor
 coord = function (x,y) { if(!x) var x=0; if(!y) var y=0; return {x: x, y: y}; }

 //Finds the coordinates of a point at a certain stage through a bezier curve
 function getBezier(percent,startPos,endPos,control1,control2) {
 //if there aren't any extra control points plot a straight line, if there is only 1
 //make 2nd point same as 1st

 if(!control2 && !control1) var control2 = new coord(startPos.x + 3*(endPos.x-startPos.x)/4, startPos.y + 3*(endPos.y-startPos.y)/4);
 if(!control2) var control2 = control1;
 if(!control1) var control1 = new coord(startPos.x + (endPos.x-startPos.x)/4, startPos.y + (endPos.y-startPos.y)/4);

 var pos = new coord();
 pos.x = startPos.x * B1(percent) + control1.x * B2(percent) + control2.x * B3(percent) + endPos.x * B4(percent);
 pos.y = startPos.y * B1(percent) + control1.y * B2(percent) + control2.y * B3(percent) + endPos.y * B4(percent);

 return pos;
 }
 */


/**
 * @description class Morph to manipulate objects in size and so on
 *
 * @constructor
 * @augments Entity
 *
 * @param {string} mode type of the morph object
 * @param {integer} min min value
 * @param {integer} max max value
 * @param {integer} speed speed value
 */
CG.Entity.extend('Morph', {
    init:function (mode, min, max, speed) {
        this.mode = mode
        this.min = min
        this.max = max
        this.speed = speed
        this.angle = 0
        this.rad = this.max - this.min
        this.val = 0
    },
    update:function () {
        switch (this.mode) {
            case 'sinus':
                var rad = this.angle * CG.Const_PI_180
                this.val = this.rad * Math.sin(rad)
                if (this.val < 0) {
                    this.val = this.val * -1
                }
                this.angle += this.speed

                if (this.angle > 360) {
                    this.angle = 0 + (this.angle - 360)
                }
                break
        }
        return this
    },
    draw:function () {

    },
    /**
     * @description get the current value
     *
     * @return {float}
     */
    getVal:function () {
        return this.val
    }
})



/**
 * @descriptiom class Particle
 *
 * @constructor
 * @augments Sprite
 *
 * @param {mixed} image imgpath, image object or tpimage object to use for the particle
 */

CG.Sprite.extend('Particle', {
    init:function (image) {
        this._super(image, new CG.Point(0, 0))
        this.lifetime = 100
        this.currtime = this.lifetime
        this.aging = 1
        this.fadeout = false
        this.alpha = 1
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


/**
 * @description Emitter class that handles particles
 *
 * @constructor
 * @augments Entity
 *
 * @param {point} position of emitter
 */
CG.Entity.extend('Emitter', {
    init:function (position) {
        this._super()
        this.particles = []     //Particle pool delegated by emitter
        this.maxparticles = 50

        this.creationtime = 100 //time when next particle would be generated/reanimated
        this.currenttime = 0    //current counter
        this.creationspeed = 50 //increase for currenttime

        this.gravity = 0.05

        this.image = null       //Image of the particle
        this.type = ''          //point, corona, plate

        this.position = position || new CG.Point(0, 0)
        this.position._x = this.position.x
        this.position._y = this.position.y

        this.rotation = 0       //rotation of plate emitter
        this.width = 200        //width of line and rectangle emitter
        this.height = 200       //width of rectangle emitter

        this.radius = 0         //radius for corona emitter

        this.pspeed = 10        //particle speed
        this.protation = 0
        this.pdirection = 0     //particle direction UP, DOWN, CG.LEFT, RIGHT
        this.plifetime = 100    //particle lifetime
        this.paging = 1         //particle aging
        this.pfadeout = false   //particle fadeout
        return this
    },
    /*
     * Objective-C style initialisation of all emitter types
     */

    /**
     * @description initAsPoint
     *
     * @param {mixed} image path, image or tpimage to use for the particle
     */

    initAsPoint:function (image) {
        this.image = image
        this.type = 'point'
        return this
    },


    /**
     * @description initAsExplosion
     *
     * @param {mixed} image path, image or tpimage to use for the particle
     * @param {integer} min value for particle speed
     * @param {integer} max value for particle speed
     */
    initAsExplosion:function (image, min, max) {
        this.image = image
        this.type = 'explosion'
        this.min = min
        this.max = max
        return this
    },

    /**
     * @description initAsCorona
     *
     * @param {mixed} image path, image or tpimage to use for the particle
     * @param {integer} radius of the corona emitter
     */
    initAsCorona:function (image, radius) {
        this.image = image
        this.type = 'corona'
        this.radius = radius || 0
        return this
    },

    /**
     * @description initAsLine
     *
     * @param {mixed} image path, image or tpimage to use for the particle
     * @param {integer} width of the plate emitter
     * @param {integer} direction (defined constants) of the plate emitter
     */
    initAsLine:function (image, width, direction) {
        this.image = image
        this.width = width || 200
        this.pdirection = direction || CG.UP
        this.type = 'line'
        return this
    },

    /**
     * @description initAsRectangle
     *
     * @param {mixed} image path, image or tpimage to use for the particle
     * @param {integer} width of the plate emitter
     * @param {integer} direction (defined constants) of the plate emitter
     */
    initAsRectangle:function (image, width, height) {
        this.image = image
        this.width = width || 200
        this.height = height || 200
        this.type = 'rectangle'
        return this
    },


    createParticle:function () {
        particle = new CG.Particle(this.image)
        return particle
    },

    /**
     * @description initParticle
     *
     * @param {particle} initialize particle object
     */
    initParticle:function (particle) {
        if (this.pfadeout) {
            particle.fadeout = true
        }
        particle.gravity = this.gravity     //set particle gravity to emitter gravity
        particle.alpha = 1                  //set alpha back to 1
        particle.visible = true             //make particle visible again
        particle.lifetime = this.plifetime  //reset lifetime
        particle.currtime = this.plifetime
        particle.rotationspeed = this.protation
        switch (this.type) {
            case 'corona':
                //TODO corona like emitter
                var rad = this.getRandom(0, 359) * CG.Const_PI_180

                particle.position.x = this.getX() - (this.radius * Math.cos(rad))
                particle.position.y = this.getY() - (this.radius * Math.sin(rad))

                angl = Math.atan2(particle.position.x - this.getX(), particle.position.y - this.getY()) * CG.Const_180_PI

                particle.xspeed = this.pspeed * Math.sin(angl * CG.Const_PI_180)
                particle.yspeed = this.pspeed * Math.cos(angl * CG.Const_PI_180)

                break
            case 'rectangle':
                //random value in rectangle
                rndx = this.getRandom(this.width / 2 * -1, this.width / 2)
                rndy = this.getRandom(this.height / 2 * -1, this.height / 2)

                particle.position.x = this.position._x - rndx
                particle.position.y = this.position._y - rndy
                particle.xspeed = 0
                particle.yspeed = 0

                break
            case 'line':
                //random value on plate line
                rnd = this.getRandom(this.width / 2 * -1, this.width / 2)

                //handle directions of line emitter
                switch (this.pdirection) {
                    default:
                    case CG.UP:
                        particle.xspeed = 0
                        particle.yspeed = this.pspeed * -1
                        particle.position.x = rnd + this.getX()
                        particle.position.y = this.position._y
                        break
                    case CG.DOWN:
                        particle.xspeed = 0
                        particle.yspeed = this.pspeed
                        particle.position.x = rnd + this.getX()
                        particle.position.y = this.position._y
                        break
                    case CG.LEFT:
                        particle.xspeed = this.pspeed * -1
                        particle.yspeed = 0
                        particle.position.x = this.position._x
                        particle.position.y = rnd + this.getY()
                        break
                    case CG.RIGHT:
                        particle.xspeed = this.pspeed
                        particle.yspeed = 0
                        particle.position.x = this.position._x
                        particle.position.y = rnd + this.getY()
                        break
                }
                break
            case 'explosion':
                particle.position.x = this.position._x
                particle.position.y = this.position._y

                particle.xspeed = this.getRandom(this.min, this.max)
                particle.yspeed = this.getRandom(this.min, this.max)
                break
            case 'point':
            default:
                particle.xspeed = 0
                particle.yspeed = 0
                particle.position.x = this.position._x
                particle.position.y = this.position._y
                break
        }
        return particle
    },

    update:function () {
        if (this.visible) {
            this.currenttime += this.creationspeed
            //particle lifetime
            if (this.currenttime >= this.creationtime) {
                this.currenttime = 0
                if (this.particles.length < this.maxparticles) {
                    this.particles.push(this.initParticle(this.createParticle()))
                }
                else {
                    particle = this.searchInvisibleParticle()   //search inactive particle in 'pool''
                    this.initParticle(particle)
                    this.particles.sort(function (obj1, obj2) {
                            return obj1.currtime - obj2.currtime
                        }
                    )
                }
            }


            for (var i = 0, l = this.particles.length; i < l; i++) {
                this.particles[i].update()
            }
            return this
        }
    },
    draw:function () {
        if (this.visible) {
            for (var i = 0, l = this.particles.length; i < l; i++) {
                this.particles[i].draw()
            }
            return this
        }
    },
    /**
     * @description Each emitter has its own particle pool to prevent object deletion/creation. This method searches an inactive/invisible particle
     */
    searchInvisibleParticle:function () {
        for (var i = 0, l = this.particles.length; i < l; i++) {
            if (this.particles[i].visible == false) {
                return this.particles[i]
            }
        }
        return this
    },

    /**
     * @description setEmitterPosition
     *
     * @param {point} position of the emitter
     */
    setEmitterPosition:function (position) {
        this.position = position
        //    this._x = x
        //    this._y = y
        return this
    },

    /**
     * @description  setName
     *
     * @param {string} name of the object for search with layerobject.getElementByName(name)
     */
    setName:function (name) {
        this.name = name
        return this
    },

    /**
     * @description setCreationTime
     *
     * @param {integer} creationtime
     */
    setCreationTime:function (creationtime) {
        this.creationtime = creationtime
        return this
    },
    /**
     * @description setMaxParticles
     *
     * @param {integer} maxparticle
     */
    setMaxParticles:function (maxparticle) {
        this.maxparticles = maxparticle
        return this
    },
    /**
     * @description setGravity
     *
     * @param {float} gravity for all emitter controlled particles
     */
    setGravity:function (gravity) {
        this.gravity = gravity
        return this
    },

    /*
     * Class Emitter method setParticleSpeed
     * @param {integer} speed set the speed of the particles
     */
    setParticleSpeed:function (speed) {
        this.pspeed = speed
        return this
    },

    /**
     * @description setProtation
     *
     * @param {mixed} rotation set the rotation of the particles
     */
    setProtation:function (rotation) {
        this.protation = rotation
        return this
    },

    /**
     * @description setPLifetime
     *
     * @param {integer} plifetime set the lifetime of the particles
     */
    setPLifetime:function (plifetime) {
        this.plifetime = plifetime
        return this
    },

    /**
     * @description activateFadeout - Activate fadeout of the particles depending on lifetime
     */
    activateFadeout:function () {
        this.pfadeout = true
        return this
    },

    /**
     * @description deactivateFadeout - Deactivate fadeout of the particles depending on lifetime
     */
    deactivateFadeout:function () {
        this.pfadeout = false
        return this
    },

    /**
     * @description getRandom
     *
     * @param {mixed} min value for random number
     * @param {mixed} max value for random number
     */
    getRandom:function (min, max) {
        return Math.random() * (max - min + 1) + min >> 0
    },

    /**
     * @description getX - get x position
     */
    getX:function () {
        return this.position._x
    },

    /**
     * @description getY - Get y position
     */
    getY:function () {
        return this.position._y
    }
})


