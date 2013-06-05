---
layout: post
category : solution
title:  小议 SVG 与 Canvas
header: 小议 SVG 与 Canvas
tagline:
tags : [svg, canvas]
---
{% include JB/setup %}

canvas是h5体系集中的一种基于像素操作的图形技术，svg同样也是h5中一部分，只是svg基于矢量形状，两者有各种的优势。
以下数据来自微软童鞋的测试，传送门： [http://msdn.microsoft.com/zh-cn/library/ie/gg193983(v=vs.85).aspx](http://msdn.microsoft.com/zh-cn/library/ie/gg193983(v=vs.85).aspx)：


    图面较小时、对象数量较大 (>10k)（或同时满足这二者）时 canvas 性能更佳;
    对象数量较小 (<10k)、图面更大（或同时满足这二者）时 svg 性能更佳;


关于对canvas进行频繁操作，性能真的就会比svg好吗？

关键是操作姿势与场景，在没有前置条件的结论往往是片面的，只举一个例子，我们操作一个图形，对canvas的操作以常用的清屏方式(不是脏矩形姿势)，然后进行频繁操作，
对比svg，svg的渲染显然经过浏览器的优化，只会进行部分区域的重绘，而canvas则需重绘整个画片，可想而知在此常见场景中，svg会显的更有优势，canvas应该更适合游戏编程。


未完待续...











