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

var ctx = canvas.getContext('2d');
/**
 * ejecta stuff end
 */


/**
 * start the game
 */
var Game = new CG.MyGame(canvas)