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


