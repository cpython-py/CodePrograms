// 入口函数
window.addEventListener('DOMContentLoaded', function () {
  // 业务1: tab栏切换
  // 1.1 给父级绑定点击事件,采取事件委托的形式控制tab栏
  const tabNav = document.querySelector('.tab-nav')
  const panes = document.querySelectorAll('.tab-pane')
  tabNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      // 1.2 切换 tab栏
      // 排他1
      //  - 找到之前有active类名的盒子,删除类名
      tabNav.querySelector('.active').classList.remove('active')
      //  - 给当前点击的添加类名
      e.target.classList.add('active')
      // 1.3 切换内容区域
      // 排他2 
      // 先去掉所有人的样式
      for (let i = 0; i < panes.length; i++) {
        panes[i].style.display = 'none'
      }
      // 在找到当前的添加样式
      const index = e.target.dataset.id
      panes[index].style.display = 'block'
    }
  })

  // 业务2: 输入账户密码登录,并跳转页面
  const form = document.querySelector('.xtx-login-main form')
  const check = document.querySelector('#my-checkbox')
  const uname = document.querySelector('[name="username"]')
  const pwd = document.querySelector('[name="password"]')
  // 2.1 给 form 绑定 提交事件 => 阻止默认行为
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    // 2.2 判断是否勾选了协议
    // console.log(check.checked)
    // 么有勾选,就提示勾选
    if (!check.checked) {
      return alert('请阅读协议并同意')
    }
    // 2.3 使用 html属性 required 做了输入框的必填

    // 2.4 如果以上都符合我需要.跳转页面,保存用户名
    if (uname.value === 'admin' && pwd.value === '123456') {
      localStorage.setItem('uname', uname.value)
      location.href = './index.html'
    } else {
      alert('账户或密码错误')
    }
  })
})