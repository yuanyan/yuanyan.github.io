---
layout: post
category : performance
title:  高性能移动Web前端
header: 高性能移动Web前端
tagline:
tags : [mobile, Web前端, 性能]
---
{% include JB/setup %}

高性能移动Web相较PC的场景需要考虑的因素也相对更多更复杂，我们总结为以下几点： 流量、功耗与流畅度。
在PC时代我们更多的是考虑体验上的流畅度，而在Mobile端本身丰富的场景下，需要额外关注对用户基站网络流量使用的情况，设备耗电量的情况。

关于流畅度，主要体现在前端动画中，人在前端动画体系中，通常有两种模式：JS动画与CSS动画。
JS动画是为在低级浏览器中实现动画能力的一种方案，而在移动端，我们必然选择CSS动画。

然而在移动端，CSS动画相比PC会面对更多的性能问题，主要体现在动画的卡顿与闪烁。

目前对提升移动端CSS动画体验的主要方法有几点：

1.尽可能多的利用硬件能力，如使用3D变形来开启GPU加速。

	-webkit-transform: translate3d(0, 0, 0);
	-moz-transform: translate3d(0, 0, 0);
	-ms-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0);


如动画过程有闪烁（通常发生在动画开始的时候），可以尝试下面的Hack：

	-webkit-backface-visibility: hidden;
	-moz-backface-visibility: hidden;
	-ms-backface-visibility: hidden;
	backface-visibility: hidden;

	-webkit-perspective: 1000;
	-moz-perspective: 1000;
	-ms-perspective: 1000;
	perspective: 1000;


如下面一个元素通过translate3d右移500px的动画流畅度会明显优于使用left属性：

	#ball-1 {
	  transition: -webkit-transform .5s ease;
	  -webkit-transform: translate3d(0, 0, 0);
	}
	#ball-1.slidein {
	  -webkit-transform: translate3d(500px, 0, 0);
	}


	#ball-2 {
	  transition: left .5s ease;
	  left：0;
	}
	#ball-2.slidein {
	  left：500px;
	}



注：3D变形会消耗更多的内存与功耗，应确实有性能问题时才去使用它，兼在权衡

2.尽可能少的使用box-shadows与gradients

> box-shadows与gradients往往都是页面的性能杀手，尤其是在一个元素同时都使用了它们。

3.尽可能的让动画元素不在文档流中，以减少重排

	position: fixed;
	position: absolute;


持续更新中...