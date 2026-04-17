// 加载事件 => 入口函数
// DOMContentLoaded => 页面的html标签 加载完成后执行js
window.addEventListener('DOMContentLoaded', function () {
  // 业务1. 验证码发送业务 
  // 定义一个开关
  let flag = true
  // 1.1 获取按钮,绑定事件
  const codeBtn = document.querySelector('.code')
  codeBtn.addEventListener('click', function () {
    if (flag) {
      // flag = false
      flag = !flag
      let num = 5
      // 1.2 修改按钮内容 '05秒后重新获取'
      this.innerHTML = '05秒后重新获取'
      // 1.3 利用定时器修改页面倒计时效果
      let timerId = setInterval(function () {
        num--
        codeBtn.innerHTML = `0${num}秒后重新获取`
        if (num <= 0) {
          // 1.4 倒计时结束后,文字变成 重新获取
          clearInterval(timerId)
          codeBtn.innerHTML = `重新获取`
          // flag = true
          flag = !flag
        }
      }, 1000)
    }
  })

  // 业务2. 表单验证
  // 2.1 用户名验证
  const uname = document.querySelector('[name="username"]')
  // (1) 给input添加 change (改变事件)
  // 触发条件是 value值发生改变并且失去焦点才会触发
  uname.addEventListener('change', verifyName)
  // (2) 封装一个校验用户名的函数 
  function verifyName() {
    // (3) 根据正则验证表单是否符合要求
    const regName = /^[a-zA-Z0-9-_]{6,16}$/
    // console.log(11)
    const res = regName.test(uname.value)
    // (4) 根据正则返回结果,做相应处理
    if (res) {
      // - 如果  符合要求 return true
      uname.nextElementSibling.innerHTML = ''
      return true
    } else {
      // - 如果不符合要求 return false
      uname.nextElementSibling.innerHTML = '请输入6-16位用户名'
      return false
    }
  }
  // 2.2 手机号码验证
  const phoneDom = document.querySelector('[name="phone"]')
  // (1) 给手机号的input 绑定事件 change
  phoneDom.addEventListener('change', verifyPhone)
  // (2) 封装一个函数
  function verifyPhone() {
    // (3) 利用正则检验手机号
    const regPhone = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
    const res = regPhone.test(phoneDom.value)
    // (4) 根据正则返回的结果 函数返回相应内容
    if (res) {
      phoneDom.nextElementSibling.innerHTML = ''
      return true
    } else {
      phoneDom.nextElementSibling.innerHTML = '手机号格式错误'
      return false
    }
  }
  // 2.3 短信验证码验证  verifyCode
  const codeDom = document.querySelector('[name="code"]')
  codeDom.addEventListener('change', verifyCode)
  function verifyCode() {
    const regCode = /^\d{6}$/
    const res = regCode.test(codeDom.value)
    if (res) {
      codeDom.nextElementSibling.innerHTML = ''
      return true
    } else {
      codeDom.nextElementSibling.innerHTML = '验证码格式错误'
      return false
    }
  }
  // 2.4 密码验证
  const pwdDom = document.querySelector('[name="password"]')
  pwdDom.addEventListener('change', verifyPwd)
  function verifyPwd() {
    const regPwd = /^[a-zA-Z0-9-_]{6,20}$/
    const res = regPwd.test(pwdDom.value)
    if (res) {
      pwdDom.nextElementSibling.innerHTML = ''
      return true
    } else {
      pwdDom.nextElementSibling.innerHTML = '密码需要6-20位数字字母组合'
      return false
    }
  }
  // 2.5 确认密码 
  const confirmDom = document.querySelector('[name="confirm"]')
  confirmDom.addEventListener('change', verifyConfirm)
  function verifyConfirm() {
    const res = pwdDom.value === confirmDom.value
    console.log(res)
    if (res) {
      confirmDom.nextElementSibling.innerHTML = ''
      return true
    } else {
      confirmDom.nextElementSibling.innerHTML = '两次密码不一致'
      return false
    }
  }


  // 业务3. 阅读同意业务
  const iconDom = document.querySelector('.iconfont.icon-queren')
  // console.log(iconDom)
  // 3.1 获取按钮绑定点击事件
  iconDom.addEventListener('click', function () {
    // 3.2 点击后切换类名 
    this.classList.toggle('icon-queren2')
  })

  // 业务4. 下一步业务
  const form = document.querySelector('.xtx-form')
  // 4.1 给 form 绑定 提交事件 
  form.addEventListener('submit', function (e) {
    // 4.2 如果没有勾选同意协议就提示必须勾选, 并且阻止提交(阻止默认行为)
    const res = iconDom.classList.contains('icon-queren2')
    if (!res) {
      e.preventDefault()
      return alert('请阅读并同意协议')
    }
    // 4.3 依次判断上面的输入框是否正确
    /* 
      const res1 = verifyName()
      if (!res1) {
        e.preventDefault()
      }
    */
    if (!verifyName()) e.preventDefault()
    if (!verifyPhone()) e.preventDefault()
    if (!verifyCode()) e.preventDefault()
    if (!verifyPwd()) e.preventDefault()
    if (!verifyConfirm()) e.preventDefault()
  })
})