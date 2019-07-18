var Helper = {
    isToEnd: function($viewpoint, $content) {
        return $viewpoint.height() + $viewpoint.scrollTop() + 10 > $content.height();
    },
    createNode: function(movie) {
        var template = `<div class="item">
                    <a href="#">
                    <div class="cover">
                    <img src="" alt="">
                    </div>
                    <div class="detail">
                    <h2></h2>
                    <div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>
                    <div class="extra"><span class="year"></span> / <span class="type"></span></div>
                    <div class="extra">导演：<span class="director"></span></div>
                    <div class="extra">主演：<span class="actor"></span></div>
                    </div>
                    </a>
                    </div>`;
        var $node = $(template);
        $node.find('a').attr('href', movie.alt);
        $node.find('.cover img').attr('src', movie.images.medium);
        $node.find('.detail h2').text(movie.title);
        $node.find('.score').text(movie.rating.average);
        $node.find('.collect').text(movie.collect_count);
        $node.find('.year').text(movie.year);
        $node.find('.type').text(movie.genres.join(' / '));
        $node.find('.director').text(function() {
            var directorsArr = [];
            movie.directors.forEach(function(item) {
                directorsArr.push(item.name);
            });
            return directorsArr.join('、 ');
        });
        $node.find('.actor').text(function() {
            var actorArr = [];
            movie.casts.forEach(function(item) {
                actorArr.push(item.name);
            });
            return actorArr.join('、 ');
        });
        return $node;
    }

};

var Top250Page = {
    init: function() {
        this.$container = $('#top250');
        this.$content = this.$container.find('.container');
        this.index = 0;
        this.isFinish = false;
        this.isLoading = false;

        this.bind();
        this.start();
    },
    bind: function() {
        var _this = this;
        var $viewEl = $('main');
        // viewHeight 是main的高度617，即窗口高度
        var viewHeight = $viewEl.height();
        console.log(viewHeight);
        $viewEl.scroll(function() {
            // listHeight是每次请求数据总高度,即20条数据的总高度。
            var listHeight = _this.$container.height();
            console.log(listHeight);
            console.log(listHeight - 10 < $viewEl.scrollTop() + viewHeight);
            if (listHeight - 10 < $viewEl.scrollTop() + viewHeight) {
                _this.start();
            }
        });
        _this.onMovieClick()
    },
    onMovieClick: function() {
        this.$content.on('click', '.item', function(e) {
            console.log(e.target)
            var id = $(this).data('id')
            console.log(id)
        })
    },
    ajax: function(callback) {
        var _this = this;
        setTimeout(function() {
            var ret = mockData.data;
            _this.index += 20;
            if (_this.index >= ret.total) {
                _this.isFinish = true;
            }
            // 渲染数据
            callback && callback(ret);
            _this.isLoading = false;
            _this.$container.find('.loading').hide();
        }, 20);
    },
    start: function() {
        var _this = this;
        this.getData(function(data) {
            _this.render(data);
        });
    },
    getData: function(callback) {
        var _this = this;
        if (_this.isLoading) return;
        _this.isLoading = true;
        _this.$container.find('.loading').show();
        _this.ajax(callback);
    },
    getData2: function(callback) {
        var _this = this;
        if (_this.isLoading) return;
        _this.isLoading = true;
        _this.$container.find('.loading').show();
        $.ajax({
            url: 'http://api.douban.com/v2/movie/top250',
            data: {
                start: _this.index || 0
            },
            dataType: 'jsonp'
        }).done(function(ret) {
            console.log(ret);
            _this.index += 20;
            if (_this.index >= ret.total) {
                _this.isFinish = true;
            }
            // 渲染数据
            callback && callback(ret);
        }).fail(function() {
            console.log('数据异常');
        }).always(function() {
            _this.isLoading = false;
            _this.$container.find('.loading').hide();
        });
    },
    render: function(data) {
        var _this = this;
        // data.subjects.forEach(function(movie) {
        //   _this.$content.append(Helper.createNode(movie));
        // }
        // not good
        // data.list.forEach(function (movie) {
        //   _this.$content.append(_this.view(movie))
        // });
        // better
        var html = data.list.map(function(movie) {
            return _this.view(movie)
        }).join('')
        _this.$content.append(html)
    },
    view: function(data) {
        var html = '';
        var vipText = (data.vip ? 'Vip' : '')
        html += '<div class="item" data-id="' + data.id + '">' +
            '<a href="#">' +
            '<div class="cover">' +
            '<img src="' + data.picture + '" alt="">' +
            '</div>' +
            '<div class="detail">' +
            '<h2>' + data.name + (vipText && '<strong>' + vipText + '</strong>') + '</h2>' +
            '<div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>' +
            '<div class="extra"><span class="year"></span> / <span class="type"></span></div>' +
            '<div class="extra">导演：' + data.author + '<span class="director"></span></div>' +
            '<div class="extra">主演：<span class="actor"></span></div>' +
            '</div>' +
            '</a>' +
            '</div>'

        return html
    }
};


