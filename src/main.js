// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import {zh_tran} from './plugins/zh'
import touch from './plugins/vue-touch'
// import AMap from 'vue-amap';

// Vue.use(AMap);
// Vue.config.productionTip = false
Vue.filter('trans',value=>{
  return zh_tran(value, localStorage.getItem('lang'));
})
Vue.directive("tap",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"tap");
	}
});
Vue.directive("swipe",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"swipe");
	}
});
Vue.directive("swipeleft",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"swipeleft");
	}
});
Vue.directive("swiperight",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"swiperight");
	}
});
Vue.directive("swipedown",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"swipedown");
	}
});
Vue.directive("swipeup",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"swipeup");
	}
});
Vue.directive("longtap",{
	bind:function(el,binding){
		new touch.swipe(el,binding,"longtap");
	}
});
Vue.directive('qaload-more',{bind:(el,binding)=>{
  el.addEventListener('touchmove', () => {
    if(document.body.scrollHeight-30<=screen.height+document.body.scrollTop){
      binding.value();
    }
  }, false)
}})
/* eslint-disable no-new */
new Vue({
  router,
}).$mount("#app")
