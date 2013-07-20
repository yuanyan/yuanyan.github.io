---
layout: post
category : es6
title:  ECMAScript6之箭向函数
header: ECMAScript6之箭向函数
tagline:
tags : [ES6, ECMAScript6, Arrow Functions, JavaScript]
---
{% include JB/setup %}

## 什么是箭向函数?

举个例子：

    var arr = [1,2,3,4,5];
    var total = arr.reduce(function(x,y){ return x+y});

例子中是对数组进行求和，reduce方法需传入一个函数，我们使用function关键字声明一个匿名函数，并返回x+y的结果。
然使用箭向函数语法，我们可以如何简化？

    var arr = [1,2,3,4,5];
    var total = arr.reduce((x,y)=>x+y);

可以认为箭向函数声明是普通函数声明的语法糖，其格式如下：

     () => { ... }     // 无参数
     x => { ... }      // 单个参数
     (x, y) => { ... } // 多个参数

如果需要返回的是字面量对象则需要用括号 `( ... )` 包裹起来：

    val => ({key: val})

## 绑定词法的this

什么是词法绑定？上例子：

    var counter1 = {
        cur : 0,
        inc: () => ++this.cur
    }
    counter1.inc() // -> NaN

    var counter2 = {
        cur : 0,
        inc: function(){ return ++this.cur }
    }
    counter2.inc() // -> 1


我们看到例子中counter1虽然是通过箭向函数简化了输入，但最后输出的结果多少会有些不解，为什么呢？答案就是本节的标题，箭向函数中的this是词法绑定的。

因为创建一个箭向函数实际等同于先创建一个匿名函数，然后再创建给匿名函数绑定当前this的函数：

    () => ++this.cur

等同于

    function(){ return ++this.cur }.bind(this)

所以箭向函数的的this即使通过bind也是无法改变的，因为其已经被bind了当前词法的this，所以在例子中this指向的是root对象，浏览器中则是window对象。
`this.cu`r 为 `undefined`，`++this.cur`则返回`NaN`。

## 貌似用标准的函数声明也能解决问题，为什么要用箭向函数呢？

1. 想想为什么我们更喜欢使用字面量声明而不是 new String 或 new Array 呢？ 简洁明了呗
2. 总是会返回末尾的执行结果，像 reduce map 常用的计算数组的操作往往都需要返回值
3. 在以往的经验中我们往往会像下面例子中那样在另一回调函数中通过that变量来帮助引用到外层函数的this

    var yuanyan = {
        name: "yuanyan",
        sayHi: function () {
            var that = this;  // (*)
            setTimeout(function () {
                console.log(that.name + " says hi")
            });
        }
    }

而通过箭向函数则无需再使用that，因其绑定了词法的this：

    var yuanyan = {
        name: "yuanyan",
        sayHi: function () {
            setTimeout( () => console.log(this.name + " says hi"),100)
        }
    }

## 已支持的浏览器

* Firefox 22.0 +


## 为什么把 Arrow Functions 翻译为箭向函数而不是更字面意的箭头函数？
原因是为了区分两种不一样的箭头符号：

1. `->`
2. '=>'

称`->` 是箭头，而'=>'是箭向，而Arrow Functions中目前只使用了'=>'符号，所以这里称其为箭向函数。


## Refs
* http://people.mozilla.org/~jorendorff/es6-draft.html#sec-13.2
* http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/arrow_functions
* http://www.2ality.com/2012/04/arrow-functions.html
