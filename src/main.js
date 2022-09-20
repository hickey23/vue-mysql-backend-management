import Vue from 'vue'
import App from './App.vue'
//引入elementUI组件库
import ElementUI from 'element-ui'
//引入elementUI中的message组件
import {Message} from 'element-ui'
//引入elementUI全部样式
import 'element-ui/lib/theme-chalk/index.css';
import { MessageBox } from 'element-ui';
//引入vue-router
import VueRouter from 'vue-router'
//引入路由器
import router from '../router/index.js'
///////////////////
import '../src/assets/fonts/iconfont.css'
//引入全局样式表
import './assets/css/global.css'
//引入axios
import axios from 'axios'
import dayjs from 'dayjs'
import VueQuillEditor from 'vue-quill-editor'
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"

import TreeTable from 'vue-table-with-tree-grid'
// axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/';
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
//通过接口获取菜单数据
// 通过axios清求拦载添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config=>{
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@config:',config);
    config.headers.Authorization=window.sessionStorage.getItem('token');
    //最后必须return config
    return config
})

//使用treetable
Vue.use('tree-table',TreeTable);

Vue.config.productionTip=false;
//使用vuerouter
Vue.use(VueRouter);
//使用elementUI
Vue.use(ElementUI);
//使用axios
Vue.prototype.$http=axios;
///把elementUI中的message挂载到vue上，这样以后直接this.$XXX即可
Vue.prototype.$AlertMessage=Message;
//全局事件挂载
///把elementUI中的messagebox挂载到vue上，这样以后直接this.$XXX即可
//这个是删除的时候的确认对话框
Vue.prototype.$confirm=MessageBox.confirm;
//全局使用dayjs
Vue.prototype.$dayjs = dayjs

//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

const vm=new Vue({
  el:'#app',
  render(p){
    // console.log(p(App4));
    return p(App);
  },
  router:router,
})
console.log('vue启动成功!!!',vm);
