<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 点击首页跳转到/hello页面 -->
            <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片试图区 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <!-- <span>卡片名称</span> -->
              
            </div>   
            <el-row>
                  <el-col :span="10">
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    <!-- el-input有一个事件加clear，在点击由clearable属性生成的清空核钮时触发 -->
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" :clearable="true" @clear="getUserList()">
                      <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" id="addusers" @click="addusers()">添加用户</el-button>
                  </el-col>
            </el-row>
            <!-- 当el-table元素中注入data对象数组后，
            在el-table-column中用prop属性来对应对象中的键名(服务器返回的数据)即可填入数据，
            用label属性来定义表格的列名。可以使用width属性来定义列宽 -->
            <!-- *********************************************************************** -->

            <!-- 这里elementUI版本太高用户数据会渲染不出来，不知道为什么 -->
            <el-table :data="this.userlist" :border="true" :stripe="true">
              <!-- :border="true"给表格加边框线 -->
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                  <!-- //当前作用域的数据是scope ,这里由于版本原因，用v-slot-->
                  <!-- slot-scope//通过scpoe.row拿到数据源中当前行的数据 -->
                  <!-- <template v-slot="zhuangtai">{{zhuangtai.row}}</template> -->
                  <template v-slot="scope">
                    <!-- {{scope.row}} -->
                    <!-- el-switch上面有一个change事件：	switch 状态发生变化时的回调函数 -->
                    <el-switch v-model="scope.row.mg_state" @change="SwitchStateChanged(scope.row.mg_state,scope.row)"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                  <template v-slot="scope">
                    <!-- 修改按钮 -->
                    <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                      <el-button type="primary" icon="el-icon-edit" size="mini"  @click="reviseDialog(scope.row.id)"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="分享" placement="top" :enterable="false">
                     <!-- 分享按钮 -->
                      <el-button type="warning" icon="el-icon-share" size="mini"></el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                      <!-- 删除按钮 -->
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="DeleteUsersById(scope.row.id)"></el-button>
                    </el-tooltip>
                    <!-- <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
                    <el-button type="primary">上传<i class="el-icon-upload el-icon--right" size="mini"></i></el-button> -->
                  </template>
                </el-table-column>
                
            </el-table>
            <!-- 页面尾部 -->
            <!-- 这个page-sizes是可选择的跳转多少页数。一次跳转，1页，2页，5页 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryinfo.pagenum"
              
              :page-sizes="[1,2,3,4,5,6,7,8,9,10]"
              :page-size="queryinfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>      
        </el-card>

        <!-- 添加用户对话框 -->
        <!-- close是一个事件，当对话框关闭的时候触发 -->
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="50%"
          @close="dialogClose()">
          <!-- 弹窗对话框内容主体区 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <!-- prop是验证规则属性,指定具体的校验规则 -->
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>  
          <!-- <span>这是一段信息</span> -->
          <!-- 弹窗对话框内底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ADDUSERS()">确 定</el-button>
          </span>
        </el-dialog>


        <!-- //修改用户信息的对话框 -->
        <el-dialog
          title="修改用户信息"
          :visible.sync="reviseDialogVisible"
          width="50%"
          @close="reviseDialogClose()">
          <!-- <span>这是一段信息</span> -->
          <!-- 弹窗对话框内容主体区 -->
          <el-form :model="searchUserInfo" :rules="reviseFormRules" ref="reviseFormRef" label-width="100px">
            <!-- prop是验证规则属性,指定具体的校验规则 -->
            <el-form-item label="用户名">

              <!-- disabled属性,可以让禁用掉这一行 -->
              <el-input v-model="searchUserInfo.username" disabled></el-input>
            </el-form-item>
            <!-- <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item> -->
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="searchUserInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="searchUserInfo.mobile"></el-input>
            </el-form-item>
          </el-form>  
          <!-- 弹窗对话框内底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="reviseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="reviseUserInfo()">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    
</template>

