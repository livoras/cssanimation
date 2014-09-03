(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var CSSAmination, tl;

CSSAmination = require("./src/cssanim.coffee");

tl = new CSSAmination;

CSSAmination.set(".box", {
  "width": "50px",
  "height": "50px",
  "border": "1px solid #ccc",
  "position": "fixed",
  "top": "0px",
  "left": "0px"
});

tl = new CSSAmination;

tl.to(".box", 0.5, {
  x: 50,
  y: 200,
  "background-color": "red",
  "rotationZ": 360,
  transformOrigin: "right bottom"
}).to(".box", 0.5, {
  "opacity": "0",
  x: 50,
  "background-color": "blue"
}).call((function(_this) {
  return function() {
    return console.log("FUCK");
  };
})(this)).to(".box", 1, {
  "opacity": "1",
  x: 100,
  y: 0
}).to(".box1", 0.5, {
  y: 200,
  "background-color": "yellow",
  scaleX: 1.5,
  scaleY: 1.5
}, "fuck").to(".box2", 0.5, {
  y: 400,
  "background-color": "green",
  scaleX: 1.5,
  scaleY: 1.5,
  delay: 6
}, "fuck").set(".box2", {
  "border": "2px solid red"
}).to(".box", 1, {
  x: 200
}).delay(2).to(".box2", 1, {
  x: 150,
  rotationZ: -720,
  "border-radius": "100px"
}).delay(2).to(".box1", 1, {
  x: 100,
  skewX: 30
}).delay(2).to(".box3", 1, {
  x: 50,
  onComplete: function() {
    return console.log("fuck--");
  }
}).to(".box", 1, {
  x: 0,
  y: 0,
  scaleX: 0,
  scaleY: 0,
  ease: "ease-in-out"
});

document.getElementById("start").addEventListener("click", function() {
  return tl.start();
});

document.getElementById("stop").addEventListener("click", function() {
  return tl.stop();
});

document.getElementById("pause").addEventListener("click", function() {
  return tl.pause();
});

document.getElementById("resume").addEventListener("click", function() {
  return tl.resume();
});

tl.start();



},{"./src/cssanim.coffee":2}],2:[function(require,module,exports){
var CSSAmination, animate, camelize, clear, css, disableAnimation, enableAnimation, getDoms, processStateToStyle, set, setOrAnimate, setTransform, _ref,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ref = require("./helpers.coffee"), getDoms = _ref.getDoms, setTransform = _ref.setTransform, css = _ref.css, camelize = _ref.camelize;

clear = function(selector) {
  var dom, _i, _len, _ref1, _results;
  _ref1 = getDoms(selector);
  _results = [];
  for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
    dom = _ref1[_i];
    _results.push(dom.style.cssText = "");
  }
  return _results;
};

set = function(selector, style) {
  var dom, doms, _i, _len, _results;
  doms = getDoms(selector);
  _results = [];
  for (_i = 0, _len = doms.length; _i < _len; _i++) {
    dom = doms[_i];
    _results.push(css(dom, style));
  }
  return _results;
};

CSSAmination = (function() {
  function CSSAmination() {
    this.seq = [];
    this.labels = {};
    this.allSelectors = [];
  }

  CSSAmination.prototype.to = function(selector, secs, style, label) {
    var animationObj;
    this._addSelector(selector);
    animationObj = {
      selector: selector,
      secs: secs,
      style: style
    };
    if (label) {
      if (this.labels[label]) {
        this.labels[label].push(animationObj);
      } else {
        this.labels[label] = [animationObj];
        this.seq.push(label);
      }
    } else {
      this.seq.push(animationObj);
    }
    return this;
  };

  CSSAmination.prototype.set = function(selector, style, label) {
    var cssObj;
    this._addSelector(selector);
    cssObj = {
      selector: selector,
      style: style
    };
    if (label) {
      if (this.labels[label]) {
        this.labels[label].push(cssObj);
      } else {
        this.labels[label] = [cssObj];
        this.seq.push(label);
      }
    } else {
      this.seq.push(cssObj);
    }
    return this;
  };

  CSSAmination.prototype.delay = function(secs) {
    this.seq.push(secs);
    return this;
  };

  CSSAmination.prototype.call = function(fn) {
    this.seq.push(fn);
    return this;
  };

  CSSAmination.prototype.start = function() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.currentProgress = 0;
    this._loop();
    return this;
  };

  CSSAmination.prototype._loop = function() {
    var delay_max, max, state, type, _i, _len, _loop, _ref1;
    if (this.currentProgress === this.seq.length || this.forceStop) {
      this.isRunning = false;
      this.forceStop = false;
      return;
    }
    if (this.isPause) {
      return;
    }
    state = this.seq[this.currentProgress];
    this.currentProgress++;
    type = typeof state;
    _loop = (function(_this) {
      return function() {
        return _this._loop();
      };
    })(this);
    if (type === "number") {
      return setTimeout(_loop, state * 1000);
    } else if (type === "function") {
      state();
      return _loop();
    } else if (type === "string") {
      max = 0;
      delay_max = 0;
      _ref1 = this.labels[state];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        state = _ref1[_i];
        max = state.secs > max ? state.secs : max;
        delay_max = state.style.delay > delay_max ? state.style.delay : delay_max;
        setOrAnimate(state);
      }
      console.log(delay_max + max);
      return setTimeout(_loop, (delay_max + max) * 1000);
    } else if (type === "object") {
      return setOrAnimate(state, _loop);
    }
  };

  CSSAmination.prototype.pause = function() {
    this.isPause = true;
    return this;
  };

  CSSAmination.prototype.resume = function() {
    if (!this.isPause) {
      return;
    }
    this.isPause = false;
    this._loop();
    return this;
  };

  CSSAmination.prototype.stop = function(isReset) {
    this.forceStop = true;
    this.isRunning = false;
    this.reset();
    return this;
  };

  CSSAmination.prototype.reset = function() {
    var selector;
    selector = this.allSelectors.join(", ");
    clear(selector);
    return this;
  };

  CSSAmination.prototype._addSelector = function(selector) {
    if (__indexOf.call(this.allSelectors, selector) < 0) {
      return this.allSelectors.push(selector);
    }
  };

  return CSSAmination;

})();

