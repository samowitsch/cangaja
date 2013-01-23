/**
 * @description class Translate moving a object
 *
 * @constructor
 * @augments Entity
 */
CG.Entity.extend('Translate', {
    init: function() {
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
    initTween: function(obj, steps, startpoint, endpoint) {
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
    initOval: function(obj, centerpoint, radius1, radius2, startangle, rotation) {
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
    initBezier: function(obj, steps, startpoint, endpoint, control1, control2) {
        this.type = 'bezier'
        this.theobj = obj  //first argument is always the object to handle
        this.steps = steps
        this.start = endpoint
        this.end = startpoint

        if ( this.control2 == 'undefined' && this.control1 == 'undefined' )
        {
            this.control2 = new CG.Point(this.start.x + 3*(this.end.x-this.start.x)/4, this.start.y + 3*(this.end.y-this.start.y)/4);
        } else {
            this.control2 = control2 || control1
        }
        this.control1 = control1 || new CG.Point(this.start.x + (this.end.x-this.start.x)/4, this.start.y + (this.end.y-this.start.y)/4)

        b1 = function(t){
            return (t*t*t)
        }
        b2 = function(t){
            return (3*t*t*(1-t))
        }
        b3 = function(t){
            return (3*t*(1-t)*(1-t))
        }
        b4 = function(t){
            return ((1-t)*(1-t)*(1-t))
        }

        for ( var i=0; i<=this.steps; i++ )
        {
            percent = (1/this.steps) * i;
            var pos = new CG.Point();
            pos.x = this.start.x * b1(percent) + this.control1.x * b2(percent) + this.control2.x * b3(percent) + this.end.x * b4(percent)
            pos.y = this.start.y * b1(percent) + this.control1.y * b2(percent) + this.control2.y * b3(percent) + this.end.y * b4(percent)
            this.positions.push(pos)
        }

        return this
    },
    draw: function() {
    //TODO layer integration ;o)
    },
    update: function() {
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
                var rad = this.startangle * Const_PI_180
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
    draw: function () {
    
    },
    reset: function() {
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