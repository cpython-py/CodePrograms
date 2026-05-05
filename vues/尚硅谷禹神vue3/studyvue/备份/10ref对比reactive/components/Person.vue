<script lang="ts">
export default {
  name: 'Person'
}
</script>

<script lang="ts" setup>
import {ref} from 'vue'

let car = ref({brand: '奔驰', price: 100})
let sum = ref(0)

const changePrice = () => {
  car.value.price += 10
}
const changeBrand = () => {
  car.value.brand = '宝马'
}
const changeCar = () => {
  car.value = {brand: '法拉利', price: 2000}
}
const changeSum = () => {
  sum.value += 1
}
</script>

<template>
  <div class="person">
    <h2>汽车信息:一辆{{ car.brand }}车, 价值{{ car.price }}万</h2>
    <button @click="changeBrand">修改汽车的品牌</button>
    <button @click="changePrice">修改汽车的价格</button>
    <button @click="changeCar">修改汽车</button>
    <hr>
    <h2>当前求和为: {{ sum }}</h2>
    <button @click="changeSum">点我sum加1</button>
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
