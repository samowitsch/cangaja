/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DLine
 *
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DLine', {
    /**
     *
     * @param world     object      reference to world of B2DWorld
     * @param name      string      id or name to identify
     * @param start     b2Vec2      start of line
     * @param end       b2Vec2      end of line
     * @param scale     integer     the world scale of B2DWorld
     * @return {*}
     */
    init:function (world, name, start, end, scale) {
        this._super(name, false, world, 0, 0, scale) //TODO clean arguments?

        this.start = start
        this.end = end

        this.xhandle = 0
        this.yhandle = 0

        this.fixDef.shape = new b2PolygonShape
        this.fixDef.shape.SetAsArray([this.start, this.end], 2)

        this.bodyDef.type = b2Body.b2_staticBody
        this.bodyDef.position.Set(0 / this.scale, 0 / this.scale)
        this.bodyDef.userData = this.id

        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this
    },
    update:function () {

    },
    draw:function () {

    }
})


