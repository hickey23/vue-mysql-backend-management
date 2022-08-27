<template>
    <div class="login_container">
        <!-- 图片和login整体分开 -->
        <div class="bgcpic"></div>
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avatar_box">
                  <div class="avatar"><img src="../assets/admin.jpg" alt="login"></div>
            </div>
            <!-- 登录表单区 -->    
            <div class="input_userpassw_box">
                <h2>Vue-MySQL后台管理系统</h2>
                <!-- 用户名 -->
                <!-- username -->
                <!-- //通过ref拿到表单的引用对象，身上的validate属性验证 -->
                <el-form  label-width="80px" :model="loginform" :rules="loginformRules" ref="loginFormRef">
                    <el-form-item label="用户名" class="username" prop="username">
                        <el-input prefix-icon="el-icon-user-solid" v-model="loginform.username">用户名</el-input>
                    </el-form-item>
                </el-form>  
                    <!-- 密码 -->
                <el-form  label-width="80px" :model="loginform" :rules="loginformRules" ref="loginFormRef">
                    <el-form-item label="密码" class="password" prop="password"> 
                        <el-input prefix-icon="el-icon-s-goods" v-model="loginform.password" type="password">密码</el-input>
                    </el-form-item>
                </el-form>      
                <br>

                <!-- 登录按键 -->
                <el-form class="btns">
                    <el-form-item>
                        <el-button type="primary" @click="login()">登录</el-button>
                        <el-button  class="ahref" type="info" @click="refresh()"><a href="http://localhost:8081">重置</a></el-button>
                    </el-form-item>
                </el-form>
            </div>
            
          
        </div>
    </div>
</template>

<script>
    export default {
        name:'Login',
        data(){
            return{
                //登录表单的数据对象
                loginform:{
                    username:'',
                    password:'',
                },
                //这是表单的规则对象
                loginformRules:{
                    //验证用户名是不是合法
                    username:[
                        //参考elementUI
                        {required:true,message:'请输入登录名称',trigger:'blur'},
                        {min:3,max:10,message:'长度在3到10字符之间',trigger:'blur'},
                    ],
                    password:[
                        {required:true,message:'请输入密码',trigger:'blur'},
                        {min:3,max:10,message:'长度在3到10之间',trigger:'blur'},
                    ],
                }
            }
        },
        methods:{
            refresh(){
                // console.log('刷新页面！');
                alert('重置页面！');

            },
            login(){
                this.$refs.loginFormRef.validate(async(valid)=>{
                    console.log(valid);
                    if(valid==true){
                       const result1=await this.$http.post("login",this.loginform);//这个返回值是一个promise
                       console.log('返回的promise值是:',result1);
                       //让result2等于返回数据中的data
                       const {data:result2}=await this.$http.post("login",this.loginform);
                       console.log('@@@@@@@@服务器真实数据:',result2);  
                       ////////////////////////////////////////////////////////
                       if(result2.meta.status==200){
                            // alert('登录成功！');
                            console.log('登录成功服务器返回的数据:',result2);
                            //保存登录成功后的token
                            // 1．将登录成功之后的 token，保存到客户端的sessionstorage中
                            // 1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
                            //1.2 token 只应在当前网站打开期间生效，所以将 token保存在sessionStorage 中

                            window.sessionStorage.setItem('token',result2.data.token);
                            // 2．通过编程式导航跳转到后台主页，路由地址是/home
                            this.$router.push('/home')

                            return this.$AlertMessage.success('登录成功！');
                          
                           
                            
                       }
                       else{
                            // alert('登录失败！');
                            return this.$AlertMessage.error('登录失败！');
                       }
                    }
                    else{
                        alert('用户名或密码输入有问题!');
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .bgcpic{
        height: 100%;
        width: 100%;
        background-image: url(../assets/bgc.jpg);
        // background-color: skyblue;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        -webkit-filter: blur(5px);
        -moz-filter: blur(5px);
        -o-filter: blur(5px);
        -ms-filter: blur(55px);
        filter: blur(5px);
    }
    .login_container{
        height: 100%;
        width: 100%;
        // opacity: 0.5;
    }
    .login_box{
        position: absolute;
        // margin: 0,auto;
        width: 600px;
        height: 400px;
        background-color: white;
        border-radius: 3px;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        
    }
    .avatar{
        position: absolute;
        left: 50%;
        transform: translate(-50%,-40%);//前一个参数是横向，后一个参数是纵向
        width: 150px;
        height: 150px;
        border: 2px solid #eee;
        border-radius: 50%;
        background-color: skyblue;
        box-shadow: 0 0 5px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
       
    }
    .btns{
        display: flex;
        justify-content: flex-end;//尾部对齐

    }
    .input_userpassw_box{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-40%);
    }
    .input_userpassw_box h2{
        text-align: center;
    }
    a{
        text-decoration: none;
        color:#fff


    }
</style>