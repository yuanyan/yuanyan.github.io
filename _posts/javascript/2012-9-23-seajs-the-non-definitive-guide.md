---
layout: post
category : javascript
title:  seajs 非权威指南
header: seajs 非权威指南
tagline:
tags : [seajs, 模块加载器]
---
{% include JB/setup %}


requirejs 已经用了近一年的时间，真心好用。
seajs 是从最近半年才开始实践，与 requirejs 相较是更值得去推广的模块化方案。

一直致力于在前端模块化上布道中，也因此在两年前开始了 modulejs 的探索，至今未停止脚步。

## 迈出第一步

掀起seajs的盖头来:

```html
<script src="path/to/sea.js"></script>
<script>
seajs.use("main");
</script>
```

另一种方式：

```html
<script data-main="main" src="path/to/sea.js"></script>
```
seajs初始化时会自动去遍历查找seajs的script的data-main属性， data-main="main" 完全等同于 seajs.use("main");


## 配置

```javascript
seajs.config({
    base: ""
    ,alias: {}
    ,map: {}
    ,preload: []
    ,debug: true
    ,charset: 'utf-8'
});
```

base 默认值为 path/to/sea.js 的中 path/to 路径

## 别名配置

https://github.com/seajs/seajs/issues/258


## 那些你需要知道的配置约定

别名配置 {jquery: '1.7.2'}  会自动被转换为  {jquery: 'jquery/1.7.2/jquery'}，如果你的目录是 jquery/x.x.x/jquery 的结构, 配置上会
看上去清爽许多，对于不了解此约定的童鞋读配置时可能会一头雾水。

这是seajs默认的处理方式，目前从配置上还不允许关闭此处理，如果的你的真实jquery文件是 以版本号 1.7.2.js 格式命名的，可能就悲剧了。



## 配置map避免请求缓存

避免缓存的方案是在请求上加上时间戳，现在我们让所有的请求都加上时间戳：

```javascript
seajs.config({
    map: [
        [/^.*$/, function(url) {
            return url += (url.indexOf('?') === -1 ? '?' : '&') + 'ts=' + new Date；
        }]
    ]
})
```

seajs 提供一种快速配置的方式来避免缓存，原理与上面完全一致：

```javascript
seajs.config({
    debug : 2;
});
```

## 预加载

为了让IE6/7/8 支持 ES5 的一些API，我们会引入es5-shim来修补，而在这些古老的浏览器使用ES5 API必然需要预先加载好才可以继续执行。
通过preload 配置中的空字符串会被忽略掉这一约定，我们不仅可以预加载，还可以按特征检测来智能加载的，让高级浏览量无需额外的请求es-shim：

```javascript
seajs.config({
    alias:{
        'es5-shim': '//cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min'
    }
    ,preload:[Array.isArray ? '' : 'es5-shim']
})

seajs.use('main');
```

seajs 中并不是读取到有preload配置就立即加载的，只能是通过 seajs.use 这个入口来触发执行预加载, 如上示例 seajs 会在执行 main 模块前确保
预加载完 es-shim, 其他方式都无法保证 es5-shim 模块已经加载并执行好。


## 被加载的库没有用 define 包装怎么办?

很多童鞋说我依赖的库是放在公共CDN上的，我没有权限去修改或添加一个符合CMD规范的版本，
如我们引用的是 google cdn 上的jquery地址： //ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js

这时该怎么办，最简单粗暴的方式是拷贝到本地然后包装上一层，但CDN的优势也就随之放弃了。

seajs 虽然没有原生支持对非CMD规范文件的支持，但通过seajs.modify 与 preload 组合可以让非CMD的文件也可以被正确的 require 到：

```javascript
seajs.config({
    alias:{
        'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min'
    }
    ,preload:["jquery"]
})

seajs.modify('jquery', function (require, exports, module) {
     module.exports = jQuery;
});

seajs.use('main');
```

目前在seajs中如需使用 非CMD文件 preload 配置是必不可少。

## 开发ing


```javascript

// main.js
define(function(require){
    var $ = require('jquery');
    var _ = require('undersoce');
    var qplus = require('qplus');


});

```

## 开发很顺心，发布很揪心

一切都顺顺利利的开发完成，这是值得庆贺的，感谢党与人民，最后就只剩打包发布了，
我们知道前端发布的必要条件之一是压缩合并文件，seajs提供了SPM工具来打包CMD规范的文件。

但对与 MPA 与 SPA 需要不同的打包策略：

对于 SPA 单页面应用来说我们需要尽量减少请求，相比版本升级时即使公共部分没有改变也需重复下载未变改的部分，
打包为一个文件对第一次访问用户往往会更快些。


而对于 MPA 多页面应用我们的原则是尽量的分离公共部分与独立部分，如应用的A页面与B页面都分别使用了jquery，
但在发布时却把jquery分别打包在了a.js 与 b.js中，虽然请求数减少了，但却重复加载了公共的部分。


