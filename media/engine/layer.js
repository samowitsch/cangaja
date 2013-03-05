/**
 * @description class Layer container to collect/group sprites, buttons, menus, emitters and animations
 *
 * @class CG.Layer
 * @extends CG.Entity
 *
 */
CG.Entity.extend('Layer', {
    /**
     * @constructor
     * @method init
     * @param layername {string} the name of the layer
     * @return {*}
     */
    init:function (layername) {
        this._super(layername)

        var self = this
        this.elements = []
        this.elementsToDelete = []
        return this
    },
    update:function () {
        if (this.visible == true) {
            this.elements.forEach(function (element, index) {
                element.update()
                if (element.status == 1) {
                    this.elementsToDelete.push(index)
                }
            }, this)

            if (this.elementsToDelete.length > 0) {
                this._deleteElements()
            }
        }
    },
    draw:function () {
        if (this.visible == true) {
            this.elements.forEach(function (element) {
                element.draw()
            }, this)
        }
    },
    _deleteElements:function () {
        this.elementsToDelete.reverse()
        this.elementsToDelete.forEach(this._deleteElement, this)
        this.elementsToDelete = []
    },
    _deleteElement:function (elementToDelete) {
        this.elements.splice(elementToDelete, 1)
    },

    /**
     * @description addElement to the layer
     * @method addElement
     * @param {obj} element to add to elements array
     */
    addElement:function (element) {
        this.elements.push(element)
        return this
    },

    /**
     * @description getElementByName
     * @method getElementByName
     * @param {string} elementname name of element to find in element array
     * @return {false/object} returns false or the searched object
     */
    getElementByName:function (elementname) {
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (this.elements[i].name == elementname) {
                return this.elements[i]
            }
        }
        return false
    },

    /**
     * @description getElementsByName
     * @method getElementsByName
     * @param {string} elementname name of element to find in element array
     * @return {array} returns a array of objects
     */
    getElementsByName:function (elementname) {
        elements = []
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (this.elements[i].name == elementname) {
                elements.push(this.elements[i])
            }
        }
        return elements
    }
})



