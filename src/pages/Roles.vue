<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- 点击首页跳转到/hello页面 -->
        <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/rights' }">权限列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/rights' }">权限详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮区.,row是行，column是列 -->
        <!-- 这个是第一行的按钮 -->
        <el-row>
            <el-col :span="10">
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    <!-- el-input有一个事件加clear，在点击由clearable属性生成的清空核钮时触发 -->
                    <el-input placeholder="请输入内容" v-model="queryRoleInfo.query" @clear="searchRole()" :clearable="true">
                      <el-button slot="append" icon="el-icon-search" @click="searchRole()"></el-button>
                    </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addRoles()">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 角色列表数据渲染表格 -->
        <el-table :data="roleList"  border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <!-- scope相当于是tableData的一行，与el-table-column唯一对应，具体实验代码如下 -->
                <template v-slot="scope">
                    <el-row  v-for="(item1,index1) in scope.row.children" :key="item1.id"> 
                        <!-- 总共24列 -->
                        <!-- 渲染一级权限 -->
                        <!-- index1=1的时候顶部边框 -->
                        <div v-if="index1==0" :class="['bdtop']">
                            <el-col :span="5">
                                <el-tag class="eltag"
                                closable 
                                @click="removeRightById(scope.row,scope.row.id,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                                <!-- <el-tag class="eltag" v-else-if="index1!==0" :class="['bdbottom']">
                                    {{item1.authName}}
                                </el-tag> -->
                            </el-col>
                        </div>
                        <!-- index1不等于1的时候，底部边框 -->
                        <div v-else-if="index1!==0" :class="['bdbottom']">
                            <el-col :span="5">
                                <el-tag class="eltag"
                                closable 
                                @click="removeRightById(scope.row,scope.row.id,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>  
                        </div>
                        
                        <!-- 渲染二,三级权限 -->
                        <el-col :span="19">
                            <el-row v-for="(item2,index2) in item1.children" :key="item2.id">
                                <div v-if="index2==0" :class="['bdbottom']">
                                    <el-col :span="10">
                                        <el-tag type="success" class="eltag"
                                        closable 
                                        @click="removeRightById(scope.row,scope.row.id,item2.id)">
                                        {{item2.authName}}
                                        </el-tag>
                                        <!-- 右斜线键 -->
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-tag type="warning" 
                                        v-for="(item3,index3) in item2.children" :key="item3.id" 
                                        class="eltag"
                                        closable 
                                        @click="removeRightById(scope.row,scope.row.id,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </div>
                                <!-- el-col标签的span是指占他父标签的份数如果col继续分，那么他就作为父标签，同样占整体的24份 -->
                                <div v-else-if="index2!==0" :class="['']">
                                    <el-col :span="10">
                                        <el-tag type="success" class="eltag"
                                        closable 
                                        @click="removeRightById(scope.row,scope.row.id,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-tag type="warning" class="eltag" 
                                        v-for="(item3,index3) in item2.children" :key="item3.id"
                                        closable 
                                        @click="removeRightById(scope.row,scope.row.id,item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </div>
                                

                            </el-row>
                        </el-col>
                    </el-row>
                    <!-- <pre>
                        {{scope.row}}
                    </pre> -->
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column> 
            <el-table-column label="角色概述" prop="roleDesc"></el-table-column> 
 
            <el-table-column label="操作选项" width="300px">
                  <template v-slot="scope">
                    <!-- 修改按钮 -->
                    <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                      <el-button type="primary" icon="el-icon-edit" size="small" @click="showRoleDialog(scope.row.id)">修改</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                     <!-- 分配按钮 -->
                      <el-button type="warning" icon="el-icon-share" size="small" @click="showSetRightDialog(scope.row)">编辑权限</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                      <!-- 删除按钮 -->
                      <el-button type="danger" icon="el-icon-delete" size="small" @click="DeleteRoleById(scope.row.id)">删除</el-button>
                    </el-tooltip>
                    <!-- <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
                    <el-button type="primary">上传<i class="el-icon-upload el-icon--right" size="mini"></i></el-button> -->
                  </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- ****************************************************** -->
    <!-- //添加用户对话框 -->
    <el-dialog
          title="添加角色"
          :visible.sync="RoledialogVisible"
          width="50%"
          @close="addRoledialogClose()">
          <!-- 弹窗对话框内容主体区 -->
          <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
            <!-- prop是验证规则属性,指定具体的校验规则 -->
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="addRoleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="addRoleForm.roleDesc"></el-input>
            </el-form-item>  
          </el-form>  
          
          <!-- <span>这是一段信息</span> -->
          <!-- 弹窗对话框内底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="ADDROLES()">确 定</el-button>
          </span>
        </el-dialog>

        <!-- *********************************************************************** -->
            <!-- //修改用户信息的对话框 -->
         <!-- //修改用户信息的对话框 -->
        <!-- //修改用户信息的对话框 -->
        <el-dialog
          title="修改角色信息"
          :visible.sync="reviseRoleDialogVisible"
          width="50%"
          @close="reviseRoleDialogClose()">
          <!-- <span>这是一段信息</span> -->
          <!-- 弹窗对话框内容主体区 -->
          <el-form :model="roleListInfo" :rules="reviseRoleFormRules" ref="reviseRoleFormRef" label-width="100px">
            <!-- prop是验证规则属性,指定具体的校验规则 -->
            <el-form-item label="角色名称">
              <!-- disabled属性,可以让禁用掉这一行 -->
              <el-input v-model="roleListInfo.roleName" disabled></el-input>
            </el-form-item>
            
            <el-form-item label="角色描述" prop="mobile">
              <el-input v-model="roleListInfo.roleDesc"></el-input>
            </el-form-item>
          </el-form>  
          <!-- 弹窗对话框内底部区 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="reviseRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="reviseRoleInfo()">确 定</el-button>
          </span>
        </el-dialog>

        <!-- ********************************************* -->
        <!-- 分配权限对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="setRightdialogVisible"
            width="50%">
            <!-- 树形结构 -->
            <!-- 这里的data是数据源绑定 ,node-key属性要是唯一的标识，绑定之后，具体选中的值是id-->
            <!-- 双向绑定数据里面不能用this.XXX，直接用原变量名即可 -->
            <el-tree :data="treeRightArrayList" 
            :props="treeProps" 
            show-checkbox node-key="id"
            :default-checked-keys="defaultkeys"
            default-expand-all
            ref="treeRef"></el-tree>
            <!-- 树形结构 -->
            <!-- ************************************************ -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allowcateRights()">确 定</el-button>
            </span>
        </el-dialog>

  </div>
