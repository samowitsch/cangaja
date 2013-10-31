/**
 * @description
 *
 * CG.Emitter that handles . . . particles.
 *
 * @class CG.Emitter
 * @extends CG.Entity
 *
 * @param {point} position of emitter
 */
CG.Entity.extend('Emitter', {
    /**
     * @method init
     * @constructor
     * @param position {CG.Point}
     * @return {*}
     */
    init:function (position) {
        this._super()
        /**
         * @property particle
         * @type {Array}
         */
        this.particles = []     //Particle pool delegated by emitter
        /**
         * @property maxparticles
         * @type {Number}
         */
        this.maxparticles = 50
        /**
         * @property creationtime
         * @type {Number}
         */
        this.creationtime = 100 //time when next particle would be generated/reanimated
        /**
         * @property currenttime
         * @type {Number}
         */
        this.currenttime = 0    //current counter
        /**
         * @property creationspeed
         * @type {Number}
         */
        this.creationspeed = 50 //increase for currenttime
        /**
         * @property gravity
         * @type {Number}
         */
        this.gravity = 0.05
        /**
         * @property image
         * @type {null}
         */
        this.image = null       //Image of the particle
        /**
         * @property type
         * @type {String}
         */
        this.type = ''          //point, corona, plate
        /**
         * @property position
         * @type {CG.Point}
         */
        this.position = position || new CG.Point(0, 0)
        this.position._x = this.position.x
        this.position._y = this.position.y
        /**
         * @property rotation
         * @type {Number}
         */
        this.rotation = 0       //rotation of plate emitter
        /**
         * @property width
         * @type {Number}
         */
        this.width = 200        //width of line and rectangle emitter
        /**
         * @property height
         * @type {Number}
         */
        this.height = 200       //width of rectangle emitter
        /**
         * @property radius
         * @type {Number}
         */
        this.radius = 0         //radius for corona emitter
        /**
         * @property pspeed
         * @type {Number}
         */
        this.pspeed = 10        //particle speed
        /**
         * @property protation
         * @type {Number}
         */
        this.protation = 0
        /**
         * @property pdirection
         * @type {Number}
         */
        this.pdirection = 0     //particle direction UP, DOWN, CG.LEFT, RIGHT
        /**
         * @property plifetime
         * @type {Number}
         */
        this.plifetime = 100    //particle lifetime
        /**
         * @property paging
         * @type {Number}
         */
        this.paging = 1         //particle aging
        /**
         * @property pfadeout
         * @type {Boolean}
         */
        this.pfadeout = false   //particle fadeout
        return this
    },
    /*
     * Objective-C style initialisation of all emitter types
     */

    /**
     * @method initAsPoint
     *
     * @param {mixed} image path, image or atlasimage to use for the particle
     */
    initAsPoint:function (image) {
        this.image = image
        this.type = 'point'
        return this
    },


    /**
     * @method initAsExplosion
     *
     * @param {mixed} image path, image or atlasimage to use for the particle
     * @param {Number} min value for particle speed
     * @param {Number} max value for particle speed
     */
    initAsExplosion:function (image, min, max) {
        this.image = image
        this.type = 'explosion'
        this.min = min
        this.max = max
        return this
    },

    /**
     * @method initAsCorona
     *
     * @param {mixed} image path, image or atlasimage to use for the particle
     * @param {Number} radius of the corona emitter
     */
    initAsCorona:function (image, radius) {
        this.image = image
        this.type = 'corona'
        this.radius = radius || 0
        return this
    },

    /**
     * @method initAsLine
     *
     * @param {mixed} image path, image or atlasimage to use for the particle
     * @param {Number} width of the plate emitter
     * @param {Number} direction (defined constants) of the plate emitter
     */
    initAsLine:function (image, width, direction) {
        this.image = image
        this.width = width || 200
        this.pdirection = direction || CG.UP
        this.type = 'line'
        return this
    },

    /**
     * @method initAsRectangle
     *
     * @param {mixed} image path, image or atlasimage to use for the particle
     * @param {Number} width of the plate emitter
     * @param {Number} height (defined constants) of the plate emitter
     */
    initAsRectangle:function (image, width, height) {
        this.image = image
        this.width = width || 200
        this.height = height || 200
        this.type = 'rectangle'
        return this
    },
    /**
     * @method createParticle
     * @return {*}
     */
    createParticle:function () {
        particle = new CG.Particle(this.image)
        return particle
    },

    /**
     * @method initParticle
     *
     * @param {particle} particle particle object
     */
    initParticle:function (particle) {
        if (this.pfadeout) {
            particle.fadeout = true
        }
        particle.gravity = this.gravity     //set particle gravity to emitter gravity
        particle.alpha = 1                  //set alpha back to 1
        particle.visible = true             //make particle visible again
        particle.lifetime = this.plifetime  //reset lifetime
        particle.currtime = this.plifetime
        particle.rotationspeed = this.protation
        switch (this.type) {
            case 'corona':
                var rad = this.getRandom(0, 359) * CG.Const_PI_180

                particle.position.x = this.getX() - (this.radius * Math.cos(rad))
                particle.position.y = this.getY() - (this.radius * Math.sin(rad))

                angl = Math.atan2(particle.position.x - this.getX(), particle.position.y - this.getY()) * CG.Const_180_PI

                particle.xspeed = this.pspeed * Math.sin(angl * CG.Const_PI_180)
                particle.yspeed = this.pspeed * Math.cos(angl * CG.Const_PI_180)

                break
            case 'rectangle':
                //random value in rectangle
                rndx = this.getRandom(this.width / 2 * -1, this.width / 2)
                rndy = this.getRandom(this.height / 2 * -1, this.height / 2)

                particle.position.x = this.position._x - rndx
                particle.position.y = this.position._y - rndy
                particle.xspeed = 0
                particle.yspeed = 0

                break
            case 'line':
                //random value on plate line
                rnd = this.getRandom(this.width / 2 * -1, this.width / 2)

                //handle directions of line emitter
                switch (this.pdirection) {
                    default:
                    case CG.UP:
                        particle.xspeed = 0
                        particle.yspeed = this.pspeed * -1
                        particle.position.x = rnd + this.getX()
                        particle.position.y = this.position._y
                        break
                    case CG.DOWN:
                        particle.xspeed = 0
                        particle.yspeed = this.pspeed
                        particle.position.x = rnd + this.getX()
                        particle.position.y = this.position._y
                        break
                    case CG.LEFT:
                        particle.xspeed = this.pspeed * -1
                        particle.yspeed = 0
                        particle.position.x = this.position._x
                        particle.position.y = rnd + this.getY()
                        break
                    case CG.RIGHT:
                        particle.xspeed = this.pspeed
                        particle.yspeed = 0
                        particle.position.x = this.position._x
                        particle.position.y = rnd + this.getY()
                        break
                }
                break
            case 'explosion':
                particle.position.x = this.position._x
                particle.position.y = this.position._y

                particle.xspeed = this.getRandom(this.min, this.max)
                particle.yspeed = this.getRandom(this.min, this.max)
                break
            case 'point':
            default:
                particle.xspeed = 0
                particle.yspeed = 0
                particle.position.x = this.position._x
                particle.position.y = this.position._y
                break
        }
        return particle
    },

    update:function () {
        if (this.visible) {
            this.currenttime += this.creationspeed
            //particle lifetime
            if (this.currenttime >= this.creationtime) {
                this.currenttime = 0
                if (this.particles.length < this.maxparticles) {
                    this.particles.push(this.initParticle(this.createParticle()))
                }
                else {
                    particle = this.searchInvisibleParticle()   //search inactive particle in 'pool''
                    this.initParticle(particle)
                    this.particles.sort(function (obj1, obj2) {
                            return obj1.currtime - obj2.currtime
                        }
                    )
                }
            }


            for (var i = 0, l = this.particles.length; i < l; i++) {
                this.particles[i].update()
            }
            return this
        }
    },
    draw:function () {
        if (this.visible) {
            for (var i = 0, l = this.particles.length; i < l; i++) {
                this.particles[i].draw()
            }
            return this
        }
    },
    /**
     * @description Each emitter has its own particle pool to prevent object deletion/creation. This method searches an inactive/invisible particle
     * @method searchInvisibleParticle
     */
    searchInvisibleParticle:function () {
        for (var i = 0, l = this.particles.length; i < l; i++) {
            if (this.particles[i].visible == false) {
                return this.particles[i]
            }
        }
        return this
    },

    /**
     * @method setEmitterPosition
     *
     * @param {CG.Point} position of the emitter
     */
    setEmitterPosition:function (position) {
        this.position = position
        return this
    },

    /**
     * @method  setName
     *
     * @param {string} name of the object for search with layerobject.getElementByName(name)
     */
    setName:function (name) {
        this.name = name
        return this
    },

    /**
     * @method setCreationTime
     *
     * @param {Number} creationtime
     */
    setCreationTime:function (creationtime) {
        this.creationtime = creationtime
        return this
    },
    /**
     * @method setMaxParticles
     *
     * @param {Number} maxparticle
     */
    setMaxParticles:function (maxparticle) {
        this.maxparticles = maxparticle
        return this
    },
    /**
     * @method setGravity
     *
     * @param {float} gravity for all emitter controlled particles
     */
    setGravity:function (gravity) {
        this.gravity = gravity
        return this
    },

    /**
     * @method setParticleSpeed
     *
     * @param {Number} speed set the speed of the particles
     */
    setParticleSpeed:function (speed) {
        this.pspeed = speed
        return this
    },

    /**
     * @method setProtation
     *
     * @param {mixed} rotation set the rotation of the particles
     */
    setProtation:function (rotation) {
        this.protation = rotation
        return this
    },

    /**
     * @method setPLifetime
     *
     * @param {Number} plifetime set the lifetime of the particles
     */
    setPLifetime:function (plifetime) {
        this.plifetime = plifetime
        return this
    },

    /**
     * @method activateFadeout
     * @description Activate fadeout of the particles depending on lifetime
     */
    activateFadeout:function () {
        this.pfadeout = true
        return this
    },

    /**
     * @method deactivateFadeout
     * @description Deactivate fadeout of the particles depending on lifetime
     */
    deactivateFadeout:function () {
        this.pfadeout = false
        return this
    },

    /**
     * @method getRandom
     *
     * @param {mixed} min value for random number
     * @param {mixed} max value for random number
     */
    getRandom:function (min, max) {
        return Math.random() * (max - min + 1) + min >> 0
    },

    /**
     * @method getX
     */
    getX:function () {
        return this.position._x
    },

    /**
     * @method getY
     */
    getY:function () {
        return this.position._y
    }
})


