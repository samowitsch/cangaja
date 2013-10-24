var renderStats

var mainscreen, mainlayer

var mousex = 0
var mousey = 0
var mousedown = false
var leftplayer
var tp = new CG.TexturePacker()
var collision = {direction: '', overlap: 0}



//waiting to get started ;o)
window.onload = function () {

    //create canvas element programaticaly
    can = document.createElement('canvas')
    can.width = 1024
    can.height = 768
    can.id = 'canvas'
    document.body.appendChild(can)

    //mouse move


    can.addEventListener('mousedown', function (e) {
        mousedown = true;
    }, true);

    can.addEventListener('mouseup', function () {
        mousedown = false;
    }, true);

    can.addEventListener('mousemove', function (evt) {
        var rect = can.getBoundingClientRect(), root = document.documentElement;
        mousex = evt.clientX - canvas.offsetLeft;
        mousey = evt.clientY - canvas.offsetTop;
    }, false);

    Game.preload()
};
