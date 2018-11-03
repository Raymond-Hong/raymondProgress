<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div id="tip">可以缩放地图，得到缩放级别哦！<br>
        <span>{{info}}</span>
    </div>
  </div>
</template>
<script>
  export default {
      data(){
          return{
            map:{},
            info:""
          }
      },
    mounted(){
        this.map=new AMap.Map('container', {
          resizeEnable:true,
        });
        let vm=this;
        AMap.event.addListener(vm.map,'zoomend',function(){
            vm.info=vm.map.getZoom();
        })
    },
    methods: {
    }
  }
</script>
<style>
</style>