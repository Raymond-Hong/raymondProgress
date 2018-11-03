<template>
<div id="example">
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage() }}"</p>
  <input type="button" value="click me" @click.right="doSomeThing">
  <input type="button" value="click me" @click.left="doOtherThing">
  <div id="demo">{{ fullName }}</div>
  <input type="date" v-model="date">
  <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
  <div>
    <span v-for="n in 10" :key="'n'+n">{{ n }} </span>
  </div>
  <input v-model.lazy="msg" >
  {{msg}}
  <input type="number" :min="0" :max="1000" :step="step">
  <input type="button" @click="moreStep" value="加大幅度">
  <input type="button" @click="lessStep" value="减小幅度">
  <paging :pageCount='pageCount' :pageCallBack='pageCallBack'></paging>
</div>
</template>
<script>
import paging from './paging/paging.vue'
export default {
  data() {
    return{
      message: 'Hello',
      firstName: 'Foo',
      lastName: 'Bar',
      name:{firstName:"Foo",lastName:"Barr"},
      people:[],
      date:"",
      numbers:[1,2,3,4,5,6,7,8],
      msg:"",
      step:2,
      pageCount:15
    }
  },
  components:{
    paging
  },
  computed: {
    // // 计算属性的 getter
    // reversedMessage: function () {
    //   // `this` 指向 vm 实例
    //   return this.message.split('').reverse().join('')
    // }
    // fullName: function () {
    //   return [...this.people];
    // }
    fullName: {
    // getter
    get: function () {
      return this.firstName + ' ' + this.lastName;
    },
    // setter
    set: function (newValue) {
      console.log('newValue:'+newValue);
      var names = newValue.split(' ');
      this.firstName = names[0];
      this.lastName = names[names.length - 1];
      console.log(this.lastName);
    }
  }
  },
  created(){
    this.people.push({firstName:"Stepthen",lastName:"Curry"});
    this.people.push({firstName:"Kobe",lastName:"Bryent"});
    this.people.push({firstName:"LeBron",lastName:"James"});
    this.people.push({firstName:"James",lastName:"Hardon"});
    this.people.push(this.name);
    this.date = "2018-02-02";
  },
  methods:{
    pageCallBack(page){
      console.log('callBack', page, 'page');
    },
    doSomeThing(){
      // this.message="gooodbyeee";
      this.name.middleName = "Kerr";
      this.name.firstName = 'Curry';
      this.firstName = 'Curry';
    },
    reversedMessage() {
      // `this` 指向 vm 实例
      return this.message.split('').reverse().join('')
    },
    doOtherThing(){
      // this.people.splice(1,1);
      this.name.firstName = 'James';
      this.name.lastName = 'Harden';
      this.fullName = "John Doe";
    },
    even(numbers){
      return numbers.filter(function (number) {
        return number % 3 === 0
      })
    },
    moreStep(){
      this.step++;
    },
    lessStep(){
      this.step--;
    }
  },
  watch:{
    people:(val)=>{
      console.log("people change");
    }
  }
}
</script>
<style>

</style>
