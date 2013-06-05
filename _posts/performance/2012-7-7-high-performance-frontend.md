---
layout: post
category : performance
title:  高性能前端
header: 高性能前端
tagline:
tags : [performance, 前端, 性能]
---
{% include JB/setup %}

## 高性能 HTML

<h4>避免使用Iframe</h4>
<p>Iframe也叫内联frame，可以把一个HTML文档嵌入到另一个文档中。使用iframe的好处是被嵌入的文档可以完全独立于其父文档，凭借此特点我们通常可以使浏览器模拟多线程，需要注意的是使用iframe并不会增加同域名下的并行下载数，浏览器对同域名的连接总是共享浏览器级别的连接池，即使是跨窗口或跨标签页，这在所有主流浏览器都是如此。也因为这样这让iframe带来的好处大打折扣。</p>
<p><span id="more-1627"></span>在页面加载过程中iframe元素会阻塞父文档onload事件的触发，而开发者程序通常会在onload事件触发时初始化UI操作。例如，设置登录区域的焦点。因为用户习惯等待这一操作，所以尽可能的让onload事件触发从而使用户的等待时间变短是非常重要的。另外开发者会把一些重要的行为绑定在unload事件上，而不幸的是在一些浏览器中，只有当onload事件触发后unload事件才能触发，如果onload事件长时间未触发，而用户已经离开当前页面，那么unload事件也将永远得不到触发。<br>
那是否有方案可以让onload事件不被iframe阻塞吗？有个简单的解决方案来避免onload事件被阻塞，使用JavaScript动态的加载iframe元素或动态设置iframe的src属性：</p>
<pre> &lt;iframe id=iframe1 &gt;&lt;/iframe&gt;
 document.getElementById(‘iframe1’).setAttribute(‘src’， ‘url’);</pre>
<p>但其仅在高级浏览器 中有效，对于Internet Explorer 8及以下的浏览器无效。除此之外我们必须知道iframe是文档内最消耗资源的元素之一，在<a onclick="javascript:pageTracker._trackPageview('/outgoing/stevesouders.com/efws/costofelements.php');" href="http://stevesouders.com/efws/costofelements.php">Steve Souders 的测试中 </a>，在测试页面中分别加载100个A、DIV、SCRIPT、STYLE和 IFRAME元素，并且分别在Chrome、Firefox、Internet Explorer、Opera、Safari中运行了10次。结果显示创建iframe元素的开销比创建其他类型的DOM元素要高1~2个数量级。在测试中所有的DOM元素都是空的，如加载大的脚本或样式块可能比加载某些iframe元素耗时更长，但从基准测试结果来看，即使是空的iframe，其开销也是非常昂贵的，鉴于iframe的高开销，我们应尽量避免使用。尤其是对于移动设备，对于目前大部分还是只有有限的CPU与内存的情况下，更应避免使用iframe。</p>
<h4>避免空链接属性</h4>
<p>空的链接属性是指img、link、script、ifrrame元素的src或href属性被设置了，但是属性却为空。如&lt;img src=””&gt;，我们创建了一个图片，并且暂时设置图片的地址为空，希望在未来动态的去修改它。但是即使图片的地址为空，浏览器依旧会以默认的规则去请求空地址：</p>
<ol>
<li>Internet Explorer 8及以下版本浏览器只在img类型元素上出现问题，IE会把img的空地址解析为当前页面地址的目录地址。例如：如果当前页面地址为<a onclick="javascript:pageTracker._trackPageview('/outgoing/example.com/dir/page.html');" href="http://example.com/dir/page.html">http://example.com/dir/page.html</a>，IE会把空地址解析为<a onclick="javascript:pageTracker._trackPageview('/outgoing/example.com/dir/');" href="http://example.com/dir/">http://example.com/dir/</a>地址并请求。</li>
<li>早些版本的Webkit内核浏览器 与Firefox 会把空地址解析为当前页面的地址。如果页面内有多个空链接属性元素，当前页面的服务器则会被请求多次，增加服务器的负载。相较桌面浏览器对内核的更新升级较积极，这个问题在ios与android系统的移动浏览器上问题可能较严重。</li>
<li>幸运的是所有主流浏览器面对iframe的src属性为空时，会把空地址解析为about:blank地址，而不会向服务器发出额外的请求。</li>
</ol>
<h4>避免节点深层级嵌套</h4>
<p>深层级嵌套的节点在初始化构建时往往需要更多的内存占用，并且在遍历节点时也会更慢些，这与浏览器构建DOM文档的机制有关。例如下面HTML代码：</p>
<pre> &lt;html&gt;
 &lt;body&gt;
 &lt;p&gt;
 Hello World
 &lt;/p&gt;
 &lt;div&gt; &lt;img src="example.png"/&gt;&lt;/div&gt;
 &lt;/body&gt;
 &lt;/html&gt;</pre>
