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
    init: function (canvas) {

        //TODO the renderer recognizes the canvas features WebGL/Canvas

        //TODO the renderer creates the canvas element

        return this
    },
    draw: function (renderObject) {
        Game.b_ctx.save()


        switch (renderObject.instanceOf) {


            case "Sprite":


                renderObject.updateDiff()

                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.translate(renderObject.position.x, renderObject.position.y)
                if (renderObject.atlasimage) {
                    Game.b_ctx.rotate((renderObject.rotation - renderObject.imagerotation) * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.cutwidth * renderObject.xscale, renderObject.cutheight * renderObject.yscale)
                } else {
                    Game.b_ctx.rotate(renderObject.rotation * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.image.width * renderObject.xscale, renderObject.image.height * renderObject.yscale)
                }
                break;


            case "Animation":


                renderObject.updateDiff()

                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.translate(renderObject.position.x, renderObject.position.y)
                if (renderObject.frames == 1) {
                    Game.b_ctx.drawImage(renderObject.image, renderObject.position.x, renderObject.position.y, renderObject.image.width * renderObject.xscale, renderObject.image.height * renderObject.yscale)
                }
                else {
                    renderObject.fx = renderObject.currentframe * renderObject.width

                    if ((renderObject.fx / renderObject.image.width) > 0) {
                        renderObject.fx = renderObject.fx % renderObject.image.width
                    }
                    renderObject.fy = Math.floor(renderObject.width * renderObject.currentframe / renderObject.image.width) * renderObject.height

                    Game.b_ctx.rotate(renderObject.rotation * CG.Const_PI_180)
                    try {
                        Game.b_ctx.drawImage(renderObject.image, renderObject.fx, renderObject.fy, renderObject.width, renderObject.height, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.width * renderObject.xscale, renderObject.height * renderObject.yscale)
                    } catch (e) {

                    }
                }
                break;


            case "Button":


                Game.b_ctx.translate(renderObject.position.x, renderObject.position.y)
                if (renderObject.atlasimage) {
                    var r = renderObject.rotation
                    Game.b_ctx.rotate((r - renderObject.imagerotation) * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - (renderObject.cutwidth / 2), 0 - (renderObject.cutheight / 2), renderObject.cutwidth * renderObject.xscale, renderObject.cutheight * renderObject.yscale)
                    Game.b_ctx.rotate(renderObject.imagerotation * CG.Const_PI_180)
                } else {
                    Game.b_ctx.rotate(r * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, 0 - (renderObject.image.width * renderObject.xscale / 2), 0 - (renderObject.image.height * renderObject.yscale / 2), renderObject.image.width * renderObject.xscale, renderObject.image.height * renderObject.yscale)
                }
                renderObject.font.drawText(renderObject.text, 0 - (renderObject.font.getTextWidth(renderObject.text) / 2 >> 0), 0 - ((renderObject.font.getFontSize() / 2) >> 0))

                break;


            case "Particle":


                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.translate(renderObject.position.x, renderObject.position.y)
                if (renderObject.atlasimage) {
                    Game.b_ctx.rotate((renderObject.rotation - renderObject.imagerotation) * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - (renderObject.cutwidth / 2), 0 - (renderObject.cutheight / 2), renderObject.cutwidth * renderObject.xscale, renderObject.cutheight * renderObject.yscale)
                    Game.b_ctx.rotate((renderObject.rotation + renderObject.imagerotation) * CG.Const_PI_180)
                } else {
                    Game.b_ctx.rotate(renderObject.rotation * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, 0 - (renderObject.image.width * renderObject.xscale / 2), 0 - (renderObject.image.height * renderObject.yscale / 2), renderObject.image.width * renderObject.xscale, renderObject.image.height * renderObject.yscale)
                }

                break;


            case "Font":


                for (var i = 0, l = renderObject.text.length; i < l; i++) {
                    var charCode = renderObject.text.charCodeAt(i)
                    try {
                        Game.b_ctx.drawImage(
                            renderObject.atlas,
                            renderObject.x[charCode],
                            renderObject.y[charCode],
                            renderObject.width[charCode],
                            renderObject.height[charCode],
                            renderObject.currentX,
                            renderObject.currentY + renderObject.yoff[charCode],
                            renderObject.width[charCode],
                            renderObject.height[charCode]
                        )
                    } catch (e) {
                        //console.log("drawText error: " + e)
                    }
                    renderObject.currentX += renderObject.xadv[charCode]
                }
                break;


            case "Bitmap":


                Game.b_ctx.drawImage(renderObject.bitmap_canvas, renderObject.x, renderObject.y)
                break;


            case "Map":


                if (renderObject.orientation == 'orthogonal') {

                    Game.b_ctx.globalAlpha = renderObject.layers[renderObject.layer].opacity
                    Game.b_ctx.translate(renderObject.rx, renderObject.ry)
                    try {
                        Game.b_ctx.drawImage(renderObject.atlas, renderObject.cx, renderObject.cy, renderObject.tilewidth, renderObject.tileheight, renderObject.sx, renderObject.sy, renderObject.tilewidth * renderObject.xscale, renderObject.tileheight * renderObject.yscale)
                    } catch (e) {
                    }

                } else if (renderObject.orientation == 'isometric') {

                    Game.b_ctx.globalAlpha = renderObject.layers[renderObject.layer].opacity
                    Game.b_ctx.translate(renderObject.xpos, renderObject.ypos)
                    try {
                        Game.b_ctx.drawImage(renderObject.atlas, renderObject.cx, renderObject.cy, renderObject.tilewidth, renderObject.tileset.tileheight, 0, 0, renderObject.tilewidth * renderObject.xscale, renderObject.tileset.tileheight * renderObject.yscale)
                    } catch (e) {

                    }

                }

                break;

            case "B2DEntity":
            case "B2DCircle":
            case "B2DRectangle":
            case "B2DPolygon":


                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.translate(renderObject.body.GetPosition().x * renderObject.scale, renderObject.body.GetPosition().y * renderObject.scale)
                if (renderObject.atlasimage) {
                    Game.b_ctx.rotate((renderObject.body.GetAngleRadians() - renderObject.imagerotation))
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.cutwidth, renderObject.cutheight)
                } else {
                    Game.b_ctx.rotate(renderObject.body.GetAngleRadians())
                    Game.b_ctx.drawImage(renderObject.image, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.image.width, renderObject.image.height)
                }
                break;

            case "B2DBridge":
            case "B2DRope":
                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.translate(renderObject.xd * renderObject.scale, renderObject.yd * renderObject.scale)
                if (renderObject.atlasimage) {
                    Game.b_ctx.rotate(renderObject.rd - renderObject.imagerotation)
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.cutwidth, renderObject.cutheight)
                } else {
                    Game.b_ctx.rotate(renderObject.rd)
                    Game.b_ctx.drawImage(renderObject.image, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.image.width, renderObject.image.height)
                }
                break;
        }


        Game.b_ctx.restore()
    }
})