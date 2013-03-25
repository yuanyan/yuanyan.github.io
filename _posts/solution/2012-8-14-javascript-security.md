---
layout: post
category : solution
title:  Javascript 安全方案
header: Javascript 安全方案
tagline:
tags : [javascript, 安全]
---
{% include JB/setup %}

这是一篇关于JavaScript安全的文章，但也不限于JavaScript。
前端安全的范围大致都在XSS（跨站脚本攻击）与 CSRF（跨站请求伪造）这两个领域，下面的分享与讨论也都可认为是这几个主题的延伸与扩展。

对于前端安全，可能很多人有这样一个疑问：后台往往已经做了安全处理，为啥前端还需要再处理一次呢？所有前端接收到数据都应该被认为是
不可信的，因为我们无法保证后台数据一定是安全的，即使是自己的后台也有可能存在数据存储的入口是多个的，任何一个入口在存储数据式发生安全问题，
都会可能导致展现数据前端发生被攻击的风险。

进入正题，先从考虑下面的代码开始，是否有发现问题？

    <script>
      var str = "</script><script>alert('i am flaw');</script>";
    </script>

这断代码最后的执行结果是 alert i am flaw 的填出框，这与HTML解析机制有关，HTML从上而下进行分析，解析引擎遇到
第一个起始标签 <script> 时把其压入栈中，直到遇到紧随的第一个闭合标签 </script>，导致引擎会认为

    <script> var str = " </script>

是第一段JavaScript代码并执行。然后继续按以上规则解析后续文本，因此引擎会认为下面是第二段代码并执行：

    <script>alert('i am flaw');</script>

而 "; </script> 则被分为两部对待， "; 被视为文本内容并显示，而 </script> 则会被认为是未闭合的非法标签。此时浏览器会报语法错误，提示你标签非法，
如Chrome下提示 Uncaught SyntaxError: Unexpected token ILLEGAL。

简单的开胃菜后讲些干货~

### 关于CSS样式

在很多有个人主页的站点是支持用户自定义样式的，那如何过滤用户定义的非法CSS属性，则是需要考虑的安全问题之一。

    if(css.match(/behavior:|content:|javascript:|binding|expression|\@import/)){
        throw new Error("Illegal CSS");
    }

过滤 expression

color:expression(alert(\"hello\")

过滤 @import

@import 'unsafe.css'

过滤 behavior

behavior: url(unsafe.htc)

过滤 binding

-moz-binding: url("http://www.mozilla.org/xbl/htmlBindings.xml#checkbox");

过滤 url

url(javascript:alert(3))

过滤 content

content: " (" attr(href) ")";

