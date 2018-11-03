<template>
  <div id="appp">
    <!-- <nav align="left">
      <ul>
        <li>
          <router-link :to="{path:'/map'}">地图显示</router-link>
          <router-link :to="{path:'/dddmap'}">3D地图(?)</router-link>
          <router-link :to="{path:'/lang'}">英文、中英文地图</router-link>
          <router-link :to="{path:'/tool'}">带功能控件的地图</router-link>
          <router-link :to="{path:'/async'}">异步加载地图</router-link>
          <router-link :to="{path:'/city'}">根据城市名称设置中心点</router-link>
          <router-link :to="{path:'/marker'}">改变地图中心点及缩放级别</router-link>
        </li>
        <li>
          <router-link :to="{path:'/move'}">地图平移</router-link>
          <router-link :to="{path:'/status'}">设置地图状态</router-link>
          <router-link :to="{path:'/limit'}">限制地图显示范围</router-link>
          <router-link :to="{path:'/moveend'}">获取地图当前所在的行政区</router-link>
          <router-link :to="{path:'/zoom'}">获取地图缩放级别</router-link>
          <router-link :to="{path:'/lnglat'}">鼠标点取经纬度</router-link>
          <router-link :to="{path:'/hotspot'}">地图热点</router-link>
        </li>
      </ul>
    </nav> -->
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#appp {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
