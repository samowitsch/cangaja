/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description B2DPolygon - uses PhysicsEditor export Lime + Corona (json)
 * supported options are friction, density and bounce
 *
 * @augments B2DEntity
 * @constructor
 */

CG.B2DEntity.extend('B2DPolygon', {
    init:function (world, name, image, jsonpoly, x, y, scale, stat, bullet) {
        this._super()
        this.world = world

        this.id = {name:name, uid:0}

        this.setImage(image)
        this.x = x
        this.y = y
        this.scale = scale
        this.stat = stat || false
        this.bullet = bullet || false

        this.polys = new Array()
        this.vecs = new Array()
        this.jsondata = jsonpoly.data[jsonpoly.name]


        this.xhandle = 0
        this.yhandle = 0


        this.vecs = this.createVecs(jsonpoly) // build grouped b2vecs from physicseditor

        if (this.stat) {
            this.bodyDef.type = b2Body.b2_staticBody
        } else {
            this.bodyDef.type = b2Body.b2_dynamicBody
        }

        this.bodyDef.position.Set(this.x / this.scale, this.y / this.scale)
        this.bodyDef.userData = this.id
        this.bodyDef.bullet = this.bullet
        this.body = this.world.CreateBody(this.bodyDef)

        for (var i = 0, l = this.vecs.length; i < l; i++) {
            this.bodyShapePoly = new b2PolygonShape
            this.bodyShapePoly.bounce = this.jsondata[i].restitution        //value from physics editor
            this.bodyShapePoly.SetAsArray(this.vecs[i], this.vecs[i].length)
            this.fixDef.density = this.jsondata[i].density                  //value from physics editor
            this.fixDef.friction = this.jsondata[i].friction                //value from physics editor

            this.fixDef.shape = this.bodyShapePoly
            this.body.CreateFixture(this.fixDef)
        }
        return this

    },
    createVecs:function () {
        var vecs = []
        for (var i = 0, l = this.jsondata.length; i < l; i++) {
            poly = this.jsondata[i].shape
            var temp = []
            for (var i2 = 0, l2 = poly.length; i2 < l2; i2 = i2 + 2) {
                vec = new b2Vec2(poly[i2] / this.scale, poly[i2 + 1] / this.scale)
                temp.push(vec)
            }
            vecs.push(temp)
        }
        return vecs
    }
})


