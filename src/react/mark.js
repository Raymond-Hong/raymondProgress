/**
 * 一个组件使用一次 (one target)
 * this.state = {
            markedArr: [],
            originTarget: '',
            target: '',
            anchorNode: '',
            extentNode: '',
            anchorOffset: '',
            extentOffset: '',
            markable: false
        }
    一个组件多段使用（more targets)
    this.state = {
        section1: {
            state: {
                markedArr: [],
                originTarget: '',
                target: '',
                anchorNode: '',
                extentNode: '',
                anchorOffset: '',
                extentOffset: '',
                markable: false
            },
            setState: function (obj) {
                Object.assign(this.state, obj);
            }
        },
        section2: {
            state: {
                markedArr: [],
                originTarget: '',
                target: '',
                anchorNode: '',
                extentNode: '',
                anchorOffset: '',
                extentOffset: '',
                markable: false
            },
            setState: function (obj) {
                Object.assign(this.state, obj);
            }
        }
    }
 */

let markingTag = 'LARP';
let markableTags = ['DIV', 'P', 'SPAN', markingTag];
let removeAllMarks = false;

const initTag = (tag = markingTag, tagArr = []) => { // params: tag use to mark ; tagArr: record of markable tags
    markingTag = tag.toUpperCase();
    tagArr = tagArr.map(t => t.toUpperCase());
    markableTags = [...tagArr, markingTag];
}

const getHTMLByNode = (node) => {
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
        if (parentElement && markableTags.includes(parentElement.nodeName)) {
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
        if (markableTags.includes(parentElement.nodeName)) {
            if (mark.start > len) {
                mark.start -= len;
                mark.end -= len;
            } else if (mark.end >= 0 && parentElement.nodeName !== markingTag) {
                let text;
                const { start, end } = mark;
                if (mark.end < len) {
                    text = `${data.slice(0, start)}<${markingTag}>${data.slice(start, end)}</${markingTag}>${data.slice(end)}`;
                    mark.end = -1;
                } else {
                    text = `${data.slice(0, start)}<${markingTag}>${data.slice(start)}</${markingTag}>`;
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

const verifyStartAndEndNode = (target, { anchorNode, extentNode, anchorOffset, extentOffset }) => {
    let exchange;
    let crossingTarget = 2;
    const searchForStartNode = (nodes) => {
        nodes.forEach((node) => {
            if (node.nodeType === 1) {
                searchForStartNode(node.childNodes);
            }else if (node === anchorNode) {
                if (typeof exchange === 'undefined') {
                    exchange = false;
                }
                crossingTarget--;
            } else if (node === extentNode) {
                if (typeof exchange === 'undefined') {
                    exchange = true;
                }
                crossingTarget--;
            }
        });
    }
    searchForStartNode(target.childNodes);
    if (anchorNode !== extentNode) {
        crossingTarget = !!crossingTarget;
    } else {
        crossingTarget = !crossingTarget;
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
        crossingTarget
    }
}

const handleSelect = function (e) {
    let selection = window.getSelection();
    let target = e.currentTarget;
    let { anchorNode, extentNode, anchorOffset, extentOffset, crossingTarget } = verifyStartAndEndNode(target, selection);
    if (selection.type === 'Caret' || crossingTarget) {
        this.setState({
            markable: false
        });
        return;
    }
    let originTarget = document.createElement(target.nodeName);
    originTarget.innerHTML = target.innerHTML;
    this.setState({
        target,
        originTarget: this.state.originTarget || originTarget,
        anchorNode,
        extentNode,
        anchorOffset,
        extentOffset,
        markable: true
    });
}

const markSelected = function () {
    let { target, anchorOffset, extentOffset, anchorNode, extentNode } = this.state;
    let mark = { start: anchorOffset, end: extentOffset };
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
    let { markable, target, markedArr } = this.state;
    if (removeAllMarks) {
        removeAllMarks = false;
        markedArr = [];
    } else if (markable) {
        markedArr = _Mark[behavior](markedArr, markSelected.call(this));
    } else {
        return;
    }
    target.innerHTML = renderByMarked.call(this, markedArr);
    this.setState({
        markedArr,
        markable: false
    })
}

const addMark = function () {
    marking.call(this, 'addMark');
}

const removeMark = function () {
    marking.call(this, 'removeMark');
}

const clearAllMarks = function () {
    removeAllMarks = true;
    removeMark.call(this);
}

export default {
    initTag,
    handleSelect,
    addMark,
    removeMark,
    clearAllMarks,
    state: {
        markedArr: [],
        originTarget: '',
        target: '',
        anchorNode: '',
        extentNode: '',
        anchorOffset: '',
        extentOffset: '',
        markable: false
    },
    setState: function (state) {
        Object.assign(this.state, state);
    }
};
