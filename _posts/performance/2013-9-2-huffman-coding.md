---
layout: post
category : performance
title:  数据压缩之哈夫曼编码
header: 数据压缩之哈夫曼编码
tagline:
tags : [数据压缩, 哈夫曼编码, Huffman, coding]
---
{% include JB/setup %}

读Chrome浏览器中SPDY实现部分源码，其中Header压缩时涉及zlib deflate压缩。而Deflate同时使用了LZ77算法与哈夫曼编码，鄙人知道哈夫曼编码是大学数据结构必考内容之一，所以先只抛哈夫曼编码来复习下（此处可拍砖），工作场景中无直接使用再加上记忆力无过人之处，学而时习之，不亦说(yuè)乎？

Google了一份来自宝岛台湾的Flash动画，简单易懂，方便复习。

<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="800" height="600">
  <param name="movie" value="http://hsmaterial.moe.edu.tw/file/computer/7I05/class800/7I05/final/7i05_2_3/movies.swf">
  <param name="quality" value="high">
  <embed src="player.swf" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="800" height="600"></embed>
</object>
</body>

## Ref
* http://www.zlib.net/feldspar.html
* http://src.chromium.org/viewvc/chrome/trunk/src/net/spdy/spdy_protocol.h