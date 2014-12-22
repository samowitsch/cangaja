var renderStats,
    mainscreen, mainlayer, maplayer, guilayer,
    canvas, Game, map,
    xpos = 5, ypos = 5, abadi, small,
    stick, b2world,

    // dummy
    mousex = 0, mousey = 0

window.onload = function () {
    canvas = document.createElement(navigator.isCocoonJS ? 'screencanvas' : 'canvas')
    canvas.width = 800
    canvas.height = 600
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};

