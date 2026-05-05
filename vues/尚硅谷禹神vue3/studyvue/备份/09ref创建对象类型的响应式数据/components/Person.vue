<script lang="ts">
export default {
  name: 'Person'
}
</script>

<script lang="ts" setup>
import {ref} from 'vue'

let car = ref({brand: '奔驰', price: 100})
let games = ref([
  {id: '000001', name: '王者荣耀'},
  {id: '000002', name: '原神'},
  {id: '000003', name: '三国志'},
])
const changePrice = () => {
  car.value.price += 10
}
const changeFirstGame = () => {
  games.value[0].name = '我的世界'
}
</script>

<template>
  <div class="person">
    <h2>汽车信息:一辆{{ car.brand }}车, 价值{{ car.price }}万</h2>
    <button @click="changePrice">修改汽车的价格</button>
    <br>
    <h2>游戏列表: </h2>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
    <button @click="changeFirstGame">修改第一个游戏名字</button>
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

li {
  font-size: 20px;
}
</style>
