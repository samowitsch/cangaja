/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DEntity
 * @augments Entity
 * @constructor
 */

CG.Entity.extend('B2DEntity', {
    init:function (name) {
        this._super(name)

        this.fixDef = new b2FixtureDef

        this.bodyDef = new b2FixtureDef
    },
    createBox:function (world, image, x, y, scale, stat) {
        this.world = world
        this.image = image
        this.x = x
        this.y = y
        this.scale = scale
        this.stat = stat
    },
    createSphere:function (world, image, radius, x, y, scale, stat) {
        this.world = world
        this.image = image
        this.radius = radius
        this.x = x
        this.y = y
        this.scale = scale
        this.stat = stat
    },
    createPolyBody:function () {

    },
    createBridge:function () {

    },
    createRope:function () {

    },
    update:function () {
    },
    draw:function () {
    }
})


