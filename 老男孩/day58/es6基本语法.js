function add(x) {
    return x;
}

console.log(add(5));

let add_a = function (x) { return x; }
console.log(add_a(50));

let add_b = (x) => { return x; }
console.log(add_b(20));

let add_c = x => x;
console.log(add_c((200)));

var person1 = {
    name: 'tiger',
    age: 18,
    f1 : function() {console.log(this);console.log(this.name);}
}

