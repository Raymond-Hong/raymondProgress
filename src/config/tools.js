/**
 * 输入数字返回日期的yyyy-MM-dd格式 没有年月 则返回当时的年月
 * @returns  2018-08-05 (当前为2018年8月)
 * @param {*} params 20180805 or 0805 or 805 or 05 or 5
 */
function numberToDateFormat(params) {
  if (/^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/.test(params)) {
    let ymd = params.split('-');
    let nbs = [...ymd[0], ...ymd[1], ...ymd[2]];
    let year = nbs[0] + '' + nbs[1] + nbs[2] + nbs[3];
    params = nbs[4] + '' + nbs[5] + nbs[6] + nbs[7];
    return numberFourFormat(~~year, params);
  }
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  if (/^[0-9]{2}$/.test(params)) {
    return numberTwoFormat(year, month, params);
  } else if (/^[1-9]$/.test(params)) {
    return year + "-" + month + "-0" + params;
  } else if (/^[0-9]{3}$/.test(params)) {
    return numberThreeFormat(year, params);
  } else if (/^[0-9]{4}$/.test(params)) {
    return numberFourFormat(year, params);
  } else if (/^[0-9]{8}$/.test(params)) {
    let nbs = [...params];
    year = nbs[0] + '' + nbs[1] + nbs[2] + nbs[3];
    params = nbs[4] + '' + nbs[5] + nbs[6] + nbs[7];
    return numberFourFormat(~~year, params);
  } else {
    return null;
  }
}
/**
 * 返回日期的yyyy-MM-dd格式
 * @returns 2018-08-05
 * @param {*} year 2018
 * @param {*} month 08
 * @param {*} day 5 or 05
 */
function numberTwoFormat(year, month, day) {
  let maxDay = monthMaxDay(year, ~~month);
  if (~~day <= maxDay && ~~day > 0) {
    return year + "-" + month + "-" + day;
  } else {
    return null;
  }
}
/**
 * 返回日期的yyyy-MM-dd格式
 * @returns 2018-08-05
 * @param {*} year 2018
 * @param {*} params 805
 */
function numberThreeFormat(year, params) {
  let nbs = [...params];
  if (!nbs[0]) {
    return null;
  } else {
    let day = nbs[1] + '' + nbs[2];
    return numberTwoFormat(year, '0' + nbs[0], day);
  }
}
/**
 * 返回日期的yyyy-MM-dd格式
 * @returns 2018-08-05
 * @param {*} year 2018
 * @param {*} params 0805
 */
function numberFourFormat(year, params) {
  let nbs = [...params];
  let month = nbs[0] + '' + nbs[1];
  if (~~month > 12 || ~~month < 1) {
    return null;
  } else {
    let day = nbs[2] + '' + nbs[3];
    return numberTwoFormat(year, month, day);
  }
}
/**
 * 判断是否闰年
 * @returns false
 * @param {*} year 2018
 */
function leapYear(year) {
  return !year % 400 || !year % 4 && year % 100;
}
/**
 * 返回当月最大的天数
 * @returns  31
 * @param {*} year 2018
 * @param {*} month 8
 */
function monthMaxDay(year, month) {
  let max = 31;
  switch (month) {
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      max = 31;
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      max = 30;
      break;
    case 2:
      if (leapYear(year)) {
        max = 29;
      } else {
        max = 28;
      }
  }
  return max;
}
Date.prototype.parse = function () {
  let month = this.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  let day = this.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  return this.getFullYear() + '-' + month + '-' + day;
}
/**
 * @param 2018-08-05
 * @returns Date
 */
Date.prototype.strToDate = function (params) {
  if (/^[0-9]{4}[-][0-9]{2}[-][0-9]{2}$/.test(params)) {
    let ymd = params.split('-');
    let nbs = [...ymd[0], ...ymd[1], ...ymd[2]];
    let year = nbs[0] + '' + nbs[1] + nbs[2] + nbs[3];
    params = nbs[4] + '' + nbs[5] + nbs[6] + nbs[7];
    let format = numberFourFormat(~~year, params);
    if (format) {
      this.setFullYear(~~ymd[0], ~~ymd[1] - 1, ~~ymd[2]);
      return this;
    }
  }
  return null;
}

function drag(elem) {
  var disX,
    disY;
  addEvent(elem, 'mousedown', function (e) {
    var event = e || window.event;
    disX = event.clientX - parseInt(getStyle(elem, 'left'));
    disY = event.clientY - parseInt(getStyle(elem, 'top'));
    document.onmousemove = function (e) {
      var event = e || window.event;
      elem.style.left = event.clientX - disX + 'px';
      elem.style.top = event.clientY - disY + 'px';
    };
    addEvent(document, 'mouseup', function () {
      document.onmousemove = null;
    });
  });
}

function addEvent(elem, type, handle) {
  if (elem.addEventListener) {
    addEvent = function (elem, type, handle) {
      elem.addEventListener(type, handle, false);
    }
  } else if (elem.attachEvent) {
    addEvent = function (elem, type, handle) {
      elem.attachEvent('on' + type, function () {
        handle.call(elem);
      });
    }
  } else {
    addEvent = function (elem, type, handle) {
      elem['on' + type] = handle;
    }
  }
  addEvent(elem, type, handle);
}

function getStyle(elem, prop) {
  if (window.getComputedStyle) {
    getStyle = function (elem, prop) {
      return window.getComputedStyle(elem, null)[prop];
    }
  } else {
    getStyle = function (elem, prop) {
      return elem.currentStyle[prop];
    }
  }
  return getStyle(elem, prop);
}

