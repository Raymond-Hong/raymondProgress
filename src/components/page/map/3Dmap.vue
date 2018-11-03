<template>
  <div>
      3D Map
<div id="container" style="width:800px; height:600px;resize:both;"></div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            map:{}
        }
    },
    mounted(){
        this.map=new AMap.Map("container",{
            resizeEnable: true,
            rotateEnable:true,
            pitchEnable:true,
            zoom: 15,
            pitch:20,
            rotation:-15,
            viewMode:'3D',//开启3D视图,默认为关闭
            buildingAnimation:true,//楼块出现是否带动画
            expandZoomRange:true,
            zooms:[3,20],
            center:[113.5255,22.200]
        });
        let vm=this;
        let bar;
        AMap.plugin(['AMap.ControlBar'], function () {
            console.log("control");
            bar = new AMap.ControlBar({
                showZoomBar:false,
                showControlButton:true,
                position:{
                    right:'10px',
                    top:'10px'
                }
            })
            vm.map.addControl(bar);
        });
    }
}
</script>
<style scoped>
body,html{ margin:0;padding:0;font:12px/16px Verdana,Helvetica,Arial,sans-serif;width: 100%;height: 100%}
.container{
  height: 100%
}
</style>
