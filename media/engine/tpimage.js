/**
 * @description texturepacker TPImage class
 *
 * @constructor
 *
 * @param {image} image imgpath, image object or tpimage object to use
 * @param {integer} xoffset of image in atlas file
 * @param {integer} yoffset of image in atlas file
 * @param {integer} width of image in atlas file
 * @param {integer} height of image in atlas file
 */
CG.Class.extend('TPImage', {
    init:function (image, xoffset, yoffset, width, height) {
        this.source = ''
        this.atlasimage = ''
        this.atlasname = ''
        this.image = image || ''    //imagepath
        this.name = image.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name
        this.xoffset = xoffset || 0
        this.yoffset = yoffset || 0
        this.width = width || 0
        this.height = height || 0
        this.rotation = 0
    }
})

