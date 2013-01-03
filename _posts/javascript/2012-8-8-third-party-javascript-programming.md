---
layout: post
category : javascript
title:  Third-party Javascript 编程
header: Third-party Javascript 编程
tagline:
tags : [third-party, javascript, ifrmae]
---
{% include JB/setup %}

## 关于 Third-party JavaScript
什么是Third-party JavaScript？翻译成中文为第三方JavaScript，举个例子：用户甲访问乙方的网站，但乙方页面却包含来自丙方的JavaScript代码并执行，我们称来自丙方的JavaScript为第三方JavaScript。第三方JavaScript其实我们早已非常熟悉，只是未曾去了解他们的统一称呼。如我们经常在博客中看到博主使用了 [Disqus](http://disqus.com) 提供评论服务，需在页面引入如下JavaScript代码片断：

	<script type="text/javascript">
		var disqus_shortname = 'madscript'; // required: replace example with your forum shortname
		
		/* * * DON'T EDIT BELOW THIS LINE * * */
		(function() {
			var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
			dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
			(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
		})();
	</script>


再如 [Jisthis](http://www.jiathis.com/) 提供的“分享到”侧栏需引入：

	<!-- JiaThis Button BEGIN -->
	<script type="text/javascript" src="http://v3.jiathis.com/code/jiathis_r.js?uid=1336206755505427&move=0" charset="utf-8"></script>
	<!-- JiaThis Button END -->


以上举例的两个是具有UI界面并直接服务甲可以被甲感知的第三方JavaScript，既然有些具有UI的，当然还有一些是无UI的或常规情况下无UI的第三方JavaScript，这其中流量最大的应是 Google 提供的面向乙方提供的网站访问分析服务[Google Analytics](http://www.google.com/analytics/)

	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-19059856-3']);
	  _gaq.push(['_trackPageview']);

	  (function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>


## 参考

来自 [Ben Vinegar](https://twitter.com/bentlegen) 的分享：

<iframe src="http://www.slideshare.net/slideshow/embed_code/8281214" width="597" height="486" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="allowfullscreen"> </iframe> 