<p>通过浏览器HTML解析器的解析，浏览器会把整个HTML文档的结构存储为DOM树结构。当文档节点的嵌套层次越深，构建的DOM树层次也会越深。</p>
<h4>缩减HTML文档大小</h4>
<p>提高下载速度最显而易见的方式就是减少文件的大小，特别是压缩内嵌在HTML文档中的JavaScript和CSS代码，这能使得页面体积大幅精简。除此之外减少HTML文档大小还可以采取下面几种方法：</p>
<ol>
<li>删掉HTM文档对执行结果无影响的空格空行和注释</li>
<li>避免Table布局</li>
<li>使用HTML5</li>
</ol>
<h4>显式指定文档字符集</h4>
<p>HTML页面开始时指定字符集，有助于浏览器可以立即开始解析HTML代码。HTML文档通常被解析为一序列的带字符集编码信息的字符串通过internet传送。字符集编码在HTTP响应头中，或者HTML标记中指定。浏览器根据获得的字符集，把编码解析为可以显示在屏幕上的字符。如果浏览器不能获知页面的编码字符集，一般都会在执行脚本和渲染页面前，把字节流缓存，然后再搜索可进行解析的字符集，或以默认的字符集来解析页面代码，这会导致消耗不必要的时间。为了避免浏览器把时间花费在搜寻合适的字符集来进行解码，所以最好在文档中总是显式的指定页面字符集。</p>
<h4>显式设置图片的宽高</h4>
<p>当浏览器加载页面的HTML代码时，有时候需要在图片下载完成前就对页面布局进行定位。如果HTML里的图片没有指定尺寸（宽和高），或者代码描述的尺寸与实际图片的尺寸不符时，浏览器则要在图片下载完成后再“回溯”该图片并重新显示，这会消耗额外时间。所以，最好为页面里的每一张图片都指定尺寸，不管是在页面HTML里的&lt;img&gt;标签，还是在CSS里。</p>
<pre>&lt;img src="hello.png" width="400" height="300"&gt;</pre>
<h4>避免脚本阻塞加载</h4>
<p>当浏览器在解析常规的script标签时，它需要等待script下载完毕，再解析执行，而后续的HTML代码只能等待。为了避免阻塞加载，应把脚步放到文档的末尾，如把script标签插入在body结束标签之前：</p>
<pre> &lt;script src="example.js" &gt;&lt;/script&gt;
 &lt;/body&gt;</pre>


## 高性能 CSS

<h4 align="left">避免使用@import</h4>
<p align="left">有两种方式加载样式文件，一种是link元素，另一种是CSS 2.1加入@import。而在外部的CSS文件中使用@import会使得页面在加载时增加额外的延迟。虽然规则允许在样式中调用@import来导入其它的CSS，但浏览器不能并行下载样式，就会导致页面增添了额外的往返耗时。比如，第一个CSS文件first.css包含了以下内容：@import url(“second.css”)。那么浏览器就必须先把first.css下载、解析和执行后，才发现及处理第二个文件second.css。简单的解决方法是使用&lt;link&gt;标记来替代@import，比如下面的写法就能够并行下载CSS文件，从而加快页面加载速度：<span id="more-1629"></span></p>

    <link rel="stylesheet" href=""first.css"" />
    <link rel="stylesheet" href="second.css" />

