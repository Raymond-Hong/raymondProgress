<template>
    <div class="page">
        <a href="#" class="prevPage" @click="pageLess" :class="{disabled:current===1}">上一页</a>
        <a href="#" class="tcdNumber" @click="current=1" :class="{current:isCurrent(1)}">1</a>
        <span v-show="preSpan">...</span>
        <a href="#" v-for="index in pageArr" 
        @click="changePage(index)"
        :key="index" class="tcdNumber" 
        :class="{current:isCurrent(index)}">{{index}}</a>
        <span v-show="sufSpan">...</span>
        <a href="#" @click="current=pageCount" :class="{current:isCurrent(pageCount)}">{{pageCount}}</a>
        <a href="#" class="nextPage" @click="pageMore" :class="{disabled:current===pageCount}">下一页</a>
    </div>
</template>

<script>
export default {
  data() {
    return {
      current: 1
    };
  },
  props:['pageCount', 'pageCallBack'],
  computed: {
    preSpan: function() {
      return this.pageArr.length&&this.pageArr[0]>2;
    },
    sufSpan: function() {
      return this.pageArr.length&&this.pageArr[this.pageArr.length-1]<this.pageCount-1;
    },
    pageArr: function() {
      let result = [];
      let start = this.current - 2;
      let end = this.current + 2;
      while (start <= end) {
        if (start > 1 && start < this.pageCount) {
          result.push(start);
        }
        start++;
      }
      start = this.current - 3;
      end = this.current + 3;
      while(result.length<5&&(start>1||end<this.pageCount)){
          if(start>1){
              result.unshift(start);
              start --;
          }
          if(end<this.pageCount){
              result.push(end);
              end ++;
          }
      }
      return result;
    },
    isCurrent: function() {
      return function(key) {
        return key == this.current;
      };
    }
  },
  methods: {
    pageLess() {
      if (this.current > 1) {
        this.current--;
      }
    },
    pageMore() {
      if (this.current < this.pageCount) {
        this.current++;
      }
    },
    changePage(index) {
      this.current = index;
    }
  },
  watch:{
      current:function(){
          this.pageCallBack(this.current);
      }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
}
.page {
  width: 500px;
  margin: 100px auto;
  color: #ccc;
}
.page a {
  display: inline-block;
  color: #428bca;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
  border: 1px solid #ddd;
  margin: 0 2px;
  border-radius: 4px;
  vertical-align: middle;
}
.page a:hover {
  border: 1px solid #428bca;
}
.page .current {
  display: inline-block;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
  margin: 0 2px;
  color: #fff;
  background-color: #428bca;
  border: 1px solid #428bca;
  border-radius: 4px;
  vertical-align: middle;
}
.page .disabled {
  display: inline-block;
  height: 25px;
  line-height: 25px;
  padding: 0 10px;
  margin: 0 2px;
  color: #bfbfbf;
  background: #f2f2f2;
  border: 1px solid #bfbfbf;
  border-radius: 4px;
  vertical-align: middle;
}
</style>

