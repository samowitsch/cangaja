/**
 * @description Emitter class that handles particles
 *
 * @constructor
 * @augments Entity
 *
 * @param {point} position of emitter
 */
CG.Entity.extend('Emitter', {
    init: function (position){
        this._super()
        this.particles = []     //Particle pool delegated by emitter
        this.maxparticles = 50

        this.creationtime = 100 //time when next particle would be generated/reanimated
        this.currenttime = 0    //current counter
        this.creationspeed = 50 //increase for currenttime

        this.gravity = 0.05

        this.image = null       //Image of the particle
        this.type = ''          //point, corona, plate

        this.position = position || new CG.Point(0,0)
        this.position._x = this.position.x
        this.position._y = this.position.y

        this.rotation = 0       //rotation of plate emitter
        this.width = 200        //width of line and rectangle emitter
        this.height = 200       //width of rectangle emitter

        this.radius = 0         //radius for corona emitter

        this.pspeed = 10        //particle speed
        this.protation = 0
        this.pdirection = 0     //particle direction UP, DOWN, LEFT, RIGHT
        this.plifetime = 100    //particle lifetime
        this.paging = 1         //particle aging
        this.pfadeout = false   //particle fadeout
        return this
    },
    /*
    * Objective-C style initialisation of all emitter types
    */

    /**
    * @description initAsPoint
    *
    * @param {mixed} image path, image or tpimage to use for the particle
    */

    initAsPoint: function(image){
        this.image = image
        this.type = 'point'
        return this
    },


    /**
    * @description initAsExplosion
    *
    * @param {mixed} image path, image or tpimage to use for the particle
    * @param {integer} min value for particle speed
    * @param {integer} max value for particle speed
    */
    initAsExplosion: function(image, min, max){
        this.image = image
        this.type = 'explosion'
        this.min = min
        this.max = max
        return this
    },

    /**
    * @description initAsCorona
    *
    * @param {mixed} image path, image or tpimage to use for the particle
    * @param {integer} radius of the corona emitter
    */
    initAsCorona: function(image, radius){
        this.image = image
        this.type = 'corona'
        this.radius = radius || 0
        return this
    },

    /**
    * @description initAsLine
    *
    * @param {mixed} image path, image or tpimage to use for the particle
    * @param {integer} width of the plate emitter
    * @param {integer} direction (defined constants) of the plate emitter
    */
    initAsLine: function(image, width, direction){
        this.image = image
        this.width = width || 200
        this.pdirection = direction || UP
        this.type = 'line'
        return this
    },

    /**
    * @description initAsRectangle
    *
    * @param {mixed} image path, image or tpimage to use for the particle
    * @param {integer} width of the plate emitter
    * @param {integer} direction (defined constants) of the plate emitter
    */
    initAsRectangle: function(image, width, height){
        this.image = image
        this.width = width || 200
        this.height = height || 200
        this.type = 'rectangle'
        return this
    },



    createParticle: function(){
        particle = new CG.Particle(this.image)
        return particle
    },

    /**
    * @description initParticle
    *
    * @param {particle} initialize particle object
    */
    initParticle: function(particle){
        if ( this.pfadeout ) {
            particle.fadeout = true
        }
        particle.gravity = this.gravity     //set particle gravity to emitter gravity
        particle.alpha = 1                  //set alpha back to 1
        particle.visible = true             //make particle visible again
        particle.lifetime = this.plifetime  //reset lifetime
        particle.currtime = this.plifetime
        particle.rotationspeed = this.protation
        switch ( this.type )
        {
            case 'corona':
                //TODO corona like emitter
                var rad = this.getRandom(0, 359) * Const_PI_180

                particle.position.x = this.getX() - (this.radius * Math.cos(rad))
                particle.position.y = this.getY() - (this.radius * Math.sin(rad))

                angl = Math.atan2(particle.position.x - this.getX(), particle.position.y - this.getY()) * Const_180_PI

                particle.xspeed = this.pspeed * Math.sin(angl * Const_PI_180)
                particle.yspeed = this.pspeed * Math.cos(angl * Const_PI_180)

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
                switch ( this.pdirection )
                {
                    default:
                    case UP:
                        particle.xspeed = 0
                        particle.yspeed = this.pspeed * -1
                        particle.position.x = rnd + this.getX()
                        particle.position.y = this.position._y
                        break
                    case DOWN:
                        particle.xspeed = 0
                        particle.yspeed = this.pspeed
                        particle.position.x = rnd + this.getX()
                        particle.position.y = this.position._y
                        break
                    case LEFT:
                        particle.xspeed = this.pspeed * - 1
                        particle.yspeed = 0
                        particle.position.x = this.position._x
                        particle.position.y = rnd + this.getY()
                        break
                    case RIGHT:
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

    update: function(){
        if(this.visible){
            this.currenttime += this.creationspeed
            //particle lifetime
            if(this.currenttime >= this.creationtime){
                this.currenttime = 0
                if ( this.particles.length < this.maxparticles )
                {
                    this.particles.push(this.initParticle(this.createParticle()))
                }
                else
                {
                    particle = this.searchInvisibleParticle()   //search inactive particle in 'pool''
                    this.initParticle(particle)
                    this.particles.sort(function(obj1, obj2){
                        return obj1.currtime - obj2.currtime
                    }
                    )
                }
            }


            for(var i=0, l=this.particles.length; i < l; i++){
                this.particles[i].update()
            }
            return this
        }
    },
    draw: function(){
        if(this.visible){
            for(var i=0, l=this.particles.length; i < l; i++){
                this.particles[i].draw()
            }
            return this
        }
    },
    /**
    * @description Each emitter has its own particle pool to prevent object deletion/creation. This method searches an inactive/invisible particle
    */
    searchInvisibleParticle: function(){
        for(var i=0, l=this.particles.length; i < l; i++){
            if(this.particles[i].visible == false){
                return this.particles[i]
            }
        }
        return this
    },

    /**
    * @description setEmitterPosition
    *
    * @param {point} position of the emitter
    */
    setEmitterPosition: function(position){
        this.position = position
        //    this._x = x
        //    this._y = y
        return this
    },

    /**
    * @description  setName
    *
    * @param {string} name of the object for search with layerobject.getElementByName(name)
    */
    setName: function (name){
        this.name = name
        return this
    },

    /**
    * @description setCreationTime
    *
    * @param {integer} creationtime
    */
    setCreationTime: function (creationtime){
        this.creationtime = creationtime
        return this
    },
    /**
    * @description setMaxParticles
    *
    * @param {integer} maxparticle
    */
    setMaxParticles: function (maxparticle){
        this.maxparticles = maxparticle
        return this
    },
    /**
    * @description setGravity
    *
    * @param {float} gravity for all emitter controlled particles
    */
    setGravity: function(gravity){
        this.gravity = gravity
        return this
    },

    /*
    * Class Emitter method setParticleSpeed
    * @param {integer} speed set the speed of the particles
    */
    setParticleSpeed: function(speed){
        this.pspeed = speed
        return this
    },

    /**
    * @description setProtation
    *
    * @param {mixed} rotation set the rotation of the particles
    */
    setProtation: function(rotation){
        this.protation = rotation
        return this
    },

    /**
    * @description setPLifetime
    *
    * @param {integer} plifetime set the lifetime of the particles
    */
    setPLifetime: function(plifetime){
        this.plifetime = plifetime
        return this
    },

    /**
    * @description activateFadeout - Activate fadeout of the particles depending on lifetime
    */
    activateFadeout: function(){
        this.pfadeout = true
        return this
    },

    /**
    * @description deactivateFadeout - Deactivate fadeout of the particles depending on lifetime
    */
    deactivateFadeout: function(){
        this.pfadeout = false
        return this
    },

    /**
    * @description getRandom
    *
    * @param {mixed} min value for random number
    * @param {mixed} max value for random number
    */
    getRandom: function(min, max){
        return Math.random() * (max - min + 1) + min >> 0
    },

    /**
    * @description getX - get x position
    */
    getX: function(){
        return this.position._x
    },

    /**
    * @description getY - Get y position
    */
    getY: function(){
        return this.position._y
    }
})