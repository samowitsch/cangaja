/**
 *  © 2012 by Christian Sonntag <info@motions-media.de>
 *  simple experimental Canvas Game JavaScript Framework
 */


/**
 * @description entity the baseclass
 * @constructor
 */

CG.Class.extend('Entity', {
    init: function(name){
        this.name = name || ''
        this.visible = true
    },
    update: function() {
        throw {
            name: 'Entity Error',
            message: 'Subclass has no update method.'
        }
    },
    draw: function() {
        throw {
            name: 'Entity Error',
            message: 'Subclass has no draw method.'
        }
    },
    /**
     * @description inizialising image for object. for now => sprite, particle, buffer, bitmap and button use it
     *
     * @param {image} image image path, image or tpimage
     */
    setImage: function(image){
        this.atlasimage = false
        if ( image instanceof CG.TPImage )
        {
            //TPImage from MediaAsset
            this.image = Game.asset.getImageByName(image.atlasname)
            this.imagerotation = image.rotation //|| 0
            this.xoffset = image.xoffset
            this.yoffset = image.yoffset
            this.width = image.width
            this.height = image.height
            this.atlasimage = true
            if ( this.imagerotation !== 0 )
            {
                this.cutwidth = image.height
                this.cutheight = image.width
            } else {
                this.cutwidth = image.width
                this.cutheight = image.height
            }
        } else if ( typeof image == 'string' )
{
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
})