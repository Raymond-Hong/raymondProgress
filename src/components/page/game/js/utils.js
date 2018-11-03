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