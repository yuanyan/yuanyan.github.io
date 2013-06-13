---
layout: post
category : performance
title:  QQ查找项目前端优化小记
header: QQ查找项目前端优化小记
tagline:
tags : [qqfind, performance, 性能, 优化]]
---
{% include JB/setup %}

    暂不公布案例，请期待

以上案例皆为外相，正本清源，关注Web加载过程中4个关键时间点：

1. Time to First Byte              服务端返回时间
2. Time to Start Render         白屏结束时间
3. Time to Interactive            用户可交互时间
4. Time to Document Ready  文档加载完成时间

而优化过程大多围绕关键点展开，方式大致可归为以下4类：

1. 减少请求 -    合并文件、更多的使用CSS代替图片、内嵌小型文件
2. 加快响应   -  DNS预解析、接入机多地部署、SPDY/HTTP2.0、资源CDN部署、压缩HTML、压缩CSS、压缩JS、压缩图片
3. 并行加载请求 -  拆分大型文件
4. 预加载请求 - HEAD中请求初始数据、prefetch/prerender

结束语本是已被说烂的金庸句式：“天下武功唯快不破”，想想不能落入俗套呀。大脑闪过 Facebook 在早期的一句话“Move Fast and break things”，
然而当我们面向海量用户时，更可取方式应该是“Move Fast and monitor closely“，在快速的产品迭代过程中进行即时的监控，而性能数据是监控系统中重要的环节之一。
而如何在自动化发布构建流程上保证外发版本的性能，是需要一直努力的方向一直。
