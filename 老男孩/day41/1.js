var obj = new Object();
console.log(obj, typeof (obj));
obj.age = 18;
obj.name = "孙坚";
obj.weight = "200斤";
obj.eat = function () {
    console.log("我会吃饭");
}
console.log(obj.name);
obj.eat();

var obj2 = {
    "name": "张三",
    "age": 20,
    sex: "男性",
    drink: function (something) {
        console.log("我会喝水",something);       
    }
}
console.log(obj2.sex);
obj2.drink("我会喝酒");

res = eval("console.log(333)");

function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
    this.func = function () {
        console.log("我是func");
        return this.name;
    }
}
var obj1 = new Person("李四", 22, "美女");
console.log(obj1.name);
var res = obj1.func();
console.log(res);

for (var $ in obj1) {
    console.log($);
}
with (obj1) {
    console.log(name);
}

var data = {
    'name': "王五",
    "age": 20,
    "sleep": function () {
        console.log("我会睡觉");
    }
}
var res = JSON.stringify(data);
console.log(res, typeof (res));
var res2 = JSON.parse(res);
console.log(res2, typeof (res2));