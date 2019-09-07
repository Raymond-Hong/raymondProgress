/**
 * this.state = {
            markedArr: [],
            originTarget: '',
            target: '',
            start: '',
            end: '',
            anchorNode: '',
            extentNode: '',
            anchorOffset: '',
            extentOffset: ''
        }
 */
let markingTag = 'B';
let consideredTag = ['DIV', 'P', 'SPAN', markingTag];
const initTag = (tag = markingTag, tagArr) => {
    markingTag = tag;
    consideredTag = tagArr ? consideredTag : [...tagArr, markingTag];
}
const getInnerHTMLByNode = (node) => {
    if (node.nodeType === 1) {
        return node.outerHTML;
    } else {
        return node.data;
    }
}
const getTextLengthByNode = (node, parentElement) => {
    if (node.nodeType === 1) {
        return [...node.childNodes].reduce((p, n) => p + getTextLengthByNode(n, node), 0);
    } else if (node.nodeType === 3) {
        if (!parentElement || consideredTag.includes(parentElement.nodeName)) {
            return node.length;
        }
    }
    return 0;
}
const changeNodeValueByMark = (node, mark, parentElement) => {
    if (node.nodeType === 1) {
        node.childNodes.forEach(el => changeNodeValueByMark(el, mark, node));
    } else if (node.nodeType === 3) {
        let data = node.data;
        let len = data.length;
        if (consideredTag.includes(parentElement.nodeName)) {
            if (mark.start > len) {
                mark.start -= len;
                mark.end -= len;
            } else if (mark.end >= 0 && parentElement.nodeName !== markingTag) {
                let text;
                const { start, end } = mark;
                if (mark.end < len) {
                    text = data.slice(0, start) + '<b>' + data.slice(start, end) + '</b>' + data.slice(end);
                    mark.end = -1;
                } else {
                    text = data.slice(0, start) + '<b>' + data.slice(start) + '</b>';
                    mark.start = 0;
                    mark.end = end - len;
                }
                parentElement.innerHTML = [...parentElement.childNodes].reduce((p, child) => {
                    if (child === node) {
                        return p + text;
                    } else {
                        return p + getInnerHTMLByNode(child);
                    }
                }, '')
            }
        }
    }
}
const getSelected = (node, mark, anchorNode, extentNode, add, parentElement) => {
    if (node.nodeType === 1) {
        node.childNodes.forEach(child => getSelected(child, mark, anchorNode, extentNode, add, node));
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

const _Mark = {};

_Mark.addMark = function (intervals, newInterval) { // 插入区间
    if (!intervals.length) {
        return [newInterval];
    }
    intervals.reduce((p, vals, k) => {
        if (typeof p !== 'number') {
            if (newInterval.end < vals.start) {
                intervals.unshift(newInterval);
            }
            if (vals.start > newInterval.start && newInterval.end >= vals.start) {
                vals.start = newInterval.start;
            }
            if (vals.end >= newInterval.start) {
                vals.end = newInterval.end > vals.end ? newInterval.end : vals.end;
            }
        } else {
            if (p >= newInterval.start && newInterval.end >= vals.start) {
                intervals[k - 1].end = vals.end > newInterval.end ? vals.end : newInterval.end;
                intervals.splice(k, 1);
            }
            if (p <= newInterval.start && newInterval.end >= vals.start && newInterval.start <= vals.end) {
                vals.start = newInterval.start > vals.start ? vals.start : newInterval.start;
                vals.end = newInterval.end > vals.end ? newInterval.end : vals.end;
            }
            if (p < newInterval.start && newInterval.end < vals.start) {
                intervals.splice(k, 0, newInterval);
            }
        }
        if (k === intervals.length - 1 && newInterval.start > vals.end) {
            intervals.push(newInterval);
        }
        return vals.end;
    }, null);
    return intervals;
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

const getStartAndEnd = (target, { anchorNode, extentNode, anchorOffset, extentOffset }) => {
    let nodes = target.childNodes;
    let exchange;
    if (anchorNode !== extentNode) {
        const searchForStartNode = function (nodes) {
            nodes = [...nodes];
            nodes.some((node) => {
                if (node.nodeType === 1) {
                    return searchForStartNode(node.childNodes);
                }
                if (node === anchorNode) {
                    if (typeof exchange === 'undefined') {
                        exchange = false;
                    }
                    return true;
                } else if (node === extentNode) {
                    if (typeof exchange === 'undefined') {
                        exchange = true;
                    }
                    return true;
                }
                return false;
            })
        }
        searchForStartNode(nodes);
    } else if (anchorOffset > extentOffset) {
        exchange = true;
    }
    if (exchange) {
        [anchorOffset, extentOffset] = [extentOffset, anchorOffset];
        [anchorNode, extentNode] = [extentNode, anchorNode];
    }
    return {
        anchorNode,
        extentNode,
        anchorOffset,
        extentOffset
    }
}

const handleSelect = function (e) {
    let selection = window.getSelection();
    let target = e.currentTarget;
    let { anchorNode, extentNode, anchorOffset, extentOffset } = getStartAndEnd(target, selection);
    let originTarget = document.createElement(target.nodeName);
    originTarget.innerHTML = target.innerHTML;
    this.setState({
        target,
        originTarget: this.state.originTarget || originTarget,
        anchorNode,
        extentNode,
        anchorOffset,
        extentOffset
    });
}

const markSelected = function () {
    let { target, anchorOffset, extentOffset, anchorNode, extentNode } = this.state;
    let start = anchorOffset, end = extentOffset;
    let mark = { start, end };
    getSelected(target, mark, anchorNode, extentNode, { start: true, end: true });
    return mark;
}

const renderByMarked = function (markedArr) {
    let { originTarget } = this.state;
    let template = document.createElement(originTarget.nodeName);
    template.innerHTML = originTarget.innerHTML;
    return markedArr.reduce((p, mark) => {
        changeNodeValueByMark(p, JSON.parse(JSON.stringify(mark)));
        return p;
    }, template).innerHTML;
}
const marking = function (behavior) {
    let { target, markedArr } = this.state;
    if (!target) {
        return;
    }
    markedArr = _Mark[behavior](markedArr, markSelected.call(this));
    target.innerHTML = renderByMarked.call(this, markedArr);
    this.setState({
        markedArr,
        target: null
    })
}

const addMark = function () {
    marking.call(this, 'addMark');
}

const removeMark = function () {
    marking.call(this, 'removeMark');
}

export default {
    initTag,
    handleSelect,
    addMark,
    removeMark
};
