/**
 * @description
 *
 * CG.SpineSprite
 *
 * @class CG.SpineSprite
 * @extends CG.Entity
 */
CG.Entity.extend('SpineAnimation', {
    /**
     * @constructor
     * @method init
     * @param image
     * @param spinejson     Spine json animation file
     * @param spineatlas    Spine
     * @param position
     */
    init: function (image, spinejson, spineatlas, position) {
        this.setImage(image)
        this.instanceOf = 'SpineAnimation'



        /**
         *
         * @type {*}
         */
        this.spineAtlasData = spineatlas

        this.spineAtlas = new spine.Atlas(this.spineAtlasData, {
            load: function (page, path) {
            },
            unload: function (texture) {
            }
        });



        /**
         *
         * @type {*}
         */
        this.spineJsonData = spinejson


        this.skeletonJson = new spine.SkeletonJson(new spine.AtlasAttachmentLoader(this.spineAtlas))


        this.skeletonData = this.skeletonJson.readSkeletonData(JSON.parse(this.spineJsonData))



        this.skeleton  = new spine.Skeleton(this.skeletonData)


        this.skeleton.getRootBone().x = position.x || 0
        this.skeleton.getRootBone().y = position.y || 0
        this.skeleton.updateWorldTransform();


        this.stateData = new spine.AnimationStateData(this.skeletonData);
        this.state = new spine.AnimationState(this.stateData);

        this.state.onEvent = function (trackIndex, event) {
            // alert(trackIndex + " event: " + event.data.name)
        }

        /**
         *
         * @type {*|Point}
         */
        this.position = position || new CG.Point(0, 0)


    },
    update: function () {
        this.state.update(1);    // delta
        this.state.apply(this.skeleton);
        this.skeleton.updateWorldTransform();
    },
    draw: function () {
        var drawOrder = this.skeleton.drawOrder;
        for (var i = 0, n = drawOrder.length; i < n; i++) {
            var slot = drawOrder[i];
            var attachment = slot.attachment;
            if (!(attachment instanceof spine.RegionAttachment)) continue;

            // TODO

            //alpha
            //position
            //xoffset,yoffset
            //cutwidth,cutheight
            //xhandle,yhandle
            //xscale,yscale
            //rotation

            Game.renderer.draw(this);

        }
    }
})


