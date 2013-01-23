var CG = CG || {
    VERSION:1
};


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik M??ller
// fixes from Paul Irish and Tino Zijdel

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *
 * Inspired by base2 and Prototype
 */
(function () {
    var initializing = false,
        fnTest = /xyz/.test(function () {
            var xyz;
        }) ? /\b_super\b/ : /.*/;
    /* The base Class implementation (does nothing) */
    CG.Class = function () {
    };

    // See if a object is a specific class
    CG.Class.prototype.isA = function (className) {
        return this.className === className;
    };

    /* Create a new Class that inherits from this class */
    CG.Class.extend = function (className, prop, classMethods) {
        /* No name, don't add onto Q */
        if (!typeof className === "string") {
            classMethods = prop;
            prop = className;
            className = null;
        }
        var _super = this.prototype,
            ThisClass = this;

        /* Instantiate a base class (but only create the instance, */
        /* don't run the init constructor) */
        initializing = true;
        var prototype = new ThisClass();
        initializing = false;

        function _superFactory(name, fn) {
            return function () {
                var tmp = this._super;

                /* Add a new ._super() method that is the same method */
                /* but on the super-class */
                this._super = _super[name];

                /* The method only need to be bound temporarily, so we */
                /* remove it when we're done executing */
                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
            };
        }

        /* Copy the properties over onto the new prototype */
        for (var name in prop) {
            /* Check if we're overwriting an existing function */
            prototype[name] = typeof prop[name] === "function" &&
                typeof _super[name] === "function" &&
                fnTest.test(prop[name]) ?
                _superFactory(name, prop[name]) :
                prop[name];
        }

        /* The dummy class constructor */
        function Class() {
            /* All construction is actually done in the init method */
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        /* Populate our constructed prototype object */
        Class.prototype = prototype;

        /* Enforce the constructor to be what we expect */
        Class.prototype.constructor = Class;
        /* And make this class extendable */
        Class.extend = CG.Class.extend;

        /* If there are class-level Methods, add them to the class */
        if (classMethods) {
            CG._extend(Class, classMethods);
        }

        if (className) {
            /* Save the class onto Q */
            CG[className] = Class;

            /* Let the class know its name */
            Class.prototype.className = className;
            Class.className = className;
        }

        return Class;
    };
}())


////Class example, how to start from scratch
//CG.Class.extend("Entity",{
//    init: function(){
//        this.myprop = 'set from constructor'
//    }
//});
//
//
////Class example, how to start from scratch
//CG.Entity.extend("Point",{
//    init: function(x, y){
//        this._super()
//        this.x = x
//        this.y = y
//    }
//});
//
//
////Class example, how to start from scratch
//CG.Point.extend("Rectangle",{
//    init: function(x, y, w, h){
//        this._super(x, y)
//        this.w = w
//        this.h = h
//    },
//    move: function(){
//
//    }
//});