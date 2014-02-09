/**
 * @description
 *
 * CG.Translate moving a object
 *
 * @class CG.Translate
 * @extends CG.Class
 */
CG.Class.extend('Translate', {
    /**
     * @constructor
     * @method init
     * @return {*}
     */
    init: function () {
        /**
         * @property type
         * @type {String}
         */
        this.type = ''
        /**
         * @property tx
         * @type {Number}
         */
        this.tx = 0 //translated x value for the object
        /**
         * @property ty
         * @type {Number}
         */
        this.ty = 0 //translated y value for the object
        /**
         * @property x1
         * @type {Number}
         */
        this.x1 = 0
        /**
         * @property y1
         * @type {Number}
         */
        this.y1 = 0
        /**
         * @property x2
         * @type {Number}
         */
        this.x2 = 0
        /**
         * @property y2
         * @type {Number}
         */
        this.y2 = 0
        /**
         * @property bx
         * @type {Number}
         */
        this.bx = 0 //bézier x
        /**
         * @property by
         * @type {Number}
         */
        this.by = 0 //bézier y
        /**
         * @property object
         * @type {Object}
         */
        this.object = {}
        /**
         * @property r1
         * @type {Number}
         */
        this.r1 = 0
        /**
         * @property r2
         * @type {Number}
         */
        this.r2 = 0
        /**
         * @property startangle
         * @type {Number}
         */
        this.startangle = 0
        /**
         * @property angle
         * @type {Number}
         */
        this.angle = 0
        /**
         * @property speed
         * @type {Number}
         */
        this.speed = 0
        /**
         * @property steps
         * @type {Number}
         */
        this.steps = 0
        /**
         * @property step
         * @type {Number}
         */
        this.step = 0
        /**
         * @property positions
         * @type {Array}
         */
        this.positions = []
        /**
         * @property finished
         * @type {Boolean}
         */
        this.finished = false
        return this
    },
    /**
     * Options:
     * object {object}
     * steps {number}
     * startpoint {CG.Point}
     * endpoint {CG.Point}
     *
     @example
     var t = new CG.Translate()
     t.initTween({
        object: Sprite,
        steps: 10,
        startpoint: new CG.Point(10, 10),
        endpoint: new CG.Point(320, 160)
     })
     *
     * 
     * @method initTween
     *
     * @param options {Object}
     * @return {this}
     */
    initTween: function (options) {
        this.type = 'tween'

        if (options) {
            CG._extend(this, options)
        }

        this.x1 = this.startpoint.x
        this.y1 = this.startpoint.y
        this.x2 = this.endpoint.x
        this.y2 = this.endpoint.y

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
     * Options:
     * object {object}
     * centerpoint {CG.Point}
     * radius1 {number}
     * radius {number}
     * startangle {number}
     * rotation {number}
     *
     @example
     var t = new CG.Translate()
     t.initOval({
        object: spr1,
        centerpoint: new CG.Point(320, 160),
        radius1: 50,
        radius2: 50,
        startangle: 90,
        rotation: 5
     })
     * 
     * @method initOval
     * @param options {Object}
     * @return {this}
     */
    initOval: function (options) {
        this.type = 'oval'

        if (options) {
            CG._extend(this, options)
        }

        this.x1 = this.centerpoint.x
        this.y1 = this.centerpoint.y
        this.r1 = this.radius1
        this.r2 = this.radius2
        this.speed = this.rotation

        return this
    },

    /**
     * Options:
     * object {object}
     * steps {number}
     * startpoint {CG.Point}
     * endpoint {CG.Point}
     * control1 {CG.Point}
     * control2 {CG.Point}
     *
     @example
     var t = new CG.Translate()
     t.initBezier({
        object: spr1,
        steps: 10,
        startpoint: new CG.Point(320, 160),
        endpoint: new CG.Point(0, 10),
        control1: new CG.Point(340, 180),
        control2: new CG.Point(0, 0)
     })
     *
     * @description initBezier
     * http://13thparallel.com/archive/bezier-curves/
     *
     * @method initBezier
     *
     * @param options {Object}
     * @return {this}
     */
    initBezier: function (options) {
        this.type = 'bezier'

        if (options) {
            CG._extend(this, options)
        }

        this.start = this.endpoint
        this.end = this.startpoint

        if (this.control2 == 'undefined' && this.control1 == 'undefined') {
            this.control2 = new CG.Point(this.start.x + 3 * (this.end.x - this.start.x) / 4, this.start.y + 3 * (this.end.y - this.start.y) / 4);
        } else {
            this.control2 = this.control2 || this.control1
        }
        this.control1 = this.control1 || new CG.Point(this.start.x + (this.end.x - this.start.x) / 4, this.start.y + (this.end.y - this.start.y) / 4)

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
    /**
     * @method update
     */
    update: function () {
        var obj = this.object
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
    /**
     * @method draw
     */
    draw: function () {
    },
    /**
     * @method reset
     */
    reset: function () {
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


