/**
 * @description
 *
 * CG.Font supports loading and drawing font files (EZ GUI Text format) from Glyph Designer,
 * (Hiero works also but need some modifications of the exported files)
 @example
 //create font object
 small = new CG.Font().loadFont(Game.asset.getFontByName('small'))

 //draw text to canvas
 small.drawText('Foo bar!', xpos, ypos)
 *
 * @class CG.Font
 * @extends CG.Entity
 */
CG.Entity.extend('Font', {
    /**
     * @method init
     * @constructor
     * @return {*}
     */
    init: function () {
        this.instanceOf = 'Font'
        /**
         @property atlas {Image}
         */
        this.atlas = new Image()
        /**
         @property initText {string}
         */
        this.fontFile = ''
        /**
         @property chars {Array}
         */
        this.chars = new Array(256)
        /**
         @property x {Array}
         */
        this.x = new Array(256)
        /**
         @property y {Array}
         */
        this.y = new Array(256)
        /**
         @property width {Array}
         */
        this.width = new Array(256)
        /**
         @property height {Array}
         */
        this.height = new Array(256)
        /**
         @property xoff {Array}
         */
        this.xoff = new Array(256)
        /**
         @property yoff {Array}
         */
        this.yoff = new Array(256)
        /**
         @property xadv {Array}
         */
        this.xadv = new Array(256)
        /**
         @property lineHeight {Number}
         */
        this.lineHeight = 0
        /**
         @property face {string}
         */
        this.face = ''
        /**
         @property size {Number}
         */
        this.size = 0
        /**
         @property bold {Number}
         */
        this.bold = 0
        /**
         @property italic {Number}
         */
        this.italic = 0

        /**
         @property base {Number}
         */
        this.base = 0
        /**
         @property scaleW {Number}
         */
        this.scaleW = 0
        /**
         @property scaleH {Number}
         */
        this.scaleH = 0
        /**
         @property text {String}
         */
        this.text = ''
        /**
         @property currentX {Number}
         */
        this.currentX = 0
        /**
         @property currentY {Number}
         */
        this.currentY = 0
        return this
    },
    /**
     * @method update
     */
    update: function () {
        throw {
            name: 'Font Error',
            message: 'TODO, not defined yet.'
        }
    },
    /**
     * @method draw
     */
    draw: function () {
        throw {
            name: 'Font Error',
            message: 'TODO, not defined yet.'
        }
    },
    /**
     * @description draw the given text to the canvas
     * @method draw
     * @param text {string} the text to draw
     * @param xpos {Number} the x position
     * @param ypos {Number} the y position
     */
    drawText: function (text, xpos, ypos) {

        this.text = text
        this.currentX = xpos
        this.currentY = ypos

        Game.renderer.draw(this)

    },

    /**
     * @description get the line height of the current font
     * @method getLineHeight
     * @return lineheight {Number}
     */
    getLineHeight: function () {
        return this.lineHeight
    },

    /**
     * @description get the font size of the current font
     * @method getFontSize
     * @return size {Number} font size
     */
    getFontSize: function () {
        return this.size
    },

    /**
     * @description get the width of the given text
     * @method getTextWidth
     * @param text {string} the string to calculate the width
     * @return textwidth {Number}
     */
    getTextWidth: function (text) {
        var textwidth = 0
        var c = 0
        for (var i = 0, l = text.length; i < l; i++) {
            textwidth += this.xadv[text.charCodeAt(i)]
        }
        return textwidth
    },

    /**
     * Options:
     * font {string} path or mediaasset object with data
     *
     @example
     gill = new CG.Font().loadFont({
        font: this.asset.getFontByName('gill')
     })
     *
     * @description loadFont - load and parse the given fontfile
     * @method loadFont
     * @param {object} options
     */
    loadFont: function (options) {
        idnum = 0

        if (options) {
            CG._extend(this, options)
        }

        if (typeof this.font == 'string') {
            this.fontFile = loadString(this.font)
        } else {
            this.fontFile = this.font.data
        }

        var lines = this.fontFile.split('\n')
        for (l in lines) {
            line = lines[l].trim()

            if (line.startsWith('info') || line == '') {
                var infodata = line.split(' ')
                for (i in infodata) {
                    var info = infodata[i]
                    if (info.startsWith('face=')) {
                        var face = info.split("=")
                        this.face = face[1].split('"').join('')
                    }
                    if (info.startsWith('size=')) {
                        var size = info.split("=")
                        this.size = parseInt(size[1])
                    }
                    if (info.startsWith('bold=')) {
                        var bold = info.split("=")
                        this.bold = parseInt(bold[1])
                    }
                    if (info.startsWith('italic=')) {
                        var italic = info.split("=")
                        this.italic = parseInt(italic[1])
                    }
                }
            }
            if (line.startsWith('padding')) {
                continue
            }
            if (line.startsWith('common')) {
                var commondata = line.split(' ')
                for (c in commondata) {
                    var common = commondata[c]
                    if (common.startsWith('lineHeight=')) {
                        var lnh = common.split("=")
                        this.lineHeight = parseInt(lnh[1])
                    }
                    if (common.startsWith('base=')) {
                        var base = common.split("=")
                        this.base = parseInt(base[1])
                    }
                    if (common.startsWith('scaleW=')) {
                        var scaleW = common.split("=")
                        this.scaleW = parseInt(scaleW[1])
                    }
                    if (common.startsWith('scaleH=')) {
                        var scaleH = common.split("=")
                        this.scaleH = parseInt(scaleH[1])
                    }
                }
            }
            if (line.startsWith('page')) {
                var pagedata = line.split(' ')
                for (p in pagedata) {
                    data = pagedata[p]
                    if (data.startsWith('file=')) {
                        var fn = data.split('=')
                        this.atlas.src = 'media/font/' + fn[1].split('"').join('')
                    }

                }
            }
            if (line.startsWith('chars')) {
                continue
            }
            if (line.startsWith('char')) {
                var linedata = line.split(' ')
                for (l in linedata) {
                    ld = linedata[l]
                    if (ld.startsWith('id=')) {
                        var idc = ld.split('=')
                        idnum = parseInt(idc[1])
                    }
                    if (ld.startsWith('x=')) {
                        var xc = ld.split('=')
                        this.x[idnum] = parseInt(xc[1])
                    }
                    if (ld.startsWith('y=')) {
                        var yc = ld.split('=')
                        this.y[idnum] = parseInt(yc[1])
                    }
                    if (ld.startsWith('width=')) {
                        var wc = ld.split('=')
                        this.width[idnum] = parseInt(wc[1])
                    }
                    if (ld.startsWith('height=')) {
                        var hc = ld.split('=')
                        this.height[idnum] = parseInt(hc[1])
                    }
                    if (ld.startsWith('xoffset=')) {
                        var xoc = ld.split('=')
                        this.xoff[idnum] = parseInt(xoc[1])
                    }
                    if (ld.startsWith('yoffset=')) {
                        var yoc = ld.split('=')
                        this.yoff[idnum] = parseInt(yoc[1])
                    }
                    if (ld.startsWith('xadvance=')) {
                        var advc = ld.split('=')
                        this.xadv[idnum] = parseInt(advc[1])
                    }
                }
            }
        }
        return this
    }
})


