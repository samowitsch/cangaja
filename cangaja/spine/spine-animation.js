// WTF !?
window.scale = 1.7;


/**
 * @description
 *
 * CG.SpineAnimation - this class is a little wrapper for spine animations (http://esotericsoftware.com). The implementation is not perfect at the moment
 * and is on early stages. There is a lot of stuff that could be implemented: boundingbox collision, eventhandling, box2d support
 *
 * @class CG.SpineAnimation
 * @extends CG.Entity
 *
 *
 * TODO
 * Boundingbox collision see example here:
 * https://github.com/EsotericSoftware/spine-runtimes/blob/master/spine-libgdx/test/com/esotericsoftware/spine/AnimationStateTest.java
 *
 *
 * Eventhandler see example here:
 * https://github.com/EsotericSoftware/spine-runtimes/blob/master/spine-libgdx/test/com/esotericsoftware/spine/SkeletonTest.java
 *
 *
 * Box2d support see example here:
 * https://github.com/EsotericSoftware/spine-runtimes/blob/master/spine-libgdx/test/com/esotericsoftware/spine/Box2DExample.java
 * http://www.esotericsoftware.com/forum/viewtopic.php?f=3&t=1394&p=6691&hilit=skeletonbounds#p6691
 */
CG.Entity.extend('SpineAnimation', {
    /**
     * Options:
     * spinejson {string} Spine json animation file
     * spineatlas {string} Spine atlas file (libGDX)
     * position {CG.Point}
     * scale {number}
     * callback {function}
     *
     @example
     var sa = new CG.SpineAnimation({
           spinejson: this.asset.getJsonByName('spinosaurus-json'),
           spineatlas: this.asset.getTextByName('spinosaurus-atlas'),
           position: new CG.Point(10,10),
           scale: 1,
           callback: function (spineObject) {
//              spineObject.skeleton.setSkinByName("goblingirl");
                spineObject.skeleton.setSlotsToSetupPose();
                spineObject.state.setAnimationByName(0, "animation", true);
            }
         })
     *
     * @constructor
     * @method init
     * @param options {object}
     */
    init: function (options) {
        this._super()
        this.instanceOf = 'SpineAnimation'
        var self = this

        if (options){
            CG._extend(this, options)
        }

        this.lastTime = Date.now()

        /**
         * @description initial position for the animation. later position changes at the moment with: obj.skeleton.getRootBone().x and obj.skeleton.getRootBone().y. maybe a TODO for a method ;o)
         * @property skeletonposition
         * @type {CG.Point}
         */
        this.skeletonposition = this.position || new CG.Point(0, 0)

        /**
         * @description spine bone xscale
         * @property xscale
         * @type {Number}
         */
        this.xscale = 1

        /**
         * @description spine bone yscale
         * @property yscale
         * @type {Number}
         */
        this.yscale = 1

        /**
         * @property scale
         * @type {Number}
         */
        this.scale = this.scale || 1

        /**
         * @property vertices
         * @type {Array}
         */
        this.vertices = []

        /**
         * @description counter for the spine image preloader
         * @property textureCount
         * @type {Number}
         */
        this.textureCount = 0

        /**
         * @description data from generated atlas text file. at the moment only the libGDX Format is supported from the spine-js runtime.
         * @property spineAtlasData
         * @type {String}
         */
        if (this.spineatlas.type == 'text') {
            this.spineAtlasData = this.spineatlas.data   //text data from mediaasset object
            console.log('spine atlas: text (libGDX) used')
        } else if (this.spineatlas.type == 'json') {
            this.spineAtlasData = this.spineatlas.src    //pure json text for spine atlas loader?
            console.log('spine atlas: json')
            throw 'json format is not supported by spine-js runtime?'
        } else {
            throw 'check your atlas file format?'
        }

        /**
         * @description spine animation json data loaded and parsed thru MediaAsset.
         * @property spineJsonData
         * @type {Object}
         */
        this.spineJsonData = this.spinejson.data

        /**
         * @description this is used for a callback for custom spine initialization.
         * @property initCustom
         * @type {Object}
         */
        this.initCustom = this.callback

        /**
         * @description this is used for a callback for custom animation configuration.
         * @property spineAtlas
         * @type {Object}
         */
        this.spineAtlas = new spine.Atlas(this.spineAtlasData, {
            load: function (page, path, atlas) {
                this.textureCount++
                var image = new Image()
                image.onload = function () {
                    page.rendererObject = image
                    page.width = image.width
                    page.height = image.height
                    self.spineAtlas.updateUVs(page)
                    this.textureCount--
                }
                image.onerror = function () {
                    throw "error: atlas image not loaded! " + path
                }
                image.src = 'media/spine/' + path
            },
            unload: function (texture) {
            }
        });

        this.waitForTextures();
    },
    /**
     * @method waitForTextures
     */
    waitForTextures: function () {
        if (!this.textureCount) {
            this.initSkeleton()
        } else {
            setTimeout(this.waitForTextures, 100)
        }
    },
    /**
     * @description initialises the animation (skeleton, stateData,. ,.) after preloading and calls the callback for custom animation configuration (.setSkinByName(), .setAnimationByName(),. ,.).
     * @method initSkeleton
     */
    initSkeleton: function () {
        /**
         * @property skeletonJson
         * @type {spine.SkeletonJson}
         */
        this.skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.spineAtlas))
        this.skeletonJson.scale = this.scale    //experimental scale

        /**
         * @property spineJsonData
         * @type {Object}
         */
        if (typeof this.spineJsonData === 'object') {
            this.skeletonData = this.skeletonJson.readSkeletonData(this.spineJsonData)
        } else {
            this.skeletonData = this.skeletonJson.readSkeletonData(JSON.parse(this.spineJsonData))
        }

        spine.Bone.yDown = true

        /**
         * @property skeleton
         * @type {spine.Skeleton}
         */
        this.skeleton = new spine.Skeleton(this.skeletonData)
        this.skeleton.x = this.skeletonposition.x || 0
        this.skeleton.y = this.skeletonposition.y || 0   //has spine a another origin (bottom left) than the canvas on y axis?
        this.skeleton.updateWorldTransform()

        /**
         * @property stateData
         * @type {spine.AnimationStateData}
         */
        this.stateData = new spine.AnimationStateData(this.skeletonData)
        /**
         * @property state
         * @type {spine.AnimationState}
         */
        this.state = new spine.AnimationState(this.stateData)

        //callback for custom initialization?
        this.initCustom(this)

        this.state.onEvent = function (trackIndex, event) {
            // alert(trackIndex + " event: " + event.data.name)
        }
    },
    /**
     * @method update
     */
    update: function () {
        var now = Date.now()
        var dt = (now - this.lastTime) / 1000
        this.lastTime = now

        this.state.update(dt)    // delta
        this.state.apply(this.skeleton)
        this.skeleton.updateWorldTransform()
    },
    /**
     * @description this method loops thru skeleton.drawOrder and renders all attachments of type spine.RegionAttachment.
     * @method draw
     */
    draw: function () {
//        var drawOrder = this.skeleton.drawOrder
//        for (var i = 0, n = drawOrder.length; i < n; i++) {
//            var slot = drawOrder[i]
//            var attachment = slot.attachment
//            var bone = slot.bone
//
//            if (!(attachment instanceof spine.RegionAttachment)) continue
//            attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, this.vertices)
//
//            try {
//
//                this.alpha = slot.a //get alphe value from slot
//                this.position = new CG.Point(this.vertices[2], this.vertices[3])
//                this.xscale = bone.worldScaleX //* this.scale
//                this.yscale = bone.worldScaleY //* this.scale
//                this.rotation = -(bone.worldRotation + attachment.rotation)
//
//                this.updateDiff()
//                this.updateMatrix.call(this)
//
//                this.xoffset = attachment.rendererObject.x
//                this.yoffset = attachment.rendererObject.y
//                this.cutwidth = attachment.width
//                this.cutheight = attachment.height
//                this.xhandle = this.cutwidth / 2 * this.xscale
//                this.yhandle = this.cutheight / 2 * this.yscale
//                this.xpos = 0
//                this.ypos = 0
//
//                if (this.skeleton.flipX) {
//
//                    this.xscale *= -1
//                    this.xpos = this.cutwidth
//                    this.rotation *= -1
//                }
//
//                if (this.skeleton.flipY) {
//
//                    this.yscale *= -1
//                    this.ypos = this.cutheight
//                    this.rotation *= -1
//                }
//                this.imagerotation = 0
//
//                this.image = attachment.rendererObject.page.rendererObject
//                this.width = attachment.rendererObject.page.rendererObject.width
//                this.height = attachment.rendererObject.page.rendererObject.height
//
//                Game.renderer.draw(this)
//
//            } catch (e) {
////                console.log(e)
////                console.log(attachment)
//            }

    //}

        Game.b_ctx.save()

        var skeleton = this.skeleton,
            drawOrder = skeleton.drawOrder;

        Game.b_ctx.translate(skeleton.x, skeleton.y);

        for (var i = 0, n = drawOrder.length; i < n; i++) {
            var slot = drawOrder[i];
            var attachment = slot.attachment;
            if (!(attachment instanceof spine.RegionAttachment)) continue;

            this.image = attachment.rendererObject.page.rendererObject

            var bone = slot.bone,
                x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01,
                y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11,
                rotation = -(bone.worldRotation + attachment.rotation) * Math.PI / 180,
                w = attachment.rendererObject.width * bone.worldScaleX,
                h = attachment.rendererObject.height * bone.worldScaleY;
            var w2 = w
                h2 = h;

            if(attachment.rendererObject.rotate){
                rotation += 90 * Math.PI / 180
                w2=h
                h2=w
            }

            this.alpha = slot.a //get alphe value from slot
            //this.position = new CG.Point(this.vertices[2], this.vertices[3])
            //this.xscale = bone.worldScaleX //* this.scale
            //this.yscale = bone.worldScaleY //* this.scale
            //this.rotation = -(bone.worldRotation + attachment.rotation)


            this.xoffset = attachment.rendererObject.x
            this.yoffset = attachment.rendererObject.y
            //this.cutwidth = attachment.rendererObject.width
            //this.cutheight = attachment.rendererObject.height
            //this.xpos = Game.width2
            //this.ypos = Game.height2

            if (bone.flipX) {

                this.xscale *= -1
                this.xpos = this.cutwidth
                this.rotation *= -1
            }

            if (bone.flipY) {

                this.yscale *= -1
                this.ypos = this.cutheight
                this.rotation *= -1
            }

            Game.b_ctx.translate(x, y);
            Game.b_ctx.rotate(rotation);

            Game.b_ctx.globalAlpha = this.alpha

            try {
                Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, w2, h2, (-w2 * scale)/2, (-h2 * scale)/2, w2 * scale, h2 * scale)
            } catch (e) {}

            Game.b_ctx.rotate(-rotation);
            Game.b_ctx.translate(-x, -y);
        }
        Game.b_ctx.translate(-skeleton.x, -skeleton.y);
        Game.b_ctx.restore()
    },
    /**
     * @method updateDiff
     */
    updateDiff: function () {

    }
})