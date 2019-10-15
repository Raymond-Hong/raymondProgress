/**
 * @author Raymond Hone 2019-09
 */
let tagForMark = 'LARP', tagForSearch = 'CHU7', tagRecords = ['DIV', 'P', 'SPAN'], tagForMarkButton = "MARKBUTTON";
let style = {};
let markingTag = 'LARP';
let markableTags = [...tagRecords, markingTag];
let selection;
const _Mark = {};
let virtualDom = document.createElement('div');

let initTag = (tag1, tag2, tagArr = tagRecords) => { // params: tag use to mark ; tagArr: record of markable tags
    tagForMark = tag1 ? tag1.toUpperCase() : tagForMark;
    tagForSearch = tag2 ? tag2.toUpperCase() : tagForSearch;
    markingTag = tagForMark ? tagForMark : markingTag;
    tagRecords = tagArr.map(t => t.toUpperCase());
    markableTags = [...tagRecords, tagForMark, tagForSearch];
    Object.defineProperty(style, tagForMark, {
        value: `color: #f40;display: inline;`,
    });
    Object.defineProperty(style, tagForSearch, {
        value: `background-color: orange;display: inline;`,
    });
}

const getHTMLByNode = (node) => {
    if (node.nodeType === 1) {
        return node.outerHTML;
    } else {
        return node.data;
    }
}

const getInnerTextStrByNode = (node, parentElement, text) => {
    if (node.nodeType === 1) {
        let hideTextValue = getHideTextLengthByNode(node);
        if (hideTextValue) {
            return text + ' '.repeat(hideTextValue);
        } else {
            return [...node.childNodes].reduce((p, n) => getInnerTextStrByNode(n, node, p), text);
        }
    } else if (node.nodeType === 3) {
        if (parentElement && markableTags.includes(parentElement.nodeName)) {
            return text + node.data;
        } else {
            return text + ' '.repeat(node.length);
        }
    }
    return text;
}

const getTextLengthByNode = (node, parentElement) => {
    if (node.nodeType === 1) {
        let hideTextValue = getHideTextLengthByNode(node);
        return hideTextValue || [...node.childNodes].reduce((p, n) => p + getTextLengthByNode(n, node), 0);
    } else if (node.nodeType === 3) {
        return node.length;
    }
    return 0;
}

const getHideTextLengthByNode = (node) => {
    if (node.nodeType === 1) {
        let value;
        [...node.attributes].some((el) => (value = getHideTextLengthByNode(el)));
        return value;
    } else if (node.nodeType === 2) {
        if (node.nodeName === 'hidetext') {
            return node.nodeValue | 0;
        }
    }
    return 0;
}

const changeNodeValueByMark = (node, mark, parentElement) => {
    if (node.nodeType === 1) {
        let hideTextValue = getHideTextLengthByNode(node);
        if (hideTextValue) {
            mark.start -= hideTextValue;
            mark.end -= hideTextValue;
        } else {
            node.childNodes.forEach(el => changeNodeValueByMark(el, mark, node));
        }
    } else if (node.nodeType === 3) {
        let data = node.data;
        let len = data.length;
        if (markableTags.includes(parentElement.nodeName)) {
            if (mark.start >= len) {
                mark.start -= len;
                mark.end -= len;
            } else if (mark.end >= 0 && parentElement.nodeName !== markingTag) {
                let text;
                const { start, end } = mark;
                if (markingTag === tagForMarkButton) {
                    text = `${data.slice(0, start)}<${markingTag} style="position: relative; user-select: none;" onclick="clickMarkButton()"></${markingTag}><un${markingTag} style="position: relative; user-select: none;" onclick="clickUnmarkButton()"></un${markingTag}>${data.slice(start)}`;
                    mark.end = -1;
                } else if (mark.end < len) {
                    text = `${data.slice(0, start)}<${markingTag} style="${style[markingTag]}" >${data.slice(start, end)}</${markingTag}>${data.slice(end)}`;
                    mark.end = -1;
                } else {
                    text = `${data.slice(0, start)}<${markingTag} style="${style[markingTag]}" >${data.slice(start)}</${markingTag}>`;
                    mark.start = 0;
                    mark.end = end - len;
                }
                parentElement.innerHTML = [...parentElement.childNodes].reduce((p, child) => {
                    if (child === node) {
                        return p + text;
                    } else {
                        return p + getHTMLByNode(child);
                    }
                }, '')
            }
        } else {
            if (mark.start >= 0 && mark.start < len) {
                mark.start = 0;
            } else {
                mark.start -= len;
            }
            mark.end -= len;
        }
    }
}

