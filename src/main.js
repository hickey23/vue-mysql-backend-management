import Vue from 'vue'
import App from './App.vue'
//引入elementUI组件库
import ElementUI from 'element-ui'
//引入elementUI中的message组件
import {Message} from 'element-ui'
//引入elementUI全部样式
import 'element-ui/lib/theme-chalk/index.css';

//引入vue-router
import VueRouter from 'vue-router'
//引入路由器
import router from '../router/index.js'

//引入全局样式表
import './assets/css/global.css'
//引入axios
import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'



Vue.config.productionTip=false;
//使用vuerouter
Vue.use(VueRouter);
//使用elementUI
Vue.use(ElementUI);
//使用axios
Vue.prototype.$http=axios;
///把elementUI中的message挂载到vue上，这样以后直接this.$XXX即可
Vue.prototype.$AlertMessage=Message;


const vm=new Vue({
  el:'#app',
  render(p){
    // console.log(p(App4));
    return p(App);
  },
  router:router,
})
console.log('vue启动成功!!!',vm);
