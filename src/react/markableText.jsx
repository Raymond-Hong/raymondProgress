import React from 'react';
import Mark from './mark'

class MarkableText extends React.Component {
    constructor() {
        super();
        this.state = {
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
    }
    render() {
        const { text } = this.props;
        return (
            <>
                <button onClick={this.addMark}>标记</button>
                <button onClick={this.removeMark}>取消标记</button>
                <div onMouseUp={this.handleSelect}>
                    <p>
                        {text}
                    </p>
                    <div>
                        666425234
                    <button style={{userSelect: 'none'}}>66666666666</button>
                    <button style={{userSelect: 'none'}}>452345</button>
                    </div>
                    {text}
                </div>
            </>
        )
    };
    handleSelect = e => {
        let selection = window.getSelection();
        let anchorOffset = selection.anchorOffset;
        let extentOffset = selection.extentOffset;
        let anchorNode, extentNode;
        let target = e.currentTarget;
        let originTarget = document.createElement(target.nodeName);
        originTarget.innerHTML = target.innerHTML;
        ({ anchorNode, extentNode } = selection);
        function getStart() {
            let nodes = target.childNodes;
            if (anchorNode !== extentNode) {
                let exchange;
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
                if (exchange) {
                    [anchorOffset, extentOffset] = [extentOffset, anchorOffset];
                    [anchorNode, extentNode] = [extentNode, anchorNode];
                }
            } else {
                if (anchorOffset > extentOffset) {
                    [anchorOffset, extentOffset] = [extentOffset, anchorOffset];
                    [anchorNode, extentNode] = [extentNode, anchorNode];
                }
            }
        }
        getStart();
        this.setState({
            target,
            originTarget: this.state.originTarget || originTarget,
            anchorNode,
            extentNode,
            anchorOffset,
            extentOffset
        });
    }
    getSelected = () => {
        let { target, anchorOffset, extentOffset, anchorNode, extentNode } = this.state;
        let start = anchorOffset, end = extentOffset;
        let mark = { start, end };
        Mark.getSelected(target, mark, anchorNode, extentNode, { start: true, end: true });
        return mark;
    }
    renderByMarked = (markedArr) => {
        let { originTarget } = this.state;
        let template = document.createElement(originTarget.nodeName);
        template.innerHTML = originTarget.innerHTML;
        return markedArr.reduce((p, mark) => {
            Mark.changeNodeValueByMark(p, JSON.parse(JSON.stringify(mark)));
            return p;
        }, template).innerHTML;
    }
    marking = (behavior) => {
        let { target, markedArr } = this.state;
        if (!target) {
            return;
        }
        markedArr = Mark[behavior](markedArr, this.getSelected());
        target.innerHTML = this.renderByMarked(markedArr);
        this.setState({
            markedArr,
            target: null
        })
    }
    addMark = () => {
        this.marking('addMark');
    }
    removeMark = () => {
        this.marking('removeMark');
    }
}

export default MarkableText;