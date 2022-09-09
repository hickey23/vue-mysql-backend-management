<template>
  <div>
     <!-- 面包屑导航区 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 点击首页跳转到/hello页面 -->
            <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
        <!-- 添加角色按钮区.,row是行，column是列 -->
        <!-- 这个是第一行的按钮 -->
        <el-row>
            <el-col :span="10">
                    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
                    <!-- el-input有一个事件加clear，在点击由clearable属性生成的清空核钮时触发 -->
                    <el-input placeholder="请输入内容" v-model= "goodsList" :clearable="true">
                      <el-button slot="append" icon="el-icon-search" ></el-button>
                    </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="showAddGoodsDialog()">添加分类</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="treeGoodsArrayList" border stripe style="width: 100%;" row-key="cat_id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column prop="cat_name" label="分类名称" >
                </el-table-column>
                <el-table-column prop="cat_deleted" label="是否还有库存" >

                    <template v-slot="scope">
                        <!-- //开关状态绑定 -->
                        <el-switch v-model="scope.row.cat_deleted"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeSwitchStatus(scope.row.cat_deleted)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="cat_level" label="排序">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
                        <el-tag type="success" v-if="scope.row.cat_level==1">二级</el-tag>
                        <el-tag type="danger" v-if="scope.row.cat_level==2">三级</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" size="mini" @click="showEditGoodsDialog(scope.row)">
                            <i class="el-icon-edit">编辑</i>
                        </el-button>
                        <el-button type="danger" size="mini" @click="deleteGoods(scope.row)">
                            <i class="el-icon-delete"> 删除</i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>

            <!-- //底部页面栏 -->
            <!-- //前面两个绑事件函数后面不要加（），不然会导致触发不了跳转下一页按钮 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              background
              :page-sizes="[1,3,5,8,10]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>

            <!-- ************************************************* -->
            <!-- //添加商品信息对话框 -->
            <el-dialog
            title="添加商品信息"
            :visible.sync="addGoodsDialogVisible"
            width="50%"
            @close="addGoodsDialogClose"
            >
                <!-- <span>这是一段信息</span> -->
                <el-form>
                    <el-form-item :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label="分类名称" >
                        <!-- disabled属性,可以让禁用掉这一行 -->
                        <el-input v-model="addGoodsForm.cat_name"></el-input>
                    </el-form-item>   
                    <el-form-item  label="父级分类" >
                        <!-- disabled属性,可以让禁用掉这一行 -->
                        <!-- cat_pid不能为空，如果要添加1级分类，则父分类Id应该设置为`0` -->
                        <!-- options用来指定数据源 -->
                        <!-- props用来指定配置对象 -->
                        <!-- v-model只能绑定一个数组，不能是一个值或者是对象 -->
                        <!-- // ...方法，类似于Python的压平，去掉[],不管是大括号（[]）、花括号（{}），统统不在话下，全部脱掉脱掉！ -->
                        <el-cascader
                        v-model="selectedParentId"
                        :options="ParentList"
                        :props="{ expandTrigger: 'hover', ...cascaderProps}"
                        @change="parentCateListChanged"
                        clearable>
                        </el-cascader>                      
                    </el-form-item>   
                </el-form>
                
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addGoodsDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addGoodsList()">确 定</el-button>
                </span>
            </el-dialog>
            


            <!-- **************************************************** -->
            <!-- 修改商品信息对话框 -->
            <el-dialog
            title="修改商品信息"
            :visible.sync="showEditGoodsDialogVisible"
            width="50%"

            >
                <!-- <span>这是一段信息</span> -->
                <el-form :model="CateInfo" ref="CateInfoFormRef" label-width="100">
                    <el-form-item label="当前分类名称">
                        <!-- disabled属性,可以让禁用掉这一行 -->
                        <el-input v-model="CateInfo.cat_name"></el-input>
                    </el-form-item>    
                    <el-form-item label="是否还有库存">
                        <!-- disabled属性,可以让禁用掉这一行 -->
                        <!-- <el-input v-model="CateInfo.cat_deleted"></el-input> -->
        
                        <el-switch v-model="CateInfo.cat_deleted"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changeFormSwitchStatus(CateInfo.cat_deleted)">
                        </el-switch>
                    </el-form-item>    
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="showEditGoodsDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editGoodsList(CateInfo)">确 定</el-button>
                </span>
            </el-dialog>
        </el-row>
                      
             
    </el-card>
  </div>
</template>

