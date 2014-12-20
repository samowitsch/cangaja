/**
 * @description
 *
 * CG.GameController extends CG.Stick an represents an GameController with one Stick and
 * multiple buttons
 *
 ```

 ```
 *
 * @class CG.GameController
 * @extends CG.Stick
 *
 */
CG.Stick.extend('GameController', {
    /**
     * Options:
     * x {number}
     * y {number}
     *
     @example
     *
     * @constructor
     * @method init
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        this._super(options)

        CG._extend(this, {
            /**
             * @property buttons
             * @type {Array}
             */
            buttons: [],
            /**
             * @property visible
             * @type {Boolean}
             */
            visible: true
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

            // TODO recognize left vs right touch
            // TODO recognize count of touches

            // analog stick
            var touch = e.touches[0];
            if (this.identifier === -1) {
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
            }

            // 'button' touches
            if (e.touches.length > 1 && this.active) {
                var touch = e.touches[1]
                CG.mousedown = true
                CG.mouse = {
                    x: touch.pageX,
                    y: touch.pageY
                }
            }

        }.bind(this));

        Game.canvas.addEventListener("touchmove", function (e) {
            e.preventDefault();

            for (var i = 0; i < e.touches.length; ++i) {
                var touch = e.touches[i];
                if (touch.identifier === this.identifier) {
                    this.setInputXY(touch.pageX, touch.pageY);
                }
            }
        }.bind(this));

        Game.canvas.addEventListener("touchend", function (e) {
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

        this._super()

        for (var i = 0, l = this.buttons.length; i < l; i++) {
            this.buttons[i].draw()
        }
    },
    update: function () {
        if (!this.active) {
            return
        }

        this._super()

        for (var i = 0, l = this.buttons.length; i < l; i++) {
            this.buttons[i].update()
        }
    }
})