setOrAnimate = function(state, cb) {
  var _animate;
  _animate = function() {
    return animate(state, cb);
  };
  if (!state.secs) {
    set(state.selector, state.style);
    return typeof cb === "function" ? cb() : void 0;
  } else {
    if (!state.style.delay) {
      return _animate();
    } else {
      return setTimeout(_animate, state.style.delay);
    }
  }
};

animate = function(state, cb) {
  var delay, doms, _animate;
  doms = getDoms(state.selector);
  delay = state.style.delay || 0;
  console.log(delay, 'fuck');
  _animate = function() {
    var dom, style, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = doms.length; _i < _len; _i++) {
      dom = doms[_i];
      enableAnimation(dom, state.secs, state.style.ease);
      style = processStateToStyle(state.style);
      _results.push(css(dom, style));
    }
    return _results;
  };
  if (delay) {
    setTimeout(_animate, delay);
  } else {
    _animate();
  }
  return setTimeout(function() {
    var dom, _base, _i, _len;
    for (_i = 0, _len = doms.length; _i < _len; _i++) {
      dom = doms[_i];
      disableAnimation(dom);
    }
    if (typeof cb === "function") {
      cb();
    }
    return typeof (_base = state.style).onComplete === "function" ? _base.onComplete() : void 0;
  }, (state.secs + delay) * 1000);
};

enableAnimation = function(dom, duration, ease) {
  ease = ease || "ease";
  if (!/translateZ\(.+?\)/.test(dom.style.webkitTransfom)) {
    dom.style.webkitTransfom += " translateZ(0px)";
  }
  dom.style.webkitBackfaceVisibility = "hidden";
  dom.style.webkitPerspective = "1000";
  return dom.style.webkitTransition = "all " + duration + "s " + ease;
};

disableAnimation = function(dom) {
  dom.style.webkitTransition = "";
  return dom.style.transition = "";
};

processStateToStyle = function(style) {
  return style;
};

CSSAmination.set = set;

