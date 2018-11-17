import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import HelloWorld from '@/components/HelloWorld'
import test from '../components/page/test'
import map from '../components/page/map/map'
import dddmap from '../components/page/map/3Dmap'
import toolMap from '../components/page/map/toolMap'
import langMap from '../components/page/map/langMap'
import asyncMap from '../components/page/map/asyncMap'
import cityMap from '../components/page/map/cityNameMap'
import markerMap from '../components/page/map/markerMap'
import moveMap from '../components/page/map/moveMap'
import statusMap from '../components/page/map/statusMap'
import limitBoundsMap from '../components/page/map/limitBoundsMap'
import moveEndMap from '../components/page/map/moveEndMap'
import zoomMap from '../components/page/map/zoomMap'
import lnglatMap from '../components/page/map/lnglatMap'
import hotspotMap from '../components/page/map/hotspotMap'
import questions from "../components/page/qa/questions"
import twentyfe from '../components/page/game/2048/twentyFourtyEight'
import touch from '../components/page/touchTest/touch'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      component: App,
      children:[
        {
          path: '/hello',
          name: 'HelloWorld',
          component: HelloWorld
        },
        {
          path:'/test',
          component:test
        },
        {
          path:'/map',
          component:map
        },
        {
          path:'/dddmap',
          component:dddmap
        },
        {
          path:'/tool',
          component:toolMap
        },
        {
          path:'/lang',
          component:langMap
        },
        {
          path:'/async',
          component:asyncMap
        },
        {
          path:'/city',
          component:cityMap
        },
        {
          path:'/marker',
          component:markerMap
        },
        {
          path:'/move',
          component:moveMap
        },
        {
          path:'/touch',
          component:touch
        },
        {
          path:'/status',
          component:statusMap
        },
        {
          path:'/limit',
          component:limitBoundsMap
        },
        {
          path:'/moveend',
          component:moveEndMap
        },
        {
          path:'/zoom',
          component:zoomMap
        },
        {
          path:'/lnglat',
          component:lnglatMap
        },
        {
          path:'/hotspot',
          component:hotspotMap
        },
        {
          path:'/2048',
          component:twentyfe
        },
        {
          path: '/question',
          component: questions,
          meta:{
            keepAlive:true
          }
        },
      ]
    },
  ]
})
