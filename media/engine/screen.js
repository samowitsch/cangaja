/**
 * @description class Screen container to collect/group Layers
 *
 * @constructor
 * @augments Entity
 *
 * @param {string} screenname the name of the screen
 */
CG.Entity.extend('Screen', {
    init: function(screenname) {
        this._super(screenname)
        this.xscale = 1
        this.yscale = 1
        var self = this
        this.layers = []
        return this
    },
    create: function(){
    
    },
    update: function() {
        this.layers.forEach(function(element, index) {
            element.update()
        }, this)
    },
    draw: function() {
        Game.b_ctx.save()
        if(this.xscale !== 1 || this.yscale !== 1){
            Game.b_ctx.translate((Game.width - (Game.width * this.xscale)) / 2, (Game.height - (Game.height * this.yscale)) / 2)
            Game.b_ctx.scale(this.xscale,this.yscale)
        }
        this.layers.forEach(function(element, index) {
            element.draw()
        }, this)
        Game.b_ctx.restore()

    },

    /**
    * @description add a layer object to the layer array
    *
    * @param {layer} layer to add
    */
    addLayer: function(layer) {
        this.layers.push(layer)
        return this
    },

    /**
    * @description find layer by name
    *
    * @param {string} layername find layer by name
    * @return {false/layer}
    */
    getLayerByName: function (layername){
        for ( var i=0, l=this.layers.length; i<l; i++ )
        {
            if ( this.layers[i].name == layername )
            {
                return this.layers[i]
            }
        }
        return false
    }
})