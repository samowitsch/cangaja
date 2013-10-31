/**
 *  @description
 *
 *  CG.AtlasTexturePacker class supports loading xml and json files from . . . TexturePacker ;o)
 *  No trimming at the moment, keep TexturePacker settings simple! TexturePacker parses the xml/json and generates new CG.atlasimage objects in the MediaAsset manager.
 *  These atlasimages are only handled within Sprite, Particle and Button class.
 *
 *  @class CG.AtlasTexturePacker
 *  @extends Class
 */
CG.Class.extend('AtlasTexturePacker', {
    /**
     * @constructor
     * @method init
     * @return {*}
     */
    init:function () {
        if (typeof(ejecta) == 'undefined') {
            this.xml = ''
            this.xmlDoc = ''
            this.parser = new DOMParser() || {}
        }
        /**
         * @property imagename
         * @type {String}
         */
        this.imagename = ''
        /**
         * @property width
         * @type {Number}
         */
        this.width = 0
        /**
         * @property height
         * @type {Number}
         */
        this.height = 0
        /**
         * @property atlasimages
         * @type {Array}
         */
        this.atlasimages = []
        return this
    },
    /**
     * @description load a xml file from TexturePacker
     * @method loadXml
     * @param {string/object} xmlfile path or mediaasset object with data of TexturePacker xml
     * @return {*}
     */
    loadXml:function (xmlfile) {
        //from asset
        if (typeof xmlfile == 'string') {
            this.xml = loadString(xmlfile)
        } else {
            this.xml = xmlfile.data
        }

        this.xmlDoc = this.parser.parseFromString(this.xml, 'text/xml')

        this.imagename = this.xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('imagePath')
        this.width = parseInt(this.xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('width'))
        this.height = parseInt(this.xmlDoc.getElementsByTagName('TextureAtlas')[0].getAttribute('height'))

        var sprites = this.xmlDoc.getElementsByTagName('sprite')
        for (var i = 0, l = sprites.length; i < l; i++) {
            atlasimage = new CG.atlasimage(
                sprites[i].getAttribute('n'),
                parseInt(sprites[i].getAttribute('x')),
                parseInt(sprites[i].getAttribute('y')),
                parseInt(sprites[i].getAttribute('w')),
                parseInt(sprites[i].getAttribute('h'))
            )
            if (sprites[i].getAttribute('r') == 'y') {
                atlasimage.rotation = 90
            }
            atlasimage.atlasimage = this.imagename
            atlasimage.source = 'xml'
            atlasimage.atlasname = this.imagename.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name

            this.atlasimages.push(atlasimage)
        }
        return this
    },

    /**
     * @description load a json file from TexturePacker
     * @method loadJson
     * @param {string/object} jsonfile path or mediaasset object with data of TexturePacker json
     * @return {*}
     */
    loadJson:function (jsonfile) {
        //from asset
        if (typeof jsonfile == 'string') {
            this.json = JSON.parse(loadString(jsonfile))
        } else {
            this.json = jsonfile.data
        }
        //meta info from json file
        this.imagename = this.json.meta.image
        this.width = this.json.meta.size.w
        this.height = this.json.meta.size.h

        //loop thru all images
        for (var i = 0, l = this.json.frames.length; i < l; i++) {
            var image = this.json.frames[i]
            var atlasimage = new CG.AtlasImage(
                image.filename,
                image.frame.x,
                image.frame.y,
                image.frame.w,
                image.frame.h
            )
            if (image.rotated === true) {
                atlasimage.rotation = 90
                //            atlasimage.width = this.json.frames[i].frame.w,
                //            atlasimage.height = this.json.frames[i].frame.h
            }
            atlasimage.atlasimage = this.imagename
            atlasimage.source = 'json'
            atlasimage.atlasname = this.imagename.split(/(\\|\/)/g).pop().split('.')[0] //image name only for name

            this.atlasimages.push(atlasimage)
        }
        return this
    },

    /**
     * @description get all TexturePacker images (Use array.push.apply(array, anotherarray) to append to Game.asset)
     * @method getAtlasImages
     * @return {array} returns all atlasimages of TexturePacker file to use with Game.asset
     */
    getAtlasImages:function () {
        return this.atlasimages
    }
})


