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


/*

 Pixi renderer

 context.setTransform(

 transform[0],
 transform[3],
 transform[1],
 transform[4],
 transform[2],
 transform[5]

 );

 context.drawImage(displayObject.texture.baseTexture.source,
 frame.x,
 frame.y,
 frame.width,
 frame.height,
 (displayObject.anchor.x) * -frame.width,
 (displayObject.anchor.y) * -frame.height,
 frame.width,
 frame.height);






 Pixi Displayobject



 *
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 *
 PIXI.DisplayObject.prototype.updateTransform = function()
 {
 // TODO OPTIMIZE THIS!! with dirty
 if(this.rotation !== this.rotationCache)
 {
 this.rotationCache = this.rotation;
 this._sr =  Math.sin(this.rotation);
 this._cr =  Math.cos(this.rotation);
 }

 var localTransform = this.localTransform;
 var parentTransform = this.parent.worldTransform;
 var worldTransform = this.worldTransform;
 //console.log(localTransform)
 localTransform[0] = this._cr * this.scale.x;
 localTransform[1] = -this._sr * this.scale.y
 localTransform[3] = this._sr * this.scale.x;
 localTransform[4] = this._cr * this.scale.y;

 // TODO --> do we even need a local matrix???

 var px = this.pivot.x;
 var py = this.pivot.y;

 // Cache the matrix values (makes for huge speed increases!)
 var a00 = localTransform[0], a01 = localTransform[1], a02 = this.position.x - localTransform[0] * px - py * localTransform[1],
 a10 = localTransform[3], a11 = localTransform[4], a12 = this.position.y - localTransform[4] * py - px * localTransform[3],

 b00 = parentTransform[0], b01 = parentTransform[1], b02 = parentTransform[2],
 b10 = parentTransform[3], b11 = parentTransform[4], b12 = parentTransform[5];

 localTransform[2] = a02
 localTransform[5] = a12

 worldTransform[0] = b00 * a00 + b01 * a10;
 worldTransform[1] = b00 * a01 + b01 * a11;
 worldTransform[2] = b00 * a02 + b01 * a12 + b02;

 worldTransform[3] = b10 * a00 + b11 * a10;
 worldTransform[4] = b10 * a01 + b11 * a11;
 worldTransform[5] = b10 * a02 + b11 * a12 + b12;

 // because we are using affine transformation, we can optimise the matrix concatenation process.. wooo!
 // mat3.multiply(this.localTransform, this.parent.worldTransform, this.worldTransform);
 this.worldAlpha = this.alpha * this.parent.worldAlpha;

 this.vcount = PIXI.visibleCount;

 }






 */