function InitConfig(width,height,num){
    return{
        liStyle:{
            width:width+'px',
            height:height+'px',
            boxSizing:'border-box',
            float:'left',
            margin:'1px'
        },
        imgStyle:{
            width:'100%',
            height:'100%',
            fontSize:height-20+'px',
            textAlign:'center',
            lineHeight:height+'px',
            backgroundColor:'antiquewhite'
        },
        ulStyle:{
            width:'100%'
        },
        contentStyle:{
            width:num*(width+2)+'px',
            margin:'100px auto'
        }
    }
}