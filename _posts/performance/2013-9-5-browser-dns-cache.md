---
layout: post
category : performance
title:  浏览器DNS缓存
header: 浏览器DNS缓存
tagline:
tags : [DNS, 缓存]
---
{% include JB/setup %}

什么是DNS？简而言之是从域名(www.qq.com)解析为IP(183.60.15.153)的过程，详情可移步 [wikipedia](http://en.wikipedia.org/wiki/Dns)。

这篇文章用以记录浏览器级别的DNS缓存策略：

* Firefox 默认的DNS缓存时间是 60s, 可通过在`about:config`中`network.dnsCacheExpiration`配置来进行修改
* IE 30 min
* Opera 15-60s

## Ref
* [Why Web Browser DNS Caching Can Be A Bad Thing](http://dyn.com/blog/web-browser-dns-caching-bad-thing/)
* (http://kb.mozillazine.org/Network.dnsCacheExpiration)