const getSelected = (node, mark, anchorNode, extentNode, add, parentElement) => {
    if (node.nodeType === 1) {
        let hideTextValue = getHideTextLengthByNode(node);
        if (hideTextValue) {
            if (add.start) {
                mark.start += hideTextValue;
            }
            if (add.end) {
                mark.end += hideTextValue;
            }
        } else {
            node.childNodes.forEach(child => getSelected(child, mark, anchorNode, extentNode, add, node));
        }
    } else if (node.nodeType === 3) {
        if (node !== anchorNode) {
            if (add.start) {
                mark.start += getTextLengthByNode(node, parentElement);
            }
        } else if (add.start) {
            add.start = false;
        }
        if (node !== extentNode) {
            if (add.end) {
                mark.end += getTextLengthByNode(node, parentElement);
            }
        } else if (add.end) {
            add.end = false;
        }
    }
}

_Mark.addMark = function (markedArr, mark) { // 插入区间
    if (!markedArr.length) {
        return [mark];
    }
    markedArr.reduce((p, m, i) => {
        let { start, end } = m;
        if (typeof p !== 'number') {
            if (mark.end < start) {
                markedArr.unshift(mark);
            }
            if (start > mark.start && mark.end >= start) {
                start = mark.start;
            }
            if (end >= mark.start) {
                end = mark.end > end ? mark.end : end;
            }
        } else {
            if (p >= mark.start && mark.end >= start) {
                markedArr[i - 1].end = end > mark.end ? end : mark.end;
                markedArr.splice(i, 1);
            }
            if (p <= mark.start && mark.end >= start && mark.start <= end) {
                start = mark.start > start ? start : mark.start;
                end = mark.end > end ? mark.end : end;
            }
            if (p < mark.start && mark.end < start) {
                markedArr.splice(i, 0, mark);
            }
        }
        if (i === markedArr.length - 1 && mark.start > end) {
            markedArr.push(mark);
        }
        m.start = start;
        m.end = end;
        return end;
    }, null);
    return markedArr;
}

_Mark.removeMark = (markedArr, mark) => {
    if (!markedArr.length || !mark) {
        return markedArr;
    }
    if (markedArr.some(({ start, end }, index) => {
        if (start <= mark.start && end >= mark.end) {
            markedArr = [...markedArr.slice(0, index), { start, end: mark.start }, { start: mark.end, end }, ...markedArr.slice(index + 1)];
            return true;
        }
        return false;
    })) {
        return markedArr;
    }
    return markedArr.filter(({ start, end }) => !(start > mark.start && end < mark.end)).map(({ start, end }) => {
        if (start >= mark.start) {
            if (end >= mark.end && start <= mark.end) {
                start = mark.end;
            }
        } else if (end <= mark.end && end >= mark.start) {
            end = mark.start;
        }
        return { start, end };
    })
}

const verifyStartAndEndNode = (realDom, { anchorNode, extentNode, anchorOffset, extentOffset }) => {
    let exchange;
    const searchForStartNode = (nodes) => {
        nodes.forEach((node) => {
            if (node.nodeType === 1) {
                searchForStartNode(node.childNodes);
            } else if (node.nodeType === 3) {
                if (node === anchorNode) {
                    if (typeof exchange === 'undefined') {
                        exchange = false;
                    }
                } else if (node === extentNode) {
                    if (typeof exchange === 'undefined') {
                        exchange = true;
                    }
                }
            }
        });
    }
    searchForStartNode(realDom.childNodes);
    if (anchorNode !== extentNode) {
    } else {
        if (anchorOffset > extentOffset) {
            exchange = true;
        }
    }
    if (exchange) {
        [anchorOffset, extentOffset] = [extentOffset, anchorOffset];
        [anchorNode, extentNode] = [extentNode, anchorNode];
    }
    return {
        anchorNode,
        extentNode,
        anchorOffset,
        extentOffset,
    }
}

const initRealDom = function (realDom) {
    this.setState({
        realDom,
    });
}

const handleSelect = function (s) {
    selection = s || window.getSelection();
    let { realDom } = this.state;
    Object.assign(_Mark, verifyStartAndEndNode(realDom, selection));
    if (selection.type === 'Caret' || _Mark.crossingTarget) {
        _Mark.markable = false;
    } else {
        _Mark.markable = true;
    }
}

const markSelected = function () {
    let { realDom } = this.state;
    let { anchorOffset, extentOffset, anchorNode, extentNode } = _Mark;
    let mark = { start: anchorOffset, end: extentOffset };
    getSelected(realDom, mark, anchorNode, extentNode, { start: true, end: true });
    return mark;
}

const renderByOriginTextAndRecords = function (originText, records) {
    virtualDom.innerHTML = originText;
    return records && records.reduce((p, record) => {
        // let m = JSON.parse(JSON.stringify(record));
        let m = { ...record };
        changeNodeValueByMark(p, m);
        return p;
    }, virtualDom).innerHTML || originText;
}

const marking = function (behavior) {
    toggleTag(tagForMark);
    handleSelect.call(this);
    let { markedArr } = this.state;
    let { markable } = _Mark;
    if (markable) {
        markedArr = _Mark[behavior](markedArr, markSelected.call(this));
    }
    _Mark.markable = false;
    return markedArr;
}

