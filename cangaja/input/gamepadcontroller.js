/**
 * @description
 *
 * CG.GamepadController extends class
 *
 ```

 stick = new CG.GamepadController()

 ```
 *
 * @class CG.GamepadController
 * @extends Class
 *
 */
CG.Class.extend('GamepadController', {
    /**
     * Options:
     * x {number}
     * y {number}
     *
     @example
     *
     * @constructor
     * @method init
     * @param options {object}
     * @return {*}
     */
    init: function (options) {
        this.instanceOf = 'GamepadController'

        // A number of typical buttons recognized by Gamepad API and mapped to
        // standard controls. Any extraneous buttons will have larger indexes.
        this.TYPICAL_BUTTON_COUNT = 16

        // A number of typical axes recognized by Gamepad API and mapped to
        // standard controls. Any extraneous buttons will have larger indexes.
        this.TYPICAL_AXIS_COUNT = 4

        // Whether we’re requestAnimationFrameing like it’s 1999.
        this.ticking = false

        // The canonical list of attached gamepads, without “holes” (always
        // starting at [0]) and unified between Firefox and Chrome.
        this.gamepads = []

        // Remembers the connected gamepads at the last check; used in Chrome
        // to figure out when gamepads get connected or disconnected, since no
        // events are fired.
        this.prevRawGamepadTypes = []

        // Previous timestamps for gamepad state; used in Chrome to not bother with
        // analyzing the polled data if nothing changed (timestamp is the same
        // as last time).
        this.prevTimestamps = []


        this.gamepadSupportAvailable = navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

        if (!this.gamepadSupportAvailable) {

            throw "No gamepad found or no Gamepad API support in your environment"

        } else {
            // Check and see if gamepadconnected/gamepaddisconnected is supported.
            // If so, listen for those events and don't start polling until a gamepad
            // has been connected.
            if ('ongamepadconnected' in window) {
                window.addEventListener('gamepadconnected',
                    this.onGamepadConnect, false);
                window.addEventListener('gamepaddisconnected',
                    this.onGamepadDisconnect, false);
            } else {
                // If connection events are not supported just start polling
                this.startPolling();
            }
        }

        if (options) {
            CG._extend(this, options)
        }

        return this
    },
    /**
     * React to the gamepad being connected.
     */
    onGamepadConnect: function (event) {
        // Add the new gamepad on the list of gamepads to look after.
        this.gamepads.push(event.gamepad);

        // Start the polling loop to monitor button changes.
        this.startPolling();
    },

    /**
     * React to the gamepad being disconnected.
     */
    onGamepadDisconnect: function (event) {
        // Remove the gamepad from the list of gamepads to monitor.
        for (var i in this.gamepads) {
            if (this.gamepads[i].index == event.gamepad.index) {
                this.gamepads.splice(i, 1);
                break;
            }
        }

        // If no gamepads are left, stop the polling loop.
        if (this.gamepads.length == 0) {
            this.stopPolling();
        }
    },

    /**
     * Starts a polling loop to check for gamepad state.
     */
    startPolling: function () {
        // Don’t accidentally start a second loop, man.
        if (!this.ticking) {
            this.ticking = true;
            this.tick();
        }
    },

    /**
     * Stops a polling loop by setting a flag which will prevent the next
     * requestAnimationFrame() from being scheduled.
     */
    stopPolling: function () {
        this.ticking = false;
    },

    /**
     * A function called with each requestAnimationFrame(). Polls the gamepad
     * status and schedules another poll.
     */
    tick: function () {
        this.pollStatus();
        this.scheduleNextTick();
    },

    scheduleNextTick: function () {
        // Only schedule the next frame if we haven’t decided to stop via
        // stopPolling() before.
        if (this.ticking) {
            requestAnimationFrame(this.tick.bind(this));
        }
    },

    /**
     * Checks for the gamepad status. Monitors the necessary data and notices
     * the differences from previous state (buttons for Chrome/Firefox,
     * new connects/disconnects for Chrome). If differences are noticed, asks
     * to update the display accordingly. Should run as close to 60 frames per
     * second as possible.
     */
    pollStatus: function () {
        // Poll to see if gamepads are connected or disconnected. Necessary
        // only on Chrome.
        this.pollGamepads();

        for (var i in this.gamepads) {
            var gamepad = this.gamepads[i];

            // Don’t do anything if the current timestamp is the same as previous
            // one, which means that the state of the gamepad hasn’t changed.
            // This is only supported by Chrome right now, so the first check
            // makes sure we’re not doing anything if the timestamps are empty
            // or undefined.
            if (gamepad.timestamp &&
                (gamepad.timestamp == this.prevTimestamps[i])) {
                continue;
            }
            this.prevTimestamps[i] = gamepad.timestamp;
        }
    },

    // This function is called only on Chrome, which does not yet support
    // connection/disconnection events, but requires you to monitor
    // an array for changes.
    pollGamepads: function () {
        // Get the array of gamepads – the first method (getGamepads)
        // is the most modern one and is supported by Firefox 28+ and
        // Chrome 35+. The second one (webkitGetGamepads) is a deprecated method
        // used by older Chrome builds.
        var rawGamepads =
            (navigator.getGamepads && navigator.getGamepads()) ||
            (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

        if (rawGamepads) {
            // We don’t want to use rawGamepads coming straight from the browser,
            // since it can have “holes” (e.g. if you plug two gamepads, and then
            // unplug the first one, the remaining one will be at index [1]).
            this.gamepads = [];

            // We only refresh the display when we detect some gamepads are new
            // or removed; we do it by comparing raw gamepad table entries to
            // “undefined.”
            var gamepadsChanged = false;

            for (var i = 0; i < rawGamepads.length; i++) {
                if (typeof rawGamepads[i] != this.prevRawGamepadTypes[i]) {
                    gamepadsChanged = true;
                    this.prevRawGamepadTypes[i] = typeof rawGamepads[i];
                }

                if (rawGamepads[i]) {
                    this.gamepads.push(rawGamepads[i]);
                }
            }
        }
    },
    draw: function () {

    },
    update: function () {

    }
})


