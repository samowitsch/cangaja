/**
 *  @description
 *  CG.AtlasTexturePacker class supports loading xml and json files from . . . TexturePacker ;o)
 *  No trimming at the moment, keep TexturePacker settings simple! The rotation option of TexturePacker
 *  will be dropped in future releases!
 *  AtlasTexturePacker parses xml/json and generates new CG.AtlasImage objects in the MediaAsset manager.
 *  These atlasimages are only handled within Sprite, Particle and Button class.
 *
 *
 *
 ```

 // Preloader
 Game.asset.addImage('media/img/texturepacker.png', 'texturepacker') // image of texturepacker
 .addXml('media/img/texturepacker.xml', 'texturepacker-xml') // xml version of texturepacker
 .addJson('media/img/texturepacker.json', 'texturepacker-json') // json version of texturepacker
 .startPreLoad()



 // create texturepacker object
 var tp = new CG.AtlasTexturePacker()

 // load texturepacker json file
 tp.loadJson(Game.asset.getJsonByName('texturepacker-json'))

 // or load texturepacker xml file
 //tp.loadXml(Game.asset.getXmlByName('texturepacker-xml'))


 // add images of texturepacker to Game.asset
 Game.asset.images.push.apply(Game.asset.images, tp.getAtlasImages())

 ```

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
    init: function () {
        //ejecta and cocoonjs has no DOMParser!
        if (typeof ejecta === 'undefined' && !navigator.isCocoonJS) {
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
    loadXml: function (xmlfile) {
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
            var atlasimage = new CG.atlasimage({
                image: sprites[i].getAttribute('n'),
                xoffset: parseInt(sprites[i].getAttribute('x')),
                yoffset: parseInt(sprites[i].getAttribute('y')),
                width: parseInt(sprites[i].getAttribute('w')),
                height: parseInt(sprites[i].getAttribute('h'))
            })
            if (sprites[i].getAttribute('r') == 'y') {
                atlasimage.rotation = 90
                console.log('!!! support for rotated images in atlas files would be dropped in future versions !!!')
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
    loadJson: function (jsonfile) {
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
            var atlasimage = new CG.AtlasImage({
                image: image.filename,
                xoffset: image.frame.x,
                yoffset: image.frame.y,
                width: image.frame.w,
                height: image.frame.h
            })
            if (image.rotated === true) {
                atlasimage.rotation = 90
                console.log('!!! support for rotated images in atlas files would be dropped in future versions !!!')
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
    getAtlasImages: function () {
        return this.atlasimages
    }
})


