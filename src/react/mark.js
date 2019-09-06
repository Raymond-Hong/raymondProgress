const consideredTag = ['DIV', 'P', 'SPAN', 'B'];
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
            if (mark.start >= len) {
                mark.start -= len;
                mark.end -= len;
            } else if (mark.end > 0) {
                let text;
                const { start, end } = mark;
                if (mark.end < len) {
                    text = data.slice(0, start) + '<b>' + data.slice(start, end) + '</b>' + data.slice(end);
                    mark.end = -1;
                } else {
                    text = data.slice(0, start) + '<b>' + data.slice(start) + '</b>';
                    mark.start = 1;
                    mark.end = end - len + 1;
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
const addMark = function (intervals, newInterval) { // 插入区间
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

const removeMark = (markedArr, mark) => {
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

export default {
    addMark,
    removeMark,
    getSelected,
    changeNodeValueByMark,
};
