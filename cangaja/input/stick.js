/**
 * @description
 *
 * CG.Stick
 *
 * @class CG.Stick
 * @extends CG.Class
 *
 */
CG.Class.extend('Stick', {
    /**
     * Options:
     * x {number}
     * y {number}
     *
     @example
     var b = new CG.Stick({
           maxLength: 0,
           active: false
         })
     *
     * @constructor
     * @method init
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        CG._extend(this, {
            /**
             * @property active
             * @type {Boolean}
             */
            active: false,
            /**
             * @property identifier
             * @type {Number}
             */
            identifier: -1,
            /**
             * @property handle
             * @type {Number}
             */
            handle: CG.LEFT_HAND,
            /**
             * @property atLimit
             * @type {Boolean}
             */
            atLimit: false,
            /**
             * @property length
             * @type {Number}
             */
            length: 1,
            /**
             * @property maxLength
             * @type {Number}
             */
            maxLength: 0,
            /**
             * @property limit
             * @type {Object}
             */
            limit: {x: 0, Y: 0},
            /**
             * @property input
             * @type {Object}
             */
            input: {x: 0, Y: 0},
            /**
             * @property normal
             * @type {Object}
             */
            normal: {x: 0, Y: 0}
        })

        if (options) {
            CG._extend(this, options)
        }

        this.addEventListener()

        return this
    },
    addEventListener: function () {
        Game.canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();

            if (this.active) {
                return
            }

            var touch = e.touches[0];

            if (this.handle === CG.LEFT_HAND && touch.pageX < Game.width2) {
                this.setLimitXY(touch.pageX, touch.pageY)
                this.setInputXY(touch.pageX, touch.pageY)
                this.active = true
                this.identifier = touch.identifier
            } else if (this.handle === CG.RIGHT_HAND && touch.pageX > Game.width2) {
                this.setLimitXY(touch.pageX, touch.pageY)
                this.setInputXY(touch.pageX, touch.pageY)
                this.active = true
                this.identifier = touch.identifier
            }


        }.bind(this));

        document.addEventListener("touchmove", function (e) {
            e.preventDefault();

            for (var i = 0; i < e.touches.length; ++i) {
                var touch = e.touches[i];
                if (touch.identifier === this.identifier) {
                    this.setInputXY(touch.pageX, touch.pageY);
                }
            }
        }.bind(this));

        document.addEventListener("touchend", function (e) {
            for (var i = 0; i < e.changedTouches.length; ++i) {
                var touch = e.changedTouches[i];
                if (touch.identifier === this.identifier) {
                    this.active = false
                    this.identifier = -1
                }
            }
        }.bind(this));
    },
    draw: function () {
        if (!this.active) {
            return
        }

        Game.b_ctx.save()

        // limit
        Game.b_ctx.beginPath()
        Game.b_ctx.strokeStyle = 'rgb(200,200,200)'
        Game.b_ctx.lineWidth = 3
        Game.b_ctx.arc(this.limit.x, this.limit.y, this.maxLength, 0, (Math.PI * 2), true)
        Game.b_ctx.stroke()

        // base
        Game.b_ctx.beginPath()
        Game.b_ctx.arc(this.limit.x, this.limit.y, this.maxLength, 0, (Math.PI * 2), true)
        Game.b_ctx.stroke()

        // input
        Game.b_ctx.beginPath();
        Game.b_ctx.arc(this.input.x, this.input.y, this.maxLength / 1.5, 0, (Math.PI * 2), true)
        Game.b_ctx.fillStyle = "rgb(0, 0, 200)"
        Game.b_ctx.fill()

        Game.b_ctx.restore()
    },
    update: function () {
        if (!this.active) {
            return
        }

        var diff = this.subtractVectors(this.input, this.limit)
        var length = this.getVectorLength(diff)

        if (Math.round(length) >= this.maxLength) {
            length = this.maxLength

            var rads = this.getRadians(diff.x, diff.y)

            this.atLimit = true;
            this.input = this.getVectorFromRadians(rads, length)
            this.input.x += this.limit.x
            this.input.y += this.limit.y
        } else {
            this.atLimit = false;
        }

        this.length = length;
        this.normal = this.getVectorNormal(diff)
    },
    getRadians: function (x, y) {
        return Math.atan2(x, -y)
    },
    getVectorFromRadians: function (radians, length) {
        var length = (Number(length) || 1)
        return {
            x: (Math.sin(radians) * length),
            y: (-Math.cos(radians) * length)
        }
    },
    getVectorLength: function (v) {
        return Math.sqrt((v.x * v.x) + (v.y * v.y))
    },
    getVectorNormal: function (v) {
        var len = this.getVectorLength(v)
        if (len === 0) {
            return v
        } else {
            return {
                x: (v.x * (1 / len)),
                y: (v.y * (1 / len))
            }
        }
    },
    setLimitXY: function (x, y) {
        this.limit = {
            x: x,
            y: y
        }
    },
    setInputXY: function (x, y) {
        this.input = {
            x: x,
            y: y
        }
    },
    subtractVectors: function (v1, v2) {
        return {
            x: (v1.x - v2.x),
            y: (v1.y - v2.y)
        }
    }
})


