/**
 * extend B2DPolygon and define own bodyDef/fixDef and some additional properties/methods
 */
CG.B2DPolygon.extend('B2DPlayer', {
    init: function (options) {
        this._super(options)

        this.jump = false
        this.max_hor_vel = 11
        this.max_ver_vel = 11

        this.points = 0
        this.offhor = 20
        this.offver = 20
    }
})

/**
 * extend B2DPlayer with additional font drawing
 */
CG.B2DPlayer.extend('B2DRightPlayer', {
    init: function (options) {
        this._super(options)

        this.shadow = new CG.Sprite({
            image: Game.asset.getImageByName('beachvolleyball-shadow'),
            position: new CG.Point((this.body.GetPosition().x + 58) * this.scale, Game.height - 50),
            xscale: 1.3,
            name: 'beachvolleyball-shadow'
        })
        mainlayer.addElement(this.shadow)

    },
    draw: function () {
        this._super()
        this.font.drawText('' + this.points, Game.width - this.offhor - this.font.getTextWidth('' + this.points), this.offver)

    },
    update: function () {
        this._super()
        this.shadow.position.x = (this.body.GetPosition().x + 1.45) * this.scale
        this.shadow.xscale = this.shadow.yscale = (this.body.GetPosition().y * this.scale) / 250
    }
})

/**
 * extend B2DPlayer with additional font drawing
 */
CG.B2DPlayer.extend('B2DLeftPlayer', {
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