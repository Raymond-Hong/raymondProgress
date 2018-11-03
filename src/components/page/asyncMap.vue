<template>
  <div>
<div id="container" style="width:800px; height:600px"></div>
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
        this.map = new AMap.Map('container', {
            center:[113.5055,22.200],
            zoom: 12,
        });
        let vm=this;
        vm.map.plugin(["AMap.ToolBar"], function() {
            vm.map.addControl(new AMap.ToolBar());
        });
    }
}
</script>

<style>

</style>
