function initConfig(len,divWidth,divHeight){
    return {
        divStyle : {
            position: 'relative',
            overflow: 'hidden'
        },
        ulStyle : {
            position: 'absolute',
            left: 0,
            top: 0,
            width: (len+1)*divWidth + 'px',
            height: divHeight + 'px'
        },
        liStyle : {
            width: divWidth + 'px',
            height: divHeight + 'px',
            float: 'left'
        },
        imgStyle : {
            width: '100%',
            height: '100%'
        },
        btnStyle : {
            width: '40px',
            height: '40px',
            backgroundColor: 'black',
            position: 'absolute',
            textAlign: 'center',
            lineHeight: '40px',
            color: '#fff',
            top: '50%',
            marginTop: '-20px',
            opacity: '0.1',
            cursor: 'pointer'
        },
        leftBtnStyle : {
            left:'15px'
        },
        rightBtnStyle : {
            right:'15px'
        },
        sliderIndexStyle : {
            position: 'absolute',
            width: '100%',
            bottom: '20px',
            textAlign: 'center',
            cursor: 'pointer'
        },
        spanStyle : {
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ccc',
            marginRight: '15px'
        },
        activeStyle : {
            backgroundColor:'#f40'
        },
        cancelActiveStyle:{
            backgroundColor: '#ccc'
        }
    }
}