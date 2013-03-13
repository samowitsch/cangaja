/**
 * @description
 *
 * CG.Director the top instance for CG.Screens, CG.Layers, CG.Sprites and so on in the control hierarchy.
 * Its main purpose is to collect CG.Screens under its hood and support some basic screen fading features.
@example
    //create top level CG.Director object
    var director = new CG.Director()

    //create a CG.Screen
    var mainscreen = new CG.Screen('mainscreen')

    //create a CG.Layer
    var mainlayer = new CG.Layer('mainlayer')

    //create a demo CG.Sprite
    var demosprite = new CG.Sprite(Game.asset.getImageByName('spritegfx'), new CG.Point(400, 240))

    //add/attach the demo sprite to the layer
    mainlayer.addElement(back)

    //add/attach mainscreen and mainlayer to the director
    director.addScreen(mainscreen.addLayer(mainlayer))

 * @class CG.Director
 * @extends Class
 */
CG.Class.extend('Director', {
    /**
     * @method init
     * @constructor
     * @return {*}
     */
    init:function () {
        /**
         * @property screens
         * @type {Array}
         */
        this.screens = []
        /**
         * @property activescreen
         * @type {Number}
         */
        this.activescreen = 0
        /**
         * @description nextscreen
         * @type {Number}
         */
        this.nextscreen = 0
        /**
         * @property duration
         * @type {Number}
         */
        this.duration = 20
        /**
         * @description alpha
         * @type {Number}
         */
        this.alpha = 0
        /**
         * @description fademode
         * @type {String}
         */
        this.fademode = 'fade'      //fade or scale
        /**
         * @property color
         * @type {String}
         */
        this.color = 'rgb(0,0,0)'
        return this
    },
    update:function () {
        //handle screen fading
        switch (this.fademode) {
            case 'scale':
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
     * @method addScreen
     *
     * @param {CG.Screen} screen to add to the screen list
     */
    addScreen:function (screen) {
        this.screens.push(screen)
        return this
    },
    /**
     * @method nextScreen
    @example
        //tell the director class to fade to next screen with scale mode
        Game.director.setFadeMode('scale');
        Game.director.nextScreen('gamescreen', 10);

        //tell the director class to fade to next screen
        Game.director.setFadeMode('fade');
        Game.director.nextScreen('settingsscreen', 10);
     *
     * @param {string} screenname to define nextscreen for fading
     * @param {Number} duration the duration for fading
     */
    nextScreen:function (screenname, duration) {
        if (this.getIndexOfScreen(screenname) != this.activescreen) {
            this.duration = duration
            this.nextscreen = this.getIndexOfScreen(screenname)
        }
    },

    /**
     * @method getScreenByName
     *
     * @param {string} screenname to find screen by name
     * @return {false/CG.Screen} returns false or the screen object
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
     * @method getIndexOfScreen
     *
     * @param {string} screenname to find index of screen in screen array
     * @return {false/Number} return false or index number of the screen
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
     * @method getActiveScreenName
     *
     * @return {string} the name of the active screen
     */
    getActiveScreenName:function () {
        return this.screens[this.activescreen].name
    },

    /**
     * @method setFadeMode
     *
     * @return {String} fademode for screen transitions => fade or scale
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