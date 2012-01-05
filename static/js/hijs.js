var prepareString = "a"[0] != "a";
// ES5 9.9
// http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError(); // TODO message
    }
    // If the implementation doesn't support by-index access of
    // string characters (ex. IE < 9), split the string
    if (prepareString && typeof o == "string" && o) {
        return o.split("");
    }
    return Object(o);
};

/**
 * Function: String.prototype.trim
 * 	ECMA-262-5 15.5.4.20
 * 	Trims whitespace from both ends of the string
 */
String.prototype.trim ||
(String.prototype.trim = function(){
    return this.replace(/^\s+/, "").replace(/\s+$/, "");
});
/**
 * Function: Array.prototype.forEach
 * 	ECMA-262-5 15.4.4.18
 * 	Calls a function for each element in the array.
 *
 * Parameters:
 * 	callbackfn - {Object}
 *	thisArg - {Object} {optional}
 */
Array.prototype.forEach ||
(Array.prototype.forEach = function(callbackfn, thisArg){
    if (!typeof callbackfn === "function")
        throw Error(callbackfn + " is not a function");
    // Pull out the length so that modifications to the length in the
    // loop will not affect the looping.
    var len = this.length;
    for (var i = 0; i < len; ++i) {
        var current = this[i];
        if (current !== undefined || i in this) {
            callbackfn.call(thisArg, current, i, this);
        }
    }
});


// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
Array.prototype.map || (Array.prototype.map = function map(fun /*, thisp*/) {
    var self = toObject(this),
        length = self.length >>> 0,
        result = Array(length),
        thisp = arguments[1];

    for (var i = 0; i < length; i++) {
        if (i in self)
            result[i] = fun.call(thisp, self[i], i, self);
    }
    return result;
});


(function (hijs) {
//
// hijs - JavaScript Syntax Highlighter
//
// Copyright (c) 2010 Alexis Sellier
//

// All elements which match this will be syntax highlighted.
    var selector = hijs || 'code';

    var keywords = ('var function if else for while break switch case do new null in with void '
        +'continue delete return this true false throw catch typeof with instanceof').split(' '),
        special  = ('eval window document undefined NaN Infinity parseInt parseFloat '
            +'encodeURI decodeURI encodeURIComponent decodeURIComponent').split(' ');

// Syntax definition
// The key becomes the class name of the <span>
// around the matched block of code.
    var syntax = [
        ['comment', /(\/\*(?:[^*\n]|\*+[^\/*])*\*+\/)/g],
        ['comment', /(\/\/[^\n]*)/g],
        ['string' , /("(?:(?!")[^\\\n]|\\.)*"|'(?:(?!')[^\\\n]|\\.)*')/g],
        ['regexp' , /(\/.+\/[mgi]*)(?!\s*\w)/g],
        ['class'  , /\b([A-Z][a-zA-Z]+)\b/g],
        ['number' , /\b([0-9]+(?:\.[0-9]+)?)\b/g],
        ['keyword', new(RegExp)('\\b(' + keywords.join('|') + ')\\b', 'g')],
        ['special', new(RegExp)('\\b(' + special.join('|') + ')\\b', 'g')]
    ];
    var nodes, table = {};

    if (/^[a-z]+$/.test(selector)) {
        nodes = document.getElementsByTagName(selector);
    } else if (/^\.[\w-]+$/.test(selector)) {
        nodes = document.getElementsByClassName(selector.slice(1));
    } else if (document.querySelectorAll) {
        nodes = document.querySelectorAll(selector);
    } else {
        nodes = [];
    }

    for (var i = 0, children; i < nodes.length; i++) {
        children = nodes[i].childNodes;

        for (var j = 0, str; j < children.length; j++) {
            code = children[j];

            if (code.length >= 0) { // It's a text node
                // Don't highlight command-line snippets
                if (! /^\$\s/.test(code.nodeValue.trim())) {
                    syntax.forEach(function (s) {
                        var k = s[0], v = s[1];
                        code.nodeValue = code.nodeValue.replace(v, function (_, m) {
                            return '\u00ab' + encode(k) + '\u00b7'
                                + encode(m) +
                                '\u00b7' + encode(k) + '\u00bb';
                        });
                    });
                }
            }
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].innerHTML =
            nodes[i].innerHTML.replace(/\u00ab(.+?)\u00b7(.+?)\u00b7\1\u00bb/g, function (_, name, value) {
                value = value.replace(/\u00ab[^\u00b7]+\u00b7/g, '').replace(/\u00b7[^\u00bb]+\u00bb/g, '');
                return '<span class="' + decode(name) + '">' + escape(decode(value)) + '</span>';
            });
    }

    function escape(str) {
        return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

// Encode ASCII characters to, and from Braille
    function encode (str, encoded) {
        table[encoded = str.split('').map(function (s) {
            if (s.charCodeAt(0) > 127) { return s }
            return String.fromCharCode(s.charCodeAt(0) + 0x2800);
        }).join('')] = str;
        return encoded;
    }
    function decode (str) {
        if (str in table) {
            return table[str];
        } else {
            return str.trim().split('').map(function (s) {
                if (s.charCodeAt(0) - 0x2800 > 127) { return s }
                return String.fromCharCode(s.charCodeAt(0) - 0x2800);
            }).join('');
        }
    }

})(window.hijs);