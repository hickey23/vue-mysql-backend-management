<template>
  <div class="elcontainer">
    <el-container class="elcontainer">
      <!-- 头部 -->
      <el-header class="header">
        <!-- 第一种写法 -->
        <!-- <div id="houtai">
          <div class="divhoutai">
            <div id="imgbox"><img src="../assets/admin.jpg" alt="admin"></div>
            <div id="textbox">后台管理系统</div>
          </div> 
          <el-button class="EXITBTN" type="info" @click="exit()">退出</el-button>
        </div> -->

        <!-- 第二种写法，用flex布局 -->
        <div class="imgtext_box">
          <a href="http://localhost:8081">
            <img src="../assets/admin.jpg" alt="admin_avatar" title="admin">
          </a>
          <span>后台管理系统</span>
        </div>
        <el-button class="EXITBTN" type="info" @click="exit()">退出</el-button>
      </el-header> 
<!-- ******************************* -->
      <!-- 主体部分 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="iswidth.toString()"> 
          <div class="toggle-button" @click="toggle()">▼</div>
          <!-- 侧边栏菜单区 -->
          <!-- elementui给el-menu提供了一个属性，unique-opened表示是否保持一个子菜单展开 -->
            <el-menu :default-openeds="['1', '3']" class="menu" :unique-opened="true" :collapse="this.istrue" 
            :collapse-transition="false" :router="true">
              <!-- 导航一 -->

              <!-- 这个index只能获取字符串，通过tostring把他转化成字符串 -->
              <el-submenu :index="iterm.id.toString()" v-for="iterm in menulist" :key="iterm.id">
                <template slot="title"><i :class="iconObj[iterm.id]"></i><span>{{iterm.authName}}</span></template>
                
                <!-- 这个是二级菜单 -->

                <el-menu-item-group :index="'/'+subiterm.path.toString()" v-for="subiterm in iterm.children" :key="subiterm.id">
                  <template slot="title"><i class="el-icon-view"></i>{{subiterm.authName}}--选项</template>
                  <el-menu-item :index="'/'+subiterm.path.toString()"><i class="el-icon-menu"></i>{{subiterm.authName}}</el-menu-item>
                  <!-- <el-menu-item index="1-2">选项2</el-menu-item> -->
                </el-menu-item-group>
              </el-submenu>
              <!-- ##################导航2,3,4都是写死的侧边栏￥￥￥￥￥￥￥￥￥￥￥ -->
              <!-- ##################导航2,3,4都是写死的侧边栏￥￥￥￥￥￥￥￥￥￥￥ -->
              <!-- ##################导航2,3,4都是写死的侧边栏￥￥￥￥￥￥￥￥￥￥￥ -->
              <!-- ##################导航2,3,4都是写死的侧边栏￥￥￥￥￥￥￥￥￥￥￥ -->
              <!-- 导航2 -->
              <el-submenu index="2">
                <template slot="title"><i class="iconfont icon-3702mima"></i><span>后台管理</span></template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="2-1">选项1</el-menu-item>
                  <el-menu-item index="2-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="2-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="2-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="2-4-1">选项4-1</el-menu-item>
                </el-submenu>
              </el-submenu>

              <!-- 导航3-->
              <el-submenu index="3">
                <template slot="title"><i class="iconfont icon-lock_fill"></i><span>访问权限</span></template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="3-1">选项1</el-menu-item>
                  <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="3-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="3-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                </el-submenu>
              </el-submenu>
              
              <!-- 导航4 -->
              <el-submenu index="4">
                <template slot="title"><i class="iconfont icon-3702mima"></i><span>系统版本</span></template>
                <el-menu-item-group>
                  <template slot="title">分组一</template>
                  <el-menu-item index="3-1">选项1</el-menu-item>
                  <el-menu-item index="3-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="3-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="3-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="3-4-1">选项4-1</el-menu-item>
                </el-submenu>
              </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 右侧主体 -->
        <el-main>
          <!-- 路由占位符 -->
          <!-- <router-link to="/home/welcome">点我跳转到index页面</router-link> -->
          <router-view></router-view>
        
        </el-main>

      </el-container>
    </el-container>
  </div>  
  
