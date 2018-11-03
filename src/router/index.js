import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import HelloWorld from '@/components/HelloWorld'
import test from '../components/page/test'
import map from '../components/page/map'
import dddmap from '../components/page/3Dmap'
import toolMap from '../components/page/toolMap'
import langMap from '../components/page/langMap'
import asyncMap from '../components/page/asyncMap'
import cityMap from '../components/page/cityNameMap'
import markerMap from '../components/page/markerMap'
import moveMap from '../components/page/moveMap'
import statusMap from '../components/page/statusMap'
import limitBoundsMap from '../components/page/limitBoundsMap'
import moveEndMap from '../components/page/moveEndMap'
import zoomMap from '../components/page/zoomMap'
import lnglatMap from '../components/page/lnglatMap'
import hotspotMap from '../components/page/hotspotMap'
import questions from "../components/page/qa/questions"
import twentyfe from '../components/page/game/twentyFourtyEight'
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
