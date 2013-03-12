---
layout: post
category : solution
title:  P3P 方案
header: P3P 方案
tagline:
tags : [solution, p3p]
---
{% include JB/setup %}

考虑下面的代码，有发现问题吗？

	<script>
	  var str = "</script><script>alert('i'm flaw');</script>";
	</script>


科普，什么是P3P？ 全称是 Platform for Privacy Preferences (P3P) Project， 即为保护网络隐私相关的标准 (http://www.w3.org/P3P/) ,
现常用于指代由此导致的跨源内嵌页无法访问cookie的问题。

### P3P 头

大部分浏览器（IE），设置 P3P 头即可解决iframe页设置cookie的问题：

    P3P: CP=HONK

### 表单



    var cookieForm = document.createElement("form");
    cookieForm.action = "A.com/setCookie?cache=1231213123";
    cookieForm.method = "post";
    document.body.appendChild(cookieForm);



    var name = 'test_cookie';

    var iframe = document.createElement('iframe');
    iframe.name = name;
    iframe.src = 'javascript:false';
    document.appendChild(iframe);

    var form = document.createElement('form');
    form.action = location.toString();
    form.method = 'POST';
    form.target = name;
    document.appendChild(form);
    form.submit();


### document.domain

在腾讯，部门间协作更多是跨子域名问题，这是最好的情况，解决起来也非常轻松。如主页是 a.qq.com，内嵌iframe页是 b.qq.com，此时分别设置两页面的 document.domain = 'qq.com' 即可。