import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../src/components/Login.vue'
import Home from '../src/components/Home.vue'
import Hello from '../src/pages/Hello.vue'
import Users from '../src/pages/Users.vue'
import Rights from '../src/pages/Rights.vue'
import Roles from '../src/pages/Roles.vue'

Vue.use(VueRouter);

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalReplace.call(this, location, onResolve, onReject);
  return originalReplace.call(this, location).catch(err => err);
};

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
            // redirect:'/index',
            // redirect:'/welcome',
            //登录后直接重定向到users界面
            redirect:'/users',
            children:[
                {
                    /////////////////////////////////////////
                    //子组件不加/也可以,但这里要加，不知道为什么
                    path:'/hello',
                    component:Hello,
                },
                {
                    path:'/users',
                    component:Users,
                },
                {
                    path:'/rights',
                    component:Rights,
                },
                {
                    path:'/roles',
                    component:Roles,
                },
            ]
            
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
     
    /////如果不验证hello，会出现页面空白（不加这段话）
    if(to.path=='/hello'){
        const tokenstr=window.sessionStorage.getItem('token');
        if(tokenstr){
            next();
            // alert('111');
        }
        else{
            alert('权限不够，跳回到主页面！');
            next('/login');
        }
        
    }
    //否则放行
    else{
        next();
    }
    //////////////////////////////////////////////////////
    // if(to.path=='/users'){
    //     const tokenstr=window.sessionStorage.getItem('token');
    //     if(tokenstr){
    //         next();
    //         // alert('111');
    //     }
    //     else{
    //         alert('权限不够，跳回到主页面！');
    //         next('/login');
    //     }
        
    // }
    // //否则放行
    // else{
    //     next();
    // }
    
})


export default router