---
layout: post
category : html5
title:  慎用 requestAnimationFrame
header: 慎用 requestAnimationFrame
tagline:
tags : [HTML5, requestAnimationFrame]
---
{% include JB/setup %}

requestAnimationFrame 是什么？

* http://paulirish.com/2011/requestanimationframe-for-smart-animating/
* http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

一份对不同浏览器 requestAnimationFrame 实现规格化的polyfill：
	
	// requestAnimationFrame polyfill by Erik Möller
	// fixes from Paul Irish and Tino Zijdel
	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
									   || window[vendors[x]+'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}());


jQuery从1.6.0版本引入了requestAnimationFrame，但在1.6.3版本时又将其移除，并且至今到1.8.2版本仍未使用这一优化特性，其中的原因是否困惑了您？

jQuery 1.6.2：

	if ( t() && jQuery.timers.push(t) && !timerId ) {
		// Use requestAnimationFrame instead of setInterval if available
		if ( requestAnimationFrame ) {
			timerId = true;
			raf = function() {
				// When timerId gets set to null at any point, this stops
				if ( timerId ) {
					requestAnimationFrame( raf );
					fx.tick();
				}
			};
			requestAnimationFrame( raf );
		} else {
			timerId = setInterval( fx.tick, fx.interval );
		}
	}


jQuery 1.6.3 中已移除：

	if ( t() && jQuery.timers.push(t) && !timerId ) {
		timerId = setInterval( fx.tick, fx.interval );
	}




* [Animating with javascript: from setInterval to requestAnimationFrame](http://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/)
* [Please don't remove requestAnimationFrame!](http://forum.jquery.com/topic/please-don-t-remove-requestanimationframe)
* [Why doesn't jQuery use requestAnimationFrame?](http://stackoverflow.com/questions/7999680/why-doesnt-jquery-use-requestanimationframe)
* [http://jsfiddle.net/9RNzC/](http://jsfiddle.net/9RNzC/)
* [http://bugs.jquery.com/ticket/9381](http://bugs.jquery.com/ticket/9381)
* [requestAnimationFrame polyfill](https://gist.github.com/1579671)
