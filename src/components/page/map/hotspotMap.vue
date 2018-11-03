<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div id="tip">鼠标点击热点试试</div>
  </div>
</template>
<script>
function createContent(poi) {  //信息窗体内容
    var s = [];
    s.push('<div class="info-title">'+poi.name+'</div><div class="info-content">'+"地址：" + poi.address);
    s.push("电话：" + poi.tel);
    s.push("类型：" + poi.type);
    s.push('<div>');
    return s.join("<br>");
}
export default {
data(){
    return{
        map:{},
        placeSearch:{},
        infoWindow:{}
    }
},
mounted(){
    this.map=new AMap.Map('container', {
        resizeEnable:true,
        center:[113.5055,22.200],
        zoom: 13,
        isHotspot: true
    });
    let vm=this;
    AMap.service(['AMap.PlaceSearch','AMap.AdvancedInfoWindow'],function(){
        vm.placeSearch = new AMap.PlaceSearch();  //构造地点查询类
        vm.infoWindow = new AMap.AdvancedInfoWindow({});
    });
    this.map.on('hotspotclick', function(result) {
        vm.placeSearch.getDetails(result.id, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                vm.placeSearch_CallBack(result);
            }
    });
});
},
methods: {
    placeSearch_CallBack(data) { //infoWindow.open(map, result.lnglat);
        let poiArr = data.poiList.pois;
        let location = poiArr[0].location;
        this.infoWindow.setContent(createContent(poiArr[0]));
        this.infoWindow.open(this.map,location);
    }
}
}
</script>
<style>
 .info-title{
    color: white;
    font-size: 14px;
    background-color: blue;
    line-height: 26px;
    padding: 0px 0 0 6px;
    font-weight: lighter;
    letter-spacing: 1px
}
.info-content{
    padding: 4px;
    color: #666666;
    line-height: 23px;
    font: 12px Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial;
}
.info-content img{
    float: left;
    margin: 3px;
}
</style>