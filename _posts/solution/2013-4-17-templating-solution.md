---
layout: post
category : solution
title:  前端模版的奋斗史
header: 前端模版的奋斗史
tagline:
tags : [template, precompile]
---
{% include JB/setup %}

### 为什么需要模版？


    var html = "<ul class='" + myClass + "'>" +
        "<li id='" + myId + "'>" + myContents + "</li>";


如上示例，我想没人愿意做字符串拼接的工作，易出错且维护性极低，需避免以上坏味道代码出现在你的程序中。

模版是解耦视图的有效手段，我们通过模版引擎把数据与模版渲染后的结果呈现给用户，这渲染过程说白了就是把字符串的拼接工作交由模版引擎。

在不同的开发模式下模版渲染发生的端是不同的，这里的端分为两种：服务器与客户端。

在CGI吐HTML片断数据的开发模式下，模版的渲染是在服务器端进行，客户端发起一个请求，服务器把渲染后的结果推送到客户端，前端获取到HTML片断后直接将其插入到DOM中。
但如此有几个问题，首先，CGI无法适应多终端不同视图的场景；其次，在移动端，网络带宽依旧是瓶颈之一。
所以在现代Web开发需求下，CGI只吐JSON数据，区别与服务端渲染数据的模式，开始将数据的渲染放在客户端进行。

而在Web浏览器中承担模版渲染的工作则交由了编程界的屌丝Javascript。

### 简易模版引擎实现

模版引擎的实现主要有两种思路：一种是通过纯粹的正则匹配，另一种是词法分析与语法解析。任何一种模版语法都可以用这两种不同的思路来实现。
我们用第一种正则的方式来实现一个简易的模版引擎：

    /**
     * Function: template
     * 简单的模板机制
     *
     * Parameters:
     *  tmpl - {String} 模板
     *  val - {Object} 模板对象
     *
     * Returns:
     * {String}
     */
    var template = function(tmpl, val){

        return tmpl.replace(/\$\{(\w+)\}/g, function(m, i){
            if (val[i]) {
                return val[i];
            }
            else { // 模板对象未定义时
                return "";
            }
        });
    };

整个实现基于字符串的replace机制, 实现了模版变量的替换功能：

    var tmpl = "${a},${b},${c}"
    var res = template(tmpl, { a: 'a', b: 'b'})    // a,b,



未完待续...











