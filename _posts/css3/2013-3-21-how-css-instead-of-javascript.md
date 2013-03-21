---
layout: post
category : css3
title:  重新审视那位优雅的CSS
header: 重新审视那位优雅的CSS
tagline:
tags : [css3,javascript]
---
{% include JB/setup %}

向来不喜铺垫，依旧先上菜后调侃。从一个盒中小鱼demo讲起：
http://www.w3.org/Talks/2013/0128-CSS-Utrecht/demo-transforms/demo-translate3d-cube.html

demo的精彩之处在于没有用一行Javascript代码便实现了所有小鱼在盒子中漫游的行为，因其只使用CSS引擎默认的选择器机制。

只用CSS实现动画的控制，这并不陌生，平时工作中也常用hover伪类来触发鼠标悬浮后的样式或行为，而不是去绑定mouse行为事件。
如tooltip中通过hover伪类选择器来控制tooltip的显示与隐藏，实现起来比Javascript方案优雅的多。

但如何通过CSS来捕捉demo中的点击行为呢？

从demo页面源码中截取如下真相：

    #moveme {position: absolute; top: 50%; left: 50%; .... -webkit-transition: 1.5s}
    #top-left:target #moveme {-webkit-transform: translate3d(-130px,-130px,300px)}
    #top-right:target #moveme {-webkit-transform: translate3d(100px,-130px,150px)}
    #bottom-left:target #moveme {-webkit-transform: translate3d(-100px,90px,300px)}
    #bottom-right:target #moveme {-webkit-transform: translate3d(90px,90px,300px)}
    #center:target #moveme {-webkit-transform: translate3d(-10px,40px,100px)}


    <ul>
      <li><a href="#">original</a>
      <li><a href="#center">center</a> = translate3d(-10px,40px,100px)
      <li><a href="#top-left">top left</a> = translate3d(-130px,-130px,300px)
      <li><a href="#top-right">top right</a> = translate3d(100px,-130px,150px)
      <li><a href="#bottom-left">bottom left</a> = translate3d(-100px,90px,300px)
      <li><a href="#bottom-right">bottom right</a> = translate3d(90px,90px,300px)
    </ul>

    <em id=moveme></em>


代码中的关键是 :target 伪类选择器。 看 MDN 中是如何描述 ：target 的？ https://developer.mozilla.org/en-US/docs/CSS/:target

    The :target pseudo-class represents the unique element, if any, with an id matching the fragment identifier of the URI of the document..

    URIs with fragment identifiers link to a certain element within the document, known as the target element. For instance, here is a URI pointing to an anchor named section2:
      http://example.com/folder/document.html#section2
    The anchor can be any element with an id attribute, e.g. <h1 id="section2"> in our example. The target element h1 can be represented by the :target pseudo-class.


MDN 中也提供了关于 :target 伪类选择器的一种应用，只用CSS实现了lightbox的组件。

前端童鞋应考虑如何尽量只用CSS来控制前端视图层的交互行为，JS在前端虽是无所不能的，但与CSS相比，无论是维护性与优雅度都无法企及CSS的实现方案。
让各自的职责明确也是前端的架构的要点，CSS与JS各司其职，别老想用JS来解决一切问题。