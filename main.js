
// jQuery 实现 tab 功能
$('footer div').click(function(){
  var index = $(this).index()
  $('section').eq(index).show().siblings().hide()
  $(this).addClass('active').siblings().removeClass('active')
})


var index = 0  // 初始请求位置
start()  // ajax 获取数据

// start 获取数据函数
function start(){
  $.ajax({
    url: 'http://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
      start: index,
      count: 20    // 每次请求的数目
    },
    dataType: 'jsonp'
  }).done(function(ret){
    console.log(ret)
    setData(ret)  // 获取到数据之后 传入setData
    index += 20   // 在请求成功之后，将请求位置 +20, 便于下次紧接该位置请求数据
  }).fail(function(){
    console.log('error...')
  })
}


$('main').scroll(function(){
  if($('section').eq(0).height() == $('main').scrollTop() + $('main').height()){
    start()
  }
})


// 拼装 DOM
function setData(data){
  data.subjects.forEach(function(movie){
    var tpl = `<div class="item">
                <a href="">
                  <div class="cover">
                    <img src="1.jpg" alt="">
                  </div>
                  <div class="detail">
                    <h2>电影名</h2>
                    <div class="extra"><span class="score">9.0</span>分 / <span class="collect">1000</span>收藏</div>
                    <div class="extra"><span class="year">1994</span> / <span class="type">剧情</span></div>
                    <div class="extra">导演：<span class="director"></span></div>
                    <div class="extra">主演：<span class="actor"></span></div>
                  </div>
                </a>
              </div>`
    var $node = $(tpl)
    $node.find('.cover img').attr('src', movie.images.medium)  // movie.xxx 为后端接口数据
    $node.find('.detail h2').text(movie.title)
    $node.find('.score').text(movie.rating.average)
    $node.find('.collect').text(movie.collect_count)
    $node.find('.year').text(movie.year)
    $node.find('.type').text(movie.genres.join(' / '))
    $node.find('.director').text(function(){
      var directorsArr = []
      movie.directors.forEach(function(item){
        directorsArr.push(item.name)
      })
      return directorsArr.join('、')
    })
    $node.find('.actor').text(function(){
      var actorsArr = []
      movie.casts.forEach(function(item){
        actorsArr.push(item.name)
      })
      return actorsArr.join('、')
    })
    $('section').eq(0).append($node)    // 往 tab 第一栏中的 section 拼装 DOM
  })
}
