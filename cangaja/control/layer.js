/**
 * @description
 *
 * CG.Layer is a child of CG.Screen and a container to collect/group sprites, buttons, menus, emitters and animations
 *
 * @class CG.Layer
 * @extends CG.Class
 */
CG.Class.extend('Layer', {
    /**
     * Options:
     * name {string}
     *
     @example
     var l = new CG.Layer({
           name: 'layerback'
         })
     *
     * @constructor
     * @method init
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        CG._extend(this, {
            /**
             * @property name
             * @type {String}
             */
            name: '',
            /**
             * @property visible
             * @type {Boolean}
             */
            visible: true,
            /**
             * @property fixedPosition
             * @type {Boolean}
             */
            fixedPosition: false,
            /**
             * @property elements
             * @type {Array}
             */
            elements: [],
            /**
             * @property elementsToDelete
             * @type {Array}
             * @protected
             */
            elementsToDelete: []
        })

        if (options) {
            CG._extend(this, options)
        }

        return this
    },
    /**
     * @method update
     */
    update: function () {
        if (this.visible == true) {
//            this.elements.forEach(function (element, index) {
//                element.update()
//                if (element.status == 1) {
//                    this.elementsToDelete.push(index)
//                }
//            }, this)

            for (var i = 0, l = this.elements.length; i < l; i++) {
                this.elements[i].update()
                if (this.elements[i].status == 1) {
                    this.elementsToDelete.push(this.elements[i])
                }
            }

            if (this.elementsToDelete.length > 0) {
                this._deleteElements()
            }
        }
    },
    /**
     * @method draw
     */
    draw: function () {
        if (this.visible == true) {

            //TODO ? place for CanvasRenderer ?

//            this.elements.forEach(function (element) {
//                element.draw()
//            }, this)


            for (var i = 0, l = this.elements.length; i < l; i++) {
                this.elements[i].draw()
            }


        }
    },
    _deleteElements: function () {
        this.elementsToDelete.reverse()
        this.elementsToDelete.forEach(this._deleteElement, this)
        this.elementsToDelete = []
    },
    _deleteElement: function (elementToDelete) {
        this.elements.splice(elementToDelete, 1)
    },

    /**
     * @description Add new element to the layer. This could be a CG.Sprite, CG.Animation, CG.Button and so on. Every thing that has a update and draw method ;o)
     * @method addElement
     * @param {obj} element to add to elements array
     */
    addElement: function (element) {
        this.elements.push(element)
        return this
    },

    /**
     * @description Find element by name (the first one)
     * @method getElementByName
     * @param {string} elementname name of element to find in element array
     * @return {false/object} returns false or the searched object
     */
    getElementByName: function (elementname) {
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (this.elements[i].name == elementname) {
                return this.elements[i]
            }
        }
        return false
    },

    /**
     * @description Find elements by name (if they have the same name ;o)
     * @method getElementsByName
     * @param {string} elementname name of element to find in element array
     * @return {array} returns a array of objects
     */
    getElementsByName: function (elementname) {
        elements = []
        for (var i = 0, l = this.elements.length; i < l; i++) {
            if (this.elements[i].name == elementname) {
                elements.push(this.elements[i])
            }
        }
        return elements
    }
})