<p align="left">需要注意的是一个页面中的CSS文件不宜过多，否则应该简化及合并外部的CSS文件以节省往返请求时间(RTT)提升页面加载速度。</p>
<h4 align="left">避免AlphaImageLoader滤镜</h4>
<p align="left">IE独有属性AlphaImageLoader用于修正7.0以下版本中显示PNG图片的半透明效果。这个滤镜的问题在于浏览器加载图片时它会终止内容的呈现并且冻结浏览器。在每一个元素（不仅仅是图片）它都会运算一次，增加了内存开支，因此它的问题是多方面的。完全避免使用AlphaImageLoader的最好方法就是使用PNG8格式来代替，这种格式能在IE中很好地工作。如果你确实需要使用AlphaImageLoader，请使用下划线_filter又使之对IE7以上版本的用户无效。</p>
<h4 align="left">避免CSS表达式</h4>
<p align="left">CSS表达式是动态设置CSS属性的强大（但危险）方法。Internet Explorer从第5个版本开始支持CSS表达式。下面的例子中，使用CSS表达式可以实现隔一个小时切换一次背景颜色：</p>

    background-color: expression((new Date()).getHours()%2?"#FFFFFF": "#000000" );

<p align="left">如上所示，expression中使用了JavaScript表达式。CSS属性根据JavaScript表达式的计算结果来设置。expression方法在其它浏览器中不起作用，因此在跨浏览器的设计中单独针对Internet Explorer设置时会比较有用。</p>
<p align="left">表达式的问题就在于它的计算频率要比我们想象的多。不仅仅是在页面显示和缩放时，就是在页面滚动、乃至移动鼠标时都会要重新计算一次。给CSS表达式增加一个计数器可以跟踪表达式的计算频率。在页面中随便移动鼠标都可以轻松达到10000次以上的计算量。一个减少CSS表达式计算次数的方法就是使用一次性的表达式，它在第一次运行时将结果赋给指定的样式属性，并用这个属性来代替CSS表达式。如果样式属性必须在页面周期内动态地改变，使用事件句柄来代替CSS表达式是一个可行办法。如果必须使用CSS表达式，一定要记住它们要计算成千上万次并且可能会对你页面的性能产生影响。</p>
<h4 align="left">避免通配选择器</h4>
<p align="left">CSS选择器对性能的影响源于浏览器匹配选择器和文档元素时所消耗的时间，所以优化选择器的原则是应尽量避免需要消耗更多匹配时间的选择器。而在这之前我们需要了解CSS选择器匹配的机制，如例子的子选择器规则：</p>

    #header > a {font-weight:blod;}

<p align="left">我们中的大多数人都是从左到右的阅读习惯，可能也会习惯性的设定浏览器也是从左到右的方式进行匹配规则，因为会推测这条规则的开销并不高。我们这样假象浏览器会像这样的方式工作：找到唯一的id为header为的元素，然后把这个样式规则应用到直系子元素中的a元素上。我们知道文档中只有一个id为header的元素，并且它只有几个a类型的子节点，所以这个CSS选择器应该相当高效。</p>
<p align="left">事实上，却恰好相反，CSS选择器是从右到左进行规则匹配。了解这个机制后，例子中看似高效的选择器在实际中的匹配开销是很高的，浏览器必须遍历页面中所有的a元素并且确定其父元素的id是否为header。</p>
<p align="left">如果把例子的子选择器改为后代选择器则会开销更多，在遍历页面中所有a元素后还需向其上级遍历直到根节点。</p>

    #header a {font-weight:blod;}

<p align="left">理解了CSS选择器从右到左匹配的机制后，可以理解选择器中最右边的规则往往决定了浏览器继续左移匹配的工作量，我们把最右边选择规则称之为关键选择器。</p>
<p align="left">通配选择器使用 * 符合表示，可匹配文档中的每一个元素。如下例规则将所有元素的字体大小设置为20px：</p>

    * { font-size:20px;}

