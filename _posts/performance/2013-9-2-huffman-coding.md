---
layout: post
category : performance
title:  数据压缩之哈夫曼编码
header: 数据压缩之哈夫曼编码
tagline:
tags : [数据压缩, 哈夫曼编码, Huffman, coding]
---
{% include JB/setup %}

读SPDY协议服务器侧实现源码，SPDY在通道复用的基础上也对HTTP Header进行了压缩，压缩算法是使用知名的zlib deflate压缩。而Deflate同时使用了LZ77算法与哈夫曼编码，鄙人知道哈夫曼编码是大学数据结构必考内容之一，所以先只抛哈夫曼编码来复习下（此处可拍砖），工作场景中无直接使用再加上记忆力无过人之处，学而时习之，不亦说(yuè)乎？

Google了一份来自宝岛台湾的[Flash动画](http://hsmaterial.moe.edu.tw/file/computer/7I05/class800/7I05/final/7i05_2_3/movies.swf)，简单易懂，方便复习。


## Ref
* [Zlib](http://www.zlib.net/feldspar.html)
* [spdy_protocol.h](http://src.chromium.org/viewvc/chrome/trunk/src/net/spdy/spdy_protocol.h)
* [A Methodology to Derive SPDY’s Initial Dictionary for Zlib Compression](http://www.eecis.udel.edu/~amer/PEL/poc/pdf/SPDY-Fan.pdf)