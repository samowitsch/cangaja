/**
 * @description
 *
 * CG.SpineAnimation
 *
 * @class CG.SpineAnimation
 * @extends CG.Entity
 */
CG.Entity.extend('SpineAnimation', {
    /**
     * @constructor
     * @method init
     * @param spinejson     Spine json animation file
     * @param spineatlas    Spine
     * @param position
     * @param custominit callback function
     */
    init: function (spinejson, spineatlas, position, callback) {

        _self = this

        this.instanceOf = 'SpineAnimation'

        this.lastTime = Date.now()

        this.baseposition = position || new CG.Point(0, 0)

        this.vertices = []

        this.atlasimage = true

        this.textures = []

        this.textureCount = 0

        this.spineAtlasData = spineatlas
        this.spineJsonData = spinejson

        this.initCustom = callback

        this.spineAtlas = new spine.Atlas(this.spineAtlasData, {
            load: function (page, path) {
                this.textureCount++
                var image = new Image()
                image.onload = function () {
                    page.rendererObject = image
                    page.width = image.width
                    page.height = image.height
                    console.log('page', page)
                    console.log('spineAtlas', _self.spineAtlas)
                    console.log('this', this)
                    _self.spineAtlas.updateUVs(page)
                    this.textureCount--
                }
                image.onerror = function () {
                    throw "error: atlas image not loaded!"
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

        this.skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(_self.spineAtlas))

        if (typeof this.spineJsonData === 'object') {
            this.skeletonData = this.skeletonJson.readSkeletonData(this.spineJsonData)
        } else {
            this.skeletonData = this.skeletonJson.readSkeletonData(JSON.parse(this.spineJsonData))
        }

        spine.Bone.yDown = true;

        this.skeleton = new spine.Skeleton(this.skeletonData)

        this.skeleton.getRootBone().x = this.baseposition.x || 0
        this.skeleton.getRootBone().y = this.baseposition.y * -1 || 0

        this.skeleton.updateWorldTransform();

        this.stateData = new spine.AnimationStateData(this.skeletonData);
        this.state = new spine.AnimationState(this.stateData);


        this.initCustom(this)

        this.state.onEvent = function (trackIndex, event) {
            // alert(trackIndex + " event: " + event.data.name)
        }
    },
    update: function () {

        var dt = (Date.now() - this.lastTime)/1000
        this.lastTime = Date.now()

        this.state.update(dt);    // delta
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();
    },
    draw: function () {
        var drawOrder = this.skeleton.drawOrder;
        for (var i = 0, n = drawOrder.length; i < n; i++) {
            var slot = drawOrder[i];
            var attachment = slot.attachment;
            var bone = slot.bone;
            if (!(attachment instanceof spine.RegionAttachment)) continue;
            attachment.computeVertices(this.skeleton.x, this.skeleton.y, slot.bone, this.vertices);

            try {
                this.alpha = 1
                this.position = new CG.Point(this.vertices[2], this.vertices[3])
                this.xoffset = attachment.rendererObject.x
                this.yoffset = attachment.rendererObject.y
                this.cutwidth = attachment.width
                this.cutheight = attachment.height
                this.xhandle = this.cutwidth / 2
                this.yhandle = this.cutheight / 2
                this.xscale = attachment.scaleX
                this.yscale = attachment.scaleY
                this.rotation = -(slot.bone.worldRotation + attachment.rotation)

                if (this.skeleton.flipX) {

                    this.xscale *= -1;
                    this.rotation *= -1;
                }

                if (this.skeleton.flipY) {

                    this.yscale *= -1;
                    this.rotation *= -1;
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

//        Game.renderer.draw(this);

    },
    updateDiff: function () {

    }
})


