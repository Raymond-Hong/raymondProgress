HTMLDivElement.prototype.createTurnPage = function (pathArr) {
    if (Object.prototype.toString.call(pathArr) != '[object Array]' || !pathArr.length) {
        return;
    }
    var 
        state = {
            divWidth : this.offsetWidth,
            divHeight : this.offsetHeight,
            len : pathArr.length,
            moveWidth : this.offsetWidth,
            maxRight : -pathArr.length * this.offsetWidth,
            lock : false,
            index : 0,
            lastIndex : 0,
            delay : 2000,
            timer : null
        },
        oSpanArr = [],
        config = initConfig(state.len, state.divWidth, state.divHeight),
        divStyle = config.divStyle,
        ulStyle = config.ulStyle,
        liStyle = config.liStyle,
        imgStyle = config.imgStyle,
        btnStyle = config.btnStyle,
        leftBtnStyle = config.leftBtnStyle,
        rightBtnStyle = config.rightBtnStyle,
        sliderIndexStyle = config.sliderIndexStyle,
        spanStyle = config.spanStyle,
        activeStyle = config.activeStyle,
        cancelActiveStyle = config.cancelActiveStyle;

    changeStyle(this, divStyle);

    var oUl = createEle.call(this, 'ul', ulStyle);

    var leftBtn = createEle.call(this, 'div', btnStyle);
    changeStyle(leftBtn, leftBtnStyle);
    leftBtn.innerText = '<';
    leftBtn.onclick = function () {
        console.log('left', state.lock);
        autoMove('right->left').call(oUl);
    }

    var rightBtn = createEle.call(this, 'div', btnStyle);
    changeStyle(rightBtn, rightBtnStyle);
    rightBtn.innerText = '>';
    rightBtn.onclick = function () {
        console.log('right', state.lock);
        autoMove('left->right').call(oUl);
    }

    var sliderIndex = createEle.call(this, 'div', sliderIndexStyle);
    pathArr.forEach(function (ele, index) {
        var oLi = createEle.call(oUl, 'li', liStyle);
        var oImg = createEle.call(oLi, 'img', imgStyle);
        oImg.src = ele;
        var oSpan = createEle.call(sliderIndex, 'span', spanStyle);
        if (index === 0) {
            changeStyle(oSpan, activeStyle);
        }
        oSpanArr.push(oSpan);
        oSpan.onclick = function () {
            state.lock = true;
            clearTimeout(state.timer);
            changeStyle(this, activeStyle);
            changeStyle(oSpanArr[state.lastIndex], cancelActiveStyle);
            state.lastIndex = index;
            state.index = index;
            dynamicProp(oUl, { left: -state.index * state.moveWidth }, function () {
                state.timer = setTimeout(autoMove().bind(oUl), state.delay);
                state.lock = false;
            })
        }
    });
    var oLi = createEle.call(oUl, 'li', liStyle);
    var oImg = createEle.call(oLi, 'img', imgStyle);
    oImg.src = pathArr[0];

    this.onmouseenter = function () {
        leftBtn.style.opacity = 0.7;
        rightBtn.style.opacity = 0.7;
    }
    this.onmouseleave = function () {
        leftBtn.style.opacity = 0.1;
        rightBtn.style.opacity = 0.1;
    }

    state.timer = setTimeout(autoMove().bind(oUl), state.delay);
    function autoMove(direction) {
        return function () {
            if (state.lock) {
                return;
            }
            state.lock = true;
            clearTimeout(state.timer);
            var newLeft;
            if (!direction || direction == 'left->right') {
                state.index++;
                if (this.offsetLeft == state.maxRight) {
                    this.style.left = 0;
                }
                if (state.index == state.len) {
                    state.index = 0;
                }
                newLeft = this.offsetLeft - state.moveWidth;
            } else if (direction == 'right->left') {
                state.index--;
                if (this.offsetLeft == 0) {
                    this.style.left = state.maxRight + 'px';
                }
                if (state.index < 0) {
                    state.index = state.len - 1;
                }
                newLeft = this.offsetLeft + state.moveWidth;
            }
            changeStyle(oSpanArr[state.index], activeStyle);
            changeStyle(oSpanArr[state.lastIndex], cancelActiveStyle);
            state.lastIndex = state.index;
            dynamicProp(this, { left: newLeft }, function () {
                console.log('direction:', direction);
                console.log('timer', state.timer);
                state.timer = setTimeout(autoMove(direction).bind(this), state.delay);
                state.lock = false;
            }.bind(this));
        };
    }
    function createEle(ele, style) {
        var oEle = document.createElement(ele);
        changeStyle(oEle, style);
        this.appendChild(oEle);
        return oEle;
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
    
    function changeStyle(ele, style) {
        for (var prop in style) {
            if (style.hasOwnProperty(prop)) {
                ele.style[prop] = style[prop];
            }
        }
    }
}

