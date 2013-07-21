---
layout: post
category : es6
title:  ECMAScript6之生成器函数
header: ECMAScript6之生成器函数
tagline:
tags : [ES6, ECMAScript6, 生成器函数, JavaScript]
---
{% include JB/setup %}

在ECMAScript6新增特性中，最受关注的莫过于生成器函数（Generators），生成器可以极大的改变异步编程的体验。

## 什么是生成器函数?

生成器函数长啥样？先端出来瞧瞧：

	// notice: function* instead of function
	function* foo() {
	  yield 0;
	  for (var i = 0; i < arguments.length; i++) {
		yield arguments[i];
	  }
	  return "bar";
	}

与普通的函数不同，生成器函数 `function` 关键字后多了一个`*`标识符，并且在函数体内使用了`yield`关键字。
执行一个生成器将返回一个迭代器，迭代器可以被ES6中新增的`for...of...`循环遍历执行：

	for (var n of foo()) {
		console.log(n);
	}

也可以通过迭代器的`next()`方法逐一执行：

	var seq = foo(1, 2, 3);  // => [object Generator]
	seq.next(); // { value: 0, done: false }
	seq.next(); // { value: 1, done: false }
	seq.next(); // { value: 2, done: false }
	seq.next(); // { value: 3, done: false }
	seq.next(); // { value: "bar", done: true }
	seq.next();  // Error: Generator has already finished

当第一次调用迭代器的`next()`方法时，生成器才开始执行生成器函数（而不是在`foo()`构造生成器时），然后直到遇到yield时则暂停执行（挂起），此时yield关键字的右值将作为此次`next()`方法的返回值。

之后每次调用生成器的`next()`方法，生成器将从上次暂停执行的状态开始，继续执行生成器函数，直到再次遇到yield时暂停，同样的yield的右值将作为`next()`方法的返回值。

如此反复一直到当调用`next()`方法时生成器函数全部执行结束（遇到return、执行到函数末尾、抛出异常），则这次next方法的将返回函数执行的结果，如例子中返回了字符串`bar`。

当前生成器执行结束后，在此时如再次调用`next()`方法将会抛出`Error: Generator has already finished`异常。

## 解决什么问题？

回顾迭代器函数执行的过程，我们思考下迭代器到底解决什么问题？

我们调用一个普通的函数时，一般是从函数的第一行代码开始执行，结束于return语句、异常或者函数结束（隐式的返回undefined）。一旦函数将控制权交还给调用者，就意味着全部结束。函数中做的所有工作以及保存在局部变量中的数据都将丢失。再次调用这个函数时，一切都将从头创建。 

对于在计算机编程中所讨论的函数，这是很标准的流程。这样的函数只能返回一个值，不过，有时可以创建能产生一个序列的函数还是有帮助的。要做到这一点，这种函数需要能够“保存自己的工作“。 

我说过，能够“产生一个序列”是因为我们的函数并没有像通常意义那样返回。return隐含的意思是函数正将执行代码的控制权返回给函数被调用的地方。而"yield"的隐含意思是控制权的转移是临时和自愿的，我们的函数将来还会收回控制权。

而拥有这种能力的“函数”被称为生成器，它非常的有用。生成器（以及yield语句）最初的引入是为了让程序员可以更简单的编写用来产生值的序列的代码。 以前，要实现类似随机数生成器的东西，需要实现一个类或者一个模块，在生成数据的同时保持对每次调用之间状态的跟踪。引入生成器之后，这变得非常简单。

## 平台实现情况

* Node v0.11.2+ （需加上--harmony参数）

## Refs
* http://wiki.ecmascript.org/doku.php?id=harmony:generators
* http://www.oschina.net/translate/improve-your-python-yield-and-generators-explained
* http://tobyho.com/2013/06/16/what-are-generators/
* http://callbackhell.com/
