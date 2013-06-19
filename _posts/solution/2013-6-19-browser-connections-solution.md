---
layout: post
category : solution
title:  浏览器连接数方案
header: 浏览器连接数方案
tagline:
tags : [browser, connections]
---
{% include JB/setup %}

这个主题源于taobao的一个活动页面，看图说话：
![weiboimg](http://ww3.sinaimg.cn/mw1024/6b29bb61gw1e5scyc97sfj20pn0b9mzu.jpg)
这里的问题是没有把图切细，解决的方案也很自然，多切几张图，每张图的大小控制在30-50K以内。

但这时有童鞋可能会困惑一个问题，IE下的连接数问题如何解决？
回答这个问题之前我们先严谨的看下IE不同版本对连接数的限制：

<table>
    <tbody><tr><th>版本</th><th>HTTP 1.0 服务器（宽带连接）</th><th>HTTP 1.1 服务器（宽带连接）</th><th>HTTP 1.0 服务器（拨号连接）</th><th>HTTP 1.1 服务器（拨号连接）</th></tr>
    <tr><td>Internet Explorer 7 和早期版本</td><td>4</td><td>2</td><td>4</td><td>2</td></tr>
    <tr><td>Internet Explorer 8</td><td>6</td><td>6</td><td>4</td><td>2</td></tr>
    <tr><td>Internet Explorer 9</td><td>10</td><td>10</td><td>4</td><td>2</td></tr>
    </tbody>
</table>

如需考虑IE浏览器用户，如何突破限制? 让用户修改系统连接数配置，显然不合适。
可取的方案是什么？CDN绑定多域名，考虑IE版本中最低的连接数，每个域下控制只链接2个静态资源即可：

    cdn1.qq.com
    cdn2.qq.com
    cdn3.qq.com
    ...

### Ref
[Internet Explorer 8 中的连接增强功能](http://msdn.microsoft.com/zh-cn/library/cc304129(v=vs.85).aspx)
[HTTP 1.1 规范中最大连接数目设置为2的强制性要求](http://www.w3.org/Protocols/rfc2616/rfc2616-sec8.html#sec8.1.4)