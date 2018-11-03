<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div class='button-group' style="background-color: #0d9bf2">
        <input type="checkbox" id="drag" @click="toggle('drag')">允许拖拽地图
        <input type="checkbox" id="keyboard"  @click="toggle('keyboard')">允许键盘平移
        <input type="checkbox" id="doubleClickZoom" @click="toggle('doubleClickZoom')">允许双击放大地图
        <input type="checkbox" id="isHotspot" @click="toggle('isHotspot')">允许叠加地图热点
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            map:{},
            hotSpotMarker:""
        }
    },
    mounted(){
        this.map = new AMap.Map('container', {
            resizeEnable: true,
            dragEnable: false,
            keyboardEnable: false,
            doubleClickZoom: false,
            isHotspot:false,
            zoom: 13
        });
        let vm=this;
        this.map.on("hotspotclick", function(e) {
            if (vm.hotSpotMarker) {
                vm.hotSpotMarker.setMap(null);
            }
            vm.hotSpotMarker = new AMap.Marker({
                position: e.lnglat,
                map: vm.map,
                content: '<div id="hotspot">' + e.name + '</div>'
            });
        })
    },
    methods:{
       toggle(value){
            let status=false;
            if(document.getElementById(value).checked){
                status = true;
            }
            if("drag"===value){
                this.map.setStatus({dragEnable:status});
            }
            if("keyboard"===value){
                this.map.setStatus({keyboardEnable:status});
            }
            if("doubleClickZoom"===value){
                this.map.setStatus({doubleClickZoom:status});
            }
            if("isHotspot"===value){
                this.map.setStatus({isHotspot:status});
                if(!status){
                    this.hotSpotMarker.setMap(null);
                }
            }
       },
    },
}
</script>

<style scoped>
#hotspot {
    /* white-space: nowrap; */
    font-size: 12px;
    border: 1px solid rgb(88, 86, 196);
    padding: 4px;
    background-color: rgb(48, 139, 109);
}
</style>
