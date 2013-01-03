---
layout: post
category : html5
title:  Appcache Facts 中译版
header:  Appcache Facts 中译版
tagline:
tags: [appcache, html5]
---
{% include JB/setup %}

Application cache 是 HTML5 中在规范完整性上比较糟糕的特性之一，规范上的不到位导致浏览器厂商在实现上也存在些许差异，而产生本文档的目的即让开发者们知晓那些潜规则，摆脱问题的困惑与束缚，正确的使用应用缓存真正让 Web 加速。

**Fact** ：设计 Appcache 的目的虽是能让 Web 应用能在离线的情况的运行而无需要求连接网络，但同时 Appcache 也可在网络在线的情况的使用，如此来减少页面需要加载的资源数量来提速页面，速度上将是一个数量级的提升。

**Fact** ：服务器返回 manifest 文件的MIME类型必须是 text/cache-manifest, 否则虽配置 manifest 文件但 Appcache 功能并不会启用。

	建议 manifest 文件以 .appcache 为文件后缀名，
	并在 Web 服务器中添加 MIME 类型类型，如在 Apache 的.htaccess 配置中添加：
	AddType text/cache-manifest .appcache

**Fact** ：Appcache 的 manifest 文件有三个可选的配置项目： CACHE， NETWORK， FALLBACK。

	CACHE 项配置所有需要存储在本地应用缓存中的资源文件，浏览器会在页面加载完
	成后即时的自动在后台下载。如果浏览器之前已经下载过CACHE列表中的某个资源则
	不会再次下载。

	NETWORK 项配置与 CACHE 正相反，它告诉浏览器哪些资源要求是在有网络的环境下，
	如后台的API接口调用，可以配置在 NETWORK 项。 如我们的接口地址是 http://example.com/api/
	前缀格式的URL，则只需配置其URL的前缀格式，无需列出所有URL，浏览器会自动去匹配。

	如果我们需要配置为所有的URL地址为CACHE或NETWORK，Chrome 与 Safari 要求用户
	配置为 *，Firefox要求为 http://* 和 https://*，兼容上考虑我们可在配置
	中分别加入 *，http://* 和 https://* 使其在所有浏览器中都被识别。

	FALLBACK 项配置为告诉浏览器在离线环境下或服务器故障时这些网络资源不可用
	时的使用哪些替代资源。

**Fact** ：在SSL安全连接下，所有在 manifest 配置的资源列表需符合同源策略。即所有的地址都必须是相对地址。但Chrome除外，在SSL下，即使有非同源的资源，Chrome仍旧会下载至应用缓存中。

**Fact** ：manifest 文件任何的改变包括注释都会触发浏览器更新应用缓存中的所有资源。通常 manifest 的配置策略在每次发布是并不会有改变，为了更新应用缓存我们会在 manifest 的中加入版本注释，在下次发布中则修改 # version 1 注释来知会浏览器更新应用缓存。

	CACHE MANIFEST
	# version 1
	CACHE
	/logo.png
	...

**Fact** ：当需要更新已存在的应用缓存时，浏览器会向服务器发送标准的  If-Modified-Since 请求头，当远程的资源未改变与本地缓存一致时，浏览器则不再重新下载。浏览器不会自动去检测列表中资源，必须手动去改变 manifest 文件来触发，我们推荐通过改变 manifest 中的版本注释来触发检测，简单且有效。

**Fact** ：manifest 中的任何资源的改变只在的下次页面加载中生效。因为如页面已经被缓存，浏览器会立即从缓存中获取资源，然后才开启后台进程去检测 manifest 文件中是否有资源需要被刷新。所以最新版本的资源只会在浏览器下次启动时被从缓存中获取。我们可以绑定 updateready 事件来获知后台更新完新版本资源的时机，然后提示用户是否需重新加载页面：

	if (window.applicationCache) {
		applicationCache.addEventListener('updateready', function() {
			if (confirm('页面更新完成，是否重新加载?')) {
				window.location.reload();
			}
		});
	}

老版本如能提供正常的功能体验的情况下，建议在当次打开时继续使用老版本，或在页面顶部提醒用户避免突然的弹窗确认。

**Fact** ：如在 CACHE 项配置的任何一个资源浏览器在检索时服务器返回 404 或 500 时，此时整个 CACHE 配置将被忽略。浏览器会保证 CACHE 项的完整性，并在下次页面加载时重新拉取 manifest 文件继续按此原则检索资源，直到 CACHE 项中配置的资源全部可用时。

**Fact** ：在每次页面加载后，浏览器都会去检索当前页面的 manifest 文件是否可用，如服务器返回 404 或 500，所有已经被缓存在本地的离线资源都会被忽略。

**Fact** ：即使我们没有在 manifest 文件中加入当前包含 manifest 的页面地址，浏览器会默认把其添加到应用缓存。这意味着我们无需在 manifest 中列出每个网页地址，因为只要是用户访问的每个页面都包含 manifest 文件浏览器会隐式的将其添加进应用缓存中。

**Fact** ：Chrome 可以在地址中输入 chrome://appcache-internals/ 列出已经被浏览器缓存的网站，并可以查看所有网站的应用缓存占用空间，最后修改时间，还可直接对其进行删除。

**Fact** ：Firefox 对于请求返回头配置为 Cache-control: no-store 的资源一律不缓存，即使是显式配置在 manifest 文件中。

**Fact** ：当应用需要使用 appcache 时，Firefox 会在首次打开应用时询问用户是否授权使用。


### 参考资源

* AppCacheFacts Demo Site  &ndash; [Demo](http://appcachefacts.info/demo/)
* Open Web Camp IV presentation [Building Offline Web Applications with AppCache (2012)](http://appcachefacts.info/peterlubbers-owc4/index.html)
* Dive Into HTML5 &ndash; [Let's Take This Offline](http://diveintohtml5.info/offline.html)
* Google Code Blog &ndash; [Using AppCache to Launch Offline](http://googlecode.blogspot.com/2009/04/gmail-for-mobile-html5-series-using.html)
* HTML5 Rocks &ndash; [A Beginner's Guide to Using the Application Cache](http://www.html5rocks.com/tutorials/appcache/beginner/)
* MDN Doc Center &ndash; [Offline resources in Firefox](https://developer.mozilla.org/en/offline_resources_in_firefox)
* Safari Developer Library &ndash; [Storing Data on the Client](http://developer.apple.com/library/safari/#documentation/appleapplications/reference/SafariWebContent/Client-SideStorage/Client-SideStorage.html)
* Online validator, JSON(P) validation API, and TextMate bundle) &ndash; [Cache Manifest Validator](http://manifest-validator.com)
* A List Apart  &ndash; [Application Cache is a Douchebag](http://www.alistapart.com/articles/application-cache-is-a-douchebag/)


&copy; 2012 [Mark Christian](http://twitter.com/shinypb) &amp; [Dustin Diaz](http://twitter.com/ded). License: [CC Attribution 3.0](http://creativecommons.org/licenses/by/3.0/).