var UsBoxPage = {
    init: function() {
        this.$container = $('#beimei');
        this.$content = this.$container.find('.container');
        this.start();
    },
    ajax: function(callback) {
        var _this = this;
        setTimeout(function() {
            var ret = mockData.data;
            _this.index += 20;
            if (_this.index >= ret.total) {
                _this.isFinish = true;
            }
            // 渲染数据
            callback && callback(ret);
            _this.isLoading = false;
            _this.$container.find('.loading').hide();
        }, 20);
    },
    start: function() {
        var _this = this;
        this.getData(function(data) {
            _this.render(data);
        });
    },
    getData: function(callback) {
        var _this = this;
        if (_this.isLoading) return;
        _this.isLoading = true;
        _this.$container.find('.loading').show();
        _this.ajax(callback);
    },

    getData2: function(callback) {
        var _this = this;
        _this.$container.find('.loading').show();
        $.ajax({
            url: 'http://api.douban.com/v2/movie/us_box',
            dataType: 'jsonp'
        }).done(function(ret) {
            callback && callback(ret);

        }).fail(function() {
            console.log('数据异常');
        }).always(function() {
            _this.$container.find('.loading').hide();
        });
    },
    render: function(data) {
        var _this = this;
        var html = data.list.map(function(movie) {
            return _this.view(movie)
        }).join('')
        _this.$content.append(html)
    },
    view: function(data) {
        var html = '';
        var vipText = (data.vip ? 'Vip' : '')
        html += '<div class="item" data-id="' + data.id + '">' +
            '<a href="#">' +
            '<div class="cover">' +
            '<img src="' + data.picture + '" alt="">' +
            '</div>' +
            '<div class="detail">' +
            '<h2>' + data.name + (vipText && '<strong>' + vipText + '</strong>') + '</h2>' +
            '<div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>' +
            '<div class="extra"><span class="year"></span> / <span class="type"></span></div>' +
            '<div class="extra">导演：' + data.author + '<span class="director"></span></div>' +
            '<div class="extra">主演：<span class="actor"></span></div>' +
            '</div>' +
            '</a>' +
            '</div>'

        return html
    }
};
//     render: function(data) {
//         var _this = this;
//         data.subjects.forEach(function(item) {
//             _this.$content.append(Helper.createNode(item.subject));
//         });
//     }
// };

var SearchPage = {
    init: function() {
        this.$container = $('#search');
        this.$input = this.$container.find('input');
        this.$btn = this.$container.find('.button');
        this.$content = this.$container.find('.search-result');
        this.bind();

    },
    bind: function() {
        var _this = this;
        this.$btn.click(function() {
            _this.getData(_this.$input.val(), function(data) {
                console.log(data);
                _this.render(data);
            });
        });
    },
    ajax: function(callback) {
        var _this = this;
        setTimeout(function() {
            var ret = mockData.data;
            _this.index += 20;
            if (_this.index >= ret.total) {
                _this.isFinish = true;
            }
            // 渲染数据
            callback && callback(ret);
            _this.isLoading = false;
            _this.$container.find('.loading').hide();
        }, 20);
    },
    start: function() {
        var _this = this;
        this.getData(function(data) {
            _this.render(data);
        });
    },
    getData: function(callback) {
        var _this = this;
        if (_this.isLoading) return;
        _this.isLoading = true;
        _this.$container.find('.loading').show();
        _this.ajax(callback);
    },

    render: function(data) {
        var _this = this;
        var html = data.list.map(function(movie) {
            return _this.view(movie)
        }).join('')
        _this.$content.append(html)
    },
    view: function(data) {
        var html = '';
        var vipText = (data.vip ? 'Vip' : '')
        html += '<div class="item" data-id="' + data.id + '">' +
            '<a href="#">' +
            '<div class="cover">' +
            '<img src="' + data.picture + '" alt="">' +
            '</div>' +
            '<div class="detail">' +
            '<h2>' + data.name + (vipText && '<strong>' + vipText + '</strong>') + '</h2>' +
            '<div class="extra"><span class="score"></span>分 / <span class="collect"></span>收藏</div>' +
            '<div class="extra"><span class="year"></span> / <span class="type"></span></div>' +
            '<div class="extra">导演：' + data.author + '<span class="director"></span></div>' +
            '<div class="extra">主演：<span class="actor"></span></div>' +
            '</div>' +
            '</a>' +
            '</div>'

        return html
    }
};


// getData2: function(keyword, callback) {
//     var _this = this;
//     _this.$container.find('.loading').show;
//     $.ajax({
//         url: 'http://api.douban.com/v2/movie/search',
//         data: {
//             q: keyword
//         },
//         dataType: 'jsonp'
//     }).done(function(ret) {
//         callback && callback(ret);
//     }).fail(function() {
//         console.log('数据异常');
//     }).always(function() {
//         _this.$container.find('.loading').hide();
//     });
// },

//     render: function(data) {
//         var _this = this;
//         data.subjects.forEach(function(item) {
//             _this.$content.append(Helper.createNode(item));
//         });
//     }
// };

var App = {
    init: function() {
        this.bind();
        Top250Page.init();
        UsBoxPage.init();
        SearchPage.init();

    },
    bind: function() {
        $('footer>div').click(function() {
            $(this).addClass('active')
                .siblings()
                .removeClass('active');
            $currentPage = $('main>section')
                .hide().eq($(this).index())
                .fadeIn();

        });
        window.ontouchmove = function(e) {
            e.preventDefault();
        };
        $('section').each(function() {
            this.ontouchmove = function(e) {
                e.stopPropagation();
            };
        });
    }
};
App.init();