</template>

<script>
    export default {
        name:'Home',
        data(){
          //左侧菜单数据
          return {
            menulist:[],
            iconObj:{
              '125':'iconfont icon-user',
              '103':'iconfont icon-tijikongjian',
              '101':'iconfont icon-shangpin',
              '102':'iconfont icon-danju',
              '145':'iconfont icon-baobiao',

            },
            istrue:false,
            iswidth:200,
            // iconlist:['iconfont icon-3702mima','iconfont icon-lock_fill','iconfont icon-shangpin',]
          }
        },
        created(){
          this.getMenuList();
        },
        methods:{
          exit(){
            //清空token
            window.sessionStorage.clear();
            //跳转到login页面
            this.$router.push('/login');
            alert('返回登录界面！');
          },
          async getMenuList(){
            const {data:response}=await this.$http.get('menus');
            console.log('############# menu栏返回的数据:',response);
            //////////////////////////////////////////////////
            if(response.meta.status!==200){
              alert('获取菜单栏失败！');
              return this.$message.error(response.meta.msg);
            }
            else if(response.meta.status==200){
              //从数据库中获取表单数据，保存到menulist中
              this.menulist=response.data;
            }
          },
          toggle(){
            ////////////////////
            if(this.istrue==false){
              this.istrue=true;
              this.iswidth=64+'px';
            }
            else if(this.istrue==true){
              this.istrue=false;
              this.iswidth=200+'px'
            }
            //或者用一句话
            // this.istrue=!this.istrue;
          },
          //
          
        },
        mounted(){
          var subMenu=document.getElementsByClassName('.el-menu-item-group');
          console.log(subMenu);
        }

    }
</script>

<style lang="less" scoped>
    .elcontainer{
      height:100%;
    }
    .header{
      // position: relative;
      display: flex;
      justify-content: space-between;
      // background-color:rgb(25, 25, 30);
      background-color:#757575;
      // align-items 属性定义flex子项在flex容器的当前行的侧轴（纵轴）方向上的对齐方式。
      align-items: center;
      // color: white;
      span{
        color: #fff;
        font-size: 25px;
        
      }
    }

    .imgtext_box{
      display: flex;
      align-items: center;
      margin-left: 5px;
      a img{
        border-radius: 50%;
        height: 60px;
      }
      span{
        margin-left: 10px;
      }
    
    }
    // .houtai{
    //   position: relative;
    //   text-align: center;
      
    // }
    // .divhoutai{
    //   position:absolute;
    //   left:1%;
    //   top: 5px;
    //   text-align: center;
    //   font-size: 30px;
    // }
    // #imgbox{
    //   float:left;
    //   width:50px;
    //   height:45px;
    //   // display: inline-block;
    
    //   img{
    //     width:100%;
    //     height: 100%;
    //       border-radius: 50%;
    //   }



    // }
    // #textbox{
    //   float: right;
    // }


    //侧边栏的样式
    .el-aside{
      // background-color:rgb(25, 25, 30);
      background-color:#757575;
      
      .el-menu{
        border-right: none;
      }
    }
    .el-submenu :hover{
      // background-color:rgb(255,105,0);
      background-color:#fff;
    }
    .el-menu-item-group :hover{
      background-color:rgb(255,105,0);
    }

    .toggle-button{
      // background-color:rgb(25, 25, 30);
      background-color:#757575;
      font-size: 20px;
      color: #fff;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.2em;
      cursor: pointer;

    }
    .menu{
      // background-color: #373d41;
      // background-color:rgb(25, 25, 30);
      background-color:#757575;
      
    }
    .el-submenu span{
      color: #fff;
    }
    //设置图标的类
    .iconfont{
      margin-right: 12px;
    }
    //主体的样式
    .el-main{
      background-color:rgb(206, 196, 183);
    }
</style>