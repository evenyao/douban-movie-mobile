// jQuery 实现 tab 功能
$('footer div').click(function(){
  var index = $(this).index()
  $('section').hide().eq(index).fadeIn()
  $(this).addClass('active').siblings().removeClass('active')
})


// ***** top250页面功能 *****
var index = 0  // 初始请求位置
var isLoading = false  //数据状态

startTop250()  // ajax 获取数据

// startTop250 获取 top250页面数据 函数
function startTop250(){
  if(isLoading) return
  isLoading = true
  $('.loading').show()   //显现 loading 图标
  $.ajax({
    url: 'https://api.douban.com/v2/movie/top250',
    type: 'GET',
    data: {
      start: index,
      count: 20    // 每次请求的数目
    },
    dataType: 'jsonp'
  }).done(function(ret){
    console.log(ret)
    setDataTop250(ret)  // 获取到数据之后 传入setDataTop250 拼装 Top250页面 DOM
    index += 20   // 在请求成功之后，将请求位置 +20, 便于下次紧接该位置请求数据
  }).fail(function(){
    console.log('error...')
  }).always(function(){
    isLoading = false
    $('.loading').hide()  // 加载完毕后隐藏 loading 图标
  })
}

// 使用函数节流优化 ajax 请求
var clock   //定义一个定时器  clock
$('#top250').scroll(function(){
  if(clock){
    clearTimeout(clock)
  }
  clock = setTimeout(function(){
    //判断到到底部的时候 才去 ajax 请求数据
    if($('#top250 .container').height() - 10 <= $('#top250').scrollTop() + $('#top250').height()){
      console.log('到底部，继续请求数据')
      startTop250()
    }
  },500)
})

// 拼装 DOM
function setDataTop250(data){
  data.subjects.forEach(function(movie){
    var tpl = `<div class="item">
                <a class="link" href="#">
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
    // $node.find('.link').attr('href',movie.alt)
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
    $('#top250').find('.container').append($node)    // 往 tab 第一栏中的 section的 top250下 拼装 DOM
  })
}


startUs()
// ***** us页面功能 *****
// 基本复用 top250 的函数 只是数据接口不一样 仅获取一次数据
// startUs 获取 us页面数据 函数
function startUs(){
  $('.loading').show()   //显现 loading 图标
  $.ajax({
    url: 'https://api.douban.com/v2/movie/us_box',
    type: 'GET',
    dataType: 'jsonp'
  }).done(function(ret){
    console.log(ret)
    setDataUs(ret)  // 获取到数据之后 传入setDataUs
  }).fail(function(){
    console.log('error...')
  }).always(function(){
    $('.loading').hide()  // 加载完毕后隐藏 loading 图标
  })
}

// 拼装 第二页DOM
function setDataUs(data){
  data.subjects.forEach(function(movie){
    movie = movie.subject
    var tpl = `<div class="item">
                <a class="link" href="#">
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
    $node.find('.link').attr('href',movie.alt)
    $node.find('.cover img').attr('src', movie.images.medium)
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
    $('#us').find('.container').append($node)    // 往 tab 第二栏中的 section的 us 拼装 DOM
  })
}



// ***** search页面功能 *****
//定义 搜索button 点击事件
$('.button').click(function(){
  keyword = $('input').val()
  startSearch()
})

// 也是仅获取一次数据 ajax 获取数据多了一个 keyword
function startSearch(){
  $('.loading').show()
  $.ajax({
    url: 'https://api.douban.com/v2/movie/search',
    type: 'GET',
    data: {
      q: keyword
    },
    dataType: 'jsonp'
  }).done(function(ret){
    console.log(ret)
    setDataSearch(ret)  // 获取到数据之后 传入setDataSearch
  }).fail(function(){
    console.log('error...')
  }).always(function(){
    $('.loading').hide()  // 加载完毕后隐藏 loading 图标
  })
}

// 拼装 第三页 search-result 的 DOM
function setDataSearch(data){
  $('#search .search-result').empty()  //先清除之前搜索过的结果 清除DOM
  //然后再重新遍历
  data.subjects.forEach(function(movie){
    var tpl = `<div class="item">
                <a class="link" href="#">
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
    $node.find('.link').attr('href',movie.alt)
    $node.find('.cover img').attr('src', movie.images.medium)
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
    $('#search .search-result').append($node)    // 再往 tab 第三栏 search-result 中拼装 DOM
  })
}
