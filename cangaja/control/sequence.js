/**
 * @description
 *
 * CG.Sequence container to collect/group CG.Translation objects
 *
 ```

 sequence = new CG.Sequence({
   loop: true
 })

 sequence.addTranslation(
 new CG.Translate().initBezier({
    object: layersprites.elements[layersprites.elements.length - 2],
    steps: 200,
    startPoint: new CG.Point(500, 450),
    endPoint: new CG.Point(100, 100),
    control1: new CG.Point(-600, 600),
    control2: new CG.Point(1200, -300)
    }))
 .addTranslation(new CG.Translate().initTween({
        object: layersprites.elements[layersprites.elements.length - 2],
        steps: 200,
        startPoint: new CG.Point(100, 100),
        endPoint: new CG.Point(550, 150)
    }))
 .addTranslation(new CG.Translate().initTween({
        object: layersprites.elements[layersprites.elements.length - 2],
        steps: 150,
        startPoint: new CG.Point(550, 150),
        endPoint: new CG.Point(100, 400)
    }))
 .addTranslation(new CG.Translate().initTween({
        object: layersprites.elements[layersprites.elements.length - 2],
        steps: 100,
        startPoint: new CG.Point(100, 400),
        endPoint: new CG.Point(550, 450)
    }))

 ```
 *
 * @class CG.Sequence
 * @extends Class
 */
CG.Class.extend('Sequence', {
    /**
     * @constructor
     * @method init
     * @return {*}
     */
    init: function (options) {
        CG._extend(this, {

            /**
             * @property current
             * @type {Number}
             */
            current: 0,
            /**
             * @property loop
             * @type {Boolean}
             */
            loop: false,
            /**
             * @property translations
             * @type {Array}
             */
            translations: []
        })

        if (options) {
            CG._extend(this, options)
        }

        return this
    },
    /**
     * @description add a translation object to the sequence array
     * @method addTranslation
     * @param translationObj {translation} the translation object to add
     * @return {*}
     */
    addTranslation: function (translationObj) {
        this.translations.push(translationObj)
        return this
    },
    /**
     * @method update
     */
    update: function (callback) {
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
    /**
     * @method draw
     */
    draw: function () {

    },
    /**
     * @method reset
     */
    reset: function () {
        for (var i = 0, l = this.translations.length; i < l; i++) {
            this.translations[i].reset()
        }
        this.current = 0
        return this
    }
})


