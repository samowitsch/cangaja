
/**
 * extend B2DPolygon and define own bodyDef/fixDef and some additional properties/methods
 */
CG.B2DPolygon.extend('B2DPlayer', {
    init: function (options) {
        this._super(options)

        this.bodyDef = new b2BodyDef
        this.bodyDef.fixedRotation = true
        this.bodyDef.allowSleep = false
        this.bodyDef.bullet = true

        this.fixDef = new b2FixtureDef
        this.fixDef.restitution = 0.1
        this.linearDamping = 0
        this.angularDamping = 0

    }
})

/**
 * extend B2DPlayer
 */
CG.B2DPlayer.extend('Clonk', {
    init: function (options) {
        this._super(options)


    },
    draw: function () {
        this._super()

    },
    update: function () {
        this._super()

    }
})