<script>
    export default {
        name:'Cate',
        data(){
            return{
                //商品
                goodsList:'',
                //商品分类列表
                cateList:[],
                //查询数据
                queryInfo:{
                    query:'',
                    type:3,
                    pagenum:1,
                    //每条页面呈现的数据有5个
                    pagesize:5,
                },
                total:0,
                //商品树形列表
                treeGoodsArrayList:[],
                //树形控件的属性绑定对象
                treeProps:{
                    children:'children',//children指我们实现父子嵌套是哪一个属性
                    label:'cat_name',//label是页面显示的文本是我们哪一个数据字段
                },
                treeArray:[],
                //展示修改商品信息对话框
                showEditGoodsDialogVisible:false,

                //对话框修改的商品分类信息
                CateInfo:[],
                //展示add商品信息对话框
                addGoodsDialogVisible:false,

                //添加商品obj
                // | 参数名    | 参数说明  | 备注                                                        |
                // | --------- | --------- | ----------------------------------------------------------- |
                // | cat_pid   | 分类父 ID | 不能为空，如果要添加1级分类，则父分类Id应该设置为  `0`      |
                // | cat_name  | 分类名称  | 不能为空                                                    |
                // | cat_level | 分类层级  | 不能为空，`0`表示一级分类；`1`表示二级分类；`2`表示三级分类 |
                addGoodsForm:{
                    // 要添加的分类名称
                    cat_name:'',
                    // 当前添加分类等级,默认一级分类
                    cat_level:0,

                    //父级分类的id
                    cat_pid:0,


                },

                //
                addGoodsFormRules:{
                    cat_name:[
                        //message是错误提示
                        {required:true,message:'请输入添加商品名称',trigger:'blur'},
                        {min:2,max:10,message:'商品名称长度在2-10个字符之间'},
                
                    ],
                    // cat_deleted:[
                    //     {required:true,message:'请输入添加商品是否有库存',trigger:'blur'},
                    //     {min:6,max:15,message:'库存需要在1-15个字符之间'},
                    // ],
                    cat_level:[
                        {required:true,message:'请输入商品层级',trigger:'blur'},
                        {min:6,max:20,message:'商品层级需要在1-15个字符之间'},
                        // {validator:checkEmail},
                    ],
                },
                //父级数据列表，1,2级,调用@change事件会打印出1级和2级菜单的id，
                ParentList:[],
                //指定级联选择器的配置对象
                cascaderProps:{
                    //指定具体选中的值
                    value:'cat_id',
                    //你所看到是属性
                    label:'cat_name',
                    //父子嵌套用的是哪个属性
                    children:'children',
                },
                //选中的父级分类的id,1,2级id都打印
                selectedParentId:[],
                
            }
        },
        created(){
            this.getCateList();
        },
        methods:{
            async getCateList(){
                const{data:res}=await this.$http.get('categories',{params:this.queryInfo});
                console.log('########获取商品数据的res:',res);
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('获取商品数据失败')
                }
                else{
                    this.$AlertMessage.success('获取商品数据成功');
                    //用空数组接收服务器返回值
                    this.cateList=res.data;
                    //用树形数组接收数据
                    this.treeGoodsArrayList=res.data.result;

                    // for(let i=0;i<this.treeGoodsArrayList.length;i++){
                    //     this.treeGoodsArrayList[i]['cat_deleted']=!this.treeGoodsArrayList[i]['cat_deleted'];
                    // }
                    console.log('修改cat_deleted后的treeGoodsArrayList:',this.treeGoodsArrayList);
                    
                    console.log('接收到的商品数据cateList:',this.cateList);
                    this.total=res.data.total;
                }
            },
            //显示添加商品对话框
            showAddGoodsDialog(){
                //先获取父级分类列表，在展示对话框
                this.getParentCateList();
                this.addGoodsDialogVisible=!this.addGoodsDialogVisible;

            },
            //添加商品分类
            async addGoodsList(){
                const{data:res}=await this.$http.post('categories',this.addGoodsForm);
                if(res.meta.status!==201){
                    console.log("error:",res);
                    // console.log('status:',res.meta.status)
                    return this.$AlertMessage.error('添加商品信息失败')
                }
                else if(res.meta.status==201){
                    this.$AlertMessage.success('添加商品信息成功')
                    this.addGoodsDialogVisible=false;
                    this.getCateList();                    

                }

            },
            changeSwitchStatus(status){
                status=!status;
                // return status

            },
            async handleSizeChange(newSize){
                console.log('newsize:',newSize);
              //把现在用户所选中的pagesize的值给data里面的pagesize
                this.queryInfo.pagesize=newSize;
              //当newsize发生变化，也就是用户选择一次性显示及条信息的时候，需要根据newsize值重新发出请求
                //########################################
                // ??#######################################
              //这里重新写一遍getCateList中的请求过程会报错误，不知道为什么
                this.getCateList();

            },
            handleCurrentChange(newPage){
                console.log('newPage:',newPage);
                this.queryInfo.pagenum=newPage;
                console.log('跳转后的newPage:',newPage);
                //########################################
                // ??#######################################
                //这里重新写一遍getCateList中的请求过程会报错误，不知道为什么
                this.getCateList();
 
            },

            //show edit goods dialog
            showEditGoodsDialog(goodsInfo){
                this.showEditGoodsDialogVisible=!this.showEditGoodsDialogVisible;
                console.log('goodsInfo:',goodsInfo);
                this.CateInfo=goodsInfo;
            },

            //编辑商品信息
            editGoodsList(CateInfo){
                //在最近的函数前async
                this.$refs.CateInfoFormRef.validate(async(valid)=>{
                    console.log('修改商品信息的valid值是:',valid);
                    // console.log('CateInfo:',CateInfo);
                    if(!valid){
                        return false
                    }
                    else{
                        const {data:res}=await this.$http.put(`categories/${CateInfo.cat_id}`,{
                            cat_name:CateInfo.cat_name
                        });
                        console.log('editGoodsList中返回的值:',res);
                        if(res.meta.status!==200){
                            return this.$AlertMessage.error('修改商品信息失败');
                        }
                        else{
                            this.$AlertMessage.success('修改商品信息成功');
                            this.showEditGoodsDialogVisible=false;
                            this.getCateList();
                        }
                    }
                })


            },
            //关闭对话框时候清空dialog数据
            addGoodsDialogClose(){
                this.$refs.addGoodsFormRef.resetFields();
                //把下拉框中数组清空
                this.selectedParentId=[];
                this.addGoodsForm.cat_pid=0;
                this.addGoodsForm.cat_level=0;
            },


            //改变修改对话框中的开关状态
            changeFormSwitchStatus(cat_deleted){
                return cat_deleted=!cat_deleted;

            },
            //删除商品信息
            async deleteGoods(goodsInfo){
                const confirmResult=await this.$confirm('此操作将永久删除该商品信息,是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning',
                }).catch(error=>{
                    return error
                })
                if(confirmResult!=='confirm'){
                    this.$AlertMessage.info('已取消删除商品信息')
                }
                else if(confirmResult=='confirm'){
                    const {data:res}=await this.$http.delete(`categories/${goodsInfo.cat_id}`);
                    if(res.meta.status!==200){
                        // console.log('res:',res);
                        // console.log('goodsInfo:',goodsInfo);
                        
                        return this.$AlertMessage.info('删除商品信息失败');
                    }
                    else{
                        this.$AlertMessage.success('删除商品信息成功');
                        //refresh Catogorylist
                        this.getCateList();
                    }

                }

            },
            //在添加分类对话框中获取父级分类数据
            async getParentCateList(){
                const {data:res}=await this.$http.get('categories',{params:{type:2}});
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('获取父级分类数据失败')
                }
                else{
                    this.$AlertMessage.success('获取父级分类数据成功')
                    console.log('获取父级分类数据是:',res.data,typeof(res.data));//obj
                    //parentlist保存父级分类的列表
                    this.ParentList=res.data;
                    // console.log('获取ParentList数据是:',this.ParentList);

                }
                
            },
            //选择项发生变化时触发
            parentCateListChanged(){
                    console.log('this.selectedParentId:',this.selectedParentId)
                    //如果selectedParentId长度大于0，说明选中的父级分类，反之没有选中任何父级分类
                    if(this.selectedParentId.length>0){
                        //父级分类id
                        //用添加表单绑定的值去接收父级id
                        this.addGoodsForm.cat_pid=this.selectedParentId[this.selectedParentId.length-1];
                        //为当前分类的等级赋值
                        this.addGoodsForm.cat_level=this.selectedParentId.length;
                        return 

                    }
                    else{
                        //设为默认值
                        this.addGoodsForm.cat_pid=0;
                        this.addGoodsForm.cat_level=0;
                    }
            },
        },
        computed:{
            computecat_deleted(){
                for(i=0;i<5;i++){
                    this.treeGoodsArrayList[i]['cat_deleted']=ture;
                }
                console.log('修改cat_deleted后的treeGoodsArrayList:',this.treeGoodsArrayList);
                return this.treeGoodsArrayList
            }
        }


    }
</script>

<style lang="less" scoped>
    .goodslistcol{
        margin-top:30px ;
    }
    .el-cascader{
        width: 100%;
    }
</style>