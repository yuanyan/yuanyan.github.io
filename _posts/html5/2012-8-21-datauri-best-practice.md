---
layout: post
category : html5
title:  Data URI 最佳实践
header:  Data URI 最佳实践
tagline:
tags: [Data URI, css]
---
{% include JB/setup %}

## 写在文章之前

业内常会有 Data URI 的利与弊、用与不用的讨论， 如此对于 Data URI 的认识也可更全面，这无可非议。但着眼计算机软硬件与网络带宽的发展，前端HTML5技术的风靡全球，是否考虑重新去审视下自己的技术方案？
老的技术方案固然可用，老的浏览器短期内固然需要去兼容，但新技术已箭在弦上，新的浏览器用户数日渐庞大，这早已不是发与不发，何时发的问题。难道我们不应该让高级浏览器用户群享受更好的用户体验吗？
细想对于图片优化技术中的常采用的 Sprites （雪碧图、精灵图）技术，[又何尝不是有内存的问题](http://blog.vlad1.com/2009/06/22/to-sprite-or-not-to-sprite/)？在不存在完美方案的现实下，新技术带来的性能提升，操作便利性难道不是更吸引你吗？

## Data URI 科普

笔者对本文的定位是实践操作型，所以一些理论基础只点到为止。首先 Data URI 是什么？ 引用 [Wikipedia](http://en.wikipedia.org/wiki/Data_URI_scheme) 上对其的解释：

    Data URI 是一种提供让外置资源的直接内嵌在页面中的方案。这种技术允许我们只需单次 HTTP 请求即可获取所有需要引用的图片与样式资源，
    并因无需多次请求资源而变的高效。

在 RFC2397（http://tools.ietf.org/html/rfc2397）中定义了它格式规范：

    data:[<mime type>][;charset=<charset>][;base64],<encoded data>

## Data URI 初探

看格式规范貌似不是很友好，我们以内嵌图片为例：

    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA
    AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
    9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot">

**data:image/png;base64,** 是固定的格式, image/png 是图片的MIME类型，base64是数据编码方式。这里还有必要指出下
[Base64](http://zh.wikipedia.org/wiki/Base64) 编码后的数据会比原始数据大 4/3 左右，这与Base64 编码算法有关。
如需使用在电子邮件中，根据 RFC 822 规定，每 76 个字符，还需要加上一个回车换行，此时编码后数据长度大约为原长的135.1%。

为验证理论的我们做如下的测试，分别对不同尺寸的图片进行Base64编码，与我们的预期一致，比原始数据增长了 1/3 ：
```
    图片尺寸 | 原始大小 | Base64大小 | 增长率 |
    :-----------|:------------|:-------------|:-------------|
    16*16 | 618 | 824 | 34.2%
    24*24 | 1,063 | 1,420 | 33.6%
    32*32 | 1,615 | 2,156 | 33.5%
    42*42 | 2,510 | 3,348 | 33.4%
    48*48 | 2,892 | 3,856 | 33.3%
    96*96 | 8,217 | 10,956 | 33.3%
    350*350 | 49,899 | 66,532 | 33.3%
```
图片是使用 Data URI 最常用的情景，但 Data URI 是与资源类型无关的规范，您也可以使用 Data URI 内嵌其他资源:

    var cvs = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var html = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

## Data URI 兼容性

在前端，浏览器兼容性几乎每个技术都逃不过的话题，检阅 Data URI 的兼容性：

* Firefox 2+
* Opera 7.2+
* Chrome++
* Safari++
* Internet Explorer 8+

大部分主流浏览器都早已支持 Data URI，IE8 虽支持但其最大长度不能超过32K的数据，在 IE9 下已解除此限制，IE 详细的文档可细读[微软官方文档](http://msdn.microsoft.com/en-us/library/cc848897(VS.85).aspx)。
剩下的依旧是面对在国内还是 A 类浏览量的 IE 6/7， 我们可以采用与 Data URI 类似的 [MHTML](http://en.wikipedia.org/wiki/MHTML) （笔者认为其设计上比 Data URI 是更优秀的，考虑到了内嵌数据的重用）.
MHTML 详细的介绍不在本文的讨论范围，但需要指出的是微软在 2011 年发布了 [MHTML 中的漏洞可能允许信息泄露](http://technet.microsoft.com/zh-CN/security/advisory/2501696) 的补丁，
将造成 MHTML 无法被引用的问题，所以在 IE 中使用 MHTML 的方案会有极大的风险，权且当扩展知识面不推荐采用。

* http://technet.microsoft.com/zh-CN/security/advisory/2501696
* http://www.microsoft.com/china/security/bulletins/ms03-014.mspx

## Data URI 最佳实践

在 Data URI 转换之前我们不进行图片合并，而是直接使用小图片，如此省去了合图定位的麻烦，

    background-image:url("data:image/png;base64,iVBORw0KGgoAAA...ElFTkSuQmCC");
    *background-image:url(http://cdn.example.com/foo.gif);

比较数据：
```
    图片尺寸 | 原始大小 | Base64大小 | Gzip大小 |  Gzip压缩率 | 增长率 |
    :-----------|:------------|:-------------|:-------------|:-------------|:-------------|
    16*16 | 618 | 824 | 668 | 81.1% | 108.8%
    24*24 | 1,063 | 1,420 | 1,119 | 78.8% | 5.3%
    32*32 | 1,615 | 2,156 | 1,670 | 77.5% | 3.9%
    42*42 | 2,510 | 3,348 | 2,568 | 76.7% | 2.3%
    48*48 | 2,892 | 3,856 |  2940 | 76.2% | 1.7%
    96*96 | 8,217 | 10,956 | 8304 | 75.8% | 1.1%
    350*350 | 49,899 | 66,532 | 50,095 | 75.3% | 0.4%
```
## DIY 生成工具

Node 是名副其实的前端开发得力助手，只用3行代码就能让一张图片转换成Base64编码：

    var body = fs.readFileSync('./foo.png', 'binary');  // 输入
    var image = new Buffer(body, 'binary').toString('base64'); // base64编码
    var base64 = 'data:image/png;base64,' + image;  // 输出

Datauri 格式数据需要更多CPU计算来呈现图片，也许在性能稍弱的PC上，额外请求图片的方案可能更早的渲染出图片，尤其在移动端有限CPU的情景下，一定要慎用。

这里折中方案是限定转换的条件，只有小于 2K 的小图才被转换成Base64编码， 2K 是比较推荐的阀值。


## 参考

* [Data URIs explained](http://www.nczonline.net/blog/2009/10/27/data-uris-explained/)
* [Data URI&MHTML: 用还是不用？](http://www.99css.com/archives/492)