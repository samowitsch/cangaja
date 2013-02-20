/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DCircle
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DCircle', {
    /**
     *
     * @param world     object      reference to world of B2DWorld
     * @param name      string      id or name to identify
     * @param image     mixed       path to image, image or tpimage from asset
     * @param radius    integer     json file from PhysicsEditor from asset
     * @param x         integer     the x position
     * @param y         integer     the y position
     * @param scale     integer     the world scale of B2DWorld
     * @param stat      boolean     is the body static or dynamic
     * @return {*}
     */
    init:function (world, name, image, radius, x, y, scale, stat) {
        this._super(name, image, world, x, y, scale)

        this.radius = this.width / 2

        this.stat = stat || false

        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }
        this.fixDef.shape = new b2CircleShape(this.radius / this.scale)
        this.bodyDef.position.x = this.x / this.scale
        this.bodyDef.position.y = this.y / this.scale
        this.bodyDef.userData = this.id

        this.body = this.world.CreateBody(this.bodyDef)
        this.body.CreateFixture(this.fixDef)

        return this

    }
})


