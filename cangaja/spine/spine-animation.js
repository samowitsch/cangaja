/**
 * @description
 *
 * CG.SpineAnimation
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
     * @constructor
     * @method init
     * @param spinejson     Spine json animation file
     * @param spineatlas    Spine
     * @param position
     * @param scale
     * @param callback callback function
     */
    init: function (spinejson, spineatlas, position, scale, callback) {

        self = this

        this.instanceOf = 'SpineAnimation'

        this.lastTime = Date.now()

        this.skeletonposition = position || new CG.Point(0, 0)

        this.xscale = 1

        this.yscale = 1

        this.scale = scale || 1

        this.vertices = []

        this.atlasimage = true

        this.textures = []

        this.textureCount = 0

        if (spineatlas.type == 'text') {
            this.spineAtlasData = spineatlas.data   //text data from mediaasset object
            console.log('spine atlas: text (libGDX) used')
        } else if (spineatlas.type == 'json') {
            this.spineAtlasData = spineatlas.src    //pure json text for spine atlas loader?
            console.log('spine atlas: json')
            throw 'json format is not supported by spine-js runtime?'
        } else {
            throw 'check your atlas file format?'
        }

        this.spineJsonData = spinejson.data //parsed json data from mediaasset object

        this.initCustom = callback

        this.spineAtlas = new spine.Atlas(this.spineAtlasData, {
            load: function (page, path) {
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
    waitForTextures: function () {
        if (!this.textureCount) {
            this.initSkeleton()
        } else {
            setTimeout(this.waitForTextures, 100)
        }
    },
    initSkeleton: function () {

        this.skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(self.spineAtlas))
        this.skeletonJson.scale = this.scale    //experimental scale

        if (typeof this.spineJsonData === 'object') {
            this.skeletonData = this.skeletonJson.readSkeletonData(this.spineJsonData)
        } else {
            this.skeletonData = this.skeletonJson.readSkeletonData(JSON.parse(this.spineJsonData))
        }

        spine.Bone.yDown = true

        this.skeleton = new spine.Skeleton(this.skeletonData)

        this.skeleton.getRootBone().x = this.skeletonposition.x || 0
        this.skeleton.getRootBone().y = this.skeletonposition.y || 0   //has spine a another origin (bottom left) than the canvas on y axis?

        this.skeleton.updateWorldTransform()

        this.stateData = new spine.AnimationStateData(this.skeletonData)
        this.state = new spine.AnimationState(this.stateData)

        //callback for custom initialization?
        this.initCustom(this)

        this.state.onEvent = function (trackIndex, event) {
            // alert(trackIndex + " event: " + event.data.name)
        }
    },
    update: function () {

        var dt = (Date.now() - this.lastTime) / 1000
        this.lastTime = Date.now()

        this.state.update(dt)    // delta
        this.state.apply(this.skeleton)
        this.skeleton.updateWorldTransform()
    },
    draw: function () {
        var drawOrder = this.skeleton.drawOrder
        for (var i = 0, n = drawOrder.length; i < n; i++) {
            var slot = drawOrder[i]
            var attachment = slot.attachment
            var bone = slot.bone
            if (!(attachment instanceof spine.RegionAttachment)) continue
            attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, this.vertices)

            try {
                this.alpha = slot.a //get alphe value from slot
                this.position = new CG.Point(this.vertices[2], this.vertices[3])
                this.xoffset = attachment.rendererObject.x
                this.yoffset = attachment.rendererObject.y
                this.cutwidth = attachment.width
                this.cutheight = attachment.height
                this.xhandle = this.cutwidth / 2
                this.yhandle = this.cutheight / 2
                this.xscale = slot.data.boneData.scaleX //* this.scale
                this.yscale = slot.data.boneData.scaleY //* this.scale
                this.rotation = -(slot.bone.worldRotation + attachment.rotation)
                this.xpos = 0
                this.ypos = 0

                if (this.skeleton.flipX) {

                    this.xscale *= -1
                    this.xpos = this.cutwidth
                    this.rotation *= -1
                }

                if (this.skeleton.flipY) {

                    this.yscale *= -1
                    this.ypos = this.cutheight
                    this.rotation *= -1
                }
                this.imagerotation = 0

                this.image = attachment.rendererObject.page.rendererObject
                this.width = attachment.rendererObject.page.rendererObject.width
                this.height = attachment.rendererObject.page.rendererObject.height

                Game.renderer.draw(this)

            } catch (e) {
//                console.log(e)
//                console.log(attachment)
            }

        }


    },
    updateDiff: function () {

    }
})


