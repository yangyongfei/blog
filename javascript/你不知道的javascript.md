
/**
 *      堆栈
 */
应用内存

堆内存


/**
 *      原型链 
 */

当一个对象调用的方式/属性不存在时 ，就回去[__proto__]关联的前辈prototype对象上去找，
如果还找不到，就去找[__proto__]关联的前辈prototype对象的[__proto__]关联的前辈prototype对象上去找，

let a = {}
a.constructor.prototype = a.__proto__


 继承
 构造继承， 原型继承， 实例继承， 拷贝继承， 组合继承， 寄生组合继承
 什么是构造继承


## call、apply 和 bind 是挂在 Function 对象上的三个方法，调用这三个方法的必须是一个函数。

fn.call(thisArg, arg1, arg2, ...)
let a = {
    value: 1
}
function getValue(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}
getValue.call(a, 'poe', '24')
getValue.apply(a, ['poe', '24'])


Function.prototype.call = function(context) {
   var context = context || window
   context.fn = this

   var args = [...arguments].slice(1)
   va result = context.fn(...args)
   delete context.fn
   return result
}

Function.prototype.apply = function(context, ...args) {
   let key = Symbol('key')
   context[key] = this

   let result = context[key](...args)
   delete context[key]
   return result
}

Function.prototype.bind = function(context) {

   var self = this
   var args = [...arguments].slice(1)
   return function F() {
      // 应为返沪了一个函数， 我们可以new F()
      if(this instanceof F){
        return new self(...args, ...arguments)
      }
       return self.apply(context, [...args, ...arguments])
   }
}



## 类型检测


 --typeof 对于原始类型 除了null都会返回正确的类型

typeof null === 'object'
typeof 1 === 'number'
typeof '1' === 'string'
typeof true === 'boolean'
tyeof function(){} === 'function'
typeof [] === 'object'
typeof {} === 'object'

-- instanceof 可以准确的判断对象类型，因为内部机制是通过判断对象的原型是否指向构造函数的prototype属性

2 instanceof Number === false
true instanceof Boolean === false
'str' instanceof String === false
[] instanceof Array === true
{} instanceof Object === true
undefined instanceof Object === false
null instanceof Object === false

-- constructor 
1. 基本数据类型， 没有constructor属性
2. 引用数据类型， 默认有一个constructor属性， 指向引用数据类型的构造函数

这里有一个坑，如果我创建一个对象，更改它的原型，constructor就会变得不可靠了


-- Object.prototype.toString.call()
1. 基本数据类型， 都会返回对应的基本数据类型    
2. 引用数据类型， 都会返回[object Object]

function getTYpe(obj){
    let type = typeof  obj
    if(type !== 'object')   {
        return type
    }
    return Object.prototype.toString.call(obj).slice(8,-1)
    reteurn Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]/, '$1')
}

## 类型转换


## 类型转换


## this


function fn(){
    console.log(this.a)
}

var a = 1
fn()

const obj = {
    a:2,
    fn:fn
}
obj.fn()

const c = new fn()


fn.call(target,1,2)
fn.apply(target,[1,2])
fn.bind(target)(1,2)


## 执行上下文

全局执行上下文
函数执行上下文

每个执行上下文都有三个重要的属性

变量对象 （vo）
作用域链
this

