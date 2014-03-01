---
layout: post
category : solution
title:  停不下来的前端
header: 自动化流程
tagline:
tags : [Workflow, 前端自动化, 前端工具化]
---
{% include JB/setup %}

## 流程

关于流程，是从项目启动到发布的过程。在前端通常我们都做些什么？

1. 切图，即从设计稿中获取需要的素材，并不是所有前端开发都被要求切图，也不是所有前端开发都会切图，但请享受学习新知识的过程吧。
2. 创建模版（html、jade、haml）、脚本（javascript、coffeescript）、样式（css、less、sass、stylus）文件，搭建基础的项目骨架。
3. 文件（jade、coffeescript、less、sass...）编译
4. 执行测试用例
5. 代码检测
6. 移除调试代码
7. 静态资源合并与优化
8. 静态资源通过hash计算指纹化
9. 部署测试环境
10. 灰度发布现网

## 工具化

每个流程中的过程单元，我们抽象为一个Task，即任务。把可重复规则的过程进行工具化，如把JavaScript代码压缩过程工具化，而UglifyJS是具体执行任务的工具，CSS代码压缩器CleanCSS是具体执行任务的工具。

工具文化几乎是大平台互联网公司共有的特质，我们无法确定是工具文化驱动了Google、Facebook这类互联网公司的快速发展，还是快速发展的需要使其在内推广工具文化，但可以明确的是工具文化必不可少。在Facebook第二位中国籍工程师王淮的书中也提到提到：
当时招聘他进Facebook的总监黄易山，是对内部工具的最有力倡导者：
```
他极度建议，公司要把最好的人才放到工具开发那一块，因为工具做好了，可以达到事半功倍的效果，所有人的效率都可以得到提高，而不仅仅是工程师。
```
在腾讯，工具文化虽没有被明确指出，但大平台公司对工具化的坚持是一致的：凡是被不断重复的过程，将其工具化，绑定到自动化流程之中。技术产品也需要`Don’t make me think`的方式来推广最佳实践。总而言之：依靠工具，而不是经验。

## 自动化流程

任务工具化是自动化流程的基础，我想你已经听说过任务运行器Grunt。Grunt帮助开发者把任务单元建立连接，如代码编译Task执行完后执行检测Task，检测Task执行完后执行压缩Task。虽然Grunt是基于Node.js平台，但其定位是个通用任务管理器，通用往往意味着更高的学习与实施成本。专注于Web开发领域腾讯有Mod.js来实施前端自动化，通过Mod.js有效的简化Web开发自动化流程实施成本。

## 实施Mod.js

Mod.js并不是简单的任务运行器，其内置集成了Web前端开发常用的工具集，覆盖了80%的前端使用场景，而另外的20%则可通过Mod.js的插件机制来扩展。

### 相遇

