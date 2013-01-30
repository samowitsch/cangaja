/**
 * @description class Font supports loading and drawing font files (EZ GUI Text format) from Glyph Designer, (Hiero works also but need some modifications of the exportet files)
 *
 * @constructor
 * @augments Entity
 */
CG.Entity.extend('Font', {
    init:function () {
        //    Entity.call(this)
        this.atlas = new Image()
        this.fieldname = ''
        this.initText = ''
        this.chars = new Array(256) //?
        this.x = new Array(256)
        this.y = new Array(256)
        this.width = new Array(256)
        this.height = new Array(256)
        this.xoff = new Array(256)
        this.yoff = new Array(256)
        this.xadv = new Array(256)
        this.lineHeight = 0

        //info
        this.face = ''
        this.size = 0
        this.bold = 0
        this.italic = 0

        this.base = 0
        this.scaleW = 0
        this.scaleH = 0
        return this
    },

    update:function () {
        throw {
            name:'Font Error',
            message:'TODO, not defined yet.'
        }
    },

    draw:function (text, xpos, ypos) {
        currx = 0
        curry = 0
        c = 0

        currx = xpos
        curry = ypos

        for (var i = 0, l = text.length; i < l; i++) {
            Game.b_ctx.drawImage(this.atlas, this.x[text.charCodeAt(i)], this.y[text.charCodeAt(i)], this.width[text.charCodeAt(i)], this.height[text.charCodeAt(i)], currx, curry + this.yoff[text.charCodeAt(i)], this.width[text.charCodeAt(i)], this.height[text.charCodeAt(i)])
            currx += this.xadv[text.charCodeAt(i)]
        }
    },

    /**
     * @description get the line height of the current font
     *
     * @return {integer} lineheight
     */
    getLineHeight:function () {
        return this.lineHeight
    },

    /**
     * @description get the font size of the current font
     *
     * @return {integer} size - font size
     */
    getFontSize:function () {
        return this.size
    },

    /**
     * @description get the width of the given text
     *
     * @param {string} text
     * @return {integer} textwidth
     */
    getLength:function (text) {
        var textwidth = 0
        var c = 0
        for (var i = 0, l = text.length; i < l; i++) {
            textwidth += this.xadv[text.charCodeAt(i)]
        }
        return textwidth
    },

    /**
     * @description loadFont - load and parse the given fontfile
     *
     * @param {string/object} fontfile path or mediaasset object with data
     */
    loadFont:function (fontfile) {
        idnum = 0
        if (typeof fontfile == 'string') {
            this.initText = loadString(fontfile)
        } else {
            this.initText = fontfile.data
        }

        var lines = this.initText.split('\n')
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


