CG.Game.extend('MyGame', {
    init: function (canvas, options) {
        //call init from super class
        this._super(canvas, options)
        //add custom properties here or remove the init method
    },
    preload: function () {
        this.asset.addFont('media/font/small.txt', 'small', 'small')
            .addFont('media/font/abadi_ez.txt', 'abadi')
            .addImage('media/img/player.png', 'player')
            .addImage('media/img/btn-jump.png', 'jump')
            .addImage('media/img/btn-shoot.png', 'shoot')
            .addImage('media/img/chain.png', 'chain')
            .addImage('media/img/player-anim.png', 'player-anim')
            .addJson('media/map/map1.json', 'map1')
            .startPreLoad()
    },
    create: function () {
        abadi = new CG.Font().loadFont({font: this.asset.getFontByName('abadi')})
        small = new CG.Font().loadFont({font: this.asset.getFontByName('small')})

        //create tilemap
        map = new CG.Box2DMap({
            width: Game.width,
            height: Game.height,
            callback: function () {
            }
        })
        map.loadMapJson(this.asset.getJsonByName('map1'))

        //screen and layer
        mainscreen = new CG.Screen({
            name: 'mainscreen'
        })
        maplayer = new CG.Layer({
            name: 'maplayer',
            fixedPosition: true
        })
        mainlayer = new CG.Layer({
            name: 'mainlayer'
        })

        maplayer.addElement(map)

        stick = new CG.GameController({
            maxLength: 60,
            buttons: [
                new CG.Button({
                    //text: 'J',
                    //font: heiti,
                    image: Game.asset.getImageByName('jump'),
                    position: new CG.Point(Game.width - 200, Game.height - 75),
                    callbacks: {
                        clicked: function () {
                            b2world.player.startJump()
                        }
                    }
                }),
                new CG.Button({
                    //text: 'J',
                    //font: heiti,
                    image: Game.asset.getImageByName('shoot'),
                    position: new CG.Point(Game.width - 100, Game.height - 175),
                    callbacks: {
                        clicked: function () {

                        }
                    }
                })
            ]
        })

        maplayer.addElement(stick)

        //create Box2D World
        b2world = new CG.B2DLevel({
            name: 'box2d-world',
            debug: 0
        })
        mainlayer.addElement(b2world)

        mainscreen
            .addLayer(maplayer)
            .addLayer(mainlayer)

        //add screen to Director
        this.director.addScreen(mainscreen)

        if (!navigator.isCocoonJS) {
            renderStats = new Stats()
            document.body.appendChild(renderStats.domElement)
        }

        //after creation start game loop
        this.loop()
    },
    update: function () {
        if (!navigator.isCocoonJS) renderStats.update()

        var offSetX = Game.width2 - b2world.playerRealWorldPosition.x,
            offSetY = Game.height2 - b2world.playerRealWorldPosition.y

        mainscreen.position.x = offSetX
        mainscreen.position.y = offSetY

        map.mapOffset.x = (offSetX * -1)
        map.mapOffset.y = (offSetY * -1)

    },
    draw: function () {
        abadi.drawText('Box2d platformer[runs best on Ludei/CocoonJS]', xpos, ypos)
        small.drawText('Falling => ' + b2world.player.isFalling, xpos, ypos + 50)
        small.drawText('Jumping => ' + b2world.player.isJumping, xpos, ypos + 75)
        small.drawText('On ground => ' + b2world.player.onGround, xpos, ypos + 100)
        small.drawText('On ladder => ' + b2world.player.onLadder, xpos, ypos + 125)
        small.drawText('Body GravityScale => ' + b2world.player.body.GetGravityScale(), xpos, ypos + 150)
        small.drawText('Body LinearDamping => ' + b2world.player.body.GetLinearDamping(), xpos, ypos + 175)
    },
    callbacks: {
        callbackMapCollision: function () {

        }
    }
})