var $ = require('jquery');

var _previousEju = $.eju;

var eju = {
    version: '0.0.1',
    eju: true,
    noConflict: function() {
        return _previousEju || this
    }
};

$.eju = eju;
module.exports = eju;