function dynamicProp(obj, json, callBack) {
  clearInterval(obj.timer);
  var iSpeed, iCur;
  obj.timer = setInterval(function () {
    var bStop = true;
    for (var attr in json) {
      if (attr == 'opacity') {
        iCur = parseFloat(getStyle(obj, 'opacity')) * 100;
      } else {
        iCur = parseInt(getStyle(obj, attr));
      }
      iSpeed = (json[attr] - iCur) / 7;
      iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
      if (attr == 'opacity') {
        obj.style.opacity = (iCur + iSpeed) / 100;
      } else {
        obj.style[attr] = iCur + iSpeed + 'px';
      }
      if (json[attr] != iCur) {
        bStop = false;
      }
    }
    if (bStop) {
      clearInterval(obj.timer);
      typeof callBack == 'function' ? callBack() : '';
    }
  }, 30);
}

function getViewportOffset() {
  if (window.innerWidth) {
    getViewportOffset = function () {
      return {
        w: window.innerWidth,
        h: window.innerHeight
      }
    }
  } else {
    if (document.compatMode === "BackCompat") {
      getViewportOffset = function () {
        return {
          w: document.body.clientWidth,
          h: document.body.clientHeight
        }
      }
    } else {
      getViewportOffset = function () {
        return {
          w: document.documentElement.clientWidth,
          h: document.documentElement.clientHeight
        }
      }
    }
  }
  getViewportOffset();
}

function getScrollOffset() {
  if (window.pageYOffset) {
    getScrollOffset = function () {
      return {
        x: window.pageXOffset,
        y: window.pageYOffset
      }
    }
  } else {
    getScrollOffset = function () {
      return {
        x: document.documentElement.scrollLeft + document.body.scrollLeft,
        y: document.documentElement.scrollTop + document.body.scrollTop
      }
    }
  }
  getScrollOffset();
}
Element.prototype.insertAfter = function (targetNode, afterNode) {
  var beforeNode = afterNode.nextElementSibling;
  if (beforeNode == null) {
    this.appendChild(targetNode);
  } else {
    this.insertBefore(targetNode, beforeNode);
  }
}
const inherit = (function () {
  function F() { };
  return function (Target, Origin) {
    F.prototype = Origin.prototype;
    Target.prototype = new F();
    Target.prototype.constructor = Target;
    Target.prototype.uber = Origin.prototype; //记录继承于谁
  }
}());

function deepClone(origin, target) {
  var target = target || {},
    toStr = Object.prototype.toString,
    arrStr = '[object Array]';
  for (var prop in origin) {
    if (origin.hasOwnProperty(prop)) {
      if (typeof (origin[prop]) == 'object') {
        if (toStr.call(origin[prop]) == arrStr) {
          target[prop] = [];
        } else {
          target[prop] = {};
        }
        deepClone(origin[prop], target[prop]);
      } else {
        target[prop] = origin[prop];
      }
    }
  }
  return target;
}
Array.prototype.unique = function () {
  var temp = {},
    arr = [],
    len = this.length;
  for (var i = 0, arrElem; arrElem = this[i]; ++i) {
    if (!temp[arrElem]) {
      temp[arrElem] = 'a';
      arr[arr.length] = arrElem;
    }
  }
  return arr;
}
/**
 * @returns 1,000
 * @param {*} num 1000
 */
function numberToMoney(num) {
  if (!num) {
    return num;
  }
  num += "";
  return num.replace(/(?=(\B)(\d{3})+$)/g, ',');
}

function moneyToNumber(money) {
  if (!money) {
    return money;
  }
  return ~~money.replace(/,/g, '');
}

function loadScript(url, callBack) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState == 'complete' || script.readyState == 'loaded') {
        callBack && callBack();
      }
    }
  } else {
    script.onload = function () {
      callBack && callBack();
    }
  }
  script.src = url;
  document.head.appendChild(script);
}

function stopDefaultEvent(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  } else {
    window.event.returnValue = false; //兼容IE
  }
}
// 节流
function throttle(handler, wait) {
  var lastTime = 0;
  return function (e) {
    var nowTime = new Date().getTime();
    if (nowTime - lastTime > wait) {
      handler.apply(this, arguments);
      lastTime = nowTime;
    }
  }
}
// 防抖
function debounce(handler, delay) {
  var timer = null;
  return function () {
    var _self = this,
      _arg = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      handler.apply(_self, _arg);
    }, delay);
  }
}

function Curry(fn, length) {
  var len = length || fn.length;
  return function () {
    if (arguments.length < len) {
      return Curry.call(this, FixedParamsCurry.apply(this, [fn].concat([].slice.call(arguments))), len - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  }

  function FixedParamsCurry(fn) {
    var _arg = [].slice.call(arguments, 1);
    return function () {
      return fn.apply(this, _arg.concat([].slice.call(arguments)));
    }
  }
}
// 判断是否手机
function isPhone() {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
}

Array.prototype.flatten = function () {
  return this.reduce(function (prev, item) {
    return {}.toString.call(item) == '[object Array]' ? prev.concat(item.flatten()) : prev.concat(item);
  }, []);
}
// 单例模式
function getSingle(func) {
  var result;
  return function () {
    if (!result) {
      result = func.apply(this, arguments);
    }
    return result;
  }
}
// requestAnimationFrame 使用
const usingRAF = (function () {
  let rafId, lastTime = 0;
  return function (fn, obj, delay = 0) {
      if (typeof fn != 'function' || typeof obj != 'object' || typeof obj.stop != 'boolean') {
          throw ('missing parameter');
      }
      rafId = window.requestAnimationFrame(passValue);
      return passValue;
      function passValue(timestamp) {
        if (!obj.stop) {
            if (timestamp - delay >= lastTime) {
                lastTime = timestamp;
                fn.call(null, timestamp);
            }
            rafId = window.requestAnimationFrame(passValue);
        } else {
            window.cancelAnimationFrame(rafId);
        }
      }
  }
}());