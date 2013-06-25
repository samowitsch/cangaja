/**
 * @description
 *
 * CG.Sequence container to collect/group CG.Translation objects
 *
 * @class CG.Sequence
 * @extends Entity
 */
CG.Entity.extend('Sequence', {
    /**
     * @constructor
     * @method init
     * @param sequencename
     * @return {*}
     */
    init: function (sequencename) {
        this._super(sequencename)
        /**
         * @property current
         * @type {Number}
         */
        this.current = 0
        /**
         * @property loop
         * @type {Boolean}
         */
        this.loop = false
        /**
         * @property translations
         * @type {Array}
         */
        this.translations = []
        return this
    },
    /**
     * @description add a translation object to the sequence array
     * @method addTranslation
     * @param translationobj {translation} the translation object to add
     * @return {*}
     */
    addTranslation: function (translationobj) {
        this.translations.push(translationobj)
        return this
    },
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
    draw: function () {

    },
    reset: function () {
        for (var i = 0, l = this.translations.length; i < l; i++) {
            this.translations[i].reset()
        }
        this.current = 0
        return this
    }
})


