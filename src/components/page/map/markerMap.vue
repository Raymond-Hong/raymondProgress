<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div class="button-group">
        <input @click="setCenter" type="button" class="button" value="改变地图中心点及缩放级别"/>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            map:{},
        }
    },
    mounted(){
        this.map = new AMap.Map('container', {
            resizeEnable: true,
            zoom:12,
            center:[113.5055,22.200]
        });
    },
    methods:{
        setCenter(){
            this.map.setZoomAndCenter(14,[113.5325,22.192]);
            let vm=this;
            new AMap.Marker({
                map:vm.map,
                position:[113.5325,22.192]
            })
        }
    }
}
</script>

<style scoped>

</style>
