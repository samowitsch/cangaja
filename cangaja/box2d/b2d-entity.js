/**
 * @description
 *
 * B2DEntity is the base class with properties for all B2D objects.
 * This class handles also the drawings for all classes.
 *
 * @class CG.B2DEntity
 * @extends CG.Entity
 */

CG.Entity.extend('B2DEntity', {
    /**
     * @method init
     * @constructor
     * @param name      {String}      id or name to identify
     * @param image     {mixed}       path to image, image or atlasimage from asset
     * @param world     {object}      reference to world of B2DWorld
     * @param x         {Number}     the x position
     * @param y         {Number}     the y position
     * @param scale     {Number}     the world scale of B2DWorld
     * @return {*}
     */

    init:function (name, image, world, x, y, scale) {
        this._super()
        this.instanceOf = 'B2DEntity'
        this.setImage(image)
        /**
         * @property body
         * @type {b2Body}
         */
        this.body = {}
        /**
         * @property alpha
         * @type {Number}
         */
        this.alpha = 1
        /**
         * @property x
         * @type {Number}
         */
        this.x = x
        /**
         * @property y
         * @type {Number}
         */
        this.y = y
        /**
         * @property scale
         * @type {Number}
         */
        this.scale = scale
        /**
         * @property id
         * @type {Object}
         */
        this.id = {name:name, uid:0}
        /**
         * @property world
         * @type {b2World}
         */
        this.world = world
        /**
         * @property xhandle
         * @type {Number}
         */
        this.xhandle = (this.width / 2)
        /**
         * @property yhandle
         * @type {Number}
         */
        this.yhandle = (this.height / 2)
        if(!this.bodyDef){
            /**
             * @property bodyDef
             * @type {b2BodyDef}
             */
            this.bodyDef = new b2BodyDef
            /**
             * @property bodyDef.alowSleep
             * @type {Boolean}
             */
            this.bodyDef.allowSleep = true
            /**
             * @property bodyDef.awake
             * @type {Boolean}
             */
            this.bodyDef.awake = true
        }

        if(!this.fixDef) {
            /**
             * @property fixDef
             * @type {b2FixtureDef}
             */
            this.fixDef = new b2FixtureDef
            /**
             * @property fixDef.density
             * @type {Number}
             */
            this.fixDef.density = 1.0
            /**
             * @property fixDef.friction
             * @type {Number}
             */
            this.fixDef.friction = 0.5
            /**
             * @property fixDef.restitution
             * @type {Number}
             */
            this.fixDef.restitution = 0.5
        }
        /**
         * @property isHit
         * @type {Boolean}
         */
        this.isHit = false;
        /**
         * @property strength
         * @type {Number}
         */
        this.strength = 100;
        /**
         * @property dead
         * @type {Boolean}
         */
        this.dead = false;

        return this
    },
    /**
     * @method hit
     * @param impulse
     * @param source
     */
    hit:function (impulse, source) {
        this.isHit = true;
        if (this.strength) {
            this.strength -= impulse;
            if (this.strength <= 0) {
                this.dead = true
            }
        }
    },
    update:function () {
    },
    draw:function () {

        Game.renderer.draw(this)

    }
})


