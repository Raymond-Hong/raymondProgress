总结:
1.index.html是大众做法,turnPage.html是创建
HTMLDivElement.prototype.createTurnPage的方法;
2.这个轮播图是可以左右轮播的,默认是从左向右,
点左边的按钮就切换成从右向左轮播;
3.创建原型方法这个轮播图时,遇到最奇怪的问题就是,我点左右时,
会出现两张图片左右来回切换,而用index.html里的方法不会有问题,
后来发现变量指向有问题,就用state来封装那些变量,解决了问题;
4.我还发现类数组转数组不能直接调用forEach,要分开写才行,
比如 类数组oSpanArr,
var spans = [].slice.call(oSpanArr, 0);
    spans.forEach(function (ele, index) {
        //...
    });
上面这样写没问题,如果直接连写:

[].slice.call(oSpanArr, 0).forEach(function (ele, index) {
        //...
    });
就有问题了,报个Uncaught SyntaxError: Unexpected token ]
很难理解....
最后我发现根本原因是,
[].slice.call(oSpanArr, 0)前面的语句不是以“;”结束导致的...