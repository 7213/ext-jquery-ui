var $ = require('jquery');

var _previousEJU = $.eju;
var eju = {
    version: '0.0.1',
    eju: true,
    noConflict: function() {
        return _previousEJU || this;
    }
};

$.eju = eju;

module.exports = eju;