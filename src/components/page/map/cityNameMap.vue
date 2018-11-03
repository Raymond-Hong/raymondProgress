<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div class="button-group">
        <input v-model="cityName" class="inputtext" placeholder="请输入城市的名称" type="text"/>
        <input @click="setThisCity" class="button" value="到指定的城市或地区" type="button"/>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            map:{},
            cityName:"北京市"
        }
    },
    mounted(){
        this.map = new AMap.Map('container', {
            resizeEnable: true,
        });
    },
    methods:{
        setThisCity(){
            if(!this.cityName){
                this.cityName="北京市";
            }
            this.map.setCity(this.cityName);
        }
    }
}
</script>

<style scoped>
input[type="text"] {
    height: 25px;
    outline: none;
    border: 0;
    border: 1px solid #CCCCCC;
    padding: 0 4px;
}

</style>
