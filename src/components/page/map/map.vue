<template>
  <div>
      map map map
    <div id="mapcointainer" style="width:800px; height:600px"></div>
  </div>
</template>
<script>
export default {
  data(){
      return{
        map:{}
      }
  },
  mounted(){
      new AMap.Map('mapcointainer', {
        resizeEnable:false,
        zoom:14,
        zooms:[3,20],
        viewMode:'3D',
        buildingAnimation:true,
        center:[113.5055,22.200]
      })
  },
  methods: {
  }
}
</script>
<style>
</style>