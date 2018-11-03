<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div class="button-group">
        <input @click="piexBtnf" type="button" class="button" value="平移像素值：(-50,-100)"/>
        <input @click="piexBtn" type="button" class="button" value="平移像素值：(50,100)"/>
        <input @click="pantoBtn" type="button" class="button" value="地图中心点平移至：(116.405467,39.907761)"/>
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
        piexBtnf(){
            this.map.panBy(-50,-100)
        },
        piexBtn(){
            this.map.panBy(50,100)
        },
        pantoBtn(){
            this.map.panTo([116.405467, 39.907761]);
        }
    }
}
</script>

<style scoped>

</style>
