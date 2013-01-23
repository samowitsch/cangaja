/* 
 * @author Christian Sonntag <info@motions-media.de>
 */

var CG = CG || { REVISION: '1' };




(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
 * string functions
 **/

function loadString(path) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, false);
    xhr.send(null);
    if ((xhr.status == 200) || (xhr.status == 0)) return xhr.responseText;
    return "";
}


String.prototype.ltrim = function(clist) {
    if (clist) return this.replace(new RegExp('^[' + clist + ']+'), '')
    return this.replace(/^\s+/, '')
}
String.prototype.rtrim = function(clist) {
    if (clist) return this.replace(new RegExp('[' + clist + ']+$'), '')
    return this.replace(/\s+$/, '')
}
String.prototype.trim = function(clist) {
    if (clist) return this.ltrim(clist).rtrim(clist);
    return this.ltrim().rtrim();
}
String.prototype.startsWith = function(str) {
    return !this.indexOf(str);
}


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