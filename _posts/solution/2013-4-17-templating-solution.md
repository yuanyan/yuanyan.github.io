---
layout: post
category : solution
title:  前端模版的奋斗史
header: 前端模版的奋斗史
tagline:
tags : [template, precompile]
---
{% include JB/setup %}

前端模版已深入广大前端群众中，可以说是居家旅行必备。所谓跟着群众走，遂斗胆谈下对前端模版的认识。

本文不介绍模版是啥，自己google去；
不科普某模版的某某语法；
更不是讲A模版的性能是B模版性能的xx倍，因为看完本文你会发现这些模版性能完全是可以被忽略的特性。
而是模版在前端开发流程中的姿势史，美其名曰奋斗历。
大湿说“性爱姿势决定你的爱情态度“，then...

开场白每次都是那么生涩，惭愧~

还记得儿时的模版吗？

    var tmpl = "${a} is not ${b}"
    var res = $.template(tmpl, { a: 1, b: 2})
    // 1 is not 2