const getMarkButton = function (selection) {
    handleSelect.call(this, selection);
    return {
        ...markSelected.call(this),
        ..._Mark
    }
}

const addMark = function () {
    return marking.call(this, 'addMark');
}

const removeMark = function () {
    return marking.call(this, 'removeMark');
}

const getSearchResults = function (inputVal, text, realDom) {
    inputVal = inputVal.trim();
    if (!inputVal) {
        return [];
    }
    let reg = new RegExp(`(${inputVal})+`, 'gm');
    virtualDom.innerHTML = text;
    let innertext = getInnerTextStrByNode(virtualDom, null, '');
    let totalSearchedArr = [];
    let searchedArr = [];
    let res;
    while ((res = reg.exec(innertext))) {
        totalSearchedArr.push({
            start: res.index,
            end: res.index + res[0].length
        })
    }
    if (realDom) {
        searchedArr = markFilterByViewport(totalSearchedArr, realDom);
    }
    return {
        totalSearchedArr,
        searchedArr
    }
}

const toggleTag = (tag) => {
    markingTag = tag;
    markableTags = [...tagRecords, tagForMark, tagForSearch];
}

const getText = function (searchedArr, markedArr, text, markButton) {
    if (markButton) {
        markingTag = tagForMarkButton;
        return renderByOriginTextAndRecords(text || this.state.originText, markButton);
    } else {
        toggleTag(tagForMark);
        let t1 = renderByOriginTextAndRecords(text || this.state.originText, markedArr || this.state.markedArr);
        toggleTag(tagForSearch);
        return renderByOriginTextAndRecords(t1, searchedArr || this.state.searchedArr);
    }
}

const getNodeByIndex = (realDom, index) => {
    let anchorNode, extentNode, anchorOffset, extentOffset,
        anchorParent, extentParent, len = 0;
    const traverseDom = realDom => {
        return [...realDom.childNodes].some(node => {
            if (node.nodeType === 1) {
                let hideTextValue = getHideTextLengthByNode(node);
                if (hideTextValue) {
                    len += hideTextValue;
                    return false;
                }
                return traverseDom(node);
            } else if (node.nodeType == 3) {
                len += node.length;
                if (len > index && !anchorNode) {
                    anchorNode = extentNode = node;
                    anchorOffset = extentOffset = index - len + node.length;
                    anchorParent = extentParent = realDom;
                    return true;
                }
            }
            return false;
        });
    }
    traverseDom(realDom);
    return {
        anchorNode,
        anchorOffset,
        extentOffset,
        extentNode,
        anchorParent,
        extentParent,
    }
}

const getNodeByStartAndEnd = (realDom, { start, end }) => {
    let { anchorNode, anchorOffset, anchorParent } = getNodeByIndex(realDom, start);
    let { extentNode, extentOffset, extentParent } = getNodeByIndex(realDom, end);
    return {
        anchorNode,
        anchorOffset,
        extentNode,
        extentOffset,
        anchorParent,
        extentParent
    }
}

const markFilterByViewport = (arr, realDom) => {
    return arr.filter(mark => {
        const { anchorParent, extentParent } = getNodeByStartAndEnd(realDom, mark);
        return isElementInViewport(anchorParent) || isElementInViewport(extentParent);
    })
}

const isElementInViewport = el => {
    //获取元素是否在可视区域
    let rect = el.getBoundingClientRect();
    // return (
    //     rect.top >= 0 &&
    //     rect.left >= 0 &&
    //     rect.bottom <=
    //     (window.innerHeight || document.documentElement.clientHeight) &&
    //     rect.right <=
    //     (window.innerWidth || document.documentElement.clientWidth)
    // );
    return (
        (rect.top >= 0 &&
            rect.top <=
            (window.innerHeight || document.documentElement.clientHeight)) || (rect.top <= 0 && rect.bottom >= 0)
    );
}

const moveElementToCenter = el => {
    let rect = el.getBoundingClientRect();
    let y = window.scrollY;
    y += rect.top;
    y -= 3*rect.height;
    y -= 400;
    window.scrollTo(window.scrollX, y);
}

const setTextSelected = ({ anchorNode, extentNode, anchorOffset, extentOffset }) => {
    let r = document.createRange();
    if (anchorNode && extentNode) {
        r.setStart(anchorNode, anchorOffset);
        r.setEnd(extentNode, extentOffset);
    }
    let s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
}

export const MarkModule = {
    initTag,
    initRealDom,
    addMark,
    removeMark,
    renderByOriginTextAndRecords,
    getTextLengthByNode,
    getSearchResults,
    getText,
    getMarkButton,
    getNodeByStartAndEnd,
    setTextSelected,
    moveElementToCenter
};

export default MarkModule;
