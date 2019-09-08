import React from 'react';
import Mark from './mark'

const setState = function (obj) {
    Object.assign(this.state, obj);
}
class MarkableText extends React.Component {
    constructor() {
        super();
        this.state = {
            inputVal: '',
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
                setState
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
                setState
            },
            markedArr: [],
            originTarget: '',
            target: '',
            // start: '',
            // end: '',
            anchorNode: '',
            extentNode: '',
            anchorOffset: '',
            extentOffset: '',
            markable: false
        }
    }
    render() {
        const { text } = this.props;
        return (
            <>
                {/* section1 */}
                <div onMouseUp={this.handleSelect.bind(this.state.section1)}>section1{text}</div>
                <button onClick={this.addMark.bind(this.state.section1)} value={this.state.inputVal}>标记</button>
                <button onClick={this.removeMark.bind(this.state.section1)}>取消标记</button>

                {/* section2 */}
                <button onClick={this.addMark.bind(this.state.section2)} value={this.state.inputVal}>标记</button>
                <button onClick={this.removeMark.bind(this.state.section2)}>取消标记</button>
                <div onMouseUp={this.handleSelect.bind(this.state.section2)}>
                    section2
                    <p>
                        {text}
                    </p>
                    <div>
                        666425234
                    <button style={{ userSelect: 'none' }}>66666666666</button>
                        <button>452345</button>
                    </div>
                    871787
                    {text}
                </div>

                {/* section3 */}
                <h3>{this.state.inputVal}</h3>
                <input onInput={this.handleInput}></input>
                <div onMouseUp={this.handleSelect.bind(this)}>
                    section3
                    {text}
                    <div>
                        <p>asfsadf</p>
                    </div>
                    <p>dsafasdfasdf</p>
                    <span>5555</span>
                </div>
                <button onClick={this.addMark.bind(this)} value={this.state.inputVal}>标记</button>
                <button onClick={this.removeMark.bind(this)}>取消标记</button>
            </>
        )
    };
    componentDidMount() {
        // Mark.initTag('chuqi', ['span', 'p', 'div']);
    }
    handleInput = e => {
        this.setState({
            inputVal: e.target.value
        })
    }
    handleSelect(e) {
        Mark.handleSelect.call(this, e);
    }
    addMark() {
        Mark.addMark.call(this);
    }
    removeMark() {
        Mark.removeMark.call(this);
    }
}

export default MarkableText;