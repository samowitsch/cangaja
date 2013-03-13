/**
 * @description
 *
 * A CanvasRenderer with WebGL and Canvas 2D fallback would be really nice ;o)
 * How to implement all the different classes....?
 *
 *
 * @class CG.CanvasRenderer
 * @extend CG.Class
 */


CG.Class.extend('CanvasRenderer', {
    /**
     * @method init
     * @constructor
     * @return {*}
     */
    init:function(){

        //TODO the renderer recognizes the canvas features WebGL/Canvas

        //TODO the renderer creates the canvas element

        //TODO the renderer handles all drawings from all classes, urgh ;o)

        /*

         //sprite draw method

         draw:function () {
             this.updateDiff()

             Game.b_ctx.save()
             Game.b_ctx.globalAlpha = this.alpha
             Game.b_ctx.translate(this.position.x, this.position.y)
             if (this.atlasimage) {
                 Game.b_ctx.rotate((this.rotation - this.imagerotation) * CG.Const_PI_180)
                 Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - this.xhandle, 0 - this.yhandle, this.cutwidth * this.xscale, this.cutheight * this.yscale)
             } else {
                 Game.b_ctx.rotate(this.rotation * CG.Const_PI_180)
                 Game.b_ctx.drawImage(this.image, 0 - this.xhandle, 0 - this.yhandle, this.image.width * this.xscale, this.image.height * this.yscale)
             }
             Game.b_ctx.restore()
         },




        //animation draw method
         draw:function () {
             this.updateDiff()

             Game.b_ctx.save()
             Game.b_ctx.globalAlpha = this.alpha
             Game.b_ctx.translate(this.position.x, this.position.y)
             if (this.frames == 1) {
                 Game.b_ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width * this.xscale, this.image.height * this.yscale)
             }
             else {
                 this.fx = this.currentframe * this.width

                 if ((this.fx / this.image.width) > 0) {
                 this.fx = this.fx % this.image.width
                 }
                 this.fy = Math.floor(this.width * this.currentframe / this.image.width) * this.height

                 Game.b_ctx.rotate(this.rotation * CG.Const_PI_180)
                 try {
                 Game.b_ctx.drawImage(this.image, this.fx, this.fy, this.width, this.height, 0 - this.xhandle, 0 - this.yhandle, this.width * this.xscale, this.height * this.yscale)
                 } catch (e) {

                 }
             }
             Game.b_ctx.restore()
         }



         //button draw method
         draw:function () {
             Game.b_ctx.save()
             Game.b_ctx.translate(this.position.x, this.position.y)
             if (this.atlasimage) {
                 var r = this.rotation
                 Game.b_ctx.rotate((r - this.imagerotation) * CG.Const_PI_180)
                 Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - (this.cutwidth / 2), 0 - (this.cutheight / 2), this.cutwidth * this.xscale, this.cutheight * this.yscale)
                 Game.b_ctx.rotate(this.imagerotation * CG.Const_PI_180)
             } else {
                 Game.b_ctx.rotate(r * CG.Const_PI_180)
                 Game.b_ctx.drawImage(this.image, 0 - (this.image.width * this.xscale / 2), 0 - (this.image.height * this.yscale / 2), this.image.width * this.xscale, this.image.height * this.yscale)
             }
             this.font.draw(this.text, 0 - (this.font.getTextWidth(this.text) / 2 >> 0), 0 - ((this.font.getFontSize() / 2) >> 0))
             Game.b_ctx.restore()
         }


        //particle draw method
         draw:function () {
             if (this.visible) {
                 Game.b_ctx.save()
                 Game.b_ctx.globalAlpha = this.alpha
                 Game.b_ctx.translate(this.position.x, this.position.y)
                 if (this.atlasimage) {
                     Game.b_ctx.rotate((this.rotation - this.imagerotation) * CG.Const_PI_180)
                     Game.b_ctx.drawImage(this.image, this.xoffset, this.yoffset, this.cutwidth, this.cutheight, 0 - (this.cutwidth / 2), 0 - (this.cutheight / 2), this.cutwidth * this.xscale, this.cutheight * this.yscale)
                     Game.b_ctx.rotate((this.rotation + this.imagerotation) * CG.Const_PI_180)
                 } else {
                     Game.b_ctx.rotate(this.rotation * CG.Const_PI_180)
                     Game.b_ctx.drawImage(this.image, 0 - (this.image.width * this.xscale / 2), 0 - (this.image.height * this.yscale / 2), this.image.width * this.xscale, this.image.height * this.yscale)
                 }
                 Game.b_ctx.restore()
             }
         }



         //map drawmap part orthogonal
         Game.b_ctx.save()
         Game.b_ctx.globalAlpha = this.layers[layer].opacity
         Game.b_ctx.translate(rx, ry)
         try {
            Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileheight, this.sx, this.sy, this.tilewidth * this.xscale, this.tileheight * this.yscale)
         } catch (e) {
         }
         Game.b_ctx.restore()


         //map drawmap part isometric
         Game.b_ctx.save()
         Game.b_ctx.globalAlpha = this.layers[layer].opacity
         Game.b_ctx.translate(xpos, ypos)
         try {
            Game.b_ctx.drawImage(this.atlas, cx, cy, this.tilewidth, this.tileset.tileheight, 0, 0, this.tilewidth * this.xscale, this.tileset.tileheight * this.yscale)
         } catch (e) {

         }
         Game.b_ctx.restore()



        //font class part draw
         for (var i = 0, l = text.length; i < l; i++) {
             Game.b_ctx.drawImage(this.atlas, this.x[text.charCodeAt(i)], this.y[text.charCodeAt(i)], this.width[text.charCodeAt(i)], this.height[text.charCodeAt(i)], currx, curry + this.yoff[text.charCodeAt(i)], this.width[text.charCodeAt(i)], this.height[text.charCodeAt(i)])
             currx += this.xadv[text.charCodeAt(i)]
         }


         //bitmap class
         draw:function () {
             Game.b_ctx.drawImage(this.bitmap_canvas, this.x, this.y)
         },











         */
        return this
    }
})