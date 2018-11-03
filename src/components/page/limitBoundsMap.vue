<template>
  <div>
    <div id="container" style="width:800px; height:600px"></div>
    <div class="button-group">
        <input type="button" class="button" @click="setLimitBounds()" value="限定区域到当前视野" />
        <input type="button" class="button" @click="getLimitBounds()" value="获取限制的区域"/>
        <input type="button" class="button" @click="clearLimitBounds()" value="清除区域限制"/>
    </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            map:{},
            citybounds:""
        }
    },
    mounted(){
        this.map = new AMap.Map('container', {
            resizeEnable: true,
        });
        let vm=this;
        this.map.plugin(["AMap.CitySearch"],function(){
            let citysearch = new AMap.CitySearch();
            citysearch.getLocalCity();
            AMap.event.addListener(citysearch, "complete", function(result) {
                let citybounds;
                if (result && result.city && result.bounds) {
                    citybounds = result.bounds;
                    vm.map.setBounds(citybounds);
                }
            });
        });
    },
    methods:{
        setLimitBounds() {
            this.map.setLimitBounds(this.map.getBounds());
        },
        getLimitBounds() {
            let limitBounds = this.map.getLimitBounds();
            if (limitBounds) {
                var tip = [];
                tip.push('限制区域：\n西南坐标[' + limitBounds.southwest.lng + ',' + limitBounds.southwest.lat + ']\n')
                tip.push('东北坐标[' + limitBounds.northeast.lng + ',' + limitBounds.northeast.lat + ']')
                alert(tip.join(''));
            } else {
                alert('未设置限制区域');
            }
        },
        clearLimitBounds() {
            this.map.clearLimitBounds();
        }
    }
}
</script>

<style scoped>

</style>
