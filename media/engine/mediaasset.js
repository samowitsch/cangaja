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
     * @param ctx {canvas context} canvas context for drawing
     */
    init:function (image, ctx) {
        if (image != '') {
            this.image = new Image()
            this.image.src = image
        }
        
        this.ctx = ctx
        
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
            img:new Image()
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
            data:''
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
            data:''
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
            data:''
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
                if (this.images[i] instanceof CG.TPImage) {
                    return this.images[i]
                } else {
                    return this.images[i].img
                }
            }
        }
        throw new CG.MediaAssetException('No image with this name in asset.')
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
                if (this.images[i] instanceof CG.TPImage) {
                    names.push(this.images[i])
                } else {
                    names.push(this.images[i].img)
                }
            }
        }
        if (names.length === 0) {
            throw new CG.MediaAssetException('No image with this name in asset.')
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
        throw new CG.MediaAssetException('No font with this name in asset.')
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
        throw new CG.MediaAssetException('No XML with this name in asset.')
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
        throw new CG.MediaAssetException('No JSON with this name in asset.')
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
                console.log('loaded image (' + Math.floor(100 / (this.images.length - 1) * this.currimage) + ' %): ' + this.images[this.currimage].name)
                this.currimage += 1
                this.assetcurrent += 1
                this.startPreLoad()
            }.bind(this)
            this.images[this.currimage].img.src = this.images[this.currimage].path
        } else if (this.currfont < this.fonts.length) {
            //        if(typeof(ejecta) !== 'undefined'){
            //            this.fonts[this.currfont].data = ejecta.loadText(this.fonts[this.currfont].path)
            //        } else {
            this.fonts[this.currfont].data = loadString(this.fonts[this.currfont].path)
            //        }
            this.currfont += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currxml < this.xmls.length) {
            this.xmls[this.currxml].data = loadString(this.xmls[this.currxml].path)
            this.currxml += 1
            this.assetcurrent += 1
            this.startPreLoad()
        } else if (this.currjson < this.jsons.length) {
            //        if(typeof(ejecta) !== 'undefined'){
            //            this.jsons[this.currjson].data = ejecta.loadJSON(this.jsons[this.currjson].path)
            //        } else {
            this.jsons[this.currjson].data = JSON.parse(loadString(this.jsons[this.currjson].path))
            //        }
            this.currjson += 1
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
            this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
        } else {
            this.ctx.clearRect(0, 0, Game.bound.width, Game.bound.height)
        }
        this.ctx.save()

        this.ctx.fillStyle = this.progresscolor;
        this.ctx.fillRect((Game.bound.width - this.width) / 2, (Game.bound.height - this.height) / 2, this.width / 100 * this.progress, this.height);

        this.ctx.strokeStyle = this.bordercolor
        this.ctx.shadowColor = this.shadowcolor
        this.ctx.shadowBlur = this.shadowblur
        this.ctx.shadowOffsetX = this.shadowoffsetx
        this.ctx.shadowOffsetY = this.shadowoffsety
        this.ctx.beginPath();
        this.ctx.moveTo(x + this.radius, y);
        this.ctx.lineTo(x + this.width - (1 * this.radius), y)
        this.ctx.arcTo(x + this.width, y, x + this.width, y + this.radius, this.radius)
        this.ctx.arcTo(x + this.width, this.radius * 2 + y, x + this.width - (1 * this.radius), this.radius * 2 + y, this.radius)
        this.ctx.lineTo(x + this.radius, 2 * this.radius + y)
        this.ctx.arcTo(x, 2 * this.radius + y, x, y, this.radius)
        this.ctx.arcTo(x, y, 2 * this.radius + x, y, this.radius)
        this.ctx.lineWidth = this.linewidth
        this.ctx.stroke()
        this.ctx.restore()
    }
})

function MediaAssetException(message) {
    this.message = message
}