<p align="left">通配选择器作用于所有的元素，如规则最右边为通配符：</p>

    .selected * {color: red;}

<p align="left">浏览器匹配文档中所有的元素后分别向上逐级匹配class为selected的元素，直到文档的根节点，因此其匹配开销是非常大的，通常比开销最小的ID选择器高出1~3个数量级，所以应避免使用关键选择器是通配选择器的规则。</p>
<h4 align="left">避免单规则的属性选择器</h4>
<p align="left">属性选择器根据元素的属性是否存在或其属性值进行匹配，如下例规则会把herf属性值等于”#index”的链接元素设置为红色：</p>

    .selected [href=”#index”] {color: red;}

<p align="left">但其匹配开销是非常大的，浏览器先匹配所有的元素，检查其是否有href属性并且herf属性值等于”#index”， 然后分别向上逐级匹配class为selected的元素，直到文档的根节点。所以应避免使用关键选择器是单规则属性选择器的规则。</p>
<h4 align="left">避免类正则的属性选择器</h4>
<p align="left">CSS3添加了复杂的属性选择器，可以通过类正则表达式的方式对元素的属性值进行匹配。当然这些类型的选择器定是会影响性能的，正则表达式匹配会比基于类别的匹配会慢很多。大部分情况下我们应尽量避免使用 *=， |=， ^=， $=， 和 ~=语法的属性选择器。</p>
<h4 align="left">移除无匹配的样式</h4>
<p align="left">移除无匹配的样式，有两个好处：</p>
<p align="left">第一，删除无用的样式后可以缩减样式文件的体积，加快资源下载速度；</p>
<p align="left">第二，对于浏览器而言，所有的样式规则的都会被解析后索引起来，即使是当前页面无匹配的规则。移除无匹配的规则，减少索引项，加快浏览器查找速度；</p>


## 高性能 JavaScript


<h4 align="left">使用事件代理</h4>
<p align="left">有时候我们会感觉到页面反应迟钝，这是因为DOM树元素中附加了过多的事件句柄并且些事件句病被频繁地触发。这就是为什么说使用事件代理是一种好方法了。如果你在一个div中有10个按钮，你只需要在div上附加一次事件句柄就可以了，而不用去为每一个按钮增加一个句柄。事件冒泡时你可以捕捉到事件并判断出是哪个事件发出的。</p>
<h4 align="left"><span id="more-1625"></span>缓存选择器查询结果</h4>
<p align="left">选择器查询是开销很大的方法。所以，使用选择器的次数应该越少越好，并且尽可能缓存选中的结果，便于以后反复使用。比如，下面这样的写法就是糟糕的写法：</p>
<pre>jQuery('#top').find('p.classA');
jQuery('#top').find('p.classB');</pre>
<p align="left">更好的写法是：</p>
<pre>var cached = jQuery('#top'); cached.find('p.classA'); cached.find('p.classB');</pre>
<h4 align="left">避免频繁的IO操作</h4>
<p align="left">对 cookie 与 localstorage 操作的API是同步的，且cookie与localstorage是多个tab页面间共享的，多页面同时操作时会存在同步加锁机制，建议应尽量少的对cookie或localStorage进行操作。</p>
<h4 align="left">避免频繁的DOM操作</h4>
<p align="left">使用JavaScript访问DOM元素是比较慢的，因此为了提升性能，应该做到：</p>
<ol>
<li>缓存已经查询过的元素；</li>
<li>线下更新完节点之后再将它们添加到文档树中；</li>
<li>避免使用JavaScript来修改页面布局；</li>
</ol>
<h4 align="left">使用微类库</h4>
<p align="left">通常开发者都会使用JavaScript类库，如jQuery、Mootools、YUI、Dojo等，但是开发者往往只是使用JavaScript类库中的部分功能。为了更大的提升性能，应尽量避免使用这类大而全的类库，而是按需使用微类库来辅助开发。</p>
