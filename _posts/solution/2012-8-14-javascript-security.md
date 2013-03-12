---
layout: post
category : solution
title:  Javascript 安全方案
header: Javascript 安全方案
tagline:
tags : [javascript, 安全]
---
{% include JB/setup %}

考虑下面的代码，有发现问题吗？

	<script>
	  var str = "</script><script>alert('i'm flaw');</script>";
	</script>
