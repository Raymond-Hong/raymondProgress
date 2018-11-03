<template>
  <div>
     <div id="app" class="box"
     v-tap="vuetouch"
     v-longtap="{fn:vuetouch,name:'长按'}"
     v-swipeleft="{fn:vuetouch,name:'左滑'}"
     v-swiperight="{fn:vuetouch,name:'右滑'}"
     v-swipeup="{fn:vuetouch,name:'上滑'}"
     v-swipedown="{fn:vuetouch,name:'下滑'}"
     >{{name}}</div>
  </div>
</template>
<script>
export default {
    data(){
        return{
            name:"开始"
        }
    },
    created(){
        // $("p").on("tap",function(){
        //     $(this).hide();
        // });
    },
    methods:{
        vuetouch:function(s,e){
            this.name=s.name;
        }
    }
}
</script>
<style>
*{margin:0;padding:0;}
li{list-style:none;}
.m-slider{width:600px;margin:50px 20px;overflow:hidden;}
.m-slider .cnt{position:relative;left:0;width:3000px;}
.m-slider .cnt li{float:left;width:600px;}
.m-slider .cnt img{display:block;width:100%;height:450px;}
.m-slider .cnt p{margin:20px 0;}
.m-slider .icons{text-align:center;color:#000;}
.m-slider .icons span{margin:0 5px;}
.m-slider .icons .curr{color:red;}
.f-anim{-webkit-transition:left .2s linear;}
</style>
