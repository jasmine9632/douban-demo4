# douban-demo4

生成节点
var Helper = {
    isToEnd: function($viewpoint, $content) {
        return $viewpoint.height() + $viewpoint.scrollTop() + 10 > $content.height()
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
                    </div>`
        var $node = $(template)
        $node.find('a').attr('href', movie.alt)
        $node.find(".cover img").attr("src", movie.images.medium)
        $node.find(".detail h2").text(movie.title)
        $node.find(".score").text(movie.rating.average)
        $node.find('.collect').text(movie.collect_count)
        $node.find(".year").text(movie.year)
        $node.find(".type").text(movie.genres.join(" / "))
        $node.find(".director").text(function() {
            var directorsArr = []
            movie.directors.forEach(function(item) {
                directorsArr.push(item.name);
            })
            return directorsArr.join("、 ")
        })
        $node.find(".actor").text(function() {
            var actorArr = []
            movie.casts.forEach(function(item) {
                actorArr.push(item.name)
            })
            return actorArr.join("、 ")
        })
        return $node
    }

}

绑定滚动更新事件
bind: function() {
        var _this = this
        var $viewEl = $('main')
            // viewHeight 是main的高度617，即窗口高度
        var viewHeight = $viewEl.height()
        console.log(viewHeight)
        $viewEl.scroll(function() {
            // listHeight是每次请求数据总高度,即20条数据的总高度。
            var listHeight = _this.$container.height()
            console.log(listHeight)
            console.log(listHeight - 10 < $viewEl.scrollTop() + viewHeight)
            if (listHeight - 10 < $viewEl.scrollTop() + viewHeight) {
                _this.start()
            }
        })
    },