<script>
    export default {
        name:'Users',
        created(){
          this.getUserList();
        },
        data(){
          var checkEmail=(rule,value,cb)=>{
            //验证邮箱的正则表达式
            const regEmail=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if(regEmail.test(value)){
              //合法的邮箱
              return cb
            }
            else{
              cb(new Error('请输入正确的邮箱格式'));
            }
          }

          //验证手机
          var checkPhone=(rule,value,cb)=>{
            //验证手机的正则表达式
            const regPhone=/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
            if(regPhone.test(value)){
              //合法的手机号
              return cb
            }
            else{
              cb(new Error('请输入正确的手机号码'));
            }
          }


          return{
            //JavaScript中的：
            // { } 大括号，表示定义一个对象，大部分情况下要有成对的属性和值，或是函数
            // [ ]中括号，表示一个数组，也可以理解为一个数组对象
            // { } 和[ ] 一起使用，我们前面说到，{ } 是一个对象，[ ] 是一个数组，我们可以组成一个对象数组
            select:'',

            //获取用户列表的参数对象
            queryinfo:{
              //搜索关键字
                query:'',
                //当前的页数
                pagenum:1,
                //当前每页显示多少条数据
                pagesize:4,
            },
            userlist:[],
            total:0,
            isSwitch_True0:'',
            isSwitch_True1:'',

            //控制用户对话框显示或隐藏
            dialogVisible:false,
            //控制修改用户对话框显示或隐藏
            reviseDialogVisible:false,

            //查询到的用户信息对象
            searchUserInfo:{},
            
            //这个是添加用户表单数据，是一个对象
            addForm:{
              username:'',
              password:'',
              email:'',
              mobile:'',
            },
            //添加表单数据规则
            addFormRules:{
              username:[
                //message是错误提示
                {required:true,message:'请输入用户邮箱',trigger:'blur'},
                {min:2,max:10,message:'用户名长度在2-10个字符之间'},
                
              ],
              password:[
                {required:true,message:'请输入用户密码',trigger:'blur'},
                {min:6,max:15,message:'用户密码需要在6-15个字符之间'},
              ],
              email:[
                {required:true,message:'请输入用户邮箱',trigger:'blur'},
                {min:6,max:20,message:'用户邮箱需要在6-15个字符之间'},
                // {validator:checkEmail},
              ],
              mobile:[
                {required:true,message:'请输入用户手机号码',trigger:'blur'},
                {min:11,max:11,message:'请输入正确的手机格式'},
                // {validator:checkPhone},
              ]
            },

            // 这个是修改用户表单数据，是一个对象
            reviseForm:{
              username:'',
              // password:'',
              email:'',
              mobile:'',
            },


            //修改用户信息表单的校验规则
            reviseFormRules:{
              email:[
                {required:true,message:'请输入用户邮箱',trigger:'blur'},
                {min:6,max:20,message:'用户邮箱需要在6-15个字符之间'},
                // {validator:checkEmail},
              ],
              mobile:[
                {required:true,message:'请输入用户手机号码',trigger:'blur'},
                {min:11,max:11,message:'请输入正确的手机格式'},
                // {validator:checkPhone},
              ]
            },
          }
        },
        methods:{
          async getUserList(){
            //令params参数等于queryinfo对象,向服务器请求，get返回一个promise对象
            const{data:res}=await this.$http.get('users',{params:this.queryinfo});
            console.log('@@@获取用户列表数据:',res);
            if(res.meta.status!==200){
                alert('获取用户数据失败！');
                return res.meta.msg;
            }
            //获取服务器返回的数据
            this.userlist=res.data.users;
            this.total=res.data.total;
            //返回请求的信息
            // console.log(res.data.users[0].mg_state);
            // this.isSwitch_True0=res.data.users[0].mg_state;//true
            // this.isSwitch_True1=res.data.users[1].mg_state;//false

          },
          //监听pagesize改变的事件
          handleSizeChange(newSize){
              console.log('newsize:',newSize);
              //把现在用户所选中的pagesize的值给data里面的pagesize
              this.queryinfo.pagesize=newSize;
              //当newsize发生变化，也就是用户选择一次性显示及条信息的时候，需要根据newsize值重新发出请求
              this.getUserList();
          },
          //监听页码值pagenum改变的事件
          handleCurrentChange(newPage){
            console.log('newpage:',newPage);
            //把现在用户所要跳转的pagenum的值给data里面的pagenum
            this.queryinfo.pagenum=newPage;
            //重新获取添加后的用户数据
            this.getUserList();
          },

          ////************************************************************************ */
          //监听switch开关状态的改变
          async SwitchStateChanged(SwitchState,userinfo){

            //点击switch按钮自动帮你取反布尔值
            console.log('开关状态改变了:',SwitchState);
            //调用API接口，把更新后的数据保存到数据库中
            //UID,type是一个动态的数据，为了拼接一些动态参数，把单引号换成反引号
            const{data:res}=await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);//这里是put请求
            if(res.meta.status!==200){
              //如果更新页面数据失败，需要把数据重新取反回正常的值，也就是更改之前的值
              userinfo.mg_state=!userinfo.mg_state;
              return this.$AlertMessage.error('更新用户状态失败！');
            }
            else if(res.meta.status==200){
              return this.$AlertMessage.success('更新用户状态成功！');
            }
          },
          //改变dialog是否显示
          addusers(){
            this.dialogVisible=!this.dialogVisible;
          },
          //监听添加用户框关闭事件
          dialogClose(){
            //找到dialog原型对象身上的resetfields属性,重置表单
            this.$refs.addFormRef.resetFields();
            // var eldialog=document.querySelector()
          },

          //点击按钮添加新的用户
          ADDUSERS(){
            // validate对整个表单进行校验的方法，参数为一个回调函数。
            // 该回调函数会在校验结束后被调用，并传入两个参数：
            // 是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
            // alert('111');
            this.$refs.addFormRef.validate(async (valid) =>{
              console.log('dialog对话框中的validate属性的valid值:',valid);//是一个布尔值
              //如果valid为false，返回false
              if(!valid){
                return false
              }
              else{
                 //这里请求要看后端接口的请求方式，这里是post请求
                  const {data:res}= await this.$http.post('users',this.addForm);
                  if(res.meta.status!==201){
                    ///这里是在main.js中把elementUI中的message挂载到vue上，这样以后直接this.$XXX即可
                    this.$AlertMessage.error('添加用户失败！');
                  }
                  else{
                    // console.log('成功添加')
                    this.$AlertMessage.success('添加用户成功！');
                    //关闭dialog框
                    this.dialogVisible=false;
                    //重新获取添加后的用户数据
                    this.getUserList();
                  }
              }
      
            })
          },

          // ************************************************************************************************
          //首先根据ID找到用户的信息，从服务器返回的数据，我用一个空对象接收
          //修改用户函数.点击编辑用户的同时，会弹出用户的原来的数据
          async reviseDialog(id){
            // console.log('id',id);
            const {data:res}=await this.$http.get(`users/${id}`);
            if(res.meta.status!==200){
              this.$AlertMessage.error('查询用户信息失败');
            }
            
              // this.$AlertMessage.success('查询用户信息成功');
              //用searchUserInfo保存返回得到数据
            this.searchUserInfo=res.data;
            
            this.reviseDialogVisible=true;
          },



          //监听修改用户对话框关闭重置事件
          reviseDialogClose(){
            this.$refs.reviseFormRef.resetFields();
            // this.$refs.addFormRef.resetFields();
          },
          //修改用户信息并且提交，通过表单上面的validate属性
          reviseUserInfo(){
             this.$refs.reviseFormRef.validate(async (valid)=>{
              console.log('修改用户信息的valid值是:',valid);
              if(!valid){
                this.$AlertMessage.error('修改用户信息失败,valid值为假');
              }
              else{
                const {data:res}=await this.$http.put(`users/${this.searchUserInfo.id}`,{
                  email:this.searchUserInfo.email,
                  mobile:this.searchUserInfo.mobile,
                });
                if(res.meta.status!==200){
                  this.$AlertMessage.error('修改用户信息失败,服务器返回数据失败');

                }
                else{
                    // console.log('成功添加')
                    
                    //关闭dialog框
                    this.reviseDialogVisible=false;
                    //重新获取添加后的用户数据
                    this.getUserList();
                    this.$AlertMessage.success('修改用户信息成功！');
                }
              }
            })
          },
          

          //删除用户
          async DeleteUsersById(id){
            console.log(id);
            //返回值是一个promise,这是elementUI封装好的
            const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).catch(error =>{
              return error
            })
            //如果用户删除，返回值是字符串confirm
            //如果用户取消删除，返回值是字符串cancel
            console.log('confirmResult@@@@@@@',confirmResult);

            //这里返回的是字符串，所以confirm一定要写成字符串
            if(confirmResult!=='confirm'){
              this.$AlertMessage.info('已取消删除用户');
            }
             //这里返回的是字符串，所以confirm一定要写成字符串
            else if(confirmResult=='confirm'){
              // console.log('删除用户成功');
              const{data:res}=await this.$http.delete(`users/${id}`);

              // console.log('status@@@@@@@@@@@@@@',res.meta.status);
              if(res.meta.status!==200){
                return this.$AlertMessage.error('删除用户失败')
              }
              else if(res.meta.status==200){
                this.$AlertMessage.success('删除用户成功');
                this.getUserList();
              }

            }
          },

        } 
    }
</script>

<style scoped>
    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both;
    }
    .box-card {
      width: 100%;
    }
    #addusers{
      margin-left: 30px;
      /* //也可以在上面通过el-row中的gutter属性调节button的左边距 */
    }
</style>