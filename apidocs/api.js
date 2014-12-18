YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CG.Animation",
        "CG.AtlasImage",
        "CG.AtlasTexturePacker",
        "CG.B2DBridge",
        "CG.B2DChainShape",
        "CG.B2DCirlce",
        "CG.B2DEntity",
        "CG.B2DFizzXLoader",
        "CG.B2DLine",
        "CG.B2DPolygon",
        "CG.B2DRectangle",
        "CG.B2DRope",
        "CG.B2DTerrain",
        "CG.B2DWorld",
        "CG.Bitmap",
        "CG.Bound",
        "CG.Buffer",
        "CG.Button",
        "CG.CanvasRenderer",
        "CG.Delta",
        "CG.Director",
        "CG.Emitter",
        "CG.Entity",
        "CG.Font",
        "CG.Game",
        "CG.Layer",
        "CG.Map",
        "CG.MapArea",
        "CG.MapPoint",
        "CG.MapTileLayer",
        "CG.MapTileProperties",
        "CG.MediaAsset",
        "CG.Menu",
        "CG.Morph",
        "CG.Particle",
        "CG.Point",
        "CG.Screen",
        "CG.Sequence",
        "CG.SpineAnimation",
        "CG.Sprite",
        "CG.Stick",
        "CG.Text",
        "CG.Translate",
        "CG.Vector",
        "Cangaja"
    ],
    "modules": [
        "CG"
    ],
    "allModules": [
        {
            "displayName": "CG",
            "name": "CG",
            "description": "CG is the base class of the cangaja framework.\nThis file includes a requestAnimationFrame polyfill.\nIt uses the simple javascript inheritance from John Resig.\n\nClass example, how to start from scratch with simple inheritance\n\n```\n\nCG.Class.extend(\"Entity\", {\n   init: function(){\n       this.myprop = 'set from constructor'\n   }\n});\n\nCG.Entity.extend(\"Point\",{\n   init: function(x, y){\n       this._super()\n       this.x = x\n       this.y = y\n   }\n});\n\nCG.Point.extend(\"Rectangle\",{\n   init: function(x, y, w, h){\n       this._super(x, y)\n       this.w = w\n       this.h = h\n   },\n   move: function(){\n   }\n});\n\n```"
        }
    ]
} };
});