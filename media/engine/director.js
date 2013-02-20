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


