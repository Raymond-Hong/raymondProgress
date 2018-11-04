// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import {zh_tran} from './plugins/zh'
import touch from './plugins/vue-touch'
import dir from './plugins/directive'
// import AMap from 'vue-amap';

// Vue.use(AMap);
// Vue.config.productionTip = false
Vue.filter('trans',value=>{
  return zh_tran(value, localStorage.getItem('lang'));
})
dir.derection.forEach((el)=>{
	if(dir[el]){
		Vue.directive(el,dir[el]());
	}else{
		Vue.directive(el,dir.touchFn(touch.swipe,el));
	}
})
/* eslint-disable no-new */
new Vue({
  router,
}).$mount("#app")
