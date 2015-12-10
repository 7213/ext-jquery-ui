/**
 * 上、下拉刷新组件
 * @author songzheng
 *
 * @require ./pullRefresh.less
 */
require('jquery-ui');
// 上拉
var DIR_UP = 1;
// 下拉
var DIR_DOWN = -1;

var PullRefresh = $.widget('ui.numberSelect', {
    version: "@VERSION",
    options: {
        // 当前页
        currentPage: 0,
        // 加载数量
        pageSize: options.pageSize || 5,
        dir: DIR_UP,
        $element: $(element),
        options: options,
        // 是否正在拖拽
        pulling: false,
        // 第一次加载数据
        first: true
    },
    _create: function () {
        $(document).on('touchmove.nm.pullRefresh', function (e) {
            e.preventDefault();
        });
        this.tmpl = this.options.tmpl || this.$element.find('script[type="text/pullRefresh"]').text();
        this.$element.empty().addClass('wrapper-nm-pullRefresh');
        this.$element.append(__inline('./pullRefresh.vm'));
        this.$pullDown = this.$element.find('.pull-down');
        this.tipHeight = this.$pullDown.outerHeight();
        this.$content = this.$element.find('.content');
        var iScroll = this.iScroll = new IScroll(this.$element[0], this.options.iScroll || {startY: -1 * this.tipHeight});
        this.listenPull(iScroll);
        this.pullDown(iScroll);
    },
    setOptions: function (options) {
        options = options || {};
        this.options = options;
        this.first = true;
        this.tmpl = options.tmpl || this.tmpl;
        this.$element.find('.pull-down, .pull-up').hide();
        var iScroll = this.iScroll;
        iScroll.scrollTo(0, -1 * this.tipHeight, 200, IScroll.utils.back);
        this.pullDown(iScroll);
    },
    listenPull: function (iScroll) {
        var that = this;
        iScroll.on('scrollStart', function () {
            that.pulling = true;
        });

        iScroll.on('scrollEnd', function () {
            function fold(top) {
                if (top) {
                    if (!this.isAnimating) {
                        iScroll.scrollTo(0, -1 * that.tipHeight, 200, IScroll.utils.back);
                    }
                } else {
                    if (!this.isAnimating) {
                        iScroll.scrollTo(0, this.maxScrollY + that.tipHeight, 200, IScroll.utils.back);
                    }
                }
            }

            if (that.pulling) {
                var dir = this.directionY;
                // 向下拉动手势
                if (dir < 0) {
                    if (this.y == 0) {
                        if (!this.isAnimating) {
                            that.toggle(dir);
                            that.pullDown(iScroll).then(function () {
                                fold.call(this, true);
                                setTimeout(function () {
                                    that.toggle(dir);
                                }, 200);
                            });
                        }
                    } else if (Math.abs(this.y) < that.tipHeight) {
                        fold.call(this, true);
                    }
                }
                // 向上拉动手势
                if (dir > 0) {
                    if (this.maxScrollY === this.y) {
                        if (!this.isAnimating) {
                            that.toggle(dir);
                            that.pullUp(iScroll).then(function () {
                                setTimeout(function () {
                                    that.toggle(dir);
                                }, 200);
                            });
                        }
                    } else if (this.y - that.tipHeight < this.maxScrollY) {
                        fold.call(this, false);
                    }
                }
                that.pulling = false;
            }
        });
    },
    toggle: function (dir) {
        if (dir < 0) {
            this.$element.find('.pull-down').children().toggle();
        }
        if (dir > 0) {
            this.$element.find('.pull-up').children().toggle();
        }
        this.$element.trigger('loading.nm.pullRefresh');
    },
    pullDown: function(iScroll) {
        var that = this;
        var ajaxOptions = this.options.ajax;
        var parseFn = this.options.parse || function(data) {return data};
        ajaxOptions.data = ajaxOptions.data || {};
        $.extend(ajaxOptions.data, {pageSize: that.pageSize, currentPage: 0});
        return $.ajax(ajaxOptions).done(function(resp) {
            that.$content.html('');
            if ($.isFunction(that.options.header)) {
                that.$content.append(that.options.header(resp));
            }
            resp = parseFn(resp);
            that.$content.append(that._genHtml(resp));
            iScroll.refresh();
            that.$element.trigger('pullDown.nm.pullRefresh');

            if (that.first) {
                if ($(iScroll.wrapper).outerHeight() < ($(iScroll.scroller).outerHeight()-2*that.tipHeight)) {
                    that.$element.find('.pull-down, .pull-up').show();
                }
                that.first = false;
            }
        });
    },
    pullUp: function(iScroll) {
        var that = this;
        var ajaxOptions = this.options.ajax;
        var parseFn = this.options.parse || function(data) {return data};
        ajaxOptions.data = ajaxOptions.data || {};
        $.extend(ajaxOptions.data, {pageSize: that.pageSize, currentPage: that.currentPage+1});
        return $.ajax(ajaxOptions).done(function(resp) {
            var resp = parseFn(resp);
            that.currentPage++;

            that.$content.append(that._genHtml(resp));
            iScroll.refresh();
            that.$element.trigger('pullUp.nm.pullRefresh');
        });
    },
    _genHtml:function(data) {
        var html = '';
        var compiled = _.template(this.tmpl);
        if ($.isArray(data)) {
            $.each(data, function(index, item) {
                html += '<li>' + compiled({item: item})  + '</li>';
            });
        }
        return html;
    },
    destroy: function() {
        $(document).off('nm.pullRefresh');
    }
});