<template>
  <div>
<div id="container" style="width:800px; height:600px"></div>
 <div class="button-group">
    <input @click="clickListener('en')" type="button" class="button" value="显示英文底图" />
    <input @click="clickListener('zh_en')" type="button" class="button" value="显示中英文对照底图" />
    <input @click="clickListener('zh_cn')" type="button" class="button" value="显示中文底图" />
  </div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            lang:"zh_cn",
            map:{}
        }
    },
    mounted(){
        this.map=new AMap.Map("container",{
            zoom: 12,
            center:[113.5055,22.200]
        })
    },
    methods:{
        clickListener(value){
            this.lang=value;
            this.map.setLang(this.lang)
        }
    }
}
</script>

<style>

</style>
