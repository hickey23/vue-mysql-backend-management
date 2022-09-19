<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- 点击首页跳转到/hello页面 -->
        <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/params' }">参数管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/params' }">参数列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/params' }">参数详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- !-- 卡片视图 -->
    <el-card>
        <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false">
        </el-alert>
        <!-- // -->
        <el-row>
            <el-col class="chooseGoodsCate">
                <span>选择商品分类 :</span>
                <el-cascader 
                        v-model="selectedCateKeys"
                        :options="CateList"
                        :props="{ expandTrigger: 'hover', ...cascaderProps}"
                        @change="handleChanged"
                        clearable>
                </el-cascader>   
            </el-col>   
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <!-- //动态参数面板 -->
                    <el-tab-pane label="动态参数" name="many">
                        <el-button type="primary" :disabled="isBtnDisabled" @click="addActiveParams()">添加参数</el-button>
                        <!-- //动态参数表 -->
                        <el-table :data="manyTableList" border stripe>
                            <el-table-column type="expand">
                                <!-- //渲染参数下面的attr_vals的el-tag标签 -->
                                <template v-slot="scope">
                                    <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" 
                                    class="ActiveParams_el-tag"
                                    closable
                                    @close="handleCloseElTag(index,scope.row)">
                                        {{item}}
                                    </el-tag>
                                    <!-- //输入的文本框 -->
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="mini"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    ></el-input>
                                    <!-- //添加按钮 -->
                                    <el-button v-else class="button-new-tag" size="small" @click="showTag(scope.row)">+ New Tag</el-button>

                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="索引" width="100px"></el-table-column>
                            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作">
                                <template v-slot="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="deleteActiveParams(scope.row)">删除</el-button>
                                </template>
                               
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <!-- //////////////静态属性面板 -->
                    <el-tab-pane label="静态属性" name="only">
                        <el-button type="primary" :disabled="isBtnDisabled" @click="addStaticParams()">添加属性</el-button>
                        <!-- 静态属性表 -->
                        <el-table :data="onlyTableList" border stripe>
                            <el-table-column type="expand"></el-table-column>
                            <el-table-column type="index" label="索引" width="100px"></el-table-column>
                            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                            <el-table-column label="操作">
                                <template v-slot="scope">
                                    <el-button type="primary" icon="el-icon-edit">修改</el-button>
                                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                                </template>
                                
                            </el-table-column>
                        </el-table>
                        
                    </el-tab-pane>

        </el-tabs>
    </el-card>
    <!-- //添加动态参数对话框 -->
    <el-dialog
        title="添加动态参数"
        :visible.sync="addActiveParamsdialogVisible"
        width="50%"
        @close="addActiveParamsdialogVisibleClose()"
        >
        <!-- <span>这是一段信息</span> -->
        <!-- 表单域 model 字段，在使用 validate、resetFields方法的情况下，prop属性是必填的/ -->
        <!-- 传入 Form 组件的 model 中的字段 -->
        <el-form :model="addActiveParamsForm" :rules="addActiveParamsFormRules" ref="addActiveParamsFormRef">
            <el-form-item label="动态参数" prop="attr_name">
                <!-- disabled属性,可以让禁用掉这一行 -->
                <el-input v-model="addActiveParamsForm.attr_name"></el-input>
            </el-form-item>  
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addActiveParamsdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addActiveParamsBtn()">确 定</el-button>
        </span>
    </el-dialog>
    <!-- ****************************************************** -->
    <!-- //添加静态属性对话框 -->
    <el-dialog
        title="提示"
        :visible.sync="addStaticParamsdialogVisible"
        width="50%"
        >
        <!-- <span>这是一段信息</span> -->
        <el-form :model="addStaticParamsForm" :rules="addStaticParamsFormRules" ref="addStaticParamsFormRef">
            <el-form-item label="静态属性" prop="attr_name">
                <!-- disabled属性,可以让禁用掉这一行 -->
                <el-input v-model="addStaticParamsForm.attr_name"></el-input>
            </el-form-item>  
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addStaticParamsdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addStaticParamsBtn()">确 定</el-button>
        </span>
    </el-dialog>


    <!-- //******************修改动态参数对话框*****************************8 */ -->
    <el-dialog
    title="修改动态参数"
    :visible.sync="EditDialogVisible"
    width="50%"
    >
        <!-- <span>这是一段信息</span> -->
        <el-form :model="EditActiveParamsForm" :rules="EditActiveParamsFormRules" ref="EditActiveParamsFormRef">
            <el-form-item label="动态参数" prop="attr_name">
                <!-- disabled属性,可以让禁用掉这一行 -->
                <el-input v-model="EditActiveParamsForm.attr_name"></el-input>
            </el-form-item>  
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="EditDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditActiveParamsBtn()">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name:'Params',
        data(){
            return {
                //每次调用getCateList时候
                //提交表单数据
                // | 参数名   | 参数说明           | 备注                                                         |
                // | -------- | ------------------ | ------------------------------------------------------------ |
                // | type     | [1,2,3]            | 值：1，2，3 分别表示显示一层二层三层分类列表<br />【可选参数】如果不传递，则默认获取所有级别的分类 |
                // | pagenum  | 当前页码值         | 【可选参数】如果不传递，则默认获取所有分类                   |
                // | pagesize | 每页显示多少条数据 | 【可选参数】如果不传递，则默认获取所有分类                   |
                queryInfo:{
                    query:'',
                    type:3,
                    pagenum:1,
                    //每条页面呈现的数据有5个
                    pagesize:5,
                },
                //接收服务器返回的数据
                CateList:[],
                //级联选择框的配置对象
                cascaderProps:{
                    //指定具体选中的值
                    value:'cat_id',
                    //你所看到是属性
                    label:'cat_name',
                    //父子嵌套用的是哪个属性
                    children:'children',
                },
                //选中项的绑定值，保存选中的每一级的id值
                selectedCateKeys:[],

                //被激活的页签名称,鼠标点中哪个，哪个就被激活，activeName就等于谁
                activeName:'many',
                //动态属性表格
                manyTableList:[],
                //静态属性表格
                onlyTableList:[],
                //show添加动态参数对话框
                addActiveParamsdialogVisible:false,
                //
                addStaticParamsdialogVisible:false,
                //添加动态参数表单数组
                addActiveParamsForm:{
                    attr_name:'',
                    attr_sel:'',

                },
                //
                addActiveParamsFormRules:{
                    attr_name:[{required:true,message:'请输入要添加的动态参数',trigger:'blur'}],

                },
                ////添加静态属性表单数组
                addStaticParamsForm:{
                    attr_name:'',
                    attr_sel:'',

                },
                //添加静态参数表单规则
                addStaticParamsFormRules:{
                    attr_name:[{required:true,message:'请输入要添加的静态属性',trigger:'blur'}],
                },
                //展示修改信息对话框
                EditDialogVisible:false,
                //修改动态参数对象
                EditActiveParamsForm:{
                    attr_name:'',
                    attr_sel:'',
                },
                /////////////////////////////////////////////////////////
                EditActiveParamsFormRules:{
                    attr_name:[{required:true,message:'请输入要添加的静态属性',trigger:'blur'}],
                },
                //用来接收attr_id
                ATTR_ID:'',
                
                //如果这样写会导致每一行的数据，当新增数据时候，每一行都会改变，因为他们共用一个inputVisible和inputValue
                //tag标签输入框显示
                // inputVisible:false,
                //文本框输入的内容
                // inputValue:'',

            }
        },
        created(){
            this.getCateList();
        },
        methods:{
            //获取商品参数列表数据函数
            async getCateList(){
                const{data:res}=await this.$http.get('categories');
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('获取商品信息失败');
                }
                else{
                    console.log('返回的数据res:',res);
                    this.CateList=res.data;
                    
                }
            },

            //级联选择器改变调用函数
            handleChanged(){    
                if(this.selectedCateKeys.length!==3){
                    //clear array
                    this.selectedCateKeys=[];
                    this.manyTableList=[];
                    this.onlyTableList=[];
                    return false
                }
                else if(this.selectedCateKeys.length==3){
                    console.log('@@@@@selectedCateKeys:',this.selectedCateKeys);
                    //获取静态和动态参数
                    this.getActiveStaticParams();
                    
                }
            },
            ////根据当前所处的id和面板获取对应的参数
            //获取动态参数和静态属性
            async getActiveStaticParams(){

                //根据当前所处的id和面板获取对应的参数
                const {data:res}=await this.$http.get(`categories/${this.CateId}/attributes`,
                {params:{sel:this.activeName}});
                // console.log(res);
                if(res.meta.status!==200){
                    // console.log(111)
                    return this.$AlertMessage.error('获取参数列表失败');

                }
                this.$AlertMessage.success('获取参数列表成功');
                //************************************************* */
                //以空格来分割，让attr_vals形成一个新数组
                res.data.forEach(item=>{
                    if(item.attr_vals!==''){
                        item.attr_vals=item.attr_vals.split(' ');
                        //为item新增加自定义属性inputValue,inputVisible
                        // item.inputValue='';
                        // item.inputVisible=false;
                        //这下面两句话要写在if的外面
                        // this.$set(item,'inputVisible',false);
                        // this.$set(item,'inputValue','');
                
                    }
                    else if(item.attr_vals==''){
                        return []
                    }
                    //先把item的attr_vals属性拆分，然后在给item添加属性
                    //为item新增加自定义属性inputValue,inputVisible
                    this.$set(item,'inputVisible',false);
                    this.$set(item,'inputValue','');
       
                });
                console.log('获取参数列表成功res:',res); 
                //************************************************ */

                if(this.activeName=='many'){
                    //动态数据保存在manyTableList
                    this.manyTableList=res.data;
                    console.log('manyTableList:',this.manyTableList);
                }
                else if(this.activeName=='only'){
                    //static table
                    this.onlyTableList=res.data;
                    console.log('onlyTableList:',this.onlyTableList);
                }

            },

            //////////////////////////////////////////////////////////////////
            //tab标签页点击的时候触发函数
            handleTabClick(){
                this.getActiveStaticParams();
                console.log(this.activeName);
                
            },
            //显示添加动态参数对话框
            addActiveParams(){
                this.addActiveParamsdialogVisible=!this.addActiveParamsdialogVisible;
            },
            //显示添加静态属性对话框
            addStaticParams(){
                this.addStaticParamsdialogVisible=!this.addStaticParamsdialogVisible;
            },
            //当点击添加动态属性后调用这个函数
            async addActiveParamsBtn(){
                this.$refs.addActiveParamsFormRef.validate(async (valid)=>{
                    if(!valid){
                        return this.$AlertMessage.error('表单预验证未通过',valid)
                    }
                    else{
                        const {data:res}=await this.$http.post(`categories/${this.CateId}/attributes`,
                        {attr_name:this.addActiveParamsForm.attr_name,attr_sel:this.activeName});
                        // console.log(res);
                        if(res.meta.status!==201){
                            console.log(res);
                            return this.$AlertMessage.error('添加动态参数失败')
                        }
                        else{
                            this.$AlertMessage.success('添加动态参数成功');
                            this.addActiveParamsdialogVisible=false;
                            // this.getActiveStaticParams();
                
                            this.getCateList();
                        }
                    }
                })

            },
            //关闭添加动态参数对话框重置表单
            addActiveParamsdialogVisibleClose(){
                this.$refs.addActiveParamsFormRef.resetFields();
            },
            //点击添加静态属性按钮触发
            addStaticParamsBtn(){
                this.$refs.addStaticParamsFormRef.validate(async (valid)=>{
                    if(!valid){
                        return this.$AlertMessage.error('添加静态属性失败valid值为false')
                    }
                    else{
                        const{data:res}=await this.$http.post(`categories/${this.CateId}/attributes`,
                        {attr_name:this.addStaticParamsForm.attr_name,attr_sel:this.activeName})
                        if(res.meta.status!==201){
                            return this.$AlertMessage.error('添加静态属性失败')
                        }
                        else{
                            this.$AlertMessage.success('添加静态属性成功');
                            this.addStaticParamsdialogVisible=false;
                            this.getCateList();
                        }
                    }
                })

            },
            //显示修改对话框
            showEditDialog(attr_id){
                this.EditDialogVisible=!this.EditDialogVisible;
                this.ATTR_ID=attr_id
            },

            //点击修改动态参数对话框确定按钮触发像服务器请求数据
            async EditActiveParamsBtn(){
                this.$refs.EditActiveParamsFormRef.validate(async (valid)=>{
                    if(!valid){
                        return this.$AlertMessage.error('修改动态参数失败valid值为false')
                    }
                    const{data:res}=await this.$http.put(`categories/${this.CateId}/attributes/${this.ATTR_ID}`,
                    {attr_name:this.EditActiveParamsForm.attr_name,attr_sel:this.activeName});
                    console.log('this.EditActiveParamsForm:',this.EditActiveParamsForm);
                    /////////////////////////
                    if(res.meta.status!==200){
                        return this.$AlertMessage.error('修改动态参数失败')
                    }
                    else{
                        this.$AlertMessage.success('修改动态参数成功');  
                        this.getCateList();
                        this.EditDialogVisible=false;

                    }
                })

            },
            //关闭修改动态参数对话框函数重置表单
            EditActiveDialogClose(){
                this.$Refs.EditActiveParamsFormRef.resetFields();
            },
            //删除动态参数
            async deleteActiveParams(ActiveParams){
                const confirmResult=await this.$confirm('此操作将永久删除商品信息，是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch(error=>{
                    return error
                })
                if(confirmResult!=='confirm'){
                    return this.$AlertMessage.info('已取消删除动态参数信息')
                }
                //这里的attr_id要从插槽那获得，所以在显示对话框的时候获得那一行的数据,在传到deleteActiveParams（）
                const {data:res}=await this.$http.delete(`categories/${this.CateId}/attributes/${ActiveParams.attr_id}`);
                if(res.meta.status!==200){
                    
                    return this.$AlertMessage.info('删除动态参数信息失败')
                }
                this.$AlertMessage.success('删除动态参数信息成功');
                this.getCateList();
            },
            //文本框失去焦点或者按下enter键会触发函数·
            async handleInputConfirm(scope_row){
                console.log('handleInputConfirm被调用了');
                if(scope_row.inputValue.trim().length==0){
                    scope_row.inputValue='';
                    scope_row.inputVisible=false;
                    console.log('输入为空')

                }
                //如果length不为0，则需要做后续处理
                scope_row.attr_vals.push(scope_row.inputValue.trim());
                scope_row.inputValue='';
                scope_row.inputVisible=false;
                //发起请求保存这个操作
                const{data:res}=await this.$http.put(`categories/${this.CateId}/attributes/${scope_row.attr_id}`,
                {
                    attr_name:scope_row.attr_name,
                    attr_sel:scope_row.attr_sel,
                    attr_vals:scope_row.attr_vals.join(' '),
                })
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('修改参数项失败')
                }
                this.$AlertMessage.success('修改参数项成功');     
                
            },
            //删除el-tag标签
            async handleCloseElTag(index,scope_row){
                //splice() 方法用于添加或删除数组中的元素。
                //从第index个开始删除一个
                scope_row.attr_vals.splice(index,1);
                 //发起请求保存这个操作
                 const{data:res}=await this.$http.put(`categories/${this.CateId}/attributes/${scope_row.attr_id}`,
                {
                    attr_name:scope_row.attr_name,
                    attr_sel:scope_row.attr_sel,
                    attr_vals:scope_row.attr_vals.join(' '),
                })
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('修改参数项失败')
                }
                this.$AlertMessage.success('修改参数项成功');    



            },
            //展示添加tag标签
            showTag(scope_row){
                console.log('showTag被调用了');
                scope_row.inputVisible=true;
                // console.log(saveTagInput);
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });

            },


        },
        computed:{
            //返回布尔值，控制按钮是否显示
            //对于任何复杂逻辑，都应该使用计算属性，computed是基于他们的响应式依赖进行缓存的
            isBtnDisabled(){
                if(this.selectedCateKeys.length!==3){
                    return true
                }
                else{
                    return false
                }
            },
            //当前选中的三级分类id
            CateId(){
                if(this.selectedCateKeys.length==3){
                    return this.selectedCateKeys[this.selectedCateKeys.length-1];
                }
                else{
                    return null
                }
              
            },
        }

    }
</script>

<style lang="less" scoped>
    .chooseGoodsCate{
        margin-top: 15px;
    }
    .el-cascader {
        margin-left:15px;
    }
    .ActiveParams_el-tag{
        margin-left:10px;
    }
    .input-new-tag{
        width:20%
    }

</style>