</template>

<script>
    export default {
        name:'Roles',
        data(){
            return{
                queryRoleInfo:{
                //搜索关键字
                    query:'',

                },
                //所有角色列表数据
                roleList:[],

                //所有角色的列表数据
                roleListInfo:{},

                //修改角色信息的规则
                reviseRoleFormRules:{
                    roleName:[
                        {required:true,message:'请输入角色名称',trigger:'blur'},
                        {min:2,max:10,message:'角色名称长度在2-10个字符之间'},
                    ],
                    roleDesc:[
                        {required:true,message:'请输入角色描述',trigger:'blur'},
                        {min:2,max:10,message:'角色描述长度在2-10个字符之间'},
                    ]

                },
                //控制dialog对话框显示与否
                RoledialogVisible:false,
                //添加角色的数据
                addRoleForm:{
                    roleName:'',
                    roleDesc:'',
                },
                //添加用户数据的规则
                addRoleFormRules:{
                    roleName:[
                        {required:true,message:'请输入角色名称',trigger:'blur'},
                        {min:2,max:10,message:'角色名称长度在2-10个字符之间'},
                    ],
                    roleDesc:[
                        {required:true,message:'请输入角色描述',trigger:'blur'},
                        {min:2,max:10,message:'角色描述长度在2-10个字符之间'},
                    ]
                },
                //查询role信息
                searchRoleList:[],
                //监听修改角色信息的布尔值
                reviseRoleDialogVisible:false,

                //监听分配权限对话框是否开启
                setRightdialogVisible:false,
                //定义树形图数组
                treeRightArrayList:[],

                //树形控件的属性绑定对象
                treeProps:{
                    children:'children',//children指我们实现父子嵌套是哪一个属性
                    label:'authName',//label是页面显示的文本是我们哪一个数据字段
                },
                //默认选中节点的id值
                defaultkeys:[],

                //权限id
                roleId:[],
               

            }
        },
        //渲染DOM的时候自动使用函数getrolelist
        created(){
            //获取所有角色的列表
            this.getRoleList();
        },
        methods:{
            async getRoleList(){
                const {data:res}=await this.$http.get('roles',{params:this.queryRoleInfo});
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('获取角色列表失败')
                }
                //本地保存服务器返回的数据
                this.roleList=res.data;
                // this.roleListId=res.data.roleName;
                
                console.log('@@@@@@@@@@@@@@@@@@@@@@获取到的角色列表:',this.roleList);
                // console.log('##################################获取角色的ID列表:',this.roleList[0].id);
                
            },
            //显示添加角色对话框函数函数
            addRoles(){
                this.RoledialogVisible=!this.RoledialogVisible;
            },
            //添加角色函数
            ADDROLES(){
                this.$refs.addRoleFormRef.validate(async (valid)=>{
                    console.log('dialog对话框中的valid属性值是:',valid);
                    if(!valid){
                        return false;
                    }
                    else{
                        const{data:res}=await this.$http.post('roles',this.addRoleForm);
                        if(res.meta.status!==201){
                            console.log('addRoleForm:',this.addRoleForm);
                            this.$AlertMessage.error('添加角色失败');
                        }
                        else{
                            this.$AlertMessage.success('添加角色成功');
                            this.RoledialogVisible=false;
                            this.getRoleList();
                        }
                    }
                })
            },
            //监听添加角色对话框重置函数
            addRoledialogClose(){
                this.$refs.addRoleFormRef.resetFields();
            },

            //根据角色id查询用户
            async searchRole(){
                const{data:res0}=await this.$http.get(`roles/${this.roleList[0].id}`);
                if(res0.meta.status!==200){
                    this.$AlertMessage.error('查询角色失败')
                    console.log(res0.meta.status);
                }
                else if(res0.meta.status==200){
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                    console.log('@@@@@@@@根据角色id查询的:',res0);
                }
                
            },
            //  //首先根据ID找到角色的信息，从服务器返回的数据，我用一个空对象接收
          //修改用户函数.点击编辑用户的同时，会弹出用户的原来的数据
            async showRoleDialog(id){
                const {data:res}=await this.$http.get(`roles/${id}`);
                ///////////////////////////////////////////////
                console.log('showRoleDialog中返回的值:',res);
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('查询角色信息失败')
                }
                else{
                    this.roleListInfo=res.data;
                    //收到服务器返回的数据后，显示修改角色对话框
                    this.reviseRoleDialogVisible=true;  

                }
            },
            //修改并且提交角色信息
            reviseRoleInfo(){
                this.$refs.reviseRoleFormRef.validate(async (valid)=>{
                    console.log('修改角色信息的valid值是:',valid)
                    if(!valid){
                        this.$AlertMessage.error('修改角色信息失败,valid值为假');
                        return false
                    }
                    else{
                        // console.log(111)
                        // console.log('roleListInfo中的id属性:',this.roleListInfo);
                        const {data:res}=await this.$http.put(`roles/${this.roleListInfo.roleId}`,{
                            roleName:this.roleListInfo.roleName,
                            roleDesc:this.roleListInfo.roleDesc,
                        });
                        /////////////////////////////////////////////
                        console.log('reviseRoleInfo中返回的值:',res);
                        if(res.meta.status!==200){
                            // console.log(111);
                            this.$AlertMessage.error('修改角色信息失败');

                        }
                        else{
                            this.reviseRoleDialogVisible=false;
                            this.getRoleList();
                            this.$AlertMessage.success('修改角色信息成功');
                        }
                    }
                })
            },
            //当用户修改信息对话框点击取消的时候，重置对话框
            reviseRoleDialogClose(){
                this.$refs.reviseRoleFormRef.resetFields();

            },
            async DeleteRoleById(id){
                const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).catch(error =>{
                    return error
                })
                console.log('role返回的confirmResult值是:',confirmResult);
                if(confirmResult!=='confirm'){
                    this.$AlertMessage.error('已取消删除角色信息');
                }
                else if(confirmResult=='confirm'){
                    const {data:res}=await this.$http.delete(`roles/${id}`);
                    if(res.meta.status!==200){
                        return this.$AlertMessage.error('删除角色信息失败');
                    }
                    else if(res.meta.status==200){
                        this.$AlertMessage.success('删除角色信息成功');
                        // console.log('###############删除角色信息成功###################3');
                        this.getRoleList();
                    }

                }

            },
            //根据id删除用户权限
            //role是角色的数据，也就是scope.row这一行的数据，rightId是权限的id
            async removeRightById(role,roleId,rightId){
                const confirmResult=await this.$confirm('此操作会永远删除用户角色信息，是否继续？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch((error)=>{
                    return error
                })
                if(confirmResult!=='confirm'){
                    this.$AlertMessage.info('已取消删除角色权限');
                }
                else if(confirmResult=='confirm'){
                    this.$AlertMessage.success('删除角色权限成功');
                    const {data:res}=await this.$http.delete(`roles/${roleId}/rights/${rightId}`)
                    if(res.meta.status!==200){
                        return this.$AlertMessage.info('删除权限失败');
                    }
                    this.$AlertMessage.success('删除角色权限成功');
                    //重新刷新列表
                    //如果用这个会每次删除成功后都刷新一下页面，重新渲染DOM
                    // this.getRoleList();

                    //服务器返回的data是当前角色下最新的权限数据
                    // 如何区分深拷贝与浅拷贝，简单点来说，就是假设B复制了A，当修改A时，
                    // 看B是否会发生变化，如果B也跟着变了，说明这是浅拷贝，拿人手短，
                    // 如果B没变，那就是深拷贝，自食其力。
                    role.children=res.data;
                }

            },
            //展示分配权限对话框的函数
            async showSetRightDialog(role){
                // console.log('111');
                //先把后台返回的权限id记下来
                this.roleId=role.id;
                const {data:res}=await this.$http.get('rights/tree');
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('获取树形权限图失败')
                }
                else if(res.meta.status==200){
                    this.$AlertMessage.success('获取树形权限图成功');
                    //把获取到的权限数据保存到数组中
                    this.treeRightArrayList=res.data;
                    console.log('@@@@@@@所获取到的权限数据treeRightArrayList:',this.treeRightArrayList);


                }
                //在调用递归函数前清空数组
                this.defaultkeys=[];

                //递归获取三级节点的id
                this.getLeafKeys(role,this.defaultkeys);
                this.setRightdialogVisible=true;
            },


            //通递归的形式，获取角色下所有三级权限的id，并且保存到defaultkeys数组中
            getLeafKeys(node,arr){
                //如果当前节点不包含children属性，说明他是三级节点
                if(!node.children){
                    // console.log('getLeafKeys中node:',node);
                    return arr.push(node.id);
                }
                else{
                    // this.defaultKeys=[];
                    // console.log('getLeafKeys中node:',node);
                    // foreach里面的就是一个函数，是箭头函数,相当于function（item）
                    node.children.forEach((item)=>this.getLeafKeys(item,arr));        
                }

            },
            //分配权限函数，绑定在权限对话框的确定按钮上
            async allowcateRights(){
                // ...方法，类似于Python的压平，去掉[],不管是大括号（[]）、花括号（{}），统统不在话下，全部脱掉脱掉！
                const allowcateArr=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
                console.log('allowcateArr:',allowcateArr);
                //用‘，’，把他拼接为字符串
                const idStr=allowcateArr.join(',')
                console.log('idStr:',idStr)
                const {data:res}=await this.$http.post(`roles/${this.roleId}/rights/`,{rids:idStr});
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('分配角色权限失败')
                }
                else{
                    this.$AlertMessage.success('分配角色权限成功');
                    //重新刷新角色权限列表数据
                    this.getRoleList();
                    this.setRightdialogVisible=false;
                }

            }
    
        }
    }
</script>

<style lang="less" scoped>
    .eltag{
        margin: 10px;
    }
    .bdtop{
        border-top:1px solid #eee;
    }
    .bdbottom{
        border-bottom:1px solid #eee;
    }
</style>