module.exports = CSSAmination;



},{"./helpers.coffee":3}],3:[function(require,module,exports){
var camelize, css, getDoms, setTransform;

getDoms = function(selector) {
  var doms;
  if (typeof selector === "string") {
    doms = document.querySelectorAll(selector);
    if (!doms) {
      throw "" + selector + " is empty";
    }
    doms = [].slice.call(doms, 0);
  } else if (selector[0]) {
    doms = [selector[0]];
  }
  return doms;
};

css = function(dom, style) {
  var key, value, _results;
  if (style.transformOrigin) {
    dom.style["webkitTransformOrigin"] = style.transformOrigin;
  } else {
    dom.style["webkitTransformOrigin"] = "";
    dom.style["transformOrigin"] = "";
  }
  _results = [];
  for (key in style) {
    value = style[key];
    if (key === "x" || key === "y" || key === "z" || key === "rotationX" || key === "rotationY" || key === "rotationZ" || key === "skewY" || key === "skewX" || key === "scaleX" || key === "scaleY" || key === "scaleZ") {
      _results.push(setTransform(dom, key, value));
    } else {
      key = camelize(key);
      if (key in dom.style) {
        _results.push(dom.style[key] = value);
      } else {
        _results.push(void 0);
      }
    }
  }
  return _results;
};

camelize = function(str) {
  return str.replace(/-+(.)?/g, function(match, chr) {
    if (chr) {
      return chr.toUpperCase();
    } else {
      return "";
    }
  });
};

setTransform = function(dom, key, value) {
  var REG, transformStr;
  transformStr = dom.style.webkitTransform;
  if (key === "x") {
    REG = /translateX\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "translateX(" + value + "px)");
    } else {
      dom.style.webkitTransform += " translateX(" + value + "px)";
    }
    return;
  }
  if (key === "y") {
    REG = /translateY\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "translateY(" + value + "px)");
    } else {
      dom.style.webkitTransform += " translateY(" + value + "px)";
    }
    return;
  }
  if (key === "z") {
    REG = /translateZ\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "translateZ(" + value + "px)");
    } else {
      dom.style.webkitTransform += " translateZ(" + value + "px)";
    }
    return;
  }
  if (key === "rotationX") {
    REG = /rotateX\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "rotateX(" + value + "deg)");
    } else {
      dom.style.webkitTransform += " rotateX(" + value + "deg)";
    }
    return;
  }
  if (key === "rotationY") {
    REG = /rotateY\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "rotateY(" + value + "deg)");
    } else {
      dom.style.webkitTransform += " rotateY(" + value + "deg)";
    }
    return;
  }
  if (key === "rotationZ") {
    REG = /rotateZ\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "rotateZ(" + value + "deg)");
    } else {
      dom.style.webkitTransform += " rotateZ(" + value + "deg)";
    }
    return;
  }
  if (key === "scaleX") {
    REG = /scaleX\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "scaleX(" + value + ")");
    } else {
      dom.style.webkitTransform += " scaleX(" + value + ")";
    }
    return;
  }
  if (key === "scaleY") {
    REG = /scaleY\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "scaleY(" + value + ")");
    } else {
      dom.style.webkitTransform += " scaleY(" + value + ")";
    }
    return;
  }
  if (key === "scaleZ") {
    REG = /scaleZ\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "scaleZ(" + value + ")");
    } else {
      dom.style.webkitTransform += " scaleZ(" + value + ")";
    }
    return;
  }
  if (key === "skewX") {
    REG = /skewX\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "skewX(" + value + "deg)");
    } else {
      dom.style.webkitTransform += " skewX(" + value + "deg)";
    }
    return;
  }
  if (key === "skewY") {
    REG = /skewY\(.+?\)/;
    if (REG.test(transformStr)) {
      dom.style.webkitTransform = transformStr.replace(REG, "skewY(" + value + "deg)");
    } else {
      dom.style.webkitTransform += " skewY(" + value + "deg)";
    }
  }
};

module.exports = {
  getDoms: getDoms,
  setTransform: setTransform,
  css: css,
  camelize: camelize
};



},{}]},{},[1]);