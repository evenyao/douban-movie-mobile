# douban-movie-mobile
移动端豆瓣电影轻页面
## 预览链接
- 预览地址：https://evenyao.github.io/douban-movie-mobile/
- 扫描二维码

![](	https://evenyao-1257191344.cos.ap-chengdu.myqcloud.com/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E4%BD%9C%E5%93%81%E4%BA%8C%E7%BB%B4%E7%A0%81.png)


## 简要介绍
- 主要由 `top250榜单`、`北美最新电影`、`搜索` 三个`tab`页面构成

## 关于版本
### 2018.8.24
v0.1: 完成 `tab` 功能、完成 `top250榜单` 分页功能

### 2018.8.25
v0.2: 使用函数节流优化 `top250榜单` ajax请求，并对 `北美最新电影` 页进行复用

### 2018.8.26
v1.0: 优化代码，完成 `搜索` 页功能

## 关于项目中的要点

### 样式与布局
- 相对单位 vw 的使用
- `iconFont` 的使用
- `@keyframes` 关键帧的使用
- Flex 布局
- JavaScript `fadeIn()` 渐入效果的使用

### 页面相关与功能实现
#### jQuery 实现 tab 功能
```JavaScript
$('footer div').click(function(){
  var index = $(this).index()
  $('section').hide().eq(index).fadeIn()
  $(this).addClass('active').siblings().removeClass('active')
})
```

#### 页面区别
主要在 `ajax` 请求的接口地址不同
- `top250` 页面 请求类似于懒加载，到达底部需要重复请求
- `北美最新电影` 页面 只请求一次，且该后端接口数据嵌套了另一层所以在进行 页面DOM 拼接的时候，需要使用 `movie = movie.subject` 找到 `北美最新电影` 数据所在的位置
- `search` 页面 数据接口和 `top250` 类似，`data`中多了一个 `keyword`，请求次数和 `北美最新电影` 页面一样，只请求一次

```JavaScript
//top250 页面请求函数
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

//北美最新电影 页面请求函数
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
```

#### DOM 拼接
`top250`与`北美最新电影`页面拼接DOM和 `search`页面一致，唯一的不同在于`search`页面在每次重新拼装DOM之前使用`$('#search .search-result').empty()`先清空当前`$('#search .search-result')`下的所有结果，即清空上一次的搜索结果。
```JavaScript
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
```
