(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();
/*! jQuery v3.2.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(a,b){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){"use strict";var c=[],d=a.document,e=Object.getPrototypeOf,f=c.slice,g=c.concat,h=c.push,i=c.indexOf,j={},k=j.toString,l=j.hasOwnProperty,m=l.toString,n=m.call(Object),o={};function p(a,b){b=b||d;var c=b.createElement("script");c.text=a,b.head.appendChild(c).parentNode.removeChild(c)}var q="3.2.1",r=function(a,b){return new r.fn.init(a,b)},s=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,t=/^-ms-/,u=/-([a-z])/g,v=function(a,b){return b.toUpperCase()};r.fn=r.prototype={jquery:q,constructor:r,length:0,toArray:function(){return f.call(this)},get:function(a){return null==a?f.call(this):a<0?this[a+this.length]:this[a]},pushStack:function(a){var b=r.merge(this.constructor(),a);return b.prevObject=this,b},each:function(a){return r.each(this,a)},map:function(a){return this.pushStack(r.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(f.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(a<0?b:0);return this.pushStack(c>=0&&c<b?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:h,sort:c.sort,splice:c.splice},r.extend=r.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||r.isFunction(g)||(g={}),h===i&&(g=this,h--);h<i;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(r.isPlainObject(d)||(e=Array.isArray(d)))?(e?(e=!1,f=c&&Array.isArray(c)?c:[]):f=c&&r.isPlainObject(c)?c:{},g[b]=r.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},r.extend({expando:"jQuery"+(q+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===r.type(a)},isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=r.type(a);return("number"===b||"string"===b)&&!isNaN(a-parseFloat(a))},isPlainObject:function(a){var b,c;return!(!a||"[object Object]"!==k.call(a))&&(!(b=e(a))||(c=l.call(b,"constructor")&&b.constructor,"function"==typeof c&&m.call(c)===n))},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?j[k.call(a)]||"object":typeof a},globalEval:function(a){p(a)},camelCase:function(a){return a.replace(t,"ms-").replace(u,v)},each:function(a,b){var c,d=0;if(w(a)){for(c=a.length;d<c;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(s,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(w(Object(a))?r.merge(c,"string"==typeof a?[a]:a):h.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:i.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;d<c;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;f<g;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,f=0,h=[];if(w(a))for(d=a.length;f<d;f++)e=b(a[f],f,c),null!=e&&h.push(e);else for(f in a)e=b(a[f],f,c),null!=e&&h.push(e);return g.apply([],h)},guid:1,proxy:function(a,b){var c,d,e;if("string"==typeof b&&(c=a[b],b=a,a=c),r.isFunction(a))return d=f.call(arguments,2),e=function(){return a.apply(b||this,d.concat(f.call(arguments)))},e.guid=a.guid=a.guid||r.guid++,e},now:Date.now,support:o}),"function"==typeof Symbol&&(r.fn[Symbol.iterator]=c[Symbol.iterator]),r.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){j["[object "+b+"]"]=b.toLowerCase()});function w(a){var b=!!a&&"length"in a&&a.length,c=r.type(a);return"function"!==c&&!r.isWindow(a)&&("array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a)}var x=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:d<0?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ca=function(a,b){return b?"\0"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0&&("form"in a||"label"in a)},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"form"in b?b.parentNode&&b.disabled===!1?"label"in b?"label"in b.parentNode?b.parentNode.disabled===a:b.disabled===a:b.isDisabled===a||b.isDisabled!==!a&&ea(b)===a:b.disabled===a:"label"in b&&b.disabled===a}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return!!b&&"HTML"!==b.nodeName},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}}):(d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}},d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c,d,e,f=b.getElementById(a);if(f){if(c=f.getAttributeNode("id"),c&&c.value===a)return[f];e=b.getElementsByName(a),d=0;while(f=e[d++])if(c=f.getAttributeNode("id"),c&&c.value===a)return[f]}return[]}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){if("undefined"!=typeof b.getElementsByClassName&&p)return b.getElementsByClassName(a)},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:!b||(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b&&(e===c||e.slice(0,c.length+1)===c+"-"))}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[c<0?c+b:c]}),even:pa(function(a,b){for(var c=0;c<b;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;c<b;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=c<0?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=c<0?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=Q.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";b<c;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e);return!1}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}return!1}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;d<e;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;h<i;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];i<f;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;e<f;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,i<e&&ya(a.slice(i,e)),e<f&&ya(a=a.slice(e)),e<f&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,c,e){var f,i,j,k,l,m="function"==typeof a&&a,n=!e&&g(a=m.selector||a);if(c=c||[],1===n.length){if(i=n[0]=n[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&9===b.nodeType&&p&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(_,aa),b)||[])[0],!b)return c;m&&(b=b.parentNode),a=a.slice(i.shift().value.length)}f=V.needsContext.test(a)?0:i.length;while(f--){if(j=i[f],d.relative[k=j.type])break;if((l=d.find[k])&&(e=l(j.matches[0].replace(_,aa),$.test(i[0].type)&&qa(b.parentNode)||b))){if(i.splice(f,1),a=e.length&&sa(i),!a)return G.apply(c,e),c;break}}}return(m||h(a,n))(e,b,!p,c,!b||$.test(a)&&qa(b.parentNode)||b),c},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){if(!c)return a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){if(!c&&"input"===a.nodeName.toLowerCase())return a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;if(!c)return a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);r.find=x,r.expr=x.selectors,r.expr[":"]=r.expr.pseudos,r.uniqueSort=r.unique=x.uniqueSort,r.text=x.getText,r.isXMLDoc=x.isXML,r.contains=x.contains,r.escapeSelector=x.escape;var y=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&r(a).is(c))break;d.push(a)}return d},z=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},A=r.expr.match.needsContext;function B(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()}var C=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,D=/^.[^:#\[\.,]*$/;function E(a,b,c){return r.isFunction(b)?r.grep(a,function(a,d){return!!b.call(a,d,a)!==c}):b.nodeType?r.grep(a,function(a){return a===b!==c}):"string"!=typeof b?r.grep(a,function(a){return i.call(b,a)>-1!==c}):D.test(b)?r.filter(b,a,c):(b=r.filter(b,a),r.grep(a,function(a){return i.call(b,a)>-1!==c&&1===a.nodeType}))}r.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?r.find.matchesSelector(d,a)?[d]:[]:r.find.matches(a,r.grep(b,function(a){return 1===a.nodeType}))},r.fn.extend({find:function(a){var b,c,d=this.length,e=this;if("string"!=typeof a)return this.pushStack(r(a).filter(function(){for(b=0;b<d;b++)if(r.contains(e[b],this))return!0}));for(c=this.pushStack([]),b=0;b<d;b++)r.find(a,e[b],c);return d>1?r.uniqueSort(c):c},filter:function(a){return this.pushStack(E(this,a||[],!1))},not:function(a){return this.pushStack(E(this,a||[],!0))},is:function(a){return!!E(this,"string"==typeof a&&A.test(a)?r(a):a||[],!1).length}});var F,G=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,H=r.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||F,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:G.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof r?b[0]:b,r.merge(this,r.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),C.test(e[1])&&r.isPlainObject(b))for(e in b)r.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&(this[0]=f,this.length=1),this}return a.nodeType?(this[0]=a,this.length=1,this):r.isFunction(a)?void 0!==c.ready?c.ready(a):a(r):r.makeArray(a,this)};H.prototype=r.fn,F=r(d);var I=/^(?:parents|prev(?:Until|All))/,J={children:!0,contents:!0,next:!0,prev:!0};r.fn.extend({has:function(a){var b=r(a,this),c=b.length;return this.filter(function(){for(var a=0;a<c;a++)if(r.contains(this,b[a]))return!0})},closest:function(a,b){var c,d=0,e=this.length,f=[],g="string"!=typeof a&&r(a);if(!A.test(a))for(;d<e;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&r.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?r.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?i.call(r(a),this[0]):i.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(r.uniqueSort(r.merge(this.get(),r(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function K(a,b){while((a=a[b])&&1!==a.nodeType);return a}r.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return y(a,"parentNode")},parentsUntil:function(a,b,c){return y(a,"parentNode",c)},next:function(a){return K(a,"nextSibling")},prev:function(a){return K(a,"previousSibling")},nextAll:function(a){return y(a,"nextSibling")},prevAll:function(a){return y(a,"previousSibling")},nextUntil:function(a,b,c){return y(a,"nextSibling",c)},prevUntil:function(a,b,c){return y(a,"previousSibling",c)},siblings:function(a){return z((a.parentNode||{}).firstChild,a)},children:function(a){return z(a.firstChild)},contents:function(a){return B(a,"iframe")?a.contentDocument:(B(a,"template")&&(a=a.content||a),r.merge([],a.childNodes))}},function(a,b){r.fn[a]=function(c,d){var e=r.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=r.filter(d,e)),this.length>1&&(J[a]||r.uniqueSort(e),I.test(a)&&e.reverse()),this.pushStack(e)}});var L=/[^\x20\t\r\n\f]+/g;function M(a){var b={};return r.each(a.match(L)||[],function(a,c){b[c]=!0}),b}r.Callbacks=function(a){a="string"==typeof a?M(a):r.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=e||a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){r.each(b,function(b,c){r.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==r.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return r.each(arguments,function(a,b){var c;while((c=r.inArray(b,f,c))>-1)f.splice(c,1),c<=h&&h--}),this},has:function(a){return a?r.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||b||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j};function N(a){return a}function O(a){throw a}function P(a,b,c,d){var e;try{a&&r.isFunction(e=a.promise)?e.call(a).done(b).fail(c):a&&r.isFunction(e=a.then)?e.call(a,b,c):b.apply(void 0,[a].slice(d))}catch(a){c.apply(void 0,[a])}}r.extend({Deferred:function(b){var c=[["notify","progress",r.Callbacks("memory"),r.Callbacks("memory"),2],["resolve","done",r.Callbacks("once memory"),r.Callbacks("once memory"),0,"resolved"],["reject","fail",r.Callbacks("once memory"),r.Callbacks("once memory"),1,"rejected"]],d="pending",e={state:function(){return d},always:function(){return f.done(arguments).fail(arguments),this},"catch":function(a){return e.then(null,a)},pipe:function(){var a=arguments;return r.Deferred(function(b){r.each(c,function(c,d){var e=r.isFunction(a[d[4]])&&a[d[4]];f[d[1]](function(){var a=e&&e.apply(this,arguments);a&&r.isFunction(a.promise)?a.promise().progress(b.notify).done(b.resolve).fail(b.reject):b[d[0]+"With"](this,e?[a]:arguments)})}),a=null}).promise()},then:function(b,d,e){var f=0;function g(b,c,d,e){return function(){var h=this,i=arguments,j=function(){var a,j;if(!(b<f)){if(a=d.apply(h,i),a===c.promise())throw new TypeError("Thenable self-resolution");j=a&&("object"==typeof a||"function"==typeof a)&&a.then,r.isFunction(j)?e?j.call(a,g(f,c,N,e),g(f,c,O,e)):(f++,j.call(a,g(f,c,N,e),g(f,c,O,e),g(f,c,N,c.notifyWith))):(d!==N&&(h=void 0,i=[a]),(e||c.resolveWith)(h,i))}},k=e?j:function(){try{j()}catch(a){r.Deferred.exceptionHook&&r.Deferred.exceptionHook(a,k.stackTrace),b+1>=f&&(d!==O&&(h=void 0,i=[a]),c.rejectWith(h,i))}};b?k():(r.Deferred.getStackHook&&(k.stackTrace=r.Deferred.getStackHook()),a.setTimeout(k))}}return r.Deferred(function(a){c[0][3].add(g(0,a,r.isFunction(e)?e:N,a.notifyWith)),c[1][3].add(g(0,a,r.isFunction(b)?b:N)),c[2][3].add(g(0,a,r.isFunction(d)?d:O))}).promise()},promise:function(a){return null!=a?r.extend(a,e):e}},f={};return r.each(c,function(a,b){var g=b[2],h=b[5];e[b[1]]=g.add,h&&g.add(function(){d=h},c[3-a][2].disable,c[0][2].lock),g.add(b[3].fire),f[b[0]]=function(){return f[b[0]+"With"](this===f?void 0:this,arguments),this},f[b[0]+"With"]=g.fireWith}),e.promise(f),b&&b.call(f,f),f},when:function(a){var b=arguments.length,c=b,d=Array(c),e=f.call(arguments),g=r.Deferred(),h=function(a){return function(c){d[a]=this,e[a]=arguments.length>1?f.call(arguments):c,--b||g.resolveWith(d,e)}};if(b<=1&&(P(a,g.done(h(c)).resolve,g.reject,!b),"pending"===g.state()||r.isFunction(e[c]&&e[c].then)))return g.then();while(c--)P(e[c],h(c),g.reject);return g.promise()}});var Q=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;r.Deferred.exceptionHook=function(b,c){a.console&&a.console.warn&&b&&Q.test(b.name)&&a.console.warn("jQuery.Deferred exception: "+b.message,b.stack,c)},r.readyException=function(b){a.setTimeout(function(){throw b})};var R=r.Deferred();r.fn.ready=function(a){return R.then(a)["catch"](function(a){r.readyException(a)}),this},r.extend({isReady:!1,readyWait:1,ready:function(a){(a===!0?--r.readyWait:r.isReady)||(r.isReady=!0,a!==!0&&--r.readyWait>0||R.resolveWith(d,[r]))}}),r.ready.then=R.then;function S(){d.removeEventListener("DOMContentLoaded",S),
a.removeEventListener("load",S),r.ready()}"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(r.ready):(d.addEventListener("DOMContentLoaded",S),a.addEventListener("load",S));var T=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===r.type(c)){e=!0;for(h in c)T(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,r.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(r(a),c)})),b))for(;h<i;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},U=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function V(){this.expando=r.expando+V.uid++}V.uid=1,V.prototype={cache:function(a){var b=a[this.expando];return b||(b={},U(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[r.camelCase(b)]=c;else for(d in b)e[r.camelCase(d)]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][r.camelCase(b)]},access:function(a,b,c){return void 0===b||b&&"string"==typeof b&&void 0===c?this.get(a,b):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d=a[this.expando];if(void 0!==d){if(void 0!==b){Array.isArray(b)?b=b.map(r.camelCase):(b=r.camelCase(b),b=b in d?[b]:b.match(L)||[]),c=b.length;while(c--)delete d[b[c]]}(void 0===b||r.isEmptyObject(d))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!r.isEmptyObject(b)}};var W=new V,X=new V,Y=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Z=/[A-Z]/g;function $(a){return"true"===a||"false"!==a&&("null"===a?null:a===+a+""?+a:Y.test(a)?JSON.parse(a):a)}function _(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Z,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c=$(c)}catch(e){}X.set(a,b,c)}else c=void 0;return c}r.extend({hasData:function(a){return X.hasData(a)||W.hasData(a)},data:function(a,b,c){return X.access(a,b,c)},removeData:function(a,b){X.remove(a,b)},_data:function(a,b,c){return W.access(a,b,c)},_removeData:function(a,b){W.remove(a,b)}}),r.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=X.get(f),1===f.nodeType&&!W.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=r.camelCase(d.slice(5)),_(f,d,e[d])));W.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){X.set(this,a)}):T(this,function(b){var c;if(f&&void 0===b){if(c=X.get(f,a),void 0!==c)return c;if(c=_(f,a),void 0!==c)return c}else this.each(function(){X.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){X.remove(this,a)})}}),r.extend({queue:function(a,b,c){var d;if(a)return b=(b||"fx")+"queue",d=W.get(a,b),c&&(!d||Array.isArray(c)?d=W.access(a,b,r.makeArray(c)):d.push(c)),d||[]},dequeue:function(a,b){b=b||"fx";var c=r.queue(a,b),d=c.length,e=c.shift(),f=r._queueHooks(a,b),g=function(){r.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return W.get(a,c)||W.access(a,c,{empty:r.Callbacks("once memory").add(function(){W.remove(a,[b+"queue",c])})})}}),r.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?r.queue(this[0],a):void 0===b?this:this.each(function(){var c=r.queue(this,a,b);r._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&r.dequeue(this,a)})},dequeue:function(a){return this.each(function(){r.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=r.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=W.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var aa=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ba=new RegExp("^(?:([+-])=|)("+aa+")([a-z%]*)$","i"),ca=["Top","Right","Bottom","Left"],da=function(a,b){return a=b||a,"none"===a.style.display||""===a.style.display&&r.contains(a.ownerDocument,a)&&"none"===r.css(a,"display")},ea=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};function fa(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return r.css(a,b,"")},i=h(),j=c&&c[3]||(r.cssNumber[b]?"":"px"),k=(r.cssNumber[b]||"px"!==j&&+i)&&ba.exec(r.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,r.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var ga={};function ha(a){var b,c=a.ownerDocument,d=a.nodeName,e=ga[d];return e?e:(b=c.body.appendChild(c.createElement(d)),e=r.css(b,"display"),b.parentNode.removeChild(b),"none"===e&&(e="block"),ga[d]=e,e)}function ia(a,b){for(var c,d,e=[],f=0,g=a.length;f<g;f++)d=a[f],d.style&&(c=d.style.display,b?("none"===c&&(e[f]=W.get(d,"display")||null,e[f]||(d.style.display="")),""===d.style.display&&da(d)&&(e[f]=ha(d))):"none"!==c&&(e[f]="none",W.set(d,"display",c)));for(f=0;f<g;f++)null!=e[f]&&(a[f].style.display=e[f]);return a}r.fn.extend({show:function(){return ia(this,!0)},hide:function(){return ia(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){da(this)?r(this).show():r(this).hide()})}});var ja=/^(?:checkbox|radio)$/i,ka=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,la=/^$|\/(?:java|ecma)script/i,ma={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ma.optgroup=ma.option,ma.tbody=ma.tfoot=ma.colgroup=ma.caption=ma.thead,ma.th=ma.td;function na(a,b){var c;return c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[],void 0===b||b&&B(a,b)?r.merge([a],c):c}function oa(a,b){for(var c=0,d=a.length;c<d;c++)W.set(a[c],"globalEval",!b||W.get(b[c],"globalEval"))}var pa=/<|&#?\w+;/;function qa(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],n=0,o=a.length;n<o;n++)if(f=a[n],f||0===f)if("object"===r.type(f))r.merge(m,f.nodeType?[f]:f);else if(pa.test(f)){g=g||l.appendChild(b.createElement("div")),h=(ka.exec(f)||["",""])[1].toLowerCase(),i=ma[h]||ma._default,g.innerHTML=i[1]+r.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;r.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",n=0;while(f=m[n++])if(d&&r.inArray(f,d)>-1)e&&e.push(f);else if(j=r.contains(f.ownerDocument,f),g=na(l.appendChild(f),"script"),j&&oa(g),c){k=0;while(f=g[k++])la.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),o.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",o.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var ra=d.documentElement,sa=/^key/,ta=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ua=/^([^.]*)(?:\.(.+)|)/;function va(){return!0}function wa(){return!1}function xa(){try{return d.activeElement}catch(a){}}function ya(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ya(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=wa;else if(!e)return a;return 1===f&&(g=e,e=function(a){return r().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=r.guid++)),a.each(function(){r.event.add(this,b,e,d,c)})}r.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.get(a);if(q){c.handler&&(f=c,c=f.handler,e=f.selector),e&&r.find.matchesSelector(ra,e),c.guid||(c.guid=r.guid++),(i=q.events)||(i=q.events={}),(g=q.handle)||(g=q.handle=function(b){return"undefined"!=typeof r&&r.event.triggered!==b.type?r.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(L)||[""],j=b.length;while(j--)h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n&&(l=r.event.special[n]||{},n=(e?l.delegateType:l.bindType)||n,l=r.event.special[n]||{},k=r.extend({type:n,origType:p,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&r.expr.match.needsContext.test(e),namespace:o.join(".")},f),(m=i[n])||(m=i[n]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,o,g)!==!1||a.addEventListener&&a.addEventListener(n,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),r.event.global[n]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q=W.hasData(a)&&W.get(a);if(q&&(i=q.events)){b=(b||"").match(L)||[""],j=b.length;while(j--)if(h=ua.exec(b[j])||[],n=p=h[1],o=(h[2]||"").split(".").sort(),n){l=r.event.special[n]||{},n=(d?l.delegateType:l.bindType)||n,m=i[n]||[],h=h[2]&&new RegExp("(^|\\.)"+o.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&p!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,o,q.handle)!==!1||r.removeEvent(a,n,q.handle),delete i[n])}else for(n in i)r.event.remove(a,n+b[j],c,d,!0);r.isEmptyObject(i)&&W.remove(a,"handle events")}},dispatch:function(a){var b=r.event.fix(a),c,d,e,f,g,h,i=new Array(arguments.length),j=(W.get(this,"events")||{})[b.type]||[],k=r.event.special[b.type]||{};for(i[0]=b,c=1;c<arguments.length;c++)i[c]=arguments[c];if(b.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,b)!==!1){h=r.event.handlers.call(this,b,j),c=0;while((f=h[c++])&&!b.isPropagationStopped()){b.currentTarget=f.elem,d=0;while((g=f.handlers[d++])&&!b.isImmediatePropagationStopped())b.rnamespace&&!b.rnamespace.test(g.namespace)||(b.handleObj=g,b.data=g.data,e=((r.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(b.result=e)===!1&&(b.preventDefault(),b.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,b),b.result}},handlers:function(a,b){var c,d,e,f,g,h=[],i=b.delegateCount,j=a.target;if(i&&j.nodeType&&!("click"===a.type&&a.button>=1))for(;j!==this;j=j.parentNode||this)if(1===j.nodeType&&("click"!==a.type||j.disabled!==!0)){for(f=[],g={},c=0;c<i;c++)d=b[c],e=d.selector+" ",void 0===g[e]&&(g[e]=d.needsContext?r(e,this).index(j)>-1:r.find(e,this,null,[j]).length),g[e]&&f.push(d);f.length&&h.push({elem:j,handlers:f})}return j=this,i<b.length&&h.push({elem:j,handlers:b.slice(i)}),h},addProp:function(a,b){Object.defineProperty(r.Event.prototype,a,{enumerable:!0,configurable:!0,get:r.isFunction(b)?function(){if(this.originalEvent)return b(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[a]},set:function(b){Object.defineProperty(this,a,{enumerable:!0,configurable:!0,writable:!0,value:b})}})},fix:function(a){return a[r.expando]?a:new r.Event(a)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==xa()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===xa()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&B(this,"input"))return this.click(),!1},_default:function(a){return B(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},r.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},r.Event=function(a,b){return this instanceof r.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?va:wa,this.target=a.target&&3===a.target.nodeType?a.target.parentNode:a.target,this.currentTarget=a.currentTarget,this.relatedTarget=a.relatedTarget):this.type=a,b&&r.extend(this,b),this.timeStamp=a&&a.timeStamp||r.now(),void(this[r.expando]=!0)):new r.Event(a,b)},r.Event.prototype={constructor:r.Event,isDefaultPrevented:wa,isPropagationStopped:wa,isImmediatePropagationStopped:wa,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=va,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=va,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=va,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},r.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(a){var b=a.button;return null==a.which&&sa.test(a.type)?null!=a.charCode?a.charCode:a.keyCode:!a.which&&void 0!==b&&ta.test(a.type)?1&b?1:2&b?3:4&b?2:0:a.which}},r.event.addProp),r.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){r.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||r.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),r.fn.extend({on:function(a,b,c,d){return ya(this,a,b,c,d)},one:function(a,b,c,d){return ya(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,r(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=wa),this.each(function(){r.event.remove(this,a,c,b)})}});var za=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Aa=/<script|<style|<link/i,Ba=/checked\s*(?:[^=]|=\s*.checked.)/i,Ca=/^true\/(.*)/,Da=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Ea(a,b){return B(a,"table")&&B(11!==b.nodeType?b:b.firstChild,"tr")?r(">tbody",a)[0]||a:a}function Fa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function Ga(a){var b=Ca.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ha(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(W.hasData(a)&&(f=W.access(a),g=W.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;c<d;c++)r.event.add(b,e,j[e][c])}X.hasData(a)&&(h=X.access(a),i=r.extend({},h),X.set(b,i))}}function Ia(a,b){var c=b.nodeName.toLowerCase();"input"===c&&ja.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function Ja(a,b,c,d){b=g.apply([],b);var e,f,h,i,j,k,l=0,m=a.length,n=m-1,q=b[0],s=r.isFunction(q);if(s||m>1&&"string"==typeof q&&!o.checkClone&&Ba.test(q))return a.each(function(e){var f=a.eq(e);s&&(b[0]=q.call(this,e,f.html())),Ja(f,b,c,d)});if(m&&(e=qa(b,a[0].ownerDocument,!1,a,d),f=e.firstChild,1===e.childNodes.length&&(e=f),f||d)){for(h=r.map(na(e,"script"),Fa),i=h.length;l<m;l++)j=e,l!==n&&(j=r.clone(j,!0,!0),i&&r.merge(h,na(j,"script"))),c.call(a[l],j,l);if(i)for(k=h[h.length-1].ownerDocument,r.map(h,Ga),l=0;l<i;l++)j=h[l],la.test(j.type||"")&&!W.access(j,"globalEval")&&r.contains(k,j)&&(j.src?r._evalUrl&&r._evalUrl(j.src):p(j.textContent.replace(Da,""),k))}return a}function Ka(a,b,c){for(var d,e=b?r.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||r.cleanData(na(d)),d.parentNode&&(c&&r.contains(d.ownerDocument,d)&&oa(na(d,"script")),d.parentNode.removeChild(d));return a}r.extend({htmlPrefilter:function(a){return a.replace(za,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=r.contains(a.ownerDocument,a);if(!(o.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||r.isXMLDoc(a)))for(g=na(h),f=na(a),d=0,e=f.length;d<e;d++)Ia(f[d],g[d]);if(b)if(c)for(f=f||na(a),g=g||na(h),d=0,e=f.length;d<e;d++)Ha(f[d],g[d]);else Ha(a,h);return g=na(h,"script"),g.length>0&&oa(g,!i&&na(a,"script")),h},cleanData:function(a){for(var b,c,d,e=r.event.special,f=0;void 0!==(c=a[f]);f++)if(U(c)){if(b=c[W.expando]){if(b.events)for(d in b.events)e[d]?r.event.remove(c,d):r.removeEvent(c,d,b.handle);c[W.expando]=void 0}c[X.expando]&&(c[X.expando]=void 0)}}}),r.fn.extend({detach:function(a){return Ka(this,a,!0)},remove:function(a){return Ka(this,a)},text:function(a){return T(this,function(a){return void 0===a?r.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.appendChild(a)}})},prepend:function(){return Ja(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=Ea(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return Ja(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(r.cleanData(na(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null!=a&&a,b=null==b?a:b,this.map(function(){return r.clone(this,a,b)})},html:function(a){return T(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!Aa.test(a)&&!ma[(ka.exec(a)||["",""])[1].toLowerCase()]){a=r.htmlPrefilter(a);try{for(;c<d;c++)b=this[c]||{},1===b.nodeType&&(r.cleanData(na(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return Ja(this,arguments,function(b){var c=this.parentNode;r.inArray(this,a)<0&&(r.cleanData(na(this)),c&&c.replaceChild(b,this))},a)}}),r.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){r.fn[a]=function(a){for(var c,d=[],e=r(a),f=e.length-1,g=0;g<=f;g++)c=g===f?this:this.clone(!0),r(e[g])[b](c),h.apply(d,c.get());return this.pushStack(d)}});var La=/^margin/,Ma=new RegExp("^("+aa+")(?!px)[a-z%]+$","i"),Na=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)};!function(){function b(){if(i){i.style.cssText="box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",i.innerHTML="",ra.appendChild(h);var b=a.getComputedStyle(i);c="1%"!==b.top,g="2px"===b.marginLeft,e="4px"===b.width,i.style.marginRight="50%",f="4px"===b.marginRight,ra.removeChild(h),i=null}}var c,e,f,g,h=d.createElement("div"),i=d.createElement("div");i.style&&(i.style.backgroundClip="content-box",i.cloneNode(!0).style.backgroundClip="",o.clearCloneStyle="content-box"===i.style.backgroundClip,h.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",h.appendChild(i),r.extend(o,{pixelPosition:function(){return b(),c},boxSizingReliable:function(){return b(),e},pixelMarginRight:function(){return b(),f},reliableMarginLeft:function(){return b(),g}}))}();function Oa(a,b,c){var d,e,f,g,h=a.style;return c=c||Na(a),c&&(g=c.getPropertyValue(b)||c[b],""!==g||r.contains(a.ownerDocument,a)||(g=r.style(a,b)),!o.pixelMarginRight()&&Ma.test(g)&&La.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function Pa(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Qa=/^(none|table(?!-c[ea]).+)/,Ra=/^--/,Sa={position:"absolute",visibility:"hidden",display:"block"},Ta={letterSpacing:"0",fontWeight:"400"},Ua=["Webkit","Moz","ms"],Va=d.createElement("div").style;function Wa(a){if(a in Va)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ua.length;while(c--)if(a=Ua[c]+b,a in Va)return a}function Xa(a){var b=r.cssProps[a];return b||(b=r.cssProps[a]=Wa(a)||a),b}function Ya(a,b,c){var d=ba.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Za(a,b,c,d,e){var f,g=0;for(f=c===(d?"border":"content")?4:"width"===b?1:0;f<4;f+=2)"margin"===c&&(g+=r.css(a,c+ca[f],!0,e)),d?("content"===c&&(g-=r.css(a,"padding"+ca[f],!0,e)),"margin"!==c&&(g-=r.css(a,"border"+ca[f]+"Width",!0,e))):(g+=r.css(a,"padding"+ca[f],!0,e),"padding"!==c&&(g+=r.css(a,"border"+ca[f]+"Width",!0,e)));return g}function $a(a,b,c){var d,e=Na(a),f=Oa(a,b,e),g="border-box"===r.css(a,"boxSizing",!1,e);return Ma.test(f)?f:(d=g&&(o.boxSizingReliable()||f===a.style[b]),"auto"===f&&(f=a["offset"+b[0].toUpperCase()+b.slice(1)]),f=parseFloat(f)||0,f+Za(a,b,c||(g?"border":"content"),d,e)+"px")}r.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Oa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=r.camelCase(b),i=Ra.test(b),j=a.style;return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:j[b]:(f=typeof c,"string"===f&&(e=ba.exec(c))&&e[1]&&(c=fa(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(r.cssNumber[h]?"":"px")),o.clearCloneStyle||""!==c||0!==b.indexOf("background")||(j[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i?j.setProperty(b,c):j[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=r.camelCase(b),i=Ra.test(b);return i||(b=Xa(h)),g=r.cssHooks[b]||r.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Oa(a,b,d)),"normal"===e&&b in Ta&&(e=Ta[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),r.each(["height","width"],function(a,b){r.cssHooks[b]={get:function(a,c,d){if(c)return!Qa.test(r.css(a,"display"))||a.getClientRects().length&&a.getBoundingClientRect().width?$a(a,b,d):ea(a,Sa,function(){return $a(a,b,d)})},set:function(a,c,d){var e,f=d&&Na(a),g=d&&Za(a,b,d,"border-box"===r.css(a,"boxSizing",!1,f),f);return g&&(e=ba.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=r.css(a,b)),Ya(a,c,g)}}}),r.cssHooks.marginLeft=Pa(o.reliableMarginLeft,function(a,b){if(b)return(parseFloat(Oa(a,"marginLeft"))||a.getBoundingClientRect().left-ea(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px"}),r.each({margin:"",padding:"",border:"Width"},function(a,b){r.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];d<4;d++)e[a+ca[d]+b]=f[d]||f[d-2]||f[0];return e}},La.test(a)||(r.cssHooks[a+b].set=Ya)}),r.fn.extend({css:function(a,b){return T(this,function(a,b,c){var d,e,f={},g=0;if(Array.isArray(b)){for(d=Na(a),e=b.length;g<e;g++)f[b[g]]=r.css(a,b[g],!1,d);return f}return void 0!==c?r.style(a,b,c):r.css(a,b)},a,b,arguments.length>1)}});function _a(a,b,c,d,e){return new _a.prototype.init(a,b,c,d,e)}r.Tween=_a,_a.prototype={constructor:_a,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||r.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(r.cssNumber[c]?"":"px")},cur:function(){var a=_a.propHooks[this.prop];return a&&a.get?a.get(this):_a.propHooks._default.get(this)},run:function(a){var b,c=_a.propHooks[this.prop];return this.options.duration?this.pos=b=r.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):_a.propHooks._default.set(this),this}},_a.prototype.init.prototype=_a.prototype,_a.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=r.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){r.fx.step[a.prop]?r.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[r.cssProps[a.prop]]&&!r.cssHooks[a.prop]?a.elem[a.prop]=a.now:r.style(a.elem,a.prop,a.now+a.unit)}}},_a.propHooks.scrollTop=_a.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},r.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},r.fx=_a.prototype.init,r.fx.step={};var ab,bb,cb=/^(?:toggle|show|hide)$/,db=/queueHooks$/;function eb(){bb&&(d.hidden===!1&&a.requestAnimationFrame?a.requestAnimationFrame(eb):a.setTimeout(eb,r.fx.interval),r.fx.tick())}function fb(){return a.setTimeout(function(){ab=void 0}),ab=r.now()}function gb(a,b){var c,d=0,e={height:a};for(b=b?1:0;d<4;d+=2-b)c=ca[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function hb(a,b,c){for(var d,e=(kb.tweeners[b]||[]).concat(kb.tweeners["*"]),f=0,g=e.length;f<g;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,k,l="width"in b||"height"in b,m=this,n={},o=a.style,p=a.nodeType&&da(a),q=W.get(a,"fxshow");c.queue||(g=r._queueHooks(a,"fx"),null==g.unqueued&&(g.unqueued=0,h=g.empty.fire,g.empty.fire=function(){g.unqueued||h()}),g.unqueued++,m.always(function(){m.always(function(){g.unqueued--,r.queue(a,"fx").length||g.empty.fire()})}));for(d in b)if(e=b[d],cb.test(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}n[d]=q&&q[d]||r.style(a,d)}if(i=!r.isEmptyObject(b),i||!r.isEmptyObject(n)){l&&1===a.nodeType&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=q&&q.display,null==j&&(j=W.get(a,"display")),k=r.css(a,"display"),"none"===k&&(j?k=j:(ia([a],!0),j=a.style.display||j,k=r.css(a,"display"),ia([a]))),("inline"===k||"inline-block"===k&&null!=j)&&"none"===r.css(a,"float")&&(i||(m.done(function(){o.display=j}),null==j&&(k=o.display,j="none"===k?"":k)),o.display="inline-block")),c.overflow&&(o.overflow="hidden",m.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]})),i=!1;for(d in n)i||(q?"hidden"in q&&(p=q.hidden):q=W.access(a,"fxshow",{display:j}),f&&(q.hidden=!p),p&&ia([a],!0),m.done(function(){p||ia([a]),W.remove(a,"fxshow");for(d in n)r.style(a,d,n[d])})),i=hb(p?q[d]:0,d,m),d in q||(q[d]=i.start,p&&(i.end=i.start,i.start=0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=r.camelCase(c),e=b[d],f=a[c],Array.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=r.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=kb.prefilters.length,h=r.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=ab||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;g<i;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),f<1&&i?c:(i||h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:r.extend({},b),opts:r.extend(!0,{specialEasing:{},easing:r.easing._default},c),originalProperties:b,originalOptions:c,startTime:ab||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=r.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;c<d;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);f<g;f++)if(d=kb.prefilters[f].call(j,a,k,j.opts))return r.isFunction(d.stop)&&(r._queueHooks(j.elem,j.opts.queue).stop=r.proxy(d.stop,d)),d;return r.map(k,hb,j),r.isFunction(j.opts.start)&&j.opts.start.call(a,j),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always),r.fx.timer(r.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j}r.Animation=r.extend(kb,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return fa(c.elem,a,ba.exec(b),c),c}]},tweener:function(a,b){r.isFunction(a)?(b=a,a=["*"]):a=a.match(L);for(var c,d=0,e=a.length;d<e;d++)c=a[d],kb.tweeners[c]=kb.tweeners[c]||[],kb.tweeners[c].unshift(b)},prefilters:[ib],prefilter:function(a,b){b?kb.prefilters.unshift(a):kb.prefilters.push(a)}}),r.speed=function(a,b,c){var d=a&&"object"==typeof a?r.extend({},a):{complete:c||!c&&b||r.isFunction(a)&&a,duration:a,easing:c&&b||b&&!r.isFunction(b)&&b};return r.fx.off?d.duration=0:"number"!=typeof d.duration&&(d.duration in r.fx.speeds?d.duration=r.fx.speeds[d.duration]:d.duration=r.fx.speeds._default),null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){r.isFunction(d.old)&&d.old.call(this),d.queue&&r.dequeue(this,d.queue)},d},r.fn.extend({fadeTo:function(a,b,c,d){return this.filter(da).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=r.isEmptyObject(a),f=r.speed(b,c,d),g=function(){var b=kb(this,r.extend({},a),f);(e||W.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=r.timers,g=W.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&db.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||r.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=W.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=r.timers,g=d?d.length:0;for(c.finish=!0,r.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;b<g;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),r.each(["toggle","show","hide"],function(a,b){var c=r.fn[b];r.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),r.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){r.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),r.timers=[],r.fx.tick=function(){var a,b=0,c=r.timers;for(ab=r.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||r.fx.stop(),ab=void 0},r.fx.timer=function(a){r.timers.push(a),r.fx.start()},r.fx.interval=13,r.fx.start=function(){bb||(bb=!0,eb())},r.fx.stop=function(){bb=null},r.fx.speeds={slow:600,fast:200,_default:400},r.fn.delay=function(b,c){return b=r.fx?r.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",o.checkOn=""!==a.value,o.optSelected=c.selected,a=d.createElement("input"),a.value="t",a.type="radio",o.radioValue="t"===a.value}();var lb,mb=r.expr.attrHandle;r.fn.extend({attr:function(a,b){return T(this,r.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){r.removeAttr(this,a)})}}),r.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?r.prop(a,b,c):(1===f&&r.isXMLDoc(a)||(e=r.attrHooks[b.toLowerCase()]||(r.expr.match.bool.test(b)?lb:void 0)),void 0!==c?null===c?void r.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=r.find.attr(a,b),
null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!o.radioValue&&"radio"===b&&B(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d=0,e=b&&b.match(L);if(e&&1===a.nodeType)while(c=e[d++])a.removeAttribute(c)}}),lb={set:function(a,b,c){return b===!1?r.removeAttr(a,c):a.setAttribute(c,c),c}},r.each(r.expr.match.bool.source.match(/\w+/g),function(a,b){var c=mb[b]||r.find.attr;mb[b]=function(a,b,d){var e,f,g=b.toLowerCase();return d||(f=mb[g],mb[g]=e,e=null!=c(a,b,d)?g:null,mb[g]=f),e}});var nb=/^(?:input|select|textarea|button)$/i,ob=/^(?:a|area)$/i;r.fn.extend({prop:function(a,b){return T(this,r.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[r.propFix[a]||a]})}}),r.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&r.isXMLDoc(a)||(b=r.propFix[b]||b,e=r.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=r.find.attr(a,"tabindex");return b?parseInt(b,10):nb.test(a.nodeName)||ob.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),o.optSelected||(r.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),r.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){r.propFix[this.toLowerCase()]=this});function pb(a){var b=a.match(L)||[];return b.join(" ")}function qb(a){return a.getAttribute&&a.getAttribute("class")||""}r.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).addClass(a.call(this,b,qb(this)))});if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(r.isFunction(a))return this.each(function(b){r(this).removeClass(a.call(this,b,qb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(L)||[];while(c=this[i++])if(e=qb(c),d=1===c.nodeType&&" "+pb(e)+" "){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=pb(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):r.isFunction(a)?this.each(function(c){r(this).toggleClass(a.call(this,c,qb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=r(this),f=a.match(L)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=qb(this),b&&W.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":W.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+pb(qb(c))+" ").indexOf(b)>-1)return!0;return!1}});var rb=/\r/g;r.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=r.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,r(this).val()):a,null==e?e="":"number"==typeof e?e+="":Array.isArray(e)&&(e=r.map(e,function(a){return null==a?"":a+""})),b=r.valHooks[this.type]||r.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=r.valHooks[e.type]||r.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(rb,""):null==c?"":c)}}}),r.extend({valHooks:{option:{get:function(a){var b=r.find.attr(a,"value");return null!=b?b:pb(r.text(a))}},select:{get:function(a){var b,c,d,e=a.options,f=a.selectedIndex,g="select-one"===a.type,h=g?null:[],i=g?f+1:e.length;for(d=f<0?i:g?f:0;d<i;d++)if(c=e[d],(c.selected||d===f)&&!c.disabled&&(!c.parentNode.disabled||!B(c.parentNode,"optgroup"))){if(b=r(c).val(),g)return b;h.push(b)}return h},set:function(a,b){var c,d,e=a.options,f=r.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=r.inArray(r.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),r.each(["radio","checkbox"],function(){r.valHooks[this]={set:function(a,b){if(Array.isArray(b))return a.checked=r.inArray(r(a).val(),b)>-1}},o.checkOn||(r.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var sb=/^(?:focusinfocus|focusoutblur)$/;r.extend(r.event,{trigger:function(b,c,e,f){var g,h,i,j,k,m,n,o=[e||d],p=l.call(b,"type")?b.type:b,q=l.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!sb.test(p+r.event.triggered)&&(p.indexOf(".")>-1&&(q=p.split("."),p=q.shift(),q.sort()),k=p.indexOf(":")<0&&"on"+p,b=b[r.expando]?b:new r.Event(p,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=q.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:r.makeArray(c,[b]),n=r.event.special[p]||{},f||!n.trigger||n.trigger.apply(e,c)!==!1)){if(!f&&!n.noBubble&&!r.isWindow(e)){for(j=n.delegateType||p,sb.test(j+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),i=h;i===(e.ownerDocument||d)&&o.push(i.defaultView||i.parentWindow||a)}g=0;while((h=o[g++])&&!b.isPropagationStopped())b.type=g>1?j:n.bindType||p,m=(W.get(h,"events")||{})[b.type]&&W.get(h,"handle"),m&&m.apply(h,c),m=k&&h[k],m&&m.apply&&U(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=p,f||b.isDefaultPrevented()||n._default&&n._default.apply(o.pop(),c)!==!1||!U(e)||k&&r.isFunction(e[p])&&!r.isWindow(e)&&(i=e[k],i&&(e[k]=null),r.event.triggered=p,e[p](),r.event.triggered=void 0,i&&(e[k]=i)),b.result}},simulate:function(a,b,c){var d=r.extend(new r.Event,c,{type:a,isSimulated:!0});r.event.trigger(d,null,b)}}),r.fn.extend({trigger:function(a,b){return this.each(function(){r.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];if(c)return r.event.trigger(a,b,c,!0)}}),r.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(a,b){r.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),r.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),o.focusin="onfocusin"in a,o.focusin||r.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){r.event.simulate(b,a.target,r.event.fix(a))};r.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=W.access(d,b);e||d.addEventListener(a,c,!0),W.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=W.access(d,b)-1;e?W.access(d,b,e):(d.removeEventListener(a,c,!0),W.remove(d,b))}}});var tb=a.location,ub=r.now(),vb=/\?/;r.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||r.error("Invalid XML: "+b),c};var wb=/\[\]$/,xb=/\r?\n/g,yb=/^(?:submit|button|image|reset|file)$/i,zb=/^(?:input|select|textarea|keygen)/i;function Ab(a,b,c,d){var e;if(Array.isArray(b))r.each(b,function(b,e){c||wb.test(a)?d(a,e):Ab(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==r.type(b))d(a,b);else for(e in b)Ab(a+"["+e+"]",b[e],c,d)}r.param=function(a,b){var c,d=[],e=function(a,b){var c=r.isFunction(b)?b():b;d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(null==c?"":c)};if(Array.isArray(a)||a.jquery&&!r.isPlainObject(a))r.each(a,function(){e(this.name,this.value)});else for(c in a)Ab(c,a[c],b,e);return d.join("&")},r.fn.extend({serialize:function(){return r.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=r.prop(this,"elements");return a?r.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!r(this).is(":disabled")&&zb.test(this.nodeName)&&!yb.test(a)&&(this.checked||!ja.test(a))}).map(function(a,b){var c=r(this).val();return null==c?null:Array.isArray(c)?r.map(c,function(a){return{name:b.name,value:a.replace(xb,"\r\n")}}):{name:b.name,value:c.replace(xb,"\r\n")}}).get()}});var Bb=/%20/g,Cb=/#.*$/,Db=/([?&])_=[^&]*/,Eb=/^(.*?):[ \t]*([^\r\n]*)$/gm,Fb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Gb=/^(?:GET|HEAD)$/,Hb=/^\/\//,Ib={},Jb={},Kb="*/".concat("*"),Lb=d.createElement("a");Lb.href=tb.href;function Mb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(L)||[];if(r.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nb(a,b,c,d){var e={},f=a===Jb;function g(h){var i;return e[h]=!0,r.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Ob(a,b){var c,d,e=r.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&r.extend(!0,a,d),a}function Pb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}if(f)return f!==i[0]&&i.unshift(f),c[f]}function Qb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}r.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:tb.href,type:"GET",isLocal:Fb.test(tb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":r.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Ob(Ob(a,r.ajaxSettings),b):Ob(r.ajaxSettings,a)},ajaxPrefilter:Mb(Ib),ajaxTransport:Mb(Jb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m,n,o=r.ajaxSetup({},c),p=o.context||o,q=o.context&&(p.nodeType||p.jquery)?r(p):r.event,s=r.Deferred(),t=r.Callbacks("once memory"),u=o.statusCode||{},v={},w={},x="canceled",y={readyState:0,getResponseHeader:function(a){var b;if(k){if(!h){h={};while(b=Eb.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return k?g:null},setRequestHeader:function(a,b){return null==k&&(a=w[a.toLowerCase()]=w[a.toLowerCase()]||a,v[a]=b),this},overrideMimeType:function(a){return null==k&&(o.mimeType=a),this},statusCode:function(a){var b;if(a)if(k)y.always(a[y.status]);else for(b in a)u[b]=[u[b],a[b]];return this},abort:function(a){var b=a||x;return e&&e.abort(b),A(0,b),this}};if(s.promise(y),o.url=((b||o.url||tb.href)+"").replace(Hb,tb.protocol+"//"),o.type=c.method||c.type||o.method||o.type,o.dataTypes=(o.dataType||"*").toLowerCase().match(L)||[""],null==o.crossDomain){j=d.createElement("a");try{j.href=o.url,j.href=j.href,o.crossDomain=Lb.protocol+"//"+Lb.host!=j.protocol+"//"+j.host}catch(z){o.crossDomain=!0}}if(o.data&&o.processData&&"string"!=typeof o.data&&(o.data=r.param(o.data,o.traditional)),Nb(Ib,o,c,y),k)return y;l=r.event&&o.global,l&&0===r.active++&&r.event.trigger("ajaxStart"),o.type=o.type.toUpperCase(),o.hasContent=!Gb.test(o.type),f=o.url.replace(Cb,""),o.hasContent?o.data&&o.processData&&0===(o.contentType||"").indexOf("application/x-www-form-urlencoded")&&(o.data=o.data.replace(Bb,"+")):(n=o.url.slice(f.length),o.data&&(f+=(vb.test(f)?"&":"?")+o.data,delete o.data),o.cache===!1&&(f=f.replace(Db,"$1"),n=(vb.test(f)?"&":"?")+"_="+ub++ +n),o.url=f+n),o.ifModified&&(r.lastModified[f]&&y.setRequestHeader("If-Modified-Since",r.lastModified[f]),r.etag[f]&&y.setRequestHeader("If-None-Match",r.etag[f])),(o.data&&o.hasContent&&o.contentType!==!1||c.contentType)&&y.setRequestHeader("Content-Type",o.contentType),y.setRequestHeader("Accept",o.dataTypes[0]&&o.accepts[o.dataTypes[0]]?o.accepts[o.dataTypes[0]]+("*"!==o.dataTypes[0]?", "+Kb+"; q=0.01":""):o.accepts["*"]);for(m in o.headers)y.setRequestHeader(m,o.headers[m]);if(o.beforeSend&&(o.beforeSend.call(p,y,o)===!1||k))return y.abort();if(x="abort",t.add(o.complete),y.done(o.success),y.fail(o.error),e=Nb(Jb,o,c,y)){if(y.readyState=1,l&&q.trigger("ajaxSend",[y,o]),k)return y;o.async&&o.timeout>0&&(i=a.setTimeout(function(){y.abort("timeout")},o.timeout));try{k=!1,e.send(v,A)}catch(z){if(k)throw z;A(-1,z)}}else A(-1,"No Transport");function A(b,c,d,h){var j,m,n,v,w,x=c;k||(k=!0,i&&a.clearTimeout(i),e=void 0,g=h||"",y.readyState=b>0?4:0,j=b>=200&&b<300||304===b,d&&(v=Pb(o,y,d)),v=Qb(o,v,y,j),j?(o.ifModified&&(w=y.getResponseHeader("Last-Modified"),w&&(r.lastModified[f]=w),w=y.getResponseHeader("etag"),w&&(r.etag[f]=w)),204===b||"HEAD"===o.type?x="nocontent":304===b?x="notmodified":(x=v.state,m=v.data,n=v.error,j=!n)):(n=x,!b&&x||(x="error",b<0&&(b=0))),y.status=b,y.statusText=(c||x)+"",j?s.resolveWith(p,[m,x,y]):s.rejectWith(p,[y,x,n]),y.statusCode(u),u=void 0,l&&q.trigger(j?"ajaxSuccess":"ajaxError",[y,o,j?m:n]),t.fireWith(p,[y,x]),l&&(q.trigger("ajaxComplete",[y,o]),--r.active||r.event.trigger("ajaxStop")))}return y},getJSON:function(a,b,c){return r.get(a,b,c,"json")},getScript:function(a,b){return r.get(a,void 0,b,"script")}}),r.each(["get","post"],function(a,b){r[b]=function(a,c,d,e){return r.isFunction(c)&&(e=e||d,d=c,c=void 0),r.ajax(r.extend({url:a,type:b,dataType:e,data:c,success:d},r.isPlainObject(a)&&a))}}),r._evalUrl=function(a){return r.ajax({url:a,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},r.fn.extend({wrapAll:function(a){var b;return this[0]&&(r.isFunction(a)&&(a=a.call(this[0])),b=r(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this},wrapInner:function(a){return r.isFunction(a)?this.each(function(b){r(this).wrapInner(a.call(this,b))}):this.each(function(){var b=r(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=r.isFunction(a);return this.each(function(c){r(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(a){return this.parent(a).not("body").each(function(){r(this).replaceWith(this.childNodes)}),this}}),r.expr.pseudos.hidden=function(a){return!r.expr.pseudos.visible(a)},r.expr.pseudos.visible=function(a){return!!(a.offsetWidth||a.offsetHeight||a.getClientRects().length)},r.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Rb={0:200,1223:204},Sb=r.ajaxSettings.xhr();o.cors=!!Sb&&"withCredentials"in Sb,o.ajax=Sb=!!Sb,r.ajaxTransport(function(b){var c,d;if(o.cors||Sb&&!b.crossDomain)return{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Rb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}}),r.ajaxPrefilter(function(a){a.crossDomain&&(a.contents.script=!1)}),r.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return r.globalEval(a),a}}}),r.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),r.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=r("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Tb=[],Ub=/(=)\?(?=&|$)|\?\?/;r.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Tb.pop()||r.expando+"_"+ub++;return this[a]=!0,a}}),r.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Ub.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Ub.test(b.data)&&"data");if(h||"jsonp"===b.dataTypes[0])return e=b.jsonpCallback=r.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Ub,"$1"+e):b.jsonp!==!1&&(b.url+=(vb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||r.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?r(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Tb.push(e)),g&&r.isFunction(f)&&f(g[0]),g=f=void 0}),"script"}),o.createHTMLDocument=function(){var a=d.implementation.createHTMLDocument("").body;return a.innerHTML="<form></form><form></form>",2===a.childNodes.length}(),r.parseHTML=function(a,b,c){if("string"!=typeof a)return[];"boolean"==typeof b&&(c=b,b=!1);var e,f,g;return b||(o.createHTMLDocument?(b=d.implementation.createHTMLDocument(""),e=b.createElement("base"),e.href=d.location.href,b.head.appendChild(e)):b=d),f=C.exec(a),g=!c&&[],f?[b.createElement(f[1])]:(f=qa([a],b,g),g&&g.length&&r(g).remove(),r.merge([],f.childNodes))},r.fn.load=function(a,b,c){var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=pb(a.slice(h)),a=a.slice(0,h)),r.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&r.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?r("<div>").append(r.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},r.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){r.fn[b]=function(a){return this.on(b,a)}}),r.expr.pseudos.animated=function(a){return r.grep(r.timers,function(b){return a===b.elem}).length},r.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=r.css(a,"position"),l=r(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=r.css(a,"top"),i=r.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),r.isFunction(b)&&(b=b.call(a,c,r.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},r.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){r.offset.setOffset(this,a,b)});var b,c,d,e,f=this[0];if(f)return f.getClientRects().length?(d=f.getBoundingClientRect(),b=f.ownerDocument,c=b.documentElement,e=b.defaultView,{top:d.top+e.pageYOffset-c.clientTop,left:d.left+e.pageXOffset-c.clientLeft}):{top:0,left:0}},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===r.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),B(a[0],"html")||(d=a.offset()),d={top:d.top+r.css(a[0],"borderTopWidth",!0),left:d.left+r.css(a[0],"borderLeftWidth",!0)}),{top:b.top-d.top-r.css(c,"marginTop",!0),left:b.left-d.left-r.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===r.css(a,"position"))a=a.offsetParent;return a||ra})}}),r.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;r.fn[a]=function(d){return T(this,function(a,d,e){var f;return r.isWindow(a)?f=a:9===a.nodeType&&(f=a.defaultView),void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),r.each(["top","left"],function(a,b){r.cssHooks[b]=Pa(o.pixelPosition,function(a,c){if(c)return c=Oa(a,b),Ma.test(c)?r(a).position()[b]+"px":c})}),r.each({Height:"height",Width:"width"},function(a,b){r.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){r.fn[d]=function(e,f){var g=arguments.length&&(c||"boolean"!=typeof e),h=c||(e===!0||f===!0?"margin":"border");return T(this,function(b,c,e){var f;return r.isWindow(b)?0===d.indexOf("outer")?b["inner"+a]:b.document.documentElement["client"+a]:9===b.nodeType?(f=b.documentElement,Math.max(b.body["scroll"+a],f["scroll"+a],b.body["offset"+a],f["offset"+a],f["client"+a])):void 0===e?r.css(b,c,h):r.style(b,c,e,h)},b,g?e:void 0,g)}})}),r.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}}),r.holdReady=function(a){a?r.readyWait++:r.ready(!0)},r.isArray=Array.isArray,r.parseJSON=JSON.parse,r.nodeName=B,"function"==typeof define&&define.amd&&define("jquery",[],function(){return r});var Vb=a.jQuery,Wb=a.$;return r.noConflict=function(b){return a.$===r&&(a.$=Wb),b&&a.jQuery===r&&(a.jQuery=Vb),r},b||(a.jQuery=a.$=r),r});

//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);
//# sourceMappingURL=underscore-min.map
;(function(t){var e=typeof self=="object"&&self.self===self&&self||typeof global=="object"&&global.global===global&&global;if(typeof define==="function"&&define.amd){define(["underscore","jquery","exports"],function(i,r,n){e.Backbone=t(e,n,i,r)})}else if(typeof exports!=="undefined"){var i=require("underscore"),r;try{r=require("jquery")}catch(n){}t(e,exports,i,r)}else{e.Backbone=t(e,{},e._,e.jQuery||e.Zepto||e.ender||e.$)}})(function(t,e,i,r){var n=t.Backbone;var s=Array.prototype.slice;e.VERSION="1.3.3";e.$=r;e.noConflict=function(){t.Backbone=n;return this};e.emulateHTTP=false;e.emulateJSON=false;var a=function(t,e,r){switch(t){case 1:return function(){return i[e](this[r])};case 2:return function(t){return i[e](this[r],t)};case 3:return function(t,n){return i[e](this[r],o(t,this),n)};case 4:return function(t,n,s){return i[e](this[r],o(t,this),n,s)};default:return function(){var t=s.call(arguments);t.unshift(this[r]);return i[e].apply(i,t)}}};var h=function(t,e,r){i.each(e,function(e,n){if(i[n])t.prototype[n]=a(e,n,r)})};var o=function(t,e){if(i.isFunction(t))return t;if(i.isObject(t)&&!e._isModel(t))return l(t);if(i.isString(t))return function(e){return e.get(t)};return t};var l=function(t){var e=i.matches(t);return function(t){return e(t.attributes)}};var u=e.Events={};var c=/\s+/;var f=function(t,e,r,n,s){var a=0,h;if(r&&typeof r==="object"){if(n!==void 0&&"context"in s&&s.context===void 0)s.context=n;for(h=i.keys(r);a<h.length;a++){e=f(t,e,h[a],r[h[a]],s)}}else if(r&&c.test(r)){for(h=r.split(c);a<h.length;a++){e=t(e,h[a],n,s)}}else{e=t(e,r,n,s)}return e};u.on=function(t,e,i){return d(this,t,e,i)};var d=function(t,e,i,r,n){t._events=f(v,t._events||{},e,i,{context:r,ctx:t,listening:n});if(n){var s=t._listeners||(t._listeners={});s[n.id]=n}return t};u.listenTo=function(t,e,r){if(!t)return this;var n=t._listenId||(t._listenId=i.uniqueId("l"));var s=this._listeningTo||(this._listeningTo={});var a=s[n];if(!a){var h=this._listenId||(this._listenId=i.uniqueId("l"));a=s[n]={obj:t,objId:n,id:h,listeningTo:s,count:0}}d(t,e,r,this,a);return this};var v=function(t,e,i,r){if(i){var n=t[e]||(t[e]=[]);var s=r.context,a=r.ctx,h=r.listening;if(h)h.count++;n.push({callback:i,context:s,ctx:s||a,listening:h})}return t};u.off=function(t,e,i){if(!this._events)return this;this._events=f(g,this._events,t,e,{context:i,listeners:this._listeners});return this};u.stopListening=function(t,e,r){var n=this._listeningTo;if(!n)return this;var s=t?[t._listenId]:i.keys(n);for(var a=0;a<s.length;a++){var h=n[s[a]];if(!h)break;h.obj.off(e,r,this)}return this};var g=function(t,e,r,n){if(!t)return;var s=0,a;var h=n.context,o=n.listeners;if(!e&&!r&&!h){var l=i.keys(o);for(;s<l.length;s++){a=o[l[s]];delete o[a.id];delete a.listeningTo[a.objId]}return}var u=e?[e]:i.keys(t);for(;s<u.length;s++){e=u[s];var c=t[e];if(!c)break;var f=[];for(var d=0;d<c.length;d++){var v=c[d];if(r&&r!==v.callback&&r!==v.callback._callback||h&&h!==v.context){f.push(v)}else{a=v.listening;if(a&&--a.count===0){delete o[a.id];delete a.listeningTo[a.objId]}}}if(f.length){t[e]=f}else{delete t[e]}}return t};u.once=function(t,e,r){var n=f(p,{},t,e,i.bind(this.off,this));if(typeof t==="string"&&r==null)e=void 0;return this.on(n,e,r)};u.listenToOnce=function(t,e,r){var n=f(p,{},e,r,i.bind(this.stopListening,this,t));return this.listenTo(t,n)};var p=function(t,e,r,n){if(r){var s=t[e]=i.once(function(){n(e,s);r.apply(this,arguments)});s._callback=r}return t};u.trigger=function(t){if(!this._events)return this;var e=Math.max(0,arguments.length-1);var i=Array(e);for(var r=0;r<e;r++)i[r]=arguments[r+1];f(m,this._events,t,void 0,i);return this};var m=function(t,e,i,r){if(t){var n=t[e];var s=t.all;if(n&&s)s=s.slice();if(n)_(n,r);if(s)_(s,[e].concat(r))}return t};var _=function(t,e){var i,r=-1,n=t.length,s=e[0],a=e[1],h=e[2];switch(e.length){case 0:while(++r<n)(i=t[r]).callback.call(i.ctx);return;case 1:while(++r<n)(i=t[r]).callback.call(i.ctx,s);return;case 2:while(++r<n)(i=t[r]).callback.call(i.ctx,s,a);return;case 3:while(++r<n)(i=t[r]).callback.call(i.ctx,s,a,h);return;default:while(++r<n)(i=t[r]).callback.apply(i.ctx,e);return}};u.bind=u.on;u.unbind=u.off;i.extend(e,u);var y=e.Model=function(t,e){var r=t||{};e||(e={});this.cid=i.uniqueId(this.cidPrefix);this.attributes={};if(e.collection)this.collection=e.collection;if(e.parse)r=this.parse(r,e)||{};var n=i.result(this,"defaults");r=i.defaults(i.extend({},n,r),n);this.set(r,e);this.changed={};this.initialize.apply(this,arguments)};i.extend(y.prototype,u,{changed:null,validationError:null,idAttribute:"id",cidPrefix:"c",initialize:function(){},toJSON:function(t){return i.clone(this.attributes)},sync:function(){return e.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return i.escape(this.get(t))},has:function(t){return this.get(t)!=null},matches:function(t){return!!i.iteratee(t,this)(this.attributes)},set:function(t,e,r){if(t==null)return this;var n;if(typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r||(r={});if(!this._validate(n,r))return false;var s=r.unset;var a=r.silent;var h=[];var o=this._changing;this._changing=true;if(!o){this._previousAttributes=i.clone(this.attributes);this.changed={}}var l=this.attributes;var u=this.changed;var c=this._previousAttributes;for(var f in n){e=n[f];if(!i.isEqual(l[f],e))h.push(f);if(!i.isEqual(c[f],e)){u[f]=e}else{delete u[f]}s?delete l[f]:l[f]=e}if(this.idAttribute in n)this.id=this.get(this.idAttribute);if(!a){if(h.length)this._pending=r;for(var d=0;d<h.length;d++){this.trigger("change:"+h[d],this,l[h[d]],r)}}if(o)return this;if(!a){while(this._pending){r=this._pending;this._pending=false;this.trigger("change",this,r)}}this._pending=false;this._changing=false;return this},unset:function(t,e){return this.set(t,void 0,i.extend({},e,{unset:true}))},clear:function(t){var e={};for(var r in this.attributes)e[r]=void 0;return this.set(e,i.extend({},t,{unset:true}))},hasChanged:function(t){if(t==null)return!i.isEmpty(this.changed);return i.has(this.changed,t)},changedAttributes:function(t){if(!t)return this.hasChanged()?i.clone(this.changed):false;var e=this._changing?this._previousAttributes:this.attributes;var r={};for(var n in t){var s=t[n];if(i.isEqual(e[n],s))continue;r[n]=s}return i.size(r)?r:false},previous:function(t){if(t==null||!this._previousAttributes)return null;return this._previousAttributes[t]},previousAttributes:function(){return i.clone(this._previousAttributes)},fetch:function(t){t=i.extend({parse:true},t);var e=this;var r=t.success;t.success=function(i){var n=t.parse?e.parse(i,t):i;if(!e.set(n,t))return false;if(r)r.call(t.context,e,i,t);e.trigger("sync",e,i,t)};B(this,t);return this.sync("read",this,t)},save:function(t,e,r){var n;if(t==null||typeof t==="object"){n=t;r=e}else{(n={})[t]=e}r=i.extend({validate:true,parse:true},r);var s=r.wait;if(n&&!s){if(!this.set(n,r))return false}else if(!this._validate(n,r)){return false}var a=this;var h=r.success;var o=this.attributes;r.success=function(t){a.attributes=o;var e=r.parse?a.parse(t,r):t;if(s)e=i.extend({},n,e);if(e&&!a.set(e,r))return false;if(h)h.call(r.context,a,t,r);a.trigger("sync",a,t,r)};B(this,r);if(n&&s)this.attributes=i.extend({},o,n);var l=this.isNew()?"create":r.patch?"patch":"update";if(l==="patch"&&!r.attrs)r.attrs=n;var u=this.sync(l,this,r);this.attributes=o;return u},destroy:function(t){t=t?i.clone(t):{};var e=this;var r=t.success;var n=t.wait;var s=function(){e.stopListening();e.trigger("destroy",e,e.collection,t)};t.success=function(i){if(n)s();if(r)r.call(t.context,e,i,t);if(!e.isNew())e.trigger("sync",e,i,t)};var a=false;if(this.isNew()){i.defer(t.success)}else{B(this,t);a=this.sync("delete",this,t)}if(!n)s();return a},url:function(){var t=i.result(this,"urlRoot")||i.result(this.collection,"url")||F();if(this.isNew())return t;var e=this.get(this.idAttribute);return t.replace(/[^\/]$/,"$&/")+encodeURIComponent(e)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},i.extend({},t,{validate:true}))},_validate:function(t,e){if(!e.validate||!this.validate)return true;t=i.extend({},this.attributes,t);var r=this.validationError=this.validate(t,e)||null;if(!r)return true;this.trigger("invalid",this,r,i.extend(e,{validationError:r}));return false}});var b={keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1};h(y,b,"attributes");var x=e.Collection=function(t,e){e||(e={});if(e.model)this.model=e.model;if(e.comparator!==void 0)this.comparator=e.comparator;this._reset();this.initialize.apply(this,arguments);if(t)this.reset(t,i.extend({silent:true},e))};var w={add:true,remove:true,merge:true};var E={add:true,remove:false};var I=function(t,e,i){i=Math.min(Math.max(i,0),t.length);var r=Array(t.length-i);var n=e.length;var s;for(s=0;s<r.length;s++)r[s]=t[s+i];for(s=0;s<n;s++)t[s+i]=e[s];for(s=0;s<r.length;s++)t[s+n+i]=r[s]};i.extend(x.prototype,u,{model:y,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},sync:function(){return e.sync.apply(this,arguments)},add:function(t,e){return this.set(t,i.extend({merge:false},e,E))},remove:function(t,e){e=i.extend({},e);var r=!i.isArray(t);t=r?[t]:t.slice();var n=this._removeModels(t,e);if(!e.silent&&n.length){e.changes={added:[],merged:[],removed:n};this.trigger("update",this,e)}return r?n[0]:n},set:function(t,e){if(t==null)return;e=i.extend({},w,e);if(e.parse&&!this._isModel(t)){t=this.parse(t,e)||[]}var r=!i.isArray(t);t=r?[t]:t.slice();var n=e.at;if(n!=null)n=+n;if(n>this.length)n=this.length;if(n<0)n+=this.length+1;var s=[];var a=[];var h=[];var o=[];var l={};var u=e.add;var c=e.merge;var f=e.remove;var d=false;var v=this.comparator&&n==null&&e.sort!==false;var g=i.isString(this.comparator)?this.comparator:null;var p,m;for(m=0;m<t.length;m++){p=t[m];var _=this.get(p);if(_){if(c&&p!==_){var y=this._isModel(p)?p.attributes:p;if(e.parse)y=_.parse(y,e);_.set(y,e);h.push(_);if(v&&!d)d=_.hasChanged(g)}if(!l[_.cid]){l[_.cid]=true;s.push(_)}t[m]=_}else if(u){p=t[m]=this._prepareModel(p,e);if(p){a.push(p);this._addReference(p,e);l[p.cid]=true;s.push(p)}}}if(f){for(m=0;m<this.length;m++){p=this.models[m];if(!l[p.cid])o.push(p)}if(o.length)this._removeModels(o,e)}var b=false;var x=!v&&u&&f;if(s.length&&x){b=this.length!==s.length||i.some(this.models,function(t,e){return t!==s[e]});this.models.length=0;I(this.models,s,0);this.length=this.models.length}else if(a.length){if(v)d=true;I(this.models,a,n==null?this.length:n);this.length=this.models.length}if(d)this.sort({silent:true});if(!e.silent){for(m=0;m<a.length;m++){if(n!=null)e.index=n+m;p=a[m];p.trigger("add",p,this,e)}if(d||b)this.trigger("sort",this,e);if(a.length||o.length||h.length){e.changes={added:a,removed:o,merged:h};this.trigger("update",this,e)}}return r?t[0]:t},reset:function(t,e){e=e?i.clone(e):{};for(var r=0;r<this.models.length;r++){this._removeReference(this.models[r],e)}e.previousModels=this.models;this._reset();t=this.add(t,i.extend({silent:true},e));if(!e.silent)this.trigger("reset",this,e);return t},push:function(t,e){return this.add(t,i.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t)},unshift:function(t,e){return this.add(t,i.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t)},slice:function(){return s.apply(this.models,arguments)},get:function(t){if(t==null)return void 0;return this._byId[t]||this._byId[this.modelId(t.attributes||t)]||t.cid&&this._byId[t.cid]},has:function(t){return this.get(t)!=null},at:function(t){if(t<0)t+=this.length;return this.models[t]},where:function(t,e){return this[e?"find":"filter"](t)},findWhere:function(t){return this.where(t,true)},sort:function(t){var e=this.comparator;if(!e)throw new Error("Cannot sort a set without a comparator");t||(t={});var r=e.length;if(i.isFunction(e))e=i.bind(e,this);if(r===1||i.isString(e)){this.models=this.sortBy(e)}else{this.models.sort(e)}if(!t.silent)this.trigger("sort",this,t);return this},pluck:function(t){return this.map(t+"")},fetch:function(t){t=i.extend({parse:true},t);var e=t.success;var r=this;t.success=function(i){var n=t.reset?"reset":"set";r[n](i,t);if(e)e.call(t.context,r,i,t);r.trigger("sync",r,i,t)};B(this,t);return this.sync("read",this,t)},create:function(t,e){e=e?i.clone(e):{};var r=e.wait;t=this._prepareModel(t,e);if(!t)return false;if(!r)this.add(t,e);var n=this;var s=e.success;e.success=function(t,e,i){if(r)n.add(t,i);if(s)s.call(i.context,t,e,i)};t.save(null,e);return t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(t){return t[this.model.prototype.idAttribute||"id"]},_reset:function(){this.length=0;this.models=[];this._byId={}},_prepareModel:function(t,e){if(this._isModel(t)){if(!t.collection)t.collection=this;return t}e=e?i.clone(e):{};e.collection=this;var r=new this.model(t,e);if(!r.validationError)return r;this.trigger("invalid",this,r.validationError,e);return false},_removeModels:function(t,e){var i=[];for(var r=0;r<t.length;r++){var n=this.get(t[r]);if(!n)continue;var s=this.indexOf(n);this.models.splice(s,1);this.length--;delete this._byId[n.cid];var a=this.modelId(n.attributes);if(a!=null)delete this._byId[a];if(!e.silent){e.index=s;n.trigger("remove",n,this,e)}i.push(n);this._removeReference(n,e)}return i},_isModel:function(t){return t instanceof y},_addReference:function(t,e){this._byId[t.cid]=t;var i=this.modelId(t.attributes);if(i!=null)this._byId[i]=t;t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){delete this._byId[t.cid];var i=this.modelId(t.attributes);if(i!=null)delete this._byId[i];if(this===t.collection)delete t.collection;t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,r){if(e){if((t==="add"||t==="remove")&&i!==this)return;if(t==="destroy")this.remove(e,r);if(t==="change"){var n=this.modelId(e.previousAttributes());var s=this.modelId(e.attributes);if(n!==s){if(n!=null)delete this._byId[n];if(s!=null)this._byId[s]=e}}}this.trigger.apply(this,arguments)}});var S={forEach:3,each:3,map:3,collect:3,reduce:0,foldl:0,inject:0,reduceRight:0,foldr:0,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:3,includes:3,contains:3,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3,groupBy:3,countBy:3,sortBy:3,indexBy:3,findIndex:3,findLastIndex:3};h(x,S,"models");var k=e.View=function(t){this.cid=i.uniqueId("view");i.extend(this,i.pick(t,P));this._ensureElement();this.initialize.apply(this,arguments)};var T=/^(\S+)\s*(.*)$/;var P=["model","collection","el","id","attributes","className","tagName","events"];i.extend(k.prototype,u,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){this._removeElement();this.stopListening();return this},_removeElement:function(){this.$el.remove()},setElement:function(t){this.undelegateEvents();this._setElement(t);this.delegateEvents();return this},_setElement:function(t){this.$el=t instanceof e.$?t:e.$(t);this.el=this.$el[0]},delegateEvents:function(t){t||(t=i.result(this,"events"));if(!t)return this;this.undelegateEvents();for(var e in t){var r=t[e];if(!i.isFunction(r))r=this[r];if(!r)continue;var n=e.match(T);this.delegate(n[1],n[2],i.bind(r,this))}return this},delegate:function(t,e,i){this.$el.on(t+".delegateEvents"+this.cid,e,i);return this},undelegateEvents:function(){if(this.$el)this.$el.off(".delegateEvents"+this.cid);return this},undelegate:function(t,e,i){this.$el.off(t+".delegateEvents"+this.cid,e,i);return this},_createElement:function(t){return document.createElement(t)},_ensureElement:function(){if(!this.el){var t=i.extend({},i.result(this,"attributes"));if(this.id)t.id=i.result(this,"id");if(this.className)t["class"]=i.result(this,"className");this.setElement(this._createElement(i.result(this,"tagName")));this._setAttributes(t)}else{this.setElement(i.result(this,"el"))}},_setAttributes:function(t){this.$el.attr(t)}});e.sync=function(t,r,n){var s=H[t];i.defaults(n||(n={}),{emulateHTTP:e.emulateHTTP,emulateJSON:e.emulateJSON});var a={type:s,dataType:"json"};if(!n.url){a.url=i.result(r,"url")||F()}if(n.data==null&&r&&(t==="create"||t==="update"||t==="patch")){a.contentType="application/json";a.data=JSON.stringify(n.attrs||r.toJSON(n))}if(n.emulateJSON){a.contentType="application/x-www-form-urlencoded";a.data=a.data?{model:a.data}:{}}if(n.emulateHTTP&&(s==="PUT"||s==="DELETE"||s==="PATCH")){a.type="POST";if(n.emulateJSON)a.data._method=s;var h=n.beforeSend;n.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",s);if(h)return h.apply(this,arguments)}}if(a.type!=="GET"&&!n.emulateJSON){a.processData=false}var o=n.error;n.error=function(t,e,i){n.textStatus=e;n.errorThrown=i;if(o)o.call(n.context,t,e,i)};var l=n.xhr=e.ajax(i.extend(a,n));r.trigger("request",r,l,n);return l};var H={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};e.ajax=function(){return e.$.ajax.apply(e.$,arguments)};var $=e.Router=function(t){t||(t={});if(t.routes)this.routes=t.routes;this._bindRoutes();this.initialize.apply(this,arguments)};var A=/\((.*?)\)/g;var C=/(\(\?)?:\w+/g;var R=/\*\w+/g;var j=/[\-{}\[\]+?.,\\\^$|#\s]/g;i.extend($.prototype,u,{initialize:function(){},route:function(t,r,n){if(!i.isRegExp(t))t=this._routeToRegExp(t);if(i.isFunction(r)){n=r;r=""}if(!n)n=this[r];var s=this;e.history.route(t,function(i){var a=s._extractParameters(t,i);if(s.execute(n,a,r)!==false){s.trigger.apply(s,["route:"+r].concat(a));s.trigger("route",r,a);e.history.trigger("route",s,r,a)}});return this},execute:function(t,e,i){if(t)t.apply(this,e)},navigate:function(t,i){e.history.navigate(t,i);return this},_bindRoutes:function(){if(!this.routes)return;this.routes=i.result(this,"routes");var t,e=i.keys(this.routes);while((t=e.pop())!=null){this.route(t,this.routes[t])}},_routeToRegExp:function(t){t=t.replace(j,"\\$&").replace(A,"(?:$1)?").replace(C,function(t,e){return e?t:"([^/?]+)"}).replace(R,"([^?]*?)");return new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var r=t.exec(e).slice(1);return i.map(r,function(t,e){if(e===r.length-1)return t||null;return t?decodeURIComponent(t):null})}});var N=e.History=function(){this.handlers=[];this.checkUrl=i.bind(this.checkUrl,this);if(typeof window!=="undefined"){this.location=window.location;this.history=window.history}};var M=/^[#\/]|\s+$/g;var O=/^\/+|\/+$/g;var U=/#.*$/;N.started=false;i.extend(N.prototype,u,{interval:50,atRoot:function(){var t=this.location.pathname.replace(/[^\/]$/,"$&/");return t===this.root&&!this.getSearch()},matchRoot:function(){var t=this.decodeFragment(this.location.pathname);var e=t.slice(0,this.root.length-1)+"/";return e===this.root},decodeFragment:function(t){return decodeURI(t.replace(/%25/g,"%2525"))},getSearch:function(){var t=this.location.href.replace(/#.*/,"").match(/\?.+/);return t?t[0]:""},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getPath:function(){var t=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return t.charAt(0)==="/"?t.slice(1):t},getFragment:function(t){if(t==null){if(this._usePushState||!this._wantsHashChange){t=this.getPath()}else{t=this.getHash()}}return t.replace(M,"")},start:function(t){if(N.started)throw new Error("Backbone.history has already been started");N.started=true;this.options=i.extend({root:"/"},this.options,t);this.root=this.options.root;this._wantsHashChange=this.options.hashChange!==false;this._hasHashChange="onhashchange"in window&&(document.documentMode===void 0||document.documentMode>7);this._useHashChange=this._wantsHashChange&&this._hasHashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!!(this.history&&this.history.pushState);this._usePushState=this._wantsPushState&&this._hasPushState;this.fragment=this.getFragment();this.root=("/"+this.root+"/").replace(O,"/");if(this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){var e=this.root.slice(0,-1)||"/";this.location.replace(e+"#"+this.getPath());return true}else if(this._hasPushState&&this.atRoot()){this.navigate(this.getHash(),{replace:true})}}if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement("iframe");this.iframe.src="javascript:0";this.iframe.style.display="none";this.iframe.tabIndex=-1;var r=document.body;var n=r.insertBefore(this.iframe,r.firstChild).contentWindow;n.document.open();n.document.close();n.location.hash="#"+this.fragment}var s=window.addEventListener||function(t,e){return attachEvent("on"+t,e)};if(this._usePushState){s("popstate",this.checkUrl,false)}else if(this._useHashChange&&!this.iframe){s("hashchange",this.checkUrl,false)}else if(this._wantsHashChange){this._checkUrlInterval=setInterval(this.checkUrl,this.interval)}if(!this.options.silent)return this.loadUrl()},stop:function(){var t=window.removeEventListener||function(t,e){return detachEvent("on"+t,e)};if(this._usePushState){t("popstate",this.checkUrl,false)}else if(this._useHashChange&&!this.iframe){t("hashchange",this.checkUrl,false)}if(this.iframe){document.body.removeChild(this.iframe);this.iframe=null}if(this._checkUrlInterval)clearInterval(this._checkUrlInterval);N.started=false},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe){e=this.getHash(this.iframe.contentWindow)}if(e===this.fragment)return false;if(this.iframe)this.navigate(e);this.loadUrl()},loadUrl:function(t){if(!this.matchRoot())return false;t=this.fragment=this.getFragment(t);return i.some(this.handlers,function(e){if(e.route.test(t)){e.callback(t);return true}})},navigate:function(t,e){if(!N.started)return false;if(!e||e===true)e={trigger:!!e};t=this.getFragment(t||"");var i=this.root;if(t===""||t.charAt(0)==="?"){i=i.slice(0,-1)||"/"}var r=i+t;t=this.decodeFragment(t.replace(U,""));if(this.fragment===t)return;this.fragment=t;if(this._usePushState){this.history[e.replace?"replaceState":"pushState"]({},document.title,r)}else if(this._wantsHashChange){this._updateHash(this.location,t,e.replace);if(this.iframe&&t!==this.getHash(this.iframe.contentWindow)){var n=this.iframe.contentWindow;if(!e.replace){n.document.open();n.document.close()}this._updateHash(n.location,t,e.replace)}}else{return this.location.assign(r)}if(e.trigger)return this.loadUrl(t)},_updateHash:function(t,e,i){if(i){var r=t.href.replace(/(javascript:|#).*$/,"");t.replace(r+"#"+e)}else{t.hash="#"+e}}});e.history=new N;var q=function(t,e){var r=this;var n;if(t&&i.has(t,"constructor")){n=t.constructor}else{n=function(){return r.apply(this,arguments)}}i.extend(n,r,e);n.prototype=i.create(r.prototype,t);n.prototype.constructor=n;n.__super__=r.prototype;return n};y.extend=x.extend=$.extend=k.extend=N.extend=q;var F=function(){throw new Error('A "url" property or function must be specified')};var B=function(t,e){var i=e.error;e.error=function(r){if(i)i.call(e.context,t,r,e);t.trigger("error",t,r,e)}};return e});
//# sourceMappingURL=backbone-min.map
;/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */

;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function(opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function() {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function() {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			if ( this[0] === window ) {
				$.blockUI( opts );
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			if ( this[0] === window ) {
				$.unblockUI( opts );
				return this;
			}
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'#000',
				border:		'3px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick)
				opts.overlayCSS.cursor = 'pointer';

			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, {fadeOut:0});

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
				lyr1.css('opacity',0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						else
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements,pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $('body').children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			// fix cursor issue
			if ( opts.cursorReset ) {
				if ( els.length > 1 )
					els[1].style.cursor = opts.cursorReset;
				if ( els.length > 2 )
					els[2].style.cursor = opts.cursorReset;
			}

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function() {
					if ( --count === 0)
						reset(els,data,opts,el);
				});
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			var $el = $(el);
			if ( $el.data('blockUI.isBlocked') )
				return;

			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent)
					data.parent.appendChild(data.el);
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();
/*!
  * Bootstrap v4.0.0 (https://getbootstrap.com)
  * Copyright 2011-2018 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
	(factory((global.bootstrap = {}),global.jQuery));
}(this, (function (exports,$) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Util = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */
  var transition = false;
  var MAX_UID = 1000000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle: function handle(event) {
        if ($$$1(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndTest() {
    if (typeof window !== 'undefined' && window.QUnit) {
      return false;
    }

    return {
      end: 'transitionend'
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $$$1(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest();
    $$$1.fn.emulateTransitionEnd = transitionEndEmulator;

    if (Util.supportsTransitionEnd()) {
      $$$1.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
    }
  }

  function escapeId(selector) {
    // We escape IDs in case of special selectors (selector = '#myId:something')
    // $.escapeSelector does not exist in jQuery < 3
    selector = typeof $$$1.escapeSelector === 'function' ? $$$1.escapeSelector(selector).substr(1) : selector.replace(/(:|\.|\[|\]|,|=|@)/g, '\\$1');
    return selector;
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        selector = element.getAttribute('href') || '';
      } // If it's an ID


      if (selector.charAt(0) === '#') {
        selector = escapeId(selector);
      }

      try {
        var $selector = $$$1(document).find(selector);
        return $selector.length > 0 ? selector : null;
      } catch (err) {
        return null;
      }
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $$$1(element).trigger(transition.end);
    },
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(transition);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    }
  };
  setTransitionEndSupport();
  return Util;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Alert = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'alert';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 150;
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      element = element || this._element;

      var rootElement = this._getRootElement(element);

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private


    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = $$$1(selector)[0];
      }

      if (!parent) {
        parent = $$$1(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $$$1.Event(Event.CLOSE);
      $$$1(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $$$1(element).removeClass(ClassName.SHOW);

      if (!Util.supportsTransitionEnd() || !$$$1(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      $$$1(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(TRANSITION_DURATION);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $$$1(element).detach().trigger(Event.CLOSED).remove();
    }; // Static


    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $$$1(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Alert._jQueryInterface;
  $$$1.fn[NAME].Constructor = Alert;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  return Alert;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Button = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'button';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.button';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var ClassName = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event = {
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
    FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY + DATA_API_KEY + " " + ("blur" + EVENT_KEY + DATA_API_KEY)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#__PURE__*/
  function () {
    function Button(element) {
      this._element = element;
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $$$1(this._element).closest(Selector.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = $$$1(this._element).find(Selector.INPUT)[0];

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && $$$1(this._element).hasClass(ClassName.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = $$$1(rootElement).find(Selector.ACTIVE)[0];

              if (activeElement) {
                $$$1(activeElement).removeClass(ClassName.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !$$$1(this._element).hasClass(ClassName.ACTIVE);
            $$$1(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !$$$1(this._element).hasClass(ClassName.ACTIVE));
      }

      if (triggerChangeEvent) {
        $$$1(this._element).toggleClass(ClassName.ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Static


    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        if (!data) {
          data = new Button(this);
          $$$1(this).data(DATA_KEY, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$$$1(button).hasClass(ClassName.BUTTON)) {
      button = $$$1(button).closest(Selector.BUTTON);
    }

    Button._jQueryInterface.call($$$1(button), 'toggle');
  }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
    var button = $$$1(event.target).closest(Selector.BUTTON)[0];
    $$$1(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Button._jQueryInterface;
  $$$1.fn[NAME].Constructor = Button;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Button._jQueryInterface;
  };

  return Button;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Carousel = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'carousel';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.carousel';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 600;
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event = {
    SLIDE: "slide" + EVENT_KEY,
    SLID: "slid" + EVENT_KEY,
    KEYDOWN: "keydown" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY,
    TOUCHEND: "touchend" + EVENT_KEY,
    LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item'
  };
  var Selector = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this._config = this._getConfig(config);
      this._element = $$$1(element)[0];
      this._indicatorsElement = $$$1(this._element).find(Selector.INDICATORS)[0];

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $$$1(this._element).is(':visible') && $$$1(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if ($$$1(this._element).find(Selector.NEXT_PREV)[0] && Util.supportsTransitionEnd()) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = $$$1(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $$$1(this._element).one(Event.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $$$1(this._element).off(EVENT_KEY);
      $$$1.removeData(this._element, DATA_KEY);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $$$1(this._element).on(Event.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $$$1(this._element).on(Event.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });

        if ('ontouchstart' in document.documentElement) {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          $$$1(this._element).on(Event.TOUCHEND, function () {
            _this2.pause();

            if (_this2.touchTimeout) {
              clearTimeout(_this2.touchTimeout);
            }

            _this2.touchTimeout = setTimeout(function (event) {
              return _this2.cycle(event);
            }, TOUCHEVENT_COMPAT_WAIT + _this2._config.interval);
          });
        }
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = $$$1.makeArray($$$1(element).parent().find(Selector.ITEM));
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex($$$1(this._element).find(Selector.ACTIVE_ITEM)[0]);

      var slideEvent = $$$1.Event(Event.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $$$1(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        $$$1(this._indicatorsElement).find(Selector.ACTIVE).removeClass(ClassName.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $$$1(nextIndicator).addClass(ClassName.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this3 = this;

      var activeElement = $$$1(this._element).find(Selector.ACTIVE_ITEM)[0];

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName.LEFT;
        orderClassName = ClassName.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName.RIGHT;
        orderClassName = ClassName.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $$$1(nextElement).hasClass(ClassName.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $$$1.Event(Event.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if (Util.supportsTransitionEnd() && $$$1(this._element).hasClass(ClassName.SLIDE)) {
        $$$1(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $$$1(activeElement).addClass(directionalClassName);
        $$$1(nextElement).addClass(directionalClassName);
        $$$1(activeElement).one(Util.TRANSITION_END, function () {
          $$$1(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName.ACTIVE);
          $$$1(activeElement).removeClass(ClassName.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this3._isSliding = false;
          setTimeout(function () {
            return $$$1(_this3._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        $$$1(activeElement).removeClass(ClassName.ACTIVE);
        $$$1(nextElement).addClass(ClassName.ACTIVE);
        this._isSliding = false;
        $$$1(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    }; // Static


    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = _extends({}, Default, $$$1(this).data());

        if (typeof config === 'object') {
          _config = _extends({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $$$1(selector)[0];

      if (!target || !$$$1(target).hasClass(ClassName.CAROUSEL)) {
        return;
      }

      var config = _extends({}, $$$1(target).data(), $$$1(this).data());
      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($$$1(target), config);

      if (slideIndex) {
        $$$1(target).data(DATA_KEY).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_SLIDE, Carousel._dataApiClickHandler);
  $$$1(window).on(Event.LOAD_DATA_API, function () {
    $$$1(Selector.DATA_RIDE).each(function () {
      var $carousel = $$$1(this);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Carousel._jQueryInterface;
  $$$1.fn[NAME].Constructor = Carousel;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Carousel._jQueryInterface;
  };

  return Carousel;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Collapse = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'collapse';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.collapse';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 600;
  var Default = {
    toggle: true,
    parent: ''
  };
  var DefaultType = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event = {
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector = {
    ACTIVES: '.show, .collapsing',
    DATA_TOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = $$$1.makeArray($$$1("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var tabToggles = $$$1(Selector.DATA_TOGGLE);

      for (var i = 0; i < tabToggles.length; i++) {
        var elem = tabToggles[i];
        var selector = Util.getSelectorFromElement(elem);

        if (selector !== null && $$$1(selector).filter(element).length > 0) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if ($$$1(this._element).hasClass(ClassName.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $$$1(this._element).hasClass(ClassName.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = $$$1.makeArray($$$1(this._parent).find(Selector.ACTIVES).filter("[data-parent=\"" + this._config.parent + "\"]"));

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $$$1(actives).not(this._selector).data(DATA_KEY);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $$$1.Event(Event.SHOW);
      $$$1(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($$$1(actives).not(this._selector), 'hide');

        if (!activesData) {
          $$$1(actives).data(DATA_KEY, null);
        }
      }

      var dimension = this._getDimension();

      $$$1(this._element).removeClass(ClassName.COLLAPSE).addClass(ClassName.COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length > 0) {
        $$$1(this._triggerArray).removeClass(ClassName.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $$$1(_this._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).addClass(ClassName.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $$$1(_this._element).trigger(Event.SHOWN);
      };

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$$$1(this._element).hasClass(ClassName.SHOW)) {
        return;
      }

      var startEvent = $$$1.Event(Event.HIDE);
      $$$1(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $$$1(this._element).addClass(ClassName.COLLAPSING).removeClass(ClassName.COLLAPSE).removeClass(ClassName.SHOW);

      if (this._triggerArray.length > 0) {
        for (var i = 0; i < this._triggerArray.length; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $$$1(selector);

            if (!$elem.hasClass(ClassName.SHOW)) {
              $$$1(trigger).addClass(ClassName.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $$$1(_this2._element).removeClass(ClassName.COLLAPSING).addClass(ClassName.COLLAPSE).trigger(Event.HIDDEN);
      };

      this._element.style[dimension] = '';

      if (!Util.supportsTransitionEnd()) {
        complete();
        return;
      }

      $$$1(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $$$1(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent = null;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = $$$1(this._config.parent)[0];
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      $$$1(parent).find(selector).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      if (element) {
        var isOpen = $$$1(element).hasClass(ClassName.SHOW);

        if (triggerArray.length > 0) {
          $$$1(triggerArray).toggleClass(ClassName.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
        }
      }
    }; // Static


    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? $$$1(selector)[0] : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $$$1(this);
        var data = $this.data(DATA_KEY);

        var _config = _extends({}, Default, $this.data(), typeof config === 'object' && config);

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $$$1(this);
    var selector = Util.getSelectorFromElement(this);
    $$$1(selector).each(function () {
      var $target = $$$1(this);
      var data = $target.data(DATA_KEY);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Collapse._jQueryInterface;
  $$$1.fn[NAME].Constructor = Collapse;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Collapse._jQueryInterface;
  };

  return Collapse;
}($);

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.12.9
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  // NOTE: 1 DOM access here
  var offsetParent = element && element.offsetParent;
  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    if (element) {
      return element.ownerDocument.documentElement;
    }

    return document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

/**
 * Tells if you are running Internet Explorer 10
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean} isIE10
 */
var isIE10 = undefined;

var isIE10$1 = function () {
  if (isIE10 === undefined) {
    isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
  }
  return isIE10;
};

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE10$1() && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends$1 = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends$1({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  if (isIE10$1()) {
    try {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } catch (err) {}
  } else {
    rect = element.getBoundingClientRect();
  }

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var isIE10 = isIE10$1();
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = getScroll(html);
  var scrollLeft = getScroll(html, 'left');

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  // NOTE: 1 DOM access here
  var boundaries = { top: 0, left: 0 };
  var offsetParent = findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends$1({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var commonOffsetParent = findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length - 1; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.left = '';
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  // floor sides to avoid blurry text
  var offsets = {
    left: Math.floor(popper.left),
    top: Math.floor(popper.top),
    bottom: Math.floor(popper.bottom),
    right: Math.floor(popper.right)
  };

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    top = -offsetParentRect.height + offsets.bottom;
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    left = -offsetParentRect.width + offsets.right;
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends$1({}, attributes, data.attributes);
  data.styles = _extends$1({}, styles, data.styles);
  data.arrowStyles = _extends$1({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends$1({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends$1({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends$1({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends$1({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends$1({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends$1({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends$1({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Dropdown = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'dropdown';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.dropdown';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY + DATA_API_KEY,
    KEYUP_DATA_API: "keyup" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    DROPRIGHT: 'dropright',
    DROPLEFT: 'dropleft',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    POSITION_STATIC: 'position-static'
  };
  var Selector = {
    DATA_TOGGLE: '[data-toggle="dropdown"]',
    FORM_CHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent'
  };
  var DefaultType = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $$$1(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);

      var isActive = $$$1(this._menu).hasClass(ClassName.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $$$1.Event(Event.SHOW, relatedTarget);
      $$$1(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap dropdown require Popper.js (https://popper.js.org)');
        }

        var element = this._element; // For dropup with alignment we use the parent as popper container

        if ($$$1(parent).hasClass(ClassName.DROPUP)) {
          if ($$$1(this._menu).hasClass(ClassName.MENULEFT) || $$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
            element = parent;
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $$$1(parent).addClass(ClassName.POSITION_STATIC);
        }

        this._popper = new Popper(element, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $$$1(parent).closest(Selector.NAVBAR_NAV).length === 0) {
        $$$1('body').children().on('mouseover', null, $$$1.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $$$1(this._menu).toggleClass(ClassName.SHOW);
      $$$1(parent).toggleClass(ClassName.SHOW).trigger($$$1.Event(Event.SHOWN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      $$$1(this._element).off(EVENT_KEY);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // Private


    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $$$1(this._element).on(Event.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, this.constructor.Default, $$$1(this._element).data(), config);
      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        this._menu = $$$1(parent).find(Selector.MENU)[0];
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $$$1(this._element).parent();
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentDropdown.hasClass(ClassName.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentDropdown.hasClass(ClassName.DROPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($$$1(this._menu).hasClass(ClassName.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $$$1(this._element).closest('.navbar').length > 0;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var _this2 = this;

      var offsetConf = {};

      if (typeof this._config.offset === 'function') {
        offsetConf.fn = function (data) {
          data.offsets = _extends({}, data.offsets, _this2._config.offset(data.offsets) || {});
          return data;
        };
      } else {
        offsetConf.offset = this._config.offset;
      }

      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: offsetConf,
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        }
      };
      return popperConfig;
    }; // Static


    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = $$$1.makeArray($$$1(Selector.DATA_TOGGLE));

      for (var i = 0; i < toggles.length; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $$$1(toggles[i]).data(DATA_KEY);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$$$1(parent).hasClass(ClassName.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $$$1.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $$$1.Event(Event.HIDE, relatedTarget);
        $$$1(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $$$1('body').children().off('mouseover', null, $$$1.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $$$1(dropdownMenu).removeClass(ClassName.SHOW);
        $$$1(parent).removeClass(ClassName.SHOW).trigger($$$1.Event(Event.HIDDEN, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = $$$1(selector)[0];
      }

      return parent || element.parentNode;
    }; // eslint-disable-next-line complexity


    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $$$1(event.target).closest(Selector.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $$$1(this).hasClass(ClassName.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $$$1(parent).hasClass(ClassName.SHOW);

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = $$$1(parent).find(Selector.DATA_TOGGLE)[0];
          $$$1(toggle).trigger('focus');
        }

        $$$1(this).trigger('click');
        return;
      }

      var items = $$$1(parent).find(Selector.VISIBLE_ITEMS).get();

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.KEYDOWN_DATA_API, Selector.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event.KEYDOWN_DATA_API, Selector.MENU, Dropdown._dataApiKeydownHandler).on(Event.CLICK_DATA_API + " " + Event.KEYUP_DATA_API, Dropdown._clearMenus).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($$$1(this), 'toggle');
  }).on(Event.CLICK_DATA_API, Selector.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Dropdown._jQueryInterface;
  $$$1.fn[NAME].Constructor = Dropdown;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Dropdown._jQueryInterface;
  };

  return Dropdown;
}($, Popper);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Modal = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'modal';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.modal';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 300;
  var BACKDROP_TRANSITION_DURATION = 150;
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    RESIZE: "resize" + EVENT_KEY,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    DIALOG: '.modal-dialog',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top',
    NAVBAR_TOGGLER: '.navbar-toggler'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#__PURE__*/
  function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = $$$1(element).find(Selector.DIALOG)[0];
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._originalBodyPadding = 0;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Modal.prototype;

    // Public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isTransitioning || this._isShown) {
        return;
      }

      if (Util.supportsTransitionEnd() && $$$1(this._element).hasClass(ClassName.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $$$1.Event(Event.SHOW, {
        relatedTarget: relatedTarget
      });
      $$$1(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      $$$1(document.body).addClass(ClassName.OPEN);

      this._setEscapeEvent();

      this._setResizeEvent();

      $$$1(this._element).on(Event.CLICK_DISMISS, Selector.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $$$1(this._dialog).on(Event.MOUSEDOWN_DISMISS, function () {
        $$$1(_this._element).one(Event.MOUSEUP_DISMISS, function (event) {
          if ($$$1(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (this._isTransitioning || !this._isShown) {
        return;
      }

      var hideEvent = $$$1.Event(Event.HIDE);
      $$$1(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = Util.supportsTransitionEnd() && $$$1(this._element).hasClass(ClassName.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $$$1(document).off(Event.FOCUSIN);
      $$$1(this._element).removeClass(ClassName.SHOW);
      $$$1(this._element).off(Event.CLICK_DISMISS);
      $$$1(this._dialog).off(Event.MOUSEDOWN_DISMISS);

      if (transition) {
        $$$1(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      $$$1(window, document, this._element, this._backdrop).off(EVENT_KEY);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = Util.supportsTransitionEnd() && $$$1(this._element).hasClass(ClassName.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.scrollTop = 0;

      if (transition) {
        Util.reflow(this._element);
      }

      $$$1(this._element).addClass(ClassName.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $$$1.Event(Event.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $$$1(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        $$$1(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $$$1(document).off(Event.FOCUSIN) // Guard against infinite focus loop
      .on(Event.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $$$1(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $$$1(this._element).on(Event.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $$$1(this._element).off(Event.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $$$1(window).on(Event.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $$$1(window).off(Event.RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $$$1(document.body).removeClass(ClassName.OPEN);

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $$$1(_this7._element).trigger(Event.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $$$1(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $$$1(this._element).hasClass(ClassName.FADE) ? ClassName.FADE : '';

      if (this._isShown && this._config.backdrop) {
        var doAnimate = Util.supportsTransitionEnd() && animate;
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName.BACKDROP;

        if (animate) {
          $$$1(this._backdrop).addClass(animate);
        }

        $$$1(this._backdrop).appendTo(document.body);
        $$$1(this._element).on(Event.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (doAnimate) {
          Util.reflow(this._backdrop);
        }

        $$$1(this._backdrop).addClass(ClassName.SHOW);

        if (!callback) {
          return;
        }

        if (!doAnimate) {
          callback();
          return;
        }

        $$$1(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
      } else if (!this._isShown && this._backdrop) {
        $$$1(this._backdrop).removeClass(ClassName.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if (Util.supportsTransitionEnd() && $$$1(this._element).hasClass(ClassName.FADE)) {
          $$$1(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(BACKDROP_TRANSITION_DURATION);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }; // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------


    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        // Adjust fixed content padding
        $$$1(Selector.FIXED_CONTENT).each(function (index, element) {
          var actualPadding = $$$1(element)[0].style.paddingRight;
          var calculatedPadding = $$$1(element).css('padding-right');
          $$$1(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $$$1(Selector.STICKY_CONTENT).each(function (index, element) {
          var actualMargin = $$$1(element)[0].style.marginRight;
          var calculatedMargin = $$$1(element).css('margin-right');
          $$$1(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust navbar-toggler margin

        $$$1(Selector.NAVBAR_TOGGLER).each(function (index, element) {
          var actualMargin = $$$1(element)[0].style.marginRight;
          var calculatedMargin = $$$1(element).css('margin-right');
          $$$1(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) + _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $$$1('body').css('padding-right');
        $$$1('body').data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      $$$1(Selector.FIXED_CONTENT).each(function (index, element) {
        var padding = $$$1(element).data('padding-right');

        if (typeof padding !== 'undefined') {
          $$$1(element).css('padding-right', padding).removeData('padding-right');
        }
      }); // Restore sticky content and navbar-toggler margin

      $$$1(Selector.STICKY_CONTENT + ", " + Selector.NAVBAR_TOGGLER).each(function (index, element) {
        var margin = $$$1(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $$$1(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $$$1('body').data('padding-right');

      if (typeof padding !== 'undefined') {
        $$$1('body').css('padding-right', padding).removeData('padding-right');
      }
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }; // Static


    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = _extends({}, Modal.Default, $$$1(this).data(), typeof config === 'object' && config);

        if (!data) {
          data = new Modal(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = $$$1(selector)[0];
    }

    var config = $$$1(target).data(DATA_KEY) ? 'toggle' : _extends({}, $$$1(target).data(), $$$1(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $$$1(target).one(Event.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event.HIDDEN, function () {
        if ($$$1(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Modal._jQueryInterface.call($$$1(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Modal._jQueryInterface;
  $$$1.fn[NAME].Constructor = Modal;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Modal._jQueryInterface;
  };

  return Modal;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tooltip = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'tooltip';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.tooltip';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 150;
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DefaultType = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)'
  };
  var AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent'
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    INSERTED: "inserted" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    FOCUSOUT: "focusout" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY
  };
  var ClassName = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip(element, config) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap tooltips require Popper.js (https://popper.js.org)');
      } // private


      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    var _proto = Tooltip.prototype;

    // Public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $$$1(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $$$1(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($$$1(this.getTipElement()).hasClass(ClassName.SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $$$1.removeData(this.element, this.constructor.DATA_KEY);
      $$$1(this.element).off(this.constructor.EVENT_KEY);
      $$$1(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $$$1(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($$$1(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $$$1.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $$$1(this.element).trigger(showEvent);
        var isInTheDom = $$$1.contains(this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $$$1(tip).addClass(ClassName.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);
        var container = this.config.container === false ? document.body : $$$1(this.config.container);
        $$$1(tip).data(this.constructor.DATA_KEY, this);

        if (!$$$1.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $$$1(tip).appendTo(container);
        }

        $$$1(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: {
              offset: this.config.offset
            },
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector.ARROW
            },
            preventOverflow: {
              boundariesElement: this.config.boundary
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            _this._handlePopperPlacementChange(data);
          }
        });
        $$$1(tip).addClass(ClassName.SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $$$1('body').children().on('mouseover', null, $$$1.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $$$1(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if (Util.supportsTransitionEnd() && $$$1(this.tip).hasClass(ClassName.FADE)) {
          $$$1(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(Tooltip._TRANSITION_DURATION);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $$$1.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $$$1(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $$$1(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $$$1(tip).removeClass(ClassName.SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $$$1('body').children().off('mouseover', null, $$$1.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if (Util.supportsTransitionEnd() && $$$1(this.tip).hasClass(ClassName.FADE)) {
        $$$1(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }; // Protected


    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $$$1(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $$$1(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $$$1(this.getTipElement());
      this.setElementContent($tip.find(Selector.TOOLTIP_INNER), this.getTitle());
      $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      var html = this.config.html;

      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (html) {
          if (!$$$1(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($$$1(content).text());
        }
      } else {
        $element[html ? 'html' : 'text'](content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    }; // Private


    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $$$1(_this3.element).on(_this3.constructor.Event.CLICK, _this3.config.selector, function (event) {
            return _this3.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSEENTER : _this3.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this3.constructor.Event.MOUSELEAVE : _this3.constructor.Event.FOCUSOUT;
          $$$1(_this3.element).on(eventIn, _this3.config.selector, function (event) {
            return _this3._enter(event);
          }).on(eventOut, _this3.config.selector, function (event) {
            return _this3._leave(event);
          });
        }

        $$$1(_this3.element).closest('.modal').on('hide.bs.modal', function () {
          return _this3.hide();
        });
      });

      if (this.config.selector) {
        this.config = _extends({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $$$1(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $$$1(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($$$1(context.getTipElement()).hasClass(ClassName.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $$$1(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $$$1(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, this.constructor.Default, $$$1(this.element).data(), config);

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $$$1(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(data) {
      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(data.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $$$1(tip).removeClass(ClassName.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    }; // Static


    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $$$1.fn[NAME] = Tooltip._jQueryInterface;
  $$$1.fn[NAME].Constructor = Tooltip;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tooltip._jQueryInterface;
  };

  return Tooltip;
}($, Popper);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Popover = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'popover';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.popover';
  var EVENT_KEY = "." + DATA_KEY;
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var CLASS_PREFIX = 'bs-popover';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var Default = _extends({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });
  var DefaultType = _extends({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });
  var ClassName = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    INSERTED: "inserted" + EVENT_KEY,
    CLICK: "click" + EVENT_KEY,
    FOCUSIN: "focusin" + EVENT_KEY,
    FOCUSOUT: "focusout" + EVENT_KEY,
    MOUSEENTER: "mouseenter" + EVENT_KEY,
    MOUSELEAVE: "mouseleave" + EVENT_KEY
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#__PURE__*/
  function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype;

    // Overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $$$1(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $$$1(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $$$1(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector.TITLE), this.getTitle());

      var content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(Selector.CONTENT), content);
      $tip.removeClass(ClassName.FADE + " " + ClassName.SHOW);
    }; // Private


    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $$$1(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    }; // Static


    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /destroy|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType;
      }
    }]);
    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $$$1.fn[NAME] = Popover._jQueryInterface;
  $$$1.fn[NAME].Constructor = Popover;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Popover._jQueryInterface;
  };

  return Popover;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var ScrollSpy = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'scrollspy';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.scrollspy';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var Default = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event = {
    ACTIVATE: "activate" + EVENT_KEY,
    SCROLL: "scroll" + EVENT_KEY,
    LOAD_DATA_API: "load" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#__PURE__*/
  function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + Selector.NAV_LINKS + "," + (this._config.target + " " + Selector.LIST_ITEMS + ",") + (this._config.target + " " + Selector.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $$$1(this._scrollElement).on(Event.SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // Getters


    var _proto = ScrollSpy.prototype;

    // Public
    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = $$$1.makeArray($$$1(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = $$$1(targetSelector)[0];
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$$$1(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      $$$1(this._scrollElement).off(EVENT_KEY);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    }; // Private


    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);

      if (typeof config.target !== 'string') {
        var id = $$$1(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME);
          $$$1(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME, config, DefaultType);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (var i = this._offsets.length; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(','); // eslint-disable-next-line arrow-body-style


      queries = queries.map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + (selector + "[href=\"" + target + "\"]");
      });
      var $link = $$$1(queries.join(','));

      if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
        $link.closest(Selector.DROPDOWN).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        $link.addClass(ClassName.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_LINKS + ", " + Selector.LIST_ITEMS).addClass(ClassName.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector.NAV_LIST_GROUP).prev(Selector.NAV_ITEMS).children(Selector.NAV_LINKS).addClass(ClassName.ACTIVE);
      }

      $$$1(this._scrollElement).trigger(Event.ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      $$$1(this._selector).filter(Selector.ACTIVE).removeClass(ClassName.ACTIVE);
    }; // Static


    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $$$1(this).data(DATA_KEY);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $$$1(this).data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);
    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(window).on(Event.LOAD_DATA_API, function () {
    var scrollSpys = $$$1.makeArray($$$1(Selector.DATA_SPY));

    for (var i = scrollSpys.length; i--;) {
      var $spy = $$$1(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = ScrollSpy._jQueryInterface;
  $$$1.fn[NAME].Constructor = ScrollSpy;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return ScrollSpy._jQueryInterface;
  };

  return ScrollSpy;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Tab = function ($$$1) {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  var NAME = 'tab';
  var VERSION = '4.0.0';
  var DATA_KEY = 'bs.tab';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
  var TRANSITION_DURATION = 150;
  var Event = {
    HIDE: "hide" + EVENT_KEY,
    HIDDEN: "hidden" + EVENT_KEY,
    SHOW: "show" + EVENT_KEY,
    SHOWN: "shown" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector = {
    DROPDOWN: '.dropdown',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $$$1(this._element).hasClass(ClassName.ACTIVE) || $$$1(this._element).hasClass(ClassName.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $$$1(this._element).closest(Selector.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' ? Selector.ACTIVE_UL : Selector.ACTIVE;
        previous = $$$1.makeArray($$$1(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $$$1.Event(Event.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $$$1.Event(Event.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $$$1(previous).trigger(hideEvent);
      }

      $$$1(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = $$$1(selector)[0];
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $$$1.Event(Event.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $$$1.Event(Event.SHOWN, {
          relatedTarget: previous
        });
        $$$1(previous).trigger(hiddenEvent);
        $$$1(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $$$1.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private


    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements;

      if (container.nodeName === 'UL') {
        activeElements = $$$1(container).find(Selector.ACTIVE_UL);
      } else {
        activeElements = $$$1(container).children(Selector.ACTIVE);
      }

      var active = activeElements[0];
      var isTransitioning = callback && Util.supportsTransitionEnd() && active && $$$1(active).hasClass(ClassName.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        $$$1(active).one(Util.TRANSITION_END, complete).emulateTransitionEnd(TRANSITION_DURATION);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $$$1(active).removeClass(ClassName.SHOW + " " + ClassName.ACTIVE);
        var dropdownChild = $$$1(active.parentNode).find(Selector.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $$$1(dropdownChild).removeClass(ClassName.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $$$1(element).addClass(ClassName.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);
      $$$1(element).addClass(ClassName.SHOW);

      if (element.parentNode && $$$1(element.parentNode).hasClass(ClassName.DROPDOWN_MENU)) {
        var dropdownElement = $$$1(element).closest(Selector.DROPDOWN)[0];

        if (dropdownElement) {
          $$$1(dropdownElement).find(Selector.DROPDOWN_TOGGLE).addClass(ClassName.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    }; // Static


    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $$$1(this);
        var data = $this.data(DATA_KEY);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);
    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($$$1(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $$$1.fn[NAME] = Tab._jQueryInterface;
  $$$1.fn[NAME].Constructor = Tab;

  $$$1.fn[NAME].noConflict = function () {
    $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  return Tab;
}($);

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

(function ($$$1) {
  if (typeof $$$1 === 'undefined') {
    throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
  }

  var version = $$$1.fn.jquery.split(' ')[0].split('.');
  var minMajor = 1;
  var ltMajor = 2;
  var minMinor = 9;
  var minPatch = 1;
  var maxMajor = 4;

  if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
    throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
  }
})($);

exports.Util = Util;
exports.Alert = Alert;
exports.Button = Button;
exports.Carousel = Carousel;
exports.Collapse = Collapse;
exports.Dropdown = Dropdown;
exports.Modal = Modal;
exports.Popover = Popover;
exports.Scrollspy = ScrollSpy;
exports.Tab = Tab;
exports.Tooltip = Tooltip;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bootstrap.bundle.js.map

;/**
 * jQuery Editable Select
 * Indri Muska <indrimuska@gmail.com>
 *
 * Source on GitHub @ https://github.com/indrimuska/jquery-editable-select
 */

(function ($) {
	// jQuery Editable Select
	EditableSelect = function (select, options) {
		var that     = this;
		
		this.options = options;
		this.$select = $(select);
		this.$input  = $('<input type="text" autocomplete="off">');
		this.$list   = $('<ul class="es-list">');
		this.utility = new EditableSelectUtility(this);
		
		if (['focus', 'manual'].indexOf(this.options.trigger) < 0) this.options.trigger = 'focus';
		if (['default', 'fade', 'slide'].indexOf(this.options.effects) < 0) this.options.effects = 'default';
		if (isNaN(this.options.duration) && ['fast', 'slow'].indexOf(this.options.duration) < 0) this.options.duration = 'fast';
		
		// create text input
		this.$select.replaceWith(this.$input);
		this.$list.appendTo(this.options.appendTo || this.$input.parent());
		
		// initalization
		this.utility.initialize();
		this.utility.initializeList();
		this.utility.initializeInput();
		this.utility.trigger('created');
	}
	EditableSelect.DEFAULTS = { filter: true, effects: 'default', duration: 'fast', trigger: 'focus' };
	EditableSelect.prototype.filter = function () {
		var hiddens = 0;
		var search  = this.$input.val().toLowerCase().trim();
		
		this.$list.find('li').addClass('es-visible').show();
		if (this.options.filter) {
			hiddens = this.$list.find('li').filter(function (i, li) { return $(li).text().toLowerCase().indexOf(search) < 0; }).hide().removeClass('es-visible').length;
			if (this.$list.find('li').length == hiddens) this.hide();
		}
	};
	EditableSelect.prototype.show = function () {
		this.$list.css({
			top:   this.$input.position().top + this.$input.outerHeight() - 1,
			left:  this.$input.position().left,
			width: this.$input.outerWidth()
		});
		
		if (!this.$list.is(':visible') && this.$list.find('li.es-visible').length > 0) {
			var fns = { default: 'show', fade: 'fadeIn', slide: 'slideDown' };
			var fn  = fns[this.options.effects];
			
			this.utility.trigger('show');
			this.$input.addClass('open');
			this.$list[fn](this.options.duration, $.proxy(this.utility.trigger, this.utility, 'shown'));
		}
	};
	EditableSelect.prototype.hide = function () {
		var fns = { default: 'hide', fade: 'fadeOut', slide: 'slideUp' };
		var fn  = fns[this.options.effects];
		
		this.utility.trigger('hide');
		this.$input.removeClass('open');
		this.$list[fn](this.options.duration, $.proxy(this.utility.trigger, this.utility, 'hidden'));
	};
	EditableSelect.prototype.select = function ($li) {
		if (!this.$list.has($li) || !$li.is('li.es-visible:not([disabled])')) return;
		this.$input.val($li.text());
		if (this.options.filter) this.hide();
		this.filter();
		this.utility.trigger('select', $li);
	};
	EditableSelect.prototype.add = function (text, index, attrs, data) {
		var $li     = $('<li>').html(text);
		var $option = $('<option>').text(text);
		var last    = this.$list.find('li').length;
		
		if (isNaN(index)) index = last;
		else index = Math.min(Math.max(0, index), last);
		if (index == 0) {
		  this.$list.prepend($li);
		  this.$select.prepend($option);
		} else {
		  this.$list.find('li').eq(index - 1).after($li);
		  this.$select.find('option').eq(index - 1).after($option);
		}
		this.utility.setAttributes($li, attrs, data);
		this.utility.setAttributes($option, attrs, data);
		this.filter();
	};
	EditableSelect.prototype.remove = function (index) {
		var last = this.$list.find('li').length;
		
		if (isNaN(index)) index = last;
		else index = Math.min(Math.max(0, index), last - 1);
		this.$list.find('li').eq(index).remove();
		this.$select.find('option').eq(index).remove();
		this.filter();
	};
	EditableSelect.prototype.clear = function () {
		this.$list.find('li').remove();
		this.$select.find('option').remove();
		this.filter();
	};
	EditableSelect.prototype.destroy = function () {
		this.$list.off('mousemove mousedown mouseup');
		this.$input.off('focus blur input keydown');
		this.$input.replaceWith(this.$select);
		this.$list.remove();
		this.$select.removeData('editable-select');
	};
	
	// Utility
	EditableSelectUtility = function (es) {
		this.es = es;
	}
	EditableSelectUtility.prototype.initialize = function () {
		var that = this;
		that.setAttributes(that.es.$input, that.es.$select[0].attributes, that.es.$select.data());
		that.es.$input.addClass('es-input').data('editable-select', that.es);
		that.es.$select.find('option').each(function (i, option) {
			var $option = $(option).remove();
			that.es.add($option.text(), i, option.attributes, $option.data());
			if ($option.attr('selected')) that.es.$input.val($option.text());
		});
		that.es.filter();
	};
	EditableSelectUtility.prototype.initializeList = function () {
		var that = this;
		that.es.$list
			.on('mousemove', 'li:not([disabled])', function () {
				that.es.$list.find('.selected').removeClass('selected');
				$(this).addClass('selected');
			})
			.on('mousedown', 'li', function (e) {
				if ($(this).is('[disabled]')) e.preventDefault();
				else that.es.select($(this));
			})
			.on('mouseup', function () {
				that.es.$list.find('li.selected').removeClass('selected');
			});
	};
	EditableSelectUtility.prototype.initializeInput = function () {
		var that = this;
		switch (this.es.options.trigger) {
			default:
			case 'focus':
				that.es.$input
					.on('focus', $.proxy(that.es.show, that.es))
					.on('blur', $.proxy(that.es.hide, that.es));
				break;
			case 'manual':
				break;
		}
		that.es.$input.on('input keydown', function (e) {
			switch (e.keyCode) {
				case 38: // Up
					var visibles = that.es.$list.find('li.es-visible:not([disabled])');
					var selectedIndex = visibles.index(visibles.filter('li.selected'));
					that.highlight(selectedIndex - 1);
					e.preventDefault();
					break;
				case 40: // Down
					var visibles = that.es.$list.find('li.es-visible:not([disabled])');
					var selectedIndex = visibles.index(visibles.filter('li.selected'));
					that.highlight(selectedIndex + 1);
					e.preventDefault();
					break;
				case 13: // Enter
					if (that.es.$list.is(':visible')) {
						that.es.select(that.es.$list.find('li.selected'));
						e.preventDefault();
					}
					break;
				case 9:  // Tab
				case 27: // Esc
					that.es.hide();
					break;
				default:
					that.es.filter();
					that.highlight(0);
					break;
			}
		});
	};
	EditableSelectUtility.prototype.highlight = function (index) {
		var that = this;
		that.es.show();
		setTimeout(function () {
			var visibles         = that.es.$list.find('li.es-visible');
			var oldSelected      = that.es.$list.find('li.selected').removeClass('selected');
			var oldSelectedIndex = visibles.index(oldSelected);
			
			if (visibles.length > 0) {
				var selectedIndex = (visibles.length + index) % visibles.length;
				var selected      = visibles.eq(selectedIndex);
				var top           = selected.position().top;
				
				selected.addClass('selected');
				if (selectedIndex < oldSelectedIndex && top < 0)
					that.es.$list.scrollTop(that.es.$list.scrollTop() + top);
				if (selectedIndex > oldSelectedIndex && top + selected.outerHeight() > that.es.$list.outerHeight())
					that.es.$list.scrollTop(that.es.$list.scrollTop() + selected.outerHeight() + 2 * (top - that.es.$list.outerHeight()));
			}
		});
	};
	EditableSelectUtility.prototype.setAttributes = function ($element, attrs, data) {
		$.each(attrs || {}, function (i, attr) { $element.attr(attr.name, attr.value); });
		$element.data(data);
	};
	EditableSelectUtility.prototype.trigger = function (event) {
		var params = Array.prototype.slice.call(arguments, 1);
		var args   = [event + '.editable-select'];
		args.push(params);
		this.es.$select.trigger.apply(this.es.$select, args);
		this.es.$input.trigger.apply(this.es.$input, args);
	};
	
	// Plugin
	Plugin = function (option) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.each(function () {
			var $this   = $(this);
			var data    = $this.data('editable-select');
			var options = $.extend({}, EditableSelect.DEFAULTS, $this.data(), typeof option == 'object' && option);
			
			if (!data) data = new EditableSelect(this, options);
			if (typeof option == 'string') data[option].apply(data, args);
		});
	}
	$.fn.editableSelect             = Plugin;
	$.fn.editableSelect.Constructor = EditableSelect;
	
})(jQuery);
/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

var oldBrowser=document.all&&!document.addEventListener;if(!oldBrowser){(function(be,H){var r,ao,al=be.document,bp=be.location,bu=be.navigator,ay=be.JQXLite,Y=be.$,aS=Array.prototype.push,aE=Array.prototype.slice,aB=Array.prototype.indexOf,z=Object.prototype.toString,b=Object.prototype.hasOwnProperty,ax=String.prototype.trim,D=function(bv,bw){return new D.fn.init(bv,bw,r)},aF=/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,au=/\S/,a9=/\s+/,T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,aG=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,e=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,k=/^[\],:{}\s]*$/,u=/(?:^|:|,)(?:\s*\[)+/g,a6=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,L=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,av=/^-ms-/,aT=/-([\da-z])/gi,n=function(bv,bw){return(bw+"").toUpperCase()},a5=function(){if(al.addEventListener){al.removeEventListener("DOMContentLoaded",a5,false);D.ready()}else{if(al.readyState==="complete"){al.detachEvent("onreadystatechange",a5);D.ready()}}},a1={};D.fn=D.prototype={constructor:D,init:function(bv,by,bz){var bx,bA,bw,bB;if(!bv){return this}if(bv.nodeType){this.context=this[0]=bv;this.length=1;return this}if(typeof bv==="string"){if(bv.charAt(0)==="<"&&bv.charAt(bv.length-1)===">"&&bv.length>=3){bx=[null,bv,null]}else{bx=aG.exec(bv)}if(bx&&(bx[1]||!by)){if(bx[1]){by=by instanceof D?by[0]:by;bB=(by&&by.nodeType?by.ownerDocument||by:al);bv=D.parseHTML(bx[1],bB,true);if(e.test(bx[1])&&D.isPlainObject(by)){this.attr.call(bv,by,true)}return D.merge(this,bv)}else{bA=al.getElementById(bx[2]);if(bA&&bA.parentNode){if(bA.id!==bx[2]){return bz.find(bv)}this.length=1;this[0]=bA}this.context=al;this.selector=bv;return this}}else{if(!by||by.jqx){return(by||bz).find(bv)}else{return this.constructor(by).find(bv)}}}else{if(D.isFunction(bv)){return bz.ready(bv)}}if(bv.selector!==H){this.selector=bv.selector;this.context=bv.context}return D.makeArray(bv,this)},selector:"",jqx:"4.5.0",length:0,size:function(){return this.length},toArray:function(){return aE.call(this)},get:function(bv){return bv==null?this.toArray():(bv<0?this[this.length+bv]:this[bv])},pushStack:function(bw,by,bv){var bx=D.merge(this.constructor(),bw);bx.prevObject=this;bx.context=this.context;if(by==="find"){bx.selector=this.selector+(this.selector?" ":"")+bv}else{if(by){bx.selector=this.selector+"."+by+"("+bv+")"}}return bx},each:function(bw,bv){return D.each(this,bw,bv)},ready:function(bv){D.ready.promise().done(bv);return this},eq:function(bv){bv=+bv;return bv===-1?this.slice(bv):this.slice(bv,bv+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(aE.apply(this,arguments),"slice",aE.call(arguments).join(","))},map:function(bv){return this.pushStack(D.map(this,function(bx,bw){return bv.call(bx,bw,bx)}))},end:function(){return this.prevObject||this.constructor(null)},push:aS,sort:[].sort,splice:[].splice};D.fn.init.prototype=D.fn;D.extend=D.fn.extend=function(){var bE,bx,bv,bw,bB,bC,bA=arguments[0]||{},bz=1,by=arguments.length,bD=false;if(typeof bA==="boolean"){bD=bA;bA=arguments[1]||{};bz=2}if(typeof bA!=="object"&&!D.isFunction(bA)){bA={}}if(by===bz){bA=this;--bz}for(;bz<by;bz++){if((bE=arguments[bz])!=null){for(bx in bE){bv=bA[bx];bw=bE[bx];if(bA===bw){continue}if(bD&&bw&&(D.isPlainObject(bw)||(bB=D.isArray(bw)))){if(bB){bB=false;bC=bv&&D.isArray(bv)?bv:[]}else{bC=bv&&D.isPlainObject(bv)?bv:{}}bA[bx]=D.extend(bD,bC,bw)}else{if(bw!==H){bA[bx]=bw}}}}}return bA};D.extend({noConflict:function(bv){if(be.$===D){be.$=Y}if(bv&&be.JQXLite===D){be.JQXLite=ay}return D},isReady:false,readyWait:1,holdReady:function(bv){if(bv){D.readyWait++}else{D.ready(true)}},ready:function(bv){if(bv===true?--D.readyWait:D.isReady){return}if(!al.body){return setTimeout(D.ready,1)}D.isReady=true;if(bv!==true&&--D.readyWait>0){return}ao.resolveWith(al,[D]);if(D.fn.trigger){D(al).trigger("ready").off("ready")}},isFunction:function(bv){return D.type(bv)==="function"},isArray:Array.isArray||function(bv){return D.type(bv)==="array"},isWindow:function(bv){return bv!=null&&bv==bv.window},isNumeric:function(bv){return !isNaN(parseFloat(bv))&&isFinite(bv)},type:function(bv){return bv==null?String(bv):a1[z.call(bv)]||"object"},isPlainObject:function(bx){if(!bx||D.type(bx)!=="object"||bx.nodeType||D.isWindow(bx)){return false}try{if(bx.constructor&&!b.call(bx,"constructor")&&!b.call(bx.constructor.prototype,"isPrototypeOf")){return false}}catch(bw){return false}var bv;for(bv in bx){}return bv===H||b.call(bx,bv)},isEmptyObject:function(bw){var bv;for(bv in bw){return false}return true},error:function(bv){throw new Error(bv)},parseHTML:function(by,bx,bv){var bw;if(!by||typeof by!=="string"){return null}if(typeof bx==="boolean"){bv=bx;bx=0}bx=bx||al;if((bw=e.exec(by))){return[bx.createElement(bw[1])]}bw=D.buildFragment([by],bx,bv?null:[]);return D.merge([],(bw.cacheable?D.clone(bw.fragment):bw.fragment).childNodes)},parseJSON:function(bv){if(!bv||typeof bv!=="string"){return null}bv=D.trim(bv);if(be.JSON&&be.JSON.parse){return be.JSON.parse(bv)}if(k.test(bv.replace(a6,"@").replace(L,"]").replace(u,""))){return(new Function("return "+bv))()}D.error("Invalid JSON: "+bv)},parseXML:function(bx){var bv,bw;if(!bx||typeof bx!=="string"){return null}try{if(be.DOMParser){bw=new DOMParser();bv=bw.parseFromString(bx,"text/xml")}else{bv=new ActiveXObject("Microsoft.XMLDOM");bv.async="false";bv.loadXML(bx)}}catch(by){bv=H}if(!bv||!bv.documentElement||bv.getElementsByTagName("parsererror").length){D.error("Invalid XML: "+bx)}return bv},noop:function(){},globalEval:function(bv){if(bv&&au.test(bv)){(be.execScript||function(bw){be["eval"].call(be,bw)})(bv)}},camelCase:function(bv){return bv.replace(av,"ms-").replace(aT,n)},nodeName:function(bw,bv){return bw.nodeName&&bw.nodeName.toLowerCase()===bv.toLowerCase()},each:function(bA,bB,bx){var bw,by=0,bz=bA.length,bv=bz===H||D.isFunction(bA);if(bx){if(bv){for(bw in bA){if(bB.apply(bA[bw],bx)===false){break}}}else{for(;by<bz;){if(bB.apply(bA[by++],bx)===false){break}}}}else{if(bv){for(bw in bA){if(bB.call(bA[bw],bw,bA[bw])===false){break}}}else{for(;by<bz;){if(bB.call(bA[by],by,bA[by++])===false){break}}}}return bA},trim:ax&&!ax.call("\uFEFF\xA0")?function(bv){return bv==null?"":ax.call(bv)}:function(bv){return bv==null?"":(bv+"").replace(T,"")},makeArray:function(bv,bx){var by,bw=bx||[];if(bv!=null){by=D.type(bv);if(bv.length==null||by==="string"||by==="function"||by==="regexp"||D.isWindow(bv)){aS.call(bw,bv)}else{D.merge(bw,bv)}}return bw},inArray:function(by,bw,bx){var bv;if(bw){if(aB){return aB.call(bw,by,bx)}bv=bw.length;bx=bx?bx<0?Math.max(0,bv+bx):bx:0;for(;bx<bv;bx++){if(bx in bw&&bw[bx]===by){return bx}}}return -1},merge:function(bz,bx){var bv=bx.length,by=bz.length,bw=0;if(typeof bv==="number"){for(;bw<bv;bw++){bz[by++]=bx[bw]}}else{while(bx[bw]!==H){bz[by++]=bx[bw++]}}bz.length=by;return bz},grep:function(bw,bB,bv){var bA,bx=[],by=0,bz=bw.length;bv=!!bv;for(;by<bz;by++){bA=!!bB(bw[by],by);if(bv!==bA){bx.push(bw[by])}}return bx},map:function(bv,bC,bD){var bA,bB,bz=[],bx=0,bw=bv.length,by=bv instanceof D||bw!==H&&typeof bw==="number"&&((bw>0&&bv[0]&&bv[bw-1])||bw===0||D.isArray(bv));if(by){for(;bx<bw;bx++){bA=bC(bv[bx],bx,bD);if(bA!=null){bz[bz.length]=bA}}}else{for(bB in bv){bA=bC(bv[bB],bB,bD);if(bA!=null){bz[bz.length]=bA}}}return bz.concat.apply([],bz)},guid:1,proxy:function(bz,by){var bx,bv,bw;if(typeof by==="string"){bx=bz[by];by=bz;bz=bx}if(!D.isFunction(bz)){return H}bv=aE.call(arguments,2);bw=function(){return bz.apply(by,bv.concat(aE.call(arguments)))};bw.guid=bz.guid=bz.guid||D.guid++;return bw},access:function(bv,bB,bE,bC,bz,bF,bD){var bx,bA=bE==null,by=0,bw=bv.length;if(bE&&typeof bE==="object"){for(by in bE){D.access(bv,bB,by,bE[by],1,bF,bC)}bz=1}else{if(bC!==H){bx=bD===H&&D.isFunction(bC);if(bA){if(bx){bx=bB;bB=function(bH,bG,bI){return bx.call(D(bH),bI)}}else{bB.call(bv,bC);bB=null}}if(bB){for(;by<bw;by++){bB(bv[by],bE,bx?bC.call(bv[by],by,bB(bv[by],bE)):bC,bD)}}bz=1}}return bz?bv:bA?bB.call(bv):bw?bB(bv[0],bE):bF},now:function(){return(new Date()).getTime()}});D.ready.promise=function(by){if(!ao){ao=D.Deferred();if(al.readyState==="complete"){setTimeout(D.ready,1)}else{if(al.addEventListener){al.addEventListener("DOMContentLoaded",a5,false);be.addEventListener("load",D.ready,false)}else{al.attachEvent("onreadystatechange",a5);be.attachEvent("onload",D.ready);var bx=false;try{bx=be.frameElement==null&&al.documentElement}catch(bw){}if(bx&&bx.doScroll){(function bv(){if(!D.isReady){try{bx.doScroll("left")}catch(bz){return setTimeout(bv,50)}D.ready()}})()}}}}return ao.promise(by)};D.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(bw,bv){a1["[object "+bv+"]"]=bv.toLowerCase()});r=D(al);var aY={};function C(bw){var bv=aY[bw]={};D.each(bw.split(a9),function(by,bx){bv[bx]=true});return bv}D.Callbacks=function(bF){bF=typeof bF==="string"?(aY[bF]||C(bF)):D.extend({},bF);var by,bv,bz,bx,bA,bB,bC=[],bD=!bF.once&&[],bw=function(bG){by=bF.memory&&bG;bv=true;bB=bx||0;bx=0;bA=bC.length;bz=true;for(;bC&&bB<bA;bB++){if(bC[bB].apply(bG[0],bG[1])===false&&bF.stopOnFalse){by=false;break}}bz=false;if(bC){if(bD){if(bD.length){bw(bD.shift())}}else{if(by){bC=[]}else{bE.disable()}}}},bE={add:function(){if(bC){var bH=bC.length;(function bG(bI){D.each(bI,function(bK,bJ){var bL=D.type(bJ);if(bL==="function"){if(!bF.unique||!bE.has(bJ)){bC.push(bJ)}}else{if(bJ&&bJ.length&&bL!=="string"){bG(bJ)}}})})(arguments);if(bz){bA=bC.length}else{if(by){bx=bH;bw(by)}}}return this},remove:function(){if(bC){D.each(arguments,function(bI,bG){var bH;while((bH=D.inArray(bG,bC,bH))>-1){bC.splice(bH,1);if(bz){if(bH<=bA){bA--}if(bH<=bB){bB--}}}})}return this},has:function(bG){return D.inArray(bG,bC)>-1},empty:function(){bC=[];return this},disable:function(){bC=bD=by=H;return this},disabled:function(){return !bC},lock:function(){bD=H;if(!by){bE.disable()}return this},locked:function(){return !bD},fireWith:function(bH,bG){bG=bG||[];bG=[bH,bG.slice?bG.slice():bG];if(bC&&(!bv||bD)){if(bz){bD.push(bG)}else{bw(bG)}}return this},fire:function(){bE.fireWith(this,arguments);return this},fired:function(){return !!bv}};return bE};D.extend({Deferred:function(bx){var bw=[["resolve","done",D.Callbacks("once memory"),"resolved"],["reject","fail",D.Callbacks("once memory"),"rejected"],["notify","progress",D.Callbacks("memory")]],by="pending",bz={state:function(){return by},always:function(){bv.done(arguments).fail(arguments);return this},then:function(){var bA=arguments;return D.Deferred(function(bB){D.each(bw,function(bD,bC){var bF=bC[0],bE=bA[bD];bv[bC[1]](D.isFunction(bE)?function(){var bG=bE.apply(this,arguments);if(bG&&D.isFunction(bG.promise)){bG.promise().done(bB.resolve).fail(bB.reject).progress(bB.notify)}else{bB[bF+"With"](this===bv?bB:this,[bG])}}:bB[bF])});bA=null}).promise()},promise:function(bA){return bA!=null?D.extend(bA,bz):bz}},bv={};bz.pipe=bz.then;D.each(bw,function(bB,bA){var bD=bA[2],bC=bA[3];bz[bA[1]]=bD.add;if(bC){bD.add(function(){by=bC},bw[bB^1][2].disable,bw[2][2].lock)}bv[bA[0]]=bD.fire;bv[bA[0]+"With"]=bD.fireWith});bz.promise(bv);if(bx){bx.call(bv,bv)}return bv},when:function(bz){var bx=0,bB=aE.call(arguments),bv=bB.length,bw=bv!==1||(bz&&D.isFunction(bz.promise))?bv:0,bE=bw===1?bz:D.Deferred(),by=function(bG,bH,bF){return function(bI){bH[bG]=this;bF[bG]=arguments.length>1?aE.call(arguments):bI;if(bF===bD){bE.notifyWith(bH,bF)}else{if(!(--bw)){bE.resolveWith(bH,bF)}}}},bD,bA,bC;if(bv>1){bD=new Array(bv);bA=new Array(bv);bC=new Array(bv);for(;bx<bv;bx++){if(bB[bx]&&D.isFunction(bB[bx].promise)){bB[bx].promise().done(by(bx,bC,bB)).fail(bE.reject).progress(by(bx,bA,bD))}else{--bw}}}if(!bw){bE.resolveWith(bC,bB)}return bE.promise()}});D.support=(function(){var bH,bG,bE,bF,by,bD,bC,bA,bz,bx,bv,bw=al.createElement("div");bw.setAttribute("className","t");bw.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";bG=bw.getElementsByTagName("*");bE=bw.getElementsByTagName("a")[0];if(!bG||!bE||!bG.length){return{}}bF=al.createElement("select");by=bF.appendChild(al.createElement("option"));bD=bw.getElementsByTagName("input")[0];bE.style.cssText="top:1px;float:left;opacity:.5";bH={leadingWhitespace:(bw.firstChild.nodeType===3),tbody:!bw.getElementsByTagName("tbody").length,htmlSerialize:!!bw.getElementsByTagName("link").length,style:/top/.test(bE.getAttribute("style")),hrefNormalized:(bE.getAttribute("href")==="/a"),opacity:/^0.5/.test(bE.style.opacity),cssFloat:!!bE.style.cssFloat,checkOn:(bD.value==="on"),optSelected:by.selected,getSetAttribute:bw.className!=="t",enctype:!!al.createElement("form").enctype,html5Clone:al.createElement("nav").cloneNode(true).outerHTML!=="<:nav></:nav>",boxModel:(al.compatMode==="CSS1Compat"),submitBubbles:true,changeBubbles:true,focusinBubbles:false,deleteExpando:true,noCloneEvent:true,inlineBlockNeedsLayout:false,shrinkWrapBlocks:false,reliableMarginRight:true,boxSizingReliable:true,pixelPosition:false};bD.checked=true;bH.noCloneChecked=bD.cloneNode(true).checked;bF.disabled=true;bH.optDisabled=!by.disabled;try{delete bw.test}catch(bB){bH.deleteExpando=false}if(!bw.addEventListener&&bw.attachEvent&&bw.fireEvent){bw.attachEvent("onclick",bv=function(){bH.noCloneEvent=false});bw.cloneNode(true).fireEvent("onclick");bw.detachEvent("onclick",bv)}bD=al.createElement("input");bD.value="t";bD.setAttribute("type","radio");bH.radioValue=bD.value==="t";bD.setAttribute("checked","checked");bD.setAttribute("name","t");bw.appendChild(bD);bC=al.createDocumentFragment();bC.appendChild(bw.lastChild);bH.checkClone=bC.cloneNode(true).cloneNode(true).lastChild.checked;bH.appendChecked=bD.checked;bC.removeChild(bD);bC.appendChild(bw);if(bw.attachEvent){for(bz in {submit:true,change:true,focusin:true}){bA="on"+bz;bx=(bA in bw);if(!bx){bw.setAttribute(bA,"return;");bx=(typeof bw[bA]==="function")}bH[bz+"Bubbles"]=bx}}D(function(){var bJ,bN,bL,bM,bK="padding:0;margin:0;border:0;display:block;overflow:hidden;",bI=al.getElementsByTagName("body")[0];if(!bI){return}bJ=al.createElement("div");bJ.style.cssText="visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";bI.insertBefore(bJ,bI.firstChild);bN=al.createElement("div");bJ.appendChild(bN);bN.innerHTML="<table><tr><td></td><td>t</td></tr></table>";bL=bN.getElementsByTagName("td");bL[0].style.cssText="padding:0;margin:0;border:0;display:none";bx=(bL[0].offsetHeight===0);bL[0].style.display="";bL[1].style.display="none";bH.reliableHiddenOffsets=bx&&(bL[0].offsetHeight===0);bN.innerHTML="";bN.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";bH.boxSizing=(bN.offsetWidth===4);bH.doesNotIncludeMarginInBodyOffset=(bI.offsetTop!==1);if(be.getComputedStyle){bH.pixelPosition=(be.getComputedStyle(bN,null)||{}).top!=="1%";bH.boxSizingReliable=(be.getComputedStyle(bN,null)||{width:"4px"}).width==="4px";bM=al.createElement("div");bM.style.cssText=bN.style.cssText=bK;bM.style.marginRight=bM.style.width="0";bN.style.width="1px";bN.appendChild(bM);bH.reliableMarginRight=!parseFloat((be.getComputedStyle(bM,null)||{}).marginRight)}if(typeof bN.style.zoom!=="undefined"){bN.innerHTML="";bN.style.cssText=bK+"width:1px;padding:1px;display:inline;zoom:1";bH.inlineBlockNeedsLayout=(bN.offsetWidth===3);bN.style.display="block";bN.style.overflow="visible";bN.innerHTML="<div></div>";bN.firstChild.style.width="5px";bH.shrinkWrapBlocks=(bN.offsetWidth!==3);bJ.style.zoom=1}bI.removeChild(bJ);bJ=bN=bL=bM=null});bC.removeChild(bw);bG=bE=bF=by=bD=bC=bw=null;return bH})();var aL=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,ar=/([A-Z])/g;D.extend({cache:{},deletedIds:[],uuid:0,expando:"JQXLite"+(D.fn.jqx+Math.random()).replace(/\D/g,""),noData:{embed:true,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:true},hasData:function(bv){bv=bv.nodeType?D.cache[bv[D.expando]]:bv[D.expando];return !!bv&&!N(bv)},data:function(by,bw,bA,bz){if(!D.acceptData(by)){return}var bB,bD,bE=D.expando,bC=typeof bw==="string",bF=by.nodeType,bv=bF?D.cache:by,bx=bF?by[bE]:by[bE]&&bE;if((!bx||!bv[bx]||(!bz&&!bv[bx].data))&&bC&&bA===H){return}if(!bx){if(bF){by[bE]=bx=D.deletedIds.pop()||D.guid++}else{bx=bE}}if(!bv[bx]){bv[bx]={};if(!bF){bv[bx].toJSON=D.noop}}if(typeof bw==="object"||typeof bw==="function"){if(bz){bv[bx]=D.extend(bv[bx],bw)}else{bv[bx].data=D.extend(bv[bx].data,bw)}}bB=bv[bx];if(!bz){if(!bB.data){bB.data={}}bB=bB.data}if(bA!==H){bB[D.camelCase(bw)]=bA}if(bC){bD=bB[bw];if(bD==null){bD=bB[D.camelCase(bw)]}}else{bD=bB}return bD},removeData:function(by,bw,bz){if(!D.acceptData(by)){return}var bC,bB,bA,bD=by.nodeType,bv=bD?D.cache:by,bx=bD?by[D.expando]:D.expando;if(!bv[bx]){return}if(bw){bC=bz?bv[bx]:bv[bx].data;if(bC){if(!D.isArray(bw)){if(bw in bC){bw=[bw]}else{bw=D.camelCase(bw);if(bw in bC){bw=[bw]}else{bw=bw.split(" ")}}}for(bB=0,bA=bw.length;bB<bA;bB++){delete bC[bw[bB]]}if(!(bz?N:D.isEmptyObject)(bC)){return}}}if(!bz){delete bv[bx].data;if(!N(bv[bx])){return}}if(bD){D.cleanData([by],true)}else{if(D.support.deleteExpando||bv!=bv.window){delete bv[bx]}else{bv[bx]=null}}},_data:function(bw,bv,bx){return D.data(bw,bv,bx,true)},acceptData:function(bw){var bv=bw.nodeName&&D.noData[bw.nodeName.toLowerCase()];return !bv||bv!==true&&bw.getAttribute("classid")===bv}});D.fn.extend({data:function(bE,bD){var bz,bw,bC,bv,by,bx=this[0],bB=0,bA=null;if(bE===H){if(this.length){bA=D.data(bx);if(bx.nodeType===1&&!D._data(bx,"parsedAttrs")){bC=bx.attributes;for(by=bC.length;bB<by;bB++){bv=bC[bB].name;if(!bv.indexOf("data-")){bv=D.camelCase(bv.substring(5));ba(bx,bv,bA[bv])}}D._data(bx,"parsedAttrs",true)}}return bA}if(typeof bE==="object"){return this.each(function(){D.data(this,bE)})}bz=bE.split(".",2);bz[1]=bz[1]?"."+bz[1]:"";bw=bz[1]+"!";return D.access(this,function(bF){if(bF===H){bA=this.triggerHandler("getData"+bw,[bz[0]]);if(bA===H&&bx){bA=D.data(bx,bE);bA=ba(bx,bE,bA)}return bA===H&&bz[1]?this.data(bz[0]):bA}bz[1]=bF;this.each(function(){var bG=D(this);bG.triggerHandler("setData"+bw,bz);D.data(this,bE,bF);bG.triggerHandler("changeData"+bw,bz)})},null,bD,arguments.length>1,null,false)},removeData:function(bv){return this.each(function(){D.removeData(this,bv)})}});function ba(bx,bw,by){if(by===H&&bx.nodeType===1){var bv="data-"+bw.replace(ar,"-$1").toLowerCase();by=bx.getAttribute(bv);if(typeof by==="string"){try{by=by==="true"?true:by==="false"?false:by==="null"?null:+by+""===by?+by:aL.test(by)?D.parseJSON(by):by}catch(bz){}D.data(bx,bw,by)}else{by=H}}return by}function N(bw){var bv;for(bv in bw){if(bv==="data"&&D.isEmptyObject(bw[bv])){continue}if(bv!=="toJSON"){return false}}return true}D.extend({queue:function(bx,bw,by){var bv;if(bx){bw=(bw||"fx")+"queue";bv=D._data(bx,bw);if(by){if(!bv||D.isArray(by)){bv=D._data(bx,bw,D.makeArray(by))}else{bv.push(by)}}return bv||[]}},dequeue:function(bA,bz){bz=bz||"fx";var bw=D.queue(bA,bz),bB=bw.length,by=bw.shift(),bv=D._queueHooks(bA,bz),bx=function(){D.dequeue(bA,bz)};if(by==="inprogress"){by=bw.shift();bB--}if(by){if(bz==="fx"){bw.unshift("inprogress")}delete bv.stop;by.call(bA,bx,bv)}if(!bB&&bv){bv.empty.fire()}},_queueHooks:function(bx,bw){var bv=bw+"queueHooks";return D._data(bx,bv)||D._data(bx,bv,{empty:D.Callbacks("once memory").add(function(){D.removeData(bx,bw+"queue",true);D.removeData(bx,bv,true)})})}});D.fn.extend({queue:function(bv,bw){var bx=2;if(typeof bv!=="string"){bw=bv;bv="fx";bx--}if(arguments.length<bx){return D.queue(this[0],bv)}return bw===H?this:this.each(function(){var by=D.queue(this,bv,bw);D._queueHooks(this,bv);if(bv==="fx"&&by[0]!=="inprogress"){D.dequeue(this,bv)}})},dequeue:function(bv){return this.each(function(){D.dequeue(this,bv)})},delay:function(bw,bv){bw=D.fx?D.fx.speeds[bw]||bw:bw;bv=bv||"fx";return this.queue(bv,function(by,bx){var bz=setTimeout(by,bw);bx.stop=function(){clearTimeout(bz)}})},clearQueue:function(bv){return this.queue(bv||"fx",[])},promise:function(bx,bB){var bw,by=1,bC=D.Deferred(),bA=this,bv=this.length,bz=function(){if(!(--by)){bC.resolveWith(bA,[bA])}};if(typeof bx!=="string"){bB=bx;bx=H}bx=bx||"fx";while(bv--){bw=D._data(bA[bv],bx+"queueHooks");if(bw&&bw.empty){by++;bw.empty.add(bz)}}bz();return bC.promise(bB)}});var bi,aU,az,aJ=/[\t\r\n]/g,aQ=/\r/g,d=/^(?:button|input)$/i,A=/^(?:button|input|object|select|textarea)$/i,h=/^a(?:rea|)$/i,af=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,B=D.support.getSetAttribute;D.fn.extend({attr:function(bv,bw){return D.access(this,D.attr,bv,bw,arguments.length>1)},removeAttr:function(bv){return this.each(function(){D.removeAttr(this,bv)})},prop:function(bv,bw){return D.access(this,D.prop,bv,bw,arguments.length>1)},removeProp:function(bv){bv=D.propFix[bv]||bv;return this.each(function(){try{this[bv]=H;delete this[bv]}catch(bw){}})},addClass:function(bz){var bB,bx,bw,by,bA,bC,bv;if(D.isFunction(bz)){return this.each(function(bD){D(this).addClass(bz.call(this,bD,this.className))})}if(bz&&typeof bz==="string"){bB=bz.split(a9);for(bx=0,bw=this.length;bx<bw;bx++){by=this[bx];if(by.nodeType===1){if(!by.className&&bB.length===1){by.className=bz}else{bA=" "+by.className+" ";for(bC=0,bv=bB.length;bC<bv;bC++){if(bA.indexOf(" "+bB[bC]+" ")<0){bA+=bB[bC]+" "}}by.className=D.trim(bA)}}}}return this},removeClass:function(bB){var by,bz,bA,bC,bw,bx,bv;if(D.isFunction(bB)){return this.each(function(bD){D(this).removeClass(bB.call(this,bD,this.className))})}if((bB&&typeof bB==="string")||bB===H){by=(bB||"").split(a9);for(bx=0,bv=this.length;bx<bv;bx++){bA=this[bx];if(bA.nodeType===1&&bA.className){bz=(" "+bA.className+" ").replace(aJ," ");for(bC=0,bw=by.length;bC<bw;bC++){while(bz.indexOf(" "+by[bC]+" ")>=0){bz=bz.replace(" "+by[bC]+" "," ")}}bA.className=bB?D.trim(bz):""}}}return this},toggleClass:function(by,bw){var bx=typeof by,bv=typeof bw==="boolean";if(D.isFunction(by)){return this.each(function(bz){D(this).toggleClass(by.call(this,bz,this.className,bw),bw)})}return this.each(function(){if(bx==="string"){var bB,bA=0,bz=D(this),bC=bw,bD=by.split(a9);while((bB=bD[bA++])){bC=bv?bC:!bz.hasClass(bB);bz[bC?"addClass":"removeClass"](bB)}}else{if(bx==="undefined"||bx==="boolean"){if(this.className){D._data(this,"__className__",this.className)}this.className=this.className||by===false?"":D._data(this,"__className__")||""}}})},hasClass:function(bv){var by=" "+bv+" ",bx=0,bw=this.length;for(;bx<bw;bx++){if(this[bx].nodeType===1&&(" "+this[bx].className+" ").replace(aJ," ").indexOf(by)>=0){return true}}return false},val:function(by){var bv,bw,bz,bx=this[0];if(!arguments.length){if(bx){bv=D.valHooks[bx.type]||D.valHooks[bx.nodeName.toLowerCase()];if(bv&&"get" in bv&&(bw=bv.get(bx,"value"))!==H){return bw}bw=bx.value;return typeof bw==="string"?bw.replace(aQ,""):bw==null?"":bw}return}bz=D.isFunction(by);return this.each(function(bB){var bC,bA=D(this);if(this.nodeType!==1){return}if(bz){bC=by.call(this,bB,bA.val())}else{bC=by}if(bC==null){bC=""}else{if(typeof bC==="number"){bC+=""}else{if(D.isArray(bC)){bC=D.map(bC,function(bD){return bD==null?"":bD+""})}}}bv=D.valHooks[this.type]||D.valHooks[this.nodeName.toLowerCase()];if(!bv||!("set" in bv)||bv.set(this,bC,"value")===H){this.value=bC}})}});D.extend({valHooks:{option:{get:function(bv){var bw=bv.attributes.value;return !bw||bw.specified?bv.value:bv.text}},select:{get:function(bv){var bB,bx,bD=bv.options,bz=bv.selectedIndex,by=bv.type==="select-one"||bz<0,bC=by?null:[],bA=by?bz+1:bD.length,bw=bz<0?bA:by?bz:0;for(;bw<bA;bw++){bx=bD[bw];if((bx.selected||bw===bz)&&(D.support.optDisabled?!bx.disabled:bx.getAttribute("disabled")===null)&&(!bx.parentNode.disabled||!D.nodeName(bx.parentNode,"optgroup"))){bB=D(bx).val();if(by){return bB}bC.push(bB)}}return bC},set:function(bw,bx){var bv=D.makeArray(bx);D(bw).find("option").each(function(){this.selected=D.inArray(D(this).val(),bv)>=0});if(!bv.length){bw.selectedIndex=-1}return bv}}},attrFn:{},attr:function(bB,by,bC,bA){var bx,bv,bz,bw=bB.nodeType;if(!bB||bw===3||bw===8||bw===2){return}if(bA&&D.isFunction(D.fn[by])){return D(bB)[by](bC)}if(typeof bB.getAttribute==="undefined"){return D.prop(bB,by,bC)}bz=bw!==1||!D.isXMLDoc(bB);if(bz){by=by.toLowerCase();bv=D.attrHooks[by]||(af.test(by)?aU:bi)}if(bC!==H){if(bC===null){D.removeAttr(bB,by);return}else{if(bv&&"set" in bv&&bz&&(bx=bv.set(bB,bC,by))!==H){return bx}else{bB.setAttribute(by,bC+"");return bC}}}else{if(bv&&"get" in bv&&bz&&(bx=bv.get(bB,by))!==null){return bx}else{bx=bB.getAttribute(by);return bx===null?H:bx}}},removeAttr:function(by,bA){var bz,bB,bw,bv,bx=0;if(bA&&by.nodeType===1){bB=bA.split(a9);for(;bx<bB.length;bx++){bw=bB[bx];if(bw){bz=D.propFix[bw]||bw;bv=af.test(bw);if(!bv){D.attr(by,bw,"")}by.removeAttribute(B?bw:bz);if(bv&&bz in by){by[bz]=false}}}}},attrHooks:{type:{set:function(bv,bw){if(d.test(bv.nodeName)&&bv.parentNode){D.error("type property can't be changed")}else{if(!D.support.radioValue&&bw==="radio"&&D.nodeName(bv,"input")){var bx=bv.value;bv.setAttribute("type",bw);if(bx){bv.value=bx}return bw}}}},value:{get:function(bw,bv){if(bi&&D.nodeName(bw,"button")){return bi.get(bw,bv)}return bv in bw?bw.value:null},set:function(bw,bx,bv){if(bi&&D.nodeName(bw,"button")){return bi.set(bw,bx,bv)}bw.value=bx}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(bA,by,bB){var bx,bv,bz,bw=bA.nodeType;if(!bA||bw===3||bw===8||bw===2){return}bz=bw!==1||!D.isXMLDoc(bA);if(bz){by=D.propFix[by]||by;bv=D.propHooks[by]}if(bB!==H){if(bv&&"set" in bv&&(bx=bv.set(bA,bB,by))!==H){return bx}else{return(bA[by]=bB)}}else{if(bv&&"get" in bv&&(bx=bv.get(bA,by))!==null){return bx}else{return bA[by]}}},propHooks:{tabIndex:{get:function(bw){var bv=bw.getAttributeNode("tabindex");return bv&&bv.specified?parseInt(bv.value,10):A.test(bw.nodeName)||h.test(bw.nodeName)&&bw.href?0:H}}}});aU={get:function(bw,bv){var by,bx=D.prop(bw,bv);return bx===true||typeof bx!=="boolean"&&(by=bw.getAttributeNode(bv))&&by.nodeValue!==false?bv.toLowerCase():H},set:function(bw,by,bv){var bx;if(by===false){D.removeAttr(bw,bv)}else{bx=D.propFix[bv]||bv;if(bx in bw){bw[bx]=true}bw.setAttribute(bv,bv.toLowerCase())}return bv}};if(!D.support.enctype){D.propFix.enctype="encoding"}var bg=/^(?:textarea|input|select)$/i,o=/^([^\.]*|)(?:\.(.+)|)$/,G=/(?:^|\s)hover(\.\S+|)\b/,aI=/^key/,bj=/^(?:mouse|contextmenu)|click/,O=/^(?:focusinfocus|focusoutblur)$/,bt=function(bv){return D.event.special.hover?bv:bv.replace(G,"mouseenter$1 mouseleave$1")};D.event={add:function(by,bC,bJ,bA,bz){var bD,bB,bK,bI,bH,bF,bv,bG,bw,bx,bE;if(by.nodeType===3||by.nodeType===8||!bC||!bJ||!(bD=D._data(by))){return}if(bJ.handler){bw=bJ;bJ=bw.handler;bz=bw.selector}if(!bJ.guid){bJ.guid=D.guid++}bK=bD.events;if(!bK){bD.events=bK={}}bB=bD.handle;if(!bB){bD.handle=bB=function(bL){return typeof D!=="undefined"&&(!bL||D.event.triggered!==bL.type)?D.event.dispatch.apply(bB.elem,arguments):H};bB.elem=by}bC=D.trim(bt(bC)).split(" ");for(bI=0;bI<bC.length;bI++){bH=o.exec(bC[bI])||[];bF=bH[1];bv=(bH[2]||"").split(".").sort();bE=D.event.special[bF]||{};bF=(bz?bE.delegateType:bE.bindType)||bF;bE=D.event.special[bF]||{};bG=D.extend({type:bF,origType:bH[1],data:bA,handler:bJ,guid:bJ.guid,selector:bz,needsContext:bz&&D.expr.match.needsContext.test(bz),namespace:bv.join(".")},bw);bx=bK[bF];if(!bx){bx=bK[bF]=[];bx.delegateCount=0;if(!bE.setup||bE.setup.call(by,bA,bv,bB)===false){if(by.addEventListener){by.addEventListener(bF,bB,false)}else{if(by.attachEvent){by.attachEvent("on"+bF,bB)}}}}if(bE.add){bE.add.call(by,bG);if(!bG.handler.guid){bG.handler.guid=bJ.guid}}if(bz){bx.splice(bx.delegateCount++,0,bG)}else{bx.push(bG)}D.event.global[bF]=true}by=null},global:{},remove:function(by,bD,bJ,bz,bC){var bK,bL,bG,bx,bw,bA,bB,bI,bF,bv,bH,bE=D.hasData(by)&&D._data(by);if(!bE||!(bI=bE.events)){return}bD=D.trim(bt(bD||"")).split(" ");for(bK=0;bK<bD.length;bK++){bL=o.exec(bD[bK])||[];bG=bx=bL[1];bw=bL[2];if(!bG){for(bG in bI){D.event.remove(by,bG+bD[bK],bJ,bz,true)}continue}bF=D.event.special[bG]||{};bG=(bz?bF.delegateType:bF.bindType)||bG;bv=bI[bG]||[];bA=bv.length;bw=bw?new RegExp("(^|\\.)"+bw.split(".").sort().join("\\.(?:.*\\.|)")+"(\\.|$)"):null;for(bB=0;bB<bv.length;bB++){bH=bv[bB];if((bC||bx===bH.origType)&&(!bJ||bJ.guid===bH.guid)&&(!bw||bw.test(bH.namespace))&&(!bz||bz===bH.selector||bz==="**"&&bH.selector)){bv.splice(bB--,1);if(bH.selector){bv.delegateCount--}if(bF.remove){bF.remove.call(by,bH)}}}if(bv.length===0&&bA!==bv.length){if(!bF.teardown||bF.teardown.call(by,bw,bE.handle)===false){D.removeEvent(by,bG,bE.handle)}delete bI[bG]}}if(D.isEmptyObject(bI)){delete bE.handle;D.removeData(by,"events",true)}},customEvent:{getData:true,setData:true,changeData:true},trigger:function(bw,bD,bB,bK){if(bB&&(bB.nodeType===3||bB.nodeType===8)){return}var bv,by,bE,bI,bA,bz,bG,bF,bC,bJ,bH=bw.type||bw,bx=[];if(O.test(bH+D.event.triggered)){return}if(bH.indexOf("!")>=0){bH=bH.slice(0,-1);by=true}if(bH.indexOf(".")>=0){bx=bH.split(".");bH=bx.shift();bx.sort()}if((!bB||D.event.customEvent[bH])&&!D.event.global[bH]){return}bw=typeof bw==="object"?bw[D.expando]?bw:new D.Event(bH,bw):new D.Event(bH);bw.type=bH;bw.isTrigger=true;bw.exclusive=by;bw.namespace=bx.join(".");bw.namespace_re=bw.namespace?new RegExp("(^|\\.)"+bx.join("\\.(?:.*\\.|)")+"(\\.|$)"):null;bz=bH.indexOf(":")<0?"on"+bH:"";if(!bB){bv=D.cache;for(bE in bv){if(bv[bE].events&&bv[bE].events[bH]){D.event.trigger(bw,bD,bv[bE].handle.elem,true)}}return}bw.result=H;if(!bw.target){bw.target=bB}bD=bD!=null?D.makeArray(bD):[];bD.unshift(bw);bG=D.event.special[bH]||{};if(bG.trigger&&bG.trigger.apply(bB,bD)===false){return}bC=[[bB,bG.bindType||bH]];if(!bK&&!bG.noBubble&&!D.isWindow(bB)){bJ=bG.delegateType||bH;bI=O.test(bJ+bH)?bB:bB.parentNode;for(bA=bB;bI;bI=bI.parentNode){bC.push([bI,bJ]);bA=bI}if(bA===(bB.ownerDocument||al)){bC.push([bA.defaultView||bA.parentWindow||be,bJ])}}for(bE=0;bE<bC.length&&!bw.isPropagationStopped();bE++){bI=bC[bE][0];bw.type=bC[bE][1];bF=(D._data(bI,"events")||{})[bw.type]&&D._data(bI,"handle");if(bF){bF.apply(bI,bD)}bF=bz&&bI[bz];if(bF&&D.acceptData(bI)&&bF.apply&&bF.apply(bI,bD)===false){bw.preventDefault()}}bw.type=bH;if(!bK&&!bw.isDefaultPrevented()){if((!bG._default||bG._default.apply(bB.ownerDocument,bD)===false)&&!(bH==="click"&&D.nodeName(bB,"a"))&&D.acceptData(bB)){if(bz&&bB[bH]&&((bH!=="focus"&&bH!=="blur")||bw.target.offsetWidth!==0)&&!D.isWindow(bB)){bA=bB[bz];if(bA){bB[bz]=null}D.event.triggered=bH;bB[bH]();D.event.triggered=H;if(bA){bB[bz]=bA}}}}return bw.result},dispatch:function(bv){bv=D.event.fix(bv||be.event);var bC,bB,bL,bF,bE,bw,bD,bJ,by,bK,bz=((D._data(this,"events")||{})[bv.type]||[]),bA=bz.delegateCount,bH=aE.call(arguments),bx=!bv.exclusive&&!bv.namespace,bG=D.event.special[bv.type]||{},bI=[];bH[0]=bv;bv.delegateTarget=this;if(bG.preDispatch&&bG.preDispatch.call(this,bv)===false){return}if(bA&&!(bv.button&&bv.type==="click")){for(bL=bv.target;bL!=this;bL=bL.parentNode||this){if(bL.disabled!==true||bv.type!=="click"){bE={};bD=[];for(bC=0;bC<bA;bC++){bJ=bz[bC];by=bJ.selector;if(bE[by]===H){bE[by]=bJ.needsContext?D(by,this).index(bL)>=0:D.find(by,this,null,[bL]).length}if(bE[by]){bD.push(bJ)}}if(bD.length){bI.push({elem:bL,matches:bD})}}}}if(bz.length>bA){bI.push({elem:this,matches:bz.slice(bA)})}for(bC=0;bC<bI.length&&!bv.isPropagationStopped();bC++){bw=bI[bC];bv.currentTarget=bw.elem;for(bB=0;bB<bw.matches.length&&!bv.isImmediatePropagationStopped();bB++){bJ=bw.matches[bB];if(bx||(!bv.namespace&&!bJ.namespace)||bv.namespace_re&&bv.namespace_re.test(bJ.namespace)){bv.data=bJ.data;bv.handleObj=bJ;bF=((D.event.special[bJ.origType]||{}).handle||bJ.handler).apply(bw.elem,bH);if(bF!==H){bv.result=bF;if(bF===false){bv.preventDefault();bv.stopPropagation()}}}}}if(bG.postDispatch){bG.postDispatch.call(this,bv)}return bv.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(bw,bv){if(bw.which==null){bw.which=bv.charCode!=null?bv.charCode:bv.keyCode}return bw}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(by,bx){var bz,bA,bv,bw=bx.button,bB=bx.fromElement;if(by.pageX==null&&bx.clientX!=null){bz=by.target.ownerDocument||al;bA=bz.documentElement;bv=bz.body;by.pageX=bx.clientX+(bA&&bA.scrollLeft||bv&&bv.scrollLeft||0)-(bA&&bA.clientLeft||bv&&bv.clientLeft||0);by.pageY=bx.clientY+(bA&&bA.scrollTop||bv&&bv.scrollTop||0)-(bA&&bA.clientTop||bv&&bv.clientTop||0)}if(!by.relatedTarget&&bB){by.relatedTarget=bB===by.target?bx.toElement:bB}if(!by.which&&bw!==H){by.which=(bw&1?1:(bw&2?3:(bw&4?2:0)))}return by}},fix:function(bx){if(bx[D.expando]){return bx}var bw,bA,bv=bx,by=D.event.fixHooks[bx.type]||{},bz=by.props?this.props.concat(by.props):this.props;bx=D.Event(bv);for(bw=bz.length;bw;){bA=bz[--bw];bx[bA]=bv[bA]}if(!bx.target){bx.target=bv.srcElement||al}if(bx.target.nodeType===3){bx.target=bx.target.parentNode}bx.metaKey=!!bx.metaKey;return by.filter?by.filter(bx,bv):bx},special:{load:{noBubble:true},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(bx,bw,bv){if(D.isWindow(this)){this.onbeforeunload=bv}},teardown:function(bw,bv){if(this.onbeforeunload===bv){this.onbeforeunload=null}}}},simulate:function(bw,by,bx,bv){var bz=D.extend(new D.Event(),bx,{type:bw,isSimulated:true,originalEvent:{}});if(bv){D.event.trigger(bz,null,by)}else{D.event.dispatch.call(by,bz)}if(bz.isDefaultPrevented()){bx.preventDefault()}}};D.event.handle=D.event.dispatch;D.removeEvent=al.removeEventListener?function(bw,bv,bx){if(bw.removeEventListener){bw.removeEventListener(bv,bx,false)}}:function(bx,bw,by){var bv="on"+bw;if(bx.detachEvent){if(typeof bx[bv]==="undefined"){bx[bv]=null}bx.detachEvent(bv,by)}};D.Event=function(bw,bv){if(!(this instanceof D.Event)){return new D.Event(bw,bv)}if(bw&&bw.type){this.originalEvent=bw;this.type=bw.type;this.isDefaultPrevented=(bw.defaultPrevented||bw.returnValue===false||bw.getPreventDefault&&bw.getPreventDefault())?f:bo}else{this.type=bw}if(bv){D.extend(this,bv)}this.timeStamp=bw&&bw.timeStamp||D.now();this[D.expando]=true};function bo(){return false}function f(){return true}D.Event.prototype={preventDefault:function(){this.isDefaultPrevented=f;var bv=this.originalEvent;if(!bv){return}if(bv.preventDefault){bv.preventDefault()}else{bv.returnValue=false}},stopPropagation:function(){this.isPropagationStopped=f;var bv=this.originalEvent;if(!bv){return}if(bv.stopPropagation){bv.stopPropagation()}bv.cancelBubble=true},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=f;this.stopPropagation()},isDefaultPrevented:bo,isPropagationStopped:bo,isImmediatePropagationStopped:bo};D.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(bw,bv){D.event.special[bw]={delegateType:bv,bindType:bv,handle:function(bA){var by,bC=this,bB=bA.relatedTarget,bz=bA.handleObj,bx=bz.selector;if(!bB||(bB!==bC&&!D.contains(bC,bB))){bA.type=bz.origType;by=bz.handler.apply(this,arguments);bA.type=bv}return by}}});D.fn.extend({on:function(bx,bv,bA,bz,bw){var bB,by;if(typeof bx==="object"){if(typeof bv!=="string"){bA=bA||bv;bv=H}for(by in bx){this.on(by,bv,bA,bx[by],bw)}return this}if(bA==null&&bz==null){bz=bv;bA=bv=H}else{if(bz==null){if(typeof bv==="string"){bz=bA;bA=H}else{bz=bA;bA=bv;bv=H}}}if(bz===false){bz=bo}else{if(!bz){return this}}if(bw===1){bB=bz;bz=function(bC){D().off(bC);return bB.apply(this,arguments)};bz.guid=bB.guid||(bB.guid=D.guid++)}return this.each(function(){D.event.add(this,bx,bz,bA,bv)})},off:function(bx,bv,bz){var bw,by;if(bx&&bx.preventDefault&&bx.handleObj){bw=bx.handleObj;D(bx.delegateTarget).off(bw.namespace?bw.origType+"."+bw.namespace:bw.origType,bw.selector,bw.handler);return this}if(typeof bx==="object"){for(by in bx){this.off(by,bv,bx[by])}return this}if(bv===false||typeof bv==="function"){bz=bv;bv=H}if(bz===false){bz=bo}return this.each(function(){D.event.remove(this,bx,bz,bv)})},delegate:function(bv,bw,by,bx){return this.on(bw,bv,by,bx)},undelegate:function(bv,bw,bx){return arguments.length===1?this.off(bv,"**"):this.off(bw,bv||"**",bx)},trigger:function(bv,bw){return this.each(function(){D.event.trigger(bv,bw,this)})},triggerHandler:function(bv,bw){if(this[0]){return D.event.trigger(bv,bw,this[0],true)}},toggle:function(by){var bw=arguments,bv=by.guid||D.guid++,bx=0,bz=function(bA){var bB=(D._data(this,"lastToggle"+by.guid)||0)%bx;D._data(this,"lastToggle"+by.guid,bB+1);bA.preventDefault();return bw[bB].apply(this,arguments)||false};bz.guid=bv;while(bx<bw.length){bw[bx++].guid=bv}return this.click(bz)},hover:function(bv,bw){return this.mouseenter(bv).mouseleave(bw||bv)}});D.each(("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu").split(" "),function(bw,bv){D.fn[bv]=function(by,bx){if(bx==null){bx=by;by=null}return arguments.length>0?this.on(bv,null,by,bx):this.trigger(bv)};if(aI.test(bv)){D.event.fixHooks[bv]=D.event.keyHooks}if(bj.test(bv)){D.event.fixHooks[bv]=D.event.mouseHooks}});
/*!
         * Sizzle CSS Selector Engine
         * Copyright 2012 JQXLite Foundation and other contributors
         * Released under the MIT license
         * http://sizzlejs.com/
         */
(function(co,bN){var ct,bG,ch,bw,bS,b6,bJ,bM,bI,cf,bF=true,b0="undefined",cv=("sizcache"+Math.random()).replace(".",""),bA=String,bE=co.document,bH=bE.documentElement,bX=0,bL=0,ca=[].pop,cs=[].push,bR=[].slice,bU=[].indexOf||function(cF){var cE=0,cD=this.length;for(;cE<cD;cE++){if(this[cE]===cF){return cE}}return -1},cx=function(cD,cE){cD[cv]=cE==null||cE;return cD},cB=function(){var cD={},cE=[];return cx(function(cF,cG){if(cE.push(cF)>ch.cacheLength){delete cD[cE.shift()]}return(cD[cF+" "]=cG)},cD)},cq=cB(),cr=cB(),bT=cB(),b4="[\\x20\\t\\r\\n\\f]",bQ="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",bO=bQ.replace("w","w#"),cA="([*^$|!~]?=)",cl="\\["+b4+"*("+bQ+")"+b4+"*(?:"+cA+b4+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+bO+")|)|)"+b4+"*\\]",cC=":("+bQ+")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:"+cl+")|[^:]|\\\\.)*|.*))\\)|)",b5=":(even|odd|eq|gt|lt|nth|first|last)(?:\\("+b4+"*((?:-\\d)?\\d*)"+b4+"*\\)|)(?=[^-]|$)",cp=new RegExp("^"+b4+"+|((?:^|[^\\\\])(?:\\\\.)*)"+b4+"+$","g"),bB=new RegExp("^"+b4+"*,"+b4+"*"),cd=new RegExp("^"+b4+"*([\\x20\\t\\r\\n\\f>+~])"+b4+"*"),ci=new RegExp(cC),ck=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,b9=/^:not/,cn=/[\x20\t\r\n\f]*[+~]/,cw=/:not\($/,bY=/h\d/i,cj=/input|select|textarea|button/i,bZ=/\\(?!\\)/g,cc={ID:new RegExp("^#("+bQ+")"),CLASS:new RegExp("^\\.("+bQ+")"),NAME:new RegExp("^\\[name=['\"]?("+bQ+")['\"]?\\]"),TAG:new RegExp("^("+bQ.replace("w","w*")+")"),ATTR:new RegExp("^"+cl),PSEUDO:new RegExp("^"+cC),POS:new RegExp(b5,"i"),CHILD:new RegExp("^:(only|nth|first|last)-child(?:\\("+b4+"*(even|odd|(([+-]|)(\\d*)n|)"+b4+"*(?:([+-]|)"+b4+"*(\\d+)|))"+b4+"*\\)|)","i"),needsContext:new RegExp("^"+b4+"*[>+~]|"+b5,"i")},cg=function(cD){var cF=bE.createElement("div");try{return cD(cF)}catch(cE){return false}finally{cF=null}},bD=cg(function(cD){cD.appendChild(bE.createComment(""));return !cD.getElementsByTagName("*").length}),b8=cg(function(cD){cD.innerHTML="<a href='#'></a>";return cD.firstChild&&typeof cD.firstChild.getAttribute!==b0&&cD.firstChild.getAttribute("href")==="#"}),bW=cg(function(cE){cE.innerHTML="<select></select>";var cD=typeof cE.lastChild.getAttribute("multiple");return cD!=="boolean"&&cD!=="string"}),b7=cg(function(cD){cD.innerHTML="<div class='hidden e'></div><div class='hidden'></div>";if(!cD.getElementsByClassName||!cD.getElementsByClassName("e").length){return false}cD.lastChild.className="e";return cD.getElementsByClassName("e").length===2}),bv=cg(function(cE){cE.id=cv+0;cE.innerHTML="<a name='"+cv+"'></a><div name='"+cv+"'></div>";bH.insertBefore(cE,bH.firstChild);var cD=bE.getElementsByName&&bE.getElementsByName(cv).length===2+bE.getElementsByName(cv+0).length;bG=!bE.getElementById(cv);bH.removeChild(cE);return cD});try{bR.call(bH.childNodes,0)[0].nodeType}catch(cz){bR=function(cE){var cF,cD=[];for(;(cF=this[cE]);cE++){cD.push(cF)}return cD}}function cm(cG,cD,cI,cL){cI=cI||[];cD=cD||bE;var cJ,cE,cK,cF,cH=cD.nodeType;if(!cG||typeof cG!=="string"){return cI}if(cH!==1&&cH!==9){return[]}cK=bS(cD);if(!cK&&!cL){if((cJ=ck.exec(cG))){if((cF=cJ[1])){if(cH===9){cE=cD.getElementById(cF);if(cE&&cE.parentNode){if(cE.id===cF){cI.push(cE);return cI}}else{return cI}}else{if(cD.ownerDocument&&(cE=cD.ownerDocument.getElementById(cF))&&b6(cD,cE)&&cE.id===cF){cI.push(cE);return cI}}}else{if(cJ[2]){cs.apply(cI,bR.call(cD.getElementsByTagName(cG),0));return cI}else{if((cF=cJ[3])&&b7&&cD.getElementsByClassName){cs.apply(cI,bR.call(cD.getElementsByClassName(cF),0));return cI}}}}}return cu(cG.replace(cp,"$1"),cD,cI,cL,cK)}cm.matches=function(cE,cD){return cm(cE,null,null,cD)};cm.matchesSelector=function(cD,cE){return cm(cE,null,null,[cD]).length>0};function ce(cD){return function(cF){var cE=cF.nodeName.toLowerCase();return cE==="input"&&cF.type===cD}}function bz(cD){return function(cF){var cE=cF.nodeName.toLowerCase();return(cE==="input"||cE==="button")&&cF.type===cD}}function cb(cD){return cx(function(cE){cE=+cE;return cx(function(cF,cJ){var cH,cG=cD([],cF.length,cE),cI=cG.length;while(cI--){if(cF[(cH=cG[cI])]){cF[cH]=!(cJ[cH]=cF[cH])}}})})}bw=cm.getText=function(cH){var cG,cE="",cF=0,cD=cH.nodeType;if(cD){if(cD===1||cD===9||cD===11){if(typeof cH.textContent==="string"){return cH.textContent}else{for(cH=cH.firstChild;cH;cH=cH.nextSibling){cE+=bw(cH)}}}else{if(cD===3||cD===4){return cH.nodeValue}}}else{for(;(cG=cH[cF]);cF++){cE+=bw(cG)}}return cE};bS=cm.isXML=function(cD){var cE=cD&&(cD.ownerDocument||cD).documentElement;return cE?cE.nodeName!=="HTML":false};b6=cm.contains=bH.contains?function(cE,cD){var cG=cE.nodeType===9?cE.documentElement:cE,cF=cD&&cD.parentNode;return cE===cF||!!(cF&&cF.nodeType===1&&cG.contains&&cG.contains(cF))}:bH.compareDocumentPosition?function(cE,cD){return cD&&!!(cE.compareDocumentPosition(cD)&16)}:function(cE,cD){while((cD=cD.parentNode)){if(cD===cE){return true}}return false};cm.attr=function(cF,cE){var cG,cD=bS(cF);if(!cD){cE=cE.toLowerCase()}if((cG=ch.attrHandle[cE])){return cG(cF)}if(cD||bW){return cF.getAttribute(cE)}cG=cF.getAttributeNode(cE);return cG?typeof cF[cE]==="boolean"?cF[cE]?cE:null:cG.specified?cG.value:null:null};ch=cm.selectors={cacheLength:50,createPseudo:cx,match:cc,attrHandle:b8?{}:{href:function(cD){return cD.getAttribute("href",2)},type:function(cD){return cD.getAttribute("type")}},find:{ID:bG?function(cG,cF,cE){if(typeof cF.getElementById!==b0&&!cE){var cD=cF.getElementById(cG);return cD&&cD.parentNode?[cD]:[]}}:function(cG,cF,cE){if(typeof cF.getElementById!==b0&&!cE){var cD=cF.getElementById(cG);return cD?cD.id===cG||typeof cD.getAttributeNode!==b0&&cD.getAttributeNode("id").value===cG?[cD]:bN:[]}},TAG:bD?function(cD,cE){if(typeof cE.getElementsByTagName!==b0){return cE.getElementsByTagName(cD)}}:function(cD,cH){var cG=cH.getElementsByTagName(cD);if(cD==="*"){var cI,cF=[],cE=0;for(;(cI=cG[cE]);cE++){if(cI.nodeType===1){cF.push(cI)}}return cF}return cG},NAME:bv&&function(cD,cE){if(typeof cE.getElementsByName!==b0){return cE.getElementsByName(name)}},CLASS:b7&&function(cF,cE,cD){if(typeof cE.getElementsByClassName!==b0&&!cD){return cE.getElementsByClassName(cF)}}},relative:{">":{dir:"parentNode",first:true}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:true},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(cD){cD[1]=cD[1].replace(bZ,"");cD[3]=(cD[4]||cD[5]||"").replace(bZ,"");if(cD[2]==="~="){cD[3]=" "+cD[3]+" "}return cD.slice(0,4)},CHILD:function(cD){cD[1]=cD[1].toLowerCase();if(cD[1]==="nth"){if(!cD[2]){cm.error(cD[0])}cD[3]=+(cD[3]?cD[4]+(cD[5]||1):2*(cD[2]==="even"||cD[2]==="odd"));cD[4]=+((cD[6]+cD[7])||cD[2]==="odd")}else{if(cD[2]){cm.error(cD[0])}}return cD},PSEUDO:function(cE){var cF,cD;if(cc.CHILD.test(cE[0])){return null}if(cE[3]){cE[2]=cE[3]}else{if((cF=cE[4])){if(ci.test(cF)&&(cD=bx(cF,true))&&(cD=cF.indexOf(")",cF.length-cD)-cF.length)){cF=cF.slice(0,cD);cE[0]=cE[0].slice(0,cD)}cE[2]=cF}}return cE.slice(0,3)}},filter:{ID:bG?function(cD){cD=cD.replace(bZ,"");return function(cE){return cE.getAttribute("id")===cD}}:function(cD){cD=cD.replace(bZ,"");return function(cF){var cE=typeof cF.getAttributeNode!==b0&&cF.getAttributeNode("id");return cE&&cE.value===cD}},TAG:function(cD){if(cD==="*"){return function(){return true}}cD=cD.replace(bZ,"").toLowerCase();return function(cE){return cE.nodeName&&cE.nodeName.toLowerCase()===cD}},CLASS:function(cD){var cE=cq[cv][cD+" "];return cE||(cE=new RegExp("(^|"+b4+")"+cD+"("+b4+"|$)"))&&cq(cD,function(cF){return cE.test(cF.className||(typeof cF.getAttribute!==b0&&cF.getAttribute("class"))||"")})},ATTR:function(cF,cE,cD){return function(cI,cH){var cG=cm.attr(cI,cF);if(cG==null){return cE==="!="}if(!cE){return true}cG+="";return cE==="="?cG===cD:cE==="!="?cG!==cD:cE==="^="?cD&&cG.indexOf(cD)===0:cE==="*="?cD&&cG.indexOf(cD)>-1:cE==="$="?cD&&cG.substr(cG.length-cD.length)===cD:cE==="~="?(" "+cG+" ").indexOf(cD)>-1:cE==="|="?cG===cD||cG.substr(0,cD.length+1)===cD+"-":false}},CHILD:function(cD,cF,cG,cE){if(cD==="nth"){return function(cJ){var cI,cK,cH=cJ.parentNode;if(cG===1&&cE===0){return true}if(cH){cK=0;for(cI=cH.firstChild;cI;cI=cI.nextSibling){if(cI.nodeType===1){cK++;if(cJ===cI){break}}}}cK-=cE;return cK===cG||(cK%cG===0&&cK/cG>=0)}}return function(cI){var cH=cI;switch(cD){case"only":case"first":while((cH=cH.previousSibling)){if(cH.nodeType===1){return false}}if(cD==="first"){return true}cH=cI;case"last":while((cH=cH.nextSibling)){if(cH.nodeType===1){return false}}return true}}},PSEUDO:function(cG,cF){var cD,cE=ch.pseudos[cG]||ch.setFilters[cG.toLowerCase()]||cm.error("unsupported pseudo: "+cG);if(cE[cv]){return cE(cF)}if(cE.length>1){cD=[cG,cG,"",cF];return ch.setFilters.hasOwnProperty(cG.toLowerCase())?cx(function(cJ,cL){var cI,cH=cE(cJ,cF),cK=cH.length;while(cK--){cI=bU.call(cJ,cH[cK]);cJ[cI]=!(cL[cI]=cH[cK])}}):function(cH){return cE(cH,0,cD)}}return cE}},pseudos:{not:cx(function(cD){var cE=[],cF=[],cG=bJ(cD.replace(cp,"$1"));return cG[cv]?cx(function(cI,cN,cL,cJ){var cM,cH=cG(cI,null,cJ,[]),cK=cI.length;while(cK--){if((cM=cH[cK])){cI[cK]=!(cN[cK]=cM)}}}):function(cJ,cI,cH){cE[0]=cJ;cG(cE,null,cH,cF);return !cF.pop()}}),has:cx(function(cD){return function(cE){return cm(cD,cE).length>0}}),contains:cx(function(cD){return function(cE){return(cE.textContent||cE.innerText||bw(cE)).indexOf(cD)>-1}}),enabled:function(cD){return cD.disabled===false},disabled:function(cD){return cD.disabled===true},checked:function(cD){var cE=cD.nodeName.toLowerCase();return(cE==="input"&&!!cD.checked)||(cE==="option"&&!!cD.selected)},selected:function(cD){if(cD.parentNode){cD.parentNode.selectedIndex}return cD.selected===true},parent:function(cD){return !ch.pseudos.empty(cD)},empty:function(cE){var cD;cE=cE.firstChild;while(cE){if(cE.nodeName>"@"||(cD=cE.nodeType)===3||cD===4){return false}cE=cE.nextSibling}return true},header:function(cD){return bY.test(cD.nodeName)},text:function(cF){var cE,cD;return cF.nodeName.toLowerCase()==="input"&&(cE=cF.type)==="text"&&((cD=cF.getAttribute("type"))==null||cD.toLowerCase()===cE)},radio:ce("radio"),checkbox:ce("checkbox"),file:ce("file"),password:ce("password"),image:ce("image"),submit:bz("submit"),reset:bz("reset"),button:function(cE){var cD=cE.nodeName.toLowerCase();return cD==="input"&&cE.type==="button"||cD==="button"},input:function(cD){return cj.test(cD.nodeName)},focus:function(cD){var cE=cD.ownerDocument;return cD===cE.activeElement&&(!cE.hasFocus||cE.hasFocus())&&!!(cD.type||cD.href||~cD.tabIndex)},active:function(cD){return cD===cD.ownerDocument.activeElement},first:cb(function(){return[0]}),last:cb(function(cD,cE){return[cE-1]}),eq:cb(function(cD,cF,cE){return[cE<0?cE+cF:cE]}),even:cb(function(cD,cF){for(var cE=0;cE<cF;cE+=2){cD.push(cE)}return cD}),odd:cb(function(cD,cF){for(var cE=1;cE<cF;cE+=2){cD.push(cE)}return cD}),lt:cb(function(cD,cG,cF){for(var cE=cF<0?cF+cG:cF;--cE>=0;){cD.push(cE)}return cD}),gt:cb(function(cD,cG,cF){for(var cE=cF<0?cF+cG:cF;++cE<cG;){cD.push(cE)}return cD})}};function by(cE,cD,cF){if(cE===cD){return cF}var cG=cE.nextSibling;while(cG){if(cG===cD){return -1}cG=cG.nextSibling}return 1}bM=bH.compareDocumentPosition?function(cE,cD){if(cE===cD){bI=true;return 0}return(!cE.compareDocumentPosition||!cD.compareDocumentPosition?cE.compareDocumentPosition:cE.compareDocumentPosition(cD)&4)?-1:1}:function(cL,cK){if(cL===cK){bI=true;return 0}else{if(cL.sourceIndex&&cK.sourceIndex){return cL.sourceIndex-cK.sourceIndex}}var cI,cE,cF=[],cD=[],cH=cL.parentNode,cJ=cK.parentNode,cM=cH;if(cH===cJ){return by(cL,cK)}else{if(!cH){return -1}else{if(!cJ){return 1}}}while(cM){cF.unshift(cM);cM=cM.parentNode}cM=cJ;while(cM){cD.unshift(cM);cM=cM.parentNode}cI=cF.length;cE=cD.length;for(var cG=0;cG<cI&&cG<cE;cG++){if(cF[cG]!==cD[cG]){return by(cF[cG],cD[cG])}}return cG===cI?by(cL,cD[cG],-1):by(cF[cG],cK,1)};[0,0].sort(bM);bF=!bI;cm.uniqueSort=function(cF){var cG,cH=[],cE=1,cD=0;bI=bF;cF.sort(bM);if(bI){for(;(cG=cF[cE]);cE++){if(cG===cF[cE-1]){cD=cH.push(cE)}}while(cD--){cF.splice(cH[cD],1)}}return cF};cm.error=function(cD){throw new Error("Syntax error, unrecognized expression: "+cD)};function bx(cH,cM){var cE,cI,cK,cL,cJ,cF,cD,cG=cr[cv][cH+" "];if(cG){return cM?0:cG.slice(0)}cJ=cH;cF=[];cD=ch.preFilter;while(cJ){if(!cE||(cI=bB.exec(cJ))){if(cI){cJ=cJ.slice(cI[0].length)||cJ}cF.push(cK=[])}cE=false;if((cI=cd.exec(cJ))){cK.push(cE=new bA(cI.shift()));cJ=cJ.slice(cE.length);cE.type=cI[0].replace(cp," ")}for(cL in ch.filter){if((cI=cc[cL].exec(cJ))&&(!cD[cL]||(cI=cD[cL](cI)))){cK.push(cE=new bA(cI.shift()));cJ=cJ.slice(cE.length);cE.type=cL;cE.matches=cI}}if(!cE){break}}return cM?cJ.length:cJ?cm.error(cH):cr(cH,cF).slice(0)}function b2(cH,cF,cG){var cD=cF.dir,cI=cG&&cF.dir==="parentNode",cE=bL++;return cF.first?function(cL,cK,cJ){while((cL=cL[cD])){if(cI||cL.nodeType===1){return cH(cL,cK,cJ)}}}:function(cM,cL,cK){if(!cK){var cJ,cN=bX+" "+cE+" ",cO=cN+ct;while((cM=cM[cD])){if(cI||cM.nodeType===1){if((cJ=cM[cv])===cO){return cM.sizset}else{if(typeof cJ==="string"&&cJ.indexOf(cN)===0){if(cM.sizset){return cM}}else{cM[cv]=cO;if(cH(cM,cL,cK)){cM.sizset=true;return cM}cM.sizset=false}}}}}else{while((cM=cM[cD])){if(cI||cM.nodeType===1){if(cH(cM,cL,cK)){return cM}}}}}}function bK(cD){return cD.length>1?function(cH,cG,cE){var cF=cD.length;while(cF--){if(!cD[cF](cH,cG,cE)){return false}}return true}:cD[0]}function b1(cD,cE,cF,cG,cJ){var cH,cM=[],cI=0,cK=cD.length,cL=cE!=null;for(;cI<cK;cI++){if((cH=cD[cI])){if(!cF||cF(cH,cG,cJ)){cM.push(cH);if(cL){cE.push(cI)}}}}return cM}function cy(cF,cE,cH,cG,cI,cD){if(cG&&!cG[cv]){cG=cy(cG)}if(cI&&!cI[cv]){cI=cy(cI,cD)}return cx(function(cT,cQ,cL,cS){var cV,cR,cN,cM=[],cU=[],cK=cQ.length,cJ=cT||bV(cE||"*",cL.nodeType?[cL]:cL,[]),cO=cF&&(cT||!cE)?b1(cJ,cM,cF,cL,cS):cJ,cP=cH?cI||(cT?cF:cK||cG)?[]:cQ:cO;if(cH){cH(cO,cP,cL,cS)}if(cG){cV=b1(cP,cU);cG(cV,[],cL,cS);cR=cV.length;while(cR--){if((cN=cV[cR])){cP[cU[cR]]=!(cO[cU[cR]]=cN)}}}if(cT){if(cI||cF){if(cI){cV=[];cR=cP.length;while(cR--){if((cN=cP[cR])){cV.push((cO[cR]=cN))}}cI(null,(cP=[]),cV,cS)}cR=cP.length;while(cR--){if((cN=cP[cR])&&(cV=cI?bU.call(cT,cN):cM[cR])>-1){cT[cV]=!(cQ[cV]=cN)}}}}else{cP=b1(cP===cQ?cP.splice(cK,cP.length):cP);if(cI){cI(null,cQ,cP,cS)}else{cs.apply(cQ,cP)}}})}function b3(cJ){var cE,cH,cF,cI=cJ.length,cM=ch.relative[cJ[0].type],cN=cM||ch.relative[" "],cG=cM?1:0,cK=b2(function(cO){return cO===cE},cN,true),cL=b2(function(cO){return bU.call(cE,cO)>-1},cN,true),cD=[function(cQ,cP,cO){return(!cM&&(cO||cP!==cf))||((cE=cP).nodeType?cK(cQ,cP,cO):cL(cQ,cP,cO))}];for(;cG<cI;cG++){if((cH=ch.relative[cJ[cG].type])){cD=[b2(bK(cD),cH)]}else{cH=ch.filter[cJ[cG].type].apply(null,cJ[cG].matches);if(cH[cv]){cF=++cG;for(;cF<cI;cF++){if(ch.relative[cJ[cF].type]){break}}return cy(cG>1&&bK(cD),cG>1&&cJ.slice(0,cG-1).join("").replace(cp,"$1"),cH,cG<cF&&b3(cJ.slice(cG,cF)),cF<cI&&b3((cJ=cJ.slice(cF))),cF<cI&&cJ.join(""))}cD.push(cH)}}return bK(cD)}function bC(cG,cF){var cD=cF.length>0,cH=cG.length>0,cE=function(cR,cL,cQ,cP,cX){var cM,cN,cS,cW=[],cV=0,cO="0",cI=cR&&[],cT=cX!=null,cU=cf,cK=cR||cH&&ch.find.TAG("*",cX&&cL.parentNode||cL),cJ=(bX+=cU==null?1:Math.E);if(cT){cf=cL!==bE&&cL;ct=cE.el}for(;(cM=cK[cO])!=null;cO++){if(cH&&cM){for(cN=0;(cS=cG[cN]);cN++){if(cS(cM,cL,cQ)){cP.push(cM);break}}if(cT){bX=cJ;ct=++cE.el}}if(cD){if((cM=!cS&&cM)){cV--}if(cR){cI.push(cM)}}}cV+=cO;if(cD&&cO!==cV){for(cN=0;(cS=cF[cN]);cN++){cS(cI,cW,cL,cQ)}if(cR){if(cV>0){while(cO--){if(!(cI[cO]||cW[cO])){cW[cO]=ca.call(cP)}}}cW=b1(cW)}cs.apply(cP,cW);if(cT&&!cR&&cW.length>0&&(cV+cF.length)>1){cm.uniqueSort(cP)}}if(cT){bX=cJ;cf=cU}return cI};cE.el=0;return cD?cx(cE):cE}bJ=cm.compile=function(cD,cI){var cF,cE=[],cH=[],cG=bT[cv][cD+" "];if(!cG){if(!cI){cI=bx(cD)}cF=cI.length;while(cF--){cG=b3(cI[cF]);if(cG[cv]){cE.push(cG)}else{cH.push(cG)}}cG=bT(cD,bC(cH,cE))}return cG};function bV(cE,cH,cG){var cF=0,cD=cH.length;for(;cF<cD;cF++){cm(cE,cH[cF],cG)}return cG}function cu(cF,cD,cH,cL,cK){var cI,cO,cE,cN,cM,cJ=bx(cF),cG=cJ.length;if(!cL){if(cJ.length===1){cO=cJ[0]=cJ[0].slice(0);if(cO.length>2&&(cE=cO[0]).type==="ID"&&cD.nodeType===9&&!cK&&ch.relative[cO[1].type]){cD=ch.find.ID(cE.matches[0].replace(bZ,""),cD,cK)[0];if(!cD){return cH}cF=cF.slice(cO.shift().length)}for(cI=cc.POS.test(cF)?-1:cO.length-1;cI>=0;cI--){cE=cO[cI];if(ch.relative[(cN=cE.type)]){break}if((cM=ch.find[cN])){if((cL=cM(cE.matches[0].replace(bZ,""),cn.test(cO[0].type)&&cD.parentNode||cD,cK))){cO.splice(cI,1);cF=cL.length&&cO.join("");if(!cF){cs.apply(cH,bR.call(cL,0));return cH}break}}}}}bJ(cF,cJ)(cL,cD,cK,cH,cn.test(cF));return cH}if(bE.querySelectorAll){(function(){var cI,cJ=cu,cH=/'|\\/g,cF=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,cE=[":focus"],cD=[":active"],cG=bH.matchesSelector||bH.mozMatchesSelector||bH.webkitMatchesSelector||bH.oMatchesSelector||bH.msMatchesSelector;cg(function(cK){cK.innerHTML="<select><option selected=''></option></select>";if(!cK.querySelectorAll("[selected]").length){cE.push("\\["+b4+"*(?:checked|disabled|ismap|multiple|readonly|selected|value)")}if(!cK.querySelectorAll(":checked").length){cE.push(":checked")}});cg(function(cK){cK.innerHTML="<p test=''></p>";if(cK.querySelectorAll("[test^='']").length){cE.push("[*^$]="+b4+"*(?:\"\"|'')")}cK.innerHTML="<input type='hidden'/>";if(!cK.querySelectorAll(":enabled").length){cE.push(":enabled",":disabled")}});cE=new RegExp(cE.join("|"));cu=function(cQ,cL,cS,cV,cU){if(!cV&&!cU&&!cE.test(cQ)){var cO,cT,cN=true,cK=cv,cM=cL,cR=cL.nodeType===9&&cQ;if(cL.nodeType===1&&cL.nodeName.toLowerCase()!=="object"){cO=bx(cQ);if((cN=cL.getAttribute("id"))){cK=cN.replace(cH,"\\$&")}else{cL.setAttribute("id",cK)}cK="[id='"+cK+"'] ";cT=cO.length;while(cT--){cO[cT]=cK+cO[cT].join("")}cM=cn.test(cQ)&&cL.parentNode||cL;cR=cO.join(",")}if(cR){try{cs.apply(cS,bR.call(cM.querySelectorAll(cR),0));return cS}catch(cP){}finally{if(!cN){cL.removeAttribute("id")}}}}return cJ(cQ,cL,cS,cV,cU)};if(cG){cg(function(cL){cI=cG.call(cL,"div");try{cG.call(cL,"[test!='']:sizzle");cD.push("!=",cC)}catch(cK){}});cD=new RegExp(cD.join("|"));cm.matchesSelector=function(cL,cN){cN=cN.replace(cF,"='$1']");if(!bS(cL)&&!cD.test(cN)&&!cE.test(cN)){try{var cK=cG.call(cL,cN);if(cK||cI||cL.document&&cL.document.nodeType!==11){return cK}}catch(cM){}}return cm(cN,null,null,[cL]).length>0}}})()}ch.pseudos.nth=ch.pseudos.eq;function bP(){}ch.filters=bP.prototype=ch.pseudos;ch.setFilters=new bP();cm.attr=D.attr;D.find=cm;D.expr=cm.selectors;D.expr[":"]=D.expr.pseudos;D.unique=cm.uniqueSort;D.text=cm.getText;D.isXMLDoc=cm.isXML;D.contains=cm.contains})(be);var V=/Until$/,ah=/^(?:parents|prev(?:Until|All))/,br=/^.[^:#\[\.,]*$/,aR=D.expr.match.needsContext,ap={children:true,contents:true,next:true,prev:true};D.fn.extend({find:function(bv){var bz,bw,bB,bC,bA,by,bx=this;if(typeof bv!=="string"){return D(bv).filter(function(){for(bz=0,bw=bx.length;bz<bw;bz++){if(D.contains(bx[bz],this)){return true}}})}by=this.pushStack("","find",bv);for(bz=0,bw=this.length;bz<bw;bz++){bB=by.length;D.find(bv,this[bz],by);if(bz>0){for(bC=bB;bC<by.length;bC++){for(bA=0;bA<bB;bA++){if(by[bA]===by[bC]){by.splice(bC--,1);break}}}}}return by},has:function(by){var bx,bw=D(by,this),bv=bw.length;return this.filter(function(){for(bx=0;bx<bv;bx++){if(D.contains(this,bw[bx])){return true}}})},not:function(bv){return this.pushStack(aA(this,bv,false),"not",bv)},filter:function(bv){return this.pushStack(aA(this,bv,true),"filter",bv)},is:function(bv){return !!bv&&(typeof bv==="string"?aR.test(bv)?D(bv,this.context).index(this[0])>=0:D.filter(bv,this).length>0:this.filter(bv).length>0)},closest:function(bz,by){var bA,bx=0,bv=this.length,bw=[],bB=aR.test(bz)||typeof bz!=="string"?D(bz,by||this.context):0;for(;bx<bv;bx++){bA=this[bx];while(bA&&bA.ownerDocument&&bA!==by&&bA.nodeType!==11){if(bB?bB.index(bA)>-1:D.find.matchesSelector(bA,bz)){bw.push(bA);break}bA=bA.parentNode}}bw=bw.length>1?D.unique(bw):bw;return this.pushStack(bw,"closest",bz)},index:function(bv){if(!bv){return(this[0]&&this[0].parentNode)?this.prevAll().length:-1}if(typeof bv==="string"){return D.inArray(this[0],D(bv))}return D.inArray(bv.jqx?bv[0]:bv,this)},add:function(bv,bw){var by=typeof bv==="string"?D(bv,bw):D.makeArray(bv&&bv.nodeType?[bv]:bv),bx=D.merge(this.get(),by);return this.pushStack(y(by[0])||y(bx[0])?bx:D.unique(bx))},addBack:function(bv){return this.add(bv==null?this.prevObject:this.prevObject.filter(bv))}});D.fn.andSelf=D.fn.addBack;function y(bv){return !bv||!bv.parentNode||bv.parentNode.nodeType===11}function aC(bw,bv){do{bw=bw[bv]}while(bw&&bw.nodeType!==1);return bw}D.each({parent:function(bw){var bv=bw.parentNode;return bv&&bv.nodeType!==11?bv:null},parents:function(bv){return D.dir(bv,"parentNode")},parentsUntil:function(bw,bv,bx){return D.dir(bw,"parentNode",bx)},next:function(bv){return aC(bv,"nextSibling")},prev:function(bv){return aC(bv,"previousSibling")},nextAll:function(bv){return D.dir(bv,"nextSibling")},prevAll:function(bv){return D.dir(bv,"previousSibling")},nextUntil:function(bw,bv,bx){return D.dir(bw,"nextSibling",bx)},prevUntil:function(bw,bv,bx){return D.dir(bw,"previousSibling",bx)},siblings:function(bv){return D.sibling((bv.parentNode||{}).firstChild,bv)},children:function(bv){return D.sibling(bv.firstChild)},contents:function(bv){return D.nodeName(bv,"iframe")?bv.contentDocument||bv.contentWindow.document:D.merge([],bv.childNodes)}},function(bv,bw){D.fn[bv]=function(bz,bx){var by=D.map(this,bw,bz);if(!V.test(bv)){bx=bz}if(bx&&typeof bx==="string"){by=D.filter(bx,by)}by=this.length>1&&!ap[bv]?D.unique(by):by;if(this.length>1&&ah.test(bv)){by=by.reverse()}return this.pushStack(by,bv,aE.call(arguments).join(","))}});D.extend({filter:function(bx,bv,bw){if(bw){bx=":not("+bx+")"}return bv.length===1?D.find.matchesSelector(bv[0],bx)?[bv[0]]:[]:D.find.matches(bx,bv)},dir:function(bx,bw,bz){var bv=[],by=bx[bw];while(by&&by.nodeType!==9&&(bz===H||by.nodeType!==1||!D(by).is(bz))){if(by.nodeType===1){bv.push(by)}by=by[bw]}return bv},sibling:function(bx,bw){var bv=[];for(;bx;bx=bx.nextSibling){if(bx.nodeType===1&&bx!==bw){bv.push(bx)}}return bv}});function aA(by,bx,bv){bx=bx||0;if(D.isFunction(bx)){return D.grep(by,function(bA,bz){var bB=!!bx.call(bA,bz,bA);return bB===bv})}else{if(bx.nodeType){return D.grep(by,function(bA,bz){return(bA===bx)===bv})}else{if(typeof bx==="string"){var bw=D.grep(by,function(bz){return bz.nodeType===1});if(br.test(bx)){return D.filter(bx,bw,!bv)}else{bx=D.filter(bx,bw)}}}}return D.grep(by,function(bA,bz){return(D.inArray(bA,bx)>=0)===bv})}function a(bv){var bx=aK.split("|"),bw=bv.createDocumentFragment();if(bw.createElement){while(bx.length){bw.createElement(bx.pop())}}return bw}var aK="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",ab=/ JQXLite\d+="(?:null|\d+)"/g,ai=/^\s+/,M=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,c=/<([\w:]+)/,w=/<tbody/i,Q=/<|&#?\w+;/,X=/<(?:script|style|link)/i,J=/<(?:script|object|embed|option|style)/i,ad=new RegExp("<(?:"+aK+")[\\s/>]","i"),S=/^(?:checkbox|radio)$/,p=/checked\s*(?:[^=]|=\s*.checked.)/i,bq=/\/(java|ecma)script/i,aH=/^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,an={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},U=a(al),bh=U.appendChild(al.createElement("div"));an.optgroup=an.option;an.tbody=an.tfoot=an.colgroup=an.caption=an.thead;an.th=an.td;if(!D.support.htmlSerialize){an._default=[1,"X<div>","</div>"]}D.fn.extend({text:function(bv){return D.access(this,function(bw){return bw===H?D.text(this):this.empty().append((this[0]&&this[0].ownerDocument||al).createTextNode(bw))},null,bv,arguments.length)},wrapAll:function(bv){if(D.isFunction(bv)){return this.each(function(bx){D(this).wrapAll(bv.call(this,bx))})}if(this[0]){var bw=D(bv,this[0].ownerDocument).eq(0).clone(true);if(this[0].parentNode){bw.insertBefore(this[0])}bw.map(function(){var bx=this;while(bx.firstChild&&bx.firstChild.nodeType===1){bx=bx.firstChild}return bx}).append(this)}return this},wrapInner:function(bv){if(D.isFunction(bv)){return this.each(function(bw){D(this).wrapInner(bv.call(this,bw))})}return this.each(function(){var bw=D(this),bx=bw.contents();if(bx.length){bx.wrapAll(bv)}else{bw.append(bv)}})},wrap:function(bv){var bw=D.isFunction(bv);return this.each(function(bx){D(this).wrapAll(bw?bv.call(this,bx):bv)})},unwrap:function(){return this.parent().each(function(){if(!D.nodeName(this,"body")){D(this).replaceWith(this.childNodes)}}).end()},append:function(){return this.domManip(arguments,true,function(bv){if(this.nodeType===1||this.nodeType===11){this.appendChild(bv)}})},prepend:function(){return this.domManip(arguments,true,function(bv){if(this.nodeType===1||this.nodeType===11){this.insertBefore(bv,this.firstChild)}})},before:function(){if(!y(this[0])){return this.domManip(arguments,false,function(bw){this.parentNode.insertBefore(bw,this)})}if(arguments.length){var bv=D.clean(arguments);return this.pushStack(D.merge(bv,this),"before",this.selector)}},after:function(){if(!y(this[0])){return this.domManip(arguments,false,function(bw){this.parentNode.insertBefore(bw,this.nextSibling)})}if(arguments.length){var bv=D.clean(arguments);return this.pushStack(D.merge(this,bv),"after",this.selector)}},remove:function(bv,by){var bx,bw=0;for(;(bx=this[bw])!=null;bw++){if(!bv||D.filter(bv,[bx]).length){if(!by&&bx.nodeType===1){D.cleanData(bx.getElementsByTagName("*"));D.cleanData([bx])}if(bx.parentNode){bx.parentNode.removeChild(bx)}}}return this},empty:function(){var bw,bv=0;for(;(bw=this[bv])!=null;bv++){if(bw.nodeType===1){D.cleanData(bw.getElementsByTagName("*"))}while(bw.firstChild){bw.removeChild(bw.firstChild)}}return this},clone:function(bw,bv){bw=bw==null?false:bw;bv=bv==null?bw:bv;return this.map(function(){return D.clone(this,bw,bv)})},html:function(bv){return D.access(this,function(bz){var by=this[0]||{},bx=0,bw=this.length;if(bz===H){return by.nodeType===1?by.innerHTML.replace(ab,""):H}if(typeof bz==="string"&&!X.test(bz)&&(D.support.htmlSerialize||!ad.test(bz))&&(D.support.leadingWhitespace||!ai.test(bz))&&!an[(c.exec(bz)||["",""])[1].toLowerCase()]){bz=bz.replace(M,"<$1></$2>");try{for(;bx<bw;bx++){by=this[bx]||{};if(by.nodeType===1){D.cleanData(by.getElementsByTagName("*"));by.innerHTML=bz}}by=0}catch(bA){}}if(by){this.empty().append(bz)}},null,bv,arguments.length)},replaceWith:function(bv){if(!y(this[0])){if(D.isFunction(bv)){return this.each(function(by){var bx=D(this),bw=bx.html();bx.replaceWith(bv.call(this,by,bw))})}if(typeof bv!=="string"){bv=D(bv).detach()}return this.each(function(){var bx=this.nextSibling,bw=this.parentNode;D(this).remove();if(bx){D(bx).before(bv)}else{D(bw).append(bv)}})}return this.length?this.pushStack(D(D.isFunction(bv)?bv():bv),"replaceWith",bv):this},detach:function(bv){return this.remove(bv,true)},domManip:function(bB,bF,bE){bB=[].concat.apply([],bB);var bx,bz,bA,bD,by=0,bC=bB[0],bw=[],bv=this.length;if(!D.support.checkClone&&bv>1&&typeof bC==="string"&&p.test(bC)){return this.each(function(){D(this).domManip(bB,bF,bE)})}if(D.isFunction(bC)){return this.each(function(bH){var bG=D(this);bB[0]=bC.call(this,bH,bF?bG.html():H);bG.domManip(bB,bF,bE)})}if(this[0]){bx=D.buildFragment(bB,this,bw);bA=bx.fragment;bz=bA.firstChild;if(bA.childNodes.length===1){bA=bz}if(bz){bF=bF&&D.nodeName(bz,"tr");for(bD=bx.cacheable||bv-1;by<bv;by++){bE.call(bF&&D.nodeName(this[by],"table")?a4(this[by],"tbody"):this[by],by===bD?bA:D.clone(bA,true,true))}}bA=bz=null;if(bw.length){D.each(bw,function(bG,bH){if(bH.src){if(D.ajax){D.ajax({url:bH.src,type:"GET",dataType:"script",async:false,global:false,"throws":true})}else{D.error("no ajax")}}else{D.globalEval((bH.text||bH.textContent||bH.innerHTML||"").replace(aH,""))}if(bH.parentNode){bH.parentNode.removeChild(bH)}})}}return this}});function a4(bw,bv){return bw.getElementsByTagName(bv)[0]||bw.appendChild(bw.ownerDocument.createElement(bv))}function s(bC,bw){if(bw.nodeType!==1||!D.hasData(bC)){return}var bz,by,bv,bB=D._data(bC),bA=D._data(bw,bB),bx=bB.events;if(bx){delete bA.handle;bA.events={};for(bz in bx){for(by=0,bv=bx[bz].length;by<bv;by++){D.event.add(bw,bz,bx[bz][by])}}}if(bA.data){bA.data=D.extend({},bA.data)}}function ac(bw,bv){var bx;if(bv.nodeType!==1){return}if(bv.clearAttributes){bv.clearAttributes()}if(bv.mergeAttributes){bv.mergeAttributes(bw)}bx=bv.nodeName.toLowerCase();if(bx==="object"){if(bv.parentNode){bv.outerHTML=bw.outerHTML}if(D.support.html5Clone&&(bw.innerHTML&&!D.trim(bv.innerHTML))){bv.innerHTML=bw.innerHTML}}else{if(bx==="input"&&S.test(bw.type)){bv.defaultChecked=bv.checked=bw.checked;if(bv.value!==bw.value){bv.value=bw.value}}else{if(bx==="option"){bv.selected=bw.defaultSelected}else{if(bx==="input"||bx==="textarea"){bv.defaultValue=bw.defaultValue}else{if(bx==="script"&&bv.text!==bw.text){bv.text=bw.text}}}}}bv.removeAttribute(D.expando)}D.buildFragment=function(by,bz,bw){var bx,bv,bA,bB=by[0];bz=bz||al;bz=!bz.nodeType&&bz[0]||bz;bz=bz.ownerDocument||bz;if(by.length===1&&typeof bB==="string"&&bB.length<512&&bz===al&&bB.charAt(0)==="<"&&!J.test(bB)&&(D.support.checkClone||!p.test(bB))&&(D.support.html5Clone||!ad.test(bB))){bv=true;bx=D.fragments[bB];bA=bx!==H}if(!bx){bx=bz.createDocumentFragment();D.clean(by,bz,bx,bw);if(bv){D.fragments[bB]=bA&&bx}}return{fragment:bx,cacheable:bv}};D.fragments={};D.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(bv,bw){D.fn[bv]=function(bx){var bz,bB=0,bA=[],bD=D(bx),by=bD.length,bC=this.length===1&&this[0].parentNode;if((bC==null||bC&&bC.nodeType===11&&bC.childNodes.length===1)&&by===1){bD[bw](this[0]);return this}else{for(;bB<by;bB++){bz=(bB>0?this.clone(true):this).get();D(bD[bB])[bw](bz);bA=bA.concat(bz)}return this.pushStack(bA,bv,bD.selector)}}});function bl(bv){if(typeof bv.getElementsByTagName!=="undefined"){return bv.getElementsByTagName("*")}else{if(typeof bv.querySelectorAll!=="undefined"){return bv.querySelectorAll("*")}else{return[]}}}function am(bv){if(S.test(bv.type)){bv.defaultChecked=bv.checked}}D.extend({clone:function(bz,bB,bx){var bv,bw,by,bA;if(D.support.html5Clone||D.isXMLDoc(bz)||!ad.test("<"+bz.nodeName+">")){bA=bz.cloneNode(true)}else{bh.innerHTML=bz.outerHTML;bh.removeChild(bA=bh.firstChild)}if((!D.support.noCloneEvent||!D.support.noCloneChecked)&&(bz.nodeType===1||bz.nodeType===11)&&!D.isXMLDoc(bz)){ac(bz,bA);bv=bl(bz);bw=bl(bA);for(by=0;bv[by];++by){if(bw[by]){ac(bv[by],bw[by])}}}if(bB){s(bz,bA);if(bx){bv=bl(bz);bw=bl(bA);for(by=0;bv[by];++by){s(bv[by],bw[by])}}}bv=bw=null;return bA},clean:function(bI,bx,bv,by){var bF,bE,bH,bM,bB,bL,bC,bz,bw,bG,bK,bD,bA=bx===al&&U,bJ=[];if(!bx||typeof bx.createDocumentFragment==="undefined"){bx=al}for(bF=0;(bH=bI[bF])!=null;bF++){if(typeof bH==="number"){bH+=""}if(!bH){continue}if(typeof bH==="string"){if(!Q.test(bH)){bH=bx.createTextNode(bH)}else{bA=bA||a(bx);bC=bx.createElement("div");bA.appendChild(bC);bH=bH.replace(M,"<$1></$2>");bM=(c.exec(bH)||["",""])[1].toLowerCase();bB=an[bM]||an._default;bL=bB[0];bC.innerHTML=bB[1]+bH+bB[2];while(bL--){bC=bC.lastChild}if(!D.support.tbody){bz=w.test(bH);bw=bM==="table"&&!bz?bC.firstChild&&bC.firstChild.childNodes:bB[1]==="<table>"&&!bz?bC.childNodes:[];for(bE=bw.length-1;bE>=0;--bE){if(D.nodeName(bw[bE],"tbody")&&!bw[bE].childNodes.length){bw[bE].parentNode.removeChild(bw[bE])}}}if(!D.support.leadingWhitespace&&ai.test(bH)){bC.insertBefore(bx.createTextNode(ai.exec(bH)[0]),bC.firstChild)}bH=bC.childNodes;bC.parentNode.removeChild(bC)}}if(bH.nodeType){bJ.push(bH)}else{D.merge(bJ,bH)}}if(bC){bH=bC=bA=null}if(!D.support.appendChecked){for(bF=0;(bH=bJ[bF])!=null;bF++){if(D.nodeName(bH,"input")){am(bH)}else{if(typeof bH.getElementsByTagName!=="undefined"){D.grep(bH.getElementsByTagName("input"),am)}}}}if(bv){bK=function(bN){if(!bN.type||bq.test(bN.type)){return by?by.push(bN.parentNode?bN.parentNode.removeChild(bN):bN):bv.appendChild(bN)}};for(bF=0;(bH=bJ[bF])!=null;bF++){if(!(D.nodeName(bH,"script")&&bK(bH))){bv.appendChild(bH);if(typeof bH.getElementsByTagName!=="undefined"){bD=D.grep(D.merge([],bH.getElementsByTagName("script")),bK);bJ.splice.apply(bJ,[bF+1,0].concat(bD));bF+=bD.length}}}}return bJ},cleanData:function(bw,bE){var bz,bx,by,bD,bA=0,bF=D.expando,bv=D.cache,bB=D.support.deleteExpando,bC=D.event.special;for(;(by=bw[bA])!=null;bA++){if(bE||D.acceptData(by)){bx=by[bF];bz=bx&&bv[bx];if(bz){if(bz.events){for(bD in bz.events){if(bC[bD]){D.event.remove(by,bD)}else{D.removeEvent(by,bD,bz.handle)}}}if(bv[bx]){delete bv[bx];if(bB){delete by[bF]}else{if(by.removeAttribute){by.removeAttribute(bF)}else{by[bF]=null}}D.deletedIds.push(bx)}}}}}});(function(){var bv,bw;D.uaMatch=function(by){by=by.toLowerCase();var bx=/(chrome)[ \/]([\w.]+)/.exec(by)||/(webkit)[ \/]([\w.]+)/.exec(by)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(by)||/(msie) ([\w.]+)/.exec(by)||by.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(by)||[];return{browser:bx[1]||"",version:bx[2]||"0"}};bv=D.uaMatch(bu.userAgent);bw={};if(bv.browser){bw[bv.browser]=true;bw.version=bv.version}if(bw.chrome){bw.webkit=true}else{if(bw.webkit){bw.safari=true}}D.browser=bw;D.sub=function(){function by(bA,bB){return new by.fn.init(bA,bB)}D.extend(true,by,this);by.superclass=this;by.fn=by.prototype=this();by.fn.constructor=by;by.sub=this.sub;by.fn.init=function bz(bA,bB){if(bB&&bB instanceof D&&!(bB instanceof by)){bB=by(bB)}return D.fn.init.call(this,bA,bB,bx)};by.fn.init.prototype=by.fn;var bx=by(al);return by}})();var R,bd,m,ae=/alpha\([^)]*\)/i,ak=/opacity=([^)]*)/,x=/^(top|right|bottom|left)$/,aj=/^(none|table(?!-c[ea]).+)/,aw=/^margin/,j=new RegExp("^("+aF+")(.*)$","i"),aW=new RegExp("^("+aF+")(?!px)[a-z%]+$","i"),F=new RegExp("^([-+])=("+aF+")","i"),K={BODY:"block"},bb={position:"absolute",visibility:"hidden",display:"block"},aM={letterSpacing:0,fontWeight:400},E=["Top","Right","Bottom","Left"],P=["Webkit","O","Moz","ms"],bf=D.fn.toggle;function a3(by,bw){if(bw in by){return bw}var bz=bw.charAt(0).toUpperCase()+bw.slice(1),bv=bw,bx=P.length;while(bx--){bw=P[bx]+bz;if(bw in by){return bw}}return bv}function aq(bw,bv){bw=bv||bw;return D.css(bw,"display")==="none"||!D.contains(bw.ownerDocument,bw)}function bc(bA,bv){var bz,bB,bw=[],bx=0,by=bA.length;for(;bx<by;bx++){bz=bA[bx];if(!bz.style){continue}bw[bx]=D._data(bz,"olddisplay");if(bv){if(!bw[bx]&&bz.style.display==="none"){bz.style.display=""}if(bz.style.display===""&&aq(bz)){bw[bx]=D._data(bz,"olddisplay",aO(bz.nodeName))}}else{bB=R(bz,"display");if(!bw[bx]&&bB!=="none"){D._data(bz,"olddisplay",bB)}}}for(bx=0;bx<by;bx++){bz=bA[bx];if(!bz.style){continue}if(!bv||bz.style.display==="none"||bz.style.display===""){bz.style.display=bv?bw[bx]||"":"none"}}return bA}D.fn.extend({css:function(bv,bw){return D.access(this,function(by,bx,bz){return bz!==H?D.style(by,bx,bz):D.css(by,bx)},bv,bw,arguments.length>1)},show:function(){return bc(this,true)},hide:function(){return bc(this)},toggle:function(bx,bw){var bv=typeof bx==="boolean";if(D.isFunction(bx)&&D.isFunction(bw)){return bf.apply(this,arguments)}return this.each(function(){if(bv?bx:aq(this)){D(this).show()}else{D(this).hide()}})}});D.extend({cssHooks:{opacity:{get:function(bx,bw){if(bw){var bv=R(bx,"opacity");return bv===""?"1":bv}}}},cssNumber:{fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,widows:true,zIndex:true,zoom:true},cssProps:{"float":D.support.cssFloat?"cssFloat":"styleFloat"},style:function(bx,bw,bD,by){if(!bx||bx.nodeType===3||bx.nodeType===8||!bx.style){return}var bB,bC,bE,bz=D.camelCase(bw),bv=bx.style;bw=D.cssProps[bz]||(D.cssProps[bz]=a3(bv,bz));bE=D.cssHooks[bw]||D.cssHooks[bz];if(bD!==H){bC=typeof bD;if(bC==="string"&&(bB=F.exec(bD))){bD=(bB[1]+1)*bB[2]+parseFloat(D.css(bx,bw));bC="number"}if(bD==null||bC==="number"&&isNaN(bD)){return}if(bC==="number"&&!D.cssNumber[bz]){bD+="px"}if(!bE||!("set" in bE)||(bD=bE.set(bx,bD,by))!==H){try{bv[bw]=bD}catch(bA){}}}else{if(bE&&"get" in bE&&(bB=bE.get(bx,false,by))!==H){return bB}return bv[bw]}},css:function(bB,bz,bA,bw){var bC,by,bv,bx=D.camelCase(bz);bz=D.cssProps[bx]||(D.cssProps[bx]=a3(bB.style,bx));bv=D.cssHooks[bz]||D.cssHooks[bx];if(bv&&"get" in bv){bC=bv.get(bB,true,bw)}if(bC===H){bC=R(bB,bz)}if(bC==="normal"&&bz in aM){bC=aM[bz]}if(bA||bw!==H){by=parseFloat(bC);return bA||D.isNumeric(by)?by||0:bC}return bC},swap:function(bz,by,bA){var bx,bw,bv={};for(bw in by){bv[bw]=bz.style[bw];bz.style[bw]=by[bw]}bx=bA.call(bz);for(bw in by){bz.style[bw]=bv[bw]}return bx}});if(be.getComputedStyle){R=function(bC,bw){var bv,bz,by,bB,bA=be.getComputedStyle(bC,null),bx=bC.style;if(bA){bv=bA.getPropertyValue(bw)||bA[bw];if(bv===""&&!D.contains(bC.ownerDocument,bC)){bv=D.style(bC,bw)}if(aW.test(bv)&&aw.test(bw)){bz=bx.width;by=bx.minWidth;bB=bx.maxWidth;bx.minWidth=bx.maxWidth=bx.width=bv;bv=bA.width;bx.width=bz;bx.minWidth=by;bx.maxWidth=bB}}return bv}}else{if(al.documentElement.currentStyle){R=function(bz,bx){var bA,bv,bw=bz.currentStyle&&bz.currentStyle[bx],by=bz.style;if(bw==null&&by&&by[bx]){bw=by[bx]}if(aW.test(bw)&&!x.test(bx)){bA=by.left;bv=bz.runtimeStyle&&bz.runtimeStyle.left;if(bv){bz.runtimeStyle.left=bz.currentStyle.left}by.left=bx==="fontSize"?"1em":bw;bw=by.pixelLeft+"px";by.left=bA;if(bv){bz.runtimeStyle.left=bv}}return bw===""?"auto":bw}}}function aP(bv,bx,by){var bw=j.exec(bx);return bw?Math.max(0,bw[1]-(by||0))+(bw[2]||"px"):bx}function a0(by,bw,bv,bA){var bx=bv===(bA?"border":"content")?4:bw==="width"?1:0,bz=0;for(;bx<4;bx+=2){if(bv==="margin"){bz+=D.css(by,bv+E[bx],true)}if(bA){if(bv==="content"){bz-=parseFloat(R(by,"padding"+E[bx]))||0}if(bv!=="margin"){bz-=parseFloat(R(by,"border"+E[bx]+"Width"))||0}}else{bz+=parseFloat(R(by,"padding"+E[bx]))||0;if(bv!=="padding"){bz+=parseFloat(R(by,"border"+E[bx]+"Width"))||0}}}return bz}function Z(by,bw,bv){var bz=bw==="width"?by.offsetWidth:by.offsetHeight,bx=true,bA=D.support.boxSizing&&D.css(by,"boxSizing")==="border-box";if(bz<=0||bz==null){bz=R(by,bw);if(bz<0||bz==null){bz=by.style[bw]}if(aW.test(bz)){return bz}bx=bA&&(D.support.boxSizingReliable||bz===by.style[bw]);bz=parseFloat(bz)||0}return(bz+a0(by,bw,bv||(bA?"border":"content"),bx))+"px"}function aO(bx){if(K[bx]){return K[bx]}var bv=D("<"+bx+">").appendTo(al.body),bw=bv.css("display");bv.remove();if(bw==="none"||bw===""){bd=al.body.appendChild(bd||D.extend(al.createElement("iframe"),{frameBorder:0,width:0,height:0}));if(!m||!bd.createElement){m=(bd.contentWindow||bd.contentDocument).document;m.write("<!doctype html><html><body>");m.close()}bv=m.body.appendChild(m.createElement(bx));bw=R(bv,"display");al.body.removeChild(bd)}K[bx]=bw;return bw}D.each(["height","width"],function(bw,bv){D.cssHooks[bv]={get:function(bz,by,bx){if(by){if(bz.offsetWidth===0&&aj.test(R(bz,"display"))){return D.swap(bz,bb,function(){return Z(bz,bv,bx)})}else{return Z(bz,bv,bx)}}},set:function(by,bz,bx){return aP(by,bz,bx?a0(by,bv,bx,D.support.boxSizing&&D.css(by,"boxSizing")==="border-box"):0)}}});if(!D.support.opacity){D.cssHooks.opacity={get:function(bw,bv){return ak.test((bv&&bw.currentStyle?bw.currentStyle.filter:bw.style.filter)||"")?(0.01*parseFloat(RegExp.$1))+"":bv?"1":""},set:function(bz,bA){var by=bz.style,bw=bz.currentStyle,bv=D.isNumeric(bA)?"alpha(opacity="+bA*100+")":"",bx=bw&&bw.filter||by.filter||"";by.zoom=1;if(bA>=1&&D.trim(bx.replace(ae,""))===""&&by.removeAttribute){by.removeAttribute("filter");if(bw&&!bw.filter){return}}by.filter=ae.test(bx)?bx.replace(ae,bv):bx+" "+bv}}}D(function(){if(!D.support.reliableMarginRight){D.cssHooks.marginRight={get:function(bw,bv){return D.swap(bw,{display:"inline-block"},function(){if(bv){return R(bw,"marginRight")}})}}}if(!D.support.pixelPosition&&D.fn.position){D.each(["top","left"],function(bv,bw){D.cssHooks[bw]={get:function(bz,by){if(by){var bx=R(bz,bw);return aW.test(bx)?D(bz).position()[bw]+"px":bx}}}})}});if(D.expr&&D.expr.filters){D.expr.filters.hidden=function(bv){return(bv.offsetWidth===0&&bv.offsetHeight===0)||(!D.support.reliableHiddenOffsets&&((bv.style&&bv.style.display)||R(bv,"display"))==="none")};D.expr.filters.visible=function(bv){return !D.expr.filters.hidden(bv)}}D.each({margin:"",padding:"",border:"Width"},function(bv,bw){D.cssHooks[bv+bw]={expand:function(bz){var by,bA=typeof bz==="string"?bz.split(" "):[bz],bx={};for(by=0;by<4;by++){bx[bv+E[by]+bw]=bA[by]||bA[by-2]||bA[0]}return bx}};if(!aw.test(bv)){D.cssHooks[bv+bw].set=aP}});var g=/%20/g,ag=/\[\]$/,bs=/\r?\n/g,aV=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,q=/^(?:select|textarea)/i;D.fn.extend({serialize:function(){return D.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?D.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||q.test(this.nodeName)||aV.test(this.type))}).map(function(bv,bw){var bx=D(this).val();return bx==null?null:D.isArray(bx)?D.map(bx,function(bz,by){return{name:bw.name,value:bz.replace(bs,"\r\n")}}):{name:bw.name,value:bx.replace(bs,"\r\n")}}).get()}});D.param=function(bv,bx){var by,bw=[],bz=function(bA,bB){bB=D.isFunction(bB)?bB():(bB==null?"":bB);bw[bw.length]=encodeURIComponent(bA)+"="+encodeURIComponent(bB)};if(bx===H){bx=D.ajaxSettings&&D.ajaxSettings.traditional}if(D.isArray(bv)||(bv.jqx&&!D.isPlainObject(bv))){D.each(bv,function(){bz(this.name,this.value)})}else{for(by in bv){t(by,bv[by],bx,bz)}}return bw.join("&").replace(g,"+")};function t(bx,bz,bw,by){var bv;if(D.isArray(bz)){D.each(bz,function(bB,bA){if(bw||ag.test(bx)){by(bx,bA)}else{t(bx+"["+(typeof bA==="object"?bB:"")+"]",bA,bw,by)}})}else{if(!bw&&D.type(bz)==="object"){for(bv in bz){t(bx+"["+bv+"]",bz[bv],bw,by)}}else{by(bx,bz)}}}if(D.support.ajax){D.ajaxTransport(function(bv){if(!bv.crossDomain||D.support.cors){var bw;return{send:function(bC,bx){var bA,bz,bB=bv.xhr();if(bv.username){bB.open(bv.type,bv.url,bv.async,bv.username,bv.password)}else{bB.open(bv.type,bv.url,bv.async)}if(bv.xhrFields){for(bz in bv.xhrFields){bB[bz]=bv.xhrFields[bz]}}if(bv.mimeType&&bB.overrideMimeType){bB.overrideMimeType(bv.mimeType)}if(!bv.crossDomain&&!bC["X-Requested-With"]){bC["X-Requested-With"]="XMLHttpRequest"}try{for(bz in bC){bB.setRequestHeader(bz,bC[bz])}}catch(by){}bB.send((bv.hasContent&&bv.data)||null);bw=function(bL,bF){var bG,bE,bD,bJ,bI;try{if(bw&&(bF||bB.readyState===4)){bw=H;if(bA){bB.onreadystatechange=D.noop;if(xhrOnUnloadAbort){delete xhrCallbacks[bA]}}if(bF){if(bB.readyState!==4){bB.abort()}}else{bG=bB.status;bD=bB.getAllResponseHeaders();bJ={};bI=bB.responseXML;if(bI&&bI.documentElement){bJ.xml=bI}try{bJ.text=bB.responseText}catch(bK){}try{bE=bB.statusText}catch(bK){bE=""}if(!bG&&bv.isLocal&&!bv.crossDomain){bG=bJ.text?200:404}else{if(bG===1223){bG=204}}}}}catch(bH){if(!bF){bx(-1,bH)}}if(bJ){bx(bG,bE,bJ,bD)}};if(!bv.async){bw()}else{if(bB.readyState===4){setTimeout(bw,0)}else{bA=++xhrId;if(xhrOnUnloadAbort){if(!xhrCallbacks){xhrCallbacks={};D(be).unload(xhrOnUnloadAbort)}xhrCallbacks[bA]=bw}bB.onreadystatechange=bw}}},abort:function(){if(bw){bw(0,1)}}}}})}var a7,a2,at=/^(?:toggle|show|hide)$/,aN=new RegExp("^(?:([-+])=|)("+aF+")([a-z%]*)$","i"),a8=/queueHooks$/,l=[bn],I={"*":[function(bv,bC){var by,bD,bE=this.createTween(bv,bC),bz=aN.exec(bC),bA=bE.cur(),bw=+bA||0,bx=1,bB=20;if(bz){by=+bz[2];bD=bz[3]||(D.cssNumber[bv]?"":"px");if(bD!=="px"&&bw){bw=D.css(bE.elem,bv,true)||by||1;do{bx=bx||".5";bw=bw/bx;D.style(bE.elem,bv,bw+bD)}while(bx!==(bx=bE.cur()/bA)&&bx!==1&&--bB)}bE.unit=bD;bE.start=bw;bE.end=bz[1]?bw+(bz[1]+1)*by:by}return bE}]};function bm(){setTimeout(function(){a7=H},0);return(a7=D.now())}function aa(bw,bv){D.each(bv,function(bB,bz){var bA=(I[bB]||[]).concat(I["*"]),bx=0,by=bA.length;for(;bx<by;bx++){if(bA[bx].call(bw,bB,bz)){return}}})}function bk(bx,bB,bE){var bF,bA=0,bv=0,bw=l.length,bD=D.Deferred().always(function(){delete bz.elem}),bz=function(){var bL=a7||bm(),bI=Math.max(0,by.startTime+by.duration-bL),bG=bI/by.duration||0,bK=1-bG,bH=0,bJ=by.tweens.length;for(;bH<bJ;bH++){by.tweens[bH].run(bK)}bD.notifyWith(bx,[by,bK,bI]);if(bK<1&&bJ){return bI}else{bD.resolveWith(bx,[by]);return false}},by=bD.promise({elem:bx,props:D.extend({},bB),opts:D.extend(true,{specialEasing:{}},bE),originalProperties:bB,originalOptions:bE,startTime:a7||bm(),duration:bE.duration,tweens:[],createTween:function(bJ,bG,bI){var bH=D.Tween(bx,by.opts,bJ,bG,by.opts.specialEasing[bJ]||by.opts.easing);by.tweens.push(bH);return bH},stop:function(bH){var bG=0,bI=bH?by.tweens.length:0;for(;bG<bI;bG++){by.tweens[bG].run(1)}if(bH){bD.resolveWith(bx,[by,bH])}else{bD.rejectWith(bx,[by,bH])}return this}}),bC=by.props;aX(bC,by.opts.specialEasing);for(;bA<bw;bA++){bF=l[bA].call(by,bx,bC,by.opts);if(bF){return bF}}aa(by,bC);if(D.isFunction(by.opts.start)){by.opts.start.call(bx,by)}D.fx.timer(D.extend(bz,{anim:by,queue:by.opts.queue,elem:bx}));return by.progress(by.opts.progress).done(by.opts.done,by.opts.complete).fail(by.opts.fail).always(by.opts.always)}function aX(by,bA){var bx,bw,bB,bz,bv;for(bx in by){bw=D.camelCase(bx);bB=bA[bw];bz=by[bx];if(D.isArray(bz)){bB=bz[1];bz=by[bx]=bz[0]}if(bx!==bw){by[bw]=bz;delete by[bx]}bv=D.cssHooks[bw];if(bv&&"expand" in bv){bz=bv.expand(bz);delete by[bw];for(bx in bz){if(!(bx in by)){by[bx]=bz[bx];bA[bx]=bB}}}else{bA[bw]=bB}}}D.Animation=D.extend(bk,{tweener:function(bw,bz){if(D.isFunction(bw)){bz=bw;bw=["*"]}else{bw=bw.split(" ")}var by,bv=0,bx=bw.length;for(;bv<bx;bv++){by=bw[bv];I[by]=I[by]||[];I[by].unshift(bz)}},prefilter:function(bw,bv){if(bv){l.unshift(bw)}else{l.push(bw)}}});function bn(bz,bF,bv){var bE,bx,bH,by,bL,bB,bK,bJ,bI,bA=this,bw=bz.style,bG={},bD=[],bC=bz.nodeType&&aq(bz);if(!bv.queue){bJ=D._queueHooks(bz,"fx");if(bJ.unqueued==null){bJ.unqueued=0;bI=bJ.empty.fire;bJ.empty.fire=function(){if(!bJ.unqueued){bI()}}}bJ.unqueued++;bA.always(function(){bA.always(function(){bJ.unqueued--;if(!D.queue(bz,"fx").length){bJ.empty.fire()}})})}if(bz.nodeType===1&&("height" in bF||"width" in bF)){bv.overflow=[bw.overflow,bw.overflowX,bw.overflowY];if(D.css(bz,"display")==="inline"&&D.css(bz,"float")==="none"){if(!D.support.inlineBlockNeedsLayout||aO(bz.nodeName)==="inline"){bw.display="inline-block"}else{bw.zoom=1}}}if(bv.overflow){bw.overflow="hidden";if(!D.support.shrinkWrapBlocks){bA.done(function(){bw.overflow=bv.overflow[0];bw.overflowX=bv.overflow[1];bw.overflowY=bv.overflow[2]})}}for(bE in bF){bH=bF[bE];if(at.exec(bH)){delete bF[bE];bB=bB||bH==="toggle";if(bH===(bC?"hide":"show")){continue}bD.push(bE)}}by=bD.length;if(by){bL=D._data(bz,"fxshow")||D._data(bz,"fxshow",{});if("hidden" in bL){bC=bL.hidden}if(bB){bL.hidden=!bC}if(bC){D(bz).show()}else{bA.done(function(){D(bz).hide()})}bA.done(function(){var bM;D.removeData(bz,"fxshow",true);for(bM in bG){D.style(bz,bM,bG[bM])}});for(bE=0;bE<by;bE++){bx=bD[bE];bK=bA.createTween(bx,bC?bL[bx]:0);bG[bx]=bL[bx]||D.style(bz,bx);if(!(bx in bL)){bL[bx]=bK.start;if(bC){bK.end=bK.start;bK.start=bx==="width"||bx==="height"?1:0}}}}}function v(bx,bw,bz,bv,by){return new v.prototype.init(bx,bw,bz,bv,by)}D.Tween=v;v.prototype={constructor:v,init:function(by,bw,bA,bv,bz,bx){this.elem=by;this.prop=bA;this.easing=bz||"swing";this.options=bw;this.start=this.now=this.cur();this.end=bv;this.unit=bx||(D.cssNumber[bA]?"":"px")},cur:function(){var bv=v.propHooks[this.prop];return bv&&bv.get?bv.get(this):v.propHooks._default.get(this)},run:function(bx){var bw,bv=v.propHooks[this.prop];if(this.options.duration){this.pos=bw=D.easing[this.easing](bx,this.options.duration*bx,0,1,this.options.duration)}else{this.pos=bw=bx}this.now=(this.end-this.start)*bw+this.start;if(this.options.step){this.options.step.call(this.elem,this.now,this)}if(bv&&bv.set){bv.set(this)}else{v.propHooks._default.set(this)}return this}};v.prototype.init.prototype=v.prototype;v.propHooks={_default:{get:function(bw){var bv;if(bw.elem[bw.prop]!=null&&(!bw.elem.style||bw.elem.style[bw.prop]==null)){return bw.elem[bw.prop]}bv=D.css(bw.elem,bw.prop,false,"");return !bv||bv==="auto"?0:bv},set:function(bv){if(D.fx.step[bv.prop]){D.fx.step[bv.prop](bv)}else{if(bv.elem.style&&(bv.elem.style[D.cssProps[bv.prop]]!=null||D.cssHooks[bv.prop])){D.style(bv.elem,bv.prop,bv.now+bv.unit)}else{bv.elem[bv.prop]=bv.now}}}}};v.propHooks.scrollTop=v.propHooks.scrollLeft={set:function(bv){if(bv.elem.nodeType&&bv.elem.parentNode){bv.elem[bv.prop]=bv.now}}};D.each(["toggle","show","hide"],function(bw,bv){var bx=D.fn[bv];D.fn[bv]=function(by,bA,bz){return by==null||typeof by==="boolean"||(!bw&&D.isFunction(by)&&D.isFunction(bA))?bx.apply(this,arguments):this.animate(aZ(bv,true),by,bA,bz)}});D.fn.extend({fadeTo:function(bv,by,bx,bw){return this.filter(aq).css("opacity",0).show().end().animate({opacity:by},bv,bx,bw)},animate:function(bB,by,bA,bz){var bx=D.isEmptyObject(bB),bv=D.speed(by,bA,bz),bw=function(){var bC=bk(this,D.extend({},bB),bv);if(bx){bC.stop(true)}};return bx||bv.queue===false?this.each(bw):this.queue(bv.queue,bw)},stop:function(bx,bw,bv){var by=function(bz){var bA=bz.stop;delete bz.stop;bA(bv)};if(typeof bx!=="string"){bv=bw;bw=bx;bx=H}if(bw&&bx!==false){this.queue(bx||"fx",[])}return this.each(function(){var bC=true,bz=bx!=null&&bx+"queueHooks",bB=D.timers,bA=D._data(this);if(bz){if(bA[bz]&&bA[bz].stop){by(bA[bz])}}else{for(bz in bA){if(bA[bz]&&bA[bz].stop&&a8.test(bz)){by(bA[bz])}}}for(bz=bB.length;bz--;){if(bB[bz].elem===this&&(bx==null||bB[bz].queue===bx)){bB[bz].anim.stop(bv);bC=false;bB.splice(bz,1)}}if(bC||!bv){D.dequeue(this,bx)}})}});function aZ(bx,bz){var by,bv={height:bx},bw=0;bz=bz?1:0;for(;bw<4;bw+=2-bz){by=E[bw];bv["margin"+by]=bv["padding"+by]=bx}if(bz){bv.opacity=bv.width=bx}return bv}D.each({slideDown:aZ("show"),slideUp:aZ("hide"),slideToggle:aZ("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(bv,bw){D.fn[bv]=function(bx,bz,by){return this.animate(bw,bx,bz,by)}});D.speed=function(bx,by,bw){var bv=bx&&typeof bx==="object"?D.extend({},bx):{complete:bw||!bw&&by||D.isFunction(bx)&&bx,duration:bx,easing:bw&&by||by&&!D.isFunction(by)&&by};bv.duration=D.fx.off?0:typeof bv.duration==="number"?bv.duration:bv.duration in D.fx.speeds?D.fx.speeds[bv.duration]:D.fx.speeds._default;if(bv.queue==null||bv.queue===true){bv.queue="fx"}bv.old=bv.complete;bv.complete=function(){if(D.isFunction(bv.old)){bv.old.call(this)}if(bv.queue){D.dequeue(this,bv.queue)}};return bv};D.easing={linear:function(bv){return bv},swing:function(bv){return 0.5-Math.cos(bv*Math.PI)/2}};D.timers=[];D.fx=v.prototype.init;D.fx.tick=function(){var bx,bw=D.timers,bv=0;a7=D.now();for(;bv<bw.length;bv++){bx=bw[bv];if(!bx()&&bw[bv]===bx){bw.splice(bv--,1)}}if(!bw.length){D.fx.stop()}a7=H};D.fx.timer=function(bv){if(bv()&&D.timers.push(bv)&&!a2){a2=setInterval(D.fx.tick,D.fx.interval)}};D.fx.interval=13;D.fx.stop=function(){clearInterval(a2);a2=null};D.fx.speeds={slow:600,fast:200,_default:400};D.fx.step={};if(D.expr&&D.expr.filters){D.expr.filters.animated=function(bv){return D.grep(D.timers,function(bw){return bv===bw.elem}).length}}var W=/^(?:body|html)$/i;D.fn.offset=function(bF){if(arguments.length){return bF===H?this:this.each(function(bG){D.offset.setOffset(this,bF,bG)})}var bw,bB,bC,bz,bD,bv,by,bA={top:0,left:0},bx=this[0],bE=bx&&bx.ownerDocument;if(!bE){return}if((bB=bE.body)===bx){return D.offset.bodyOffset(bx)}bw=bE.documentElement;if(!D.contains(bw,bx)){return bA}if(typeof bx.getBoundingClientRect!=="undefined"){bA=bx.getBoundingClientRect()}bC=aD(bE);bz=bw.clientTop||bB.clientTop||0;bD=bw.clientLeft||bB.clientLeft||0;bv=bC.pageYOffset||bw.scrollTop;by=bC.pageXOffset||bw.scrollLeft;return{top:bA.top+bv-bz,left:bA.left+by-bD}};D.offset={bodyOffset:function(bv){var bx=bv.offsetTop,bw=bv.offsetLeft;if(D.support.doesNotIncludeMarginInBodyOffset){bx+=parseFloat(D.css(bv,"marginTop"))||0;bw+=parseFloat(D.css(bv,"marginLeft"))||0}return{top:bx,left:bw}},setOffset:function(by,bH,bB){var bC=D.css(by,"position");if(bC==="static"){by.style.position="relative"}var bA=D(by),bw=bA.offset(),bv=D.css(by,"top"),bF=D.css(by,"left"),bG=(bC==="absolute"||bC==="fixed")&&D.inArray("auto",[bv,bF])>-1,bE={},bD={},bx,bz;if(bG){bD=bA.position();bx=bD.top;bz=bD.left}else{bx=parseFloat(bv)||0;bz=parseFloat(bF)||0}if(D.isFunction(bH)){bH=bH.call(by,bB,bw)}if(bH.top!=null){bE.top=(bH.top-bw.top)+bx}if(bH.left!=null){bE.left=(bH.left-bw.left)+bz}if("using" in bH){bH.using.call(by,bE)}else{bA.css(bE)}}};D.fn.extend({isRendered:function(){var bw=this;var bv=this[0];if(bv.parentNode==null||(bv.offsetWidth===0||bv.offsetHeight===0)){return false}return true},getSizeFromStyle:function(){var bz=this;var by=null;var bv=null;var bx=this[0];var bw;if(bx.style.width){by=bx.style.width}if(bx.style.height){bv=bx.style.height}if(be.getComputedStyle){bw=getComputedStyle(bx,null)}else{bw=bx.currentStyle}if(bw){if(bw.width){by=bw.width}if(bw.height){bv=bw.height}}if(by==="0px"){by=0}if(bv==="0px"){bv=0}if(by===null){by=0}if(bv===null){bv=0}return{width:by,height:bv}},initAnimate:function(){},sizeStyleChanged:function(by){var bx=this;var bz;var bv=function(bA){var bB=bz;if(bA&&bA[0]&&bA[0].attributeName==="style"&&bA[0].type==="attributes"){if(bB.element.offsetWidth!==bB.offsetWidth||bB.element.offsetHeight!==bB.offsetHeight){bB.offsetWidth=bB.element.offsetWidth;bB.offsetHeight=bB.element.offsetHeight;if(bx.isRendered()){bB.callback()}}}};bz={element:bx[0],offsetWidth:bx[0].offsetWidth,offsetHeight:bx[0].offsetHeight,callback:by};try{if(!bx.elementStyleObserver){bx.elementStyleObserver=new MutationObserver(bv);bx.elementStyleObserver.observe(bx[0],{attributes:true,childList:false,characterData:false})}}catch(bw){}},position:function(){if(!this[0]){return}var bx=this[0],bw=this.offsetParent(),by=this.offset(),bv=W.test(bw[0].nodeName)?{top:0,left:0}:bw.offset();by.top-=parseFloat(D.css(bx,"marginTop"))||0;by.left-=parseFloat(D.css(bx,"marginLeft"))||0;bv.top+=parseFloat(D.css(bw[0],"borderTopWidth"))||0;bv.left+=parseFloat(D.css(bw[0],"borderLeftWidth"))||0;return{top:by.top-bv.top,left:by.left-bv.left}},offsetParent:function(){return this.map(function(){var bv=this.offsetParent||al.body;while(bv&&(!W.test(bv.nodeName)&&D.css(bv,"position")==="static")){bv=bv.offsetParent}return bv||al.body})}});D.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(bx,bw){var bv=/Y/.test(bw);D.fn[bx]=function(by){return D.access(this,function(bz,bC,bB){var bA=aD(bz);if(bB===H){return bA?(bw in bA)?bA[bw]:bA.document.documentElement[bC]:bz[bC]}if(bA){bA.scrollTo(!bv?bB:D(bA).scrollLeft(),bv?bB:D(bA).scrollTop())}else{bz[bC]=bB}},bx,by,arguments.length,null)}});function aD(bv){return D.isWindow(bv)?bv:bv.nodeType===9?bv.defaultView||bv.parentWindow:false}D.each({Height:"height",Width:"width"},function(bv,bw){D.each({padding:"inner"+bv,content:bw,"":"outer"+bv},function(bx,by){D.fn[by]=function(bC,bB){var bA=arguments.length&&(bx||typeof bC!=="boolean"),bz=bx||(bC===true||bB===true?"margin":"border");return D.access(this,function(bE,bD,bF){var bG;if(D.isWindow(bE)){return bE.document.documentElement["client"+bv]}if(bE.nodeType===9){bG=bE.documentElement;return Math.max(bE.body["scroll"+bv],bG["scroll"+bv],bE.body["offset"+bv],bG["offset"+bv],bG["client"+bv])}return bF===H?D.css(bE,bD,bF,bz):D.style(bE,bD,bF,bz)},bw,bA?bC:H,bA,null)}})});be.JQXLite=be.jqxHelper=D;if(typeof define==="function"&&define.amd&&define.amd.JQXLite){define("jqx",[],function(){return D})}})(window)}(function(a){if(a.jQuery){a.minQuery=a.JQXLite=a.jQuery;return}if(!a.$){a.$=a.minQuery=a.JQXLite}else{a.minQuery=a.JQXLite=a.$}})(window);JQXLite.generateID=function(){var a=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};var b="";do{b="jqx"+a()+a()+a()}while($("#"+b).length>0);return b};var jqxBaseFramework=window.jqxBaseFramework=window.minQuery||window.jQuery;(function(b){b.jqx=b.jqx||{};window.jqx=b.jqx;var a={createInstance:function(c,e,g){if(e=="jqxDataAdapter"){var f=g[0];var d=g[1]||{};return new b.jqx.dataAdapter(f,d)}b(c)[e](g||{});return b(c)[e]("getInstance")}};window.jqwidgets=a;b.jqx.define=function(c,d,e){c[d]=function(){if(this.baseType){this.base=new c[this.baseType]();this.base.defineInstance()}this.defineInstance();this.metaInfo()};c[d].prototype.defineInstance=function(){};c[d].prototype.metaInfo=function(){};c[d].prototype.base=null;c[d].prototype.baseType=undefined;if(e&&c[e]){c[d].prototype.baseType=e}};b.jqx.invoke=function(f,e){if(e.length==0){return}var g=typeof(e)==Array||e.length>0?e[0]:e;var d=typeof(e)==Array||e.length>1?Array.prototype.slice.call(e,1):b({}).toArray();while(f[g]==undefined&&f.base!=null){if(f[g]!=undefined&&b.isFunction(f[g])){return f[g].apply(f,d)}if(typeof g=="string"){var c=g.toLowerCase();if(f[c]!=undefined&&b.isFunction(f[c])){return f[c].apply(f,d)}}f=f.base}if(f[g]!=undefined&&b.isFunction(f[g])){return f[g].apply(f,d)}if(typeof g=="string"){var c=g.toLowerCase();if(f[c]!=undefined&&b.isFunction(f[c])){return f[c].apply(f,d)}}return};b.jqx.getByPriority=function(c){var e=undefined;for(var d=0;d<c.length&&e==undefined;d++){if(e==undefined&&c[d]!=undefined){e=c[d]}}return e};b.jqx.hasProperty=function(d,c){if(typeof(c)=="object"){for(var f in c){var e=d;while(e){if(e.hasOwnProperty(f)){return true}if(e.hasOwnProperty(f.toLowerCase())){return true}e=e.base}return false}}else{while(d){if(d.hasOwnProperty(c)){return true}if(d.hasOwnProperty(c.toLowerCase())){return true}d=d.base}}return false};b.jqx.hasFunction=function(f,e){if(e.length==0){return false}if(f==undefined){return false}var g=typeof(e)==Array||e.length>0?e[0]:e;var d=typeof(e)==Array||e.length>1?Array.prototype.slice.call(e,1):{};while(f[g]==undefined&&f.base!=null){if(f[g]&&b.isFunction(f[g])){return true}if(typeof g=="string"){var c=g.toLowerCase();if(f[c]&&b.isFunction(f[c])){return true}}f=f.base}if(f[g]&&b.isFunction(f[g])){return true}if(typeof g=="string"){var c=g.toLowerCase();if(f[c]&&b.isFunction(f[c])){return true}}return false};b.jqx.isPropertySetter=function(d,c){if(c.length==1&&typeof(c[0])=="object"){return true}if(c.length==2&&typeof(c[0])=="string"&&!b.jqx.hasFunction(d,c)){return true}return false};b.jqx.validatePropertySetter=function(g,e,c){if(!b.jqx.propertySetterValidation){return true}if(e.length==1&&typeof(e[0])=="object"){for(var f in e[0]){var h=g;while(!h.hasOwnProperty(f)&&h.base){h=h.base}if(!h||!h.hasOwnProperty(f)){if(!c){var d=h.hasOwnProperty(f.toString().toLowerCase());if(!d){throw"Invalid property: "+f}else{return true}}return false}}return true}if(e.length!=2){if(!c){throw"Invalid property: "+e.length>=0?e[0]:""}return false}while(!g.hasOwnProperty(e[0])&&g.base){g=g.base}if(!g||!g.hasOwnProperty(e[0])){if(!c){throw"Invalid property: "+e[0]}return false}return true};if(!Object.keys){Object.keys=(function(){var e=Object.prototype.hasOwnProperty,f=!({toString:null}).propertyIsEnumerable("toString"),d=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],c=d.length;return function(j){if(typeof j!=="object"&&(typeof j!=="function"||j===null)){throw new TypeError("Object.keys called on non-object")}var g=[],k,h;for(k in j){if(e.call(j,k)){g.push(k)}}if(f){for(h=0;h<c;h++){if(e.call(j,d[h])){g.push(d[h])}}}return g}}())}b.jqx.set=function(f,j){var d=0;if(j.length==1&&typeof(j[0])=="object"){if(f.isInitialized&&Object.keys&&Object.keys(j[0]).length>1){var g=!f.base?f.element:f.base.element;var c=b.data(g,f.widgetName).initArgs;if(c&&JSON&&JSON.stringify&&j[0]&&c[0]){try{if(JSON.stringify(j[0])==JSON.stringify(c[0])){var h=true;b.each(j[0],function(m,n){if(f[m]!=n){h=false;return false}});if(h){return}}}catch(e){}}f.batchUpdate=j[0];var k={};var l={};b.each(j[0],function(m,n){var o=f;while(!o.hasOwnProperty(m)&&o.base!=null){o=o.base}if(o.hasOwnProperty(m)){if(f[m]!=n){k[m]=f[m];l[m]=n;d++}}else{if(o.hasOwnProperty(m.toLowerCase())){if(f[m.toLowerCase()]!=n){k[m.toLowerCase()]=f[m.toLowerCase()];l[m.toLowerCase()]=n;d++}}}});if(d<2){f.batchUpdate=null}}b.each(j[0],function(m,n){var o=f;while(!o.hasOwnProperty(m)&&o.base!=null){o=o.base}if(o.hasOwnProperty(m)){b.jqx.setvalueraiseevent(o,m,n)}else{if(o.hasOwnProperty(m.toLowerCase())){b.jqx.setvalueraiseevent(o,m.toLowerCase(),n)}else{if(b.jqx.propertySetterValidation){throw"jqxCore: invalid property '"+m+"'"}}}});if(f.batchUpdate!=null){f.batchUpdate=null;if(f.propertiesChangedHandler&&d>1){f.propertiesChangedHandler(f,k,l)}}}else{if(j.length==2){while(!f.hasOwnProperty(j[0])&&f.base){f=f.base}if(f.hasOwnProperty(j[0])){b.jqx.setvalueraiseevent(f,j[0],j[1])}else{if(f.hasOwnProperty(j[0].toLowerCase())){b.jqx.setvalueraiseevent(f,j[0].toLowerCase(),j[1])}else{if(b.jqx.propertySetterValidation){throw"jqxCore: invalid property '"+j[0]+"'"}}}}}};b.jqx.setvalueraiseevent=function(d,e,f){var c=d[e];d[e]=f;if(!d.isInitialized){return}if(d.propertyChangedHandler!=undefined){d.propertyChangedHandler(d,e,c,f)}if(d.propertyChangeMap!=undefined&&d.propertyChangeMap[e]!=undefined){d.propertyChangeMap[e](d,e,c,f)}};b.jqx.get=function(f,e){if(e==undefined||e==null){return undefined}if(f.propertyMap){var d=f.propertyMap(e);if(d!=null){return d}}if(f.hasOwnProperty(e)){return f[e]}if(f.hasOwnProperty(e.toLowerCase())){return f[e.toLowerCase()]}var c=undefined;if(typeof(e)==Array){if(e.length!=1){return undefined}c=e[0]}else{if(typeof(e)=="string"){c=e}}while(!f.hasOwnProperty(c)&&f.base){f=f.base}if(f){return f[c]}return undefined};b.jqx.serialize=function(f){var c="";if(b.isArray(f)){c="[";for(var e=0;e<f.length;e++){if(e>0){c+=", "}c+=b.jqx.serialize(f[e])}c+="]"}else{if(typeof(f)=="object"){c="{";var d=0;for(var e in f){if(d++>0){c+=", "}c+=e+": "+b.jqx.serialize(f[e])}c+="}"}else{c=f.toString()}}return c};b.jqx.propertySetterValidation=true;b.jqx.jqxWidgetProxy=function(h,d,c){var e=b(d);var g=b.data(d,h);if(g==undefined){return undefined}var f=g.instance;if(b.jqx.hasFunction(f,c)){return b.jqx.invoke(f,c)}if(b.jqx.isPropertySetter(f,c)){if(b.jqx.validatePropertySetter(f,c)){b.jqx.set(f,c);return undefined}}else{if(typeof(c)=="object"&&c.length==0){return}else{if(typeof(c)=="object"&&c.length==1&&b.jqx.hasProperty(f,c[0])){return b.jqx.get(f,c[0])}else{if(typeof(c)=="string"&&b.jqx.hasProperty(f,c[0])){return b.jqx.get(f,c)}}}}throw"jqxCore: Invalid parameter '"+b.jqx.serialize(c)+"' does not exist."};b.jqx.applyWidget=function(d,f,l,m){var h=false;try{h=window.MSApp!=undefined}catch(g){}var n=b(d);if(!m){m=new b.jqx["_"+f]()}else{m.host=n;m.element=d}if(d.id==""){d.id=b.jqx.utilities.createId()}var k={host:n,element:d,instance:m,initArgs:l};m.widgetName=f;b.data(d,f,k);b.data(d,"jqxWidget",k.instance);var j=new Array();var m=k.instance;while(m){m.isInitialized=false;j.push(m);m=m.base}j.reverse();j[0].theme=b.jqx.theme||"";b.jqx.jqxWidgetProxy(f,d,l);for(var c in j){m=j[c];if(c==0){m.host=n;m.element=d;m.WinJS=h}if(m!=undefined){if(m.definedInstance){m.definedInstance()}if(m.createInstance!=null){if(h){MSApp.execUnsafeLocalFunction(function(){m.createInstance(l)})}else{m.createInstance(l)}}}}for(var c in j){if(j[c]!=undefined){j[c].isInitialized=true}}if(h){MSApp.execUnsafeLocalFunction(function(){k.instance.refresh(true)})}else{k.instance.refresh(true)}};b.jqx.jqxWidget=function(c,d,g){var k=false;try{jqxArgs=Array.prototype.slice.call(g,0)}catch(j){jqxArgs=""}try{k=window.MSApp!=undefined}catch(j){}var h=c;var m="";if(d){m="_"+d}b.jqx.define(b.jqx,"_"+h,m);var l=new Array();if(!window[h]){var f=function(n){if(n==null){return""}var e=b.type(n);switch(e){case"string":case"number":case"date":case"boolean":case"bool":if(n===null){return""}return n.toString()}var o="";b.each(n,function(q,r){var t=r;if(q>0){o+=", "}o+="[";var p=0;if(b.type(t)=="object"){for(var s in t){if(p>0){o+=", "}o+="{"+s+":"+t[s]+"}";p++}}else{if(p>0){o+=", "}o+="{"+q+":"+t+"}";p++}o+="]"});return o};a[h]=window[h]=function(e,s){var n=[];if(!s){s={}}n.push(s);var o=e;if(b.type(o)==="object"&&e[0]){o=e[0].id;if(o===""){o=e[0].id=b.jqx.utilities.createId()}}else{if(b.type(e)==="object"&&e&&e.nodeName){o=e.id;if(o===""){o=e.id=b.jqx.utilities.createId()}}}if(window.jqxWidgets&&window.jqxWidgets[o]){if(s){b.each(window.jqxWidgets[o],function(t){var u=b(this.element).data();if(u&&u.jqxWidget){b(this.element)[h](s)}})}if(window.jqxWidgets[o].length==1){var q=b(window.jqxWidgets[o][0].widgetInstance.element).data();if(q&&q.jqxWidget){return window.jqxWidgets[o][0]}}var q=b(window.jqxWidgets[o][0].widgetInstance.element).data();if(q&&q.jqxWidget){return window.jqxWidgets[o]}}var p=b(e);if(p.length===0){p=b("<div></div>");if(h==="jqxInput"||h==="jqxPasswordInput"||h==="jqxMaskedInput"){p=b("<input/>")}if(h==="jqxTextArea"){p=b("<textarea></textarea>")}if(h==="jqxButton"||h==="jqxRepeatButton"||h==="jqxToggleButton"){p=b("<button/>")}if(h==="jqxSplitter"){p=b("<div><div>Panel 1</div><div>Panel 2</div></div>")}if(h==="jqxTabs"){p=b("<div><ul><li>Tab 1</li><li>Tab 2</li></ul><div>Content 1</div><div>Content 2</div></div>")}if(h==="jqxRibbon"){p=b("<div><ul><li>Tab 1</li><li>Tab 2</li></ul><div><div>Content 1</div><div>Content 2</div></div></div>")}if(h==="jqxDocking"){p=b("<div><div><div><div>Title 1</div><div>Content 1</div></div></div></div>")}if(h==="jqxWindow"){p=b("<div><div>Title 1</div><div>Content 1</div></div>")}}var r=[];b.each(p,function(w){var y=p[w];b.jqx.applyWidget(y,h,n,undefined);if(!l[h]){var u=b.data(y,"jqxWidget");var x=b.jqx["_"+h].prototype.defineInstance();var v={};if(b.jqx["_"+h].prototype.metaInfo){v=b.jqx["_"+h].prototype.metaInfo()}if(h=="jqxDockingLayout"){x=b.extend(x,b.jqx._jqxLayout.prototype.defineInstance())}if(h=="jqxToggleButton"||h=="jqxRepeatButton"){x=b.extend(x,b.jqx._jqxButton.prototype.defineInstance())}if(h=="jqxTreeGrid"){x=b.extend(x,b.jqx._jqxDataTable.prototype.defineInstance())}var t=function(A){var z=b.data(A,"jqxWidget");this.widgetInstance=z;var B=b.extend(this,z);B.on=B.addEventListener=function(D,E){B.addHandler(!B.base?B.host:B.base.host,D,E)};B.off=B.removeEventListener=function(D){B.removeHandler(!B.base?B.host:B.base.host,D)};for(var C in z){if(b.type(z[C])=="function"){B[C]=b.proxy(z[C],z)}}return B};l[h]=t;b.each(x,function(A,z){Object.defineProperty(t.prototype,A,{get:function(){if(this.widgetInstance){return this.widgetInstance[A]}return z},set:function(H){if(this.widgetInstance&&(this.widgetInstance[A]!=H||A==="width"||A==="height")){var F=this.widgetInstance[A];var E=H;var D=b.type(F);var B=b.type(E);var G=false;if(D!=B||A==="source"||A==="width"||A==="height"){G=true}if(G||(f(F)!=f(E))){var C={};C[A]=H;if(this.widgetInstance.host){this.widgetInstance.host[h](C)}else{this.widgetInstance.base.host[h](C)}this.widgetInstance[A]=H;if(this.widgetInstance.propertyUpdated){this.widgetInstance.propertyUpdated(A,F,H)}}}}})})}var u=new l[h](y);r.push(u);if(!window.jqxWidgets){window.jqxWidgets=new Array()}if(!window.jqxWidgets[o]){window.jqxWidgets[o]=new Array()}window.jqxWidgets[o].push(u)});if(r.length===1){return r[0]}return r}}b.fn[h]=function(){var e=Array.prototype.slice.call(arguments,0);if(e.length==0||(e.length==1&&typeof(e[0])=="object")){if(this.length==0){if(this.selector){throw new Error("Invalid Selector - "+this.selector+"! Please, check whether the used ID or CSS Class name is correct.")}else{throw new Error("Invalid Selector! Please, check whether the used ID or CSS Class name is correct.")}}return this.each(function(){var q=b(this);var p=this;var r=b.data(p,h);if(r==null){b.jqx.applyWidget(p,h,e,undefined)}else{b.jqx.jqxWidgetProxy(h,this,e)}})}else{if(this.length==0){if(this.selector){throw new Error("Invalid Selector - "+this.selector+"! Please, check whether the used ID or CSS Class name is correct.")}else{throw new Error("Invalid Selector! Please, check whether the used ID or CSS Class name is correct.")}}var o=null;var n=0;this.each(function(){var p=b.jqx.jqxWidgetProxy(h,this,e);if(n==0){o=p;n++}else{if(n==1){var q=[];q.push(o);o=q}o.push(p)}})}return o};try{b.extend(b.jqx["_"+h].prototype,Array.prototype.slice.call(g,0)[0])}catch(j){}b.extend(b.jqx["_"+h].prototype,{toThemeProperty:function(e,n){return b.jqx.toThemeProperty(this,e,n)},isMaterialized:function(){if(!this.theme){return false}if(this.theme.indexOf("material")>=0){return true}},isModern:function(){if(!this.theme){return false}if(this.theme.indexOf("light")>=0){return true}if(this.theme==="dark"){return true}},_addBarAndLabel:function(p){var o=this;var e=b("<label></label");e[0].innerHTML=this.placeHolder;e.addClass(o.toThemeProperty("jqx-input-label"));p.after(e);o.label=e;var n=b("<span></span>");p.after(n);n.addClass(o.toThemeProperty("jqx-input-bar"));o.bar=n;o.bar.css("top",this.host.height())}});b.jqx["_"+h].prototype.refresh=function(){if(this.base){this.base.refresh(true)}};b.jqx["_"+h].prototype.createInstance=function(){};b.jqx["_"+h].prototype.addEventHandler=function(n,e){if(this.base){this.base.host.on(n,e)}else{this.host.on(n,e)}};b.jqx["_"+h].prototype.removeEventHandler=function(n,e){if(this.base){this.base.host.off(n)}else{this.host.off(n)}};b.jqx["_"+h].prototype.applyTo=function(o,n){if(!(n instanceof Array)){var e=[];e.push(n);n=e}b.jqx.applyWidget(o,h,n,this)};b.jqx["_"+h].prototype.getInstance=function(){return this};b.jqx["_"+h].prototype.propertyChangeMap={};b.jqx["_"+h].prototype.addHandler=function(p,e,n,o){b.jqx.addHandler(b(p),e,n,o)};b.jqx["_"+h].prototype.removeHandler=function(o,e,n){b.jqx.removeHandler(b(o),e,n)};b.jqx["_"+h].prototype.setOptions=function(){if(!this.host||!this.host.length||this.host.length!=1){return}return b.jqx.jqxWidgetProxy(h,this.host[0],arguments)}};b.jqx.toThemeProperty=function(d,e,j){if(d.theme==""){return e}var h=e.split(" ");var c="";for(var g=0;g<h.length;g++){if(g>0){c+=" "}var f=h[g];if(j!=null&&j){c+=f+"-"+d.theme}else{c+=f+" "+f+"-"+d.theme}}return c};b.jqx.addHandler=function(h,j,f,g){var d=j.split(" ");for(var c=0;c<d.length;c++){var e=d[c];if(window.addEventListener){switch(e){case"mousewheel":if(b.jqx.browser.mozilla){h[0].addEventListener("DOMMouseScroll",f,false)}else{h[0].addEventListener("mousewheel",f,false)}continue;case"mousemove":if(!g){h[0].addEventListener("mousemove",f,false);continue}break}}if(g==undefined||g==null){if(h.on){h.on(e,f)}else{h.bind(e,f)}}else{if(h.on){h.on(e,g,f)}else{h.bind(e,g,f)}}}};b.jqx.removeHandler=function(g,h,f){if(!h){if(g.off){g.off()}else{g.unbind()}return}var d=h.split(" ");for(var c=0;c<d.length;c++){var e=d[c];if(window.removeEventListener){switch(e){case"mousewheel":if(b.jqx.browser.mozilla){g[0].removeEventListener("DOMMouseScroll",f,false)}else{g[0].removeEventListener("mousewheel",f,false)}continue;case"mousemove":if(f){g[0].removeEventListener("mousemove",f,false);continue}break}}if(e==undefined){if(g.off){g.off()}else{g.unbind()}continue}if(f==undefined){if(g.off){g.off(e)}else{g.unbind(e)}}else{if(g.off){g.off(e,f)}else{g.unbind(e,f)}}}};b.jqx.credits=b.jqx.credits||"";b.jqx.theme=b.jqx.theme||"";b.jqx.scrollAnimation=b.jqx.scrollAnimation||false;b.jqx.resizeDelay=b.jqx.resizeDelay||10;b.jqx.ready=function(){b(window).trigger("jqxReady")};b.jqx.init=function(){b.each(arguments[0],function(c,d){if(c=="theme"){b.jqx.theme=d}if(c=="scrollBarSize"){b.jqx.utilities.scrollBarSize=d}if(c=="touchScrollBarSize"){b.jqx.utilities.touchScrollBarSize=d}if(c=="scrollBarButtonsVisibility"){b.jqx.utilities.scrollBarButtonsVisibility=d}})};b.jqx.utilities=b.jqx.utilities||{};b.extend(b.jqx.utilities,{scrollBarSize:13,touchScrollBarSize:8,scrollBarButtonsVisibility:"visible",createId:function(){var c=function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)};return"jqxWidget"+c()+c()+c()},setTheme:function(g,h,f){if(typeof f==="undefined"){return}if(!f[0].className.split){return}if(g===undefined){g=""}if(h===undefined){h=""}var j=f[0].className.split(" "),c=[],k=[],e=f.children();for(var d=0;d<j.length;d+=1){if(j[d].indexOf(g)>=0){if(g.length>0){c.push(j[d]);k.push(j[d].replace(g,h))}else{k.push(j[d].replace("-"+h,"")+"-"+h)}}}this._removeOldClasses(c,f);this._addNewClasses(k,f);for(var d=0;d<e.length;d+=1){this.setTheme(g,h,b(e[d]))}},_removeOldClasses:function(e,d){for(var c=0;c<e.length;c+=1){d.removeClass(e[c])}},_addNewClasses:function(e,d){for(var c=0;c<e.length;c+=1){d.addClass(e[c])}},getOffset:function(c){var e=b.jqx.mobile.getLeftPos(c[0]);var d=b.jqx.mobile.getTopPos(c[0]);return{top:d,left:e}},resize:function(h,t,q,p){if(p===undefined){p=true}var m=-1;var l=this;var e=function(v){if(!l.hiddenWidgets){return -1}var w=-1;for(var u=0;u<l.hiddenWidgets.length;u++){if(v.id){if(l.hiddenWidgets[u].id==v.id){w=u;break}}else{if(l.hiddenWidgets[u].id==v[0].id){w=u;break}}}return w};if(this.resizeHandlers){for(var j=0;j<this.resizeHandlers.length;j++){if(h.id){if(this.resizeHandlers[j].id==h.id){m=j;break}}else{if(this.resizeHandlers[j].id==h[0].id){m=j;break}}}if(q===true){if(m!=-1){this.resizeHandlers.splice(m,1);if(this.watchedElementData&&this.watchedElementData.length>0){this.watchedElementData.splice(m,1)}}if(this.resizeHandlers.length==0){var o=b(window);if(o.off){o.off("resize.jqx");o.off("orientationchange.jqx");o.off("orientationchanged.jqx")}else{o.unbind("resize.jqx");o.unbind("orientationchange.jqx");o.unbind("orientationchanged.jqx")}this.resizeHandlers=null}var c=e(h);if(c!=-1&&this.hiddenWidgets){this.hiddenWidgets.splice(c,1)}return}}else{if(q===true){var c=e(h);if(c!=-1&&this.hiddenWidgets){this.hiddenWidgets.splice(c,1)}return}}var l=this;var n=function(w,F){if(!l.resizeHandlers){return}var G=function(K){var J=-1;var L=K.parentNode;while(L){J++;L=L.parentNode}return J};var v=function(M,K){if(!M.widget||!K.widget){return 0}var L=G(M.widget[0]);var J=G(K.widget[0]);try{if(L<J){return -1}if(L>J){return 1}}catch(N){var O=N}return 0};var x=function(K){if(l.hiddenWidgets.length>0){l.hiddenWidgets.sort(v);var J=function(){var M=false;var O=new Array();for(var N=0;N<l.hiddenWidgets.length;N++){var L=l.hiddenWidgets[N];if(b.jqx.isHidden(L.widget)){M=true;O.push(L)}else{if(L.callback){L.callback(F)}}}l.hiddenWidgets=O;if(!M){clearInterval(l.__resizeInterval)}};if(K==false){J();if(l.__resizeInterval){clearInterval(l.__resizeInterval)}return}if(l.__resizeInterval){clearInterval(l.__resizeInterval)}l.__resizeInterval=setInterval(function(){J()},100)}};if(l.hiddenWidgets&&l.hiddenWidgets.length>0){x(false)}l.hiddenWidgets=new Array();l.resizeHandlers.sort(v);for(var C=0;C<l.resizeHandlers.length;C++){var I=l.resizeHandlers[C];var E=I.widget;var B=I.data;if(!B){continue}if(!B.jqxWidget){continue}var u=B.jqxWidget.width;var H=B.jqxWidget.height;if(B.jqxWidget.base){if(u==undefined){u=B.jqxWidget.base.width}if(H==undefined){H=B.jqxWidget.base.height}}if(u===undefined&&H===undefined){u=B.jqxWidget.element.style.width;H=B.jqxWidget.element.style.height}var D=false;if(u!=null&&u.toString().indexOf("%")!=-1){D=true}if(H!=null&&H.toString().indexOf("%")!=-1){D=true}if(b.jqx.isHidden(E)){if(e(E)===-1){if(D||w===true){if(I.data.nestedWidget!==true){l.hiddenWidgets.push(I)}}}}else{if(w===undefined||w!==true){if(D){I.callback(F);if(l.watchedElementData){for(var z=0;z<l.watchedElementData.length;z++){if(l.watchedElementData[z].element==B.jqxWidget.element){l.watchedElementData[z].offsetWidth=B.jqxWidget.element.offsetWidth;l.watchedElementData[z].offsetHeight=B.jqxWidget.element.offsetHeight;break}}}if(l.hiddenWidgets.indexOf(I)>=0){l.hiddenWidgets.splice(l.hiddenWidgets.indexOf(I),1)}}if(B.jqxWidget.element){var y=B.jqxWidget.element.className;if(y.indexOf("dropdownlist")>=0||y.indexOf("datetimeinput")>=0||y.indexOf("combobox")>=0||y.indexOf("menu")>=0){if(B.jqxWidget.isOpened){var A=B.jqxWidget.isOpened();if(A){if(F&&F=="resize"&&b.jqx.mobile.isTouchDevice()){continue}B.jqxWidget.close()}}}}}}}x()};if(!this.resizeHandlers){this.resizeHandlers=new Array();var o=b(window);if(o.on){this._resizeTimer=null;this._initResize=null;o.on("resize.jqx",function(u){if(l._resizeTimer!=undefined){clearTimeout(l._resizeTimer)}if(!l._initResize){l._initResize=true;n(null,"resize")}else{l._resizeTimer=setTimeout(function(){n(null,"resize")},b.jqx.resizeDelay)}});o.on("orientationchange.jqx",function(u){n(null,"orientationchange")});o.on("orientationchanged.jqx",function(u){n(null,"orientationchange")})}else{o.bind("resize.jqx",function(u){n(null,"orientationchange")});o.bind("orientationchange.jqx",function(u){n(null,"orientationchange")});o.bind("orientationchanged.jqx",function(u){n(null,"orientationchange")})}}var f=h.data();if(p){if(m===-1){this.resizeHandlers.push({id:h[0].id,widget:h,callback:t,data:f})}}try{var d=f.jqxWidget.width;var s=f.jqxWidget.height;if(f.jqxWidget.base){if(d==undefined){d=f.jqxWidget.base.width}if(s==undefined){s=f.jqxWidget.base.height}}if(d===undefined&&s===undefined){d=f.jqxWidget.element.style.width;s=f.jqxWidget.element.style.height}var k=false;if(d!=null&&d.toString().indexOf("%")!=-1){k=true}if(s!=null&&s.toString().indexOf("%")!=-1){k=true}if(k){if(!this.watchedElementData){this.watchedElementData=[]}var l=this;var g=function(u){if(l.watchedElementData.forEach){l.watchedElementData.forEach(function(v){if(v.element.offsetWidth!==v.offsetWidth||v.element.offsetHeight!==v.offsetHeight){v.offsetWidth=v.element.offsetWidth;v.offsetHeight=v.element.offsetHeight;if(v.timer){clearTimeout(v.timer)}v.timer=setTimeout(function(){if(!b.jqx.isHidden(b(v.element))){v.callback()}else{v.timer=setInterval(function(){if(!b.jqx.isHidden(b(v.element))){clearInterval(v.timer);v.callback()}},100)}})}})}};l.watchedElementData.push({element:h[0],offsetWidth:h[0].offsetWidth,offsetHeight:h[0].offsetHeight,callback:t});if(!l.observer){l.observer=new MutationObserver(g);l.observer.observe(document.body,{attributes:true,childList:true,characterData:true})}}}catch(r){}if(b.jqx.isHidden(h)&&p===true){n(true)}b.jqx.resize=function(){n(null,"resize")}},parseJSON:function(e){if(!e||typeof e!=="string"){return null}var c=/^[\],:{}\s]*$/,g=/(?:^|:|,)(?:\s*\[)+/g,d=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,f=/"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;e=b.trim(e);if(window.JSON&&window.JSON.parse){return window.JSON.parse(e)}if(c.test(e.replace(d,"@").replace(f,"]").replace(g,""))){return(new Function("return "+e))()}throw new Error("Invalid JSON: "+e)},html:function(d,e){if(!b(d).on){return b(d).html(e)}try{return b.access(d,function(s){var f=d[0]||{},m=0,j=d.length;if(s===undefined){return f.nodeType===1?f.innerHTML.replace(rinlinejQuery,""):undefined}var r=/<(?:script|style|link)/i,n="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",h=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,p=/<([\w:]+)/,g=/<(?:script|object|embed|option|style)/i,k=new RegExp("<(?:"+n+")[\\s/>]","i"),q=/^\s+/,t={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]};if(typeof s==="string"&&!r.test(s)&&(b.support.htmlSerialize||!k.test(s))&&(b.support.leadingWhitespace||!q.test(s))&&!t[(p.exec(s)||["",""])[1].toLowerCase()]){s=s.replace(h,"<$1></$2>");try{for(;m<j;m++){f=this[m]||{};if(f.nodeType===1){b.cleanData(f.getElementsByTagName("*"));f.innerHTML=s}}f=0}catch(o){}}if(f){d.empty().append(s)}},null,e,arguments.length)}catch(c){return b(d).html(e)}},hasTransform:function(e){var d="";d=e.css("transform");if(d==""||d=="none"){d=e.parents().css("transform");if(d==""||d=="none"){var c=b.jqx.utilities.getBrowser();if(c.browser=="msie"){d=e.css("-ms-transform");if(d==""||d=="none"){d=e.parents().css("-ms-transform")}}else{if(c.browser=="chrome"){d=e.css("-webkit-transform");if(d==""||d=="none"){d=e.parents().css("-webkit-transform")}}else{if(c.browser=="opera"){d=e.css("-o-transform");if(d==""||d=="none"){d=e.parents().css("-o-transform")}}else{if(c.browser=="mozilla"){d=e.css("-moz-transform");if(d==""||d=="none"){d=e.parents().css("-moz-transform")}}}}}}else{return d!=""&&d!="none"}}if(d==""||d=="none"){d=b(document.body).css("transform")}return d!=""&&d!="none"&&d!=null},getBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=/(chrome)[ \/]([\w.]+)/.exec(d)||/(webkit)[ \/]([\w.]+)/.exec(d)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(d)||/(msie) ([\w.]+)/.exec(d)||d.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(d)||[];var e={browser:c[1]||"",version:c[2]||"0"};if(d.indexOf("rv:11.0")>=0&&d.indexOf(".net4.0c")>=0){e.browser="msie";e.version="11";c[1]="msie"}if(d.indexOf("edge")>=0){e.browser="msie";e.version="12";c[1]="msie"}e[c[1]]=c[1];return e}});b.jqx.browser=b.jqx.utilities.getBrowser();b.jqx.isHidden=function(d){if(!d||!d[0]){return false}var c=d[0].offsetWidth,e=d[0].offsetHeight;if(c===0||e===0){return true}else{return false}};b.jqx.ariaEnabled=true;b.jqx.aria=function(d,f,e){if(!b.jqx.ariaEnabled){return}if(f==undefined){b.each(d.aria,function(h,j){var l=!d.base?d.host.attr(h):d.base.host.attr(h);if(l!=undefined&&!b.isFunction(l)){var k=l;switch(j.type){case"number":k=new Number(l);if(isNaN(k)){k=l}break;case"boolean":k=l=="true"?true:false;break;case"date":k=new Date(l);if(k=="Invalid Date"||isNaN(k)){k=l}break}d[j.name]=k}else{var l=d[j.name];if(b.isFunction(l)){l=d[j.name]()}if(l==undefined){l=""}try{!d.base?d.host.attr(h,l.toString()):d.base.host.attr(h,l.toString())}catch(g){}}})}else{try{if(d.host){if(!d.base){if(d.host){if(d.element.setAttribute){d.element.setAttribute(f,e.toString())}else{d.host.attr(f,e.toString())}}else{d.attr(f,e.toString())}}else{if(d.base.host){d.base.host.attr(f,e.toString())}else{d.attr(f,e.toString())}}}else{if(d.setAttribute){d.setAttribute(f,e.toString())}}}catch(c){}}};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(d){var c=this.length;var e=Number(arguments[1])||0;e=(e<0)?Math.ceil(e):Math.floor(e);if(e<0){e+=c}for(;e<c;e++){if(e in this&&this[e]===d){return e}}return -1}}b.jqx.mobile=b.jqx.mobile||{};b.jqx.position=function(c){var f=parseInt(c.pageX);var e=parseInt(c.pageY);if(b.jqx.mobile.isTouchDevice()){var d=b.jqx.mobile.getTouches(c);var g=d[0];f=parseInt(g.pageX);e=parseInt(g.pageY)}return{left:f,top:e}};b.extend(b.jqx.mobile,{_touchListener:function(j,g){var c=function(k,m){var l=document.createEvent("MouseEvents");l.initMouseEvent(k,m.bubbles,m.cancelable,m.view,m.detail,m.screenX,m.screenY,m.clientX,m.clientY,m.ctrlKey,m.altKey,m.shiftKey,m.metaKey,m.button,m.relatedTarget);l._pageX=m.pageX;l._pageY=m.pageY;return l};var h={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"};var f=c(h[j.type],j);j.target.dispatchEvent(f);var d=j.target["on"+h[j.type]];if(typeof d==="function"){d(j)}},setMobileSimulator:function(d,f){if(this.isTouchDevice()){return}this.simulatetouches=true;if(f==false){this.simulatetouches=false}var e={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"};var c=this;if(window.addEventListener){var g=function(){for(var h in e){if(d.addEventListener){d.removeEventListener(h,c._touchListener);d.addEventListener(h,c._touchListener,false)}}};if(b.jqx.browser.msie){g()}else{g()}}},isTouchDevice:function(){if(this.touchDevice!=undefined){return this.touchDevice}var d="Browser CodeName: "+navigator.appCodeName+"";d+="Browser Name: "+navigator.appName+"";d+="Browser Version: "+navigator.appVersion+"";d+="Platform: "+navigator.platform+"";d+="User-agent header: "+navigator.userAgent+"";if(d.indexOf("Android")!=-1){return true}if(d.indexOf("IEMobile")!=-1){return true}if(d.indexOf("Windows Phone")!=-1){return true}if(d.indexOf("WPDesktop")!=-1){return true}if(d.indexOf("ZuneWP7")!=-1){return true}if(d.indexOf("BlackBerry")!=-1&&d.indexOf("Mobile Safari")!=-1){return true}if(d.indexOf("ipod")!=-1){return true}if(d.indexOf("nokia")!=-1||d.indexOf("Nokia")!=-1){return true}if(d.indexOf("Chrome/17")!=-1){return false}if(d.indexOf("CrOS")!=-1){return false}if(d.indexOf("Opera")!=-1&&d.indexOf("Mobi")==-1&&d.indexOf("Mini")==-1&&d.indexOf("Platform: Win")!=-1){return false}if(d.indexOf("HybridDeviceTouch")!=-1){return true}if(d.indexOf("HybridDeviceMouse")!=-1){return false}if(d.indexOf("Opera")!=-1&&d.indexOf("Mobi")!=-1&&d.indexOf("Opera Mobi")!=-1){return true}if(d.indexOf("Mozilla/5.0 (X11; Linux x86_64)")!=-1){return false}var f={ios:"i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ",android:"(Android |HTC_|Silk/)",blackberry:"BlackBerry(?:.*)Version/",rimTablet:"RIM Tablet OS ",webos:"(?:webOS|hpwOS)/",bada:"Bada/"};try{if(this.touchDevice!=undefined){return this.touchDevice}this.touchDevice=false;for(i in f){if(f.hasOwnProperty(i)){prefix=f[i];match=d.match(new RegExp("(?:"+prefix+")([^\\s;]+)"));if(match){if(i.toString()=="blackberry"){this.touchDevice=false;return false}this.touchDevice=true;return true}}}var g=navigator.userAgent;if(navigator.platform.toLowerCase().indexOf("win")!=-1){if(g.indexOf("Windows Phone")>=0||g.indexOf("WPDesktop")>=0||g.indexOf("IEMobile")>=0||g.indexOf("ZuneWP7")>=0){this.touchDevice=true;return true}else{if(g.indexOf("Touch")>=0){var c=("MSPointerDown" in window)||("pointerdown" in window);if(c){this.touchDevice=true;return true}if(g.indexOf("ARM")>=0){this.touchDevice=true;return true}this.touchDevice=false;return false}}}if(navigator.platform.toLowerCase().indexOf("win")!=-1){this.touchDevice=false;return false}if(("ontouchstart" in window)||window.DocumentTouch&&document instanceof DocumentTouch){this.touchDevice=true}return this.touchDevice}catch(h){this.touchDevice=false;return false}},getLeftPos:function(c){var d=c.offsetLeft;while((c=c.offsetParent)!=null){if(c.tagName!="HTML"){d+=c.offsetLeft;if(document.all){d+=c.clientLeft}}}return d},getTopPos:function(d){var f=d.offsetTop;var c=b(d).coord();while((d=d.offsetParent)!=null){if(d.tagName!="HTML"){f+=(d.offsetTop-d.scrollTop);if(document.all){f+=d.clientTop}}}var e=navigator.userAgent.toLowerCase();var g=(e.indexOf("windows phone")!=-1||e.indexOf("WPDesktop")!=-1||e.indexOf("ZuneWP7")!=-1||e.indexOf("msie 9")!=-1||e.indexOf("msie 11")!=-1||e.indexOf("msie 10")!=-1)&&e.indexOf("touch")!=-1;if(g){return c.top}if(this.isSafariMobileBrowser()){if(this.isSafari4MobileBrowser()&&this.isIPadSafariMobileBrowser()){return f}if(e.indexOf("version/7")!=-1){return c.top}if(e.indexOf("version/6")!=-1||e.indexOf("version/5")!=-1){f=f+b(window).scrollTop()}if(/(Android.*Chrome\/[.0-9]* (!?Mobile))/.exec(navigator.userAgent)){return f+b(window).scrollTop()}if(/(Android.*Chrome\/[.0-9]* Mobile)/.exec(navigator.userAgent)){return f+b(window).scrollTop()}return c.top}return f},isChromeMobileBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("android")!=-1;return c},isOperaMiniMobileBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("opera mini")!=-1||d.indexOf("opera mobi")!=-1;return c},isOperaMiniBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("opera mini")!=-1;return c},isNewSafariMobileBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("ipad")!=-1||d.indexOf("iphone")!=-1||d.indexOf("ipod")!=-1;c=c&&(d.indexOf("version/5")!=-1);return c},isSafari4MobileBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("ipad")!=-1||d.indexOf("iphone")!=-1||d.indexOf("ipod")!=-1;c=c&&(d.indexOf("version/4")!=-1);return c},isWindowsPhone:function(){var d=navigator.userAgent.toLowerCase();var c=(d.indexOf("windows phone")!=-1||d.indexOf("WPDesktop")!=-1||d.indexOf("ZuneWP7")!=-1||d.indexOf("msie 9")!=-1||d.indexOf("msie 11")!=-1||d.indexOf("msie 10")!=-1&&d.indexOf("touch")!=-1);return c},isSafariMobileBrowser:function(){var d=navigator.userAgent.toLowerCase();if(/(Android.*Chrome\/[.0-9]* (!?Mobile))/.exec(navigator.userAgent)){return true}if(/(Android.*Chrome\/[.0-9]* Mobile)/.exec(navigator.userAgent)){return true}var c=d.indexOf("ipad")!=-1||d.indexOf("iphone")!=-1||d.indexOf("ipod")!=-1||d.indexOf("mobile safari")!=-1;return c},isIPadSafariMobileBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("ipad")!=-1;return c},isMobileBrowser:function(){var d=navigator.userAgent.toLowerCase();var c=d.indexOf("ipad")!=-1||d.indexOf("iphone")!=-1||d.indexOf("android")!=-1;return c},getTouches:function(c){if(c.originalEvent){if(c.originalEvent.touches&&c.originalEvent.touches.length){return c.originalEvent.touches}else{if(c.originalEvent.changedTouches&&c.originalEvent.changedTouches.length){return c.originalEvent.changedTouches}}}if(!c.touches){c.touches=new Array();c.touches[0]=c.originalEvent!=undefined?c.originalEvent:c;if(c.originalEvent!=undefined&&c.pageX){c.touches[0]=c}if(c.type=="mousemove"){c.touches[0]=c}}return c.touches},getTouchEventName:function(c){if(this.isWindowsPhone()){var d=navigator.userAgent.toLowerCase();if(d.indexOf("windows phone 7")!=-1){if(c.toLowerCase().indexOf("start")!=-1){return"MSPointerDown"}if(c.toLowerCase().indexOf("move")!=-1){return"MSPointerMove"}if(c.toLowerCase().indexOf("end")!=-1){return"MSPointerUp"}}if(c.toLowerCase().indexOf("start")!=-1){return"pointerdown"}if(c.toLowerCase().indexOf("move")!=-1){return"pointermove"}if(c.toLowerCase().indexOf("end")!=-1){return"pointerup"}}else{return c}},dispatchMouseEvent:function(c,g,f){if(this.simulatetouches){return}var d=document.createEvent("MouseEvent");d.initMouseEvent(c,true,true,g.view,1,g.screenX,g.screenY,g.clientX,g.clientY,false,false,false,false,0,null);if(f!=null){f.dispatchEvent(d)}},getRootNode:function(c){while(c.nodeType!==1){c=c.parentNode}return c},setTouchScroll:function(c,d){if(!this.enableScrolling){this.enableScrolling=[]}this.enableScrolling[d]=c},touchScroll:function(B,M,W,H,x,n){if(B==null){return}var G=this;var f=0;var r=0;var g=0;var h=0;var t=0;var j=0;if(!this.scrolling){this.scrolling=[]}this.scrolling[H]=false;var k=false;var p=b(B);var Q=["select","input","textarea"];var U=0;var J=0;if(!this.enableScrolling){this.enableScrolling=[]}this.enableScrolling[H]=true;var H=H;var u=this.getTouchEventName("touchstart")+".touchScroll";var D=this.getTouchEventName("touchend")+".touchScroll";var Y=this.getTouchEventName("touchmove")+".touchScroll";var l,T,z,V,ae,P,X,d,F,aa,ac,e,w,v,R,c,E,ad,o;P=M;ae=0;X=0;xoffset=0;initialOffset=0;initialXOffset=0;V=x.jqxScrollBar("max");o=325;function A(ah){if(ah.targetTouches&&(ah.targetTouches.length>=1)){return ah.targetTouches[0].clientY}else{if(ah.originalEvent&&ah.originalEvent.clientY!==undefined){return ah.originalEvent.clientY}else{var ag=G.getTouches(ah);return ag[0].clientY}}}function ab(ah){if(ah.targetTouches&&(ah.targetTouches.length>=1)){return ah.targetTouches[0].clientX}else{if(ah.originalEvent&&ah.originalEvent.clientX!==undefined){return ah.originalEvent.clientX}else{var ag=G.getTouches(ah);return ag[0].clientX}}}var I=function(){var ai,ag,aj,ah;ai=Date.now();ag=ai-w;w=ai;aj=X-e;xdelta=xoffset-xframe;e=X;xframe=xoffset;F=true;ah=1000*aj/(1+ag);xv=1000*xdelta/(1+ag);ac=0.8*ah+0.2*ac;xjqxAnimations=0.8*xv+0.2*xjqxAnimations};var C=false;var U=function(ah){if(!G.enableScrolling[H]){return true}if(b.inArray(ah.target.tagName.toLowerCase(),Q)!==-1){return}X=n.jqxScrollBar("value");xoffset=x.jqxScrollBar("value");var ai=G.getTouches(ah);var aj=ai[0];if(ai.length==1){G.dispatchMouseEvent("mousedown",aj,G.getRootNode(aj.target))}V=x.jqxScrollBar("max");P=n.jqxScrollBar("max");function ag(ak){C=false;F=true;d=A(ak);ad=ab(ak);ac=R=xjqxAnimations=0;e=X;xframe=xoffset;w=Date.now();clearInterval(v);v=setInterval(I,100);initialOffset=X;initialXOffset=xoffset;if(X>0&&X<P&&n[0].style.visibility!="hidden"){}}ag(ah);k=false;r=aj.pageY;t=aj.pageX;if(G.simulatetouches){if(aj._pageY!=undefined){r=aj._pageY;t=aj._pageX}}G.scrolling[H]=true;f=0;h=0;return true};if(p.on){p.on(u,U)}else{p.bind(u,U)}var Z=function(ah,ag){X=(ah>P)?P:(ah<ae)?ae:ah;W(null,ah,0,0,ag);return(ah>P)?"max":(ah<ae)?"min":"value"};var m=function(ah,ag){xoffset=(ah>V)?V:(ah<ae)?ae:ah;W(ah,null,0,0,ag);return(ah>V)?"max":(ah<ae)?"min":"value"};function S(){var ag,ah;if(R){ag=Date.now()-w;ah=-R*Math.exp(-ag/o);if(ah>0.5||ah<-0.5){Z(c+ah);requestAnimationFrame(S)}else{Z(c)}}}function N(){var ag,ah;if(R){ag=Date.now()-w;ah=-R*Math.exp(-ag/o);if(ah>0.5||ah<-0.5){m(E+ah);requestAnimationFrame(N)}else{m(E)}}}var y=function(ag){if(!G.enableScrolling[H]){return true}if(!G.scrolling[H]){return true}if(C){ag.preventDefault();ag.stopPropagation()}var al=G.getTouches(ag);if(al.length>1){return true}var ah=al[0].pageY;var aj=al[0].pageX;if(G.simulatetouches){if(al[0]._pageY!=undefined){ah=al[0]._pageY;aj=al[0]._pageX}}var an=ah-r;var ao=aj-t;J=ah;touchHorizontalEnd=aj;g=an-f;j=ao-h;k=true;f=an;h=ao;var ai=x!=null?x[0].style.visibility!="hidden":true;var am=n!=null?n[0].style.visibility!="hidden":true;function ak(ar){var au,at,aq;if(F){au=A(ar);aq=ab(ar);at=d-au;xdelta=ad-aq;var ap="value";if(at>2||at<-2){d=au;ap=Z(X+at,ar);I();if(ap=="min"&&initialOffset===0){return true}if(ap=="max"&&initialOffset===P){return true}if(!am){return true}ar.preventDefault();ar.stopPropagation();C=true;return false}else{if(xdelta>2||xdelta<-2){ad=aq;ap=m(xoffset+xdelta,ar);I();if(ap=="min"&&initialXOffset===0){return true}if(ap=="max"&&initialXOffset===V){return true}if(!ai){return true}C=true;ar.preventDefault();ar.stopPropagation();return false}}ar.preventDefault()}}if(ai||am){if((ai)||(am)){ak(ag)}}};if(p.on){p.on(Y,y)}else{p.bind(Y,y)}var s=function(ah){if(!G.enableScrolling[H]){return true}var ai=G.getTouches(ah)[0];if(!G.scrolling[H]){return true}F=false;clearInterval(v);if(ac>10||ac<-10){R=0.8*ac;c=Math.round(X+R);w=Date.now();requestAnimationFrame(S)}else{if(xjqxAnimations>10||xjqxAnimations<-10){R=0.8*xjqxAnimations;E=Math.round(xoffset+R);w=Date.now();requestAnimationFrame(N)}else{}}G.scrolling[H]=false;if(k){G.dispatchMouseEvent("mouseup",ai,ah.target)}else{var ai=G.getTouches(ah)[0],ag=G.getRootNode(ai.target);G.dispatchMouseEvent("mouseup",ai,ag);G.dispatchMouseEvent("click",ai,ag);return true}};if(this.simulatetouches){var q=b(window).on!=undefined||b(window).bind;var O=function(ag){try{s(ag)}catch(ah){}G.scrolling[H]=false};b(window).on!=undefined?b(document).on("mouseup.touchScroll",O):b(document).bind("mouseup.touchScroll",O);if(window.frameElement){if(window.top!=null){var L=function(ag){try{s(ag)}catch(ah){}G.scrolling[H]=false};if(window.top.document){b(window.top.document).on?b(window.top.document).on("mouseup",L):b(window.top.document).bind("mouseup",L)}}}var af=b(document).on!=undefined||b(document).bind;var K=function(ag){if(!G.scrolling[H]){return true}G.scrolling[H]=false;var ai=G.getTouches(ag)[0],ah=G.getRootNode(ai.target);G.dispatchMouseEvent("mouseup",ai,ah);G.dispatchMouseEvent("click",ai,ah)};b(document).on!=undefined?b(document).on("touchend",K):b(document).bind("touchend",K)}if(p.on){p.on("dragstart",function(ag){ag.preventDefault()});p.on("selectstart",function(ag){ag.preventDefault()})}p.on?p.on(D+" touchcancel.touchScroll",s):p.bind(D+" touchcancel.touchScroll",s)}});b.jqx.cookie=b.jqx.cookie||{};b.extend(b.jqx.cookie,{cookie:function(f,g,d){if(arguments.length>1&&String(g)!=="[object Object]"){d=b.extend({},d);if(g===null||g===undefined){d.expires=-1}if(typeof d.expires==="number"){var j=d.expires,e=d.expires=new Date();e.setDate(e.getDate()+j)}g=String(g);return(document.cookie=[encodeURIComponent(f),"=",d.raw?g:encodeURIComponent(g),d.expires?"; expires="+d.expires.toUTCString():"",d.path?"; path="+d.path:"",d.domain?"; domain="+d.domain:"",d.secure?"; secure":""].join(""))}d=g||{};var c,h=d.raw?function(k){return k}:decodeURIComponent;return(c=new RegExp("(?:^|; )"+encodeURIComponent(f)+"=([^;]*)").exec(document.cookie))?h(c[1]):null}});b.jqx.string=b.jqx.string||{};b.extend(b.jqx.string,{replace:function(g,e,f){if(e===f){return this}var c=g;var d=c.indexOf(e);while(d!=-1){c=c.replace(e,f);d=c.indexOf(e)}return c},contains:function(c,d){if(c==null||d==null){return false}return c.indexOf(d)!=-1},containsIgnoreCase:function(c,d){if(c==null||d==null){return false}return c.toString().toUpperCase().indexOf(d.toString().toUpperCase())!=-1},equals:function(c,d){if(c==null||d==null){return false}c=this.normalize(c);if(d.length==c.length){return c.slice(0,d.length)==d}return false},equalsIgnoreCase:function(c,d){if(c==null||d==null){return false}c=this.normalize(c);if(d.length==c.length){return c.toUpperCase().slice(0,d.length)==d.toUpperCase()}return false},startsWith:function(c,d){if(c==null||d==null){return false}return c.slice(0,d.length)==d},startsWithIgnoreCase:function(c,d){if(c==null||d==null){return false}return c.toUpperCase().slice(0,d.length)==d.toUpperCase()},normalize:function(c){if(c.charCodeAt(c.length-1)==65279){c=c.substring(0,c.length-1)}return c},endsWith:function(c,d){if(c==null||d==null){return false}c=this.normalize(c);return c.slice(-d.length)==d},endsWithIgnoreCase:function(c,d){if(c==null||d==null){return false}c=this.normalize(c);return c.toUpperCase().slice(-d.length)==d.toUpperCase()}});b.extend(b.easing,{easeOutBack:function(f,g,e,k,j,h){if(h==undefined){h=1.70158}return k*((g=g/j-1)*g*((h+1)*g+h)+1)+e},easeInQuad:function(f,g,e,j,h){return j*(g/=h)*g+e},easeInOutCirc:function(f,g,e,j,h){if((g/=h/2)<1){return -j/2*(Math.sqrt(1-g*g)-1)+e}return j/2*(Math.sqrt(1-(g-=2)*g)+1)+e},easeInOutSine:function(f,g,e,j,h){return -j/2*(Math.cos(Math.PI*g/h)-1)+e},easeInCubic:function(f,g,e,j,h){return j*(g/=h)*g*g+e},easeOutCubic:function(f,g,e,j,h){return j*((g=g/h-1)*g*g+1)+e},easeInOutCubic:function(f,g,e,j,h){if((g/=h/2)<1){return j/2*g*g*g+e}return j/2*((g-=2)*g*g+2)+e},easeInSine:function(f,g,e,j,h){return -j*Math.cos(g/h*(Math.PI/2))+j+e},easeOutSine:function(f,g,e,j,h){return j*Math.sin(g/h*(Math.PI/2))+e},easeInOutSine:function(f,g,e,j,h){return -j/2*(Math.cos(Math.PI*g/h)-1)+e}})})(jqxBaseFramework);(function(b){if(b.event&&b.event.special){b.extend(b.event.special,{close:{noBubble:true},open:{noBubble:true},cellclick:{noBubble:true},rowclick:{noBubble:true},tabclick:{noBubble:true},selected:{noBubble:true},expanded:{noBubble:true},collapsed:{noBubble:true},valuechanged:{noBubble:true},expandedItem:{noBubble:true},collapsedItem:{noBubble:true},expandingItem:{noBubble:true},collapsingItem:{noBubble:true}})}if(b.fn.extend){b.fn.extend({ischildof:function(g){if(!b(this).parents){var c=g.element.contains(this.element);return c}var e=b(this).parents().get();for(var d=0;d<e.length;d++){if(typeof g!="string"){var f=e[d];if(g!==undefined){if(f==g[0]){return true}}}else{if(g!==undefined){if(b(e[d]).is(g)){return true}}}}return false}})}b.fn.jqxProxy=function(){var e=b(this).data().jqxWidget;var c=Array.prototype.slice.call(arguments,0);var d=e.element;if(!d){d=e.base.element}return b.jqx.jqxWidgetProxy(e.widgetName,d,c)};var a=this.originalVal=b.fn.val;b.fn.val=function(d){if(typeof d=="undefined"){if(b(this).hasClass("jqx-widget")){var c=b(this).data().jqxWidget;if(c&&c.val){return c.val()}}if(this[0]&&this[0].tagName.toLowerCase().indexOf("angular")>=0){var c=b(this).find(".jqx-widget").data().jqxWidget;if(c&&c.val){return c.val()}}return a.call(this)}else{if(b(this).hasClass("jqx-widget")){var c=b(this).data().jqxWidget;if(c&&c.val){if(arguments.length!=2){return c.val(d)}else{return c.val(d,arguments[1])}}}if(this[0]&&this[0].tagName.toLowerCase().indexOf("angular")>=0){var c=b(this).find(".jqx-widget").data().jqxWidget;if(c&&c.val){if(arguments.length!=2){return c.val(d)}else{return c.val(d,arguments[1])}}}return a.call(this,d)}};if(b.fn.modal&&b.fn.modal.Constructor){b.fn.modal.Constructor.prototype.enforceFocus=function(){b(document).off("focusin.bs.modal").on("focusin.bs.modal",b.proxy(function(c){if(this.$element[0]!==c.target&&!this.$element.has(c.target).length){if(b(c.target).parents().hasClass("jqx-popup")){return true}this.$element.trigger("focus")}},this))}}b.fn.coord=function(o){var e,k,j={top:0,left:0},f=this[0],m=f&&f.ownerDocument;if(!m){return}e=m.documentElement;if(!b.contains(e,f)){return j}if(typeof f.getBoundingClientRect!==undefined){j=f.getBoundingClientRect()}var d=function(p){return b.isWindow(p)?p:p.nodeType===9?p.defaultView||p.parentWindow:false};k=d(m);var h=0;var c=0;var g=navigator.userAgent.toLowerCase();var n=g.indexOf("ipad")!=-1||g.indexOf("iphone")!=-1;if(n){h=2}if(true==o){if(document.body.style.position!="static"&&document.body.style.position!=""){var l=b(document.body).coord();h=-l.left;c=-l.top}}return{top:c+j.top+(k.pageYOffset||e.scrollTop)-(e.clientTop||0),left:h+j.left+(k.pageXOffset||e.scrollLeft)-(e.clientLeft||0)}};b.jqx.ripplers=[];b.jqx.ripple=function(f,e,o){if(!e){e=f}var h=b(f);var j=false;h.append("<span class='ink'></span>");var p=h.find(".ink");var c=false;for(var g=0;g<b.jqx.ripplers.length;g++){var k=b.jqx.ripplers[g];if(k.element[0]===f[0]){c=true;break}}if(!c){b.jqx.ripplers.push({ink:p,element:f,hostElement:e,hostElementType:o})}if(o==="checkbox"||o==="radiobutton"){var l=Math.max(h.outerWidth(),h.outerHeight());p.css({height:l,width:l});var n=h.width()/2-p.width()/2;var m=h.height()/2-p.height()/2;p.css({top:m+"px",left:n+"px"})}if(b.jqx.ripplers.length===1){b(document).on("mouseup",function(r){b.jqx.ripple.mouseCaptured=false;for(var q=0;q<b.jqx.ripplers.length;q++){var d=b.jqx.ripplers[q];d.ink.removeClass("active");d.element.removeClass("active");if(o!=="checkbox"&&o!=="radiobutton"){if(d.ink.hasClass("animate")){d.ink.removeClass("animate")}}}})}e.off("mousedown.ripple");e.on("mousedown.ripple",function(q){var d=b(f);b.jqx.ripple.mouseCaptured=true;setTimeout(function(){if(d.find(".ink").length==0){d.append("<span class='ink'></span>")}var s=d.find(".ink");s.removeClass("animate");if(!s.height()&&!s.width()){var t=Math.max(d.outerWidth(),d.outerHeight());s.css({height:t,width:t})}if(o==="checkbox"||o==="radiobutton"){if(o==="checkbox"){if(e.jqxCheckBox("disabled")){return}}if(o==="radiobutton"){if(e.jqxRadioButton("disabled")){return}}var r=d.width()/2-s.width()/2;var u=d.height()/2-s.height()/2;s.css({top:u+"px",left:r+"px"}).addClass("animate");s.on("animationend",function(){if(b.jqx.ripple.mouseCaptured){s.removeClass("animate");s.addClass("active");f.addClass("active")}});return}var r=q.pageX-d.offset().left-s.width()/2;var u=q.pageY-d.offset().top-s.height()/2;s.css({top:u+"px",left:r+"px"}).addClass("animate")})})}})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.jqxWidget("jqxMenu","",{});a.extend(a.jqx._jqxMenu.prototype,{defineInstance:function(){var b={items:new Array(),mode:"horizontal",width:null,height:null,minimizeWidth:"auto",easing:"easeInOutSine",animationShowDuration:200,animationHideDuration:200,autoCloseInterval:0,animationHideDelay:100,animationShowDelay:10,menuElements:new Array(),autoSizeMainItems:false,autoCloseOnClick:true,autoCloseOnMouseLeave:true,enableRoundedCorners:true,disabled:false,autoOpenPopup:true,enableHover:true,autoOpen:true,autoGenerate:true,clickToOpen:false,showTopLevelArrows:false,touchMode:"auto",source:null,popupZIndex:1000,rtl:false,keyboardNavigation:false,lockFocus:false,title:"",events:["shown","closed","itemclick","initialized","open","close"]};if(this===a.jqx._jqxMenu.prototype){return b}a.extend(true,this,b);return b},createInstance:function(c){var b=this;this.host.attr("role","menubar");a.jqx.utilities.resize(this.host,function(){b.refresh()},false,this.mode!="popup");if(this.minimizeWidth!="auto"&&this.minimizeWidth!=null&&this.width&&this.width.toString().indexOf("%")==-1){a(window).resize(function(){b.refresh()})}this.host.css("outline","none");if(this.source){if(this.source!=null){var d=this.loadItems(this.source);this.element.innerHTML=d}}this._tmpHTML=this.element.innerHTML;if(this.element.innerHTML.indexOf("UL")){var e=this.host.find("ul:first");if(e.length>0){this._createMenu(e[0])}}this.host.data("autoclose",{});this._render();this._setSize();if(a.jqx.browser.msie&&a.jqx.browser.version<8){this.host.attr("hideFocus",true)}},focus:function(){try{if(this.mode==="popup"&&this.keyboardNavigation){var d=this.host.closest("div.jqx-menu-wrapper");d.focus()}if(this.keyboardNavigation){this.host.focus();var c=this;var e=function(){if(!a.jqx.isHidden(a(c.items[0].element))){a(c.items[0].element).addClass(c.toThemeProperty("jqx-fill-state-focus"));c.activeItem=c.items[0]}else{var f=c._nextVisibleItem(c.items[0],0);if(f){a(f.element).addClass(c.toThemeProperty("jqx-fill-state-focus"));c.activeItem=f}}};if(!this.activeItem){e()}else{if(!a.jqx.isHidden(a(this.activeItem.element))){a(this.activeItem.element).addClass(this.toThemeProperty("jqx-fill-state-focus"))}else{a(this.activeItem.element).removeClass(this.toThemeProperty("jqx-fill-state-focus"));e()}}}}catch(b){}},loadItems:function(c,e){if(c==null){return}if(c.length==0){return""}var b=this;this.items=new Array();var d='<ul class="jqx-menu-ul">';if(e){d='<ul class="jqx-menu-ul" style="width:'+e+';">'}a.map(c,function(f){if(f==undefined){return null}d+=b._parseItem(f)});d+="</ul>";return d},_parseItem:function(f){var c="";if(f==undefined){return null}var b=f.label;if(!f.label&&f.html){b=f.html}if(!b){b="Item"}if(typeof f==="string"){b=f}var e=false;if(f.selected!=undefined&&f.selected){e=true}var d=false;if(f.disabled!=undefined&&f.disabled){d=true}c+="<li";if(d){c+=' item-disabled="true" '}if(f.label&&!f.html){c+=' item-label="'+b+'" '}if(f.value!=null){c+=' item-value="'+f.value+'" '}if(f.id!=undefined){c+=' id="'+f.id+'" '}c+=">"+b;if(f.items){if(f.subMenuWidth){c+=this.loadItems(f.items,f.subMenuWidth)}else{c+=this.loadItems(f.items)}}c+="</li>";return c},_setSize:function(){if(this.width!=null&&this.width.toString().indexOf("%")!=-1){this.host.width(this.width)}else{if(this.width!=null&&this.width.toString().indexOf("px")!=-1){this.host.width(this.width)}else{if(this.width!=undefined&&!isNaN(this.width)){this.host.width(this.width)}}}if(this.height!=null&&this.height.toString().indexOf("%")!=-1){this.host.height(this.height)}else{if(this.height!=null&&this.height.toString().indexOf("px")!=-1){this.host.height(this.height)}else{if(this.height!=undefined&&!isNaN(this.height)){this.host.height(this.height)}}}if(this.height===null){this.host.height("auto")}var g=this;if(this.minimizeWidth!=null&&this.mode!="popup"){var f=a(window).width();if(!a.jqx.response){var e=false;if(navigator.userAgent.match(/Windows|Linux|MacOS/)){var b=navigator.userAgent.indexOf("Windows Phone")>=0||navigator.userAgent.indexOf("WPDesktop")>=0||navigator.userAgent.indexOf("IEMobile")>=0||navigator.userAgent.indexOf("ZuneWP7")>=0;if(!b){e=true}}var c=this.minimizeWidth;if(e&&this.minimizeWidth=="auto"){return}}if(this.minimizeWidth=="auto"&&a.jqx.response){var d=new a.jqx.response();if(d.device.type=="Phone"||d.device.type=="Tablet"){if(!this.minimized){this.minimize()}}}else{if((f<c)&&!this.minimized){this.minimize()}else{if(this.minimized&&f>=c){this.restore()}}}}},minimize:function(){if(this.minimized){return}var e=this;this.host.addClass(this.toThemeProperty("jqx-menu-minimized"));this.minimized=true;this._tmpMode=this.mode;this.mode="simple";var h=this.host.closest("div.jqx-menu-wrapper");h.remove();a("#menuWrapper"+this.element.id).remove();a.each(this.items,function(){var k=this;var j=a(k.element);var i=a(k.subMenuElement);var l=i.closest("div.jqx-menu-popup");l.remove()});if(this.source){var d=this.loadItems(this.source);this.element.innerHTML=d;this._tmpHTML=this.element.innerHTML}this.element.innerHTML=this._tmpHTML;if(this.element.innerHTML.indexOf("UL")){var g=this.host.find("ul:first");if(g.length>0){this._createMenu(g[0])}}this._render();var c=this.host.find("ul:first");c.wrap('<div class="jqx-menu-wrapper" style="z-index:'+this.popupZIndex+'; padding: 0px; display: none; margin: 0px; height: auto; width: auto; position: absolute; top: 0; left: 0; display: block; visibility: visible;"></div>');var h=c.closest("div.jqx-menu-wrapper");h[0].id="menuWrapper"+this.element.id;h.detach();h.appendTo(a(document.body));h.addClass(this.toThemeProperty("jqx-widget"));h.addClass(this.toThemeProperty("jqx-menu"));h.addClass(this.toThemeProperty("jqx-menu-minimized"));h.addClass(this.toThemeProperty("jqx-widget-header"));c.children().hide();h.hide();h.find("ul").addClass(this.toThemeProperty("jqx-menu-ul-minimized"));this.minimizedItem=a("<div></div>");this.minimizedItem.addClass(this.toThemeProperty("jqx-item"));this.minimizedItem.addClass(this.toThemeProperty("jqx-menu-item-top"));this.addHandler(h,"keydown",function(i){return e.handleKeyDown(i)});this.minimizedItem.addClass(this.toThemeProperty("jqx-menu-minimized-button"));this.minimizedItem.prependTo(this.host);this.titleElement=a("<div>"+this.title+"</div>");this.titleElement.addClass(this.toThemeProperty("jqx-item"));this.titleElement.addClass(this.toThemeProperty("jqx-menu-title"));this.titleElement.prependTo(this.host);a("<div style='clear:both;'></div>").insertAfter(this.minimizedItem);e.minimizedHidden=true;var b=function(j){e.minimizedHidden=true;e.minimizedItem.show();var i=false;if(e.minimizedItem.css("float")=="right"){i=true}h.animate({left:!i?-h.outerWidth():e.host.coord().left+e.host.width()+h.width(),opacity:0},e.animationHideDuration,function(){h.find("ul:first").children().hide();h.hide()})};var f=function(k){if(e.minimizedHidden){h.find("ul:first").children().show();e.minimizedHidden=false;h.show();h.css("opacity",0);h.css("left",-h.outerWidth());var j=false;var i=h.width();if(e.minimizedItem.css("float")=="right"){h.css("left",e.host.coord().left+e.host.width()+i);j=true}h.css("top",e.host.coord().top+e.host.height());h.animate({left:!j?e.host.coord().left:e.host.coord().left+e.host.width()-i,opacity:0.95},e.animationShowDuration,function(){})}else{b(k)}e._raiseEvent("2",{type:"mouse",item:e.minimizedItem[0],event:k});e._setSize()};this.addHandler(a(window),"orientationchange.jqxmenu"+this.element.id,function(i){setTimeout(function(){if(!e.minimizedHidden){var j=h.width();var k=false;var j=h.width();if(e.minimizedItem.css("float")=="right"){k=true}h.css("top",e.host.coord().top+e.host.height());h.css({left:!k?e.host.coord().left:e.host.coord().left+e.host.width()-j})}},25)});this.addHandler(this.minimizedItem,"click",function(i){f(i)})},restore:function(){if(!this.minimized){return}this.host.find("ul").removeClass(this.toThemeProperty("jqx-menu-ul-minimized"));this.host.removeClass(this.toThemeProperty("jqx-menu-minimized"));this.minimized=false;this.mode=this._tmpMode;if(this.minimizedItem){this.minimizedItem.remove()}var d=a("#menuWrapper"+this.element.id);d.remove();if(this.source){var b=this.loadItems(this.source);this.element.innerHTML=b;this._tmpHTML=b}this.element.innerHTML=this._tmpHTML;if(this.element.innerHTML.indexOf("UL")){var c=this.host.find("ul:first");if(c.length>0){this._createMenu(c[0])}}this._setSize();this._render()},isTouchDevice:function(){if(this._isTouchDevice!=undefined){return this._isTouchDevice}var b=a.jqx.mobile.isTouchDevice();if(this.touchMode==true){b=true}else{if(this.touchMode==false){b=false}}if(b){this.host.addClass(this.toThemeProperty("jqx-touch"));a(".jqx-menu-item").addClass(this.toThemeProperty("jqx-touch"))}this._isTouchDevice=b;return b},refresh:function(b){if(!b){this._setSize()}},resize:function(c,b){this.width=c;this.height=b;this.refresh()},_closeAll:function(f){var d=f!=null?f.data:this;var b=d.items;a.each(b,function(){var e=this;if(e.hasItems==true){if(e.isOpen){d._closeItem(d,e)}}});if(d.mode=="popup"){if(f!=null){var c=d._isRightClick(f);if(!c){d.close()}}}},closeItem:function(e){if(e==null){return false}var b=e;var c=document.getElementById(b);var d=this;a.each(d.items,function(){var f=this;if(f.isOpen==true&&f.element==c){d._closeItem(d,f);if(f.parentId){}}});return true},openItem:function(e){if(e==null){return false}var b=e;var c=document.getElementById(b);var d=this;a.each(d.items,function(){var f=this;if(f.isOpen==false&&f.element==c){d._openItem(d,f);if(f.parentId){d.openItem(f.parentId)}}});return true},_getClosedSubMenuOffset:function(c){var b=a(c.subMenuElement);var f=-b.outerHeight();var e=-b.outerWidth();var d=c.level==0&&this.mode=="horizontal";if(d){e=0}else{f=0}switch(c.openVerticalDirection){case"up":case"center":f=b.outerHeight();break}switch(c.openHorizontalDirection){case this._getDir("left"):if(d){e=0}else{e=b.outerWidth()}break;case"center":if(d){e=0}else{e=b.outerWidth()}break}return{left:e,top:f}},_closeItem:function(l,o,g,c){if(l==null||o==null){return false}var j=a(o.subMenuElement);var b=o.level==0&&this.mode=="horizontal";var f=this._getClosedSubMenuOffset(o);var m=f.top;var e=f.left;var i=a(o.element);var k=j.closest("div.jqx-menu-popup");if(k!=null){var h=l.animationHideDelay;if(c==true){h=0}if(j.data("timer")&&j.data("timer").show!=null){clearTimeout(j.data("timer").show);j.data("timer").show=null}var n=function(){o.isOpen=false;if(b){j.stop().animate({top:m},l.animationHideDuration,function(){a(o.element).removeClass(l.toThemeProperty("jqx-fill-state-pressed"));a(o.element).removeClass(l.toThemeProperty("jqx-menu-item-top-selected"));a(o.element).removeClass(l.toThemeProperty("jqx-rc-b-expanded"));k.removeClass(l.toThemeProperty("jqx-rc-t-expanded"));var p=a(o.arrow);if(p.length>0&&l.showTopLevelArrows){p.removeClass();if(o.openVerticalDirection=="down"){p.addClass(l.toThemeProperty("jqx-menu-item-arrow-down"));p.addClass(l.toThemeProperty("jqx-icon-arrow-down"))}else{p.addClass(l.toThemeProperty("jqx-menu-item-arrow-up"));p.addClass(l.toThemeProperty("jqx-icon-arrow-up"))}}a.jqx.aria(a(o.element),"aria-expanded",false);k.css({display:"none"});if(l.animationHideDuration==0){j.css({top:m})}l._raiseEvent("1",o)})}else{if(!a.jqx.browser.msie){}j.stop().animate({left:e},l.animationHideDuration,function(){if(l.animationHideDuration==0){j.css({left:e})}if(o.level>0){a(o.element).removeClass(l.toThemeProperty("jqx-fill-state-pressed"));a(o.element).removeClass(l.toThemeProperty("jqx-menu-item-selected"));var p=a(o.arrow);if(p.length>0){p.removeClass();if(o.openHorizontalDirection!="left"){p.addClass(l.toThemeProperty("jqx-menu-item-arrow-"+l._getDir("right")));p.addClass(l.toThemeProperty("jqx-icon-arrow-"+l._getDir("right")))}else{p.addClass(l.toThemeProperty("jqx-menu-item-arrow-"+l._getDir("left")));p.addClass(l.toThemeProperty("jqx-icon-arrow-"+l._getDir("left")))}}}else{a(o.element).removeClass(l.toThemeProperty("jqx-fill-state-pressed"));a(o.element).removeClass(l.toThemeProperty("jqx-menu-item-top-selected"));var p=a(o.arrow);if(p.length>0){p.removeClass();if(o.openHorizontalDirection!="left"){p.addClass(l.toThemeProperty("jqx-menu-item-arrow-top-"+l._getDir("right")));p.addClass(l.toThemeProperty("jqx-icon-arrow-"+l._getDir("right")))}else{p.addClass(l.toThemeProperty("jqx-menu-item-arrow-top-"+l._getDir("left")));p.addClass(l.toThemeProperty("jqx-icon-arrow-"+l._getDir("left")))}}}a.jqx.aria(a(o.element),"aria-expanded",false);k.css({display:"none"});l._raiseEvent("1",o)})}};if(h>0){if(j.data("timer")){j.data("timer").hide=setTimeout(function(){n()},h)}}else{n()}if(g!=undefined&&g){var d=j.children();a.each(d,function(){if(l.menuElements[this.id]&&l.menuElements[this.id].isOpen){var p=a(l.menuElements[this.id].subMenuElement);l._closeItem(l,l.menuElements[this.id],true,true)}})}}},getSubItems:function(i,h){if(i==null){return false}var g=this;var c=new Array();if(h!=null){a.extend(c,h)}var d=i;var f=this.menuElements[d];var b=a(f.subMenuElement);var e=b.find(".jqx-menu-item");a.each(e,function(){c[this.id]=g.menuElements[this.id];var j=g.getSubItems(this.id,c);a.extend(c,j)});return c},disable:function(g,d){if(g==null){return}var c=g;var f=this;if(this.menuElements[c]){var e=this.menuElements[c];e.disabled=d;var b=a(e.element);e.element.disabled=d;a.each(b.children(),function(){this.disabled=d});if(d){b.addClass(f.toThemeProperty("jqx-menu-item-disabled"));b.addClass(f.toThemeProperty("jqx-fill-state-disabled"))}else{b.removeClass(f.toThemeProperty("jqx-menu-item-disabled"));b.removeClass(f.toThemeProperty("jqx-fill-state-disabled"))}}},getItem:function(c){if(this.menuElements[c]){var b=this.menuElements[c];return b}return null},disableItem:function(b){this.disable(b,true)},hideItem:function(c){if(this.menuElements[c]){var b=this.menuElements[c];a(b.element).hide()}},showItem:function(c){if(this.menuElements[c]){var b=this.menuElements[c];a(b.element).show()}},enableItem:function(b){this.disable(b,false)},_setItemProperty:function(g,c,f){if(g==null){return}var b=g;var e=this;if(this.menuElements[b]){var d=this.menuElements[b];if(d[c]){d[c]=f}}},setItemOpenDirection:function(d,c,e){if(d==null){return}var j=d;var g=this;var f=a.jqx.browser.msie&&a.jqx.browser.version<8;if(this.menuElements[j]){var i=this.menuElements[j];if(c!=null){i.openHorizontalDirection=c;if(i.hasItems&&i.level>0){var h=a(i.element);if(h!=undefined){var b=a(i.arrow);if(i.arrow==null){b=a('<span id="arrow'+h[0].id+'"></span>');if(!f){b.prependTo(h)}else{b.appendTo(h)}i.arrow=b[0]}b.removeClass();if(i.openHorizontalDirection=="left"){b.addClass(g.toThemeProperty("jqx-menu-item-arrow-"+g._getDir("left")));b.addClass(g.toThemeProperty("jqx-icon-arrow-"+g._getDir("left")))}else{b.addClass(g.toThemeProperty("jqx-menu-item-arrow-"+g._getDir("right")));b.addClass(g.toThemeProperty("jqx-icon-arrow-"+g._getDir("right")))}b.css("visibility","inherit");if(!f){b.css("display","block");b.css("float","right")}else{b.css("display","inline-block");b.css("float","none")}}}}if(e!=null){i.openVerticalDirection=e;var b=a(i.arrow);var h=a(i.element);if(!g.showTopLevelArrows){return}if(h!=undefined){if(i.arrow==null){b=a('<span id="arrow'+h[0].id+'"></span>');if(!f){b.prependTo(h)}else{b.appendTo(h)}i.arrow=b[0]}b.removeClass();if(i.openVerticalDirection=="down"){b.addClass(g.toThemeProperty("jqx-menu-item-arrow-down"));b.addClass(g.toThemeProperty("jqx-icon-arrow-down"))}else{b.addClass(g.toThemeProperty("jqx-menu-item-arrow-up"));b.addClass(g.toThemeProperty("jqx-icon-arrow-up"))}b.css("visibility","inherit");if(!f){b.css("display","block");b.css("float","right")}else{b.css("display","inline-block");b.css("float","none")}}}}},_getSiblings:function(d){var e=new Array();var b=0;for(var c=0;c<this.items.length;c++){if(this.items[c]==d){continue}if(this.items[c].parentId==d.parentId&&this.items[c].hasItems){e[b++]=this.items[c]}}return e},_openItem:function(s,r,q){if(s==null||r==null){return false}if(r.isOpen){return false}if(r.disabled){return false}if(s.disabled){return false}var l=s.popupZIndex;if(q!=undefined){l=q}var e=s.animationHideDuration;s.animationHideDuration=0;s._closeItem(s,r,true,true);s.animationHideDuration=e;a(r.element).focus();var f=[5,5];var t=a(r.subMenuElement);if(t!=null){t.stop()}if(t.data("timer")&&t.data("timer").hide!=null){clearTimeout(t.data("timer").hide)}var o=t.closest("div.jqx-menu-popup");var h=a(r.element);var i=r.level==0?this._getOffset(r.element):h.position();if(r.level>0&&this.hasTransform){var p=parseInt(h.coord().top)-parseInt(this._getOffset(r.element).top);i.top+=p}if(r.level==0&&this.mode=="popup"){i=h.coord()}var j=r.level==0&&this.mode=="horizontal";var b=j?i.left:this.menuElements[r.parentId]!=null&&this.menuElements[r.parentId].subMenuElement!=null?parseInt(a(a(this.menuElements[r.parentId].subMenuElement).closest("div.jqx-menu-popup")).outerWidth())-f[0]:parseInt(t.outerWidth());o.css({visibility:"visible",display:"block",left:b,top:j?i.top+h.outerHeight():i.top,zIndex:l});t.css("display","block");if(this.mode!="horizontal"&&r.level==0){var d=this._getOffset(this.element);o.css("left",-1+d.left+this.host.outerWidth());t.css("left",-t.outerWidth())}else{var c=this._getClosedSubMenuOffset(r);t.css("left",c.left);t.css("top",c.top)}o.css({height:parseInt(t.outerHeight())+parseInt(f[1])+"px"});var n=0;var g=0;switch(r.openVerticalDirection){case"up":if(j){t.css("top",t.outerHeight());n=f[1];var k=parseInt(t.parent().css("padding-bottom"));if(isNaN(k)){k=0}if(k>0){o.addClass(this.toThemeProperty("jqx-menu-popup-clear"))}t.css("top",t.outerHeight()-k);o.css({display:"block",top:i.top-o.outerHeight(),zIndex:l})}else{n=f[1];t.css("top",t.outerHeight());o.css({display:"block",top:i.top-o.outerHeight()+f[1]+h.outerHeight(),zIndex:l})}break;case"center":if(j){t.css("top",0);o.css({display:"block",top:i.top-o.outerHeight()/2+f[1],zIndex:l})}else{t.css("top",0);o.css({display:"block",top:i.top+h.outerHeight()/2-o.outerHeight()/2+f[1],zIndex:l})}break}switch(r.openHorizontalDirection){case this._getDir("left"):if(j){o.css({left:i.left-(o.outerWidth()-h.outerWidth()-f[0])})}else{g=0;t.css("left",o.outerWidth());o.css({left:i.left-(o.outerWidth())+2*r.level})}break;case"center":if(j){o.css({left:i.left-(o.outerWidth()/2-h.outerWidth()/2-f[0]/2)})}else{o.css({left:i.left-(o.outerWidth()/2-h.outerWidth()/2-f[0]/2)});t.css("left",o.outerWidth())}break}if(j){if(parseInt(t.css("top"))==n){r.isOpen=true;return}}else{if(parseInt(t.css("left"))==g){r.isOpen==true;return}}a.each(s._getSiblings(r),function(){s._closeItem(s,this,true,true)});var m=a.data(s.element,"animationHideDelay");s.animationHideDelay=m;if(this.autoCloseInterval>0){if(this.host.data("autoclose")!=null&&this.host.data("autoclose").close!=null){clearTimeout(this.host.data("autoclose").close)}if(this.host.data("autoclose")!=null){this.host.data("autoclose").close=setTimeout(function(){s._closeAll()},this.autoCloseInterval)}}if(t.data("timer")){t.data("timer").show=setTimeout(function(){if(o!=null){if(j){t.stop();t.css("left",g);if(!a.jqx.browser.msie){}h.addClass(s.toThemeProperty("jqx-fill-state-pressed"));h.addClass(s.toThemeProperty("jqx-menu-item-top-selected"));if(r.openVerticalDirection=="down"){a(r.element).addClass(s.toThemeProperty("jqx-rc-b-expanded"));o.addClass(s.toThemeProperty("jqx-rc-t-expanded"))}else{a(r.element).addClass(s.toThemeProperty("jqx-rc-t-expanded"));o.addClass(s.toThemeProperty("jqx-rc-b-expanded"))}var u=a(r.arrow);if(u.length>0&&s.showTopLevelArrows){u.removeClass();if(r.openVerticalDirection=="down"){u.addClass(s.toThemeProperty("jqx-menu-item-arrow-down-selected"));u.addClass(s.toThemeProperty("jqx-icon-arrow-down"))}else{u.addClass(s.toThemeProperty("jqx-menu-item-arrow-up-selected"));u.addClass(s.toThemeProperty("jqx-icon-arrow-up"))}}if(s.animationShowDuration==0){t.css({top:n});r.isOpen=true;s._raiseEvent("0",r);a.jqx.aria(a(r.element),"aria-expanded",true)}else{t.animate({top:n},s.animationShowDuration,s.easing,function(){r.isOpen=true;a.jqx.aria(a(r.element),"aria-expanded",true);s._raiseEvent("0",r)})}}else{t.stop();t.css("top",n);if(!a.jqx.browser.msie){}if(r.level>0){h.addClass(s.toThemeProperty("jqx-fill-state-pressed"));h.addClass(s.toThemeProperty("jqx-menu-item-selected"));var u=a(r.arrow);if(u.length>0){u.removeClass();if(r.openHorizontalDirection!="left"){u.addClass(s.toThemeProperty("jqx-menu-item-arrow-"+s._getDir("right")+"-selected"));u.addClass(s.toThemeProperty("jqx-icon-arrow-"+s._getDir("right")))}else{u.addClass(s.toThemeProperty("jqx-menu-item-arrow-"+s._getDir("left")+"-selected"));u.addClass(s.toThemeProperty("jqx-icon-arrow-"+s._getDir("left")))}}}else{h.addClass(s.toThemeProperty("jqx-fill-state-pressed"));h.addClass(s.toThemeProperty("jqx-menu-item-top-selected"));var u=a(r.arrow);if(u.length>0){u.removeClass();if(r.openHorizontalDirection!="left"){u.addClass(s.toThemeProperty("jqx-menu-item-arrow-"+s._getDir("right")+"-selected"));u.addClass(s.toThemeProperty("jqx-icon-arrow-"+s._getDir("right")))}else{u.addClass(s.toThemeProperty("jqx-menu-item-arrow-"+s._getDir("left")+"-selected"));u.addClass(s.toThemeProperty("jqx-icon-arrow-"+s._getDir("left")))}}}if(!a.jqx.browser.msie){}if(s.animationShowDuration==0){t.css({left:g});s._raiseEvent("0",r);r.isOpen=true;a.jqx.aria(a(r.element),"aria-expanded",true)}else{t.animate({left:g},s.animationShowDuration,s.easing,function(){s._raiseEvent("0",r);r.isOpen=true;a.jqx.aria(a(r.element),"aria-expanded",true)})}}}},this.animationShowDelay)}},_getDir:function(b){switch(b){case"left":return !this.rtl?"left":"right";case"right":return this.rtl?"left":"right"}return"left"},_applyOrientation:function(i,d){var g=this;var f=0;g.host.removeClass(g.toThemeProperty("jqx-menu-horizontal"));g.host.removeClass(g.toThemeProperty("jqx-menu-vertical"));g.host.removeClass(g.toThemeProperty("jqx-menu"));g.host.removeClass(g.toThemeProperty("jqx-widget"));g.host.addClass(g.toThemeProperty("jqx-widget"));g.host.addClass(g.toThemeProperty("jqx-menu"));if(i!=undefined&&d!=undefined&&d=="popup"){if(g.host.parent().length>0&&g.host.parent().parent().length>0&&g.host.parent().parent()[0]==document.body){var h=a.data(document.body,"jqxMenuOldHost"+g.element.id);if(h!=null){var e=g.host.closest("div.jqx-menu-wrapper");e.remove();e.appendTo(h);g.host.css("display","block");g.host.css("visibility","visible");e.css("display","block");e.css("visibility","visible")}}}else{if(i==undefined&&d==undefined){a.data(document.body,"jqxMenuOldHost"+g.element.id,g.host.parent()[0])}}if(g.autoOpenPopup){if(g.mode=="popup"){g.addHandler(a(document),"contextmenu."+g.element.id,function(j){return false});g.addHandler(a(document),"mousedown.menu"+g.element.id,function(j){g._openContextMenu(j)})}else{g.removeHandler(a(document),"contextmenu."+g.element.id);g.removeHandler(a(document),"mousedown.menu"+g.element.id)}}else{g.removeHandler(a(document),"contextmenu."+g.element.id);g.removeHandler(a(document),"mousedown.menu"+g.element.id);g.addHandler(a(document),"contextmenu."+g.element.id,function(j){if(j.target&&j.target.className.indexOf&&j.target.className.indexOf("jqx-menu")>=0){return false}})}if(g.rtl){g.host.addClass(g.toThemeProperty("jqx-rtl"))}switch(g.mode){case"horizontal":g.host.addClass(g.toThemeProperty("jqx-widget-header"));g.host.addClass(g.toThemeProperty("jqx-menu-horizontal"));a.each(g.items,function(){var l=this;$element=a(l.element);var k=a(l.arrow);k.removeClass();if(l.hasItems&&l.level>0){var k=a('<span style="border: none; background-color: transparent;" id="arrow'+$element[0].id+'"></span>');k.prependTo($element);k.css("float",g._getDir("right"));k.addClass(g.toThemeProperty("jqx-menu-item-arrow-"+g._getDir("right")));k.addClass(g.toThemeProperty("jqx-icon-arrow-"+g._getDir("right")));l.arrow=k[0]}if(l.level==0){a(l.element).css("float",g._getDir("left"));if(!l.ignoretheme&&l.hasItems&&g.showTopLevelArrows){var k=a('<span style="border: none; background-color: transparent;" id="arrow'+$element[0].id+'"></span>');var j=a.jqx.browser.msie&&a.jqx.browser.version<8;if(l.arrow==null){if(!j){k.prependTo($element)}else{k.appendTo($element)}}else{k=a(l.arrow)}if(l.openVerticalDirection=="down"){k.addClass(g.toThemeProperty("jqx-menu-item-arrow-down"));k.addClass(g.toThemeProperty("jqx-icon-arrow-down"))}else{k.addClass(g.toThemeProperty("jqx-menu-item-arrow-up"));k.addClass(g.toThemeProperty("jqx-icon-arrow-up"))}k.css("visibility","inherit");if(!j){k.css("display","block");k.css("float","right")}else{k.css("display","inline-block")}l.arrow=k[0]}else{if(!l.ignoretheme&&l.hasItems&&!g.showTopLevelArrows){if(l.arrow!=null){var k=a(l.arrow);k.remove();l.arrow=null}}}f=Math.max(f,$element.height())}});break;case"vertical":case"popup":case"simple":g.host.addClass(g.toThemeProperty("jqx-menu-vertical"));a.each(g.items,function(){var k=this;$element=a(k.element);if(k.hasItems&&!k.ignoretheme){if(k.arrow){a(k.arrow).remove()}if(g.mode=="simple"){return true}var j=a('<span style="border: none; background-color: transparent;" id="arrow'+$element[0].id+'"></span>');j.prependTo($element);j.css("float","right");if(k.level==0){j.addClass(g.toThemeProperty("jqx-menu-item-arrow-top-"+g._getDir("right")));j.addClass(g.toThemeProperty("jqx-icon-arrow-"+g._getDir("right")))}else{j.addClass(g.toThemeProperty("jqx-menu-item-arrow-"+g._getDir("right")));j.addClass(g.toThemeProperty("jqx-icon-arrow-"+g._getDir("right")))}k.arrow=j[0]}$element.css("float","none")});if(g.mode=="popup"){g.host.addClass(g.toThemeProperty("jqx-widget-content"));g.host.wrap('<div tabindex=0 class="jqx-menu-wrapper" style="z-index:'+g.popupZIndex+'; border: none; background-color: transparent; padding: 0px; margin: 0px; position: absolute; top: 0; left: 0; display: block; visibility: visible;"></div>');var e=g.host.closest("div.jqx-menu-wrapper");g.host.addClass(g.toThemeProperty("jqx-popup"));e[0].id="menuWrapper"+g.element.id;e.appendTo(a(document.body));g.addHandler(e,"keydown",function(j){return g.handleKeyDown(j)})}else{g.host.addClass(g.toThemeProperty("jqx-widget-header"))}if(g.mode=="popup"){var b=g.host.height();g.host.css("position","absolute");g.host.css("top","0");g.host.css("left","0");if(g.mode!="simple"){g.host.height(b);g.host.css("display","none")}}break}var c=g.isTouchDevice();if(g.autoCloseOnClick){g.removeHandler(a(document),"mousedown.menu"+g.element.id,g._closeAfterClick);g.addHandler(a(document),"mousedown.menu"+g.element.id,g._closeAfterClick,g);if(c){g.removeHandler(a(document),a.jqx.mobile.getTouchEventName("touchstart")+".menu"+g.element.id,g._closeAfterClick,g);g.addHandler(a(document),a.jqx.mobile.getTouchEventName("touchstart")+".menu"+g.element.id,g._closeAfterClick,g)}}},_getBodyOffset:function(){var c=0;var b=0;if(a("body").css("border-top-width")!="0px"){c=parseInt(a("body").css("border-top-width"));if(isNaN(c)){c=0}}if(a("body").css("border-left-width")!="0px"){b=parseInt(a("body").css("border-left-width"));if(isNaN(b)){b=0}}return{left:b,top:c}},_getOffset:function(c){var e=a.jqx.mobile.isSafariMobileBrowser();var i=a(c).coord(true);var h=i.top;var g=i.left;if(a("body").css("border-top-width")!="0px"){h=parseInt(h)+this._getBodyOffset().top}if(a("body").css("border-left-width")!="0px"){g=parseInt(g)+this._getBodyOffset().left}var d=a.jqx.mobile.isWindowsPhone();var f=a.jqx.mobile.isTouchDevice();if(this.hasTransform||(e!=null&&e)||d||f){var b={left:a.jqx.mobile.getLeftPos(c),top:a.jqx.mobile.getTopPos(c)};return b}else{return{left:g,top:h}}},_isRightClick:function(c){var b;if(!c){var c=window.event}if(c.which){b=(c.which==3)}else{if(c.button){b=(c.button==2)}}return b},_openContextMenu:function(d){var c=this;var b=c._isRightClick(d);if(b){c.open(parseInt(d.clientX)+5,parseInt(d.clientY)+5)}},close:function(){var c=this;var d=a.data(this.element,"contextMenuOpened"+this.element.id);if(d){var b=this.host;a.each(c.items,function(){var e=this;if(e.hasItems){c._closeItem(c,e)}});a.each(c.items,function(){var e=this;if(e.isOpen==true){$submenu=a(e.subMenuElement);var f=$submenu.closest("div.jqx-menu-popup");f.hide(this.animationHideDuration)}});this.host.hide(this.animationHideDuration);a.data(c.element,"contextMenuOpened"+this.element.id,false);c._raiseEvent("1",c);c._raiseEvent("5")}},open:function(e,d){if(this.mode=="popup"){var c=0;if(this.host.css("display")=="block"){this.close();c=this.animationHideDuration}var b=this;if(e==undefined||e==null){e=0}if(d==undefined||d==null){d=0}setTimeout(function(){b.host.show(b.animationShowDuration);b.host.css("visibility","visible");a.data(b.element,"contextMenuOpened"+b.element.id,true);b._raiseEvent("0",b);b._raiseEvent("4",{left:e,top:d});b.host.css("z-index",b.popupZIndex);if(e!=undefined&&d!=undefined){b.host.css({left:e,top:d})}b.focus()},c)}},_renderHover:function(c,e,b){var d=this;if(!e.ignoretheme){this.addHandler(c,"mouseenter",function(){d.hoveredItem=e;if(!e.disabled&&!e.separator&&d.enableHover&&!d.disabled){if(e.level>0){c.addClass(d.toThemeProperty("jqx-fill-state-hover"));c.addClass(d.toThemeProperty("jqx-menu-item-hover"))}else{c.addClass(d.toThemeProperty("jqx-fill-state-hover"));c.addClass(d.toThemeProperty("jqx-menu-item-top-hover"))}}});this.addHandler(c,"mouseleave",function(){if(!e.disabled&&!e.separator&&d.enableHover&&!d.disabled){if(e.level>0){c.removeClass(d.toThemeProperty("jqx-fill-state-hover"));c.removeClass(d.toThemeProperty("jqx-menu-item-hover"))}else{c.removeClass(d.toThemeProperty("jqx-fill-state-hover"));c.removeClass(d.toThemeProperty("jqx-menu-item-top-hover"))}}})}},_closeAfterClick:function(c){var b=c!=null?c.data:this;var d=false;if(b.autoCloseOnClick){a.each(a(c.target).parents(),function(){if(this.className.indexOf){if(this.className.indexOf("jqx-menu")!=-1){d=true;return false}}});if(!d){c.data=b;b._closeAll(c)}}},_autoSizeHorizontalMenuItems:function(){var c=this;if(c.autoSizeMainItems&&this.mode=="horizontal"){var b=this.maxHeight;if(parseInt(b)>parseInt(this.host.height())){b=parseInt(this.host.height())}b=parseInt(this.host.height());a.each(this.items,function(){var l=this;$element=a(l.element);if(l.level==0&&b>0){var d=$element.children().length>0?parseInt($element.children().height()):$element.height();var g=c.host.find("ul:first");var h=parseInt(g.css("padding-top"));var m=parseInt(g.css("margin-top"));var j=b-2*(m+h);var i=parseInt(j)/2-d/2;var e=parseInt(i);var k=parseInt(i);$element.css("padding-top",e);$element.css("padding-bottom",k);if(parseInt($element.outerHeight())>j){var f=1;$element.css("padding-top",e-f);e=e-f}}})}a.each(this.items,function(){var f=this;$element=a(f.element);if(f.hasItems&&f.level>0){if(f.arrow){var e=a(f.arrow);var d=a(f.element).height();if(d>15){e.css("margin-top",(d-15)/2)}}}})},_nextVisibleItem:function(c,d){if(c==null||c==undefined){return null}var b=c;while(b!=null){b=b.nextItem;if(this._isVisible(b)&&!b.disabled&&b.type!=="separator"){if(this.minimized){return b}if(d!=undefined){if(b&&b.level!=d){continue}}return b}}return null},_prevVisibleItem:function(c,d){if(c==null||c==undefined){return null}var b=c;while(b!=null){b=b.prevItem;if(this._isVisible(b)&&!b.disabled&&b.type!=="separator"){if(this.minimized){return b}if(d!=undefined){if(b&&b.level!=d){continue}}return b}}return null},_parentItem:function(d){if(d==null||d==undefined){return null}var c=d.parentElement;if(!c){return null}var b=null;a.each(this.items,function(){if(this.element==c){b=this;return false}});return b},_isElementVisible:function(b){if(b==null){return false}if(a(b).css("display")!="none"&&a(b).css("visibility")!="hidden"){return true}return false},_isVisible:function(c){if(c==null||c==undefined){return false}if(!this._isElementVisible(c.element)){return false}var b=this._parentItem(c);if(b==null){return true}if(this.minimized){return true}if(b!=null){if(!this._isElementVisible(b.element)){return false}if(b.isOpen||this.minimized){while(b!=null){b=this._parentItem(b);if(b!=null&&!this._isElementVisible(b.element)){return false}if(b!=null&&!b.isOpen){return false}}}else{return false}}return true},_render:function(f,g){if(this.disabled){this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled"));this.host.addClass(this.toThemeProperty("jqx-menu-disabled"))}if(this.host.attr("tabindex")==undefined){this.host.attr("tabindex",0)}var i=this.popupZIndex;var d=[5,5];var h=this;a.data(h.element,"animationHideDelay",h.animationHideDelay);var e=this.isTouchDevice();var c=e&&(a.jqx.mobile.isWindowsPhone()||navigator.userAgent.indexOf("Touch")>=0);var j=false;if(navigator.platform.toLowerCase().indexOf("win")!=-1){if(navigator.userAgent.indexOf("Windows Phone")>=0||navigator.userAgent.indexOf("WPDesktop")>=0||navigator.userAgent.indexOf("IEMobile")>=0||navigator.userAgent.indexOf("ZuneWP7")>=0){this.touchDevice=true}else{if(navigator.userAgent.indexOf("Touch")>=0){var b=("MSPointerDown" in window);if(b||a.jqx.mobile.isWindowsPhone()||navigator.userAgent.indexOf("ARM")>=0){j=true;c=true;h.clickToOpen=true;h.autoCloseOnClick=false;h.enableHover=false}}}}a.data(document.body,"menuel",this);this.hasTransform=a.jqx.utilities.hasTransform(this.host);this._applyOrientation(f,g);this.removeHandler(this.host,"blur");this.removeHandler(this.host,"focus");this.addHandler(this.host,"blur",function(k){if(h.keyboardNavigation){if(h.activeItem){if(h.mode==="popup"){if(document.activeElement&&document.activeElement.className.indexOf("jqx-menu-wrapper")>=0){return}}a(h.activeItem.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=null}}});this.addHandler(this.host,"focus",function(k){if(h.keyboardNavigation){if(!h.activeItem){if(h.hoveredItem){a(h.hoveredItem.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=h.hoveredItem}else{var l=function(){if(!a.jqx.isHidden(a(h.items[0].element))){a(h.items[0].element).addClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=h.items[0]}else{var m=h._nextVisibleItem(h.items[0],0);if(m){a(m.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=m}}};if(!h.activeItem){l()}else{if(!a.jqx.isHidden(a(h.activeItem.element))){a(h.activeItem.element).addClass(h.toThemeProperty("jqx-fill-state-focus"))}else{a(h.activeItem.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));l()}}}}}});this.removeHandler(this.host,"keydown.menu"+this.element.id);h.handleKeyDown=function(k){if(h.keyboardNavigation){if(k.target.nodeName.toLowerCase()==="input"){return true}var q=null;var o=null;a.each(h.items,function(){var A=this;if(this.disabled){return true}if(this.element.className.indexOf("pressed")>=0){o=this}if(this.element.className.indexOf("focus")>=0){q=this;return false}});if(!q&&o){q=o;return false}if(!q){a(h.items[0].element).addClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=h.items[0];q=h.activeItem;return false}var t=false;if(k.keyCode==27){k.data=h;h._closeAll(k);if(q){var z=q;while(z!=null){if(z.parentItem){z=z.parentItem}else{a(h.activeItem.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=z;a(h.activeItem.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));z=z.parentItem}}}t=true}if(k.keyCode==13){if(q){t=true;h._raiseEvent("2",{item:q.element,event:k,type:"keyboard"});var r=q.anchor!=null?a(q.anchor):null;if(r!=null&&r.length>0){var l=r.attr("href");var u=r.attr("target");if(l!=null){if(u!=null){window.open(l,u)}else{window.location=l}}}k.preventDefault();k.stopPropagation();a(q.element).focus()}}var n=function(D){if(D==null){return new Array()}var C=new Array();var A=0;for(var B=0;B<h.items.length;B++){if(h.items[B].parentId==D.parentId){C[A++]=h.items[B]}}return C};var v="";switch(k.keyCode){case 40:v="down";break;case 38:v="up";break;case 39:v="right";break;case 37:v="left";break}if(q&&q.openHorizontalDirection==="left"&&v==="left"){v="right"}if(q&&q.openHorizontalDirection==="left"&&v==="right"){v="left"}if(q&&q.openVerticalDirection==="top"&&v==="top"){v="bottom"}if(q&&q.openVerticalDirection==="top"&&v==="bottom"){v="top"}if(h.rtl){if(v==="right"){v="left"}else{if(v==="left"){v="right"}}}if(v==="right"&&!h.minimized){if(k.altKey&&(q.level!=0&&q.hasItems||h.mode!="horizontal")){h._openItem(h,q)}else{var x=h._nextVisibleItem(q,0);var m=h._nextVisibleItem(q);var w=n(m);if(!x){x=m}if(x&&((x.parentId===q.parentId&&x.level==0&&h.mode=="horizontal")||(m.id==w[0].id&&m.level!=0))){if(m.id==w[0].id&&((q.level!=0)||(q.level==0&&h.mode!="horizontal"))){x=m}a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}}k.preventDefault();k.stopPropagation()}if(v==="left"&&!h.minimized){if(k.altKey&&((q.level!=0&&h.mode!=="horizontal")||(q.level>1&&h.mode==="horizontal")||(q.level==1&&q.hasItems&&h.mode==="horizontal"))){if(q.hasItems){h._closeItem(h,q)}else{if(q.parentItem){h._closeItem(h,q.parentItem);a(q.parentItem.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=q.parentItem}}}else{var x=h._prevVisibleItem(q,0);var y=q.parentItem;if(x&&(x.parentId===q.parentId&&x.level==0&&h.mode=="horizontal")){a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}else{if(!(y&&y.level==0&&h.mode=="horizontal")&&y&&y.level==q.level-1){a(y.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=y}}}k.preventDefault();k.stopPropagation()}if(v==="down"){if(k.altKey){if(q.level==0&&q.hasItems){h._openItem(h,q)}if(h.minimized){if(h.minimizedHidden){h.minimizedItem.trigger("click")}}}else{var x=h._nextVisibleItem(q,q.level);var w=n(x);if(h.minimized&&x){a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}else{if(x&&(x.parentId===q.parentId||(x.id==w[0].id&&h.mode=="horizontal"))){if(!(x.level==0&&h.mode=="horizontal")){a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}}if(h.mode==="horizontal"&&q.level===0&&q.isOpen&&q.hasItems){var x=h._nextVisibleItem(q);a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}}}k.preventDefault();k.stopPropagation()}else{if(v==="up"){if(k.altKey){if(q.parentItem&&q.parentItem.level==0){h._closeItem(h,q.parentItem);a(q.parentItem.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=q.parentItem}else{if(q.parentItem===null&&q.level===0&&h.mode==="horizontal"){h._closeItem(h,q)}}if(h.minimized){if(!h.minimizedHidden){h.minimizedItem.trigger("click")}}}else{var x=h._prevVisibleItem(q,q.level);var w=n(q);if(h.minimized&&x){a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}else{if(x&&(x.parentId===q.parentId||(x.id==q.parentId&&x.level==0&&h.mode=="horizontal"))){if(!(x.level==0&&h.mode==="horizontal"&&q.level===0)){a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}}else{if(q&&q.id==w[0].id&&q.parentItem&&q.parentItem.level===0&&h.mode==="horizontal"){var x=q.parentItem;a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x}}}}k.preventDefault();k.stopPropagation()}}if(k.keyCode==9){var x=k.shiftKey?h._prevVisibleItem(q):h._nextVisibleItem(q);if(x){a(x.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=x;k.preventDefault();k.stopPropagation()}else{if(h.lockFocus){var w=new Array();var s=0;for(var p=0;p<h.items.length;p++){if(h.items[p]==q){continue}if(h.items[p].parentId==q.parentId){w[s++]=h.items[p]}}if(w.length>0){if(k.shiftKey){a(w[w.length-1].element).addClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=w[w.length-1]}else{a(w[0].element).addClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=w[0]}a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"))}k.preventDefault();k.stopPropagation()}else{if(q){a(q.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"));h.activeItem=null}}}}}else{return true}};this.addHandler(this.host,"keydown.menu"+this.element.id,function(k){h.handleKeyDown(k)});if(h.enableRoundedCorners){this.host.addClass(h.toThemeProperty("jqx-rc-all"))}a.each(this.items,function(){var r=this;var n=a(r.element);n.attr("role","menuitem");if(h.enableRoundedCorners){n.addClass(h.toThemeProperty("jqx-rc-all"))}h.removeHandler(n,"click");h.addHandler(n,"click",function(w){if(r.disabled){return}if(h.disabled){return}if(h.keyboardNavigation){if(h.activeItem){a(h.activeItem.element).removeClass(h.toThemeProperty("jqx-fill-state-focus"))}h.activeItem=r;a(r.element).addClass(h.toThemeProperty("jqx-fill-state-focus"));if(h.minimized){w.stopPropagation()}}h._raiseEvent("2",{type:"mouse",item:r.element,event:w});if(!h.autoOpen){if(r.level>0){if(h.autoCloseOnClick&&!e&&!h.clickToOpen){w.data=h;h._closeAll(w)}}}else{if(h.autoCloseOnClick&&!e&&!h.clickToOpen){if(r.closeOnClick){w.data=h;h._closeAll(w)}}}if(e&&h.autoCloseOnClick){w.data=h;if(!r.hasItems){h._closeAll(w)}}if(w.target.tagName!="A"&&w.target.tagName!="a"){var u=r.anchor!=null?a(r.anchor):null;if(u!=null&&u.length>0){var t=u.attr("href");var v=u.attr("target");if(t!=null){if(v!=null){window.open(t,v)}else{window.location=t}}}}});h.removeHandler(n,"mouseenter");h.removeHandler(n,"mouseleave");if(!c&&h.mode!="simple"){h._renderHover(n,r,e)}if(r.subMenuElement!=null){var o=a(r.subMenuElement);if(h.mode=="simple"){o.show();return true}o.wrap('<div class="jqx-menu-popup '+h.toThemeProperty("jqx-menu-popup")+'" style="border: none; background-color: transparent; z-index:'+i+'; padding: 0px; margin: 0px; position: absolute; top: 0; left: 0; display: block; visibility: hidden;"><div style="background-color: transparent; border: none; position:absolute; overflow:hidden; left: 0; top: 0; right: 0; width: 100%; height: 100%;"></div></div>');o.css({overflow:"hidden",position:"absolute",left:0,display:"inherit",top:-o.outerHeight()});o.data("timer",{});if(r.level>0){o.css("left",-o.outerWidth())}else{if(h.mode=="horizontal"){o.css("left",0)}}i++;var q=a(r.subMenuElement).closest("div.jqx-menu-popup").css({width:parseInt(a(r.subMenuElement).outerWidth())+parseInt(d[0])+"px",height:parseInt(a(r.subMenuElement).outerHeight())+parseInt(d[1])+"px"});var s=n.closest("div.jqx-menu-popup");if(s.length>0){var k=o.css("margin-left");var m=o.css("margin-right");var l=o.css("padding-left");var p=o.css("padding-right");q.appendTo(s);o.css("margin-left",k);o.css("margin-right",m);o.css("padding-left",l);o.css("padding-right",p)}else{var k=o.css("margin-left");var m=o.css("margin-right");var l=o.css("padding-left");var p=o.css("padding-right");q.appendTo(a(document.body));o.css("margin-left",k);o.css("margin-right",m);o.css("padding-left",l);o.css("padding-right",p)}if(!h.clickToOpen){if(e||c){h.removeHandler(n,a.jqx.mobile.getTouchEventName("touchstart"));h.addHandler(n,a.jqx.mobile.getTouchEventName("touchstart"),function(t){clearTimeout(o.data("timer").hide);if(o!=null){o.stop()}if(r.level==0&&!r.isOpen&&h.mode!="popup"){t.data=h;h._closeAll(t)}if(!r.isOpen){h._openItem(h,r)}else{h._closeItem(h,r,true)}return false})}if(!c){h.addHandler(n,"mouseenter",function(){if(h.autoOpen||(r.level>0&&!h.autoOpen)){clearTimeout(o.data("timer").hide)}if(r.parentId&&r.parentId!=0){if(h.menuElements[r.parentId]){var t=h.menuElements[r.parentId].isOpen;if(!t){return}}}if(h.autoOpen||(r.level>0&&!h.autoOpen)){h._openItem(h,r)}return false});h.addHandler(n,"mousedown",function(){if(!h.autoOpen&&r.level==0){clearTimeout(o.data("timer").hide);if(o!=null){o.stop()}if(!r.isOpen){h._openItem(h,r)}else{h._closeItem(h,r,true)}}});h.addHandler(n,"mouseleave",function(u){if(h.autoCloseOnMouseLeave){clearTimeout(o.data("timer").hide);var x=a(r.subMenuElement);var t={left:parseInt(u.pageX),top:parseInt(u.pageY)};var w={left:parseInt(x.coord().left),top:parseInt(x.coord().top),width:parseInt(x.outerWidth()),height:parseInt(x.outerHeight())};var v=true;if(w.left-5<=t.left&&t.left<=w.left+w.width+5){if(w.top<=t.top&&t.top<=w.top+w.height){v=false}}if(v){h._closeItem(h,r,true)}}});h.removeHandler(q,"mouseenter");h.addHandler(q,"mouseenter",function(){clearTimeout(o.data("timer").hide)});h.removeHandler(q,"mouseleave");h.addHandler(q,"mouseleave",function(t){if(h.autoCloseOnMouseLeave){clearTimeout(o.data("timer").hide);clearTimeout(o.data("timer").show);if(o!=null){o.stop()}h._closeItem(h,r,true)}})}}else{h.removeHandler(n,"mousedown");h.addHandler(n,"mousedown",function(t){clearTimeout(o.data("timer").hide);if(o!=null){o.stop()}if(r.level==0&&!r.isOpen){t.data=h;h._closeAll(t)}if(!r.isOpen){h._openItem(h,r)}else{h._closeItem(h,r,true)}})}}});if(this.mode=="simple"){this._renderSimpleMode()}this._autoSizeHorizontalMenuItems();this._raiseEvent("3",this)},_renderSimpleMode:function(){this.host.show()},createID:function(){var b=Math.random()+"";b=b.replace(".","");b="99"+b;b=b/1;while(this.items[b]){b=Math.random()+"";b=b.replace(".","");b=b/1}return"menuItem"+b},_createMenu:function(c,f){if(c==null){return}if(f==undefined){f=true}if(f==null){f=true}var o=this;a(c).addClass("jqx-menu-ul");var u=a(c).find("li");var q=0;this.itemMapping=new Array();for(var j=0;j<u.length;j++){var m=u[j];var s=a(m);if(m.className.indexOf("jqx-menu")==-1&&this.autoGenerate==false){continue}var p=m.id;if(!p){p=this.createID()}if(f){m.id=p;this.items[q]=new a.jqx._jqxMenu.jqxMenuItem();this.menuElements[p]=this.items[q]}q+=1;var t=0;var x=this;var h=s.children();h.each(function(){if(!f){this.className="";if(x.autoGenerate){a(x.items[q-1].subMenuElement)[0].className="";if(!x.minimized){a(x.items[q-1].subMenuElement).addClass(x.toThemeProperty("jqx-widget-content"))}a(x.items[q-1].subMenuElement).addClass(x.toThemeProperty("jqx-menu-dropdown"));a(x.items[q-1].subMenuElement).addClass(x.toThemeProperty("jqx-popup"))}}if(this.className.indexOf("jqx-menu-dropdown")!=-1){if(f){x.items[q-1].subMenuElement=this}return false}else{if(x.autoGenerate&&(this.tagName=="ul"||this.tagName=="UL")){if(f){x.items[q-1].subMenuElement=this}this.className="";if(!x.minimized){a(this).addClass(x.toThemeProperty("jqx-widget-content"))}a(this).addClass(x.toThemeProperty("jqx-menu-dropdown"));a(this).addClass(x.toThemeProperty("jqx-popup"));a(this).attr("role","menu");if(x.rtl){a(this).addClass(x.toThemeProperty("jqx-rc-l"))}else{a(this).addClass(x.toThemeProperty("jqx-rc-r"))}a(this).addClass(x.toThemeProperty("jqx-rc-b"));return false}}});var w=s.parents();w.each(function(){if(this.className.indexOf("jqx-menu-item")!=-1){t=this.id;return false}else{if(x.autoGenerate&&(this.tagName=="li"||this.tagName=="LI")){t=this.id;return false}}});var e=false;var d=m.getAttribute("type");var b=m.getAttribute("ignoretheme")||m.getAttribute("data-ignoretheme");if(b){if(b=="true"||b==true){b=true}}else{b=false}if(!d){d=m.type}else{if(d=="separator"){var e=true}}if(!e){if(t){d="sub"}else{d="top"}}var g=this.items[q-1];if(f){g.id=p;g.parentId=t;g.type=d;g.separator=e;g.element=u[j];var l=s.children("a");g.disabled=m.getAttribute("item-disabled")=="true"?true:false;g.level=s.parents("li").length;g.anchor=l.length>0?l:null;if(g.anchor){a(g.anchor).attr("tabindex",-1)}}g.ignoretheme=b;var n=this.menuElements[t];if(n!=null){if(n.ignoretheme){g.ignoretheme=n.ignoretheme;b=n.ignoretheme}g.parentItem=n;g.parentElement=n.element}if(this.autoGenerate){if(d=="separator"){s.removeClass();s.addClass(this.toThemeProperty("jqx-menu-item-separator"));s.attr("role","separator")}else{if(!b){if(s[0].className.indexOf("jqx-grid-menu-item-touch")>=0){s[0].className=this.toThemeProperty("jqx-grid-menu-item-touch")}else{s[0].className=""}if(this.rtl){s.addClass(this.toThemeProperty("jqx-rtl"))}if(g.level>0&&!x.minimized){s.addClass(this.toThemeProperty("jqx-item"));s.addClass(this.toThemeProperty("jqx-menu-item"))}else{s.addClass(this.toThemeProperty("jqx-item"));s.addClass(this.toThemeProperty("jqx-menu-item-top"))}}}}if(g.disabled){s.addClass(x.toThemeProperty("jqx-menu-item-disabled"));s.addClass(x.toThemeProperty("jqx-fill-state-disabled"))}this.itemMapping[j]={element:u[j],item:g};this.itemMapping["id"+u[j].id]=this.itemMapping[j];if(f&&!b){g.hasItems=s.find("li").length>0;if(g.hasItems){if(g.element){a.jqx.aria(a(g.element),"aria-haspopup",true);if(!g.subMenuElement.id){g.subMenuElement.id=a.jqx.utilities.createId()}a.jqx.aria(a(g.element),"aria-owns",g.subMenuElement.id)}}}}for(var r=0;r<u.length;r++){var v=u[r];if(this.itemMapping["id"+v.id]){var g=this.itemMapping["id"+v.id].item;if(!g){continue}g.prevItem=null;g.nextItem=null;if(r>0){if(this.itemMapping["id"+u[r-1].id]){g.prevItem=this.itemMapping["id"+u[r-1].id].item}}if(r<u.length-1){if(this.itemMapping["id"+u[r+1].id]){g.nextItem=this.itemMapping["id"+u[r+1].id].item}}}}},destroy:function(){var b=this;a.jqx.utilities.resize(b.host,null,true);var d=b.host.closest("div.jqx-menu-wrapper");b.removeHandler(d,"keydown");d.remove();b.removeHandler(a("#menuWrapper"+b.element.id),"keydown");a("#menuWrapper"+b.element.id).remove();b.removeHandler(b.host,"keydown");b.removeHandler(b.host,"focus");b.removeHandler(b.host,"blur");b.removeHandler(a(document),"mousedown.menu"+b.element.id,b._closeAfterClick);b.removeHandler(a(document),"mouseup.menu"+b.element.id,b._closeAfterClick);b.removeHandler(a(document),"contextmenu."+b.element.id);b.removeHandler(b.host,"contextmenu."+b.element.id);a.data(document.body,"jqxMenuOldHost"+b.element.id,null);if(b.isTouchDevice()){b.removeHandler(a(document),a.jqx.mobile.getTouchEventName("touchstart")+".menu"+b.element.id,b._closeAfterClick,this)}if(a(window).off){a(window).off("resize.menu"+b.element.id)}a.each(b.items,function(){var g=this;var f=a(g.element);b.removeHandler(f,"click");b.removeHandler(f,"selectstart");b.removeHandler(f,"mouseenter");b.removeHandler(f,"mouseleave");b.removeHandler(f,"mousedown");b.removeHandler(f,"mouseleave");var e=a(g.subMenuElement);var h=e.closest("div.jqx-menu-popup");h.remove();delete this.subMenuElement;delete this.element});a.data(document.body,"menuel",null);delete b.menuElements;b.items=new Array();delete b.items;var c=a.data(b.element,"jqxMenu");if(c){delete c.instance}b.host.removeClass();b.host.remove();delete b.host;delete b.element},_raiseEvent:function(f,c){if(c==undefined){c={owner:null}}var d=this.events[f];args=c;args.owner=this;var e=new a.Event(d);if(f=="2"){args=c.item;args.owner=this;args.clickType=c.type;a.extend(e,c.event);e.type="itemclick"}e.owner=this;e.args=args;var b=this.host.trigger(e);return b},propertiesChangedHandler:function(b,c,e){if(e.width&&e.height&&Object.keys(e).length==2){b._setSize();if(b.mode==="popup"){var d=this.host.closest("div.jqx-menu-wrapper");d[c](e);var f=this.host[0].id;a("#"+f)[c](e)}}},propertyChangedHandler:function(b,d,h,g){if(this.isInitialized==undefined||this.isInitialized==false){return}if(b.batchUpdate&&b.batchUpdate.width&&b.batchUpdate.height&&Object.keys(b.batchUpdate).length==2){return}if(d=="disabled"){if(b.disabled){b.host.addClass(b.toThemeProperty("jqx-fill-state-disabled"));b.host.addClass(b.toThemeProperty("jqx-menu-disabled"))}else{b.host.removeClass(b.toThemeProperty("jqx-fill-state-disabled"));b.host.removeClass(b.toThemeProperty("jqx-menu-disabled"))}}if(g==h){return}if(d=="touchMode"){this._isTouchDevice=null;b._render(g,h)}if(d==="width"||d==="height"){b._setSize();if(b.mode==="popup"){var e=this.host.closest("div.jqx-menu-wrapper");e[d](g);var i=this.host[0].id;a("#"+i)[d](g)}return}if(d=="source"){if(b.source!=null){var c=b.loadItems(b.source);b.element.innerHTML=c;var f=b.host.find("ul:first");if(f.length>0){b.refresh();b._createMenu(f[0]);b._render()}}}if(d=="autoCloseOnClick"){if(g==false){b.removeHandler(a(document),"mousedown.menu"+this.element.id,b._closeAll)}else{b.addHandler(a(document),"mousedown.menu"+this.element.id,b,b._closeAll)}}else{if(d=="mode"||d=="width"||d=="height"||d=="showTopLevelArrows"){b.refresh();if(d=="mode"){b._render(g,h)}else{b._applyOrientation()}}else{if(d=="theme"){a.jqx.utilities.setTheme(h,g,b.host)}}}}})})(jqxBaseFramework);(function(a){a.jqx._jqxMenu.jqxMenuItem=function(e,d,c){var b={id:e,parentId:d,parentItem:null,anchor:null,type:c,disabled:false,level:0,isOpen:false,hasItems:false,element:null,subMenuElement:null,arrow:null,openHorizontalDirection:"right",openVerticalDirection:"down",closeOnClick:true};return b}})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.jqxWidget("jqxPanel","",{});a.extend(a.jqx._jqxPanel.prototype,{defineInstance:function(){var b={width:null,height:null,disabled:false,scrollBarSize:a.jqx.utilities.scrollBarSize,sizeMode:"fixed",autoUpdate:false,autoUpdateInterval:500,touchMode:"auto",horizontalScrollBarMax:null,verticalScrollBarMax:null,touchModeStyle:"auto",rtl:false,events:["layout"]};if(this===a.jqx._jqxPanel.prototype){return b}a.extend(true,this,b);return b},createInstance:function(b){this.render()},render:function(){var b=this;if(a.jqx.utilities.scrollBarSize!=15){this.scrollBarSize=a.jqx.utilities.scrollBarSize}this.host.addClass(this.toThemeProperty("jqx-panel"));this.host.addClass(this.toThemeProperty("jqx-widget"));this.host.addClass(this.toThemeProperty("jqx-widget-content"));this.host.addClass(this.toThemeProperty("jqx-rc-all"));var c=a("<div id='panelWrapper' style='overflow: hidden; width: 100%; height: 100%; background-color: transparent; -webkit-appearance: none; outline: none; align:left; border: 0px; padding: 0px; margin: 0px; left: 0px; top: 0px; valign:top; position: relative;'><div id='panelContent' style='-webkit-appearance: none; -moz-box-sizing: border-box; box-sizing: border-box; width: 100%; height: 100%; outline: none; border: none; padding: 0px; position: absolute; margin: 0px; align:left; valign:top; left: 0px; top: 0px;'/><div id='verticalScrollBar' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'/><div id='horizontalScrollBar' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'/><div id='bottomRight' style='align:left; valign:top; left: 0px; top: 0px; position: absolute;'/></div>");if(!this.host.jqxButton){throw new Error("jqxPanel: Missing reference to jqxbuttons.js.")}if(!this.host.jqxScrollBar){throw new Error("jqxPanel: Missing reference to jqxscrollbar.js.")}var d=this.host.children();this._rtl=false;if(d.length>0&&d.css("direction")=="rtl"){this.rtl=true;this._rtl=true}this.host.wrapInner(c);var g=this.host.find("#verticalScrollBar");g[0].id=this.element.id+"verticalScrollBar";this.vScrollBar=g.jqxScrollBar({vertical:true,rtl:this.rtl,touchMode:this.touchMode,theme:this.theme});var f=this.host.find("#horizontalScrollBar");f[0].id=this.element.id+"horizontalScrollBar";this.hScrollBar=f.jqxScrollBar({vertical:false,rtl:this.rtl,touchMode:this.touchMode,theme:this.theme});this.content=this.host.find("#panelContent");this.wrapper=this.host.find("#panelWrapper");this.content.addClass(this.toThemeProperty("jqx-widget-content"));this.wrapper[0].id=this.wrapper[0].id+this.element.id;this.content[0].id=this.content[0].id+this.element.id;this.bottomRight=this.host.find("#bottomRight").addClass(this.toThemeProperty("jqx-panel-bottomright")).addClass(this.toThemeProperty("jqx-scrollbar-state-normal"));this.bottomRight[0].id="bottomRight"+this.element.id;this.vScrollBar.css("visibility","inherit");this.hScrollBar.css("visibility","inherit");this.vScrollInstance=a.data(this.vScrollBar[0],"jqxScrollBar").instance;this.hScrollInstance=a.data(this.hScrollBar[0],"jqxScrollBar").instance;var e=this;this.propertyChangeMap.disabled=function(h,j,i,k){e.vScrollBar.jqxScrollBar({disabled:e.disabled});e.hScrollBar.jqxScrollBar({disabled:e.disabled})};this.vScrollBar.jqxScrollBar({disabled:this.disabled});this.hScrollBar.jqxScrollBar({disabled:this.disabled});this._addHandlers();if(this.width==null){this.width=this.content.width()}if(this.height==null){this.height=this.content.height()}this._arrange();this.contentWidth=e.content[0].scrollWidth;this.contentHeight=e.content[0].scrollHeight;if(this.autoUpdate){e._autoUpdate()}this.propertyChangeMap.autoUpdate=function(h,j,i,k){if(e.autoUpdate){e._autoUpdate()}else{clearInterval(e.autoUpdateId);e.autoUpdateId=null}};this.addHandler(a(window),"unload",function(){if(e.autoUpdateId!=null){clearInterval(e.autoUpdateId);e.autoUpdateId=null;e.destroy()}});this._updateTouchScrolling();this._render()},hiddenParent:function(){return a.jqx.isHidden(this.host)},_updateTouchScrolling:function(){var b=this;if(this.touchMode==true){a.jqx.mobile.setMobileSimulator(this.element)}var c=this.isTouchDevice();if(c){a.jqx.mobile.touchScroll(this.element,b.vScrollInstance.max,function(f,e){if(b.vScrollBar.css("visibility")!="hidden"&&e!=null){var d=b.vScrollInstance.value;b.vScrollInstance.setPosition(e)}if(b.hScrollBar.css("visibility")!="hidden"&&f!=null){var d=b.hScrollInstance.value;b.hScrollInstance.setPosition(f)}},this.element.id,this.hScrollBar,this.vScrollBar);this._arrange()}this.vScrollBar.jqxScrollBar({touchMode:this.touchMode});this.hScrollBar.jqxScrollBar({touchMode:this.touchMode})},isTouchDevice:function(){var b=a.jqx.mobile.isTouchDevice();if(this.touchMode==true){b=true}else{if(this.touchMode==false){b=false}}if(b&&this.touchModeStyle!=false){this.scrollBarSize=a.jqx.utilities.touchScrollBarSize}return b},append:function(b){if(b!=null){this.content.append(b);this._arrange()}},setcontent:function(b){this.content[0].innerHTML=b;this._arrange();var c=this;setTimeout(function(){c._arrange()},100)},prepend:function(b){if(b!=null){this.content.prepend(b);this._arrange()}},clearcontent:function(){this.content.text("");this.content.children().remove();this._arrange()},remove:function(b){if(b!=null){a(b).remove();this._arrange()}},_autoUpdate:function(){var b=this;this.autoUpdateId=setInterval(function(){var d=b.content[0].scrollWidth;var c=b.content[0].scrollHeight;var e=false;if(b.contentWidth!=d){b.contentWidth=d;e=true}if(b.contentHeight!=c){b.contentHeight=c;e=true}if(e){b._arrange()}},this.autoUpdateInterval)},_addHandlers:function(){var b=this;this.addHandler(this.vScrollBar,"valueChanged",function(c){b._render(b)});this.addHandler(this.hScrollBar,"valueChanged",function(c){b._render(b)});this.addHandler(this.host,"mousewheel",function(c){b.wheel(c,b)});this.addHandler(this.wrapper,"scroll",function(c){if(b.wrapper[0].scrollTop!=0){b.wrapper[0].scrollTop=0}if(b.wrapper[0].scrollLeft!=0){b.wrapper[0].scrollLeft=0}});this.addHandler(this.host,"mouseleave",function(c){b.focused=false});this.addHandler(this.host,"focus",function(c){b.focused=true});this.addHandler(this.host,"blur",function(c){b.focused=false});this.addHandler(this.host,"mouseenter",function(c){b.focused=true});a.jqx.utilities.resize(this.host,function(){if(a.jqx.isHidden(b.host)){return}b._arrange(false)})},resize:function(c,b){this.width=c;this.height=b;this._arrange(false)},_removeHandlers:function(){var b=this;this.removeHandler(this.vScrollBar,"valueChanged");this.removeHandler(this.hScrollBar,"valueChanged");this.removeHandler(this.host,"mousewheel");this.removeHandler(this.host,"mouseleave");this.removeHandler(this.host,"focus");this.removeHandler(this.host,"blur");this.removeHandler(this.host,"mouseenter");this.removeHandler(this.wrapper,"scroll");this.removeHandler(a(window),"resize."+this.element.id)},wheel:function(d,c){var e=0;if(d.originalEvent&&a.jqx.browser.msie&&d.originalEvent.wheelDelta){e=d.originalEvent.wheelDelta/120}if(!d){d=window.event}if(d.wheelDelta){e=d.wheelDelta/120}else{if(d.detail){e=-d.detail/3}}if(e){var b=c._handleDelta(e);if(!b){if(d.preventDefault){d.preventDefault()}}if(!b){return b}else{return false}}if(d.preventDefault){d.preventDefault()}d.returnValue=false},scrollDown:function(){if(this.vScrollBar.css("visibility")=="hidden"){return false}var b=this.vScrollInstance;if(b.value+b.largestep<=b.max){b.setPosition(b.value+b.largestep);return true}else{if(b.value+b.largestep!=b.max){b.setPosition(b.max);return true}}return false},scrollUp:function(){if(this.vScrollBar.css("visibility")=="hidden"){return false}var b=this.vScrollInstance;if(b.value-b.largestep>=b.min){b.setPosition(b.value-b.largestep);return true}else{if(b.value-b.largestep!=b.min){b.setPosition(b.min);return true}}return false},_handleDelta:function(d){if(this.focused){var c=this.vScrollInstance.value;if(d<0){this.scrollDown()}else{this.scrollUp()}var b=this.vScrollInstance.value;if(c!=b){return false}}return true},_render:function(c){if(c==undefined){c=this}var b=c.vScrollInstance.value;var d=c.hScrollInstance.value;if(this.rtl){if(this.hScrollBar[0].style.visibility!="hidden"){if(this._rtl==false){d=c.hScrollInstance.max-d}else{d=-c.hScrollInstance.value}}}c.content.css({left:-d+"px",top:-b+"px"})},scrollTo:function(c,b){if(c==undefined||b==undefined){return}this.vScrollInstance.setPosition(b);this.hScrollInstance.setPosition(c)},getScrollHeight:function(){return this.vScrollInstance.max},getVScrollPosition:function(){return this.vScrollInstance.value},getScrollWidth:function(){return this.hScrollInstance.max},getHScrollPosition:function(){return this.hScrollInstance.value},_getScrollSize:function(){var b=this.scrollBarSize;if(isNaN(b)){b=parseInt(b);if(isNaN(b)){b="17px"}else{b=b+"px"}}if(this.isTouchDevice()){b=a.jqx.utilities.touchScrollBarSize}b=parseInt(b);return b},_getScrollArea:function(){var c=0;this.content.css("margin-right","0px");this.content.css("max-width","9999999px");if(a.jqx.browser.msie&&a.jqx.browser.version<10){c=parseInt(this.content.css("left"));this.content.css("left",0)}this.content.css("overflow","auto");if(this.rtl){this.content.css("direction","rtl")}var b=parseInt(this.content[0].scrollWidth);a.each(this.content.children(),function(){b=Math.max(b,this.scrollWidth);b=Math.max(b,a(this).outerWidth())});if(a.jqx.browser.msie&&a.jqx.browser.version<10){this.content.css("left",c)}var d=parseInt(this.content[0].scrollHeight);this.content.css("overflow","visible");if(a.jqx.browser.msie&&a.jqx.browser.version<9){var d=parseInt(this.content[0].scrollHeight);switch(this.sizeMode){case"wrap":var d=parseInt(this.content[0].scrollHeight);var b=parseInt(this.content[0].scrollWidth);break;case"horizontalWrap":case"horizontalwrap":break;case"verticalWrap":case"verticalwrap":var d=parseInt(this.content[0].scrollHeight);break}}if(this.rtl){this.content.css("direction","ltr")}return{width:b,height:d}},_arrange:function(h){if(h!==false){if(this.width!=null){this.host.width(this.width)}if(this.height!=null){this.host.height(this.height)}}var b=this._getScrollSize();var d=this.host.width();var l=this.host.height();var e=this._getScrollArea();var c=e.width;var k=e.height;var i=k-parseInt(Math.round(this.host.height()));var g=c-parseInt(Math.round(this.host.width()));if(this.horizontalScrollBarMax!=undefined){g=this.horizontalScrollBarMax}if(this.verticalScrollBarMax!=undefined){i=this.verticalScrollBarMax}var j=function(o,p){var n=5;if(p>n){o.vScrollBar.jqxScrollBar({max:p});o.vScrollBar.css("visibility","inherit")}else{o.vScrollBar.jqxScrollBar("setPosition",0);o.vScrollBar.css("visibility","hidden")}};var m=function(o,n){if(n>0){if(a.jqx.browser.msie&&a.jqx.browser.version<8){if(n-10<=b){o.hScrollBar.css("visibility","hidden");o.hScrollBar.jqxScrollBar("setPosition",0)}else{o.hScrollBar.jqxScrollBar({max:n+4});o.hScrollBar.css("visibility","inherit")}}else{o.hScrollBar.jqxScrollBar({max:n+4});o.hScrollBar.css("visibility","inherit")}}else{o.hScrollBar.css("visibility","hidden");o.hScrollBar.jqxScrollBar("setPosition",0)}};switch(this.sizeMode){case"wrap":this.host.width(c);this.host.height(k);this.vScrollBar.css("visibility","hidden");this.hScrollBar.css("visibility","hidden");return;case"horizontalWrap":case"horizontalwrap":this.host.width(c);this.hScrollBar.css("visibility","hidden");j(this,i);this._arrangeScrollbars(b,c,l);return;case"verticalWrap":case"verticalwrap":this.host.height(k);this.vScrollBar.css("visibility","hidden");m(this,g);this._arrangeScrollbars(b,d,l);return}j(this,i);var f=2;if(this.vScrollBar.css("visibility")!="hidden"){if(this.horizontalScrollBarMax==undefined){if((!this.isTouchDevice()&&g>0)||(g>0)){g+=b+f}}}m(this,g);if(this.hScrollBar.css("visibility")!="hidden"){this.vScrollBar.jqxScrollBar({max:i+b+f})}this._arrangeScrollbars(b,d,l)},_arrangeScrollbars:function(b,d,j){var i=this.vScrollBar[0].style.visibility!="hidden";var f=this.hScrollBar[0].style.visibility!="hidden";var h=2;var g=2;this.hScrollBar.height(b);this.hScrollBar.css({top:j-b-h-g+"px",left:"0px"});this.hScrollBar.width(d-h+"px");this.vScrollBar.width(b);this.vScrollBar.height(parseInt(j)-h+"px");this.vScrollBar.css({left:parseInt(d)-parseInt(b)-h-g+"px",top:"0px"});if(this.rtl){this.vScrollBar.css({left:"0px"});var c=i?parseInt(b)+"px":0;if(this.content.children().css("direction")!="rtl"){var e=false;if(a.jqx.browser.msie&&a.jqx.browser.version<8){e=true}if(!e){this.content.css("padding-left",c)}}}else{if(this.vScrollBar.css("visibility")!="hidden"){this.content.css("max-width",this.host.width()-this.vScrollBar.outerWidth())}}if((this.vScrollBar.css("visibility")!="hidden")&&(this.hScrollBar.css("visibility")!="hidden")){this.bottomRight.css("visibility","inherit");this.bottomRight.css({left:1+parseInt(this.vScrollBar.css("left")),top:1+parseInt(this.hScrollBar.css("top"))});this.bottomRight.width(parseInt(b)+3);this.bottomRight.height(parseInt(b)+3);if(this.rtl){this.bottomRight.css({left:"0px"});this.hScrollBar.css({left:b+g+"px"})}this.hScrollBar.width(d-(1*b)-h-g+"px");this.vScrollBar.height(parseInt(j)-h-b-g+"px")}else{this.bottomRight.css("visibility","hidden")}this.hScrollInstance.refresh();this.vScrollInstance.refresh()},destroy:function(){clearInterval(this.autoUpdateId);this.autoUpdateId=null;this.autoUpdate=false;a.jqx.utilities.resize(this.host,null,true);this._removeHandlers();this.removeHandler(a(window),"unload");this.vScrollBar.jqxScrollBar("destroy");this.hScrollBar.jqxScrollBar("destroy");this.host.remove()},_raiseevent:function(g,d,f){if(this.isInitialized!=undefined&&this.isInitialized==true){var c=this.events[g];var e=new a.Event(c);e.previousValue=d;e.currentValue=f;e.owner=this;var b=this.host.trigger(e);return b}},beginUpdateLayout:function(){this.updating=true},resumeUpdateLayout:function(){this.updating=false;this.vScrollInstance.value=0;this.hScrollInstance.value=0;this._arrange();this._render()},propertyChangedHandler:function(c,d,b,e){if(!c.isInitialized){return}if(d=="rtl"){this.vScrollBar.jqxScrollBar({rtl:e});this.hScrollBar.jqxScrollBar({rtl:e});c._arrange()}if(!c.updating){if(d=="scrollBarSize"||d=="width"||d=="height"){if(b!=e){c._arrange()}}}if(d=="touchMode"){if(e!="auto"){c._updateTouchScrolling()}}if(d=="theme"){c.host.removeClass();c.host.addClass(this.toThemeProperty("jqx-panel"));c.host.addClass(this.toThemeProperty("jqx-widget"));c.host.addClass(this.toThemeProperty("jqx-widget-content"));c.host.addClass(this.toThemeProperty("jqx-rc-all"));c.vScrollBar.jqxScrollBar({theme:this.theme});c.hScrollBar.jqxScrollBar({theme:this.theme});c.bottomRight.removeClass();c.bottomRight.addClass(this.toThemeProperty("jqx-panel-bottomright"));c.bottomRight.addClass(this.toThemeProperty("jqx-scrollbar-state-normal"));c.content.removeClass();c.content.addClass(this.toThemeProperty("jqx-widget-content"))}},invalidate:function(){if(a.jqx.isHidden(this.host)){return}this.refresh()},refresh:function(b){this._arrange()}})})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.jqxWidget("jqxScrollBar","",{});a.extend(a.jqx._jqxScrollBar.prototype,{defineInstance:function(){var b={height:null,width:null,vertical:false,min:0,max:1000,value:0,step:10,largestep:50,thumbMinSize:10,thumbSize:0,thumbStep:"auto",roundedCorners:"all",showButtons:true,disabled:false,touchMode:"auto",touchModeStyle:"auto",thumbTouchSize:0,_triggervaluechanged:true,rtl:false,areaDownCapture:false,areaUpCapture:false,_initialLayout:false,offset:0,reference:0,velocity:0,frame:0,timestamp:0,ticker:null,amplitude:0,target:0};if(this===a.jqx._jqxScrollBar.prototype){return b}a.extend(true,this,b);return b},createInstance:function(b){this.render()},render:function(){this._mouseup=new Date();var c=this;var d="<div id='jqxScrollOuterWrap' style='box-sizing: content-box; width:100%; height: 100%; align:left; border: 0px; valign:top; position: relative;'><div id='jqxScrollWrap' style='box-sizing: content-box; width:100%; height: 100%; left: 0px; top: 0px; align:left; valign:top; position: absolute;'><div id='jqxScrollBtnUp' style='box-sizing: content-box; align:left; valign:top; left: 0px; top: 0px; position: absolute;'><div></div></div><div id='jqxScrollAreaUp' style='box-sizing: content-box; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div><div id='jqxScrollThumb' style='box-sizing: content-box; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div><div id='jqxScrollAreaDown' style='box-sizing: content-box; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div><div id='jqxScrollBtnDown' style='box-sizing: content-box; align:left; valign:top; left: 0px; top: 0px; position: absolute;'><div></div></div></div></div>";if(a.jqx.utilities&&a.jqx.utilities.scrollBarButtonsVisibility=="hidden"){this.showButtons=false}if(c.WinJS){MSApp.execUnsafeLocalFunction(function(){c.host.html(d)})}else{this.element.innerHTML=d}if(this.width!=undefined&&parseInt(this.width)>0){this.host.width(parseInt(this.width))}if(this.height!=undefined&&parseInt(this.height)>0){this.host.height(parseInt(this.height))}this.isPercentage=false;if(this.width!=null&&this.width.toString().indexOf("%")!=-1){this.host.width(this.width);this.isPercentage=true}if(this.height!=null&&this.height.toString().indexOf("%")!=-1){this.host.height(this.height);this.isPercentage=true}if(this.isPercentage){var e=this;a.jqx.utilities.resize(this.host,function(){e._arrange()},false)}this.thumbCapture=false;this.scrollOuterWrap=a(this.element.firstChild);this.scrollWrap=a(this.scrollOuterWrap[0].firstChild);this.btnUp=a(this.scrollWrap[0].firstChild);this.areaUp=a(this.btnUp[0].nextSibling);this.btnThumb=a(this.areaUp[0].nextSibling);this.arrowUp=a(this.btnUp[0].firstChild);this.areaDown=a(this.btnThumb[0].nextSibling);this.btnDown=a(this.areaDown[0].nextSibling);this.arrowDown=a(this.btnDown[0].firstChild);var b=this.element.id;this.btnUp[0].id="jqxScrollBtnUp"+b;this.btnDown[0].id="jqxScrollBtnDown"+b;this.btnThumb[0].id="jqxScrollThumb"+b;this.areaUp[0].id="jqxScrollAreaUp"+b;this.areaDown[0].id="jqxScrollAreaDown"+b;this.scrollWrap[0].id="jqxScrollWrap"+b;this.scrollOuterWrap[0].id="jqxScrollOuterWrap"+b;if(!this.host.jqxRepeatButton){throw new Error("jqxScrollBar: Missing reference to jqxbuttons.js.");return}this.btnUp.jqxRepeatButton({_ariaDisabled:true,overrideTheme:true,disabled:this.disabled});this.btnDown.jqxRepeatButton({_ariaDisabled:true,overrideTheme:true,disabled:this.disabled});this.btnDownInstance=a.data(this.btnDown[0],"jqxRepeatButton").instance;this.btnUpInstance=a.data(this.btnUp[0],"jqxRepeatButton").instance;this.areaUp.jqxRepeatButton({_scrollAreaButton:true,_ariaDisabled:true,overrideTheme:true});this.areaDown.jqxRepeatButton({_scrollAreaButton:true,_ariaDisabled:true,overrideTheme:true});this.btnThumb.jqxButton({_ariaDisabled:true,overrideTheme:true,disabled:this.disabled});this.propertyChangeMap.value=function(f,h,g,i){if(!(isNaN(i))){if(g!=i){f.setPosition(parseFloat(i),true)}}};this.propertyChangeMap.width=function(f,h,g,i){if(f.width!=undefined&&parseInt(f.width)>0){f.host.width(parseInt(f.width));f._arrange()}};this.propertyChangeMap.height=function(f,h,g,i){if(f.height!=undefined&&parseInt(f.height)>0){f.host.height(parseInt(f.height));f._arrange()}};this.propertyChangeMap.theme=function(f,h,g,i){f.setTheme()};this.propertyChangeMap.max=function(f,h,g,i){if(!(isNaN(i))){if(g!=i){f.max=parseInt(i);if(f.min>f.max){f.max=f.min+1}f._arrange();f.setPosition(f.value)}}};this.propertyChangeMap.min=function(f,h,g,i){if(!(isNaN(i))){if(g!=i){f.min=parseInt(i);if(f.min>f.max){f.max=f.min+1}f._arrange();f.setPosition(f.value)}}};this.propertyChangeMap.disabled=function(f,h,g,i){if(g!=i){if(i){f.host.addClass(f.toThemeProperty("jqx-fill-state-disabled"))}else{f.host.removeClass(f.toThemeProperty("jqx-fill-state-disabled"))}f.btnUp.jqxRepeatButton("disabled",f.disabled);f.btnDown.jqxRepeatButton("disabled",f.disabled);f.btnThumb.jqxButton("disabled",f.disabled)}};this.propertyChangeMap.touchMode=function(f,h,g,i){if(g!=i){f._updateTouchBehavior();if(i===true){f.showButtons=false;f.refresh()}else{if(i===false){f.showButtons=true;f.refresh()}}}};this.propertyChangeMap.rtl=function(f,h,g,i){if(g!=i){f.refresh()}};this.buttonUpCapture=false;this.buttonDownCapture=false;this._updateTouchBehavior();this.setPosition(this.value);this._addHandlers();this.setTheme()},resize:function(c,b){this.width=c;this.height=b;this._arrange()},_updateTouchBehavior:function(){this.isTouchDevice=a.jqx.mobile.isTouchDevice();if(this.touchMode==true){if(a.jqx.browser.msie&&a.jqx.browser.version<9){this.setTheme();return}this.isTouchDevice=true;a.jqx.mobile.setMobileSimulator(this.btnThumb[0]);this._removeHandlers();this._addHandlers();this.setTheme()}else{if(this.touchMode==false){this.isTouchDevice=false}}},_addHandlers:function(){var j=this;var e=false;try{if(("ontouchstart" in window)||window.DocumentTouch&&document instanceof DocumentTouch){e=true;this._touchSupport=true}}catch(f){}if(j.isTouchDevice||e){this.addHandler(this.btnThumb,a.jqx.mobile.getTouchEventName("touchend"),function(k){var l=j.vertical?j.toThemeProperty("jqx-scrollbar-thumb-state-pressed"):j.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal");var m=j.toThemeProperty("jqx-fill-state-pressed");j.btnThumb.removeClass(l);j.btnThumb.removeClass(m);if(!j.disabled){j.handlemouseup(j,k)}return false});this.addHandler(this.btnThumb,a.jqx.mobile.getTouchEventName("touchstart"),function(k){if(!j.disabled){if(j.touchMode==true){k.clientX=k.originalEvent.clientX;k.clientY=k.originalEvent.clientY}else{var l=k;if(l.originalEvent.touches&&l.originalEvent.touches.length){k.clientX=l.originalEvent.touches[0].clientX;k.clientY=l.originalEvent.touches[0].clientY}else{k.clientX=k.originalEvent.clientX;k.clientY=k.originalEvent.clientY}}j.handlemousedown(k);if(k.preventDefault){k.preventDefault()}}});a.jqx.mobile.touchScroll(this.element,j.max,function(q,p,l,k,m){if(j.host.css("visibility")=="visible"){if(j.touchMode==true){m.clientX=m.originalEvent.clientX;m.clientY=m.originalEvent.clientY}else{var o=m;if(o.originalEvent.touches&&o.originalEvent.touches.length){m.clientX=o.originalEvent.touches[0].clientX;m.clientY=o.originalEvent.touches[0].clientY}else{m.clientX=m.originalEvent.clientX;m.clientY=m.originalEvent.clientY}}var n=j.vertical?j.toThemeProperty("jqx-scrollbar-thumb-state-pressed"):j.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal");j.btnThumb.addClass(n);j.btnThumb.addClass(j.toThemeProperty("jqx-fill-state-pressed"));j.thumbCapture=true;j.handlemousemove(m)}},j.element.id,j.host,j.host)}if(!this.isTouchDevice){try{if(document.referrer!=""||window.frameElement){if(window.top!=null&&window.top!=window.self){var b=null;if(window.parent&&document.referrer){b=document.referrer}if(b&&b.indexOf(document.location.host)!=-1){var g=function(k){if(!j.disabled){j.handlemouseup(j,k)}};if(window.top.document.addEventListener){window.top.document.addEventListener("mouseup",g,false)}else{if(window.top.document.attachEvent){window.top.document.attachEvent("onmouseup",g)}}}}}}catch(i){}var c="click mouseup mousedown";this.addHandler(this.btnDown,c,function(l){var k=j.step;if(Math.abs(j.max-j.min)<=k){k=1}if(j.rtl&&!j.vertical){k=-j.step}switch(l.type){case"click":if(j.buttonDownCapture&&!j.isTouchDevice){if(!j.disabled){j.setPosition(j.value+k)}}else{if(!j.disabled&&j.isTouchDevice){j.setPosition(j.value+k)}}break;case"mouseup":if(!j.btnDownInstance.base.disabled&&j.buttonDownCapture){j.buttonDownCapture=false;j.btnDown.removeClass(j.toThemeProperty("jqx-scrollbar-button-state-pressed"));j.btnDown.removeClass(j.toThemeProperty("jqx-fill-state-pressed"));j._removeArrowClasses("pressed","down");j.handlemouseup(j,l);j.setPosition(j.value+k);return false}break;case"mousedown":if(!j.btnDownInstance.base.disabled){j.buttonDownCapture=true;j.btnDown.addClass(j.toThemeProperty("jqx-fill-state-pressed"));j.btnDown.addClass(j.toThemeProperty("jqx-scrollbar-button-state-pressed"));j._addArrowClasses("pressed","down");return false}break}});this.addHandler(this.btnUp,c,function(l){var k=j.step;if(Math.abs(j.max-j.min)<=k){k=1}if(j.rtl&&!j.vertical){k=-j.step}switch(l.type){case"click":if(j.buttonUpCapture&&!j.isTouchDevice){if(!j.disabled){j.setPosition(j.value-k)}}else{if(!j.disabled&&j.isTouchDevice){j.setPosition(j.value-k)}}break;case"mouseup":if(!j.btnUpInstance.base.disabled&&j.buttonUpCapture){j.buttonUpCapture=false;j.btnUp.removeClass(j.toThemeProperty("jqx-scrollbar-button-state-pressed"));j.btnUp.removeClass(j.toThemeProperty("jqx-fill-state-pressed"));j._removeArrowClasses("pressed","up");j.handlemouseup(j,l);j.setPosition(j.value-k);return false}break;case"mousedown":if(!j.btnUpInstance.base.disabled){j.buttonUpCapture=true;j.btnUp.addClass(j.toThemeProperty("jqx-fill-state-pressed"));j.btnUp.addClass(j.toThemeProperty("jqx-scrollbar-button-state-pressed"));j._addArrowClasses("pressed","up");return false}break}})}var h="click";if(this.isTouchDevice){h=a.jqx.mobile.getTouchEventName("touchend")}this.addHandler(this.areaUp,h,function(l){if(!j.disabled){var k=j.largestep;if(j.rtl&&!j.vertical){k=-j.largestep}j.setPosition(j.value-k);return false}});this.addHandler(this.areaDown,h,function(l){if(!j.disabled){var k=j.largestep;if(j.rtl&&!j.vertical){k=-j.largestep}j.setPosition(j.value+k);return false}});this.addHandler(this.areaUp,"mousedown",function(k){if(!j.disabled){j.areaUpCapture=true;return false}});this.addHandler(this.areaDown,"mousedown",function(k){if(!j.disabled){j.areaDownCapture=true;return false}});this.addHandler(this.btnThumb,"mousedown dragstart",function(k){if(k.type==="dragstart"){return false}if(!j.disabled){j.handlemousedown(k)}if(k.preventDefault){k.preventDefault()}});this.addHandler(a(document),"mouseup."+this.element.id,function(k){if(!j.disabled){j.handlemouseup(j,k)}});if(!this.isTouchDevice){this.mousemoveFunc=function(k){if(!j.disabled){j.handlemousemove(k)}};this.addHandler(a(document),"mousemove."+this.element.id,this.mousemoveFunc);this.addHandler(a(document),"mouseleave."+this.element.id,function(k){if(!j.disabled){j.handlemouseleave(k)}});this.addHandler(a(document),"mouseenter."+this.element.id,function(k){if(!j.disabled){j.handlemouseenter(k)}});if(!j.disabled){this.addHandler(this.btnUp,"mouseenter mouseleave",function(k){if(k.type==="mouseenter"){if(!j.disabled&&!j.btnUpInstance.base.disabled&&j.touchMode!=true){j.btnUp.addClass(j.toThemeProperty("jqx-scrollbar-button-state-hover"));j.btnUp.addClass(j.toThemeProperty("jqx-fill-state-hover"));j._addArrowClasses("hover","up")}}else{if(!j.disabled&&!j.btnUpInstance.base.disabled&&j.touchMode!=true){j.btnUp.removeClass(j.toThemeProperty("jqx-scrollbar-button-state-hover"));j.btnUp.removeClass(j.toThemeProperty("jqx-fill-state-hover"));j._removeArrowClasses("hover","up")}}});var d=j.toThemeProperty("jqx-scrollbar-thumb-state-hover");if(!j.vertical){d=j.toThemeProperty("jqx-scrollbar-thumb-state-hover-horizontal")}this.addHandler(this.btnThumb,"mouseenter mouseleave",function(k){if(k.type==="mouseenter"){if(!j.disabled&&j.touchMode!=true){j.btnThumb.addClass(d);j.btnThumb.addClass(j.toThemeProperty("jqx-fill-state-hover"))}}else{if(!j.disabled&&j.touchMode!=true){j.btnThumb.removeClass(d);j.btnThumb.removeClass(j.toThemeProperty("jqx-fill-state-hover"))}}});this.addHandler(this.btnDown,"mouseenter mouseleave",function(k){if(k.type==="mouseenter"){if(!j.disabled&&!j.btnDownInstance.base.disabled&&j.touchMode!=true){j.btnDown.addClass(j.toThemeProperty("jqx-scrollbar-button-state-hover"));j.btnDown.addClass(j.toThemeProperty("jqx-fill-state-hover"));j._addArrowClasses("hover","down")}}else{if(!j.disabled&&!j.btnDownInstance.base.disabled&&j.touchMode!=true){j.btnDown.removeClass(j.toThemeProperty("jqx-scrollbar-button-state-hover"));j.btnDown.removeClass(j.toThemeProperty("jqx-fill-state-hover"));j._removeArrowClasses("hover","down")}}})}}},destroy:function(){var b=this.btnUp;var f=this.btnDown;var d=this.btnThumb;var c=this.scrollWrap;var h=this.areaUp;var e=this.areaDown;this.arrowUp.remove();delete this.arrowUp;this.arrowDown.remove();delete this.arrowDown;e.removeClass();h.removeClass();f.removeClass();b.removeClass();d.removeClass();b.jqxRepeatButton("destroy");f.jqxRepeatButton("destroy");h.jqxRepeatButton("destroy");e.jqxRepeatButton("destroy");d.jqxButton("destroy");var g=a.data(this.element,"jqxScrollBar");this._removeHandlers();this.btnUp=null;this.btnDown=null;this.scrollWrap=null;this.areaUp=null;this.areaDown=null;this.scrollOuterWrap=null;delete this.mousemoveFunc;delete this.btnDownInstance;delete this.btnUpInstance;delete this.scrollOuterWrap;delete this.scrollWrap;delete this.btnDown;delete this.areaDown;delete this.areaUp;delete this.btnDown;delete this.btnUp;delete this.btnThumb;delete this.propertyChangeMap.value;delete this.propertyChangeMap.min;delete this.propertyChangeMap.max;delete this.propertyChangeMap.touchMode;delete this.propertyChangeMap.disabled;delete this.propertyChangeMap.theme;delete this.propertyChangeMap;if(g){delete g.instance}this.host.removeData();this.host.remove();delete this.host;delete this.set;delete this.get;delete this.call;delete this.element},_removeHandlers:function(){this.removeHandler(this.btnUp,"mouseenter");this.removeHandler(this.btnDown,"mouseenter");this.removeHandler(this.btnThumb,"mouseenter");this.removeHandler(this.btnUp,"mouseleave");this.removeHandler(this.btnDown,"mouseleave");this.removeHandler(this.btnThumb,"mouseleave");this.removeHandler(this.btnUp,"click");this.removeHandler(this.btnDown,"click");this.removeHandler(this.btnDown,"mouseup");this.removeHandler(this.btnUp,"mouseup");this.removeHandler(this.btnDown,"mousedown");this.removeHandler(this.btnUp,"mousedown");this.removeHandler(this.areaUp,"mousedown");this.removeHandler(this.areaDown,"mousedown");this.removeHandler(this.areaUp,"click");this.removeHandler(this.areaDown,"click");this.removeHandler(this.btnThumb,"mousedown");this.removeHandler(this.btnThumb,"dragstart");this.removeHandler(a(document),"mouseup."+this.element.id);if(!this.mousemoveFunc){this.removeHandler(a(document),"mousemove."+this.element.id)}else{this.removeHandler(a(document),"mousemove."+this.element.id,this.mousemoveFunc)}this.removeHandler(a(document),"mouseleave."+this.element.id);this.removeHandler(a(document),"mouseenter."+this.element.id);var b=this},_addArrowClasses:function(c,b){if(c=="pressed"){c="selected"}if(c!=""){c="-"+c}if(this.vertical){if(b=="up"||b==undefined){this.arrowUp.addClass(this.toThemeProperty("jqx-icon-arrow-up"+c))}if(b=="down"||b==undefined){this.arrowDown.addClass(this.toThemeProperty("jqx-icon-arrow-down"+c))}}else{if(b=="up"||b==undefined){this.arrowUp.addClass(this.toThemeProperty("jqx-icon-arrow-left"+c))}if(b=="down"||b==undefined){this.arrowDown.addClass(this.toThemeProperty("jqx-icon-arrow-right"+c))}}},_removeArrowClasses:function(c,b){if(c=="pressed"){c="selected"}if(c!=""){c="-"+c}if(this.vertical){if(b=="up"||b==undefined){this.arrowUp.removeClass(this.toThemeProperty("jqx-icon-arrow-up"+c))}if(b=="down"||b==undefined){this.arrowDown.removeClass(this.toThemeProperty("jqx-icon-arrow-down"+c))}}else{if(b=="up"||b==undefined){this.arrowUp.removeClass(this.toThemeProperty("jqx-icon-arrow-left"+c))}if(b=="down"||b==undefined){this.arrowDown.removeClass(this.toThemeProperty("jqx-icon-arrow-right"+c))}}},setTheme:function(){var o=this.btnUp;var m=this.btnDown;var p=this.btnThumb;var e=this.scrollWrap;var g=this.areaUp;var h=this.areaDown;var f=this.arrowUp;var i=this.arrowDown;this.scrollWrap[0].className=this.toThemeProperty("jqx-reset");this.scrollOuterWrap[0].className=this.toThemeProperty("jqx-reset");var k=this.toThemeProperty("jqx-reset");this.areaDown[0].className=k;this.areaUp[0].className=k;var d=this.toThemeProperty("jqx-scrollbar")+" "+this.toThemeProperty("jqx-widget")+" "+this.toThemeProperty("jqx-widget-content");this.host.addClass(d);if(this.isTouchDevice){this.host.addClass(this.toThemeProperty("jqx-scrollbar-mobile"))}m[0].className=this.toThemeProperty("jqx-scrollbar-button-state-normal");o[0].className=this.toThemeProperty("jqx-scrollbar-button-state-normal");var q="";if(this.vertical){f[0].className=k+" "+this.toThemeProperty("jqx-icon-arrow-up");i[0].className=k+" "+this.toThemeProperty("jqx-icon-arrow-down");q=this.toThemeProperty("jqx-scrollbar-thumb-state-normal")}else{f[0].className=k+" "+this.toThemeProperty("jqx-icon-arrow-left");i[0].className=k+" "+this.toThemeProperty("jqx-icon-arrow-right");q=this.toThemeProperty("jqx-scrollbar-thumb-state-normal-horizontal")}q+=" "+this.toThemeProperty("jqx-fill-state-normal");p[0].className=q;if(this.disabled){e.addClass(this.toThemeProperty("jqx-fill-state-disabled"));e.removeClass(this.toThemeProperty("jqx-scrollbar-state-normal"))}else{e.addClass(this.toThemeProperty("jqx-scrollbar-state-normal"));e.removeClass(this.toThemeProperty("jqx-fill-state-disabled"))}if(this.roundedCorners=="all"){this.host.addClass(this.toThemeProperty("jqx-rc-all"));if(this.vertical){var j=a.jqx.cssroundedcorners("top");j=this.toThemeProperty(j);o.addClass(j);var c=a.jqx.cssroundedcorners("bottom");c=this.toThemeProperty(c);m.addClass(c)}else{var n=a.jqx.cssroundedcorners("left");n=this.toThemeProperty(n);o.addClass(n);var l=a.jqx.cssroundedcorners("right");l=this.toThemeProperty(l);m.addClass(l)}}else{var b=a.jqx.cssroundedcorners(this.roundedCorners);b=this.toThemeProperty(b);elBtnUp.addClass(b);elBtnDown.addClass(b)}var b=a.jqx.cssroundedcorners(this.roundedCorners);b=this.toThemeProperty(b);if(!p.hasClass(b)){p.addClass(b)}if(o.css("display")==="none"){this.showButtons=false;this.touchModeStyle=true;p.addClass(this.toThemeProperty("jqx-scrollbar-thumb-state-normal-touch"))}if(this.isTouchDevice&&this.touchModeStyle!=false){this.showButtons=false;p.addClass(this.toThemeProperty("jqx-scrollbar-thumb-state-normal-touch"))}},isScrolling:function(){if(this.thumbCapture==undefined||this.buttonDownCapture==undefined||this.buttonUpCapture==undefined||this.areaDownCapture==undefined||this.areaUpCapture==undefined){return false}return this.thumbCapture||this.buttonDownCapture||this.buttonUpCapture||this.areaDownCapture||this.areaUpCapture},track:function(){var d,b,e,c;d=Date.now();b=d-this.timestamp;this.timestamp=d;e=this.offset-this.frame;this.frame=this.offset;c=1000*e/(1+b);this.velocity=0.2*c+0.2*this.velocity},handlemousedown:function(e){if(this.thumbCapture==undefined||this.thumbCapture==false){this.thumbCapture=true;var c=this.btnThumb;if(c!=null){c.addClass(this.toThemeProperty("jqx-fill-state-pressed"));if(this.vertical){c.addClass(this.toThemeProperty("jqx-scrollbar-thumb-state-pressed"))}else{c.addClass(this.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal"))}}}var d=this;function b(f){d.reference=parseInt(d.btnThumb[0].style.top);d.offset=parseInt(d.btnThumb[0].style.top);if(!d.vertical){d.reference=parseInt(d.btnThumb[0].style.left);d.offset=parseInt(d.btnThumb[0].style.left)}d.velocity=d.amplitude=0;d.frame=d.offset;d.timestamp=Date.now();clearInterval(d.ticker);d.ticker=setInterval(function(){d.track()},100)}if(this.thumbCapture&&a.jqx.scrollAnimation){b(e)}this.dragStartX=e.clientX;this.dragStartY=e.clientY;this.dragStartValue=this.value},toggleHover:function(c,b){},refresh:function(){this._arrange()},_setElementPosition:function(c,b,d){if(!isNaN(b)){if(parseInt(c[0].style.left)!=parseInt(b)){c[0].style.left=b+"px"}}if(!isNaN(d)){if(parseInt(c[0].style.top)!=parseInt(d)){c[0].style.top=d+"px"}}},_setElementTopPosition:function(b,c){if(!isNaN(c)){b[0].style.top=c+"px"}},_setElementLeftPosition:function(c,b){if(!isNaN(b)){c[0].style.left=b+"px"}},handlemouseleave:function(e){var b=this.btnUp;var d=this.btnDown;if(this.buttonDownCapture||this.buttonUpCapture){b.removeClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));d.removeClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));this._removeArrowClasses("pressed")}if(this.thumbCapture!=true){return}var c=this.btnThumb;var f=this.vertical?this.toThemeProperty("jqx-scrollbar-thumb-state-pressed"):this.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal");c.removeClass(f);c.removeClass(this.toThemeProperty("jqx-fill-state-pressed"))},handlemouseenter:function(e){var b=this.btnUp;var d=this.btnDown;if(this.buttonUpCapture){b.addClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));b.addClass(this.toThemeProperty("jqx-fill-state-pressed"));this._addArrowClasses("pressed","up")}if(this.buttonDownCapture){d.addClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));d.addClass(this.toThemeProperty("jqx-fill-state-pressed"));this._addArrowClasses("pressed","down")}if(this.thumbCapture!=true){return}var c=this.btnThumb;if(this.vertical){c.addClass(this.toThemeProperty("jqx-scrollbar-thumb-state-pressed"))}else{c.addClass(this.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal"))}c.addClass(this.toThemeProperty("jqx-fill-state-pressed"))},handlemousemove:function(b){var i=this.btnUp;var e=this.btnDown;var d=0;if(e==null||i==null){return}if(i!=null&&e!=null&&this.buttonDownCapture!=undefined&&this.buttonUpCapture!=undefined){if(this.buttonDownCapture&&b.which==d){e.removeClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));e.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));this._removeArrowClasses("pressed","down");this.buttonDownCapture=false}else{if(this.buttonUpCapture&&b.which==d){i.removeClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));i.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));this._removeArrowClasses("pressed","up");this.buttonUpCapture=false}}}if(this.thumbCapture!=true){return false}var k=this.btnThumb;if(b.which==d&&!this.isTouchDevice&&!this._touchSupport){this.thumbCapture=false;this._arrange();var j=this.vertical?this.toThemeProperty("jqx-scrollbar-thumb-state-pressed"):this.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal");k.removeClass(j);k.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));return true}if(b.preventDefault!=undefined){b.preventDefault()}if(b.originalEvent!=null){b.originalEvent.mouseHandled=true}if(b.stopPropagation!=undefined){b.stopPropagation()}var l=0;try{if(!this.vertical){l=b.clientX-this.dragStartX}else{l=b.clientY-this.dragStartY}var f=this._btnAndThumbSize;if(!this._btnAndThumbSize){f=(this.vertical)?i.height()+e.height()+k.height():i.width()+e.width()+k.width()}var g=(this.max-this.min)/(this.scrollBarSize-f);if(this.thumbStep=="auto"){l*=g}else{l*=g;if(Math.abs(this.dragStartValue+l-this.value)>=parseInt(this.thumbStep)){var c=Math.round(parseInt(l)/this.thumbStep)*this.thumbStep;if(this.rtl&&!this.vertical){this.setPosition(this.dragStartValue-c)}else{this.setPosition(this.dragStartValue+c)}return false}else{return false}}var c=l;if(this.rtl&&!this.vertical){c=-l}this.setPosition(this.dragStartValue+c);this.offset=parseInt(k[0].style.left);if(this.vertical){this.offset=parseInt(k[0].style.top)}}catch(h){alert(h)}return false},handlemouseup:function(j,b){var g=false;if(this.thumbCapture){this.thumbCapture=false;var i=this.btnThumb;var h=this.vertical?this.toThemeProperty("jqx-scrollbar-thumb-state-pressed"):this.toThemeProperty("jqx-scrollbar-thumb-state-pressed-horizontal");i.removeClass(h);i.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));g=true;this._mouseup=new Date();if(a.jqx.scrollAnimation){var d=this;function f(){var k,o;if(d.amplitude){k=Date.now()-d.timestamp;o=-d.amplitude*Math.exp(-k/325);if(o>0.5||o<-0.5){var l=(d.max-d.min)/(d.scrollBarSize-d._btnAndThumbSize);var n=l*(d.target+o);var m=n;if(d.rtl&&!d.vertical){m=-n}d.setPosition(d.dragStartValue+m);requestAnimationFrame(f)}else{var l=(d.max-d.min)/(d.scrollBarSize-d._btnAndThumbSize);var n=l*(d.target+o);var m=n;if(d.rtl&&!d.vertical){m=-n}d.setPosition(d.dragStartValue+m)}}}clearInterval(this.ticker);if(this.velocity>25||this.velocity<-25){this.amplitude=0.8*this.velocity;this.target=Math.round(this.offset+this.amplitude);if(!this.vertical){this.target-=this.reference}else{this.target-=this.reference}this.timestamp=Date.now();requestAnimationFrame(f)}}}this.areaDownCapture=this.areaUpCapture=false;if(this.buttonUpCapture||this.buttonDownCapture){var e=this.btnUp;var c=this.btnDown;this.buttonUpCapture=false;this.buttonDownCapture=false;e.removeClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));c.removeClass(this.toThemeProperty("jqx-scrollbar-button-state-pressed"));e.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));c.removeClass(this.toThemeProperty("jqx-fill-state-pressed"));this._removeArrowClasses("pressed");g=true;this._mouseup=new Date()}if(g){if(b.preventDefault!=undefined){b.preventDefault()}if(b.originalEvent!=null){b.originalEvent.mouseHandled=true}if(b.stopPropagation!=undefined){b.stopPropagation()}}},setPosition:function(b,g){var d=this.element;if(b==undefined||b==NaN){b=this.min}if(b>=this.max){b=this.max}if(b<this.min){b=this.min}if(this.value!==b||g==true){if(b==this.max){var c=new a.Event("complete");this.host.trigger(c)}var f=this.value;if(this._triggervaluechanged){var e=new a.Event("valueChanged");e.previousValue=this.value;e.currentValue=b}this.value=b;this._positionelements();if(this._triggervaluechanged){this.host.trigger(e)}if(this.valueChanged){this.valueChanged({currentValue:this.value,previousvalue:f})}}return b},val:function(b){var c=function(e){for(var d in e){if(e.hasOwnProperty(d)){return false}}if(typeof b=="number"){return false}if(typeof b=="date"){return false}if(typeof b=="boolean"){return false}if(typeof b=="string"){return false}return true};if(c(b)||arguments.length==0){return this.value}else{this.setPosition(b);return b}},_getThumbSize:function(c){var b=this.max-this.min;var d=0;if(b>1){d=(c/(b+c)*c)}else{if(b==1){d=c-1}else{if(b==0){d=c}}}if(this.thumbSize>0){d=this.thumbSize}if(d<this.thumbMinSize){d=this.thumbMinSize}return Math.min(d,c)},_positionelements:function(){var g=this.element;var n=this.areaUp;var e=this.areaDown;var h=this.btnUp;var f=this.btnDown;var o=this.btnThumb;var b=this.scrollWrap;var p=this._height?this._height:this.host.height();var c=this._width?this._width:this.host.width();var l=(!this.vertical)?p:c;if(!this.showButtons){l=0}var m=(!this.vertical)?c:p;this.scrollBarSize=m;var d=this._getThumbSize(m-2*l);d=Math.floor(d);if(d<this.thumbMinSize){d=this.thumbMinSize}if(p==NaN||p<10){p=10}if(c==NaN||c<10){c=10}l+=2;this.btnSize=l;var i=this._btnAndThumbSize;if(!this._btnAndThumbSize){var i=(this.vertical)?2*this.btnSize+o.outerHeight():2*this.btnSize+o.outerWidth();i=Math.round(i)}var k=(m-i)/(this.max-this.min)*(this.value-this.min);if(this.rtl&&!this.vertical){k=(m-i)/(this.max-this.min)*(this.max-this.value-this.min)}k=Math.round(k);if(k<0){k=0}if(this.vertical){var j=m-k-i;if(j<0){j=0}e[0].style.height=j+"px";n[0].style.height=k+"px";this._setElementTopPosition(n,l);this._setElementTopPosition(o,l+k);this._setElementTopPosition(e,l+k+d)}else{n[0].style.width=k+"px";if(m-k-i>=0){e[0].style.width=m-k-i+"px"}else{e[0].style.width="0px"}this._setElementLeftPosition(n,l);this._setElementLeftPosition(o,l+k);this._setElementLeftPosition(e,2+l+k+d)}},_arrange:function(){var m=this;if(m._initialLayout){m._initialLayout=false;return}if(m.min>m.max){var x=m.min;m.min=m.max;m.max=x}if(m.min<0){var k=m.max-m.min;m.min=0;m.max=k}var d=m.element;var g=m.areaUp;var t=m.areaDown;var c=m.btnUp;var l=m.btnDown;var u=m.btnThumb;var p=m.scrollWrap;var n=parseInt(m.element.style.height);var q=parseInt(m.element.style.width);if(m.isPercentage){var n=m.host.height();var q=m.host.width()}if(isNaN(n)){n=0}if(isNaN(q)){q=0}m._width=q;m._height=n;var b=(!m.vertical)?n:q;if(!m.showButtons){b=0}c[0].style.width=b+"px";c[0].style.height=b+"px";l[0].style.width=b+"px";l[0].style.height=b+"px";if(m.vertical){p[0].style.width=q+2+"px"}else{p[0].style.height=n+2+"px"}m._setElementPosition(c,0,0);var s=b+2;if(m.vertical){m._setElementPosition(l,0,n-s)}else{m._setElementPosition(l,q-s,0)}var f=(!m.vertical)?q:n;m.scrollBarSize=f;var h=m._getThumbSize(f-2*s);h=Math.floor(h-2);if(h<m.thumbMinSize){h=m.thumbMinSize}var o=false;if(m.isTouchDevice&&m.touchModeStyle!=false){o=true}if(!m.vertical){u[0].style.width=h+"px";u[0].style.height=n+"px";if(o&&m.thumbTouchSize!==0){u.css({height:m.thumbTouchSize+"px"});u.css("margin-top",(m.host.height()-m.thumbTouchSize)/2)}}else{u[0].style.width=q+"px";u[0].style.height=h+"px";if(o&&m.thumbTouchSize!==0){u.css({width:m.thumbTouchSize+"px"});u.css("margin-left",(m.host.width()-m.thumbTouchSize)/2)}}if(n==NaN||n<10){n=10}if(q==NaN||q<10){q=10}m.btnSize=b;var e=(m.vertical)?2*s+(2+parseInt(u[0].style.height)):2*s+(2+parseInt(u[0].style.width));e=Math.round(e);m._btnAndThumbSize=e;var w=(f-e)/(m.max-m.min)*(m.value-m.min);if(m.rtl&&!m.vertical){w=(f-e)/(m.max-m.min)*(m.max-m.value-m.min)}w=Math.round(w);if(isNaN(w)||w<0||w===-Infinity||w===Infinity){w=0}if(m.vertical){var v=(f-w-e);if(v<0){v=0}t[0].style.height=v+"px";t[0].style.width=q+"px";g[0].style.height=w+"px";g[0].style.width=q+"px";var i=parseInt(m.element.style.height);if(m.isPercentage){i=m.host.height()}u[0].style.visibility="inherit";if(i-3*parseInt(b)<0||i<e){u[0].style.visibility="hidden"}m._setElementPosition(g,0,s);m._setElementPosition(u,0,s+w);m._setElementPosition(t,0,s+w+h)}else{if(w>0){g[0].style.width=w+"px"}if(n>0){g[0].style.height=n+"px"}var j=(f-w-e);if(j<0){j=0}t[0].style.width=j+"px";t[0].style.height=n+"px";var r=parseInt(m.element.style.width);if(m.isPercentage){r=m.host.width()}u[0].style.visibility="inherit";if((r-3*parseInt(b)<0)||(r<e)){u[0].style.visibility="hidden"}m._setElementPosition(g,s,0);m._setElementPosition(u,s+w,0);m._setElementPosition(t,s+w+h,0)}}})})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.jqxWidget("jqxTree","",{});a.extend(a.jqx._jqxTree.prototype,{defineInstance:function(){var b={items:new Array(),width:null,height:null,easing:"easeInOutCirc",animationShowDuration:"fast",animationHideDuration:"fast",treeElements:new Array(),disabled:false,itemsMember:"",displayMember:"",valueMember:"",enableHover:true,keyboardNavigation:true,enableKeyboardNavigation:true,toggleMode:"dblclick",source:null,checkboxes:false,checkSize:16,toggleIndicatorSize:18,hasThreeStates:false,selectedItem:null,touchMode:"auto",allowDrag:true,allowDrop:true,searchMode:"startswithignorecase",incrementalSearch:true,incrementalSearchDelay:700,animationHideDelay:0,submitCheckedItems:false,dragStart:null,dragEnd:null,rtl:false,dropAction:"default",events:["expand","collapse","select","initialized","added","removed","checkChange","dragEnd","dragStart","itemClick"],aria:{"aria-activedescendant":{name:"getActiveDescendant",type:"string"},"aria-disabled":{name:"disabled",type:"boolean"}}};if(this===a.jqx._jqxTree.prototype){return b}a.extend(true,this,b);return b},createInstance:function(c){var b=this;this.host.attr("role","tree");this.host.attr("data-role","treeview");this.enableKeyboardNavigation=this.keyboardNavigation;this.propertyChangeMap.disabled=function(f,h,g,j){if(b.disabled){b.host.addClass(b.toThemeProperty("jqx-tree-disabled"))}else{b.host.removeClass(b.toThemeProperty("jqx-tree-disabled"))}a.jqx.aria(b,"aria-disabled",j)};if(this.width!=null&&this.width.toString().indexOf("px")!=-1){this.host.width(this.width)}else{if(this.width!=undefined&&!isNaN(this.width)){this.host.width(this.width)}}if(this.height!=null&&this.height.toString().indexOf("px")!=-1){this.host.height(this.height)}else{if(this.height!=undefined&&!isNaN(this.height)){this.host.height(this.height)}}if(this.width!=null&&this.width.toString().indexOf("%")!=-1){this.host.width(this.width)}if(this.height!=null&&this.height.toString().indexOf("%")!=-1){this.host.height(this.height)}if(!this.host.attr("tabindex")){this.host.attr("tabIndex",1)}if(this.disabled){this.host.addClass(this.toThemeProperty("jqx-tree-disabled"));a.jqx.aria(this,"aria-disabled",true)}if(this.host.jqxDragDrop){jqxTreeDragDrop()}this.originalInnerHTML=this.element.innerHTML;this.createdTree=false;if(this.element.innerHTML.indexOf("UL")){var e=this.host.find("ul:first");if(e.length>0){this.createTree(e[0]);this.createdTree=true}}if(this.source!=null){var d=this.loadItems(this.source);this.element.innerHTML=d;var e=this.host.find("ul:first");if(e.length>0){this.createTree(e[0]);this.createdTree=true}}this._itemslength=this.items.length;if(!this.createdTree){if(this.host.find("ul").length==0){this.host.append(a("<ul></ul>"));var e=this.host.find("ul:first");if(e.length>0){this.createTree(e[0]);this.createdTree=true}this.createdTree=true}}if(this.createdTree==true){this._render();this._handleKeys()}this._updateCheckLayout()},checkItems:function(f,h){var e=this;if(f!=null){var d=0;var g=false;var b=0;var j=a(f.element).find("li");b=j.length;a.each(j,function(k){var l=e.itemMapping["id"+this.id].item;if(l.checked!=false){if(l.checked==null){g=true}d++}});if(f!=h){if(d==b){this.checkItem(f.element,true,"tree")}else{if(d>0){this.checkItem(f.element,null,"tree")}else{this.checkItem(f.element,false,"tree")}}}else{var c=h.checked;var j=a(h.element).find("li");a.each(j,function(){var k=e.itemMapping["id"+this.id].item;e.checkItem(this,c,"tree")})}this.checkItems(this._parentItem(f),h)}else{var c=h.checked;var j=a(h.element).find("li");a.each(j,function(){var k=e.itemMapping["id"+this.id].item;e.checkItem(this,c,"tree")})}},_getMatches:function(e,f){if(e==undefined||e.length==0){return -1}var c=this.items;var b=new Array();for(var d=0;d<c.length;d++){if(this._isVisible(c[d])&&!c[d].disabled){b.push(c[d])}}c=b;if(f!=undefined){c=c.slice(f)}var g=new Array();a.each(c,function(j){var k=this.label;if(!k){k=""}var h=a.jqx.string.startsWithIgnoreCase(k.toString(),e);if(h){g.push({id:this.id,element:this.element})}});return g},_handleKeys:function(){var b=this;this.addHandler(this.host,"keydown",function(d){var s=d.keyCode;if(b.keyboardNavigation||b.enableKeyboardNavigation){if(b.selectedItem!=null){var l=b.selectedItem.element;if(b.incrementalSearch&&(!(s>=33&&s<=40))){var t=-1;if(!b._searchString){b._searchString=""}if((s==8||s==46)&&b._searchString.length>=1){b._searchString=b._searchString.substr(0,b._searchString.length-1)}var h=String.fromCharCode(s);var o=(!isNaN(parseInt(h)));var n=false;if((s>=65&&s<=97)||o||s==8||s==32||s==46){if(!d.shiftKey){h=h.toLocaleLowerCase()}if(s!=8&&s!=32&&s!=46){if(!(b._searchString.length>0&&b._searchString.substr(0,1)==h)){b._searchString+=h}}if(s==32){b._searchString+=" "}b._searchTime=new Date();var r=b.selectedItem;if(r){var g=r.id;var m=-1;for(var k=0;k<b.items.length;k++){if(b.items[k].id==g){m=k+1;break}}var f=b._getMatches(b._searchString,m);if(f.length==0||(f.length>0&&f[0].id==g)){var f=b._getMatches(b._searchString)}}else{var f=b._getMatches(b._searchString)}if(f.length>0){var r=b.selectedItem;if(b.selectedItem&&b.selectedItem.id!=f[0].id){b.clearSelection();b.selectItem(f[0].element,"keyboard")}b._lastSearchString=b._searchString}}if(b._searchTimer!=undefined){clearTimeout(b._searchTimer)}if(s==27||s==13){b._searchString="";b._lastSearchString=""}b._searchTimer=setTimeout(function(){b._searchString="";b._lastSearchString=""},500);if(t>=0){return}if(n){return false}}switch(s){case 32:if(b.checkboxes){b.fromKey=true;var q=a(b.selectedItem.checkBoxElement).jqxCheckBox("checked");b.checkItem(b.selectedItem.element,!q,"tree");if(b.hasThreeStates){b.checkItems(b.selectedItem,b.selectedItem)}return false}return true;case 33:var j=b._getItemsOnPage();var p=b.selectedItem;for(var k=0;k<j;k++){p=b._prevVisibleItem(p)}if(p!=null){b.selectItem(p.element,"keyboard");b.ensureVisible(p.element)}else{b.selectItem(b._firstItem().element,"keyboard");b.ensureVisible(b._firstItem().element)}return false;case 34:var j=b._getItemsOnPage();var c=b.selectedItem;for(var k=0;k<j;k++){c=b._nextVisibleItem(c)}if(c!=null){b.selectItem(c.element,"keyboard");b.ensureVisible(c.element)}else{b.selectItem(b._lastItem().element,"keyboard");b.ensureVisible(b._lastItem().element)}return false;case 37:case 39:if((s==37&&!b.rtl)||(s==39&&b.rtl)){if(b.selectedItem.hasItems&&b.selectedItem.isExpanded){b.collapseItem(l)}else{var e=b._parentItem(b.selectedItem);if(e!=null){b.selectItem(e.element,"keyboard");b.ensureVisible(e.element)}}}if((s==39&&!b.rtl)||(s==37&&b.rtl)){if(b.selectedItem.hasItems){if(!b.selectedItem.isExpanded){b.expandItem(l)}else{var c=b._nextVisibleItem(b.selectedItem);if(c!=null){b.selectItem(c.element,"keyboard");b.ensureVisible(c.element)}}}}return false;case 13:if(b.selectedItem.hasItems){if(b.selectedItem.isExpanded){b.collapseItem(l)}else{b.expandItem(l)}}return false;case 36:b.selectItem(b._firstItem().element,"keyboard");b.ensureVisible(b._firstItem().element);return false;case 35:b.selectItem(b._lastItem().element,"keyboard");b.ensureVisible(b._lastItem().element);return false;case 38:var p=b._prevVisibleItem(b.selectedItem);if(p!=null){b.selectItem(p.element,"keyboard");b.ensureVisible(p.element)}return false;case 40:var c=b._nextVisibleItem(b.selectedItem);if(c!=null){b.selectItem(c.element,"keyboard");b.ensureVisible(c.element)}return false}}}})},_firstItem:function(){var d=null;var c=this;var f=this.host.find("ul:first");var e=a(f).find("li");for(i=0;i<=e.length-1;i++){var b=e[i];d=this.itemMapping["id"+b.id].item;if(c._isVisible(d)){return d}}return null},_lastItem:function(){var d=null;var c=this;var f=this.host.find("ul:first");var e=a(f).find("li");for(i=e.length-1;i>=0;i--){var b=e[i];d=this.itemMapping["id"+b.id].item;if(c._isVisible(d)){return d}}return null},_parentItem:function(d){if(d==null||d==undefined){return null}var c=d.parentElement;if(!c){return null}var b=null;a.each(this.items,function(){if(this.element==c){b=this;return false}});return b},_nextVisibleItem:function(c){if(c==null||c==undefined){return null}var b=c;while(b!=null){b=b.nextItem;if(this._isVisible(b)&&!b.disabled){return b}}return null},_prevVisibleItem:function(c){if(c==null||c==undefined){return null}var b=c;while(b!=null){b=b.prevItem;if(this._isVisible(b)&&!b.disabled){return b}}return null},_isVisible:function(c){if(c==null||c==undefined){return false}if(!this._isElementVisible(c.element)){return false}var b=this._parentItem(c);if(b==null){return true}if(b!=null){if(!this._isElementVisible(b.element)){return false}if(b.isExpanded){while(b!=null){b=this._parentItem(b);if(b!=null&&!this._isElementVisible(b.element)){return false}if(b!=null&&!b.isExpanded){return false}}}else{return false}}return true},_getItemsOnPage:function(){var d=0;var c=this.panel.jqxPanel("getVScrollPosition");var b=parseInt(this.host.height());var f=0;var e=this._firstItem();if(parseInt(a(e.element).height())>0){while(f<=b){f+=parseInt(a(e.element).outerHeight());d++}}return d},_isElementVisible:function(b){if(b==null){return false}if(a(b).css("display")!="none"&&a(b).css("visibility")!="hidden"){return true}return false},refresh:function(c){if(this.width!=null&&this.width.toString().indexOf("px")!=-1){this.host.width(this.width)}else{if(this.width!=undefined&&!isNaN(this.width)){this.host.width(this.width)}}if(this.height!=null&&this.height.toString().indexOf("px")!=-1){this.host.height(this.height)}else{if(this.height!=undefined&&!isNaN(this.height)){this.host.height(this.height)}}if(this.panel){if(this.width!=null&&this.width.toString().indexOf("%")!=-1){var b=this;this.panel.jqxPanel("width","100%");b.removeHandler(a(window),"resize.jqxtree"+b.element.id);b.addHandler(a(window),"resize.jqxtree"+b.element.id,function(){b._calculateWidth()})}else{this.panel.jqxPanel("width",this.host.width())}this.panel.jqxPanel("_arrange")}this._calculateWidth();if(a.jqx.isHidden(this.host)){var b=this;if(this._hiddenTimer){clearInterval(this._hiddenTimer)}this._hiddenTimer=setInterval(function(){if(!a.jqx.isHidden(b.host)){clearInterval(b._hiddenTimer);b._calculateWidth()}},100)}if(c!=true){if(this.checkboxes){this._updateCheckLayout(null)}}},resize:function(c,b){this.width=c;this.height=b;this.refresh()},loadItems:function(c){if(c==null){return}var b=this;this.items=new Array();var d="<ul>";a.map(c,function(e){if(e==undefined){return null}d+=b._parseItem(e)});d+="</ul>";return d},_parseItem:function(n){var g="";if(n==undefined){return null}var k=n.label;var m=n.value;if(!n.label&&n.html){k=n.html}if(this.displayMember!=undefined&&this.displayMember!=""){k=n[this.displayMember]}if(this.valueMember!=undefined&&this.valueMember!=""){m=n[this.valueMember]}if(!k){k="Item"}if(typeof n==="string"){k=n}var h=false;if(n.expanded!=undefined&&n.expanded){h=true}var f=false;if(n.locked!=undefined&&n.locked){f=true}var d=false;if(n.selected!=undefined&&n.selected){d=true}var e=false;if(n.disabled!=undefined&&n.disabled){e=true}var l=false;if(n.checked!=undefined&&n.checked){l=true}var j=n.icon;var c=n.iconsize;g+="<li";if(h){g+=' item-expanded="true" '}if(f){g+=' item-locked="true" '}if(e){g+=' item-disabled="true" '}if(d){g+=' item-selected="true" '}if(c){g+=' item-iconsize="'+n.iconsize+'" '}if(j!=null&&j!=undefined){g+=' item-icon="'+j+'" '}if(n.label&&!n.html){g+=' item-label="'+k+'" '}if(m!=null){g+=' item-value="'+m+'" '}if(n.checked!=undefined){g+=' item-checked="'+l+'" '}var b="";if(n.id!=undefined){b=n.id;g+=' id="'+b+'" '}else{b=this.createID();g+=' id="'+b+'" '}g+=">"+k;if(n.items){g+=this.loadItems(n.items)}else{if(this.itemsMember!=undefined&&this.itemsMember!=""){if(n[this.itemsMember]){g+=this.loadItems(n[this.itemsMember])}}}if(!this._valueList){this._valueList=new Array()}this._valueList[b]=n.value;g+="</li>";return g},ensureVisible:function(f){if(f==null||f==undefined){return}if(this.panel){var c=this.panel.jqxPanel("getVScrollPosition");var g=this.panel.jqxPanel("getHScrollPosition");var b=parseInt(this.host.height());var e=a(f).find(".jqx-tree-item:first");var h=a(e).position().top;if(c===0&&h===0){return}var d=this.panel.jqxPanel("hScrollBar").outerHeight();if(h<=c||h>=b+c){this.panel.jqxPanel("scrollTo",g,h-b+a(e).outerHeight()+d)}}},_syncItems:function(c){this._visibleItems=new Array();var b=this;a.each(c,function(){var e=a(this);if(e.css("display")!="none"){var d=e.outerHeight();if(e.height()>0){var f=parseInt(e.offset().top);b._visibleItems[b._visibleItems.length]={element:this,top:f,height:d,bottom:f+d}}}})},hitTest:function(h,g){var d=this;var b=this;var f=null;var e=this.host.find(".jqx-item");this._syncItems(e);if(b._visibleItems){var c=parseInt(b.host.offset().left);var j=b.host.outerWidth();a.each(b._visibleItems,function(l){if(h>=c&&h<c+j){if(this.top+5<g&&g<this.top+this.height){var k=a(this.element).parents("li:first");if(k.length>0){f=b.getItem(k[0]);if(f!=null){f.height=this.height;f.top=this.top;return false}}}}})}return f},addBefore:function(b,d,c){return this.addBeforeAfter(b,d,true,c)},addAfter:function(b,d,c){return this.addBeforeAfter(b,d,false,c)},addBeforeAfter:function(o,r,q,n){var l=this;var m=new Array();if(r&&r.treeInstance!=undefined){r=r.element}if(!a.isArray(o)){m[0]=o}else{m=o}var g="";var p=this;a.each(m,function(){g+=p._parseItem(this)});var b=a(g);if(l.element.innerHTML.indexOf("UL")){var h=l.host.find("ul:first")}if(r==undefined&&r==null){h.append(b)}else{if(q){a(r).before(b)}else{a(r).after(b)}}var d=b;for(var k=0;k<d.length;k++){this._createItem(d[k]);var c=a(d[k]).find("li");if(c.length>0){for(var f=0;f<c.length;f++){this._createItem(c[f])}}}var e=function(j){p._refreshMapping(false);p._updateItemsNavigation();if(j&&p.allowDrag&&p._enableDragDrop){p._enableDragDrop()}if(p.selectedItem!=null){a(p.selectedItem.titleElement).addClass(p.toThemeProperty("jqx-fill-state-pressed"));a(p.selectedItem.titleElement).addClass(p.toThemeProperty("jqx-tree-item-selected"))}};if(n==false){e(true);this._raiseEvent("4",{items:this.getItems()});return}e(false);p._render();this._raiseEvent("4",{items:this.getItems()});if(p.checkboxes){p._updateCheckLayout(null)}},addTo:function(q,s,p){var n=this;var o=new Array();if(s&&s.treeInstance!=undefined){s=s.element}if(!a.isArray(q)){o[0]=q}else{o=q}var k="";var r=this;a.each(o,function(){k+=r._parseItem(this)});var b=a(k);if(n.element.innerHTML.indexOf("UL")){var l=n.host.find("ul:first")}if(s==undefined&&s==null){l.append(b)}else{s=a(s);var e=s.find("ul:first");if(e.length==0){ulElement=a("<ul></ul>");a(s).append(ulElement);e=s.find("ul:first");var t=n.itemMapping["id"+s[0].id].item;t.subtreeElement=e[0];t.hasItems=true;e.addClass(n.toThemeProperty("jqx-tree-dropdown"));if(r.rtl){e.addClass(n.toThemeProperty("jqx-tree-dropdown-rtl"))}e.append(b);var h=e.find("li:first");t.parentElement=h}else{e.append(b)}}var d=b;for(var m=0;m<d.length;m++){this._createItem(d[m]);var c=a(d[m]).find("li");if(c.length>0){for(var g=0;g<c.length;g++){this._createItem(c[g])}}}var f=function(j){r._refreshMapping(false);r._updateItemsNavigation();if(j&&r.allowDrag&&r._enableDragDrop){r._enableDragDrop()}if(r.selectedItem!=null){a(r.selectedItem.titleElement).addClass(r.toThemeProperty("jqx-fill-state-pressed"));a(r.selectedItem.titleElement).addClass(r.toThemeProperty("jqx-tree-item-selected"))}};if(p==false){f(true);this._raiseEvent("4",{items:this.getItems()});return}f(false);r._render();if(r.checkboxes){r._updateCheckLayout(null)}this._raiseEvent("4",{items:this.getItems()})},updateItem:function(e,j){var h=e.treeInstance!=undefined?e:this.getItem(e);if(!h){var d=e;e=j;j=d;var h=e.treeInstance!=undefined?e:this.getItem(e)}if(h){if(typeof(j)==="string"){j={label:j}}if(j.value){h.value=j.value}if(j.label){h.label=j.label;a.jqx.utilities.html(a(h.titleElement),j.label);var b=a.jqx.browser.msie&&a.jqx.browser.version<8;if(b){a(document.body).append(this._measureItem);this._measureItem.html(a(h.titleElement).text());var g=this._measureItem.width();if(h.icon){g+=20}if(a(a(h.titleElement).find("img")).length>0){g+=20}a(h.titleElement).css("max-width",g+"px");this._measureItem.remove()}}if(j.icon){if(a(h.element).children(".itemicon").length>0){a(h.element).find(".itemicon")[0].src=j.icon}else{var c=j.iconsize;if(!c){c=16}var f=a('<img width="'+c+'" height="'+c+'" style="float: left;" class="itemicon" src="'+j.icon+'"/>');a(h.titleElement).prepend(f);f.css("margin-right","6px");if(this.rtl){f.css("margin-right","0px");f.css("margin-left","6px");f.css("float","right")}}}if(j.expanded){this.expandItem(h)}if(j.disabled){this.disableItem(h)}if(j.selected){this.selectItem(h)}return true}return false},removeItem:function(b,d){if(b==undefined||b==null){return}if(b.treeInstance!=undefined){b=b.element}var e=this;var h=b.id;var c=-1;var f=this.getItem(b);if(f){c=this.items.indexOf(f);if(c!=-1){(function g(p){var n=-1;n=this.items.indexOf(p);if(n!=-1){this.items.splice(n,1)}var k=a(p.element).find("li");var j=k.length;var o=this;var l=new Array();if(j>0){a.each(k,function(q){var r=o.itemMapping["id"+this.id].item;l.push(r)});for(var m=0;m<l.length;m++){g.apply(this,[l[m]])}}}).apply(this,[f])}}if(this.host.find("#"+b.id).length>0){a(b).remove()}if(d==false){this._raiseEvent("5");return}e._updateItemsNavigation();if(e.allowDrag&&e._enableDragDrop){e._render(true,false)}else{e._render()}if(e.selectedItem!=null){if(e.selectedItem.element==b){a(e.selectedItem.titleElement).removeClass(e.toThemeProperty("jqx-fill-state-pressed"));a(e.selectedItem.titleElement).removeClass(e.toThemeProperty("jqx-tree-item-selected"));e.selectedItem=null}}this._raiseEvent("5");if(e.checkboxes){e._updateCheckLayout(null)}},clear:function(){this.items=new Array();this.itemMapping=new Array();var b=this.host.find("ul:first");if(b.length>0){b[0].innerHTML=""}this.selectedItem=null},disableItem:function(b){if(b==null){return false}if(b.treeInstance!=undefined){b=b.element}var c=this;a.each(c.items,function(){var d=this;if(d.element==b){d.disabled=true;a(d.titleElement).addClass(c.toThemeProperty("jqx-fill-state-disabled"));a(d.titleElement).addClass(c.toThemeProperty("jqx-tree-item-disabled"));if(c.checkboxes&&d.checkBoxElement){a(d.checkBoxElement).jqxCheckBox({disabled:true})}return false}})},_updateInputSelection:function(){if(this.input){if(this.selectedItem==null){this.input.val("")}else{var c=this.selectItem.value;if(c==null){c=this.selectedItem.label}this.input.val(c)}if(this.checkboxes){var b=this.getCheckedItems();if(this.submitCheckedItems){var f="";for(var d=0;d<b.length;d++){var e=b[d].value;if(e==null){e=b[d].label}if(d==b.length-1){f+=e}else{f+=e+","}}this.input.val(f)}}}},getCheckedItems:function(){var b=new Array();var c=this;a.each(c.items,function(){var d=this;if(d.checked){b.push(d)}});return b},getUncheckedItems:function(){var b=new Array();var c=this;a.each(c.items,function(){var d=this;if(!d.checked){b.push(d)}});return b},checkAll:function(){var b=this;a.each(b.items,function(){var c=this;if(!c.disabled){c.checked=true;a(c.checkBoxElement).jqxCheckBox("_setState",true)}});this._raiseEvent("6",{element:this,checked:true})},uncheckAll:function(){var b=this;a.each(b.items,function(){var c=this;if(!c.disabled){c.checked=false;a(c.checkBoxElement).jqxCheckBox("_setState",false)}});this._raiseEvent("6",{element:this,checked:false})},checkItem:function(d,f,b){if(d==null){return false}if(f===undefined){f=true}if(d.treeInstance!=undefined){d=d.element}var e=this;var c=false;var g=null;a.each(e.items,function(){var h=this;if(h.element==d&&!h.disabled){c=true;h.checked=f;g=h;a(h.checkBoxElement).jqxCheckBox({checked:f});return false}});if(c){this._raiseEvent("6",{element:d,checked:f});this._updateInputSelection()}if(b==undefined){if(g){if(this.hasThreeStates){this.checkItems(g,g)}}}},uncheckItem:function(b){this.checkItem(b,false)},enableItem:function(b){if(b==null){return false}if(b.treeInstance!=undefined){b=b.element}var c=this;a.each(c.items,function(){var d=this;if(d.element==b){d.disabled=false;a(d.titleElement).removeClass(c.toThemeProperty("jqx-fill-state-disabled"));a(d.titleElement).removeClass(c.toThemeProperty("jqx-tree-item-disabled"));if(c.checkboxes&&d.checkBoxElement){a(d.checkBoxElement).jqxCheckBox({disabled:false})}return false}})},enableAll:function(){var b=this;a.each(b.items,function(){var c=this;c.disabled=false;a(c.titleElement).removeClass(b.toThemeProperty("jqx-tree-item-disabled"));a(c.titleElement).removeClass(b.toThemeProperty("jqx-fill-state-disabled"));if(b.checkboxes&&c.checkBoxElement){a(c.checkBoxElement).jqxCheckBox({disabled:false})}})},lockItem:function(b){if(b==null){return false}var c=this;a.each(c.items,function(){var d=this;if(d.element==b){d.locked=true;return false}})},unlockItem:function(b){if(b==null){return false}var c=this;a.each(c.items,function(){var d=this;if(d.element==b){d.locked=false;return false}})},getItems:function(){return this.items},getItem:function(b){if(b==null||b==undefined){return null}if(this.itemMapping["id"+b.id]){var c=this.itemMapping["id"+b.id].item;return c}return null},isExpanded:function(b){if(b==null||b==undefined){return false}var c=this.itemMapping["id"+b.id].item;if(c!=null){return c.isExpanded}return false},isSelected:function(b){if(b==null||b==undefined){return false}var c=this.itemMapping["id"+b.id].item;if(c!=null){return c==this.selectedItem}return false},getPrevItem:function(c){var d=this.getItem(c);if(c.treeInstance!=undefined){d=c}var b=this._prevVisibleItem(d);return b},getNextItem:function(c){var d=this.getItem(c);if(c.treeInstance!=undefined){d=c}var b=this._nextVisibleItem(d);return b},getSelectedItem:function(b){return this.selectedItem},val:function(d){if(arguments.length==0||typeof(d)=="object"){return this.selectedItem}if(typeof d=="string"){var b=this.host.find("#"+d);if(b.length>0){var c=this.getItem(b[0]);this.selectItem(c)}}else{var c=this.getItem(d);this.selectItem(c)}},getActiveDescendant:function(){if(this.selectedItem){return this.selectedItem.element.id}return""},clearSelection:function(){this.selectItem(null)},selectItem:function(b,c){if(this.disabled){return}var d=this;if(b&&b.treeInstance!=undefined){b=b.element}if(b==null||b==undefined){if(d.selectedItem!=null){a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-fill-state-pressed"));a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-tree-item-selected"));d.selectedItem=null}return}if(this.selectedItem!=null&&this.selectedItem.element==b){return}var e=this.selectedItem!=null?this.selectedItem.element:null;if(e){a(e).removeAttr("aria-selected")}a.each(d.items,function(){var f=this;this.selected=false;if(!f.disabled){if(f.element==b){if(d.selectedItem==null||(d.selectedItem!=null&&d.selectedItem.titleElement!=f.titleElement)){if(d.selectedItem!=null){a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-fill-state-pressed"));a(d.selectedItem.titleElement).removeClass(d.toThemeProperty("jqx-tree-item-selected"))}a(f.titleElement).addClass(d.toThemeProperty("jqx-fill-state-pressed"));a(f.titleElement).addClass(d.toThemeProperty("jqx-tree-item-selected"));d.selectedItem=f;this.selected=true;a(f.element).attr("aria-selected","true");a.jqx.aria(d,"aria-activedescendant",f.element.id)}}}});this._updateInputSelection();if(!c){c=null}this._raiseEvent("2",{element:b,prevElement:e,type:c})},collapseAll:function(){this.isUpdating=true;var d=this;var b=d.items;var c=this.animationHideDuration;this.animationHideDuration=0;a.each(b,function(){var e=this;if(e.isExpanded==true){d._collapseItem(d,e)}});setTimeout(function(){d.isUpdating=false;d._calculateWidth()},this.animationHideDuration);this.animationHideDuration=c},expandAll:function(){var c=this;this.isUpdating=true;var b=this.animationShowDuration;this.animationShowDuration=0;a.each(this.items,function(){var d=this;if(d.hasItems){c._expandItem(c,d)}});setTimeout(function(){c.isUpdating=false;c._calculateWidth()},this.animationShowDuration);this.animationShowDuration=b},collapseItem:function(b){if(b==null){return false}if(b.treeInstance!=undefined){b=b.element}var c=this;a.each(this.items,function(){var d=this;if(d.isExpanded==true&&d.element==b){c._collapseItem(c,d);return false}});return true},expandItem:function(b){if(b==null){return false}if(b.treeInstance!=undefined){b=b.element}var c=this;a.each(c.items,function(){var d=this;if(d.isExpanded==false&&d.element==b&&!d.disabled&&!d.locked){c._expandItem(c,d);if(d.parentElement){c.expandItem(d.parentElement)}}});return true},_getClosedSubtreeOffset:function(c){var b=a(c.subtreeElement);var e=-b.outerHeight();var d=-b.outerWidth();d=0;return{left:d,top:e}},_collapseItem:function(g,k,d,b){if(g==null||k==null){return false}if(k.disabled){return false}if(g.disabled){return false}if(g.locked){return false}var e=a(k.subtreeElement);var l=this._getClosedSubtreeOffset(k);var h=l.top;var c=l.left;$treeElement=a(k.element);var f=g.animationHideDelay;f=0;if(e.data("timer").show!=null){clearTimeout(e.data("timer").show);e.data("timer").show=null}var j=function(){k.isExpanded=false;if(g.checkboxes){var n=e.find(".chkbox");n.stop();n.css("opacity",1);e.find(".chkbox").animate({opacity:0},50)}var m=a(k.arrow);g._arrowStyle(m,"",k.isExpanded);e.slideUp(g.animationHideDuration,function(){k.isCollapsing=false;g._calculateWidth();var o=a(k.arrow);g._arrowStyle(o,"",k.isExpanded);e.hide();g._raiseEvent("1",{element:k.element})})};if(f>0){e.data("timer").hide=setTimeout(function(){j()},f)}else{j()}},_expandItem:function(g,k){if(g==null||k==null){return false}if(k.isExpanded){return false}if(k.locked){return false}if(k.disabled){return false}if(g.disabled){return false}var e=a(k.subtreeElement);if((e.data("timer"))!=null&&e.data("timer").hide!=null){clearTimeout(e.data("timer").hide)}var j=a(k.element);var h=0;var d=0;if(parseInt(e.css("top"))==h){k.isExpanded=true;return}var c=a(k.arrow);g._arrowStyle(c,"",k.isExpanded);if(g.checkboxes){var f=e.find(".chkbox");f.stop();f.css("opacity",0);f.animate({opacity:1},g.animationShowDuration)}var c=a(k.arrow);g._arrowStyle(c,"",true);e.slideDown(g.animationShowDuration,g.easing,function(){var l=a(k.arrow);k.isExpanded=true;g._arrowStyle(l,"",k.isExpanded);k.isExpanding=false;g._raiseEvent("0",{element:k.element});g._calculateWidth()});if(g.checkboxes){g._updateCheckItemLayout(k);if(k.subtreeElement){var b=a(k.subtreeElement).find("li");a.each(b,function(){var l=g.getItem(this);if(l!=null){g._updateCheckItemLayout(l)}})}}},_calculateWidth:function(){var f=this;var g=this.checkboxes?20:0;var e=0;if(this.isUpdating){return}a.each(this.items,function(){var h=a(this.element).height();if(h!=0){var l=a(this.titleElement).outerWidth()+10+g+(1+this.level)*20;e=Math.max(e,l);if(this.hasItems){var j=parseInt(a(this.titleElement).css("padding-top"));if(isNaN(j)){j=0}j=j*2;j+=2;var k=(j+a(this.titleElement).height())/2-17/2;if(a.jqx.browser.msie&&a.jqx.browser.version<9){a(this.arrow).css("margin-top","3px")}else{if(parseInt(k)>=0){a(this.arrow).css("margin-top",parseInt(k)+"px")}}}}});if(this.toggleIndicatorSize>16){e=e+this.toggleIndicatorSize-16}if(f.panel){if(e>this.host.width()){var b=e-this.host.width();var d=f.panel.jqxPanel("vScrollBar").css("visibility")!=="hidden"?10:0;b+=d;f.panel.jqxPanel({horizontalScrollBarMax:b})}else{f.panel.jqxPanel({horizontalScrollBarMax:0})}}this.host.find("ul:first").width(e);var c=this.host.width()-30;if(c>0){this.host.find("ul:first").css("min-width",c)}if(f.panel){f.panel.jqxPanel("_arrange")}},_arrowStyle:function(c,h,b){var e=this;if(c.length>0){c.removeClass();var g="";if(h=="hover"){g="-"+h}var f=b?"-expand":"-collapse";var d="jqx-tree-item-arrow"+f+g;c.addClass(e.toThemeProperty(d));if(!this.rtl){var f=!b?"-right":"-down";c.addClass(e.toThemeProperty("jqx-icon-arrow"+f+""))}if(this.rtl){c.addClass(e.toThemeProperty(d+"-rtl"));var f=!b?"-left":"-down";c.addClass(e.toThemeProperty("jqx-icon-arrow"+f+""))}}},_initialize:function(f,c){var e=this;var d=0;this.host.addClass(e.toThemeProperty("jqx-widget"));this.host.addClass(e.toThemeProperty("jqx-widget-content"));this.host.addClass(e.toThemeProperty("jqx-tree"));this._updateDisabledState();var b=a.jqx.browser.msie&&a.jqx.browser.version<8;a.each(this.items,function(){var m=this;$element=a(m.element);var k=null;if(e.checkboxes&&!m.hasItems&&m.checkBoxElement){a(m.checkBoxElement).css("margin-left","0px")}if(!b){if(!m.hasItems){if(!e.rtl){m.element.style.marginLeft=parseInt(e.toggleIndicatorSize)+"px"}else{m.element.style.marginRight=parseInt(e.toggleIndicatorSize)+"px"}var j=a(m.arrow);if(j.length>0){j.remove();m.arrow=null}return true}else{if(!e.rtl){m.element.style.marginLeft="0px"}else{m.element.style.marginRight="0px"}}}else{if(!m.hasItems&&a(m.element).find("ul").length>0){a(m.element).find("ul").remove()}}var j=a(m.arrow);if(j.length>0){j.remove()}k=a('<span style="height: 17px; border: none; background-color: transparent;" id="arrow'+$element[0].id+'"></span>');k.prependTo($element);if(!e.rtl){k.css("float","left")}else{k.css("float","right")}k.css("clear","both");k.width(e.toggleIndicatorSize);e._arrowStyle(k,"",m.isExpanded);var l=parseInt(a(this.titleElement).css("padding-top"));if(isNaN(l)){l=0}l=l*2;l+=2;var n=(l+a(this.titleElement).height())/2-17/2;if(a.jqx.browser.msie&&a.jqx.browser.version<9){k.css("margin-top","3px")}else{if(parseInt(n)>=0){k.css("margin-top",parseInt(n)+"px")}}$element.addClass(e.toThemeProperty("jqx-disableselect"));k.addClass(e.toThemeProperty("jqx-disableselect"));var g="click";var h=e.isTouchDevice();if(h){g=a.jqx.mobile.getTouchEventName("touchend")}e.addHandler(k,g,function(){if(!m.isExpanded){e._expandItem(e,m)}else{e._collapseItem(e,m)}return false});e.addHandler(k,"selectstart",function(){return false});e.addHandler(k,"mouseup",function(){if(!h){return false}});m.hasItems=a(m.element).find("li").length>0;m.arrow=k[0];if(!m.hasItems){k.css("visibility","hidden")}$element.css("float","none")})},_getOffset:function(b){var f=a(window).scrollTop();var h=a(window).scrollLeft();var c=a.jqx.mobile.isSafariMobileBrowser();var g=a(b).offset();var e=g.top;var d=g.left;if(c!=null&&c){return{left:d-h,top:e-f}}else{return a(b).offset()}},_renderHover:function(c,e,b){var d=this;if(!b){var f=a(e.titleElement);d.addHandler(f,"mouseenter",function(){if(!e.disabled&&d.enableHover&&!d.disabled){f.addClass(d.toThemeProperty("jqx-fill-state-hover"));f.addClass(d.toThemeProperty("jqx-tree-item-hover"))}});d.addHandler(f,"mouseleave",function(){if(!e.disabled&&d.enableHover&&!d.disabled){f.removeClass(d.toThemeProperty("jqx-fill-state-hover"));f.removeClass(d.toThemeProperty("jqx-tree-item-hover"))}})}},_updateDisabledState:function(){if(this.disabled){this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled"))}else{this.host.removeClass(this.toThemeProperty("jqx-fill-state-disabled"))}},_addInput:function(){if(this.input==null){var b=this.host.attr("name");if(b){this.host.attr("name","")}this.input=a("<input type='hidden'/>");this.host.append(this.input);this.input.attr("name",b);this._updateInputSelection()}},render:function(){this._updateItemsNavigation();this._render()},_render:function(f,j){if(a.jqx.browser.msie&&a.jqx.browser.version<8){var g=this;a.each(this.items,function(){var n=a(this.element);var p=n.parent();var m=parseInt(this.titleElement.css("margin-left"))+this.titleElement[0].scrollWidth+13;n.css("min-width",m);var o=parseInt(p.css("min-width"));if(isNaN(o)){o=0}var l=n.css("min-width");if(o<parseInt(n.css("min-width"))){p.css("min-width",l)}this.titleElement[0].style.width=null})}var h=1000;var c=[5,5];var g=this;a.data(g.element,"animationHideDelay",g.animationHideDelay);a.data(document.body,"treeel",this);this._initialize();var d=this.isTouchDevice();if(d&&this.toggleMode=="dblclick"){this.toggleMode="click"}if(f==undefined||f==true){a.each(this.items,function(){g._updateItemEvents(g,this)})}if(this.allowDrag&&this._enableDragDrop&&(j==undefined||j==true)){this._enableDragDrop()}this._addInput();if(this.host.jqxPanel){if(this.host.find("#panel"+this.element.id).length>0){this.panel.jqxPanel({touchMode:this.touchMode});this.panel.jqxPanel("refresh");return}this.host.find("ul:first").wrap('<div style="background-color: transparent; overflow: hidden; width: 100%; height: 100%;" id="panel'+this.element.id+'"></div>');var b=this.host.find("div:first");var k="fixed";if(this.height==null||this.height=="auto"){k="verticalwrap"}if(this.width==null||this.width=="auto"){if(k=="fixed"){k="horizontalwrap"}else{k="wrap"}}b.jqxPanel({rtl:this.rtl,theme:this.theme,width:"100%",height:"100%",touchMode:this.touchMode,sizeMode:k});if(a.jqx.browser.msie&&a.jqx.browser.version<8){b.jqxPanel("content").css("left","0px")}b.data({nestedWidget:true});if(this.height==null||(this.height!=null&&this.height.toString().indexOf("%")!=-1)){if(this.isTouchDevice()){this.removeHandler(b,a.jqx.mobile.getTouchEventName("touchend")+".touchScroll touchcancel.touchScroll");this.removeHandler(b,a.jqx.mobile.getTouchEventName("touchmove")+".touchScroll");this.removeHandler(b,a.jqx.mobile.getTouchEventName("touchstart")+".touchScroll")}}var e=a.data(b[0],"jqxPanel").instance;if(e!=null){this.vScrollInstance=e.vScrollInstance;this.hScrollInstance=e.hScrollInstance}this.panelInstance=e;if(a.jqx.browser.msie&&a.jqx.browser.version<8){this.host.attr("hideFocus",true);this.host.find("div").attr("hideFocus",true);this.host.find("ul").attr("hideFocus",true)}b[0].className="";this.panel=b}this._raiseEvent("3",this)},focus:function(){try{this.host.focus()}catch(b){}},_updateItemEvents:function(h,k){var b=this.isTouchDevice();if(b){this.toggleMode=a.jqx.mobile.getTouchEventName("touchend")}var j=a(k.element);if(h.enableRoundedCorners){j.addClass(h.toThemeProperty("jqx-rc-all"))}var e=!b?"mousedown":a.jqx.mobile.getTouchEventName("touchend");if(h.touchMode===true){h.removeHandler(a(k.checkBoxElement),"mousedown")}h.removeHandler(a(k.checkBoxElement),e);h.addHandler(a(k.checkBoxElement),e,function(l){if(!h.disabled){if(!this.treeItem.disabled){this.treeItem.checked=!this.treeItem.checked;h.checkItem(this.treeItem.element,this.treeItem.checked,"tree");if(h.hasThreeStates){h.checkItems(this.treeItem,this.treeItem)}}}return false});var c=a(k.titleElement);h.removeHandler(j);var f=this.allowDrag&&this._enableDragDrop;if(!f){h.removeHandler(c)}else{h.removeHandler(c,"mousedown.item");h.removeHandler(c,"click");h.removeHandler(c,"dblclick");h.removeHandler(c,"mouseenter");h.removeHandler(c,"mouseleave")}h._renderHover(j,k,b);var d=a(k.subtreeElement);if(d.length>0){var g=k.isExpanded?"block":"none";d.css({overflow:"hidden",display:g});d.data("timer",{})}h.addHandler(c,"selectstart",function(l){return false});if(a.jqx.browser.opera){h.addHandler(c,"mousedown.item",function(l){return false})}if(h.toggleMode!="click"){h.addHandler(c,"click",function(l){h.selectItem(k.element,"mouse");if(h.panel!=null){h.panel.jqxPanel({focused:true})}c.focus();h._raiseEvent("9",{element:k.element})})}h.addHandler(c,h.toggleMode,function(l){if(d.length>0){clearTimeout(d.data("timer").hide)}if(h.panel!=null){h.panel.jqxPanel({focused:true})}h.selectItem(k.element,"mouse");if(k.isExpanding==undefined){k.isExpanding=false}if(k.isCollapsing==undefined){k.isCollapsing=false}if(d.length>0){if(!k.isExpanded){if(false==k.isExpanding){k.isExpanding=true;h._expandItem(h,k)}}else{if(false==k.isCollapsing){k.isCollapsing=true;h._collapseItem(h,k,true)}}return false}})},isTouchDevice:function(){if(this._isTouchDevice!=undefined){return this._isTouchDevice}var b=a.jqx.mobile.isTouchDevice();if(this.touchMode==true){b=true}else{if(this.touchMode==false){b=false}}this._isTouchDevice=b;return b},createID:function(){return a.jqx.utilities.createId()},createTree:function(b){if(b==null){return}var d=this;var f=a(b).find("li");var c=0;this.items=new Array();this.itemMapping=new Array();a(b).addClass(d.toThemeProperty("jqx-tree-dropdown-root"));if(this.rtl){a(b).addClass(d.toThemeProperty("jqx-tree-dropdown-root-rtl"))}if(this.rtl||a.jqx.browser.msie&&a.jqx.browser.version<8){this._measureItem=a("<span style='position: relative; visibility: hidden;'></span>");this._measureItem.addClass(this.toThemeProperty("jqx-widget"));this._measureItem.addClass(this.toThemeProperty("jqx-fill-state-normal"));this._measureItem.addClass(this.toThemeProperty("jqx-tree-item"));this._measureItem.addClass(this.toThemeProperty("jqx-item"));a(document.body).append(this._measureItem)}if(a.jqx.browser.msie&&a.jqx.browser.version<8){}for(var e=0;e<f.length;e++){this._createItem(f[e])}if(this.rtl||a.jqx.browser.msie&&a.jqx.browser.version<8){this._measureItem.remove()}this._updateItemsNavigation();this._updateCheckStates()},_updateCheckLayout:function(c){var b=this;if(!this.checkboxes){return}a.each(this.items,function(){if(this.level==c||c==undefined){b._updateCheckItemLayout(this)}})},_updateCheckItemLayout:function(b){if(this.checkboxes){if(a(b.titleElement).css("display")!="none"){var c=a(b.checkBoxElement);var d=a(b.titleElement).outerHeight()/2-1-parseInt(this.checkSize)/2;c.css("margin-top",d);if(!this.rtl){if(a.jqx.browser.msie&&a.jqx.browser.version<8){b.titleElement.css("margin-left",parseInt(this.checkSize)+25)}else{if(b.hasItems){c.css("margin-left",this.toggleIndicatorSize)}}}}}},_updateCheckStates:function(){var b=this;if(b.hasThreeStates){a.each(this.items,function(){b._updateCheckState(this)})}else{a.each(this.items,function(){if(this.checked==null){b.checkItem(this.element,false,"tree")}})}},_updateCheckState:function(e){if(e==null||e==undefined){return}var d=this;var c=0;var f=false;var b=0;var g=a(e.element).find("li");b=g.length;if(e.checked&&b>0){a.each(g,function(h){var k=d.itemMapping["id"+this.id].item;var j=k.element.getAttribute("item-checked");if(j==undefined||j==null||j=="true"||j==true){d.checkItem(k.element,true,"tree")}})}a.each(g,function(h){var j=d.itemMapping["id"+this.id].item;if(j.checked!=false){if(j.checked==null){f=true}c++}});if(b>0){if(c==b){this.checkItem(e.element,true,"tree")}else{if(c>0){this.checkItem(e.element,null,"tree")}else{this.checkItem(e.element,false,"tree")}}}},_updateItemsNavigation:function(){var g=this.host.find("ul:first");var f=a(g).find("li");var c=0;for(var d=0;d<f.length;d++){var b=f[d];if(this.itemMapping["id"+b.id]){var e=this.itemMapping["id"+b.id].item;if(!e){continue}e.prevItem=null;e.nextItem=null;if(d>0){if(this.itemMapping["id"+f[d-1].id]){e.prevItem=this.itemMapping["id"+f[d-1].id].item}}if(d<f.length-1){if(this.itemMapping["id"+f[d+1].id]){e.nextItem=this.itemMapping["id"+f[d+1].id].item}}}}},_applyTheme:function(e,h){var f=this;this.host.removeClass("jqx-tree-"+e);this.host.removeClass("jqx-widget-"+e);this.host.removeClass("jqx-widget-content-"+e);this.host.addClass(f.toThemeProperty("jqx-tree"));this.host.addClass(f.toThemeProperty("jqx-widget"));var b=this.host.find("ul:first");a(b).removeClass(f.toThemeProperty("jqx-tree-dropdown-root-"+e));a(b).addClass(f.toThemeProperty("jqx-tree-dropdown-root"));if(this.rtl){a(b).removeClass(f.toThemeProperty("jqx-tree-dropdown-root-rtl-"+e));a(b).addClass(f.toThemeProperty("jqx-tree-dropdown-root-rtl"))}var g=a(b).find("li");for(var d=0;d<g.length;d++){var c=g[d];a(c).children().each(function(){if(this.tagName=="ul"||this.tagName=="UL"){a(this).removeClass(f.toThemeProperty("jqx-tree-dropdown-"+e));a(this).addClass(f.toThemeProperty("jqx-tree-dropdown"));if(f.rtl){a(this).removeClass(f.toThemeProperty("jqx-tree-dropdown-rtl-"+e));a(this).addClass(f.toThemeProperty("jqx-tree-dropdown-rtl"))}return false}})}a.each(this.items,function(){var l=this;var k=a(l.element);k.removeClass(f.toThemeProperty("jqx-tree-item-li-"+e));k.addClass(f.toThemeProperty("jqx-tree-item-li"));if(this.rtl){k.removeClass(f.toThemeProperty("jqx-tree-item-li-"+e));k.addClass(f.toThemeProperty("jqx-tree-item-li"))}a(l.titleElement).removeClass(f.toThemeProperty("jqx-tree-item-"+e));a(l.titleElement).addClass(f.toThemeProperty("jqx-tree-item"));a(l.titleElement).removeClass("jqx-item-"+e);a(l.titleElement).addClass(f.toThemeProperty("jqx-item"));var j=a(l.arrow);if(j.length>0){f._arrowStyle(j,"",l.isExpanded)}if(l.checkBoxElement){a(l.checkBoxElement).jqxCheckBox({theme:h})}if(f.enableRoundedCorners){k.removeClass("jqx-rc-all-"+e);k.addClass(f.toThemeProperty("jqx-rc-all"))}});if(this.host.jqxPanel){this.panel.jqxPanel({theme:h})}},_refreshMapping:function(f,q){var e=this.host.find("li");var b=new Array();var p=new Array();var h=a.data(document.body,"treeItemsStorage");var l=this;for(var j=0;j<e.length;j++){var k=e[j];var d=a(k);var o=h[k.id];if(o==null){continue}p[p.length]=o;if(f==undefined||f==true){this._updateItemEvents(this,o)}o.level=d.parents("li").length;o.treeInstance=this;var n=null;var g=null;if(o.titleElement[0].className.indexOf("jqx-fill-state-pressed")!=-1){a(o.titleElement).removeClass(l.toThemeProperty("jqx-fill-state-pressed"));a(o.titleElement).removeClass(l.toThemeProperty("jqx-tree-item-selected"))}var c=d.children();c.each(function(){if(this.tagName=="ul"||this.tagName=="UL"){o.subtreeElement=this;a(this).addClass(l.toThemeProperty("jqx-tree-dropdown"));if(l.rtl){a(this).addClass(l.toThemeProperty("jqx-tree-dropdown-rtl"))}return false}});var m=d.parents();m.each(function(){if((this.tagName=="li"||this.tagName=="LI")){g=this.id;n=this;return false}});o.parentElement=n;o.parentId=g;o.hasItems=a(o.element).find("li").length>0;if(o!=null){b[j]={element:k,item:o};b["id"+k.id]=b[j]}}this.itemMapping=b;this.items=p},_createItem:function(c){if(c==null||c==undefined){return}var r=c.id;if(!r){r=this.createID()}var F=c;var m=a(c);F.id=r;var g=a.data(document.body,"treeItemsStorage");if(g==undefined){g=new Array()}var x=this.items.length;this.items[x]=new a.jqx._jqxTree.jqxTreeItem();this.treeElements[r]=this.items[x];g[F.id]=this.items[x];a.data(document.body,"treeItemsStorage",g);x=this.items.length;var A=0;var H=this;var e=null;m.attr("role","treeitem");m.children().each(function(){if(this.tagName=="ul"||this.tagName=="UL"){H.items[x-1].subtreeElement=this;a(this).addClass(H.toThemeProperty("jqx-tree-dropdown"));if(H.rtl){a(this).addClass(H.toThemeProperty("jqx-tree-dropdown-rtl"));a(this).css("clear","both")}return false}});m.parents().each(function(){if((this.tagName=="li"||this.tagName=="LI")){A=this.id;e=this;return false}});var w=c.getAttribute("item-expanded");if(w==null||w==undefined||(w!="true"&&w!=true)){w=false}else{w=true}F.removeAttribute("item-expanded");var G=c.getAttribute("item-locked");if(G==null||G==undefined||(G!="true"&&G!=true)){G=false}else{G=true}F.removeAttribute("item-locked");var s=c.getAttribute("item-selected");if(s==null||s==undefined||(s!="true"&&s!=true)){s=false}else{s=true}F.removeAttribute("item-selected");var d=c.getAttribute("item-disabled");if(d==null||d==undefined||(d!="true"&&d!=true)){d=false}else{d=true}F.removeAttribute("item-disabled");var j=c.getAttribute("item-checked");if(j==null||j==undefined||(j!="true"&&j!=true)){j=false}else{j=true}var I=c.getAttribute("item-title");if(I==null||I==undefined||(I!="true"&&I!=true)){I=false}F.removeAttribute("item-title");var D=c.getAttribute("item-icon");var t=c.getAttribute("item-iconsize");var l=c.getAttribute("item-label");var v=c.getAttribute("item-value");F.removeAttribute("item-icon");F.removeAttribute("item-iconsize");F.removeAttribute("item-label");F.removeAttribute("item-value");var C=this.items[x-1];C.id=r;if(C.value==undefined){if(this._valueList&&this._valueList[r]){C.value=this._valueList[r]}else{C.value=v}}C.icon=D;C.iconsize=t;C.parentId=A;C.disabled=d;C.parentElement=e;C.element=c;C.locked=G;C.selected=s;C.checked=j;C.isExpanded=w;C.treeInstance=this;this.itemMapping[x-1]={element:F,item:C};this.itemMapping["id"+F.id]=this.itemMapping[x-1];var h=false;var E=false;h=false;if(this.rtl){a(C.element).css("float","right");a(C.element).css("clear","both")}if(!h||!E){if(a(F.firstChild).length>0){var t=16;if(C.icon){t=C.iconsize;if(!t){t=16}var D=a('<img width="'+t+'" height="'+t+'" style="float: left;" class="itemicon" src="'+C.icon+'"/>');a(F).prepend(D);D.css("margin-right","6px");if(this.rtl){D.css("margin-right","0px");D.css("margin-left","6px");D.css("float","right")}}var b=F.innerHTML.indexOf("<ul");if(b==-1){b=F.innerHTML.indexOf("<UL")}if(b==-1){C.originalTitle=F.innerHTML;F.innerHTML='<div style="display: inline-block;">'+F.innerHTML+"</div>";C.titleElement=a(a(F)[0].firstChild)}else{var B=F.innerHTML.substring(0,b);B=a.trim(B);C.originalTitle=B;B=a('<div style="display: inline-block;">'+B+"</div>");var o=a(F).find("ul:first");o.remove();F.innerHTML="";a(F).prepend(B);a(F).append(o);C.titleElement=B;if(this.rtl){B.css("float","right");o.css("padding-right","10px")}}if(t!==16){a(C.titleElement).css("line-height",t+"px")}if(a.jqx.browser.msie&&a.jqx.browser.version<8){a(a(F)[0].firstChild).css("display","inline-block");var n=false;if(this._measureItem.parents().length==0){a(document.body).append(this._measureItem);n=true}this._measureItem.css("min-width","20px");this._measureItem[0].innerHTML=(a(C.titleElement).text());var u=this._measureItem.width();if(C.icon){u+=20}if(a(a(item.titleElement).find("img")).length>0){u+=20}a(a(F)[0].firstChild).css("max-width",u+"px");if(n){this._measureItem.remove()}}}else{C.originalTitle="Item";a(F).append(a("<span>Item</span>"));a(F.firstChild).wrap("<span/>");C.titleElement=a(F)[0].firstChild;if(a.jqx.browser.msie&&a.jqx.browser.version<8){a(F.firstChild).css("display","inline-block")}}}var z=a(C.titleElement);var q=this.toThemeProperty("jqx-rc-all");if(this.allowDrag){z.addClass("draggable")}if(l==null||l==undefined){l=C.titleElement;C.label=a.trim(z.text())}else{C.label=l}a(F).addClass(this.toThemeProperty("jqx-tree-item-li"));if(this.rtl){a(F).addClass(this.toThemeProperty("jqx-tree-item-li-rtl"))}q+=" "+this.toThemeProperty("jqx-tree-item")+" "+this.toThemeProperty("jqx-item");if(this.rtl){q+=" "+this.toThemeProperty("jqx-tree-item-rtl")}z[0].className=z[0].className+" "+q;C.level=a(c).parents("li").length;C.hasItems=a(c).find("li").length>0;if(this.rtl&&C.parentElement){if(!this.checkboxes){}}if(this.checkboxes){if(this.host.jqxCheckBox){var p=a('<div style="overflow: visible; position: absolute; width: 18px; height: 18px;" tabIndex=0 class="chkbox"/>');p.width(parseInt(this.checkSize));p.height(parseInt(this.checkSize));a(F).prepend(p);if(this.rtl){p.css("float","right");p.css("position","static")}p.jqxCheckBox({hasInput:false,checked:C.checked,boxSize:this.checkSize,animationShowDelay:0,animationHideDelay:0,disabled:d,theme:this.theme});if(!this.rtl){z.css("margin-left",parseInt(this.checkSize)+8)}else{var y=5;if(C.parentElement){p.css("margin-right",y+5+"px")}else{p.css("margin-right",y+"px")}}C.checkBoxElement=p[0];p[0].treeItem=C;var f=z.outerHeight()/2-1-parseInt(this.checkSize)/2;p.css("margin-top",f);if(a.jqx.browser.msie&&a.jqx.browser.version<8){z.css("width","1%");z.css("margin-left",parseInt(this.checkSize)+25)}else{if(C.hasItems){if(!this.rtl){p.css("margin-left",this.toggleIndicatorSize)}}}}else{throw new Error("jqxTree: Missing reference to jqxcheckbox.js.");return}}else{if(a.jqx.browser.msie&&a.jqx.browser.version<8){z.css("width","1%")}}if(d){this.disableItem(C.element)}if(s){this.selectItem(C.element)}if(a.jqx.browser.msie&&a.jqx.browser.version<8){a(F).css("margin","0px");a(F).css("padding","0px")}},destroy:function(){this.removeHandler(a(window),"resize.jqxtree"+this.element.id);this.host.removeClass();if(this.isTouchDevice()){this.removeHandler(this.panel,a.jqx.mobile.getTouchEventName("touchend")+".touchScroll touchcancel.touchScroll");this.removeHandler(this.panel,a.jqx.mobile.getTouchEventName("touchmove")+".touchScroll");this.removeHandler(this.panel,a.jqx.mobile.getTouchEventName("touchstart")+".touchScroll")}var c=this;var b=this.isTouchDevice();a.each(this.items,function(){var g=this;var e=a(this.element);var d=!b?"click":a.jqx.mobile.getTouchEventName("touchend");c.removeHandler(a(g.checkBoxElement),d);var h=a(g.titleElement);c.removeHandler(e);var f=c.allowDrag&&c._enableDragDrop;if(!f){c.removeHandler(h)}else{c.removeHandler(h,"mousedown.item");c.removeHandler(h,"click");c.removeHandler(h,"dblclick");c.removeHandler(h,"mouseenter");c.removeHandler(h,"mouseleave")}$arrowSpan=a(g.arrow);if($arrowSpan.length>0){c.removeHandler($arrowSpan,d);c.removeHandler($arrowSpan,"selectstart");c.removeHandler($arrowSpan,"mouseup");if(!b){c.removeHandler($arrowSpan,"mouseenter");c.removeHandler($arrowSpan,"mouseleave")}c.removeHandler(h,"selectstart")}if(a.jqx.browser.opera){c.removeHandler(h,"mousedown.item")}if(c.toggleMode!="click"){c.removeHandler(h,"click")}c.removeHandler(h,c.toggleMode)});if(this.panel){this.panel.jqxPanel("destroy");this.panel=null}this.host.remove()},_raiseEvent:function(f,c){if(c==undefined){c={owner:null}}var d=this.events[f];args=c;args.owner=this;var e=new a.Event(d);e.owner=this;e.args=args;var b=this.host.trigger(e);return b},propertyChangedHandler:function(d,l,b,j){if(this.isInitialized==undefined||this.isInitialized==false){return}if(l=="submitCheckedItems"){d._updateInputSelection()}if(l=="disabled"){d._updateDisabledState()}if(l=="theme"){d._applyTheme(b,j)}if(l=="keyboardNavigation"){d.enableKeyboardNavigation=j}if(l=="width"||l=="height"){d.refresh();d._initialize();d._calculateWidth();if(d.host.jqxPanel){var k="fixed";if(this.height==null||this.height=="auto"){k="verticalwrap"}if(this.width==null||this.width=="auto"){if(k=="fixed"){k="horizontalwrap"}else{k="wrap"}}d.panel.jqxPanel({sizeMode:k})}}if(l=="touchMode"){d._isTouchDevice=null;if(j){d.enableHover=false}d._render()}if(l=="source"||l=="checkboxes"){if(this.source!=null){var m=[];a.each(d.items,function(){if(this.isExpanded){m[m.length]={label:this.label,level:this.level}}});var f=d.loadItems(d.source);if(!d.host.jqxPanel){d.element.innerHTML=f}else{d.panel.jqxPanel("setcontent",f)}var e=d.disabled;var g=d.host.find("ul:first");if(g.length>0){d.createTree(g[0]);d._render()}var h=d;var c=h.animationShowDuration;h.animationShowDuration=0;d.disabled=false;if(m.length>0){a.each(d.items,function(){for(var n=0;n<m.length;n++){if(m[n].label==this.label&&m[n].level==this.level){var o=h.getItem(this.element);h._expandItem(h,o)}}})}d.disabled=e;h.animationShowDuration=c}}if(l=="hasThreeStates"){d._render();d._updateCheckStates()}if(l=="toggleIndicatorSize"){d._updateCheckLayout();d._render()}}})})(jqxBaseFramework);(function(a){a.jqx._jqxTree.jqxTreeItem=function(e,d,b){var c={label:null,id:e,parentId:d,parentElement:null,parentItem:null,disabled:false,selected:false,locked:false,checked:false,level:0,isExpanded:false,hasItems:false,element:null,subtreeElement:null,checkBoxElement:null,titleElement:null,arrow:null,prevItem:null,nextItem:null};return c}})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.cssroundedcorners=function(b){var c={all:"jqx-rc-all",top:"jqx-rc-t",bottom:"jqx-rc-b",left:"jqx-rc-l",right:"jqx-rc-r","top-right":"jqx-rc-tr","top-left":"jqx-rc-tl","bottom-right":"jqx-rc-br","bottom-left":"jqx-rc-bl"};for(prop in c){if(!c.hasOwnProperty(prop)){continue}if(b==prop){return c[prop]}}};a.jqx.jqxWidget("jqxButton","",{});a.extend(a.jqx._jqxButton.prototype,{defineInstance:function(){var b={type:"",cursor:"arrow",roundedCorners:"all",disabled:false,height:null,width:null,overrideTheme:false,enableHover:true,enableDefault:true,enablePressed:true,imgPosition:"center",imgSrc:"",imgWidth:16,imgHeight:16,value:null,textPosition:"",textImageRelation:"overlay",rtl:false,_ariaDisabled:false,_scrollAreaButton:false,template:"default",aria:{"aria-disabled":{name:"disabled",type:"boolean"}}};if(this===a.jqx._jqxButton.prototype){return b}a.extend(true,this,b);return b},_addImage:function(c){var g=this;if(g.element.nodeName.toLowerCase()=="input"||g.element.nodeName.toLowerCase()=="button"||g.element.nodeName.toLowerCase()=="div"){if(!g._img){g.field=g.element;if(g.field.className){g._className=g.field.className}var i={title:g.field.title};var j=null;if(g.field.getAttribute("value")){var j=g.field.getAttribute("value")}else{if(g.element.nodeName.toLowerCase()!="input"){var j=g.element.innerHTML}}if(g.value){j=g.value}if(g.field.id.length){i.id=g.field.id.replace(/[^\w]/g,"_")+"_"+c}else{i.id=a.jqx.utilities.createId()+"_"+c}var b=document.createElement("div");b.id=i.id;b.title=i.title;b.style.cssText=g.field.style.cssText;b.style.boxSizing="border-box";var f=document.createElement("img");f.setAttribute("src",g.imgSrc);f.setAttribute("width",g.imgWidth);f.setAttribute("height",g.imgHeight);b.appendChild(f);g._img=f;var l=document.createElement("span");if(j){l.innerHTML=j;g.value=j}b.appendChild(l);g._text=l;g.field.style.display="none";if(g.field.parentNode){g.field.parentNode.insertBefore(b,g.field.nextSibling)}var e=g.host.data();g.host=a(b);g.host.data(e);g.element=b;g.element.id=g.field.id;g.field.id=i.id;var k=new a(g.element);var h=new a(g.field);if(g._className){k.addClass(g._className);h.removeClass(g._className)}if(g.field.tabIndex){var d=g.field.tabIndex;g.field.tabIndex=-1;g.element.tabIndex=d}}else{g._img.setAttribute("src",g.imgSrc);g._img.setAttribute("width",g.imgWidth);g._img.setAttribute("height",g.imgHeight);g._text.innerHTML=g.value}if(!g.imgSrc){g._img.style.display="none"}else{g._img.style.display="inline"}if(!g.value){g._text.style.display="none"}else{g._text.style.display="inline"}g._positionTextAndImage()}},_positionTextAndImage:function(){var k=this;var r=k.element.offsetWidth;var q=k.element.offsetHeight;var m=k.imgWidth;var v=k.imgHeight;if(k.imgSrc==""){m=0;v=0}var f=k._text.offsetWidth;var b=k._text.offsetHeight;var i=4;var c=4;var l=4;var n=0;var u=0;switch(k.textImageRelation){case"imageBeforeText":case"textBeforeImage":n=m+f+2*l+i+2*c;u=Math.max(v,b)+2*l+i+2*c;break;case"imageAboveText":case"textAboveImage":n=Math.max(m,f)+2*l;u=v+b+i+2*l+2*c;break;case"overlay":n=Math.max(m,f)+2*l;u=Math.max(v,b)+2*l;break}if(!k.width){k.element.style.width=n+"px";r=n}if(!k.height){k.element.style.height=u+"px";q=u}k._img.style.position="absolute";k._text.style.position="absolute";k.element.style.position="relative";k.element.style.overflow="hidden";var e={};var z={};var s=function(E,D,G,C,F){if(D.width<C){D.width=C}if(D.height<F){D.height=F}switch(G){case"left":E.style.left=D.left+"px";E.style.top=D.top+D.height/2-F/2+"px";break;case"topLeft":E.style.left=D.left+"px";E.style.top=D.top+"px";break;case"bottomLeft":E.style.left=D.left+"px";E.style.top=D.top+D.height-F+"px";break;default:case"center":E.style.left=D.left+D.width/2-C/2+"px";E.style.top=D.top+D.height/2-F/2+"px";break;case"top":E.style.left=D.left+D.width/2-C/2+"px";E.style.top=D.top+"px";break;case"bottom":E.style.left=D.left+D.width/2-C/2+"px";E.style.top=D.top+D.height-F+"px";break;case"right":E.style.left=D.left+D.width-C+"px";E.style.top=D.top+D.height/2-F/2+"px";break;case"topRight":E.style.left=D.left+D.width-C+"px";E.style.top=D.top+"px";break;case"bottomRight":E.style.left=D.left+D.width-C+"px";E.style.top=D.top+D.height-F+"px";break}};var g=0;var p=0;var x=r;var j=q;var A=(x-g)/2;var y=(j-p)/2;var B=k._img;var o=k._text;var t=j-p;var d=x-g;g+=c;p+=c;x=x-c-2;d=d-2*c-2;t=t-2*c-2;switch(k.textImageRelation){case"imageBeforeText":switch(k.imgPosition){case"left":case"topLeft":case"bottomLeft":z={left:g,top:p,width:g+m,height:t};e={left:g+m+i,top:p,width:d-m-i,height:t};break;case"center":case"top":case"bottom":z={left:A-f/2-m/2-i/2,top:p,width:m,height:t};e={left:z.left+m+i,top:p,width:x-z.left-m-i,height:t};break;case"right":case"topRight":case"bottomRight":z={left:x-f-m-i,top:p,width:m,height:t};e={left:z.left+m+i,top:p,width:x-z.left-m-i,height:t};break}s(B,z,k.imgPosition,m,v);s(o,e,k.textPosition,f,b);break;case"textBeforeImage":switch(k.textPosition){case"left":case"topLeft":case"bottomLeft":e={left:g,top:p,width:g+f,height:t};z={left:g+f+i,top:p,width:d-f-i,height:t};break;case"center":case"top":case"bottom":e={left:A-f/2-m/2-i/2,top:p,width:f,height:t};z={left:e.left+f+i,top:p,width:x-e.left-f-i,height:t};break;case"right":case"topRight":case"bottomRight":e={left:x-f-m-i,top:p,width:f,height:t};z={left:e.left+f+i,top:p,width:x-e.left-f-i,height:t};break}s(B,z,k.imgPosition,m,v);s(o,e,k.textPosition,f,b);break;case"imageAboveText":switch(k.imgPosition){case"topRight":case"top":case"topLeft":z={left:g,top:p,width:d,height:v};e={left:g,top:p+v+i,width:d,height:t-v-i};break;case"left":case"center":case"right":z={left:g,top:y-v/2-b/2-i/2,width:d,height:v};e={left:g,top:z.top+i+v,width:d,height:t-z.top-i-v};break;case"bottomLeft":case"bottom":case"bottomRight":z={left:g,top:j-v-b-i,width:d,height:v};e={left:g,top:z.top+i+v,width:d,height:b};break}s(B,z,k.imgPosition,m,v);s(o,e,k.textPosition,f,b);break;case"textAboveImage":switch(k.textPosition){case"topRight":case"top":case"topLeft":e={left:g,top:p,width:d,height:b};z={left:g,top:p+b+i,width:d,height:t-b-i};break;case"left":case"center":case"right":e={left:g,top:y-v/2-b/2-i/2,width:d,height:b};z={left:g,top:e.top+i+b,width:d,height:t-e.top-i-b};break;case"bottomLeft":case"bottom":case"bottomRight":e={left:g,top:j-v-b-i,width:d,height:b};z={left:g,top:e.top+i+b,width:d,height:v};break}s(B,z,k.imgPosition,m,v);s(o,e,k.textPosition,f,b);break;case"overlay":default:e={left:g,top:p,width:d,height:t};z={left:g,top:p,width:d,height:t};s(B,z,k.imgPosition,m,v);s(o,e,k.textPosition,f,b);break}},createInstance:function(d){var e=this;e._setSize();var b=e.isMaterialized();e.buttonObj=new a(e.element);if(e.imgSrc!=""||e.textPosition!=""||(e.element.value&&e.element.value.indexOf("<")>=0)||e.value!=null){e.refresh();e._addImage("jqxButton");e.buttonObj=new a(e.element)}if(!e._ariaDisabled){e.element.setAttribute("role","button")}if(e.type!==""){e.element.setAttribute("type",e.type)}if(!e.overrideTheme){e.buttonObj.addClass(e.toThemeProperty(a.jqx.cssroundedcorners(e.roundedCorners)));if(e.enableDefault){e.buttonObj.addClass(e.toThemeProperty("jqx-button"))}e.buttonObj.addClass(e.toThemeProperty("jqx-widget"))}e.isTouchDevice=a.jqx.mobile.isTouchDevice();if(!e._ariaDisabled){a.jqx.aria(this)}if(e.cursor!="arrow"){if(!e.disabled){e.element.style.cursor=e.cursor}else{e.element.style.cursor="arrow"}}var g="mouseenter mouseleave mousedown focus blur";if(e._scrollAreaButton){var g="mousedown"}if(e.isTouchDevice){e.addHandler(e.host,a.jqx.mobile.getTouchEventName("touchstart"),function(h){e.isPressed=true;e.refresh()});e.addHandler(a(document),a.jqx.mobile.getTouchEventName("touchend")+"."+e.element.id,function(h){e.isPressed=false;e.refresh()})}e.addHandler(e.host,g,function(h){switch(h.type){case"mouseenter":if(!e.isTouchDevice){if(!e.disabled&&e.enableHover){e.isMouseOver=true;e.refresh()}}break;case"mouseleave":if(!e.isTouchDevice){if(!e.disabled&&e.enableHover){e.isMouseOver=false;e.refresh()}}break;case"mousedown":if(!e.disabled){e.isPressed=true;e.refresh()}break;case"focus":if(!e.disabled){e.isFocused=true;e.refresh()}break;case"blur":if(!e.disabled){e.isFocused=false;e.refresh()}break}});e.mouseupfunc=function(h){if(!e.disabled){if(e.isPressed||e.isMouseOver){e.isPressed=false;e.refresh()}}};e.addHandler(document,"mouseup.button"+e.element.id,e.mouseupfunc);try{if(document.referrer!=""||window.frameElement){if(window.top!=null&&window.top!=window.that){var f="";if(window.parent&&document.referrer){f=document.referrer}if(f.indexOf(document.location.host)!=-1){if(window.top.document){window.top.document.addEventListener("mouseup",e._topDocumentMouseupHandler)}}}}}catch(c){}e.propertyChangeMap.roundedCorners=function(h,j,i,k){h.buttonObj.removeClass(h.toThemeProperty(a.jqx.cssroundedcorners(i)));h.buttonObj.addClass(h.toThemeProperty(a.jqx.cssroundedcorners(k)))};e.propertyChangeMap.disabled=function(h,j,i,k){if(i!=k){h.refresh();h.element.setAttribute("disabled",k);h.element.disabled=k;if(!k){h.element.style.cursor=h.cursor}else{h.element.style.cursor="default"}a.jqx.aria(h,"aria-disabled",h.disabled)}};e.propertyChangeMap.rtl=function(h,j,i,k){if(i!=k){h.refresh()}};e.propertyChangeMap.template=function(h,j,i,k){if(i!=k){h.buttonObj.removeClass(h.toThemeProperty("jqx-"+i));h.refresh()}};e.propertyChangeMap.theme=function(h,j,i,k){h.buttonObj.removeClass(h.element);if(i){h.buttonObj.removeClass("jqx-button-"+i);h.buttonObj.removeClass("jqx-widget-"+i);h.buttonObj.removeClass("jqx-fill-state-normal-"+i);h.buttonObj.removeClass(h.toThemeProperty(a.jqx.cssroundedcorners(h.roundedCorners))+"-"+i)}if(h.enableDefault){h.buttonObj.addClass(h.toThemeProperty("jqx-button"))}h.buttonObj.addClass(h.toThemeProperty("jqx-widget"));if(!h.overrideTheme){h.buttonObj.addClass(h.toThemeProperty(a.jqx.cssroundedcorners(h.roundedCorners)))}h._oldCSSCurrent=null;h.refresh()};if(e.disabled){e.element.disabled=true;e.element.setAttribute("disabled","true")}},resize:function(c,b){this.width=c;this.height=b;this._setSize()},val:function(d){var c=this;var b=c.host.find("input");if(b.length>0){if(arguments.length==0||typeof(d)=="object"){return b.val()}b.val(d);c.refresh();return b.val()}if(arguments.length==0||typeof(d)=="object"){if(c.element.nodeName.toLowerCase()=="button"){return a(c.element).text()}return c.element.value}if(arguments.length>0&&c._text){c._text.innerHTML=arguments[0];c.refresh();return}else{if(arguments.length>0&&c.element.nodeName==="DIV"){c.element.innerHTML=arguments[0];c.refresh()}}c.element.value=arguments[0];if(c.element.nodeName.toLowerCase()=="button"){a(c.element).html(arguments[0])}c.refresh()},_setSize:function(){var d=this;var b=d.height;var c=d.width;if(b){if(!isNaN(b)){b=b+"px"}d.element.style.height=b}if(c){if(!isNaN(c)){c=c+"px"}d.element.style.width=c}},_removeHandlers:function(){var b=this;b.removeHandler(b.host,"selectstart");b.removeHandler(b.host,"click");b.removeHandler(b.host,"focus");b.removeHandler(b.host,"blur");b.removeHandler(b.host,"mouseenter");b.removeHandler(b.host,"mouseleave");b.removeHandler(b.host,"mousedown");b.removeHandler(a(document),"mouseup.button"+b.element.id,b.mouseupfunc);window.top.document.removeEventListener("mouseup",b._topDocumentMouseupHandler);if(b.isTouchDevice){b.removeHandler(b.host,a.jqx.mobile.getTouchEventName("touchstart"));b.removeHandler(a(document),a.jqx.mobile.getTouchEventName("touchend")+"."+b.element.id)}b.mouseupfunc=null;delete b.mouseupfunc},focus:function(){this.host.focus()},destroy:function(){var b=this;b._removeHandlers();var c=a.data(b.element,"jqxButton");if(c){delete c.instance}b.host.removeClass();b.host.removeData();b.host.remove();delete b.set;delete b.get;delete b.call;delete b.element;delete b.host},render:function(){this.refresh()},propertiesChangedHandler:function(d,b,c){if(c&&c.width&&c.height&&Object.keys(c).length==2){d._setSize();d.refresh()}},propertyChangedHandler:function(b,c,e,d){if(this.isInitialized==undefined||this.isInitialized==false){return}if(d==e){return}if(b.batchUpdate&&b.batchUpdate.width&&b.batchUpdate.height&&Object.keys(b.batchUpdate).length==2){return}if(c==="type"){b.element.setAttribute("type",d)}if(c=="textImageRelation"||c=="textPosition"||c=="imgPosition"){if(b._img){b._positionTextAndImage()}else{b._addImage("jqxButton")}}if(c=="imgSrc"||c=="imgWidth"||c=="imgHeight"){b._addImage("jqxButton")}if(c==="value"){b.val(d)}if(c=="width"||c=="height"){b._setSize();b.refresh()}},refresh:function(){var c=this;if(c.overrideTheme){return}var e=c.toThemeProperty("jqx-fill-state-focus");var i=c.toThemeProperty("jqx-fill-state-disabled");var b=c.toThemeProperty("jqx-fill-state-normal");if(!c.enableDefault){b=""}var h=c.toThemeProperty("jqx-fill-state-hover");var f=c.toThemeProperty("jqx-fill-state-pressed");var g=c.toThemeProperty("jqx-fill-state-pressed");if(!c.enablePressed){f=""}var d="";if(!c.host){return}c.element.disabled=c.disabled;if(c.disabled){if(c._oldCSSCurrent){c.buttonObj.removeClass(c._oldCSSCurrent)}d=b+" "+i;if(c.template!=="default"&&c.template!==""){d+=" jqx-"+c.template;if(c.theme!=""){d+=" jqx-"+c.template+"-"+c.theme}}c.buttonObj.addClass(d);c._oldCSSCurrent=d;return}else{if(c.isMouseOver&&!c.isTouchDevice){if(c.isPressed){d=g}else{d=h}}else{if(c.isPressed){d=f}else{d=b}}}if(c.isFocused){d+=" "+e}if(c.template!=="default"&&c.template!==""){d+=" jqx-"+c.template;if(c.theme!=""){d+=" jqx-"+c.template+"-"+c.theme}}if(d!=c._oldCSSCurrent){if(c._oldCSSCurrent){c.buttonObj.removeClass(c._oldCSSCurrent)}c.buttonObj.addClass(d);c._oldCSSCurrent=d}if(c.rtl){c.buttonObj.addClass(c.toThemeProperty("jqx-rtl"));c.element.style.direction="rtl"}if(c.isMaterialized()){c.host.addClass("buttonRipple")}}});a.jqx.jqxWidget("jqxLinkButton","",{});a.extend(a.jqx._jqxLinkButton.prototype,{defineInstance:function(){this.disabled=false;this.height=null;this.width=null;this.rtl=false;this.href=null},createInstance:function(c){var f=this;this.host.onselectstart=function(){return false};this.host.attr("role","button");var b=this.height||this.element.offsetHeight;var d=this.width||this.element.offsetWidth;this.href=this.element.getAttribute("href");this.target=this.element.getAttribute("target");this.content=this.host.text();this.element.innerHTML="";var g=document.createElement("input");g.type="button";g.className="jqx-wrapper "+this.toThemeProperty("jqx-reset");this._setSize(g,d,b);g.value=this.content;var e=new a(this.element);e.addClass(this.toThemeProperty("jqx-link"));this.element.style.color="inherit";this.element.appendChild(g);this._setSize(g,d,b);var h=c==undefined?{}:c[0]||{};a(g).jqxButton(h);this.wrapElement=g;if(this.disabled){this.element.disabled=true}this.propertyChangeMap.disabled=function(i,k,j,l){i.element.disabled=l;i.wrapElement.jqxButton({disabled:l})};this.addHandler(a(g),"click",function(i){if(!this.disabled){f.onclick(i)}return false})},_setSize:function(c,d,b){var e=this;if(b){if(!isNaN(b)){b=b+"px"}c.style.height=b}if(d){if(!isNaN(d)){d=d+"px"}c.style.width=d}},onclick:function(b){if(this.target!=null){window.open(this.href,this.target)}else{window.location=this.href}}});a.jqx.jqxWidget("jqxRepeatButton","jqxButton",{});a.extend(a.jqx._jqxRepeatButton.prototype,{defineInstance:function(){this.delay=50},createInstance:function(d){var e=this;var c=a.jqx.mobile.isTouchDevice();var b=!c?"mouseup."+this.base.element.id:"touchend."+this.base.element.id;var f=!c?"mousedown."+this.base.element.id:"touchstart."+this.base.element.id;this.addHandler(a(document),b,function(g){if(e.timeout!=null){clearTimeout(e.timeout);e.timeout=null;e.refresh()}if(e.timer!=undefined){clearInterval(e.timer);e.timer=null;e.refresh()}});this.addHandler(this.base.host,f,function(g){if(e.timer!=null){clearInterval(e.timer)}e.timeout=setTimeout(function(){clearInterval(e.timer);e.timer=setInterval(function(h){e.ontimer(h)},e.delay)},150)});this.mousemovefunc=function(g){if(!c){if(g.which==0){if(e.timer!=null){clearInterval(e.timer);e.timer=null}}}};this.addHandler(this.base.host,"mousemove",this.mousemovefunc)},destroy:function(){var c=a.jqx.mobile.isTouchDevice();var b=!c?"mouseup."+this.base.element.id:"touchend."+this.base.element.id;var e=!c?"mousedown."+this.base.element.id:"touchstart."+this.base.element.id;this.removeHandler(this.base.host,"mousemove",this.mousemovefunc);this.removeHandler(this.base.host,e);this.removeHandler(a(document),b);this.timer=null;delete this.mousemovefunc;delete this.timer;var d=a.data(this.base.element,"jqxRepeatButton");if(d){delete d.instance}a(this.base.element).removeData();this.base.destroy();delete this.base},stop:function(){clearInterval(this.timer);this.timer=null},ontimer:function(b){var b=new a.Event("click");if(this.base!=null&&this.base.host!=null){this.base.host.trigger(b)}}});a.jqx.jqxWidget("jqxToggleButton","jqxButton",{});a.extend(a.jqx._jqxToggleButton.prototype,{defineInstance:function(){this.toggled=false;this.uiToggle=true;this.aria={"aria-checked":{name:"toggled",type:"boolean"},"aria-disabled":{name:"disabled",type:"boolean"}}},createInstance:function(b){var c=this;c.base.overrideTheme=true;c.isTouchDevice=a.jqx.mobile.isTouchDevice();a.jqx.aria(this);c.propertyChangeMap.roundedCorners=function(d,f,e,g){d.base.buttonObj.removeClass(d.toThemeProperty(a.jqx.cssroundedcorners(e)));d.base.buttonObj.addClass(d.toThemeProperty(a.jqx.cssroundedcorners(g)))};c.propertyChangeMap.toggled=function(d,f,e,g){d.refresh()};c.propertyChangeMap.disabled=function(d,f,e,g){d.base.disabled=g;d.refresh()};c.addHandler(c.base.host,"click",function(d){if(!c.base.disabled&&c.uiToggle){c.toggle()}});if(!c.isTouchDevice){c.addHandler(c.base.host,"mouseenter",function(d){if(!c.base.disabled){c.refresh()}});c.addHandler(c.base.host,"mouseleave",function(d){if(!c.base.disabled){c.refresh()}})}c.addHandler(c.base.host,"mousedown",function(d){if(!c.base.disabled){c.refresh()}});c.addHandler(a(document),"mouseup.togglebutton"+c.base.element.id,function(d){if(!c.base.disabled){c.refresh()}})},destroy:function(){this._removeHandlers();this.base.destroy()},_removeHandlers:function(){this.removeHandler(this.base.host,"click");this.removeHandler(this.base.host,"mouseenter");this.removeHandler(this.base.host,"mouseleave");this.removeHandler(this.base.host,"mousedown");this.removeHandler(a(document),"mouseup.togglebutton"+this.base.element.id)},toggle:function(){this.toggled=!this.toggled;this.refresh();a.jqx.aria(this,"aria-checked",this.toggled)},unCheck:function(){this.toggled=false;this.refresh()},check:function(){this.toggled=true;this.refresh()},refresh:function(){var c=this;var h=c.base.toThemeProperty("jqx-fill-state-disabled");var b=c.base.toThemeProperty("jqx-fill-state-normal");if(!c.base.enableDefault){b=""}var g=c.base.toThemeProperty("jqx-fill-state-hover");var e=c.base.toThemeProperty("jqx-fill-state-pressed");var f=c.base.toThemeProperty("jqx-fill-state-pressed");var d="";c.base.element.disabled=c.base.disabled;if(c.base.disabled){d=b+" "+h;c.base.buttonObj.addClass(d);return}else{if(c.base.isMouseOver&&!c.isTouchDevice){if(c.base.isPressed||c.toggled){d=f}else{d=g}}else{if(c.base.isPressed||c.toggled){d=e}else{d=b}}}if(c.base.template!=="default"&&c.base.template!==""){d+=" jqx-"+c.base.template;if(c.base.theme!=""){d+=" jqx-"+c.template+"-"+c.base.theme}}if(c.base.buttonObj.hasClass(h)&&h!=d){c.base.buttonObj.removeClass(h)}if(c.base.buttonObj.hasClass(b)&&b!=d){c.base.buttonObj.removeClass(b)}if(c.base.buttonObj.hasClass(g)&&g!=d){c.base.buttonObj.removeClass(g)}if(c.base.buttonObj.hasClass(e)&&e!=d){c.base.buttonObj.removeClass(e)}if(c.base.buttonObj.hasClass(f)&&f!=d){c.base.buttonObj.removeClass(f)}if(!c.base.buttonObj.hasClass(d)){c.base.buttonObj.addClass(d)}},_topDocumentMouseupHandler:function(b){that.isPressed=false;that.refresh()}})})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.jqxWidget("jqxCheckBox","",{});a.extend(a.jqx._jqxCheckBox.prototype,{defineInstance:function(){var b={animationShowDelay:300,animationHideDelay:300,width:null,height:null,boxSize:"16px",checked:false,hasThreeStates:false,disabled:false,enableContainerClick:true,locked:false,groupName:"",keyboardCheck:true,enableHover:true,hasInput:true,rtl:false,updated:null,disabledContainer:false,changeType:null,_canFocus:true,aria:{"aria-checked":{name:"checked",type:"boolean"},"aria-disabled":{name:"disabled",type:"boolean"}},events:["checked","unchecked","indeterminate","change"]};if(this===a.jqx._jqxCheckBox.prototype){return b}a.extend(true,this,b);return b},createInstance:function(b){var c=this;c._createFromInput("CheckBox");c.render()},_createFromInput:function(c){var j=this;if(j.element.nodeName.toLowerCase()=="input"){j.field=j.element;if(j.field.className){j._className=j.field.className}var l={title:j.field.title};if(j.field.value){l.value=j.field.value}if(j.field.checked){l.checked=true}if(j.field.id.length){l.id=j.field.id.replace(/[^\w]/g,"_")+"_"+c}else{l.id=a.jqx.utilities.createId()+"_"+c}var e=j.element.nextSibling;var h=false;if(e&&(e.nodeName=="#text"||e.nodeName=="span")){h=true}var k=0;var b=a("<div></div>",l);if(h){b.append(e);var i=a("<span>"+a(e).text()+"</span>");i.appendTo(a(document.body));k+=i.width();i.remove()}b[0].style.cssText=j.field.style.cssText;if(!j.width){j.width=a(j.field).width()+k+10}if(!j.height){j.height=a(j.field).outerHeight()+10}a(j.field).hide().after(b);var g=j.host.data();j.host=b;j.host.data(g);j.element=b[0];j.element.id=j.field.id;j.field.id=l.id;if(j._className){j.host.addClass(j._className);a(j.field).removeClass(j._className)}if(j.field.tabIndex){var d=j.field.tabIndex;j.field.tabIndex=-1;j.element.tabIndex=d}}},_addInput:function(){if(this.hasInput){if(this.input){this.input.remove()}var b=this.host.attr("name");this.input=a("<input type='hidden'/>");this.host.append(this.input);if(b){this.input.attr("name",b)}this.input.val(this.checked);this.host.attr("role","checkbox");a.jqx.aria(this)}},render:function(){this.init=true;var d=this;this.setSize();this.propertyChangeMap.width=function(h,j,i,k){d.setSize()};this.propertyChangeMap.height=function(h,j,i,k){d.setSize()};this._removeHandlers();if(!this.width){this.host.css("overflow-x","visible")}if(!this.height){this.host.css("overflow-y","visible")}if(this.checkbox){this.checkbox.remove();this.checkbox=null}if(this.checkMark){this.checkMark.remove();this.checkMark=null}if(this.box){this.box.remove();this.box=null}if(this.clear){this.clear.remove();this.clear=null}if(this.boxSize==null){this.boxSize=16}var g=parseInt(this.boxSize)+"px";var f="16px";var e=Math.floor((parseInt(this.boxSize)-16)/2);var b=e;e+="px";b+="px";if(parseInt(this.boxSize)!=16){this.checkbox=a('<div><div style="width: '+g+"; height: "+g+';"><span style="position: relative; left: '+e+"; top: "+b+"; width: "+f+"; height: "+f+';"></span></div></div>')}else{this.checkbox=a('<div><div style="width: '+g+"; height: "+g+';"><span style="width: '+g+"; height: "+g+';"></span></div></div>')}this.host.prepend(this.checkbox);if(!this.disabledContainer){if(!this.host.attr("tabIndex")){this.host.attr("tabIndex",0)}this.clear=a('<div style="clear: both;"></div>');this.host.append(this.clear)}this.checkMark=a(this.checkbox[0].firstChild.firstChild);this.box=this.checkbox;this.box.addClass(this.toThemeProperty("jqx-checkbox-default")+" "+this.toThemeProperty("jqx-fill-state-normal")+" "+this.toThemeProperty("jqx-rc-all"));if(this.disabled){this.disable()}if(!this.disabledContainer){this.host.addClass(this.toThemeProperty("jqx-widget"));this.host.addClass(this.toThemeProperty("jqx-checkbox"))}if(this.locked&&!this.disabledContainer){this.host.css("cursor","auto")}var c=this.element.getAttribute("checked");if(c=="checked"||c=="true"||c==true){this.checked=true}this._addInput();this._render();this._addHandlers();this.init=false;this._centerBox();if(this.isMaterialized()){a(this.checkbox).addClass("ripple");a.jqx.ripple(a(this.checkbox),this.host,"checkbox")}},_centerBox:function(){if(this.height&&this.height.toString().indexOf("%")==-1&&this.box){var b=parseInt(this.height);this.host.css("line-height",b+"px");var c=b-parseInt(this.boxSize)-1;c/=2;this.box.css("margin-top",parseInt(c))}},refresh:function(b){if(!b){this.setSize();this._render()}},resize:function(c,b){this.width=c;this.height=b;this.refresh()},setSize:function(){if(this.width!=null&&this.width.toString().indexOf("px")!=-1){this.host.width(this.width)}else{if(this.width!=undefined&&!isNaN(this.width)){this.host.width(this.width)}else{if(this.width!=null&&this.width.toString().indexOf("%")!=-1){this.element.style.width=this.width}}}if(this.height!=null&&this.height.toString().indexOf("px")!=-1){this.host.height(this.height)}else{if(this.height!=undefined&&!isNaN(this.height)){this.host.height(this.height)}else{if(this.height!=null&&this.height.toString().indexOf("%")!=-1){this.element.style.height=this.height}}}this._centerBox()},_addHandlers:function(){var d=this;var c=a.jqx.mobile.isTouchDevice();var b="mousedown";if(c){b=a.jqx.mobile.getTouchEventName("touchend")}this.addHandler(this.box,b,function(e){if(!d.disabled&&!d.enableContainerClick&&!d.locked){d.changeType="mouse";d.toggle();if(d.updated){e.owner=d;d.updated(e,d.checked,d.oldChecked)}if(e.preventDefault){e.preventDefault()}return false}});if(!this.disabledContainer){this.addHandler(this.host,"keydown",function(e){if(!d.disabled&&!d.locked&&d.keyboardCheck){if(e.keyCode==32){if(!d._canFocus){return true}d.changeType="keyboard";d.toggle();if(d.updated){e.owner=d;d.updated(e,d.checked,d.oldChecked)}if(e.preventDefault){e.preventDefault()}return false}}});this.addHandler(this.host,b,function(e){if(!d.disabled&&d.enableContainerClick&&!d.locked){d.clickTime=new Date();d.changeType="mouse";d.toggle();if(e.preventDefault){e.preventDefault()}if(d._canFocus){d.focus()}return false}});this.addHandler(this.host,"selectstart",function(e){if(!d.disabled&&d.enableContainerClick){if(e.preventDefault){e.preventDefault()}return false}});this.addHandler(this.host,"mouseup",function(e){if(!d.disabled&&d.enableContainerClick){if(e.preventDefault){e.preventDefault()}}});this.addHandler(this.host,"focus",function(e){if(!d.disabled&&!d.locked){if(!d._canFocus){return true}if(d.enableHover){d.box.addClass(d.toThemeProperty("jqx-checkbox-hover"))}d.box.addClass(d.toThemeProperty("jqx-fill-state-focus"));if(e.preventDefault){e.preventDefault()}a(d.checkbox).removeClass("active");if(!d.clickTime||(d.clickTime&&(new Date()-d.clickTime>300))){a(d.checkbox).addClass("active")}d.hovered=true;return false}});this.addHandler(this.host,"blur",function(e){a(d.checkbox).removeClass("active");if(!d.disabled&&!d.locked){if(!d._canFocus){return true}if(d.enableHover){d.box.removeClass(d.toThemeProperty("jqx-checkbox-hover"))}d.box.removeClass(d.toThemeProperty("jqx-fill-state-focus"));if(e.preventDefault){e.preventDefault()}d.hovered=false;return false}});this.addHandler(this.host,"mouseenter",function(e){if(d.locked){d.host.css("cursor","arrow")}if(d.enableHover){if(!d.disabled&&d.enableContainerClick&&!d.locked){d.box.addClass(d.toThemeProperty("jqx-checkbox-hover"));d.box.addClass(d.toThemeProperty("jqx-fill-state-hover"));if(e.preventDefault){e.preventDefault()}d.hovered=true;return false}}});this.addHandler(this.host,"mouseleave",function(e){if(d.enableHover){if(!d.disabled&&d.enableContainerClick&&!d.locked){d.box.removeClass(d.toThemeProperty("jqx-checkbox-hover"));d.box.removeClass(d.toThemeProperty("jqx-fill-state-hover"));if(e.preventDefault){e.preventDefault()}d.hovered=false;return false}}});this.addHandler(this.box,"mouseenter",function(){if(d.locked){return}if(!d.disabled&&!d.enableContainerClick){d.box.addClass(d.toThemeProperty("jqx-checkbox-hover"));d.box.addClass(d.toThemeProperty("jqx-fill-state-hover"))}});this.addHandler(this.box,"mouseleave",function(){if(!d.disabled&&!d.enableContainerClick){d.box.removeClass(d.toThemeProperty("jqx-checkbox-hover"));d.box.removeClass(d.toThemeProperty("jqx-fill-state-hover"))}})}},focus:function(){try{this.host.focus()}catch(b){}},_removeHandlers:function(){var c=a.jqx.mobile.isTouchDevice();var b="mousedown";if(c){b="touchend"}if(this.box){this.removeHandler(this.box,b);this.removeHandler(this.box,"mouseenter");this.removeHandler(this.box,"mouseleave")}this.removeHandler(this.host,b);this.removeHandler(this.host,"mouseup");this.removeHandler(this.host,"selectstart");this.removeHandler(this.host,"mouseenter");this.removeHandler(this.host,"mouseleave");this.removeHandler(this.host,"keydown");this.removeHandler(this.host,"blur");this.removeHandler(this.host,"focus")},_render:function(){if(!this.disabled){if(this.enableContainerClick){this.host.css("cursor","pointer")}else{if(!this.init){this.host.css("cursor","auto")}}}else{this.disable()}if(this.rtl){this.box.addClass(this.toThemeProperty("jqx-checkbox-rtl"));this.host.addClass(this.toThemeProperty("jqx-rtl"))}this.updateStates();this.host.attr("checked",this.checked)},_setState:function(c,b){if(this.checked!=c){this.checked=c;if(this.checked){this.checkMark[0].className=this.toThemeProperty("jqx-checkbox-check-checked")}else{if(this.checked==null){this.checkMark[0].className=this.toThemeProperty("jqx-checkbox-check-indeterminate")}else{this.checkMark[0].className=""}}}if(b===false||b===true){this.locked=b}if(c){this.element.setAttribute("checked",true)}else{this.element.removeAttribute("checked")}},val:function(b){if(arguments.length==0||(b!=null&&typeof(b)=="object")){return this.checked}if(typeof b=="string"){if(b=="true"){this.check()}if(b=="false"){this.uncheck()}if(b==""){this.indeterminate()}}else{if(b==true){this.check()}if(b==false){this.uncheck()}if(b==null){this.indeterminate()}}return this.checked},check:function(){this.checked=true;var c=this;this.checkMark.removeClass();this.element.setAttribute("checked",true);if(a.jqx.browser.msie||this.animationShowDelay==0){this.checkMark.addClass(this.toThemeProperty("jqx-checkbox-check-checked"))}else{this.checkMark.addClass(this.toThemeProperty("jqx-checkbox-check-checked"));this.checkMark.css("opacity",0);this.checkMark.stop().animate({opacity:1},this.animationShowDelay,function(){})}if(this.groupName!=null&&this.groupName.length>0){var d=a.find(this.toThemeProperty(".jqx-checkbox",true));a.each(d,function(){var e=a(this).jqxCheckBox("groupName");if(e==c.groupName&&this!=c.element){a(this).jqxCheckBox("uncheck")}})}var b=this.changeType;this._raiseEvent("0",true);this.changeType=b;this._raiseEvent("3",{checked:true});if(this.input!=undefined){this.input.val(this.checked);a.jqx.aria(this,"aria-checked",this.checked);this.host.attr("checked",this.checked)}},uncheck:function(){this.checked=false;var c=this;this.element.removeAttribute("checked");if(a.jqx.browser.msie||this.animationHideDelay==0){if(c.checkMark[0].className!=""){c.checkMark[0].className=""}}else{this.checkMark.css("opacity",1);this.checkMark.stop().animate({opacity:0},this.animationHideDelay,function(){if(c.checkMark[0].className!=""){c.checkMark[0].className=""}})}var b=this.changeType;this._raiseEvent("1");this.changeType=b;this._raiseEvent("3",{checked:false});if(this.input!=undefined){this.input.val(this.checked);a.jqx.aria(this,"aria-checked",this.checked);this.host.attr("checked",this.checked)}},indeterminate:function(){this.checked=null;this.checkMark.removeClass();if(a.jqx.browser.msie||this.animationShowDelay==0){this.checkMark.addClass(this.toThemeProperty("jqx-checkbox-check-indeterminate"))}else{this.checkMark.addClass(this.toThemeProperty("jqx-checkbox-check-indeterminate"));this.checkMark.css("opacity",0);this.checkMark.stop().animate({opacity:1},this.animationShowDelay,function(){})}var b=this.changeType;this._raiseEvent("2");this._raiseEvent("3",{checked:null});if(this.input!=undefined){this.input.val(this.checked);a.jqx.aria(this,"aria-checked","undefined");this.host.attr("checked","undefined")}},toggle:function(){if(this.disabled){return}if(this.locked){return}if(this.groupName!=null&&this.groupName.length>0){if(this.checked!=true){this.checked=true;this.updateStates()}return}this.oldChecked=this.checked;if(this.checked==true){this.checked=this.hasThreeStates?null:false}else{this.checked=this.checked!=null}this.updateStates();if(this.input!=undefined){this.input.val(this.checked)}},updateStates:function(){if(this.checked){this.check()}else{if(this.checked==false){this.uncheck()}else{if(this.checked==null){this.indeterminate()}}}},disable:function(){this.disabled=true;if(this.checked==true){this.checkMark.addClass(this.toThemeProperty("jqx-checkbox-check-disabled"))}else{if(this.checked==null){this.checkMark.addClass(this.toThemeProperty("jqx-checkbox-check-indeterminate-disabled"))}}this.box.addClass(this.toThemeProperty("jqx-checkbox-disabled-box"));this.host.addClass(this.toThemeProperty("jqx-checkbox-disabled"));this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled"));this.box.addClass(this.toThemeProperty("jqx-checkbox-disabled"));a.jqx.aria(this,"aria-disabled",this.disabled)},enable:function(){if(this.checked==true){this.checkMark.removeClass(this.toThemeProperty("jqx-checkbox-check-disabled"))}else{if(this.checked==null){this.checkMark.removeClass(this.toThemeProperty("jqx-checkbox-check-indeterminate-disabled"))}}this.box.removeClass(this.toThemeProperty("jqx-checkbox-disabled-box"));this.host.removeClass(this.toThemeProperty("jqx-checkbox-disabled"));this.host.removeClass(this.toThemeProperty("jqx-fill-state-disabled"));this.box.removeClass(this.toThemeProperty("jqx-checkbox-disabled"));this.disabled=false;a.jqx.aria(this,"aria-disabled",this.disabled)},destroy:function(){this.host.remove()},_raiseEvent:function(g,e){if(this.init){return}var c=this.events[g];var f=new a.Event(c);f.owner=this;if(!e){e={}}e.type=this.changeType;this.changeType=null;f.args=e;try{var b=this.host.trigger(f)}catch(d){}return b},propertiesChangedHandler:function(b,c,d){if(d.width&&d.height&&Object.keys(d).length==2){b.setSize()}},propertyChangedHandler:function(b,c,e,d){if(this.isInitialized==undefined||this.isInitialized==false){return}if(b.batchUpdate&&b.batchUpdate.width&&b.batchUpdate.height&&Object.keys(b.batchUpdate).length==2){return}if(c=="enableContainerClick"&&!b.disabled&&!b.locked){if(d){b.host.css("cursor","pointer")}else{b.host.css("cursor","auto")}}if(c=="rtl"){if(d){b.box.addClass(b.toThemeProperty("jqx-checkbox-rtl"));b.host.addClass(b.toThemeProperty("jqx-rtl"))}else{b.box.removeClass(b.toThemeProperty("jqx-checkbox-rtl"));b.host.removeClass(b.toThemeProperty("jqx-rtl"))}}if(c=="boxSize"){b.render()}if(c=="theme"){a.jqx.utilities.setTheme(e,d,b.host)}if(c=="checked"){if(d!=e){switch(d){case true:b.check();break;case false:b.uncheck();break;case null:b.indeterminate();break}}}if(c=="disabled"){if(d!=e){if(d){b.disable()}else{b.enable()}}}}})})(jqxBaseFramework);


/*
jQWidgets v7.2.0 (2019-Apr)
Copyright (c) 2011-2019 jQWidgets.
License: https://jqwidgets.com/license/
*/
/* eslint-disable */

(function(a){a.jqx.jqxWidget("jqxWindow","",{});a.extend(a.jqx._jqxWindow.prototype,{defineInstance:function(){var e={height:"auto",width:200,minHeight:50,maxHeight:1200,minWidth:50,maxWidth:1200,showCloseButton:true,disabled:false,autoOpen:true,keyboardCloseKey:"esc",title:"",content:"",draggable:true,resizable:true,animationType:"fade",closeAnimationDuration:250,showAnimationDuration:250,isModal:false,position:"center",closeButtonSize:16,closeButtonAction:"hide",modalOpacity:0.3,dragArea:null,okButton:null,cancelButton:null,dialogResult:{OK:false,Cancel:false,None:true},collapsed:false,showCollapseButton:false,collapseAnimationDuration:150,collapseButtonSize:16,rtl:false,keyboardNavigation:true,headerHeight:null,_events:["created","closed","moving","moved","open","collapse","expand","open","close","resize"],initContent:null,enableResize:true,restricter:null,autoFocus:true,closing:null,_invalidArgumentExceptions:{invalidHeight:"Invalid height!",invalidWidth:"Invalid width!",invalidMinHeight:"Invalid minHeight!",invalidMaxHeight:"Invalid maxHeight!",invalidMinWidth:"Invalid minWidth!",invalidMaxWidth:"Invalid maxWidth",invalidKeyCode:"Invalid keyCode!",invalidAnimationType:"Invalid animationType!",invalidCloseAnimationDuration:"Invalid closeAnimationDuration!",invalidShowAnimationDuration:"Invalid showAnimationDuration!",invalidPosition:"Invalid position!",invalidCloseButtonSize:"Invalid closeButtonSize!",invalidCollapseButtonSize:"Invalid collapseButtonSize!",invalidCloseButtonAction:"Invalid cluseButtonAction!",invalidModalOpacity:"Invalid modalOpacity!",invalidDragArea:"Invalid dragArea!",invalidDialogResult:"Invalid dialogResult!",invalidIsModal:"You can have just one modal window!"},_enableResizeCollapseBackup:null,_enableResizeBackup:undefined,_heightBeforeCollapse:null,_minHeightBeforeCollapse:null,_mouseDown:false,_isDragging:false,_rightContentWrapper:null,_leftContentWrapper:null,_headerContentWrapper:null,_closeButton:null,_collapseButton:null,_title:null,_content:null,_mousePosition:{},_windowPosition:{},_modalBackground:null,_SCROLL_WIDTH:21,_visible:true,modalBackgroundZIndex:1299,modalZIndex:1800,zIndex:1000,_touchEvents:{mousedown:a.jqx.mobile.getTouchEventName("touchstart"),mouseup:a.jqx.mobile.getTouchEventName("touchend"),mousemove:a.jqx.mobile.getTouchEventName("touchmove"),mouseenter:"mouseenter",mouseleave:"mouseleave",click:a.jqx.mobile.getTouchEventName("touchstart")}};if(this===a.jqx._jqxWindow.prototype){return e}a.extend(true,this,e);return e},createInstance:function(){if(this.host.initAnimate){this.host.initAnimate()}this.host.attr("role","dialog");this.host.removeAttr("data-bind");this.host.appendTo(document.body);var g=this;var f=function(l){for(var k=0;k<l.length;k++){var j=l[k];if(g[j]&&g[j].toString().indexOf("px")>=0){g[j]=parseInt(g[j],10)}}};f(["minWidth","minHeight","maxWidth","maxHeight","width","height"]);var h=function(){var j=parseInt(a(g.restricter).css("padding-top"),10);var i=parseInt(a(g.restricter).css("padding-left"),10);var k=parseInt(a(g.restricter).css("padding-bottom"),10);var m=parseInt(a(g.restricter).css("padding-right"),10);var l=a(g.restricter).coord();g.dragArea={left:i+l.left,top:j+l.top,width:1+m+a(g.restricter).width(),height:1+k+a(g.restricter).height()}};if(this.restricter){h()}if(this.restricter){this.addHandler(a(window),"resize."+this.element.id,function(){h()});this.addHandler(a(window),"orientationchanged."+this.element.id,function(){h()});this.addHandler(a(window),"orientationchange."+this.element.id,function(){h()})}this._isTouchDevice=a.jqx.mobile.isTouchDevice();this._validateProperties();this._createStructure();this._refresh();if(!this.autoOpen){this.element.style.display="none"}if(a.jqx.browser.msie){this.host.addClass(this.toThemeProperty("jqx-noshadow"))}if(!this.isModal){this._fixWindowZIndex()}this._setStartupSettings();this._positionWindow();this._raiseEvent(0);if(this.autoOpen){this._performLayout();var e=this;if(this.isModal){this._fixWindowZIndex("modal-show")}if(e.initContent){e.initContent();e._contentInitialized=true}this._raiseEvent(7);this._raiseEvent(9)}},refresh:function(){this._performLayout()},_setStartupSettings:function(){if(this.disabled){this.disable()}if(this.collapsed){this.collapsed=false;this.collapse(0)}if(!this.autoOpen){this.hide(null,0.001,true);this._visible=false}if(this.title!==null&&this.title!==""){this.setTitle(this.title)}if(this.content!==null&&this.content!==""){this.setContent(this.content)}this.title=this._headerContentWrapper.html();this.content=this._content.html()},_fixWindowZIndex:function(h){var g=a.data(document.body,"jqxwindows-list")||[],l=this.zIndex;if(!this.isModal){if(this._indexOf(this.host,g)<0){g.push(this.host)}a.data(document.body,"jqxwindows-list",g);if(g.length>1){var k=g[g.length-2];if(k.css("z-index")=="auto"){l=this.zIndex+g.length+1}else{var i=this.zIndex;l=parseInt(k.css("z-index"),10)+1;if(l<i){l=i}}}}else{if(g){g=this._removeFromArray(this.host,g);a.data(document.body,"jqxwindows-list",g)}var f=a.data(document.body,"jqxwindows-modallist");if(!f){if(h=="modal-show"){var j=[];j.push(this.host);a.data(document.body,"jqxwindows-modallist",j);f=j}else{a.data(document.body,"jqxwindows-modallist",[]);f=[]}}else{if(h=="modal-show"){f.push(this.host)}else{var e=f.indexOf(this.host);if(e!=-1){f.splice(e,1)}}}l=this.modalZIndex;a.each(f,function(){if(this.data()){if(this.data().jqxWindow){var m=this.data().jqxWindow.instance;m._modalBackground.style.zIndex=l;m.element.style.zIndex=l+1;l+=2}}});a.data(document.body,"jqxwindow-modal",this.host);return}this.element.style.zIndex=l;this._sortByStyle("z-index",g)},_validateProperties:function(){try{this._validateSize();this._validateAnimationProperties();this._validateInteractionProperties();this._validateModalProperties();if(!this.position){throw new Error(this._invalidArgumentExceptions.invalidPosition)}if(isNaN(this.closeButtonSize)||parseInt(this.closeButtonSize,10)<0){throw new Error(this._invalidArgumentExceptions.invalidCloseButtonSize)}if(isNaN(this.collapseButtonSize)||parseInt(this.collapseButtonSize,10)<0){throw new Error(this._invalidArgumentExceptions.invalidCollapseButtonSize)}}catch(e){throw new Error(e)}},_validateModalProperties:function(){if(this.modalOpacity<0||this.modalOpacity>1){throw new Error(this._invalidArgumentExceptions.invalidModalOpacity)}if(this.isModal&&!this._singleModalCheck()){throw new Error(this._invalidArgumentExceptions.invalidIsModal)}},_validateSize:function(){this._validateSizeLimits();if(this.height!=="auto"&&isNaN(parseInt(this.height,10))){throw new Error(this._invalidArgumentExceptions.invalidHeight)}if(this.width!=="auto"&&isNaN(parseInt(this.width,10))){throw new Error(this._invalidArgumentExceptions.invalidWidth)}if(this.height!=="auto"&&this.height<this.minHeight){this.height=this.minHeight}if(this.width<this.minWidth){this.width=this.minWidth}if(this.height!=="auto"&&this.height>this.maxHeight){this.height=this.maxHeight}if(this.width>this.maxWidth){this.width=this.maxWidth}if(this.dragArea===null){return}if(this.dragArea&&((this.dragArea.height!==null&&this.host.height()>this.dragArea.height)||(parseInt(this.height,10)>this.dragArea.height))||(this.dragArea.width!==null&&this.width>this.dragArea.width)||(this.maxHeight>this.dragArea.height||this.maxWidth>this.dragArea.width)){}},_validateSizeLimits:function(){if(this.maxHeight==null){this.maxHeight=9999}if(this.minWidth==null){this.minWidth=0}if(this.maxWidth==null){this.maxWidth=9999}if(this.minHeight==null){this.minHeight=0}if(isNaN(parseInt(this.minHeight,10))){throw new Error(this._invalidArgumentExceptions.invalidMinHeight)}if(isNaN(parseInt(this.maxHeight,10))){throw new Error(this._invalidArgumentExceptions.invalidMaxHeight)}if(isNaN(parseInt(this.minWidth,10))){throw new Error(this._invalidArgumentExceptions.invalidMinWidth)}if(isNaN(parseInt(this.maxWidth,10))){throw new Error(this._invalidArgumentExceptions.invalidMaxWidth)}if(this.minHeight&&this.maxHeight){if(parseInt(this.minHeight,10)>parseInt(this.maxHeight,10)&&this.maxHeight!=Number.MAX_VALUE){throw new Error(this._invalidArgumentExceptions.invalidMinHeight)}}if(this.minWidth&&this.maxWidth){if(parseInt(this.minWidth,10)>parseInt(this.maxWidth,10)&&this.maxWidth!=Number.MAX_VALUE){throw new Error(this._invalidArgumentExceptions.invalidMinWidth)}}},_validateAnimationProperties:function(){if(this.animationType!=="fade"&&this.animationType!=="slide"&&this.animationType!=="combined"&&this.animationType!=="none"){throw new Error(this._invalidArgumentExceptions.invalidAnimationType)}if(isNaN(parseInt(this.closeAnimationDuration,10))||this.closeAnimationDuration<0){throw new Error(this._invalidArgumentExceptions.invalidCloseAnimationDuration)}if(isNaN(parseInt(this.showAnimationDuration,10))||this.showAnimationDuration<0){throw new Error(this._invalidArgumentExceptions.invalidShowAnimationDuration)}},_validateInteractionProperties:function(){if(parseInt(this.keyCode,10)<0||parseInt(this.keyCode,10)>130&&this.keyCode!=="esc"){throw new Error(this._invalidArgumentExceptions.invalidKeyCode)}if(this.dragArea!==null&&(typeof this.dragArea.width==="undefined"||typeof this.dragArea.height==="undefined"||typeof this.dragArea.left==="undefined"||typeof this.dragArea.top==="undefined")){throw new Error(this._invalidArgumentExceptions.invalidDragArea)}if(!this.dialogResult||(!this.dialogResult.OK&&!this.dialogResult.Cancel&&!this.dialogResult.None)){throw new Error(this._invalidArgumentExceptions.invalidDialogResult)}if(this.closeButtonAction!=="hide"&&this.closeButtonAction!=="close"){throw new Error(this._invalidArgumentExceptions.invalidCloseButtonAction)}},_singleModalCheck:function(){var e=a.data(document.body,"jqxwindows-list")||[],f=e.length;while(f){f-=1;if(a(e[f].attr("id")).length>0){if(a(e[f].attr("id")).jqxWindow("isModal")){return false}}}return true},_createStructure:function(){var e=this.host.children();if(e.length===1){this._content=e[0];this._header=document.createElement("div");this._header.innerHTML=this.host.attr("caption");this.element.insertBefore(this._header,this._content);this.host.attr("caption","");this._header=a(this._header);this._content=a(this._content)}else{if(e.length===2){this._header=a(e[0]);this._content=a(e[1])}else{throw new Error("Invalid structure!")}}},_refresh:function(){this._render();this._addStyles();this._performLayout();this._removeEventHandlers();this._addEventHandlers();this._initializeResize()},_render:function(){this._addHeaderWrapper();this._addCloseButton();this._addCollapseButton();this._removeModal();this._makeModal()},_addHeaderWrapper:function(){if(!this._headerContentWrapper){this._header[0].innerHTML='<div style="float:left;">'+this._header[0].innerHTML+"</div>";this._headerContentWrapper=a(this._header.children()[0]);if(this.headerHeight!==null){this._header.height(this.headerHeight)}}},_addCloseButton:function(){if(!this._closeButton){this._closeButtonWrapper=document.createElement("div");this._closeButtonWrapper.className=this.toThemeProperty("jqx-window-close-button-background");this._closeButton=document.createElement("div");this._closeButton.className=this.toThemeProperty("jqx-window-close-button jqx-icon-close");this._closeButton.style.width="100%";this._closeButton.style.height="100%";this._closeButtonWrapper.appendChild(this._closeButton);this._header[0].appendChild(this._closeButtonWrapper);this._closeButtonWrapper=a(this._closeButtonWrapper);this._closeButton=a(this._closeButton)}},_addCollapseButton:function(){if(!this._collapseButton){this._collapseButtonWrapper=document.createElement("div");this._collapseButtonWrapper.className=this.toThemeProperty("jqx-window-collapse-button-background");this._collapseButton=document.createElement("div");this._collapseButton.className=this.toThemeProperty("jqx-window-collapse-button jqx-icon-arrow-up");this._collapseButton.style.width="100%";this._collapseButton.style.height="100%";this._collapseButtonWrapper.appendChild(this._collapseButton);this._header[0].appendChild(this._collapseButtonWrapper);this._collapseButtonWrapper=a(this._collapseButtonWrapper);this._collapseButton=a(this._collapseButton)}},_removeModal:function(){if(!this.isModal&&typeof this._modalBackground==="object"&&this._modalBackground!==null){a("."+this.toThemeProperty("jqx-window-modal")).remove();this._modalBackground=null}},focus:function(){try{this.host.focus();var f=this;setTimeout(function(){f.host.focus()},10)}catch(e){}},_makeModal:function(){if(this.isModal&&!this._modalBackground){var g=a.data(document.body,"jqxwindows-list");if(g){this._removeFromArray(this.host,g);a.data(document.body,"jqxwindows-list",g)}this._modalBackground=document.createElement("div");this._modalBackground.className=this.toThemeProperty("jqx-window-modal");this._setModalBackgroundStyles();document.body.appendChild(this._modalBackground);this.addHandler(this._modalBackground,this._getEvent("click"),function(){return false});var f=this;var e=function(h,i){return i.contains(h)};this.addHandler(this._modalBackground,"mouseup",function(h){f._stopResizing(f);h.preventDefault()});this.addHandler(this._modalBackground,"mousedown",function(i){var h=f._getTabbables();if(h.length>0){h[0].focus();setTimeout(function(){h[0].focus()},100)}i.preventDefault();return false});this.addHandler(a(document),"keydown.window"+this.element.id,function(k){if(k.keyCode!==9){return}var h=a.data(document.body,"jqxwindows-modallist");if(h.length>1){if(h[h.length-1][0]!=f.element){return}}var j=f._getTabbables();var l=null;var i=null;if(f.element.offsetWidth===0||f.element.offsetHeight===0){return}if(j.length>0){l=j[0];i=j[j.length-1]}if(k.target==f.element){return}if(l==null){return}if(!e(k.target,f.element)){l.focus();return false}if(k.target===i&&!k.shiftKey){l.focus();return false}else{if(k.target===l&&k.shiftKey){i.focus();return false}}})}},_addStyles:function(){this.host.addClass(this.toThemeProperty("jqx-rc-all"));this.host.addClass(this.toThemeProperty("jqx-window"));this.host.addClass(this.toThemeProperty("jqx-popup"));if(a.jqx.browser.msie){this.host.addClass(this.toThemeProperty("jqx-noshadow"))}this.host.addClass(this.toThemeProperty("jqx-widget"));this.host.addClass(this.toThemeProperty("jqx-widget-content"));this._header.addClass(this.toThemeProperty("jqx-window-header"));this._content.addClass(this.toThemeProperty("jqx-window-content"));this._header.addClass(this.toThemeProperty("jqx-widget-header"));this._content.addClass(this.toThemeProperty("jqx-widget-content"));this._header.addClass(this.toThemeProperty("jqx-disableselect"));this._header.addClass(this.toThemeProperty("jqx-rc-t"));this._content.addClass(this.toThemeProperty("jqx-rc-b"));if(!this.host.attr("tabindex")){this.element.tabIndex=0;this._header[0].tabIndex=0;this._content[0].tabIndex=0}this.element.setAttribute("hideFocus","true");this.element.style.outline="none"},_performHeaderLayout:function(){this._handleHeaderButtons();this._header[0].style.position="relative";if(this.rtl){this._headerContentWrapper[0].style.direction="rtl";this._headerContentWrapper[0].style["float"]="right"}else{this._headerContentWrapper[0].style.direction="ltr";this._headerContentWrapper[0].style["float"]="left"}this._performHeaderCloseButtonLayout();this._performHeaderCollapseButtonLayout();this._centerElement(this._headerContentWrapper,this._header,"y","margin");if(this.headerHeight){this._centerElement(this._closeButtonWrapper,this._header,"y","margin");this._centerElement(this._collapseButtonWrapper,this._header,"y","margin")}},_handleHeaderButtons:function(){if(!this._closeButtonWrapper){return}if(!this.showCloseButton){this._closeButtonWrapper[0].style.visibility="hidden"}else{this._closeButtonWrapper[0].style.visibility="visible";var e=this._toPx(this.closeButtonSize);this._closeButtonWrapper[0].style.width=e;this._closeButtonWrapper[0].style.height=e}if(!this.showCollapseButton){this._collapseButtonWrapper[0].style.visibility="hidden"}else{this._collapseButtonWrapper[0].style.visibility="visible";var f=this._toPx(this.collapseButtonSize);this._collapseButtonWrapper[0].style.width=f;this._collapseButtonWrapper[0].style.height=f}},_performHeaderCloseButtonLayout:function(){if(!this._closeButtonWrapper){return}var e=parseInt(this._header.css("padding-right"),10);if(!isNaN(e)){this._closeButtonWrapper.width(this._closeButton.width());if(!this.rtl){this._closeButtonWrapper[0].style.marginRight=this._toPx(e);this._closeButtonWrapper[0].style.marginLeft="0px"}else{this._closeButtonWrapper[0].style.marginRight="0px";this._closeButtonWrapper[0].style.marginLeft=this._toPx(e)}}this._closeButtonWrapper[0].style.position="absolute";if(!this.rtl){this._closeButtonWrapper[0].style.right="0px";this._closeButtonWrapper[0].style.left=""}else{this._closeButtonWrapper[0].style.right="";this._closeButtonWrapper[0].style.left="0px"}},_performHeaderCollapseButtonLayout:function(){if(!this._closeButtonWrapper){return}var g=parseInt(this._header.css("padding-right"),10);if(!isNaN(g)){var f=this._toPx(this.collapseButtonSize);this._collapseButtonWrapper[0].style.width=f;this._collapseButtonWrapper[0].style.height=f;if(!this.rtl){this._collapseButtonWrapper[0].style.marginRight=this._toPx(g);this._collapseButtonWrapper[0].style.marginLeft="0px"}else{this._collapseButtonWrapper[0].style.marginRight="0px";this._collapseButtonWrapper[0].style.marginLeft=this._toPx(g)}}this._collapseButtonWrapper[0].style.position="absolute";var e=this._toPx(this.showCloseButton?this._closeButton.outerWidth(true):0);if(!this.rtl){this._collapseButtonWrapper[0].style.right=e;this._collapseButtonWrapper[0].style.left=""}else{this._collapseButtonWrapper[0].style.right="";this._collapseButtonWrapper[0].style.left=e}this._centerElement(this._collapseButton,a(this._collapseButton[0].parentElement),"y")},_performWidgetLayout:function(){var e;if(this.width!=="auto"){if(this.width&&this.width.toString().indexOf("%")>=0){this.element.style.width=this.width}else{this.element.style.width=this._toPx(this.width)}}if(!this.collapsed){if(this.height!=="auto"){if(this.height&&this.height.toString().indexOf("%")>=0){this.element.style.height=this.height}else{this.element.style.height=this._toPx(this.height)}}else{this.element.style.height=this.host.height()+"px"}this.element.style.minHeight=this._toPx(this.minHeight)}this._setChildrenLayout();e=this._validateMinSize();this.element.style.maxHeight=this._toPx(this.maxHeight);this.element.style.minWidth=this._toPx(this.minWidth);this.element.style.maxWidth=this._toPx(this.maxWidth);if(!e){this._setChildrenLayout()}},_setChildrenLayout:function(){this._header.width(this.host.width()-(this._header.outerWidth(true)-this._header.width()));this._content.width(this.host.width()-(this._content.outerWidth(true)-this._content.width()));this._content.height(this.host.height()-this._header.outerHeight(true)-(this._content.outerHeight(true)-this._content.height()))},_validateMinSize:function(){var f=true;if(this.minHeight<this._header.height()){this.minHeight=this._header.height();f=false}var h=a(this._header.children()[0]).outerWidth(),e=this._header.children()[1]?a(this._header.children()[1]).outerWidth():0,g=h+e;if(this.minWidth<100){this.minWidth=Math.min(g,100);f=false}return f},_centerElement:function(h,f,e,g){if(typeof f.left==="number"&&typeof f.top==="number"&&typeof f.height==="number"&&typeof f.width==="number"){this._centerElementInArea(h,f,e)}else{this._centerElementInParent(h,f,e,g)}},_centerElementInParent:function(e,o,j,g){var n=e.css("display")==="none";var f,h;j=j.toLowerCase();if(g){f=g+"Top";h=g+"Left"}else{f="top";h="left"}if(j.indexOf("y")>=0){if(n){e[0].style.display="block"}var i=e.outerHeight(true),l;if(n){e[0].style.display="none"}l=o.height();var k=(Math.max(0,l-i))/2;e[0].style[f]=k+"px"}if(j.indexOf("x")>=0){if(n){e[0].style.display="block"}var q=e.outerWidth(true),p;if(n){e[0].style.display="none"}p=o.width();var m=(Math.max(0,p-q))/2;e[0].style[h]=m+"px"}},_centerElementInArea:function(f,e,h){h=h.toLowerCase();if(h.indexOf("y")>=0){var g=f.outerHeight(true);var j=e.height;var i=(j-g)/2;f[0].style.top=i+e.top+"px"}if(h.indexOf("x")>=0){var m=f.outerWidth(true);var l=e.width;var k=(l-m)/2;f[0].style.left=k+e.left+"px"}},_removeEventHandlers:function(){this.removeHandler(this._header,this._getEvent("mousedown"));this.removeHandler(this._header,this._getEvent("mousemove"));this.removeHandler(this._header,"focus");this.removeHandler(a(document),this._getEvent("mousemove")+"."+this.host.attr("id"));this.removeHandler(a(document),this._getEvent("mouseup")+"."+this.host.attr("id"));this.removeHandler(this.host,"keydown");this.removeHandler(this._closeButton,this._getEvent("click"));this.removeHandler(this._closeButton,this._getEvent("mouseenter"));this.removeHandler(this._closeButton,this._getEvent("mouseleave"));this.removeHandler(this._collapseButton,this._getEvent("click"));this.removeHandler(this._collapseButton,this._getEvent("mouseenter"));this.removeHandler(this._collapseButton,this._getEvent("mouseleave"));this.removeHandler(this.host,this._getEvent("mousedown"));if(this.okButton){this.removeHandler(a(this.okButton),this._getEvent("click"),this._setDialogResultHandler)}if(this.cancelButton){this.removeHandler(a(this.cancelButton),this._getEvent("click"),this._setDialogResultHandler)}this.removeHandler(this._header,this._getEvent("mouseenter"));this.removeHandler(this._header,this._getEvent("mouseleave"));this.removeHandler(this.host,"resizing",this._windowResizeHandler)},_removeFromArray:function(e,g){var f=this._indexOf(e,g);if(f>=0){return g.splice(this._indexOf(e,g),1)}else{return g}},_sortByStyle:function(e,l){for(var h=0;h<l.length;h++){for(var f=l.length-1;f>h;f--){var m=l[f],k=l[f-1],g;if(parseInt(m.css(e),10)<parseInt(k.css(e),10)){g=m;l[f]=k;l[f-1]=g}}}},_initializeResize:function(){if(this.resizable){var e=this;this.initResize({target:this.host,alsoResize:e._content,maxWidth:e.maxWidth,minWidth:e.minWidth,maxHeight:e.maxHeight,minHeight:e.minHeight,indicatorSize:10,resizeParent:e.dragArea})}},_removeResize:function(){this.removeResize()},_getEvent:function(e){if(this._isTouchDevice){return this._touchEvents[e]}else{return e}},_addEventHandlers:function(){this._addDragDropHandlers();this._addCloseHandlers();this._addCollapseHandlers();this._addFocusHandlers();this._documentResizeHandlers();this._closeButtonHover();this._collapseButtonHover();this._addDialogButtonsHandlers();this._addHeaderHoverEffect();this._addResizeHandlers();var e=this;this.addHandler(this._header,this._getEvent("mousemove"),function(){e._addHeaderCursorHandlers(e)})},_addResizeHandlers:function(){var e=this;e.addHandler(e.host,"resizing",e._windowResizeHandler,{self:e});this.addHandler(a(window),"orientationchanged."+this.element.id,function(){e._performLayout()});this.addHandler(a(window),"orientationchange."+this.element.id,function(){e._performLayout()})},_windowResizeHandler:function(h){var e=h.data.self;e._header.width(e.host.width()-(e._header.outerWidth(true)-e._header.width()));if(e.width&&e.width.toString().indexOf("%")>=0){var g=a(document.body).width()/100;var f=1/g;e.width=(f*h.args.width)+"%"}else{e.width=h.args.width}if(e.height&&e.height.toString().indexOf("%")>=0){var g=a(document.body).height()/100;var f=1/g;e.height=(f*h.args.height)+"%"}else{e.height=h.args.height}},_addHeaderHoverEffect:function(){var e=this;this.addHandler(this._header,this._getEvent("mouseenter"),function(){a(this).addClass(e.toThemeProperty("jqx-window-header-hover"))});this.addHandler(this._header,this._getEvent("mouseleave"),function(){a(this).removeClass(e.toThemeProperty("jqx-window-header-hover"))})},_addDialogButtonsHandlers:function(){if(this.okButton){this.addHandler(a(this.okButton),this._getEvent("click"),this._setDialogResultHandler,{self:this,result:"ok"})}if(this.cancelButton){this.addHandler(a(this.cancelButton),this._getEvent("click"),this._setDialogResultHandler,{self:this,result:"cancel"})}},_documentResizeHandlers:function(){var e=this;if(this.isModal){this.addHandler(a(window),"resize.window"+this.element.id,function(){if(typeof e._modalBackground==="object"&&e._modalBackground!==null){if(e.isOpen()){e._modalBackground.style.display="none"}if(!e.restricter){var f=e._getDocumentSize();e._modalBackground.style.width=f.width+"px";e._modalBackground.style.height=f.height+"px"}else{e._modalBackground.style.left=e._toPx(e.dragArea.left);e._modalBackground.style.top=e._toPx(e.dragArea.top);e._modalBackground.style.width=e._toPx(e.dragArea.width);e._modalBackground.style.height=e._toPx(e.dragArea.height)}if(e.isOpen()){e._modalBackground.style.display="block"}}})}},_setDialogResultHandler:function(f){var e=f.data.self;e._setDialogResult(f.data.result);e.closeWindow()},_setDialogResult:function(e){this.dialogResult.OK=false;this.dialogResult.None=false;this.dialogResult.Cancel=false;e=e.toLowerCase();switch(e){case"ok":this.dialogResult.OK=true;break;case"cancel":this.dialogResult.Cancel=true;break;default:this.dialogResult.None=true}},_getDocumentSize:function(){var e=a.jqx.browser.msie&&a.jqx.browser.version<9;var f=e?4:0;var g=f;if(document.body.scrollHeight>document.body.clientHeight&&e){f=this._SCROLL_WIDTH}if(document.body.scrollWidth>document.body.clientWidth&&e){g=this._SCROLL_WIDTH}return{width:a(document).width()-f,height:a(document).height()-g}},_closeButtonHover:function(){var e=this;this.addHandler(this._closeButton,this._getEvent("mouseenter"),function(){e._closeButton.addClass(e.toThemeProperty("jqx-window-close-button-hover"))});this.addHandler(this._closeButton,this._getEvent("mouseleave"),function(){e._closeButton.removeClass(e.toThemeProperty("jqx-window-close-button-hover"))})},_collapseButtonHover:function(){var e=this;this.addHandler(this._collapseButton,this._getEvent("mouseenter"),function(){e._collapseButton.addClass(e.toThemeProperty("jqx-window-collapse-button-hover"))});this.addHandler(this._collapseButton,this._getEvent("mouseleave"),function(){e._collapseButton.removeClass(e.toThemeProperty("jqx-window-collapse-button-hover"))})},_setModalBackgroundStyles:function(){if(this.isModal){var e=this._getDocumentSize();if(!(a.jqx.browser.msie&&a.jqx.browser.version<9)){this._modalBackground.style.opacity=this.modalOpacity}else{this._modalBackground.style.filter="alpha(opacity="+(this.modalOpacity*100)+")"}this._modalBackground.style.position="absolute";this._modalBackground.style.top="0px";this._modalBackground.style.left="0px";this._modalBackground.style.width=e.width;this._modalBackground.style.height=e.height;this._modalBackground.style.zIndex=this.modalBackgroundZIndex;if(!this.autoOpen){this._modalBackground.style.display="none"}}},_addFocusHandlers:function(){var e=this;this.addHandler(this.host,this._getEvent("mousedown"),function(){if(!e.isModal){e.bringToFront()}})},_indexOf:function(f,g){for(var e=0;e<g.length;e++){if(g[e][0]===f[0]){return e}}return -1},_addCloseHandlers:function(){var e=this;this.addHandler(this._closeButton,this._getEvent("click"),function(f){return e._closeWindow(f)});if(this.keyboardCloseKey!=="none"){if(typeof this.keyboardCloseKey!=="number"&&this.keyboardCloseKey.toLowerCase()==="esc"){this.keyboardCloseKey=27}}this.addHandler(this.host,"keydown",function(f){if(f.keyCode===e.keyboardCloseKey&&e.keyboardCloseKey!=null&&e.keyboardCloseKey!="none"){e._closeWindow(f)}else{e._handleKeys(f)}},{self:this});this.addHandler(this.host,"keyup",function(){if(!e.keyboardNavigation){return}if(e._moved){var h=e.host.coord();var g=h.left;var f=h.top;e._raiseEvent(3,g,f,g,f);e._moved=false}})},_handleKeys:function(f){if(!this.keyboardNavigation){return}if(!this._headerFocused){return}if(a(document.activeElement).ischildof(this._content)){return}var e=f.ctrlKey;var m=f.keyCode;var k=this.host.coord();var j=k.left;var l=k.top;var g=this._getDraggingArea();var h=this.host.width();var n=this.host.height();var o=true;var i=10;switch(m){case 37:if(!e){if(this.draggable){if(j-i>=0){this.move(j-i,l)}}}else{if(this.resizable){this.resize(h-i,n)}}o=false;break;case 38:if(!e){if(this.draggable){if(l-i>=0){this.move(j,l-i)}}}else{if(this.resizable){this.resize(h,n-i)}}o=false;break;case 39:if(!e){if(this.draggable){if(j+h+i<=g.width){this.move(j+i,l)}}}else{if(this.resizable){this.resize(h+i,n)}}o=false;break;case 40:if(!e){if(this.draggable){if(l+n+i<=g.height){this.move(j,l+i)}}}else{if(this.resizable){this.resize(h,n+i)}}o=false;break}if(!o){if(f.preventDefault){f.preventDefault()}if(f.stopPropagation){f.stopPropagation()}}return o},_addCollapseHandlers:function(){var e=this;this.addHandler(this._collapseButton,this._getEvent("click"),function(){if(!e.collapsed){e.collapse()}else{e.expand()}})},_closeWindow:function(){this.closeWindow();return false},_addHeaderCursorHandlers:function(e){if(e.resizeArea&&e.resizable&&!e.collapsed){e._header[0].style.cursor=e._resizeWrapper.style.cursor;return}else{if(e.draggable){e._header[0].style.cursor="move";return}}e._header[0].style.cursor="default";if(e._resizeWrapper){e._resizeWrapper.style.cursor="default"}},_addDragDropHandlers:function(){if(this.draggable){var e=this;this.addHandler(this.host,"focus",function(){e._headerFocused=true});this.addHandler(this.host,"blur",function(){e._headerFocused=false});this.addHandler(this._header,"focus",function(){e._headerFocused=true;return false});this.addHandler(this._header,this._getEvent("mousedown"),function(j,i,k){if(i){j.pageX=i}if(k){j.pageY=k}e._headerMouseDownHandler(e,j);return true});this.addHandler(this._header,"dragstart",function(i){if(i.preventDefault){i.preventDefault()}return false});this.addHandler(this._header,this._getEvent("mousemove"),function(i){return e._headerMouseMoveHandler(e,i)});this.addHandler(a(document),this._getEvent("mousemove")+"."+this.host.attr("id"),function(i){return e._dragHandler(e,i)});this.addHandler(a(document),this._getEvent("mouseup")+"."+this.host.attr("id"),function(i){return e._dropHandler(e,i)});try{if(document.referrer!==""||window.frameElement){var h=null;if(window.top!=null&&window.top!=window.self){if(window.parent&&document.referrer){h=document.referrer}}if(h&&h.indexOf(document.location.host)!=-1){var g=function(i){e._dropHandler(e,i)};if(window.top.document.addEventListener){window.top.document.addEventListener("mouseup",g,false)}else{if(window.top.document.attachEvent){window.top.document.attachEvent("onmouseup",g)}}}}}catch(f){}}},_headerMouseDownHandler:function(f,g){if(!f.isModal){f.bringToFront()}if(f._resizeDirection==null){var e=a.jqx.position(g);f._mousePosition.x=e.left;f._mousePosition.y=e.top;f._mouseDown=true;f._isDragging=false}},_headerMouseMoveHandler:function(f,i){if(f._mouseDown&&!f._isDragging){var j=a.jqx.mobile.getTouches(i);var k=j[0];var h=k.pageX,g=k.pageY;var e=a.jqx.position(i);h=e.left;g=e.top;if((h+3<f._mousePosition.x||h-3>f._mousePosition.x)||(g+3<f._mousePosition.y||g-3>f._mousePosition.y)){f._isDragging=true;f._mousePosition={x:h,y:g};f._windowPosition={x:f.host.coord().left,y:f.host.coord().top};a(document.body).addClass(f.toThemeProperty("jqx-disableselect"))}if(f._isTouchDevice){i.preventDefault();return true}return false}if(f._isDragging){if(f._isTouchDevice){i.preventDefault();return true}return false}return true},_dropHandler:function(g,j){var f=true;if(g._isDragging&&!g.isResizing&&!g._resizeDirection){var e=parseInt(g.host.css("left"),10),k=parseInt(g.host.css("top"),10),i=(g._isTouchDevice)?0:j.pageX,h=(g._isTouchDevice)?0:j.pageY;g.enableResize=g._enableResizeBackup;g._enableResizeBackup="undefined";g._raiseEvent(3,e,k,i,h);f=false;if(j.preventDefault!="undefined"){j.preventDefault()}if(j.originalEvent!=null){j.originalEvent.mouseHandled=true}if(j.stopPropagation!="undefined"){j.stopPropagation()}}g._isDragging=false;g._mouseDown=false;a(document.body).removeClass(g.toThemeProperty("jqx-disableselect"));return f},_dragHandler:function(m,h){if(m._isDragging&&!m.isResizing&&!m._resizeDirection){var l=(m._isTouchDevice)?h.originalEvent.which:h.which;if(typeof m._enableResizeBackup==="undefined"){m._enableResizeBackup=m.enableResize}m.enableResize=false;if(l===0&&a.jqx.browser.msie&&a.jqx.browser.version<8){return m._dropHandler(m,h)}var k=a.jqx.position(h);var j=k.left,i=k.top,g=j-m._mousePosition.x,f=i-m._mousePosition.y,e=m._windowPosition.x+g,n=m._windowPosition.y+f;m.move(e,n,h);h.preventDefault();return false}return true},_validateCoordinates:function(e,k,i,j){var h=this._getDraggingArea();e=(e<h.left)?h.left:e;k=(k<h.top)?h.top:k;var f=this.host.outerWidth(true);var g=this.host.outerHeight(true);if(e+f>=h.width+h.left-2*j){e=h.width+h.left-f-j}if(k+g>=h.height+h.top-i){k=h.height+h.top-g-i}return{x:e,y:k}},_performLayout:function(){this._performHeaderLayout();this._performWidgetLayout()},_parseDragAreaAttributes:function(){if(this.dragArea!==null){this.dragArea.height=parseInt(this.dragArea.height,10);this.dragArea.width=parseInt(this.dragArea.width,10);this.dragArea.top=parseInt(this.dragArea.top,10);this.dragArea.left=parseInt(this.dragArea.left,10)}},_positionWindow:function(){this._parseDragAreaAttributes();if(this.position instanceof Array&&this.position.length===2&&typeof this.position[0]==="number"&&typeof this.position[1]==="number"){this.element.style.left=this._toPx(this.position[0]);this.element.style.top=this._toPx(this.position[1])}else{if(this.position instanceof Object){if(this.position.left){this.host.offset(this.position)}else{if(this.position.x!==undefined&&this.position.y!==undefined){this.element.style.left=this._toPx(this.position.x);this.element.style.top=this._toPx(this.position.y)}else{if(this.position.center){this._centerElement(this.host,this.position.center,"xy");var g=this.position.center.coord();var f=parseInt(this.host.css("left"),10);var e=parseInt(this.host.css("top"),10);this.element.style.left=this._toPx(f+g.left);this.element.style.top=this._toPx(e+g.top)}}}}else{this._positionFromLiteral()}}},_getDraggingArea:function(){var e={};e.left=((this.dragArea&&this.dragArea.left)?this.dragArea.left:0);e.top=((this.dragArea&&this.dragArea.top)?this.dragArea.top:0);e.width=((this.dragArea&&this.dragArea.width)?this.dragArea.width:this._getDocumentSize().width);e.height=((this.dragArea&&this.dragArea.height)?this.dragArea.height:this._getDocumentSize().height);return e},_positionFromLiteral:function(){if(!(this.position instanceof Array)){this.position=this.position.split(",")}var e=this.position.length,f=this._getDraggingArea();while(e){e-=1;this.position[e]=this.position[e].replace(/ /g,"");switch(this.position[e]){case"top":this.element.style.top=this._toPx(f.top);break;case"left":this.element.style.left=this._toPx(f.left);break;case"bottom":this.element.style.top=this._toPx(f.height-this.host.height()+f.top);break;case"right":this.element.style.left=this._toPx(f.left+f.width-this.host.width());break;default:if(!this.dragArea){f=a(window)}this._centerElement(this.host,f,"xy");break}}},_raiseEvent:function(g){var f=this._events[g],h=a.Event(f),e={};if(g===2||g===3){e.x=arguments[1];e.y=arguments[2];e.pageX=arguments[3];e.pageY=arguments[4]}if(f==="closed"||f==="close"){e.dialogResult=this.dialogResult}h.args=e;return this.host.trigger(h)},destroy:function(){this.removeHandler(a(window),"resize.window"+this.element.id);this._removeEventHandlers();this._destroy()},_destroy:function(){if(this.isModal){if(this._modalBackground!==null){a(this._modalBackground).remove()}this.host.jqxWindow({isModal:false})}if(this.restricter){this.removeHandler(a(window),"resize."+this.element.id);this.removeHandler(a(window),"orientationchanged."+this.element.id);this.removeHandler(a(window),"orientationchange."+this.element.id)}this.host.remove();if(this._modalBackground!==null){a(this._modalBackground).remove()}},_toClose:function(f,e){return((f&&e[0]===this.element)||(e[0]!==this.element&&typeof e[0]==="object"))},propertyChangedHandler:function(e,g,m,k){this._validateProperties();switch(g){case"rtl":this._performLayout();break;case"dragArea":this._positionWindow();break;case"collapseButtonSize":this._performLayout();break;case"closeButtonSize":this._performLayout();break;case"isModal":this._refresh();this._fixWindowZIndex();if(k===false){var h=a.data(document.body,"jqxwindows-modallist");var l=[];for(var f=0;f<h.length;f++){var j=h[f][0];if(j!==this.element){l.push(h[f])}}}a.data(document.body,"jqxwindows-modallist",l);break;case"keyboardCloseKey":this._removeEventHandlers();this._addEventHandlers();break;case"disabled":if(k){this.disable()}else{this.disabled=true;this.enable()}break;case"showCloseButton":case"showCollapseButton":this._performLayout();break;case"height":this._performLayout();break;case"width":this._performLayout();break;case"title":this.setTitle(k);this.title=k;break;case"content":this.setContent(k);break;case"draggable":this._removeEventHandlers();this._addEventHandlers();this._removeResize();this._initializeResize();break;case"resizable":this.enableResize=k;if(k){this._initializeResize()}else{this._removeResize()}break;case"position":this._positionWindow();break;case"modalOpacity":this._setModalBackgroundStyles();break;case"okButton":if(k){this._addDialogButtonsHandlers()}else{this.removeHandler(this.okButton)}break;case"cancelButton":if(k){this._addDialogButtonsHandlers()}else{this.removeHandler(this.cancelButton)}break;case"collapsed":if(k){if(!m){this.collapsed=false;this.collapse(0)}}else{if(m){this.collapsed=true;this.expand(0)}}break;case"theme":a.jqx.utilities.setTheme(m,k,this.host);break;case"enableResize":return;case"maxWidth":case"maxHeight":case"minWidth":case"minHeight":e._performLayout();e._removeResize();e._initializeResize();return;default:return}},collapse:function(g){if(!this.collapsed&&this._animationInProgress!==true){if(this.host.css("display")=="none"){return}var e=this,h=this._header.outerHeight(true),i=parseInt(this._header.css("border-bottom-width"),10),f=parseInt(this._header.css("margin-bottom"),10);g=!isNaN(parseInt(g,10))?g:this.collapseAnimationDuration;if(!isNaN(i)){h-=2*i}if(!isNaN(f)){h+=f}this._heightBeforeCollapse=this.host.height();this._minHeightBeforeCollapse=this.host.css("min-height");this.element.style.minHeight=this._toPx(h);e._animationInProgress=true;this.host.animate({height:h},{duration:g,complete:function(){e._animationInProgress=false;e.collapsed=true;e._collapseButton.addClass(e.toThemeProperty("jqx-window-collapse-button-collapsed"));e._collapseButton.addClass(e.toThemeProperty("jqx-icon-arrow-down"));e._content[0].style.display="none";e._raiseEvent(5);e._raiseEvent(9);a.jqx.aria(e,"aria-expanded",false)}})}},expand:function(f){if(this.collapsed&&this._animationInProgress!==true){var e=this;f=!isNaN(parseInt(f,10))?f:this.collapseAnimationDuration;e._animationInProgress=true;this.host.animate({height:this._heightBeforeCollapse},{duration:f,complete:function(){e._animationInProgress=false;e.collapsed=false;e.element.style.minHeight=e._toPx(e._minHeightBeforeCollapse);e._collapseButton.removeClass(e.toThemeProperty("jqx-window-collapse-button-collapsed"));e._collapseButton.removeClass(e.toThemeProperty("jqx-icon-arrow-down"));e._content[0].style.display="block";e._raiseEvent(6);e._performWidgetLayout();e._raiseEvent(9);a.jqx.aria(e,"aria-expanded",true)}})}},closeAll:function(h){h=true;var g=a.data(document.body,"jqxwindows-list"),f=g.length,e=a.data(document.body,"jqxwindow-modal")||[];while(f){f-=1;if(this._toClose(h,g[f])){g[f].jqxWindow("closeWindow","close");g.splice(f,1)}}if(this._toClose(h,e)){e.jqxWindow("closeWindow","close");a.data(document.body,"jqxwindow-modal",[])}a.data(document.body,"jqxwindows-list",g)},setTitle:function(f){if(typeof f==="string"){this._headerContentWrapper.html(f)}else{if(typeof f==="object"){try{this._headerContentWrapper[0].innerHTML="";if(f instanceof HTMLElement){this._headerContentWrapper[0].appendChild(f)}else{if(f.appendTo){f.appendTo(this._headerContentWrapper)}}}catch(e){throw new Error(e)}}}this.title=f;this._performLayout()},setContent:function(h){this._contentInitialized=false;var g=this._content,j=false;while(!j){g[0].style.width="auto";g[0].style.height="auto";if(g.hasClass("jqx-window")){j=true}else{g=a(g[0].parentNode)}}if(a.isArray(h)){for(var f=0;f<h.length;f++){h[f].appendTo(this._content)}}else{if(typeof h==="string"){a(this._content[0]).html(h)}else{if(typeof h==="object"){try{this._content[0].innerHTML="";if(h instanceof HTMLElement){this._content[0].appendChild(h)}else{if(h.appendTo){h.appendTo(this._content)}}}catch(e){throw new Error(e)}}}}this.content=h;this._performLayout()},disable:function(){this.disabled=true;this._removeEventHandlers();this._header.addClass(this.toThemeProperty("jqx-window-header-disabled"));this._closeButton.addClass(this.toThemeProperty("jqx-window-close-button-disabled"));this._collapseButton.addClass(this.toThemeProperty("jqx-window-collapse-button-disabled"));this._content.addClass(this.toThemeProperty("jqx-window-content-disabled"));this.host.addClass(this.toThemeProperty("jqx-window-disabled"));this.host.addClass(this.toThemeProperty("jqx-fill-state-disabled"));this._removeResize()},enable:function(){if(this.disabled){this._addEventHandlers();this._header.removeClass(this.toThemeProperty("jqx-window-header-disabled"));this._content.removeClass(this.toThemeProperty("jqx-window-content-disabled"));this._closeButton.removeClass(this.toThemeProperty("jqx-window-close-button-disabled"));this._collapseButton.removeClass(this.toThemeProperty("jqx-window-collapse-button-disabled"));this.host.removeClass(this.toThemeProperty("jqx-window-disabled"));this.host.removeClass(this.toThemeProperty("jqx-fill-state-disabled"));this.disabled=false;this._initializeResize()}},isOpen:function(){return this._visible},closeWindow:function(f){var e=this;f=(typeof f==="undefined")?this.closeButtonAction:f;this.hide(function(){if(f==="close"){e._destroy()}})},bringToFront:function(){var f=a.data(document.body,"jqxwindows-list");if(this.isModal){f=a.data(document.body,"jqxwindows-modallist");this._fixWindowZIndex("modal-hide");this._fixWindowZIndex("modal-show");return}var k=f[f.length-1],j=parseInt(k.css("z-index"),10),g=this._indexOf(this.host,f);for(var e=f.length-1;e>g;e-=1){var h=parseInt(f[e].css("z-index"),10)-1;f[e][0].style.zIndex=h}this.element.style.zIndex=j;this._sortByStyle("z-index",f)},hide:function(i,h,e){var g=this;if(this.closing){var f=this.closing();if(f===false){return}}h=h||this.closeAnimationDuration;switch(this.animationType){case"none":this.element.style.display="none";break;case"fade":g._animationInProgress=true;this.host.fadeOut({duration:h,callback:function(){g._animationInProgress=false;if(i instanceof Function){i()}}});break;case"slide":g._animationInProgress=true;this.host.slideUp({duration:h,callback:function(){g._animationInProgress=false;if(i instanceof Function){i()}}});break;case"combined":g._animationInProgress=true;this.host.animate({opacity:0,width:"0px",height:"0px"},{duration:h,complete:function(){g._animationInProgress=false;g.element.style.display="none";if(i instanceof Function){i()}}});break}this._visible=false;if(this.isModal){a(this._modalBackground).hide();this._fixWindowZIndex("modal-hide")}if(e!==true){this._raiseEvent(1);this._raiseEvent(8)}},open:function(f,e){this.show(f,e)},close:function(g,f,e){this.hide(g,f,e)},show:function(k,j){var i=this;this._setDialogResult("none");j=j||this.showAnimationDuration;switch(this.animationType){case"none":this.element.style.display="block";break;case"fade":i._animationInProgress=true;this.host.fadeIn({duration:j,complete:function(){i._animationInProgress=false;if(k instanceof Function){k()}}});break;case"slide":i._animationInProgress=true;this.host.slideDown({duration:j,callback:function(){i._animationInProgress=false;if(k instanceof Function){k()}}});break;case"combined":this.element.style.display="block";var g=i.host.width();var e=i.host.height();this.element.style.minWidth="0px";this.element.style.minHeight="0px";this.element.style.opacity=0;this.element.style.width="0px";this.element.style.height="0px";i._animationInProgress=true;this.host.animate({opacity:1,width:g+"px",height:e+"px"},{duration:j,complete:function(){i._animationInProgress=false;i._performLayout();if(k instanceof Function){k()}}});break}if(this.isModal){a(this._modalBackground).show();this._fixWindowZIndex("modal-show")}var h=this;if(!this._visible){if(j>150&&this.animationType!="none"){setTimeout(function(){if(!h._contentInitialized){if(h.initContent){h.initContent();h._contentInitialized=true}}h._raiseEvent(7);h._raiseEvent(9)},j-150)}else{if(!h._contentInitialized){if(h.initContent){h.initContent();h._contentInitialized=true}}this._raiseEvent(7);h._raiseEvent(9)}}this._visible=true;if(i.animationType!=="combined"){this._performLayout()}if(this.autoFocus){var f=function(){if(!h._isTouchDevice){h._content[0].focus()}};f();setTimeout(function(){f()},100)}},_getTabbables:function(){var f;if(a.jqx.browser.msie&&a.jqx.browser.version<9){f=this._content.find("*")}else{f=this._content[0].querySelectorAll("*")}var e=[];a.each(f,function(){if(d(this)){e[e.length]=this}});return e},move:function(n,m,e,h){var g=0,f=0,k,j,i;n=parseInt(n,10);m=parseInt(m,10);if(a.jqx.browser.msie){if(a(window).width()>a(document).width()&&!this.dragArea){f=this._SCROLL_WIDTH}if(a(window).height()<a(document).height()&&document.documentElement.clientWidth>document.documentElement.scrollWidth&&!this.dragArea){g=this._SCROLL_WIDTH}}k=this._validateCoordinates(n,m,f,g);if(parseInt(this.host.css("left"),10)!==k.x||parseInt(this.host.css("top"),10)!==k.y){if(e){var l=a.jqx.position(e);j=l.left;i=l.top}if(j===undefined){j=n}if(i===undefined){i=m}if(h!==false){this._raiseEvent(2,k.x,k.y,j,i)}}this.element.style.left=k.x+"px";this.element.style.top=k.y+"px";this._moved=true},_toPx:function(e){if(typeof e==="number"){return e+"px"}else{return e}}});function c(g,e){var j=g.nodeName.toLowerCase();if("area"===j){var i=g.parentNode,h=i.name,f;if(!g.href||!h||i.nodeName.toLowerCase()!=="map"){return false}f=a("img[usemap=#"+h+"]")[0];return !!f&&b(f)}return(/input|select|textarea|button|object/.test(j)?!g.disabled:"a"==j?g.href||e:e)&&b(g)}function b(f){var e=a(f);return e.css("display")!=="none"&&e.css("visibility")!=="hidden"}function d(g){var e=g.getAttribute("tabindex"),f=e===null;return(f||e>=0)&&c(g,!f)}}(jqxBaseFramework));(function(b){var a=(function(c){return{resizeConfig:function(){this.resizeTarget=null;this.resizeIndicatorSize=5;this.resizeTargetChildren=null;this.isResizing=false;this.resizeArea=false;this.minWidth=1;this.maxWidth=100;this.minHeight=1;this.maxHeight=100;this.resizeParent=null;this.enableResize=true;this._resizeEvents=["resizing","resized","resize"];this._resizeMouseDown=false;this._resizeCurrentMode=null;this._mouseResizePosition={};this._resizeMethods=null;this._SCROLL_WIDTH=21},_resizeExceptions:{invalidTarget:"Invalid target!",invalidMinHeight:"Invalid minimal height!",invalidMaxHeight:"Invalid maximum height!",invalidMinWidth:"Invalid minimum width!",invalidMaxWidth:"Invalid maximum width!",invalidIndicatorSize:"Invalid indicator size!",invalidSize:"Invalid size!"},removeResize:function(){if(this.resizeTarget){var f=c(this.resizeTarget.children(".jqx-resize"));f.detach();var e=f.children();this._removeResizeEventListeners();for(var d=0;d<e.length;d+=1){c(e[d]).detach();this.resizeTarget.append(e[d])}f.remove()}this._resizeDirection=null},initResize:function(d){this.resizeConfig();this.resizeTarget=c(d.target);this.resizeIndicatorSize=d.indicatorSize||10;this.maxWidth=d.maxWidth||100;this.minWidth=d.minWidth||1;this.maxHeight=d.maxHeight||100;this.minHeight=d.minHeight||1;this.resizeParent=d.resizeParent;this._parseResizeParentProperties();this._validateResizeProperties();this._validateResizeTargetDimensions();this._getChildren(this.resizeTarget.maxWidth,this.resizeTarget.minWidth,this.resizeTarget.maxHeight,this.resizeTarget.minHeight,d.alsoResize);this._refreshResize();this._cursorBackup=this.resizeTarget.css("cursor");if(this._cursorBackup==="auto"){this._cursorBackup="default"}},_validateResizeTargetDimensions:function(){this.resizeTarget.maxWidth=this.maxWidth;this.resizeTarget.minWidth=((3*this.resizeIndicatorSize>this.minWidth)?3*this.resizeIndicatorSize:this.minWidth);this.resizeTarget.maxHeight=this.maxHeight;this.resizeTarget.minHeight=((3*this.resizeIndicatorSize>this.minHeight)?3*this.resizeIndicatorSize:this.minHeight)},_parseResizeParentProperties:function(){if(this.resizeParent){this.resizeParent.left=parseInt(this.resizeParent.left,10);this.resizeParent.top=parseInt(this.resizeParent.top,10);this.resizeParent.width=parseInt(this.resizeParent.width,10);this.resizeParent.height=parseInt(this.resizeParent.height,10)}},_getChildren:function(h,e,g,i,d){this.resizeTargetChildren=c(d);this.resizeTargetChildren=this.resizeTargetChildren.toArray();var f=this.resizeTargetChildren.length;while(f){f-=1;this.resizeTargetChildren[f]=c(this.resizeTargetChildren[f])}},_refreshResize:function(){this._renderResize();this._performResizeLayout();this._removeResizeEventListeners();this._addResizeEventHandlers()},_renderResize:function(){var d=this;if(d._resizeWrapper!==undefined&&c(d._resizeWrapper).parents().length>0){return}var e=document.createElement("div");e.className="jqx-resize jqx-rc-all";e.style.zIndex=8000;e.appendChild(d._header[0]);e.appendChild(d._content[0]);d.resizeTarget[0].appendChild(e);d._resizeWrapper=e},_performResizeLayout:function(){this._resizeWrapper.style.height=this.resizeTarget.height()+"px";this._resizeWrapper.style.width=this.resizeTarget.width()+"px"},_removeResizeEventListeners:function(){var d=this.resizeTarget.attr("id");this.removeHandler(this._resizeWrapper,"mousemove.resize"+d);this.removeHandler(this._resizeWrapper,"mousedown.resize"+d);this.removeHandler(c(document),"mousemove.resize"+d);this.removeHandler(c(document),"mouseup.resize"+d)},_addResizeEventHandlers:function(){var g=this.resizeTarget.attr("id");var d=this;if(d._isTouchDevice){this.addHandler(this._resizeWrapper,"touchmove.resize."+g,function(h){d._resizeCursorChangeHandler(d,h)});this.addHandler(this._resizeWrapper,"touchstart.resize."+g,function(h){d._resizeCursorChangeHandler(d,h);d._resizeMouseDownHandler(d,h)});this.addHandler(c(document),"touchmove.resize."+g,function(h){return d._resizeHandler(d,h)});this.addHandler(c(document),"touchend.resize."+g,function(h){d._stopResizing(d,h)})}else{this.addHandler(this._resizeWrapper,"mousemove.resize."+g,function(h){d._resizeCursorChangeHandler(d,h)});this.addHandler(this._resizeWrapper,"mousedown.resize."+g,function(h){d._resizeMouseDownHandler(d,h)});this.addHandler(c(document),"mousemove.resize."+g,function(h){return d._resizeHandler(d,h)});this.addHandler(c(document),"mouseup.resize."+g,function(h){d._stopResizing(d,h)})}try{if(document.referrer!==""||window.frameElement){var f=function(h){d._stopResizing(d,h)};if(window.top.document.addEventListener){window.top.document.addEventListener("mouseup",f,false)}else{if(window.top.document.attachEvent){window.top.document.attachEvent("onmouseup",f)}}}}catch(e){}},_stopResizing:function(d){if(d.enableResize){if(d.isResizing){d._raiseResizeEvent(1)}d._resizeMouseDown=false;d.isResizing=false;d._resizeDirection=null;if(d.resizeTarget){d.resizeTarget.removeClass("jqx-disableselect")}}if(d._cursorBackup=="undefined"){d._cursorBackup="default"}if(d._resizeWrapper){d._resizeWrapper.style.cursor=d._cursorBackup}},_resizeHandler:function(e,f){if(e.enableResize&&!e.collapsed){if(e.isResizing&&e._resizeDirection){if(f.which===0&&c.jqx.browser.msie&&c.jqx.browser.version<9){e._stopResizing(f)}if(e._isTouchDevice){var d=c.jqx.position(f);e._performResize(d.left,d.top);return false}e._performResize(f.pageX,f.pageY);return false}else{if(e._isTouchDevice){var d=c.jqx.position(f);return e._resizeCaptureCursor(d.left,d.top)}return e._resizeCaptureCursor(f.pageX,f.pageY)}}},_resizeCaptureCursor:function(e,d){if(this._resizeMouseDown&&!this.isResizing&&this._resizeDirection){var f=3;if(this._isTouchDevice){this._changeCursor(e-parseInt(this.resizeTarget.css("left"),10),d-parseInt(this.resizeTarget.css("top"),10));this._mouseResizePosition={x:e,y:d};this._prepareResizeMethods(this._resizeDirection);this._resizeBackupData();this.isResizing=true;this.resizeTarget.addClass("jqx-disableselect");return false}if((e+f<this._mouseResizePosition.x||e-f>this._mouseResizePosition.x)||(d+f<this._mouseResizePosition.y||d-f>this._mouseResizePosition.y)){this._changeCursor(e-parseInt(this.resizeTarget.css("left"),10),d-parseInt(this.resizeTarget.css("top"),10));this._mouseResizePosition={x:e,y:d};this._prepareResizeMethods(this._resizeDirection);this._resizeBackupData();this.isResizing=true;this.resizeTarget.addClass("jqx-disableselect");return false}}},_resizeBackupData:function(){this.resizeTarget.lastWidth=this.resizeTarget.width();this.resizeTarget.lastHeight=this.resizeTarget.height();this.resizeTarget.x=parseInt(this.resizeTarget.css("left"),10);this.resizeTarget.y=parseInt(this.resizeTarget.css("top"),10);this._resizeBackupChildrenSize()},_resizeBackupChildrenSize:function(){var d=this.resizeTargetChildren.length,e;while(d){d-=1;e=this.resizeTargetChildren[d];this.resizeTargetChildren[d].lastWidth=e.width();this.resizeTargetChildren[d].lastHeight=e.height()}},_performResize:function(g,f){var e=g-this._mouseResizePosition.x,d=f-this._mouseResizePosition.y;if(this._resizeDirection){this._resize(this.resizeTarget,e,d)}},_resizeCursorChangeHandler:function(e,f){if(e.enableResize&&!e.collapsed){if(!e.isResizing){if(e._isTouchDevice){var d=c.jqx.position(f);e._changeCursor(d.left-parseInt(e.resizeTarget.css("left"),10),d.top-parseInt(e.resizeTarget.css("top"),10));return}e._changeCursor(f.pageX-parseInt(e.resizeTarget.css("left"),10),f.pageY-parseInt(e.resizeTarget.css("top"),10))}}},_resizeMouseDownHandler:function(e,f){if(e.enableResize){if(e._resizeDirection!==null){e._resizeMouseDown=true;if(e._isTouchDevice){var d=c.jqx.position(f);e._mouseResizePosition.x=d.left;e._mouseResizePosition.y=d.top}else{e._mouseResizePosition.x=f.pageX;e._mouseResizePosition.y=f.pageY}f.preventDefault()}}},_validateResizeProperties:function(){try{if(!this.resizeTarget||this.resizeTarget.length!==1){throw new Error(this._resizeExceptions.invalidTarget)}if(this.minHeight<0||isNaN(parseInt(this.minHeight,10))){throw new Error(this._resizeExceptions.invalidMinHeight)}if(this.maxHeight<=0||isNaN(parseInt(this.maxHeight,10))){throw new Error(this._resizeExceptions.invalidMaxHeight)}if(this.minWidth<0||isNaN(parseInt(this.minWidth,10))){throw new Error(this._resizeExceptions.invalidMinWidth)}if(this.maxWidth<0||isNaN(parseInt(this.maxWidth,10))){throw new Error(this._resizeExceptions.invalidMaxWidth)}if(this.resizeIndicatorSize<0||isNaN(parseInt(this.resizeIndicatorSize,10))){throw new Error(this._resizeExceptions.invalidIndicatorSize)}if(this.minHeight>this.maxHeight||this.minWidth>this.maxWidth){throw new Error(this._resizeExceptions.invalidSize)}}catch(d){throw new Error(d)}},_changeCursor:function(d,e){if(this.isResizing||this._resizeMouseDown){return}this.resizeArea=true;if(d<=this.resizeIndicatorSize&&d>=0&&e<=this.resizeIndicatorSize&&e>0){this._resizeWrapper.style.cursor="nw-resize";this._resizeDirection="topleft"}else{if(e<=this.resizeIndicatorSize&&e>0&&d>=this.resizeTarget.width()-this.resizeIndicatorSize){this._resizeWrapper.style.cursor="ne-resize";this._resizeDirection="topright"}else{if(e>=this.resizeTarget.height()-this.resizeIndicatorSize&&e<this.resizeTarget.height()&&d<=this.resizeIndicatorSize&&d>=0){this._resizeWrapper.style.cursor="sw-resize";this._resizeDirection="bottomleft"}else{if(e>=this.resizeTarget.height()-this.resizeIndicatorSize&&e<this.resizeTarget.height()&&d>=this.resizeTarget.width()-this.resizeIndicatorSize&&d<this.resizeTarget.width()){this._resizeWrapper.style.cursor="se-resize";this._resizeDirection="bottomright"}else{if(d<=this.resizeIndicatorSize&&d>=0){this._resizeWrapper.style.cursor="e-resize";this._resizeDirection="left"}else{if(e<=this.resizeIndicatorSize&&e>0){this._resizeWrapper.style.cursor="n-resize";this._resizeDirection="top"}else{if(e>=this.resizeTarget.height()-this.resizeIndicatorSize&&e<this.resizeTarget.height()){this._resizeWrapper.style.cursor="n-resize";this._resizeDirection="bottom"}else{if(d>=this.resizeTarget.width()-this.resizeIndicatorSize&&d<this.resizeTarget.width()){this._resizeWrapper.style.cursor="e-resize";this._resizeDirection="right"}else{this._resizeWrapper.style.cursor=this._cursorBackup;this._resizeDirection=null;this.resizeArea=false}}}}}}}}},_prepareResizeMethods:function(d){this._resizeMethods=[];if(d.indexOf("left")>=0){this._resizeMethods.push(this._resizeLeft)}if(d.indexOf("top")>=0){this._resizeMethods.push(this._resizeTop)}if(d.indexOf("right")>=0){this._resizeMethods.push(this._resizeRight)}if(d.indexOf("bottom")>=0){this._resizeMethods.push(this._resizeBottom)}},_validateResize:function(g,d,h,f,e){if(h==="horizontal"||h==="both"){return this._validateWidth(g,f,e)}else{if(h==="vertical"||h==="both"){return this._validateHeight(d,f,e)}}return{result:false,fix:0}},_getParent:function(){if(this.resizeParent!==null&&this.resizeParent!=="undefined"&&this.resizeParent.height&&this.resizeParent.width&&this.resizeParent.top&&this.resizeParent.left){return this.resizeParent}return{left:0,top:0,width:c(document).width(),height:c(document).height()}},_validateHeight:function(e,h,g){var i=0,d=2,f=this._getParent();if(c(window).width()>c(document).width()&&c.jqx.browser.msie&&f.height===c(document).height()){i=this._SCROLL_WIDTH}if(g==="bottom"&&(e+h.position().top+i+d>f.height+f.top)){return{fix:f.height-h.position().top-i-d+f.top,result:false}}if(g==="top"&&h.lastHeight-e+h.y<f.top){return{fix:e+(h.lastHeight-e+h.y)-f.top,result:false}}if(e<h.minHeight){return{fix:h.minHeight,result:false}}if(e>h.maxHeight){return{fix:h.maxHeight,result:false}}return{result:true,fix:e}},_validateWidth:function(h,g,f){var i=0,d=2,e=this._getParent();if(c(window).height()<c(document).height()&&c.jqx.browser.msie&&document.documentElement.clientWidth>=document.documentElement.scrollWidth&&e.width===c(document).width()){i=this._SCROLL_WIDTH}if(f==="right"&&(h+g.position().left+i+d>e.width+e.left)){return{fix:e.width-g.position().left-i-d+e.left,result:false}}if(f==="left"&&(g.lastWidth-h+g.x<e.left)){return{fix:h+(g.lastWidth-h+g.x)-e.left,result:false}}if(h<g.minWidth){return{fix:g.minWidth,result:false}}if(h>g.maxWidth){return{fix:g.maxWidth,result:false}}return{result:true,fix:h}},_resize:function(h,e,d){var j=this._resizeMethods.length;for(var g=0;g<j;g++){if(this._resizeMethods[g] instanceof Function){var f={element:h,x:e,y:d,self:this};this._resizeMethods[g](f)}}this._performResizeLayout()},resize:function(g,d){if(this.resizable){var f=g-this.host.width();var e=d-this.host.height();var h="right";if(e!==0){h="bottom"}this._resizeDirection=h;this._prepareResizeMethods(this._resizeDirection);this._resizeBackupData();this.isResizing=true;this._resize(this.resizeTarget,f,e);this.isResizing=false}},_setResizeChildrenSize:function(e,f){var h=this.resizeTargetChildren.length;while(h){h--;if(f==="width"){var g=this.resizeTargetChildren[h].lastWidth-(this.resizeTarget.lastWidth-e);if(g<this.resizeTarget.maxWidth&&g>0){this.resizeTargetChildren[h].width(g)}}else{var d=this.resizeTargetChildren[h].lastHeight-(this.resizeTarget.lastHeight-e);if(d<this.resizeTarget.maxHeight&&d>0){this.resizeTargetChildren[h].height(d)}}}},_resizeRight:function(g){var h=g.element.lastWidth+g.x,d=g.self._validateResize(h,0,"horizontal",g.element,"right");if(!d.result){h=d.fix}if(g.element.width()!==h){g.self._setResizeChildrenSize(h,"width");g.element.width(h);if(g.self.width.toString().indexOf("%")>=0){var f=c(document.body).width()/100;var e=1/f;g.element[0].style.width=(e*h)+"%";g.self._setChildrenLayout()}g.self._raiseResizeEvent(0)}return h},_resizeLeft:function(h){var i=h.element.lastWidth-h.x,e=h.self._validateResize(i,0,"horizontal",h.element,"left"),d=h.element.x+h.x;if(!e.result){d=h.element.x+(h.element.lastWidth-e.fix);i=e.fix;return}if(h.element.width()!==i){h.self._setResizeChildrenSize(i,"width");h.element.width(i);if(h.self.width.toString().indexOf("%")>=0){var g=c(document.body).width()/100;var f=1/g;h.element[0].style.width=(f*i)+"%";h.self._setChildrenLayout()}h.element[0].style.left=h.self._toPx(d);h.self._raiseResizeEvent(0)}return i},_resizeBottom:function(h){var e=h.element.lastHeight+h.y,d=h.self._validateResize(0,e,"vertical",h.element,"bottom");if(!d.result){e=d.fix}if(h.element.height()!==e){h.self._setResizeChildrenSize(e,"height");h.element.height(e);if(h.self.height.toString().indexOf("%")>=0){var g=c(document.body).height()/100;var f=1/g;h.element[0].style.height=(f*e)+"%";h.self._setChildrenLayout()}h.self._raiseResizeEvent(0)}return e},_resizeTop:function(h){var e=h.element.lastHeight-h.y,d=h.self._validateResize(0,e,"vertical",h.element,"top"),i=h.element.y+h.y;if(!d.result){i=h.element.y+(h.element.lastHeight-d.fix);e=d.fix;return}if(h.element.height()!==e){h.self._setResizeChildrenSize(e,"height");h.element.height(e);if(h.self.height.toString().indexOf("%")>=0){var g=c(document.body).height()/100;var f=1/g;h.element[0].style.height=(f*e)+"%";h.self._setChildrenLayout()}h.element[0].style.top=h.self._toPx(i);h.self._raiseResizeEvent(0)}return e},_raiseResizeEvent:function(f){var e=this._resizeEvents[f],g=c.Event(e),d={};d.width=parseInt(this.resizeTarget[0].style.width,10);d.height=parseInt(this.resizeTarget[0].style.height,10);g.args=d;if(f===0){e=this._resizeEvents[2];var h=c.Event(e);h.args=d;this.resizeTarget.trigger(h)}return this.resizeTarget.trigger(g)}}}(jqxBaseFramework));b.extend(b.jqx._jqxWindow.prototype,a)}(jqxBaseFramework));


