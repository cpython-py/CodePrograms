<script lang="ts">
export default {
  name: 'Person',
  setup() {
    let name = '张三';
    let age = 18;
    let tel = '13888888888';

    const changeName = () => {
      name = 'zhang-san'
    }
    const changeAge = () => {
      age++
    }
    const showTel = () => {
      alert(tel)
    }
    return { name, age, changeName, changeAge, showTel };
  },
}
</script>

<template>
  <div class="person">
    <h2>姓名: {{ name }}</h2>
    <h2>年龄: {{ age }}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">修改年龄</button>
    <button @click="showTel">展示联系方式</button>
  </div>
</template>

<style scoped>
.person {
  background-color: skyblue;
  box-shadow: 0 0 10px;
  border-radius: 10px;
  padding: 20px;
}

button {
  margin: 0 5px;
}
</style>