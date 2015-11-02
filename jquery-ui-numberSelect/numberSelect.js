/**
 * @file 一个数量选择器jquery-ui插件
 * @require ./ui-number-select.less
 * @author songzheng
 */
require('jquery-ui');

var NumberSelect = $.widget('ui.numberSelect', {
    version: "@VERSION",
    options: {
        // 可选最大值
        max: 10,
        // 可选最小值
        min: 0,
        // 默认值
        defaultsVal: 0,
        // 增加速度
        speed: 200,
        // 自定义样式
        customClass: '',
        disable: false,
        // callbacks
        onAdd: null,
        onSubtract: null,
        change: null
    },
    _create: function() {
        var options = this.options;
        var numberSelectClasses = 'ui-number-select ui-widget ';
        var that = this;
        var numberSelect = ( this.numberSelect = $( "<div>" ) )
            .addClass( numberSelectClasses + options.customClass );

        var subtract = this.subtract = $( '<a draggable="false" href="javascript:void(0);" class="ui-number-select-subtract"></a>' );
        var input = this.input = $( '<input class="ui-number-select-input">') ;
        var add = this.add = $( '<a draggable="false" href="javascript:void(0);" class="ui-number-select-add"></a>' );
        numberSelect.append( subtract );
        numberSelect.append( input );
        numberSelect.append( add );

        this.element.append(numberSelect);

        this.val(options.defaultsVal);

        this._on(input,
            {'keyup': function(event) {
                var val = input.val() || 0;
                if (isNaN(val)) {
                    val = 0;
                }
                this.val(val);
            }
        });

        function _add() {
            if (!add.hasClass('ui-number-select-add-disable')) {
                var val = that.val();
                if (val < options.max) {
                    if ((val + 1) == options.max) {
                        add.addClass('ui-number-select-add-disable');
                    }
                    that.val(val + 1);
                    if (typeof options.onAdd === 'function') {
                        options.onAdd.call(that, val + 1);
                    }
                    if ((val + 1) > options.min) {
                        subtract.removeClass('ui-number-select-subtract-disable');
                    }
                }
            }
        }

        this._on(add,
            {
                'mousedown': function (event) {
                    that._clearTimer(); // 我们可能丢失了清除事件
                    that.addTimer = setInterval(function () {
                        _add();
                        add.data('__addTimer__', new Date);
                    }, options.speed);
                },
                'mouseup': function() {
                    if (that.addTimer) {
                        clearInterval(that.addTimer);
                        var lastTime = add.data('__addTimer__');
                        var timer = setTimeout(function() {
                            _add();
                            clearTimeout(timer);
                        }, options.speed - (new Date - lastTime));
                    }
                }
            }
        );

        function _subtract () {
            if (!add.hasClass('ui-number-select-subtract-disable')) {
                var val = that.val();
                if (val > options.min) {
                    if ((val - 1) == options.min) {
                        subtract.addClass('ui-number-select-subtract-disable');
                    }
                    that.val(val - 1);
                    if (typeof options.onSubtract === 'function') {
                        options.onSubtract.call(that, val + 1);
                    }
                    if ((val - 1) < options.max) {
                        add.removeClass('ui-number-select-add-disable');
                    }
                }
            }
        }

        this._on(subtract,
            {
                'mousedown': function (event) {
                    that._clearTimer(); // 我们可能丢失了清除事件
                    that.subtractTimer = setInterval(function () {
                        _subtract();
                        add.data('__subtractTimer__', new Date);
                    }, options.speed || 200);
                },
                'mouseup': function() {
                    if (that.subtractTimer) {
                        clearInterval(that.subtractTimer);
                        var lastTime = add.data('__subtractTimer__');
                        var timer1 = setTimeout(function () {
                            _subtract();
                            clearTimeout(timer1);
                        }, (options.speed || 200) - (new Date - lastTime)); // 保持同速率增加;
                    }
                }
            }
        );

        $(document).on('mouseup', function() {
            that._clearTimer();
        })
    },
    /**
     * 获取、设置当前数量
     */
    val: function() {
        var options = this.options;
        var max = options.max;
        var min = options.min;
        var val = 0;
        var input = this.numberSelect.find('.ui-number-select-input');
        if (typeof arguments[0] === 'undefined') {
            val = input.val() || 0;
            return parseInt(val, 10);
        } else {
            val = parseInt(arguments[0], 10);
            this.subtract.removeClass('ui-number-select-subtract-disable');
            this.add.removeClass('ui-number-select-add-disable');
            if (val >= max) {
                val = max;
                this.add.addClass('ui-number-select-add-disable');
            }
            if (val <= min) {
                val = min;
                this.subtract.addClass('ui-number-select-subtract-disable');
            }
            input.val(val);
            options.change.call(this, val);
        }
    },
    _setOptions: function() {
        this._superApply( arguments );
        this.val(this.input.val());
    },
    widget: function() {
        return this.numberSelect;
    },
    _clearTimer: function() {
        if (this.addTimer) {
            clearInterval(this.addTimer);
        }
        if (this.subtractTimer) {
            clearInterval(this.subtractTimer);
        }
    },
    _destroy: function() {
        this._superApply( arguments );
        this._clearTimer();
    }

});

module.exports = NumberSelect;

