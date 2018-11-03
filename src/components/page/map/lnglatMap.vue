<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div id="myPageTop">
        <table>
            <tr>
                <td>
                    <label>按关键字搜索：</label>
                </td>
                <td class="column2">
                    <label>左击获取经纬度：</label>
                </td>
            </tr>
            <tr>
                <td>
                    <input type="text" placeholder="请输入关键字进行搜索" id="tipinput">
                </td>
                <td class="column2">
                    <input type="text" readonly="true" v-model="lnglat">
                </td>
            </tr>
        </table>
    </div>
  </div>
</template>
<script>
  export default {
    data(){
        return{
        map:{},
        lnglat:""
        }
    },
    mounted(){
        this.map=new AMap.Map('container', {
          resizeEnable:true,
        });
        let vm=this;
        this.map.on("click",function(e){
            vm.lnglat=e.lnglat.getLng() + ',' + e.lnglat.getLat();
        });
        let auto;
        AMap.plugin(['AMap.Autocomplete'],function(){
            auto = new AMap.Autocomplete({
                input:"tipinput"
            });
        });
        AMap.event.addListener(auto,"select",function(e){
            if(e.poi&&e.poi.location){
                vm.map.setZoom(15);
                vm.map.setCenter(e.poi.location);
            }
        })
    },
    methods: {
    }
  }
</script>
<style>
</style>