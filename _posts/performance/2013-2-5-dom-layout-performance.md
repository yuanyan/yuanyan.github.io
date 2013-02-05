---
layout: post
category : performance
title:  DOM layout 性能
header: DOM layout 性能
tagline:
tags : [DOM, layout, 性能]
---
{% include JB/setup %}


我们从两断代码开始今天的话题：

    var newWidth = aDiv.offsetWidth + 10;
    aDiv.style.width = newWidth + 'px';
    var newHeight = aDiv.offsetHeight + 10;
    aDiv.style.height = newHeight + 'px';

    var newWidth = aDiv.offsetWidth + 10;
    var newHeight = aDiv.offsetHeight + 10;
    aDiv.style.width = newWidth + 'px';
    aDiv.style.height = newHeight + 'px';

这是两段能力上完全等同的代码，显式的差异正如我们所见，只有执行顺序的区别。但真是如此吗？下面是加了说明注释的代码版本，很好的阐述了其中的进一步差异：


    // 触发两次 layout
    var newWidth = aDiv.offsetWidth + 10;   // Read
    aDiv.style.width = newWidth + 'px';     // Write
    var newHeight = aDiv.offsetHeight + 10; // Read
    aDiv.style.height = newHeight + 'px';   // Write

    // 只触发一次 layout
    var newWidth = aDiv.offsetWidth + 10;   // Read
    var newHeight = aDiv.offsetHeight + 10; // Read
    aDiv.style.width = newWidth + 'px';     // Write
    aDiv.style.height = newHeight + 'px';   // Write

从注释中可找到规律，连续的读取offsetWidth/Height属性与连续的设置width/height属性，相比分别读取设置单个属性可少触发一次layout。

从结论看似乎与执行队列有关，没错，这是浏览器的优化策略。所有可触发layout的操作都会被暂时放入 `layout-queue` 中，等到必须更新的时候，再计算整个队列中所有操作影响的结果，如此就可只进行一次的layout，从而提升性能。

那上文中必须更新的必要条件是什么？ 在 [Rendering: repaint, reflow/relayout, restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/) 一文中已做比较详细的解答，可移步了解~


搜索Chrome浏览器实现中调用 [updateLayoutIgnorePendingStylesheets](http://code.google.com/p/chromium/source/search?q=%22-%3EupdateLayoutIgnorePendingStylesheets%22) 方法的代码,
得到以下可导致触发 layout 的操作：


* Element
clientHeight, clientLeft, clientTop, clientWidth, focus(), getBoundingClientRect(), getClientRects(), innerText, offsetHeight, offsetLeft, offsetParent, offsetTop, offsetWidth, outerText, scrollByLines(), scrollByPages(), scrollHeight, scrollIntoView(), scrollIntoViewIfNeeded(), scrollLeft, scrollTop, scrollWidth

* Frame, Image
height, width

* Range
getBoundingClientRect(), getClientRects()

* SVGLocatable
computeCTM(), getBBox()

* SVGTextContent
getCharNumAtPosition(), getComputedTextLength(), getEndPositionOfChar(), getExtentOfChar(), getNumberOfChars(), getRotationOfChar(), getStartPositionOfChar(), getSubStringLength(), selectSubString()

* SVGUse
instanceRoot

* window
getComputedStyle(), scrollBy(), scrollTo(), scrollX, scrollY, webkitConvertPointFromNodeToPage(), webkitConvertPointFromPageToNode()


## Ref

* [Rendering: repaint, reflow/relayout, restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)
* [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)