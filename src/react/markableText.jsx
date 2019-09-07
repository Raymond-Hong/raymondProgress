import React from 'react';
import Mark from './mark'

class MarkableText extends React.Component {
    constructor() {
        super();
        this.state = {
            inputVal: '',
            markedArr: [],
            originTarget: '',
            target: '',
            // start: '',
            // end: '',
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
                <button onClick={this.addMark} value={this.state.inputVal}>标记</button>
                <button onClick={this.removeMark}>取消标记</button>
                {/* <input onInput={this.handleInput}></input> */}
                <div onMouseUp={this.handleSelect}>
                    <p>
                        {/* {this.state.inputVal} */}
                        {text}
                    </p>
                    <div>
                        666425234
                    <button style={{userSelect: 'none'}}>66666666666</button>
                    <button>452345</button>
                    </div>
                    871787
                    {text}
                </div>
            </>
        )
    };
    handleInput = e => {
        this.setState({
            inputVal: e.target.value
        })
    }
    handleSelect = e => {
        Mark.handleSelect.call(this, e);
    }
    addMark = () => {
        Mark.addMark.call(this);
    }
    removeMark = () => {
        Mark.removeMark.call(this);
    }
}

export default MarkableText;