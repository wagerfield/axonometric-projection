(function() {

    var previousTime = 0;
    var vendors = ['o', 'ms', 'moz', 'webkit'];

    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {

        window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];

    }

    if (!window.requestAnimationFrame) {

        window.requestAnimationFrame = function(callback, element) {

            var currentTime = new Date().getTime();
            var delay = Math.max(0, 16 - (currentTime - previousTime));
            var id = window.setTimeout(function() { callback(currentTime + delay); }, delay);

            previousTime = currentTime + delay;

            return id;

        };

    }

    if (!window.cancelAnimationFrame) {

        window.cancelAnimationFrame = function(id) {

            clearTimeout(id);

        };

    }

}());