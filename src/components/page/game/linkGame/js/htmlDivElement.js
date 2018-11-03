/**
 * @create-date 2018-09-12
 * @author Raymond
 * @param {一個格子的寬} width 
 * @param {一個格子的高} height 
 * @param {6=>即6*6} rowcol 
 */
HTMLDivElement.prototype.createLinkGame = function (width, height, rowcol,imgArr,fromTextArr) {
    var oImgDivArr = [];
    var textArr = [];
    var lastClick = [];
    if(imgArr){
      imgArr = shuffle(imgArr.concat(imgArr));
    }else{
      if(fromTextArr){
        textArr = fromTextArr;
      }else{
        var startLetter = 'A'.charCodeAt(0);
        while (textArr.length < rowcol*rowcol) {
          textArr.push(String.fromCharCode(startLetter));
          textArr.push(String.fromCharCode(startLetter++));
        }
      }
      textArr = shuffle(textArr);
    }
    var config = InitConfig(width, height, rowcol);
    var oContent = createEle.call(this, 'div', config.contentStyle);
    for (var i = 0; i < rowcol; i++) {
      var oUl = createEle.call(oContent, 'ul', config.ulStyle);
      for (var j = 0; j < rowcol; j++) {
        var oLi = createEle.call(oUl, 'li', config.liStyle);
        var oImg;
        if(imgArr){
          oImg = createEle.call(oLi, 'img', config.imgStyle);
        }else{
          oImg = createEle.call(oLi, 'div', config.imgStyle);
        }
        oImgDivArr.push(oImg);
      }
    }
    oImgDivArr.forEach(function (ele, index) {
      if(imgArr){
        ele.src = this[index];
      }else{
        ele.innerText = this[index];
      }
      ele.onclick = function () {
        if (lastClick.length) {
          if(imgArr){
            if (lastClick[0] != this && this.src == lastClick[0].src) {
              fadeOut(this, lastClick[0], 30);
            } else {
              lastClick[0] = this;
            }
          }else{
            if (lastClick[0] != this && this.innerText == lastClick[0].innerText) {
              fadeOut(this, lastClick[0], 30);
            } else {
              lastClick[0] = this;
            }
          }
        } else {
          lastClick[0] = this;
        }
      }
    }, imgArr||textArr);

    function createEle(ele, style) {
      var oEle = document.createElement(ele);
      changeStyle(oEle, style);
      this.appendChild(oEle);
      return oEle;
    }

    function fadeOut(obj1, obj2, num) {
      var delay = 100;
      var flag = false;
      var lock = true;
      dynamicProp(obj1, {
        opacity: num
      }, function () {
        if (flag) {
          if (num == 100) {
            setTimeout(function () {
              dynamicProp(this, {
                opacity: 0
              }, function () {
                if (lock) {
                  lock = false;
                } else {
                  this.style.display = 'none';
                  obj2.style.display = 'none';
                }
              }.bind(this))
              dynamicProp(obj2, {
                opacity: 0
              }, function () {
                if (lock) {
                  lock = false;
                } else {
                  this.style.display = 'none';
                  obj2.style.display = 'none';
                }
              }.bind(this))
            }.bind(this), delay);
          } else {
            fadeOut(this, obj2, 100);
          }
        } else {
          flag = true;
        }
      }.bind(obj1));
      dynamicProp(obj2, {
        opacity: num
      }, function () {
        if (flag) {
          if (num == 100) {
            setTimeout(function () {
              dynamicProp(this, {
                opacity: 0
              }, function () {
                if (lock) {
                  lock = false;
                } else {
                  this.style.display = 'none';
                  obj1.style.display = 'none';
                }
              }.bind(this))
              dynamicProp(obj1, {
                opacity: 0
              }, function () {
                if (lock) {
                  lock = false;
                } else {
                  this.style.display = 'none';
                  obj1.style.display = 'none';
                }
              }.bind(this))
            }.bind(this), delay);
          } else {
            fadeOut(obj1, this, 100);
          }
        } else {
          flag = true;
        }
      }.bind(obj2));
    }

    function changeStyle(ele, style) {
      for (var prop in style) {
        if (style.hasOwnProperty(prop)) {
          ele.style[prop] = style[prop];
        }
      }
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

    function getStyle(elem, prop) {
      if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop];
      } else {
        return elem.currentStyle[prop];
      }
    }

    function shuffle(arr) {
      arr = JSON.parse(JSON.stringify(arr));
      var flag = new Array(arr.length);
      var newArr = new Array(arr.length);
      for (var i = 0; i < arr.length; i++) {
        var j;
        do {
          j = ~~(Math.random() * (arr.length));
        } while (flag[j]);
        flag[j] = true;
        newArr[j] = arr[i];
      }
      return newArr;
    }
  }