Mod.js:[https://github.com/modjs/mod](https://github.com/modjs/mod) 可通过[NPM](https://npmjs.org/)来安装最新的版本, 在你来到[Node.js](http://nodejs.org/)的编程世界时已同时附带了NPM，当前Mod.js最新版本`0.4.x`要求Node.js要求`>= 0.8.0`：

```sh
$ npm install modjs -g
```

`-g` 参数表示把Mod.js安装到全局，如此`mod`命令将会在`system path`内，方便在任何一个目录启动Mod.js任务。

### 相识

Mod.js通过Modfile.js文件驱动任务执行，可以手动创建一个Modfile.js文件，也可以通过模版初始化一个Modfile.js文件：

```sh
$ mod init modfile
```

Modfile.js是一个Plain Node Module, 通过 `Runner` 对象来描述任务的具体执行过程：

```js
// 暴露Runner对象
module.exports = {}
```

如是异步配置，则可通过回调模式传递Runner对象：

```js
module.exports = function(options, done){
    setTimeout( function(){
        // 回调Runner对象
        var runner = {};
        done(runner);
    }, 1000)
}
```

借此一瞥通常`Runner`对象的全貌：

```js
module.exports = {
    version: ">=0.4.3",
    plugins: {
        pngcompressor : "mod-png-compressor",
        compress      : "grunt-contrib-compress"
    },
    tasks: {
        asset: "asset",
        online: "online_dist",
        offline: "offline_dist",
        offlinePackage: "{{offline}}/package.zip",
        rm: {
            online: {
                dest: "{{online}}"
            },
            offline: {
                dest: "{{offline}}"
            }
        },
        replace: {
            src: './js/**/*.js',
            search: "@VERSION",
            replace: require('./package.json').version
        },
        build: {
            options: {
                src: ["*.html"]
            },
            online: {
                dest: "{{online}}",
                rev: true
            },
            offline: {
                dest: "{{offline}}",
                rev: false
            }
        },
        cp: {
            options: {
                src: ["./img/**"]
            },
            online: {
                dest: "{{online}}/img/",
                rev: true
            },
            offline: {
                dest: "{{offline}}/img/",
                rev: false
            }
        },
        pngcompressor: {
            src: "./img/**/*.png"
        },
        compress: {
            dist: {
                options: {
                    archive: '{{offlinePackage}}'
                },
                // includes files in path
                files: [
                    {
                        expand: true,
                        cwd: '{{online}}/',
                        src: ['*.html'],
                        dest: 'qq.com/web'
                    },
                    {
                        expand: true,
                        cwd: '{{online}}/img',
                        src: ['**'],
                        dest: 'cdn.qq.com/img'

                    }
                ]
            }
        }
    },
    targets: {
        default: ["rm", "pngcompressor", "replace", "build", "cp"],
        offline: ["default", "compress:dist"]
    }
}
```

* `version` 描述依赖的Mod.js版本
* `plugins` 描述依赖的插件，支持Mod.js插件与Grunt插件
* `tasks`   描述不同类别任务的执行
* `targets` 描述不同组合的目标，目标是需执行任务的集合

Mod.js的配置项追究极简易懂，即使不懂JavaScript语法也能看懂配置与修改配置。

### 相知

在执行mod命令时，Mod.js会在当前目录下查找是否存在Modfile.js文件。当找到Modfile.js文件时，Mod.js将读取Modfile.js里的配置信息，如识别到有配置Mod.js插件，会自动安装没有安装过的插件，插件不仅可以是发布到NPM的包，也可以是存在本地的自定义任务。
Mod.js加载插件的方式是通过Node的require机制，然后执行暴露的exports.run，这与Mod.js内置任务的完全一样的机制。

在命令行下，通常执行mod时是需指定Modfile.js中某一特定目标，但当存在命名为default的目标或配置中只有一个独立目标时，此时目标的指定是可选的，Mod.js会自动识别唯一的存在或default的目标：

```sh
targets: {
    dist: ["rm", "cp"]
}
```

```sh
# 等价于 mod dist
$ mod
```

配置有default目标的场景：

```sh
targets: {
    default: ["rm", "cp"],
    other: ["compress"]
}
```

```sh
# 等价于 mod default
$ mod
```

#### 深入任务

任务是具体执行的类别，从配置示例开始阐述：

```js
tasks: {
    min: {
        src: "./js/*.js"
    }
}
```

以上配置了一个文件压缩的`min`类别任务，`src`描述需要压缩的文件：`js`目录的所有js文件。`src`支持unix `glob`语法来描述输入文件集，其匹配规则如下：

匹配符：
* "*" 匹配0个或多个字符
* "?" 匹配单个字符
* "！" 匹配除此之外的字符
* "[]" 匹配指定范围内的字符，如：[0-9]匹配数字0-9 [a-z]配置字母a-z
* "{x,y}" 匹配指定组中某项，如 a{d,c,b}e 匹配 ade ace abe

示例：
```sh
c/ab.min.js =>  c/ab.min.js
*.js        =>  a.js b.js c.js
c/a*.js     =>  c/a.js  c/ab.js c/ab.min.js
c/[a-z].js  =>  c/a.js c/b.js c/c.js
c/[!abe].js =>  c/c.js c/d.js
c/a?.js     =>  c/ab.js c/ac.js
c/ab???.js  =>  c/abdef.js c/abccc.js
c/[bdz].js  =>  c/b.js c/d.js c/z.js
{a,b,c}.js  =>  a.js b.js c.js
a{b,c{d,e}}x{y,z}.js  => abxy.js abxz.js  acdxy.js acdxz.js acexy.js acexz.js
```

更多任务配置规则深入:[https://github.com/modjs/mod/blob/master/doc/tutorial/configuring-tasks.md](https://github.com/modjs/mod/blob/master/doc/tutorial/configuring-tasks.md)

如任务没有配置`dest`，默认在输入文件同级目录下输出`.min`后缀的文件：

```
uglifyjs Minifying ./js/unminify.js -> js/unminify.min.js
uglifyjs Original size: 1,393. Minified size: 449. Savings: 944 (210.24%)
```

内置的`min`任务支持三种文件类别的压缩，JavaScript、CSS与HTML，是对`uglifyjs`、`cleancss`与`htmlminfier`任务的代理。`min`通过识别文件后缀进行具体任务的分发。所以`min`任务的`src`选项需指定具体的后缀。通常每个不同类别的任务都支持`src`与`dest`，且Mod.js会结合实际项目中常见的场景，`dest`往往都是可选的，如上`min`任务默认的`dest`是在当前目录下输出待`.min`后缀的文件，同时后缀名是支持通常`suffix`选项配置的。

每个内置任务支持的所有参数选项可通过`Mod.js`的在线文档查看：[https://github.com/modjs/mod/tree/master/doc](https://github.com/modjs/mod/tree/master/doc)
同时有丰富的演示项目来辅助不同任务的配置：

* [合并JS文件](https://github.com/modjs/mod/tree/master/example/catjs)
* [合并CSS文件，自动合并import文件](https://github.com/modjs/mod/tree/master/example/catcss)
* [AMD模块文件编译](https://github.com/modjs/mod/tree/master/example/compileamd)
* [CMD模块文件编译](https://github.com/modjs/mod/tree/master/example/compilecmd)
* [多页面项目中AMD模块编译](https://github.com/modjs/mod/tree/master/example/compilemultipage)
* [JS文件条件编译](https://github.com/modjs/mod/tree/master/example/compilejs)
* [CSS文件条件编译](https://github.com/modjs/mod/tree/master/example/compilecss)
* [HTML文件条件编译](https://github.com/modjs/mod/tree/master/example/compilehtml)
* [JS文件压缩](https://github.com/modjs/mod/tree/master/example/minjs)
* [CSS文件压缩](https://github.com/modjs/mod/tree/master/example/mincss)
* [HTML文件压缩](https://github.com/modjs/mod/tree/master/example/minhtml)
* [代码移除，如alert、console](https://github.com/modjs/mod/tree/master/example/stripcode)
* [文件EOL移除](https://github.com/modjs/mod/tree/master/example/stripeol)
* [文件Tab移除](https://github.com/modjs/mod/tree/master/example/striptab)
* [图片DataURI](https://github.com/modjs/mod/tree/master/example/datauri)
* [创建目录](https://github.com/modjs/mod/tree/master/example/mkdir)
* [复制文件或目录](https://github.com/modjs/mod/tree/master/example/cp)
* [规则替换，如版本号累加](https://github.com/modjs/mod/tree/master/example/replace)

#### 不可或缺的插件机制

Mod.js支持2种生态的插件：Mod.js 与 Grunt。插件的配置同样是在Runner对象下：

```js
plugins: {
    // Mod.js NPM 插件
    sprite: "mod-stylus",
    // Mod.js 本地插件
    mytask: "./tasks/mytask"
    // Grunt NPM 插件
    compress: "grunt-contrib-compress"
}
```
同样附上演示项目来辅助不同插件的配置：

* [Mod.js NPM 插件: mod-stylus](https://github.com/modjs/mod/tree/master/example/pluginnpmtask)
* [Mod.js 本地插件: mytask.js](https://github.com/modjs/mod/tree/master/example/pluginlocaltask)
* [Grunt NPM 插件: grunt-contrib-concat](https://github.com/modjs/mod/tree/master/example/plugingrunttask)

如插件未安装在项目目录下或与Mod.js同级的全局目录下，Mod.js会自动通过NPM安装配置的插件。什么情况需要手动把插件安装在全局下？在实际项目开发中我们往往会对同一项目拉不同的分支进行开发，他们依赖的插件版本是相同的，此时如果在不同分支都安装一个冗余的插件版本项目是多余的，所以当你确定这是个插件是共享的，可以手动通过`npm install -g mod-stylus`来安装到全局。同时项目目录中插件版本权重永远是高于全局的，如需避免加载全局的版本，只需手动在项目安装即可。

限于篇幅，更多插件相关说明可访问以下主题页面：
* [创建插件](https://github.com/modjs/mod/tree/master/doc/tutorial/creating-plugins.md)
* [API文档](https://github.com/modjs/mod/tree/master/doc/api)

#### 零配置快速项目构建

虽说是零配置构建项目，不如称之为基于DOM的项目构建，这个主题的内容与我之前在[Qing](https://github.com/AlloyTeam/Qing)项目中讨论的主题的一致的，在此只附上示例：

* [普通项目构建](https://github.com/modjs/mod/tree/master/example/buildnormal)
* [移动项目构建](https://github.com/modjs/mod/tree/master/example/buildmobile)
* [RequireJS项目构建](https://github.com/modjs/mod/tree/master/example/buildrequirejs)

另外免配置文件对Sea.js 2.1+项目的支持正在开发中，会下Mod.js的下一迭代中支持。

## 服务化

了解完如何实施Mod.js进行自动化时，仅是停留在工具的层面，如何将其进一步的提升？了解一个事实，服务优于工具。如何将其封装成服务，用户无需安装Mod.js，无需执行命令，只需做一次事情：提交代码，中间的过程无需关注，最终把持续构建的结果反馈给用户。这是下一步需要去完善的，建立接入机制，让工具以服务的形式完全融入流程中。
