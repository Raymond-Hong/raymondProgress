<template>
<div>
<div id="container" style="width:800px; height:600px"></div>
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
        this.map=new AMap.Map('container', {
          resizeEnable:true,
        });
        let vm=this;
    },
    methods: {
    }
}
</script>

<style>
</style>