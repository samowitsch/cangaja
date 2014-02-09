/**
 * @description
 *
 * CG.AtlasImage class. It is needed when using TexturePacker atlas files.
 *
 * @class CG.AtlasImage
 * @extends Class
 */
CG.Class.extend('AtlasImage', {
    /**
     * Options:
     * image {string}
     * xoffset {number}
     * yoffset {number}
     * width {number}
     * height {number}
     *
     @example
     var a = new CG.AtlasImage({
           image: 'menuscreen',
           xoffset: 0,
           yoffset: 0,
           width: 10,
           height: 20
         })
     *
     * @method init
     * @constructor
     * @param options {object}
     */
    init: function (options) {
        CG._extend(this, {

            /**
             * @property source
             * @type {String}
             */
            source: '',
            /**
             * @property atlasimage
             * @type {String}
             */
            atlasimage: '',
            /**
             * @property atlasname
             * @type {String}
             */
            atlasname: '',
            /**
             * @property image
             * @type {*}
             */
            image: '',    //imagepath

            /**
             * @property xoffset
             * @type {Number}
             */
            xoffset: 0,
            /**
             * @property yoffset
             * @type {*}
             */
            yoffset: 0,
            /**
             * @property width
             * @type {Number}
             */
            width: 0,
            /**
             * @property height
             * @type {Number}
             */
            height: 0,
            /**
             * @property rotation
             * @type {Number}
             */
            rotation: 0
        })

        if (options) {
            CG._extend(this, options)
            /**
             * @property name
             * @type {String}
             */
            this.name = this.image.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name
        }

    }
})