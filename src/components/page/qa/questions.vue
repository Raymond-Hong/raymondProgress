<template>
   <div class="qbg contop">
       <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" charset="utf-8"/>
        <!-- <head-top :head-title="headTitle"  goBack="true" :fromQ="true">
        </head-top> -->
        <div>
            <!-- <router-link :to='{path:"/ask"}'> -->
                <div class="fixedbtn fixedbgAsk">
                    <!-- <img src="../../images/qa/weq-h5.png" class="fixedbtnimg"/> -->
                    <div class="fixedtext" @click="allHeight">{{'我来提问'|trans}}</div></div>
            <!-- </router-link> -->
        </div>

        <div v-qaload-more="loaderMore" class="qlistbg">
        <div v-for="qus in questionList">
            <router-link :to='{path:"/seeQ",query:{question_id:qus.question_id}}'>
          	<div class="qlist">
          		<table width="100%">
          			<tr>
          				<td valign="top" align="left" style="width: 25px;">
          					<img v-if="qus.avatar_url&&1!=qus.is_anonymous" :src="qus.avatar_url" class="userimg borderadius" />
              				<!-- <img src="../../images/qa/a-user.png" v-else class="userimg borderadius" /> -->
          				</td>
          				<td valign="top" align="left">
          					<div>
			              		<div class="qtitlediv">{{qus.title}}</div>

			              		<div class="qcontent" v-if="qus.answer">
				                    <!--<img src="../../images/qa/a-h5.png" class="aimg" />-->
				             		<span class="fontcolor">{{qus.answer.content}}</span><br>
				            	</div>
			              	</div>
          				</td>
          			</tr>
          		</table>

                <div class="qrightdown">
                    <div class="qanswer fontcolor">{{'回答'|trans}}<span class="fontcolor">{{qus.answer_count}}</span>
                    </div>
                    <div class="qread fontcolor">
                    {{'浏览'|trans}}<span class="fontcolor">{{qus.read_count}}</span>&nbsp;&nbsp;&nbsp;
                    </div>
                    <div class="asw" @click.prevent="goToAnswer(qus.question_id,qus.title,qus.content)">{{'我来回答'|trans}}&nbsp;&nbsp;&nbsp;</div>
                	<div class="clearfx"></div>
                </div>
              </div>
           </router-link>
        </div>
        </div>
        <div class="loading" >{{loadingHits|trans}}</div>
        <!-- <alert-tip></alert-tip> -->
   </div>
</template>

<script>
// import {mapState,mapActions} from 'vuex';
import {questionList} from '../../../service/getQuestion'
// import headTop from '../../components/header/qahead'
// import {loadMore} from '../../components/common/mixin'
// import alertTip from '../../components/alert/alert'

export default {
    data(){
        return{
            start:0,
            count:10,
            questionList:[],
            headTitle:"问答",
            preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
			showBackStatus: false, //显示返回顶部按钮
			showLoading: true, //显示加载动画
            touchend: false, //没有更多数据
            loadingHits:"正在加载...",
            answer:{id:2}
        }
    },
    created(){
        // this.savePt.y=0;
        questionList(this.start,this.count).then(res=>{
            if(res){
                this.questionList=res.queList;
                if(this.questionList.length<this.count){
                    this.loadingHits = "";
                    this.touchend = true;
                }
            }
        })
    },
    activated(){
        questionList(0,this.start).then(res=>{
            if(res.queList.length>this.questionList.length){
                this.questionList=res.queList;
                // this.savePt.y=0;
                // window.scrollTo(this.savePt.x,this.savePt.y);
                return;
            }
        })
        // window.scrollTo(this.savePt.x,this.savePt.y);
    },
    // beforeRouteLeave(to, from, next){
    //     this.savePt.y = document.body.scrollTop;
    //     next();
    // },
    // components: {
    //   headTop,
    //   alertTip
    // },
    // mixins: [loadMore],
    // computed:{
        // ...mapState(["savePt"])},
    methods:{
        // ...mapActions([]),
        async loaderMore(){
            if (this.touchend) {
                return;
            }
            //防止重复请求
            if (this.preventRepeatReuqest) {
                return;
            }
            this.showLoading = true;
            this.preventRepeatReuqest = true;
            this.start += this.count;
            questionList(this.start,this.count).then(res=>{
                if(res && res.queList && res.queList.length){
                    this.questionList.push(...res.queList);
                    this.preventRepeatReuqest = false;
                }else{//说明没有更多数据，不需要再次请求数据
                    this.touchend = true;
                    this.loadingHits = "我是有底线的~";
                    return;
                }
            })
        },
        goToAnswer(question_id,title,content){
            this.$router.push({path:'/answer',query:{question_id:question_id,title:title,content:content}});
        },
        allHeight(){
            console.log(screen.height);
            console.log(document.body.scrollTop);
            console.log(document.body.scrollHeight);
            console.log(0&&2);
            this.answer.id=122;
            // this.$set(this.answer);
        }    
    },
    watch:{
        answer:function(val,oldVal){
            console.log(oldVal);
            console.log(val);
        }
    }
};
</script>

<style>
    /* @import 'src/style/mixin'; */
    @import '../../../style/qa';
</style>
