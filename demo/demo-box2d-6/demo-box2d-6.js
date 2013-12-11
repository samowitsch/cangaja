var canvas, Game

window.onload = function () {

    canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 384
    canvas.id = 'canvas'
    document.body.appendChild(canvas)

    Game = new CG.MyGame(canvas)
};
