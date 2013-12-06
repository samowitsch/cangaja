/**
 * @description
 *
 * CG.MediaAsset preloader.
 *
 * @class CG.MediaAsset
 * @extends Class
 *
 */

CG.Class.extend('MediaAsset', {
    /**
     * @method init
     * @constructor
     * @param image {string} image path to background image of preloader
     */
    init:function (image) {
        if (image !== '' && typeof image !== 'undefined') {
            this.image = new Image()
            this.image.src = image
        }

        this.ready = false
        this.progress = 0

        this.images = []
        this.currimage = 0

        this.sounds = []
        this.currsound = 0

        this.xmls = []
        this.currxml = 0

        this.jsons = []
        this.currjson = 0

        this.texts = []
        this.currtext = 0

        this.fonts = []
        this.currfont = 0

        this.assetcount = 0
        this.assetcurrent = 0

        //progress
        this.width = 300
        this.height = 20
        this.radius = 10

        this.linewidth = 8
        this.bordercolor = 'white'
        this.progresscolor = 'red'
        this.shadowcolor = '#222'
        this.shadowblur = 6
        this.shadowoffsetx = 2
        this.shadowoffsety = 2

//return this
    },
    /**
     * @method addImage
     * @param path
     * @param name
     * @return {*}
     */
    addImage:function (path, name) {
        this.assetcount += 1
        this.images.push({
            name:name || '', //optional
            path:path,
            img:new Image(),
            type:'image'
        })
        return this
    },
    /**
     * @method addFont
     * @param path
     * @param name
     * @return {*}
     */
    addFont:function (path, name) {
        this.assetcount += 1
        this.fonts.push({
            name:name || '', //optional
            path:path,
            data:'',
            type:'font'
        })
        return this
    },
    /**
     * @method addXml
     * @param path
     * @param name
     * @return {*}
     */
    addXml:function (path, name) {
        this.assetcount += 1
        this.xmls.push({
            name:name || '', //optional
            path:path,
            data:'',
            type:'xml'
        })
        return this
    },
    /**
     * @method addJson
     * @param path
     * @param name
     * @return {*}
     */
    addJson:function (path, name) {
        this.assetcount += 1
        this.jsons.push({
            name:name || '', //optional
            path:path,
            data:'',
            src:'',
            type:'json'
        })
        return this
    },
    /**
     * @method addText
     * @param path
     * @param name
     * @return {*}
     */
    addText:function (path, name) {
        this.assetcount += 1
        this.texts.push({
            name:name || '', //optional
            path:path,
            data:'',
            type:'text'
        })
        return this
    },
    /**
     * @method getImageByName
     * @param name
     * @return {*}
     */
    getImageByName:function (name) {
        for (var i = 0, l = this.images.length; i < l; i++) {
            if (this.images[i].name == name) {
                if (this.images[i] instanceof CG.AtlasImage) {
                    return this.images[i]
                } else {
                    return this.images[i].img
                }
            }
        }
        throw new MediaAssetException('No image with this name in asset.')
    },
    /**
     * @method getImagesByName
     * @param name
     * @return {*}
     */
    getImagesByName:function (name) {
        names = []
        for (var i = 0, l = this.images.length; i < l; i++) {
            if (this.images[i].name == name) {
                if (this.images[i] instanceof CG.AtlasImage) {
                    names.push(this.images[i])
                } else {
                    names.push(this.images[i].img)
                }
            }
        }
        if (names.length === 0) {
            throw new MediaAssetException('No image with this name in asset: ' + name)
        }
        return names
    },
    /**
     * @method getFontByName
     * @param name
     * @return {*}
     */
    getFontByName:function (name) {
        for (var i = 0, l = this.fonts.length; i < l; i++) {
            if (this.fonts[i].name == name) {
                return this.fonts[i]
            }
        }
        throw new MediaAssetException('No font with this name in asset: ' + name)
    },
    /**
     * @method getXmlByName
     * @param name
     * @return {*}
     */
    getXmlByName:function (name) {
        for (var i = 0, l = this.xmls.length; i < l; i++) {
            if (this.xmls[i].name == name) {
                return this.xmls[i]
            }
        }
        throw new MediaAssetException('No XML with this name in asset: ' + name)
    },
    /**
     * @method getJsonByName
     * @param name
     * @return {*}
     */
    getJsonByName:function (name) {
        for (var i = 0, l = this.jsons.length; i < l; i++) {
            if (this.jsons[i].name == name) {
                return this.jsons[i]
            }
        }
        throw new MediaAssetException('No JSON with this name in asset: ' + name)
    },
    /**
     * @method getTextByName
     * @param name
     * @return {*}
     */
    getTextByName:function (name) {
        for (var i = 0, l = this.jsons.length; i < l; i++) {
            if (this.texts[i].name == name) {
                return this.texts[i]
            }
        }
        throw new MediaAssetException('No Text with this name in asset: ' + name)
    },
    /**
     * @method startPreLoad
     */
    startPreLoad:function () {

        this.progress = 100 / this.assetcount * this.assetcurrent
        this.progressScreen()

        if (this.currimage < this.images.length) {
            //BUG last image is not preloading
            this.images[this.currimage].img.onload = function () {
                console.log('image loaded: ' + this.images[this.currimage].path)
                this.currimage += 1
                this.assetcurrent += 1
                this.startPreLoad()
            }.bind(this)
            this.images[this.currimage].img.onerror = function () {
                throw new MediaAssetException('error, cant load image: ' + this.images[this.currimage].path)
            }.bind(this)
            this.images[this.currimage].img.src = this.images[this.currimage].path
        } else if (this.currfont < this.fonts.length) {
            this.fonts[this.currfont].data = loadString(this.fonts[this.currfont].path)
            console.log('font loaded: ' + this.fonts[this.currfont].path)
            this.currfont += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currxml < this.xmls.length) {
            this.xmls[this.currxml].data = loadString(this.xmls[this.currxml].path)
            console.log('xml loaded: ' + this.xmls[this.currxml].path)
            this.currxml += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currjson < this.jsons.length) {
            var src = loadString(this.jsons[this.currjson].path)
            this.jsons[this.currjson].data = JSON.parse(src)
            this.jsons[this.currjson].src = src
            console.log('json loaded: ' + this.jsons[this.currjson].path)
            this.currjson += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currtext < this.texts.length) {
            this.texts[this.currtext].data = loadString(this.texts[this.currtext].path)
            console.log('text loaded: ' + this.texts[this.currtext].path)
            this.currtext += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currimage == this.images.length &&
            this.assetcount == this.assetcurrent) {
            this.ready = true
            Game.create()
        }
    },
    /**
     * @method progressScreen
     * @description render a progress screen to the canvas
     */
    progressScreen:function () {
        var x = (Game.bound.width - this.width) / 2
        var y = (Game.bound.height - this.height) / 2
        if (this.image) {
            Game.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
        } else {
            Game.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
        }
        Game.ctx.save()

        Game.ctx.fillStyle = this.progresscolor;
        Game.ctx.fillRect((Game.bound.width - this.width) / 2, (Game.bound.height - this.height) / 2, this.width / 100 * this.progress, this.height);

        Game.ctx.strokeStyle = this.bordercolor
        Game.ctx.shadowColor = this.shadowcolor
        Game.ctx.shadowBlur = this.shadowblur
        Game.ctx.shadowOffsetX = this.shadowoffsetx
        Game.ctx.shadowOffsetY = this.shadowoffsety
        Game.ctx.beginPath();
        Game.ctx.moveTo(x + this.radius, y);
        Game.ctx.lineTo(x + this.width - (1 * this.radius), y)
        Game.ctx.arcTo(x + this.width, y, x + this.width, y + this.radius, this.radius)
        Game.ctx.arcTo(x + this.width, this.radius * 2 + y, x + this.width - (1 * this.radius), this.radius * 2 + y, this.radius)
        Game.ctx.lineTo(x + this.radius, 2 * this.radius + y)
        Game.ctx.arcTo(x, 2 * this.radius + y, x, y, this.radius)
        Game.ctx.arcTo(x, y, 2 * this.radius + x, y, this.radius)
        Game.ctx.lineWidth = this.linewidth
        Game.ctx.stroke()
        Game.ctx.restore()
    }
})

function MediaAssetException(msg) {
    this.msg = msg
    console.log(this.msg)
}



