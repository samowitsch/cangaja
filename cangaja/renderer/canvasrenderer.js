/**
 * @description
 *
 * A CanvasRenderer with WebGL and Canvas 2D fallback would be really nice ;o)
 * How to implement all the different classes....?
 *
 * Or make it like Phaser and implement pixi.js?
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

        //TODO switch from translate, rotate, scale to transform?

        //TODO the renderer recognizes the canvas features WebGL/Canvas

        //TODO the renderer creates the canvas element

        return this
    },
    /**
     * @description central draw method for all objects that draws to the canvas
     * @method draw
     * @param {object} renderObject the object to render
     */
    draw: function (renderObject) {
        Game.b_ctx.save()


        switch (renderObject.instanceOf) {


            case "Sprite":
            case "Button":
            case "Particle":

                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.transform(1, 0, 0, 1, renderObject.position.x, renderObject.position.y)
                if (renderObject.atlasimage) {
                    Game.b_ctx.rotate((renderObject.rotation - renderObject.imagerotation) * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.cutwidth * renderObject.xscale, renderObject.cutheight * renderObject.yscale)
                } else {
                    Game.b_ctx.rotate(renderObject.rotation * CG.Const_PI_180)
                    Game.b_ctx.drawImage(renderObject.image, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.image.width * renderObject.xscale, renderObject.image.height * renderObject.yscale)
                }
                break;

            case "SpineAnimation":

                Game.b_ctx.globalAlpha = renderObject.alpha

                Game.b_ctx.transform(renderObject.transform.m[0], renderObject.transform.m[1], renderObject.transform.m[2], renderObject.transform.m[3], renderObject.transform.m[4], renderObject.transform.m[5])

                Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, renderObject.xpos, renderObject.ypos, renderObject.cutwidth * renderObject.xscale, renderObject.cutheight * renderObject.yscale)
                break;

            case "Animation":

                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.transform(1, 0, 0, 1, renderObject.position.x, renderObject.position.y)
                if (renderObject.frames == 1) {
                    Game.b_ctx.drawImage(renderObject.image, renderObject.position.x, renderObject.position.y, renderObject.image.width * renderObject.xscale, renderObject.image.height * renderObject.yscale)
                }
                else {
                    renderObject.fx = renderObject.currentFrame * renderObject.width

                    if ((renderObject.fx / renderObject.image.width) > 0) {
                        renderObject.fx = renderObject.fx % renderObject.image.width
                    }
                    renderObject.fy = Math.floor(renderObject.width * renderObject.currentFrame / renderObject.image.width) * renderObject.height

                    Game.b_ctx.rotate(renderObject.rotation * CG.Const_PI_180)
                    try {
                        Game.b_ctx.drawImage(renderObject.image, renderObject.fx, renderObject.fy, renderObject.width, renderObject.height, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.width * renderObject.xscale, renderObject.height * renderObject.yscale)
                    } catch (e) {

                    }
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

                Game.b_ctx.globalAlpha = renderObject.layers[renderObject.layer].opacity
                Game.b_ctx.transform(1, 0, 0, 1, renderObject.rx, renderObject.ry)

                if (renderObject.orientation == 'orthogonal') {

                    try {
                        Game.b_ctx.drawImage(renderObject.atlas, renderObject.cx, renderObject.cy, renderObject.tilewidth, renderObject.tileheight, renderObject.sx, renderObject.sy, renderObject.tilewidth * renderObject.xscale, renderObject.tileheight * renderObject.yscale)
                    } catch (e) {
                    }

                } else if (renderObject.orientation == 'isometric') {

                    try {
                        Game.b_ctx.drawImage(renderObject.atlas, renderObject.cx, renderObject.cy, renderObject.tilewidth, renderObject.tileset.tileheight, renderObject.sx, renderObject.sy, renderObject.tilewidth * renderObject.xscale, renderObject.tileset.tileheight * renderObject.yscale)
                    } catch (e) {

                    }

                }

                break;

            case "B2DEntity":
            case "B2DCircle":
            case "B2DRectangle":
            case "B2DPolygon":
            case "B2DBridge":
            case "B2DRope":

                Game.b_ctx.globalAlpha = renderObject.alpha
                Game.b_ctx.transform(1, 0, 0, 1, renderObject.body.GetPosition().x * renderObject.scale, renderObject.body.GetPosition().y * renderObject.scale)
                if (renderObject.atlasimage) {
                    Game.b_ctx.rotate((renderObject.body.GetAngleRadians() - renderObject.imagerotation))
                    Game.b_ctx.drawImage(renderObject.image, renderObject.xoffset, renderObject.yoffset, renderObject.cutwidth, renderObject.cutheight, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.cutwidth, renderObject.cutheight)
                } else {
                    Game.b_ctx.rotate(renderObject.body.GetAngleRadians())
                    Game.b_ctx.drawImage(renderObject.image, 0 - renderObject.xhandle, 0 - renderObject.yhandle, renderObject.image.width, renderObject.image.height)
                }
                break;

        }

        Game.b_ctx.restore()
    }
})