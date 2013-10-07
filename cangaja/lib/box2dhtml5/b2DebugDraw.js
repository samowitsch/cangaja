/*
* Copyright (c) 2006-2007 Erin Catto http://www.box2d.org
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked as such, and must not be
* misrepresented as being the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

goog.provide('box2d.Render');

goog.require('box2d');

goog.require('goog.string.format');

/** 
 * This class implements debug drawing callbacks that are 
 * invoked inside b2World::Step. 
 * @export 
 * @constructor
 * @extends {box2d.b2Draw} 
 * @param {object} opts
 */
box2d.b2DebugDraw = function (opts)
{
	goog.base(this);

    this.scale = opts.scale
	this.m_canvas = opts.canvas || false
	this.m_ctx = opts.ctx || false
    this.m_settings = opts.flags || box2d.b2DrawFlags.e_shapeBit
    this.alpha = opts.alpha || 0.5
}

goog.inherits(box2d.b2DebugDraw, box2d.b2Draw);

/**
 * @export 
 * @type {HTMLCanvasElement} 
 */
box2d.b2DebugDraw.prototype.m_canvas = null;
/**
 * @export 
 * @type {CanvasRenderingContext2D} 
 */
box2d.b2DebugDraw.prototype.m_ctx = null;
/**
 * @export 
 * @type {box2d.Settings} 
 */
box2d.b2DebugDraw.prototype.m_settings = null;

box2d.b2DebugDraw.prototype.scale = 40;
box2d.b2DebugDraw.prototype.alpha = 0.5;


/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Transform} xf 
 */
box2d.b2DebugDraw.prototype.PushTransform = function (xf)
{
	var ctx = this.m_ctx;
	ctx.save();
    ctx.globalAlpha = this.alpha
	ctx.translate(xf.p.x * this.scale, xf.p.y * this.scale);
	ctx.rotate(xf.q.GetAngleRadians());
}

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Transform} xf 
 */
box2d.b2DebugDraw.prototype.PopTransform = function (xf)
{
	var ctx = this.m_ctx;
	ctx.restore();
}

/**
 * @export 
 * @return {void} 
 * @param {Array.<box2d.b2Vec2>} vertices 
 * @param {number} vertexCount 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawPolygon = function (vertices, vertexCount, color)
{
	if (!vertexCount) return;

	var ctx = this.m_ctx;

	ctx.beginPath();
	ctx.moveTo(vertices[0].x, vertices[0].y);
	for (var i = 1; i < vertexCount; i++)
	{
		ctx.lineTo(vertices[i].x * this.scale, vertices[i].y * this.scale);
	}
	ctx.closePath();
	ctx.strokeStyle = color.MakeStyleString(1);
	ctx.stroke();
};

/**
 * @export 
 * @return {void} 
 * @param {Array.<box2d.b2Vec2>} vertices 
 * @param {number} vertexCount 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawSolidPolygon = function (vertices, vertexCount, color)
{
    if (!vertexCount) return;

	var ctx = this.m_ctx;

	ctx.beginPath();
	ctx.moveTo(vertices[0].x * this.scale, vertices[0].y * this.scale);
	for (var i = 1; i < vertexCount; i++)
	{
		ctx.lineTo(vertices[i].x * this.scale, vertices[i].y * this.scale);
	}
	ctx.closePath();
	ctx.fillStyle = color.MakeStyleString(0.5);
	ctx.fill();
	ctx.strokeStyle = color.MakeStyleString(1);
	ctx.stroke();
};

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Vec2} center 
 * @param {number} radius 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawCircle = function (center, radius, color)
{
    if (!radius) return;

	var ctx = this.m_ctx;

	ctx.beginPath();
	ctx.arc(center.x * this.scale, center.y * this.scale, radius * this.scale, 0, box2d.b2_pi * 2, true);
	ctx.strokeStyle = color.MakeStyleString(1);
	ctx.stroke();
};

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Vec2} center 
 * @param {number} radius 
 * @param {box2d.b2Vec2} axis 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawSolidCircle = function (center, radius, axis, color)
{
	if (!radius) return;

	var ctx = this.m_ctx;

	var cx = center.x * this.scale;
	var cy = center.y * this.scale;
	ctx.beginPath();
	ctx.arc(cx, cy, radius, 0, box2d.b2_pi * 2, true);
	ctx.moveTo(cx, cy);
	ctx.lineTo((cx + axis.x * this.scale * radius), (cy + axis.y * this.scale * radius));
	ctx.fillStyle = color.MakeStyleString(0.5);
	ctx.fill();
	ctx.strokeStyle = color.MakeStyleString(1);
	ctx.stroke();
};

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Vec2} p1 
 * @param {box2d.b2Vec2} p2 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawSegment = function (p1, p2, color)
{
	var ctx = this.m_ctx;

	ctx.beginPath();
	ctx.moveTo(p1.x * this.scale, p1.y * this.scale);
	ctx.lineTo(p2.x * this.scale, p2.y * this.scale);
	ctx.strokeStyle = color.MakeStyleString(1);
	ctx.stroke();
};

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Transform} xf 
 */
