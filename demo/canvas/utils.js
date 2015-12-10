if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.oRequestAnimationFrame ||
                                    window.msRequestAnimationFrame ||
                                    function(callback) {
                                        setTimeout(callback, 1000/60);
                                    })
}


var utils = {};

utils.captureMouse = function(element) {
    var mouse = {x: 0, y: 0};
    element.addEventListener('mousemove', function(event) {
        var x, y;
        if (event.pageX) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= element.offsetLeft;
        y -= element.offsetTop;
    }, false);

    return mouse;

};


module.exports = utils;