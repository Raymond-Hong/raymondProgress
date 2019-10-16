/**
 * @author Raymond Hone 2019-09
 */
const tagForMark = 'LARP', tagForSearch = 'CHU7';
let selection;
let markedArr = [];
let root;
let lastInput = '';
const addMarkButton = document.createElement('markbutton');
const removeMarkButton = document.createElement('unmarkbutton');
let allText;
let allTextNode = [];
let totalSearched = [];
let remarkSelection;


const removeMarkedTagBySelection = ({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom, markedTag, add) => { // 已在selection前加了markbutton/unmarkbutton的情况
    const mark = getStartAndEndBySelection({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom);
    markedArr = removeMark(markedArr, mark);
    if (anchorNode === extentNode) {
        let top = anchorNode.parentElement.parentElement, p = anchorNode.parentElement;
        if (p.nodeName === tagForSearch && top.nodeName === markedTag) {
            let data = anchorNode.data;
            let leftData = data.slice(0, extentOffset);
            let rightData = data.slice(extentOffset);
            let nodeLeft = document.createTextNode(leftData);
            let nodeRight = document.createTextNode(rightData);
            let eleSearchLeft = document.createElement(tagForSearch);
            let eleSearchRight = document.createElement(tagForSearch);
            let ele = document.createElement(markedTag);
            eleSearchLeft.append(nodeLeft);
            eleSearchRight.append(nodeRight);
            ele.appendChild(eleSearchRight);
            // top.removeChild(p);
            if (top.nextSibling) {
                if (p.nextSibling) {
                    [...top.children].reduceRight((next, nextSibling) => {
                        if (next) {
                            return next;
                        }
                        if (nextSibling === p) {
                            return true;
                        }
                        let pN = document.createElement(markedTag);
                        pN.appendChild(nextSibling);
                        top.parentElement.insertBefore(pN, top.nextSibling);
                        return false;
                    }, false);
                    if (rightData) {
                        top.parentElement.insertBefore(ele, top.nextSibling);
                        top.parentElement.insertBefore(eleSearchLeft, top.nextSibling);
                        top.removeChild(p);
                    } else {
                        top.parentElement.insertBefore(p, top.nextSibling);
                    }
                } else {
                    if (rightData) {
                        top.parentElement.insertBefore(ele, top.nextSibling);
                        top.parentElement.insertBefore(eleSearchLeft, top.nextSibling);
                        top.removeChild(p);
                    } else {
                        top.parentElement.insertBefore(p, top.nextSibling);
                        top.parentElement.removeChild(top);
                    }
                }
            } else {
                top.parentElement.append(eleSearchLeft);
                if (rightData) {
                    top.parentElement.append(ele);
                }
                if (p.nextSibling) {
                    [...top.children].reduce((next, nextSibling) => {
                        if (nextSibling === p) {
                            return true;
                        }
                        if (!next) {
                            return next;
                        }
                        let pN = document.createElement(markedTag);
                        pN.appendChild(nextSibling);
                        top.appendChild(pN);
                        return true;
                    }, false);
                }
            }
        }
        if (p.nodeName === markedTag) {
            let data = anchorNode.data;
            let leftData = data.slice(0, extentOffset);
            let rightData = data.slice(extentOffset);
            let nodeLeft = document.createTextNode(leftData);
            let nodeRight = document.createTextNode(rightData);
            let eleRight = document.createElement(markedTag);
            eleRight.append(nodeRight);
            p.removeChild(anchorNode);
            if (p.nextSibling) {
                if (rightData) {
                    top.insertBefore(eleRight, p.nextSibling);
                    top.insertBefore(nodeLeft, eleRight);
                } else {
                    top.insertBefore(nodeLeft, p.nextSibling);
                }
            } else {
                top.append(nodeLeft);
                if (rightData) {
                    top.append(eleRight);
                }
            }
        }
        return;
    }
    let start = 0;
    const traverseDom = (dom) => {
        for (let i = 0, node; (node = dom.childNodes[i]); i++) {
            if (node.nodeType === 1) {
                if (extentNode === node) {
                    start = -1;
                }
                if (start && ~start) {
                    if (node.nodeName === markedTag) {
                        if (node.childNodes.length === 1 && node.childNodes[0].nodeType === 3 && node.childNodes[0] !== extentNode) {
                            node.replaceWith(node.childNodes[0]);
                            continue;
                        }
                    }
                }
                traverseDom(node);
            } else if (node.nodeType === 3) {
                if (node === anchorNode) {
                    if (dom.nodeName === markedTag && !add) {
                        if (dom.nextSibling) {
                            dom.parentElement.insertBefore(node, dom.nextSibling);
                        } else {
                            dom.parentElement.append(node);
                        }
                        i++;
                    }
                    start = 1;
                }
                if (node === extentNode) {
                    if (dom.nodeName === tagForSearch && dom.parentElement.nodeName === markedTag && !add) {
                        let data = node.data;
                        let leftData = data.slice(0, extentOffset);
                        let rightData = data.slice(extentOffset);
                        let nodeLeft = document.createTextNode(leftData);
                        let nodeRight = document.createTextNode(rightData);
                        let eleSearch = document.createElement(tagForSearch);
                        eleSearch.append(nodeLeft);
                        dom.parentElement.parentElement.insertBefore(eleSearch, dom.parentElement);
                        if (!rightData) {
                            dom.parentElement.parentElement.removeChild(dom.parentElement);
                        } else {
                            node.replaceWith(nodeRight);
                        }
                    }
                    if (dom.nodeName === markedTag && !add) {
                        let data = node.data;
                        let leftData = data.slice(0, extentOffset);
                        let rightData = data.slice(extentOffset);
                        let nodeLeft = document.createTextNode(leftData);
                        let nodeRight = document.createTextNode(rightData);
                        dom.parentElement.insertBefore(nodeLeft, dom);
                        node.replaceWith(nodeRight);
                        if (!rightData) {
                            dom.parentElement.removeChild(dom);
                        }
                        i++;
                    }
                    start = -1;
                }
                if (start && ~start) {
                    if (dom.nodeName === tagForSearch && dom.parentElement.nodeName === markedTag) {
                        let p = dom.parentElement;
                        let top = p.parentElement;
                        if (p.nextSibling) {
                            if (dom.nextSibling) { // 拆 《l》《/l》
                                [...p.children].reduceRight((next, nextSibling) => {
                                    if (next) {
                                        return next;
                                    }
                                    if (dom === nextSibling) {
                                        return true;
                                    }
                                    let pN = document.createElement(markedTag);
                                    pN.appendChild(nextSibling);
                                    top.insertBefore(pN, p.nextSibling);
                                    return false;
                                }, false);
                                top.insertBefore(dom, p.nextSibling);
                                if (!p.childNodes.length) {
                                    top.removeChild(p);
                                }
                            } else { // 尾加
                                top.insertBefore(dom, p.nextSibling);
                                if (!p.childNodes.length) {
                                    top.removeChild(p);
                                }
                            }
                        } else {
                            top.parentElement.append(dom);
                        }
                    }
                }
            }
        }
    }
    traverseDom(realDom);
}


const addMarkedTagBySelection = ({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom, markedTag) => { // 已在selection前加了markbutton/unmarkbutton的情况
    const mark = getStartAndEndBySelection({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom);
    markedArr = addMark(markedArr, mark);
    if (anchorNode === extentNode) {
        let parentElement = anchorNode.parentElement;
        if (parentElement.nodeName === tagForSearch) {
            if (parentElement.parentElement.nodeName !== markedTag) {
                let data = anchorNode.data;
                let leftData = data.slice(0, extentOffset);
                let rightData = data.slice(extentOffset);
                let nodeLeft = document.createTextNode(leftData);
                let nodeRight = document.createTextNode(rightData);
                let eleSearchLeft = document.createElement(tagForSearch);
                eleSearchLeft.append(nodeLeft);
                let eleLeft = document.createElement(markedTag);
                eleLeft.appendChild(eleSearchLeft);
                parentElement.parentElement.insertBefore(eleLeft, parentElement);
                if (rightData) {
                    anchorNode.replaceWith(nodeRight);
                } else {
                    parentElement.parentElement.removeChild(parentElement);
                }
            }
        } else if (anchorNode.parentElement.nodeName !== markedTag) {
            let data = anchorNode.data;
            let leftData = data.slice(0, extentOffset);
            let rightData = data.slice(extentOffset);
            let nodeLeft = document.createTextNode(leftData);
            let nodeRight = document.createTextNode(rightData);
            let eleLeft = document.createElement(markedTag);
            eleLeft.append(nodeLeft);
            parentElement.insertBefore(eleLeft, anchorNode);
            anchorNode.replaceWith(nodeRight);
        }
        return;
    }
    removeMarkedTagBySelection({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom, markedTag, true);
    let start = 0;
    const traverseDom = (dom) => {
        for (let i = 0, node; (node = dom.childNodes[i]); i++) {
            if (node.nodeType === 1) {
                if (extentNode === node) {
                    start = -1;
                }
                traverseDom(node);
            } else if (node.nodeType === 3) {
                if (node === anchorNode) {
                    if (dom.nodeName === tagForSearch && dom.parentElement.nodeName !== markedTag) {
                        let eleSearchLeft = document.createElement(tagForSearch);
                        eleSearchLeft.append(document.createTextNode(node.data));
                        let ele = document.createElement(markedTag);
                        ele.appendChild(eleSearchLeft);
                        dom.replaceWith(ele);
                    } else if (dom.nodeName !== markedTag) {
                        let data = node.data;
                        let leftData = data.slice(0, anchorOffset);
                        let rightData = data.slice(anchorOffset);
                        let nodeLeft = document.createTextNode(leftData);
                        let nodeRight = document.createTextNode(rightData);
                        let eleRight = document.createElement(markedTag);
                        node.parentElement.insertBefore(nodeLeft, node);
                        eleRight.append(nodeRight);
                        node.replaceWith(eleRight);
                        i++;
                    }
                    start = 1;
                    continue;
                }
                if (node === extentNode) {
                    if (dom.nodeName === tagForSearch) {
                        if (dom.parentElement.nodeName !== markedTag) {
                            let data = node.data;
                            let leftData = data.slice(0, extentOffset);
                            let rightData = data.slice(extentOffset);
                            let nodeLeft = document.createTextNode(leftData);
                            let nodeRight = document.createTextNode(rightData);
                            let eleSearchLeft = document.createElement(tagForSearch);
                            eleSearchLeft.append(nodeLeft);
                            let ele = document.createElement(markedTag);
                            ele.appendChild(eleSearchLeft);
                            dom.parentElement.insertBefore(ele, dom);
                            if (rightData) {
                                node.replaceWith(nodeRight);
                            } else {
                                dom.parentElement.removeChild(dom);
                            }
                        }
                    } else if (dom.nodeName !== markedTag) {
                        let data = node.data;
                        let leftData = data.slice(0, extentOffset);
                        let rightData = data.slice(extentOffset);
                        let nodeLeft = document.createTextNode(leftData);
                        let nodeRight = document.createTextNode(rightData);
                        let eleLeft = document.createElement(markedTag);
                        eleLeft.append(nodeLeft);
                        node.parentElement.insertBefore(eleLeft, node);
                        node.replaceWith(nodeRight);
                        i++;
                    }
                    start = -1;
                }
                if (start && ~start) {
                    if (node.data.trim().length) {
                        if (dom.nodeName === tagForSearch) {
                            let eleSearchLeft = document.createElement(tagForSearch);
                            eleSearchLeft.append(document.createTextNode(node.data));
                            let ele = document.createElement(markedTag);
                            ele.appendChild(eleSearchLeft);
                            dom.replaceWith(ele);
                            break;
                        } else if (dom.nodeName !== tagForMark) {
                            let ele = document.createElement(markedTag);
                            let txtNode = document.createTextNode(node.data);
                            ele.append(txtNode);
                            node.replaceWith(ele);
                        }
                    }
                }
            }
        }
    }
    traverseDom(realDom);
}

const sortAnchorNodeAndExtentNode = ({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom) => {
    let exchange;
    const searchAnchorNodeAndExtentNode = (nodes) => {
        nodes.forEach((node) => {
            if (node.nodeType === 1) {
                searchAnchorNodeAndExtentNode(node.childNodes);
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
    searchAnchorNodeAndExtentNode(realDom.childNodes);
    if (anchorNode === extentNode) {
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

const addButtonBeforeSelection = ({ anchorNode, anchorOffset, extentNode, extentOffset }, addBtnEle, removeBtnEle) => {
    let data = anchorNode.data;
    if (!data) {
        return {};
    }
    let flag = false;
    let parentElement = anchorNode.parentElement;
    if (parentElement.nodeName === tagForSearch) {
        if (anchorOffset === 0) {
            parentElement.parentElement.insertBefore(addBtnEle, parentElement);
            parentElement.parentElement.insertBefore(removeBtnEle, parentElement);
            return {};
        } else {
            let leftData = data.slice(0, anchorOffset);
            let nodeLeft = document.createTextNode(leftData);
            let rightData = data.slice(anchorOffset);
            let nodeRight = document.createTextNode(rightData);
            let eleLeft = document.createElement(tagForSearch);
            eleLeft.append(nodeLeft);
            parentElement.parentElement.insertBefore(eleLeft, parentElement);
            parentElement.parentElement.insertBefore(addBtnEle, parentElement);
            parentElement.parentElement.insertBefore(removeBtnEle, parentElement);
            anchorNode.replaceWith(nodeRight);
            if (anchorNode === extentNode) {
                return {
                    anchorNode: nodeRight,
                    anchorOffset: 0,
                    extentNode: nodeRight,
                    extentOffset: extentOffset - anchorOffset
                };
            } else {
                return {
                    anchorNode: nodeRight,
                    anchorOffset: 0,
                };
            }
        }
    }
    if (anchorNode === extentNode) {
        extentOffset -= anchorOffset;
        flag = true;
    }
    let leftData = data.slice(0, anchorOffset);
    let nodeLeft = document.createTextNode(leftData);
    parentElement.insertBefore(nodeLeft, anchorNode);
    let rightData = data.slice(anchorOffset);
    let nodeRight = document.createTextNode(rightData);
    parentElement.insertBefore(addBtnEle, anchorNode);
    parentElement.insertBefore(removeBtnEle, anchorNode);
    anchorNode.replaceWith(nodeRight);
    let anchor = {
        anchorNode: nodeRight,
        anchorOffset: 0
    };
    return flag ? { ...anchor, extentNode: nodeRight, extentOffset } : anchor
}

const setTextToSelection = ({ anchorNode, extentNode, anchorOffset, extentOffset }) => {
    let range = document.createRange();
    range.setStart(anchorNode, anchorOffset);
    range.setEnd(extentNode, extentOffset);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

const removeSelect = function () {
    let selection = window.getSelection();
    // let selection = { ...remarkSelection };
    if (selection.type !== 'Range') {
        return;
    }
    selection = {
        ...selection,
        ...sortAnchorNodeAndExtentNode(selection, root)
    }
    removeMarkedTagBySelection(selection, root, tagForMark);
    addButtonForAddAndRemove();
    jointTextNode();
}

const addSelect = function () {
    let selection = window.getSelection();
    // let selection = { ...remarkSelection };
    if (selection.type !== 'Range') {
        return;
    }
    let s = sortAnchorNodeAndExtentNode(selection, root)
    s = {
        ...s,
        ...selection,
    }
    addMarkedTagBySelection(s, root, tagForMark);
    addButtonForAddAndRemove();
}

addMarkButton.onmousedown = addSelect;
removeMarkButton.onmousedown = removeSelect;

const addButtonForAddAndRemove = e => {
    if (e && (e.target === addMarkButton || e.target === removeMarkButton)) {
        return;
    }
    let s = {};
    let selection = window.getSelection();
    s.type = selection.type;
    s = { ...s, ...sortAnchorNodeAndExtentNode(selection, root) };
    if (s.type !== 'Range') {
        if (addMarkButton.parentElement) {
            addMarkButton.parentElement.removeChild(addMarkButton);
        }
        if (removeMarkButton.parentElement) {
            if (removeMarkButton.parentElement.nodeName === tagForMark) {
                let larp = removeMarkButton.parentElement;
                if ([...larp.childNodes].every(node => {
                    return (node.nodeType === 1 && node === removeMarkButton) ||
                        (node.nodeType === 3 && node.data.trim() === '');
                })) {
                    if (!larp.parentElement) {
                        larp.removeChild(removeMarkButton);
                    } else {
                        larp.parentElement.removeChild(larp);
                    }
                } else {
                    larp.removeChild(removeMarkButton);
                }
            } else {
                removeMarkButton.parentElement.removeChild(removeMarkButton);
            }
        }
        jointTextNode();
        return;
    } else if (addMarkButton.parentElement &&
        s.anchorNode === remarkSelection.anchorNode &&
        s.anchorOffset === 0) {
        return;
    }
    s = {
        ...s,
        ...addButtonBeforeSelection(s, addMarkButton, removeMarkButton)
    }
    remarkSelection = s;
    setTextToSelection(s);
    // addMarkButton.onclick = addSelect.bind(s);
    // removeMarkButton.onclick = removeSelect.bind(s);
}

const initRealDom = function (realDom) {
    root = realDom;
    this.setState({
        realDom,
    });
}

const getTextNodeFilterByViewport = () => {
    let res = [];
    const traverseDom = (dom) => {
        dom.childNodes.forEach(node => {
            if (node.nodeType === 1) {
                traverseDom(node);
            } else if (node.nodeType === 3) {
                if (isElementInViewport(dom) && node.data.trim()) {
                    res.push(node);
                }
            }
        });
    }
    traverseDom(root);
    return res;
}

const getAllTextNode = () => {
    let res = [];
    const traverseDom = (dom) => {
        dom.childNodes.forEach(node => {
            if (node.nodeType === 1) {
                traverseDom(node);
            } else if (node.nodeType === 3) {
                if (dom.nodeName !== 'BUTTON') {
                    res.push(node);
                }
            }
        });
    }
    traverseDom(root);
    return res;
}

const isElementInViewport = el => {
    //获取元素是否在可视区域
    return el.offsetTop - window.scrollY > -el.offsetHeight &&
        el.offsetTop - window.scrollY < window.innerHeight + el.offsetHeight;
}


const clearSearchedTag = () => {
    const traverseDom = dom => {
        dom.childNodes.forEach(node => {
            if (node.nodeType === 1) {
                if (node.nodeName === tagForSearch) {
                    node.replaceWith([...node.childNodes].find(n => n.nodeType === 1 || n.data));
                } else {
                    traverseDom(node);
                }
            }
        });
    }
    traverseDom(root);
    jointTextNode();
}

const getSearchedAndSelectOne = (inputVal, index) => {
    inputVal = inputVal && inputVal.trim();
    if (inputVal === lastInput && inputVal) {
        if (typeof index === 'number') {
            if (!totalSearched[index].found) {
                totalSearched[index].selection = addTagBySelection(getNodeByStartAndEnd(root, totalSearched[index]), root, tagForSearch);
                totalSearched[index].found = true;
            }
            let el = totalSearched[index].selection;
            moveElementToCenter(el);
            setSearchedSelectIndex(index, totalSearched);
        } else {
            renderViewportSearchedArr(totalSearched);
        }
        return {
            totalSearched,
        }
    }
    clearSearchedTag();
    let currentSearchedIndex = -1;
    if (!inputVal) {
        lastInput = inputVal;
        return {
            totalSearched: [],
            currentSearchedIndex
        };
    }

    let result = searchedChangeToSelection(inputVal);

    if (~result.currentSearchedIndex) {
        setSearchedSelectIndex(result.currentSearchedIndex, result.totalSearched);
    }
    lastInput = inputVal;
    return result;
}

const setSearchedSelectIndex = (currentSearchedIndex, totalSearched) => { // 把搜索到的内容中，下标为index设为选中
    setTextToSelection(getNodeByStartAndEnd(root, totalSearched[currentSearchedIndex]));
}

const moveElementToCenter = el => {
    let h = el.offsetTop - window.innerHeight * 0.2;
    h < 0 && (h = 0);
    window.scrollTo(window.scrollX, h);
}

const jointTextNode = () => { // 把连续多个文本节点合成一个
    const traverseDom = dom => {
        let nodes = dom.childNodes;
        let len = dom.childNodes.length;
        for (let i = 0, node; (node = nodes[i]); i++) {
            if (node.nodeType === 1) {
                traverseDom(node);
            } else if (node.nodeType === 3) {
                let res = [];
                while (node && node.nodeType === 3) {
                    res.push(node);
                    i++;
                    node = nodes[i];
                }
                if (res.length > 1) {
                    let txt = res.reduce((p, n, idx) => {
                        if (idx) {
                            dom.removeChild(n);
                        }
                        return p + n.data;
                    }, '');
                    res[0].replaceWith(document.createTextNode(txt));
                }
                i--;
            }
        }
    }
    traverseDom(root);
}

const getNodeByStartAndEnd = (realDom, { start, end }) => {
    let anchorNode, extentNode, anchorOffset, extentOffset,
        anchorParent, extentParent, len1 = 0, len2 = 0;
    const traverseDom = realDom => {
        return [...realDom.childNodes].some(node => {
            if (node.nodeType === 1) {
                return traverseDom(node);
            } else if (node.nodeType == 3) {
                if (!anchorNode) {
                    len1 += node.length;
                }
                if (!extentNode) {
                    len2 += node.length;
                }
                if (len1 > start && !anchorNode) {
                    anchorNode = node;
                    anchorOffset = start - len1 + node.length;
                    anchorParent = realDom;
                }
                if (len2 >= end && !extentNode) {
                    extentNode = node;
                    extentOffset = end - len2 + node.length;
                    extentParent = realDom;
                }
                if (anchorNode && extentNode) {
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
        extentParent
    }
}

const getInnerTextStrByNode = (node, parentElement, text) => {
    if (node.nodeType === 1) {
        return [...node.childNodes].reduce((p, n) => getInnerTextStrByNode(n, node, p), text);
    } else if (node.nodeType === 3) {
        allTextNode.push(node);
        return text + node.data;
    }
    return text;
}

const searchedInViewport = (searchedArr) => {
    let viewport = [];
    let { start, end } = getViewportStartAndEnd();
    for (let i = 0, mark; (mark = searchedArr[i]); i++) {
        if (mark.start > end) {
            break;
        }
        if ((mark.start < start && mark.end > start) ||
            (mark.end > end && mark.start > end) ||
            (mark.start < start && mark.end > end) ||
            (mark.start > start && mark.end < end)) {
            viewport.push(mark);
        }
    }
    return viewport;
}

const searchedChangeToSelection = (inputVal) => {
    allTextNode = [];
    allText = getInnerTextStrByNode(root, null, '');
    let match;
    let totalSearched = [];
    let reg = new RegExp(`(${inputVal})+`, 'gm');
    while ((match = reg.exec(allText))) {
        totalSearched.push({
            start: match.index,
            end: match.index + match[0].length
        });
    }
    return renderBySearched(totalSearched);
}

const renderViewportSearchedArr = totalSearched => {
    let viewportSearchedArr = searchedInViewport(totalSearched);
    let currentSearchedIndex = totalSearched.findIndex(mark => {
        return mark === viewportSearchedArr[0]
    });
    viewportSearchedArr.forEach(mark => {
        mark.found ||
            (mark.found = true) &&
            (mark.selection = addTagBySelection(getNodeByStartAndEnd(root, mark), root, tagForSearch));
    });
    return currentSearchedIndex;
}

const renderBySearched = ts => {
    totalSearched = ts;
    if (!totalSearched.length) {
        return {
            currentSearchedIndex: -1,
            totalSearched
        }
    }
    let currentSearchedIndex = renderViewportSearchedArr(totalSearched);
    if (~currentSearchedIndex) {
        // moveElementToCenter(totalSearched[currentSearchedIndex].selection.anchorParent);
    } else {
        if (!totalSearched[0].found) {
            totalSearched[0].selection = addTagBySelection(getNodeByStartAndEnd(root, totalSearched[0]), root, tagForSearch);
            totalSearched[0].found = true;
        }
        moveElementToCenter(totalSearched[0].selection);
        setSearchedSelectIndex(0, totalSearched);
    }
    return { currentSearchedIndex, totalSearched };
}

const addTagBySelection = ({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom, markedTag) => {
    let parentElement = anchorNode.parentElement;
    let data = anchorNode.data;
    let leftData = data.slice(0, anchorOffset);
    let middleData = data.slice(anchorOffset, extentOffset);
    let rightData = data.slice(extentOffset);
    let nodeLeft = document.createTextNode(leftData);
    let nodeMiddle = document.createTextNode(middleData);
    let nodeRight = document.createTextNode(rightData);
    let eleMiddle = document.createElement(markedTag);
    if (anchorNode === extentNode) {
        eleMiddle.append(nodeMiddle);
        if (parentElement.nodeName === tagForMark) {
            if (leftData) {
                let eleLeft = document.createElement(tagForMark);
                eleLeft.append(nodeLeft);
                parentElement.parentElement.insertBefore(eleLeft, parentElement);
            }
            if (rightData) {
                let ele = document.createElement(tagForMark);
                ele.append(eleMiddle);
                parentElement.parentElement.insertBefore(ele, parentElement);
                anchorNode.replaceWith(nodeRight);
            } else {
                anchorNode.replaceWith(eleMiddle);
            }
        } else if (parentElement.nodeName !== markedTag) {
            parentElement.insertBefore(nodeLeft, anchorNode);
            parentElement.insertBefore(eleMiddle, anchorNode);
            anchorNode.replaceWith(nodeRight);
        }
        return eleMiddle;
    }
    if (parentElement.nodeName === tagForMark) {
        if (leftData) {
            let eleLeft = document.createElement(tagForMark);
            eleLeft.append(nodeLeft);
            parentElement.parentElement.insertBefore(eleLeft, parentElement);
        }
        let node = document.createTextNode(data.slice(anchorOffset));
        anchorNode.replaceWith(node);
        anchorNode = node;
        anchorOffset = 0;
    }
    if (extentNode.parentElement.nodeName === tagForMark) {
        let parentElement = extentNode.parentElement;
        let rightData = extentNode.data.slice(extentOffset);
        if (rightData) {
            let nodeRight = document.createTextNode(rightData);
            let eleRight = document.createElement(tagForMark);
            eleRight.append(nodeRight);
            if (parentElement.nextSibling) {
                parentElement.parentElement.insertBefore(eleRight, parentElement.nextSibling);
            } else {
                parentElement.parentElement.appendChild(eleRight);
            }
        }
        let newExtentNode = document.createTextNode(extentNode.data.slice(0, extentOffset));
        extentNode.replaceWith(newExtentNode);
        extentNode = newExtentNode;
    }
    let start = 0;
    let markedElement;
    const traverseDom = (dom) => {
        for (let i = 0, node; (node = dom.childNodes[i]); i++) {
            if (node.nodeType === 1) {
                traverseDom(node);
            } else if (node.nodeType === 3) {
                if (node === anchorNode) {
                    if (dom.nodeName !== markedTag) {
                        let data = node.data;
                        let leftData = data.slice(0, anchorOffset);
                        let rightData = data.slice(anchorOffset);
                        let nodeLeft = document.createTextNode(leftData);
                        let nodeRight = document.createTextNode(rightData);
                        let eleRight = document.createElement(markedTag);
                        node.parentElement.insertBefore(nodeLeft, node);
                        eleRight.append(nodeRight);
                        node.replaceWith(eleRight);
                        if (!markedElement) {
                            markedElement = eleRight;
                        }
                        i++;
                    }
                    start = 1;
                } else if (node === extentNode) {
                    let data = node.data;
                    let leftData = data.slice(0, extentOffset);
                    let rightData = data.slice(extentOffset);
                    let nodeLeft = document.createTextNode(leftData);
                    let nodeRight = document.createTextNode(rightData);
                    let eleLeft = document.createElement(markedTag);
                    eleLeft.append(nodeLeft);
                    node.parentElement.insertBefore(eleLeft, node);
                    node.replaceWith(nodeRight);
                    i++;
                    start = -1;
                    if (!markedElement) {
                        markedElement = eleLeft;
                    }
                    break;
                } else if (start && ~start) {
                    if (node.data.trim().length) {
                        let ele = document.createElement(markedTag);
                        let txtNode = document.createTextNode(node.data);
                        ele.append(txtNode);
                        node.replaceWith(ele);
                        if (!markedElement) {
                            markedElement = ele;
                        }
                    }
                }
            }
        }
    }
    traverseDom(realDom);
    return markedElement;
}

const getViewportStartAndEnd = () => {
    let allTextNode = getAllTextNode();
    let viewportTextNode = getTextNodeFilterByViewport();
    let anchorNode = viewportTextNode[0];
    let extentNode = viewportTextNode[viewportTextNode.length - 1];
    let startFlag = false, start = 0, endFlag = false, end = 0;
    allTextNode.some(node => {
        if (node === anchorNode) {
            startFlag = true;
        }
        if (node === extentNode) {
            endFlag = true;
        }
        if (!startFlag) {
            start += node.length;
        }
        if (!endFlag) {
            end += node.length;
        }
        return startFlag && endFlag;
    });
    return {
        start,
        end
    }
}

const getStartAndEndBySelection = ({ anchorNode, extentNode, anchorOffset, extentOffset }, realDom) => {
    let start = 0, end = 0, startStop = false, endStop = false;
    const traverseDom = (dom) => {
        if (dom.nodeType === 1) {
            dom.childNodes.forEach(node => traverseDom(node));
        } else if (dom.nodeType === 3) {
            if (dom === anchorNode) {
                startStop = true;
                start += anchorOffset;
            }
            if (dom === extentNode) {
                endStop = true;
                end += extentOffset;
            }
            if (!startStop) {
                start += dom.length;
            }
            if (!endStop) {
                end += dom.length;
            }
        }
    }
    traverseDom(realDom);
    return {
        start,
        end
    }
}

const addMark = function (markedArr, mark) { // 插入区间
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
    });
}

const getMarkedArr = () => markedArr;

const initMarkedArr = (arr) => {
    markedArr = arr;
    arr.forEach(mark => {
        let s = getNodeByStartAndEnd(root, mark);
        addTagBySelection(s, root, tagForMark);
    });
};

export const MarkModule = {
    initRealDom,
    addSelect,
    removeSelect,
    addButtonForAddAndRemove,
    getSearchedAndSelectOne,
    moveElementToCenter,
    getMarkedArr,
    initMarkedArr
};

export default MarkModule;
