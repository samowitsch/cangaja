/**
 * @description
 *
 * CG.Entity the base class of Cangaja
 *
 * @class CG.Entity
 * @extends CG.Class
 */

CG.Class.extend('Entity', {
    /**
     * @constructor
     * @method init
     * @param name {string} the name of the Entity
     */
    init:function (name) {
        /**
         @description name of the object
         @property name {string}
         */
        this.name = name || ''
        /**
         @description visibility option
         @property visible {boolean}
         */
        this.visible = true
        /**
         @description Transform object for matrix transformation
         @property transform {Transform}
         */
        this.transform = new Transform()
        /**
         @description the transformation matrix array of the Transform object
         @property matrix {Array}
         */
        this.matrix = this.transform.m
    },
    update:function () {
        throw {
            name:'Entity Error',
            message:'Subclass has no update method.'
        }
    },
    draw:function () {
        throw {
            name:'Entity Error',
            message:'Subclass has no draw method.'
        }
    },
    /**
     * @description initialize image for object. for now => sprite, particle, buffer, bitmap and button use it
     * @method setImage
     * @param {image} image image path, image or atlasimage
     */
    setImage:function (image) {
        this.atlasimage = false
        if (image) {
            if (image instanceof CG.AtlasImage) {
                //AtlasImage from MediaAsset
                this.image = Game.asset.getImageByName(image.atlasname)
                this.imagerotation = image.rotation //|| 0
                this.xoffset = image.xoffset
                this.yoffset = image.yoffset
                this.width = image.width
                this.height = image.height
                this.atlasimage = true
                if (this.imagerotation !== 0) {
                    this.cutwidth = image.height
                    this.cutheight = image.width
                } else {
                    this.cutwidth = image.width
                    this.cutheight = image.height
                }
            } else if (typeof image == 'string' && image != '') {
                //path to image
                this.image = new Image()
                this.image.src = image
                this.width = this.image.width
                this.height = this.image.height
            } else {
                //image from MediaAsset
                this.image = image
                this.width = this.image.width
                this.height = this.image.height
            }
        }
    }
})


