/**
 * @description TexturePacker TPImage class. It is needed when using TexturePacker atlas files.
 *
 * @class CG.TPImage
 * @extend Class
 */
CG.Class.extend('TPImage', {
    /**
     * @method init
     * @constructor
     * @param image {image} imgpath, image object or tpimage object to use
     * @param xoffset {Number} xoffset of image in atlas file
     * @param yoffset {Number} yoffset of image in atlas file
     * @param width {Number} width of image in atlas file
     * @param height {Number} height of image in atlas file
     */
    init:function (image, xoffset, yoffset, width, height) {
        /**
         * @property source
         * @type {String}
         */
        this.source = ''
        /**
         * @property atlasimage
         * @type {String}
         */
        this.atlasimage = ''
        /**
         * @property atlasname
         * @type {String}
         */
        this.atlasname = ''
        /**
         * @property image
         * @type {*}
         */
        this.image = image || ''    //imagepath
        /**
         * @property name
         * @type {String}
         */
        this.name = image.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name
        /**
         * @property xoffset
         * @type {Number}
         */
        this.xoffset = xoffset || 0
        /**
         * @property yoffset
         * @type {*}
         */
        this.yoffset = yoffset || 0
        /**
         * @property width
         * @type {Number}
         */
        this.width = width || 0
        /**
         * @property height
         * @type {Number}
         */
        this.height = height || 0
        /**
         * @property rotation
         * @type {Number}
         */
        this.rotation = 0
    }
})