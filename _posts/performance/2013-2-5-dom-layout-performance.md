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

关键一，可触发layout的操作，哪些操作下会layout的更新（也称为reflow或者relayout）？

我们从浏览器的源码实现入手，以开源[Webkit/Blink](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/)为例，
对layout的更新，Webkit 主要通过 [Document::updateLayout](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/dom/Document.cpp&q=updateLayout%20package:%5Echromium$%20file:%5Esrc/third_party/WebKit/Source/core/&dr=CSs&l=1715)
与 [Document::updateLayoutIgnorePendingStylesheets](https://code.google.com/p/chromium/codesearch#chromium/src/third_party/WebKit/Source/core/dom/Document.cpp&q=updateLayout%20package:%5Echromium$%20file:%5Esrc/third_party/WebKit/Source/core/&dr=CSs&l=1750)
两个方法：

···
void Document::updateLayout()
{
    ASSERT(isMainThread());

    FrameView* frameView = view();
    if (frameView && frameView->isInLayout()) {
        ASSERT_NOT_REACHED();
        return;
    }

    if (Element* oe = ownerElement())
        oe->document()->updateLayout();

    updateStyleIfNeeded();

    StackStats::LayoutCheckPoint layoutCheckPoint;

    if (frameView && renderer() && (frameView->layoutPending() || renderer()->needsLayout()))
        frameView->layout();

    if (m_focusedNode && !m_didPostCheckFocusedNodeTask) {
        postTask(CheckFocusedNodeTask::create());
        m_didPostCheckFocusedNodeTask = true;
    }
}


void Document::updateLayoutIgnorePendingStylesheets()
{
    bool oldIgnore = m_ignorePendingStylesheets;

    if (!haveStylesheetsLoaded()) {
        m_ignorePendingStylesheets = true;

        HTMLElement* bodyElement = body();
        if (bodyElement && !bodyElement->renderer() && m_pendingSheetLayout == NoLayoutWithPendingSheets) {
            m_pendingSheetLayout = DidLayoutWithPendingSheets;
            styleResolverChanged(RecalcStyleImmediately);
        } else if (m_hasNodesWithPlaceholderStyle)
            recalcStyle(Force);
    }

    updateLayout();

    m_ignorePendingStylesheets = oldIgnore;
}

···

从 updateLayoutIgnorePendingStylesheets 方法的内部实现可知，其也是对 updateLayout 方法的扩展，并且在现有的 layout 更新模式中，大部分场景都是调用 updateLayoutIgnorePendingStylesheets 来进行layout的更新。

搜索 Webkit 实现中调用 [updateLayoutIgnorePendingStylesheets](https://code.google.com/p/chromium/codesearch#search/&q=updateLayoutIgnorePendingStylesheets&sq=package:chromium&type=cs) 方法的代码,
得到以下可导致触发 layout 的操作：

* `Element`:
clientHeight, clientLeft, clientTop, clientWidth, focus(), getBoundingClientRect(), getClientRects(), innerText, offsetHeight, offsetLeft, offsetParent, offsetTop, offsetWidth, outerText, scrollByLines(), scrollByPages(), scrollHeight, scrollIntoView(), scrollIntoViewIfNeeded(), scrollLeft, scrollTop, scrollWidth

* `Frame, HTMLImageElement`:
height, width

* `Range`:
getBoundingClientRect(), getClientRects()

* `SVGLocatable`:
computeCTM(), getBBox()

* `SVGTextContent`:
getCharNumAtPosition(), getComputedTextLength(), getEndPositionOfChar(), getExtentOfChar(), getNumberOfChars(), getRotationOfChar(), getStartPositionOfChar(), getSubStringLength(), selectSubString()

* `SVGUse`:
instanceRoot

* `window`:
getComputedStyle(), scrollBy(), scrollTo(), scrollX, scrollY, webkitConvertPointFromNodeToPage(), webkitConvertPointFromPageToNode()



进一步深入Layout，那上文中必须更新的必要条件是什么？
在 Stoyan Stefanov 的 [Rendering: repaint, reflow/relayout, restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/) 一文中已做比较详细的解答，可移步了解~


## Ref

* [Rendering: repaint, reflow/relayout, restyle](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)
* [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)