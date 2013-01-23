/*
 * don't change this constants
 */

//math constants
const Const_PI_180 = Math.PI / 180
const Const_180_PI = 180 / Math.PI

// misc constants
const LEFT = 1
const RIGHT = 2
const UP = 3
const DOWN = 4

//canvas stuff
var canvas
var ctx

// the game object
var Game = {
    fps: 60,
    width: 640,
    height: 480,
    width2: 640 / 2,
    height2: 480 / 2,
    bound: {}, //new CG.Bound(0,0,640,480).setName('game'),
    b_canvas: false,
    b_ctx: false,
    asset: {},     //initialize media asset with background image
    director: {},
    delta: {},
    preload: function(){},
    create: function(){},
    loop: function(){},
    run: function(){},
    update: function(){},
    draw: function(){},
    touchinit: function(){},
    touchhandler: function(){}
}