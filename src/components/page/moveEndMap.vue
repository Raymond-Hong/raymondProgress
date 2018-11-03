<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div id="tip">可以移动地图，得到城市的信息哦！<br>
        <span>{{info}}</span>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
        return{
            map:{},
            info:"11"
        }
    },
    mounted(){
        this.map=new AMap.Map('container', {
          resizeEnable:true,
        });
        let vm=this;
        this.map.on("moveend",//getCity(vm.map)
        function(){
            vm.map.getCity(data=>{
                if(data['province'] && typeof data['province']==='string'){
                    vm.info = '城市：' + (data['city'] || data['province']);
                }
            });
        }
        );
    },
    methods: {
    }
  }
</script>
<style>
</style>