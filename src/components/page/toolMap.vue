<template>
  <div>
<!--  带功能控件的地图 -->
<div id="container" style="width:800px; height:600px"></div>
<div class='button-group' style="background-color: #0d9bf2;right: 20px">
    <input type="checkbox" id="scale" @click='toggle("scale")'/>比例尺
    <input type="checkbox" id="bar" @click='toggle("bar")'/>工具条
    <input type="checkbox" id="direction" disabled @click='toggle("direction")'/>工具条方向盘
    <input type="checkbox" id="ruler" disabled @click='toggle("ruler")'/>工具条标尺
    <input type="checkbox" id="view" @click='toggle("view")'/>显示鹰眼
    <input type="checkbox" id="viewOpen" disabled @click='toggle("viewOpen")'/>展开鹰眼
</div>
  </div>
</template>
<script>
function showToolBar() {
    document.getElementById('bar').checked = true;
    document.getElementById('direction').disabled = false;
    document.getElementById('direction').checked = true;
    document.getElementById('ruler').disabled = false;
    document.getElementById('ruler').checked = true;
}
function hideToolBar() {
    document.getElementById('bar').checked = false;
    document.getElementById('direction').disabled = true;
    document.getElementById('direction').checked = false;
    document.getElementById('ruler').disabled = true;
    document.getElementById('ruler').checked = false;
}
export default {
    data(){
        return{
            visible:false,
            scale:{},
            toolBar:{},
            overView:{},
            map:{},
        }
    },
    mounted(){
        this.map=new AMap.Map("container",{
            resizeEnable: true,
            zoom: 12,
            center:[113.5055,22.200]
        });
        let vm=this;
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale',"AMap.OverView"], function () {
            vm.scale=new AMap.Scale({
                visible:vm.visible
            });
            vm.toolBar=new AMap.ToolBar({
                visible:vm.visible
            });
            vm.overView=new AMap.OverView({
                visible:vm.visible
            });
            vm.map.addControl(vm.scale);
            vm.map.addControl(vm.toolBar);
            vm.map.addControl(vm.overView);
        })
    },
    methods:{
        toggle(value){
            if(document.getElementById(value).checked){
                if(value=="scale"){
                    this.scale.show();
                }else if(value=="bar"){
                    showToolBar();
                    this.toolBar.show();
                }else if(value=="view"){
                    this.overView.show();
                    document.getElementById('viewOpen').disabled = false;
                }else if(value=="direction"){
                    this.toolBar.showDirection();
                }else if(value=="ruler"){
                    this.toolBar.showRuler();
                }else if(value="viewOpen"){
                    this.overView.open();
                }
            }else{
                if(value=="scale"){
                    this.scale.hide();
                }else if(value=="bar"){
                    hideToolBar();
                    this.toolBar.hide();
                }else if(value=="view"){
                    this.overView.hide();
                    document.getElementById('viewOpen').disabled = true;
                    document.getElementById('viewOpen').checked = false;
                }else if(value=="direction"){
                    this.toolBar.hideDirection();
                }else if(value=="ruler"){
                    this.toolBar.hideRuler();
                }else if(value="viewOpen"){
                    this.overView.close();
                }
            }
        }
    }
}
</script>

<style>

</style>
