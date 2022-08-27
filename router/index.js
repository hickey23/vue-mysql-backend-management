import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../src/components/Login.vue'
import Home from '../src/components/Home.vue'
Vue.use(VueRouter);

const router = new VueRouter({
    mode:'hash',
    routes: [
        {
            path:'/',redirect:'/login'
        },
        {
            path:'/login',
            component:Login,
        },
        {
            path:'/home',
            component:Home,
        },
    
    ]
})

router.beforeEach((to, from, next) => {
    //next()放行
    //next('/路径)
    // to and from are both route objects. must call `next`.
    console.log('全局前置路由守卫启动');
    if(to.path=='/login'){
        next();
    }
    //如果访问home页面需要有token
    //根据键来获得值
    //这里注意home并不是login页面的子页面，是一个独立的页面
    if(to.path=='/home'){
        const tokenstr=window.sessionStorage.getItem('token');
        if(tokenstr){
            next();
        }
        else{
            // console.log(1111111111111111111);
            alert('权限不够，跳回到主页面！');
            next('/login');
        }
    }



       
    
    
})


export default router