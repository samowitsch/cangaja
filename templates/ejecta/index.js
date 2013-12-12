/**
 * ejecta stuff start
 */
ejecta.include('cangaja.all.js');
ejecta.include('game.js');

var w = window.innerWidth;
var h = window.innerHeight;
var w2 = w / 2;
var h2 = h / 2;

//get canvas from ejecta runtime
var canvas = document.getElementById('canvas');
canvas.width = w;
canvas.height = h;

/**
 * additional options from ejecta
 *
 * http://impactjs.com/ejecta/supported-apis-methods
 * http://impactjs.com/ejecta/overview#the-canvas-element
 * http://impactjs.com/ejecta/integrating-impact-games#screen-size
 */

/* The size of the Screen Canvas is automatically set to the screen size of the current device, but you can of course change it */

// canvas.width = w2;
// canvas.height = h2;

/* You can change the scaling of the Canvas element by setting the Canvas' style properties */

// canvas.style.width = w;
// canvas.style.height = h;

/* You can also disable retina resolution support – I have no idea why you would want to, though */

// canvas.retinaResolutionEnabled = false;

/* Fullscreen Antialiasing (MSAA) is disabled by default. If enabled, the default number of samples is 2.
MSAA will make vector drawings look a bit nicer, but has no effect for drawing images. It can be enabled with the following */

// canvas.MSAAEnabled = true;
// canvas.MSAASamples = 4; // Use for 4 samples instead of 2 (slower)

var ctx = canvas.getContext('2d');

// For pixel style games and graphics you probably want crisp nearest-neighbor scaling instead of the default bilinear. You can set this on the Canvas Context:
// ctx.imageSmoothingEnabled = false;

/**
 * ejecta stuff end
 */


/**
 * start the game
 */
var Game = new CG.MyGame(canvas)