box2d.b2DebugDraw.prototype.DrawTransform = function (xf)
{
	var ctx = this.m_ctx;

	this.PushTransform(xf);

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(1, 0);
	ctx.strokeStyle = box2d.b2Color.RED.MakeStyleString(1);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 1);
	ctx.strokeStyle = box2d.b2Color.GREEN.MakeStyleString(1);
	ctx.stroke();

	this.PopTransform(xf);
};

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2Vec2} p 
 * @param {number} size 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawPoint = function (p, size, color)
{
	var ctx = this.m_ctx;

	ctx.fillStyle = color.MakeStyleString();
	size /= this.m_settings.viewZoom;
	size /= this.m_settings.canvasScale;
	var hsize = size / 2;
	ctx.fillRect(p.x * this.scale - hsize, p.y * this.scale - hsize, size, size);
}

/**
 * @export 
 * @param {number} x 
 * @param {number} y 
 * @param {string} format
 * @param {...string|number} var_args 
 */
box2d.b2DebugDraw.prototype.DrawString = function (x, y, format, var_args)
{
	var ctx = this.m_ctx;

	var args = Array.prototype.slice.call(arguments);
	var string = goog.string.format.apply(null, args.slice(2));

	ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.font = '18pt helvetica';//'9pt lucida console';
		var color = box2d.b2DebugDraw.prototype.DrawString.s_color;
		ctx.fillStyle = color.MakeStyleString();
		ctx.fillText(string, x * this.scale, y * this.scale);
	ctx.restore();
}
box2d.b2DebugDraw.prototype.DrawString.s_color = new box2d.b2Color(0.9, 0.6, 0.6);

/**
 * @export 
 * @param {number} x 
 * @param {number} y 
 * @param {string} format
 * @param {...string|number} var_args 
 */
box2d.b2DebugDraw.prototype.DrawStringWorld = function (x, y, format, var_args)
{
	var p = box2d.b2DebugDraw.prototype.DrawStringWorld.s_p.SetXY(x, y);

	// world -> viewport
	var vt = this.m_settings.viewCenter;
	box2d.b2SubVV(p, vt, p);
	var vr = this.m_settings.viewRotation;
	box2d.b2MulTRV(vr, p, p);
	var vs = this.m_settings.viewZoom;
	box2d.b2MulSV(vs, p, p);

	// viewport -> canvas
	var cs = this.m_settings.canvasScale;
	box2d.b2MulSV(cs, p, p);
	p.y *= -1;
	var cc = box2d.b2DebugDraw.prototype.DrawStringWorld.s_cc.SetXY(0.5 * this.m_canvas.width, 0.5 * this.m_canvas.height);
	box2d.b2AddVV(p, cc, p);

	var ctx = this.m_ctx;

	var args = Array.prototype.slice.call(arguments);
	var string = goog.string.format.apply(null, args.slice(2));

	ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.font = '18pt helvetica';//'9pt lucida console';
		var color = box2d.b2DebugDraw.prototype.DrawStringWorld.s_color;
		ctx.fillStyle = color.MakeStyleString();
		ctx.fillText(string, p.x * this.scale, p.y * this.scale);
	ctx.restore();
}
box2d.b2DebugDraw.prototype.DrawStringWorld.s_p = new box2d.b2Vec2();
box2d.b2DebugDraw.prototype.DrawStringWorld.s_cc = new box2d.b2Vec2();
box2d.b2DebugDraw.prototype.DrawStringWorld.s_color = new box2d.b2Color(0.5, 0.9, 0.5);

/**
 * @export 
 * @return {void} 
 * @param {box2d.b2AABB} aabb 
 * @param {box2d.b2Color} color 
 */
box2d.b2DebugDraw.prototype.DrawAABB = function (aabb, color)
{
	var ctx = this.m_ctx;

	ctx.strokeStyle = color.MakeStyleString();
	var x = aabb.lowerBound.x;
	var y = aabb.lowerBound.y;
	var w = aabb.upperBound.x - aabb.lowerBound.x;
	var h = aabb.upperBound.y - aabb.lowerBound.y;
	ctx.strokeRect(x * this.scale, y * this.scale, w * this.scale, h * this.scale);
}

box2d.b2DebugDraw.prototype.SetFlags = function (flags) {
    this.m_settings = flags
}

box2d.b2DebugDraw.prototype.GetFlags = function () {
    return this.m_settings
}
