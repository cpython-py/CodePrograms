// 入口函数
window.addEventListener('DOMContentLoaded', function () {
  // 业务1: 回显用户名

  // 获取第一个和第二个li
  const lione = document.querySelector('.xtx_navs li:nth-child(1)')
  const litwo = document.querySelector('.xtx_navs li:nth-child(2)')
  // 1.1 根据本地存储是否有数据回显
  function render() {
    // 没每次渲染页面都去本地存储获取最新的数据
    const data = localStorage.getItem('uname')
    if (data) {
      // 有数据显示用户名
      lione.innerHTML = `
        <a href="javascript:;">
          <i class="iconfont icon-user">${data}</i>
        </a>`
      litwo.innerHTML = `<a href="javascript:;">退出登录</a>`
    } else {
      // 没数据就显示登录
      lione.innerHTML = `<a href="./login.html">请先登录</a>`
      litwo.innerHTML = `<a href="./register.html">免费注册</a>`
    }
  }
  render()
  // 业务2: 退出 功能
  litwo.addEventListener('click', function (e) {
    if (e.target.innerHTML === '退出登录') {
      // 删除本地存储
      localStorage.removeItem('uname')
      // 渲染页面
      render()
    }
  });



  // 3.检测 userAgent（浏览器信息）
  (function () {
    const userAgent = navigator.userAgent
    // 验证是否为Android或iPhone
    const android = userAgent.match(/(Android);?[\s\/]+([\d.]+)?/)
    const iphone = userAgent.match(/(iPhone\sOS)\s([\d_]+)/)
    // 如果是Android或iPhone，则跳转至移动站点
    if (android || iphone) {
      location.href = 'http://m.itcast.cn'
    }
  })()

})