<template>
  <div>
    <!-- 添加商品信息栏 -->
    <!-- 面包屑导航区 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 点击首页跳转到/hello页面 -->
            <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品列表</el-breadcrumb-item>
            <!-- <el-breadcrumb-item>商品详情</el-breadcrumb-item> -->
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
            <!-- <el-row>123</el-row> -->
            <!-- //提示区域 -->
            <el-alert
            title="添加商品信息"
            type="info"
            show-icon
            center>
            </el-alert>
            <!-- 把数字类型的字符串'0'变为number类型，只需要-0即可，paseInt也可以 -->
            <el-steps :space="200" :active="parseInt(activeIndex)" finish-status="success" align-center>
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>

            <!-- //label-width是指定每一个label所占的宽度 -->
            <!-- label-position="top"指定label在文本框之上 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!-- tab标签页 -->
                <!-- 如果点击以一个pane，会把第一个pane的name值保存到v-model双向绑定的数据身上 -->
                <!-- 为了实现tabs和steps联动，只需要tabs的v-model值和steps的active值一样就行了 -->
                  <!-- :before-leave切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。 -->
                <el-tabs v-model="activeIndex" :tab-position="'left'" 
                :before-leave="beforeTabLeave" @tab-click="tabClick()">
                  <el-tab-pane label="基本信息" name="0">
                    <el-form-item label="商品名称" prop="goods_name">
                      <el-input v-model="addForm.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" prop="goods_price">
                      <el-input v-model="addForm.goods_price" type="number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量" prop="goods_weight">
                      <el-input v-model="addForm.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量" prop="goods_number">
                      <el-input v-model="addForm.goods_number"></el-input>
                    </el-form-item>
                  </el-tab-pane> 

                  <!-- $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ -->
                  <!-- //级联选择器 -->
                  <!-- option指定获取数据源 -->
                  <!-- 数字类型的验证需要在 v-model 处加上 .number 的修饰符，
                      这是 Vue 自身提供的用于将绑定值转化为 number 类型的修饰符。 -->
                  <!-- prop:表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的 -->
                  <el-form-item label="商品分类" prop="goods_cat">
                    <el-cascader
                        v-model="addForm.goods_cat"
                        :options="goodsList"
                        :props="{ expandTrigger: 'hover', ...goodsProps}"
                        @change="handleChange()"
                        clearable>
                    </el-cascader> 
                    <!-- 级联选择器只能通过v-model绑定数组 -->
                  </el-form-item>

                  <!-- %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% -->
                  <el-tab-pane label="商品参数" name="1">
                    <!-- //渲染表单页面 -->
                    <el-form-item :label="item.attr_name" v-for="(item,index) in manyTableList" :key="item.attr_id">
                      <!-- //复选框组 -->
                      <!-- label	标签文本 -->
                      <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="Item" border class="el-checkBox" v-for="(Item,Index) in item.attr_vals" :key="Index">
                        </el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-tab-pane>
                  <!-- 商品属性 -->
                  <el-tab-pane label="商品属性" name="2">
                    <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTableList" :key="item.attr_id">
                      <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                  </el-tab-pane>
                  <!-- 商品图片 -->
                  <el-tab-pane label="商品图片" name="3">
                    <!-- action表示图片要上传的后台API地址 -->
                    <!-- :on-preview当点击图片的时候会触发的事件 -->
                    <!-- :on-remove点击关闭图片按钮的叉号的时候触发的事件 -->
                    <el-upload
                      class="upload-demo"
                      action="http://127.0.0.1:8888/api/private/v1/upload"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      multiple
                      :limit="3"
                      :headers="headerObj"
                      
                      list-type="picture"
                      :on-success="handleSuccess"
                      >
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>

                  </el-tab-pane>
                  <el-tab-pane label="商品内容" name="4">
                    <!-- 文本编辑器 -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <!-- 添加商品按钮 -->
                    <el-button type="primary" class="addGoodsBtn" @click="ADDGOODS">添加商品</el-button>
                  </el-tab-pane>
                </el-tabs>
            </el-form>    

    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
      >
      <img :src="previewPath" alt="" style="width:100%">

    </el-dialog>
  </div>
</template>

<script>
    export default {
        name:'Add',
        data(){
          return {
            //el-steps的默认索引
            activeIndex:0,
            //添加商品的表单数据
            addForm:{
              goods_name:'',
              goods_price:'',
              goods_weight:'',
              goods_number:'',
              //商品所属的分类数组,保存的是cat_id
              goods_cat:[],
              //上传图片的数组
              pics:[],
              //商品详情描述
              goods_introduce:'',
              goods_cat_copy:[],
              //
              attr:[],
            },
            //添加商品的校验规则表单规则
            addFormRules:{
              goods_name:[
                //message是错误提示
                {required:true,message:'请输入商品名称',trigger:'blur'},
                {min:0,max:10,message:'请输入商品名称'},
                
              ],
              goods_price:[
                //message是错误提示
                {required:true,message:'请输入商品价格',trigger:'blur'},
                {min:0,max:10,message:'请输入商品价格'},
                
              ],
              goods_weight:[
                //message是错误提示
                {required:true,message:'请输入商品重量',trigger:'blur'},
                {min:0,max:10,message:'请输入商品重量'},
                
              ],
              goods_number:[
                //message是错误提示
                {required:true,message:'请输入商品数量',trigger:'blur'},
                {min:0,max:10,message:'请输入商品数量'},
                
              ],
              goods_cat:[
                //message是错误提示
                {required:true,trigger:'blur'},
                // {message:'请输入商品分类'},
              ],
              
            },
            //商品信息列表，用于接收服务器返回的数据
            goodsList:[],
            //指定级联选择器的配置对象
            goodsProps:{
              //你所看到是属性
              label:'cat_name',
              //指定具体选中的值
              value:'cat_id',
              //父子嵌套用的是哪个属性
              children:'children',
            },
            //
            selectedParentId:[],
            //动态参数列表
            manyTableList:[],
            //静态列表数据
            onlyTableList:[],
            //upload组件的请求头对象
            headerObj:{
              //upload组件没有调用axios请求，所以必须手动指定authorization字段，每次请求添加token
              Authorization:
              window.sessionStorage.getItem('token'),
          
            },
            previewPath:'',
            //图片对话框显示布尔值
            previewDialogVisible:false,
            //临时对象
            newList:{attr_id:'',attr_vals:''},
            
          }
        },
        created(){
          this.getGoodsList();
        },
        methods:{
          async getGoodsList(){
            const{data:res}=await this.$http.get('categories');
            if(res.meta.status!==200){
              return this.$AlertMessage.error('获取商品信息失败')
            }
            // this.$AlertMessage.success('获取商品信息成功');
            this.goodsList=res.data
            console.log('this.goodsList:',this.goodsList);
          },
          //级联选择器选中项变化，触发函数
          handleChange(){
            this.addForm.goods_cat_copy=this.addForm.goods_cat;
            console.log('this.addForm.goods_cat:',this.addForm.goods_cat);
            console.log('this.addForm.goods_cat_copy:',this.addForm.goods_cat_copy);
            //如果没选中最后一个节点，直接把数组清空，也就是用户只能选最后到三级菜单
            if(this.addForm.goods_cat.length!==3){
              // this.AlertMessage.error('请选中三级')
              alert('请选择三级分类下的商品');
              this.addForm.goods_cat=[];
            }


          },
          //点击左侧tab栏跳转
          beforeTabLeave(activeName,oldActiveName){
            // console.log('即将离开的页面activeName是:',oldActiveName);
            // console.log('即将前往的页面activeName是:',activeName);
            if(oldActiveName==0&&this.addForm.goods_cat.length!==3){
               this.$AlertMessage.info('请输入完商品基本信息在填写其他的信息');
               //这个函数要返回false，不允许切换
               return false
            }

          },
          //左侧tab栏被点击后触发的函数
          async tabClick(){
            console.log('现在激活的index页面:',this.activeIndex);
            //当你点击商品参数的时候，这个时候会发送请求，传回商品参数的数据
            if(this.activeIndex==1){
              const{data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
              {params:{sel:'many'}});
              if(res.meta.status!==200){
                return this.$AlertMessage.error('add页面返回参数数据失败')
              }
              this.$AlertMessage.success('add页面返回参数数据成功');
              //把manyTableList中的attr_vals变成数组

              console.log('res.data:',res.data);
              res.data.forEach(item=>{
                if(item.attr_vals!==''){
                  item.attr_vals=item.attr_vals.split(' ');

                }
              })
              this.manyTableList=res.data;
              console.log('this.manyTableList:',this.manyTableList);

            }
            //当点击商品属性的时候和1一样，发送请求
            else if(this.activeIndex==2){
              const{data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
              {params:{sel:'only'}});
              if(res.meta.status!==200){
                return this.$AlertMessage.error('add页面返回参数数据失败')
              }
              this.$AlertMessage.success('add页面返回参数数据成功');
              //把manyTableList中的attr_vals变成数组
              // res.data.forEach(item=>{
              //   if(item.attr_vals!==''){
              //     item.attr_vals=item.attr_vals.split(' ');

              //   }
              // })
              //静态属性的attr_vals: "是"，是只有一个字符的字符串，不是数组
              this.onlyTableList=res.data;
              console.log('this.onlyTableList:',this.onlyTableList);
            }



            //当点击商品图片的时候和1一样，发送请求
            else if(this.activeName==3){
              const{data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
              {params:{sel:'many'}});
              if(res.meta.status!==200){
                return this.$AlertMessage.error('add页面返回参数数据失败')
              }
              this.$AlertMessage.success('add页面返回参数数据成功');
              //把manyTableList中的attr_vals变成数组
              res.data.forEach(item=>{
                if(item.attr_vals!==''){
                  item.attr_vals=item.attr_vals.split(' ');

                }
              })
              this.manyTableList=res.data;
              console.log('this.manyTableList:',this.manyTableList);
            }

            //当点击商品内容的时候和1一样
            else if(this.activeName==4){
              const{data:res}=await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,
              {params:{sel:'many'}});
              if(res.meta.status!==200){
                return this.$AlertMessage.error('add页面返回参数数据失败')
              }
              this.$AlertMessage.success('add页面返回参数数据成功');
              //把manyTableList中的attr_vals变成数组
              res.data.forEach(item=>{
                if(item.attr_vals!==''){
                  item.attr_vals=item.attr_vals.split(' ');

                }
              })
              this.manyTableList=res.data;
              console.log('this.manyTableList:',this.manyTableList);

            }

          },
          //图片预览触发的函数
          handlePreview(file){
            this.previewPath=file.response.data.url;
            this.previewDialogVisible=true;
            console.log('handlePreview中的file:',file);
            console.log('handlePreview中的addForm值:',this.addForm);
            console.log('handlePreview中的previewPath值:',this.previewPath);


          },
          //触发移除事件的时候，立刻拿到图片信息,file是将要预览的图片信息
          handleRemove(file){
            console.log('handleRemove中的file:',file);
            //获取图骗的临时路径
            const filePath=file.response.data.tmp_path;
            //从pics数组中找到这个图片对应的索引值
            // findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
            // findIndex() 方法为数组中的每个元素都调用一次函数执行：
            const index=this.addForm.pics.findIndex(x =>x.pic==filePath);
            // 调用splice方法把图片信息对象从PICS数组中移除
            // 如果删除一个元素，则返回一个元素的数组。 如果未删除任何元素，则返回空数组。
            //这里找到index后，删除index对应的值
            this.addForm.pics.splice(index,1);

          },
          //图片上传成功调用的函数
          handleSuccess(response){
            console.log('服务器返回的数据:',response);
            //拼接得到一个图片信息对象
            const picInfo={pic:response.data.tmp_path};
            console.log('先拼接的picInfo:',picInfo);
            //将图片信息对象push到对象数组中
            this.addForm.pics.push(picInfo);
            console.log('push后的picInfo:',picInfo);
          },

          //商品内容选项中的添加商品按钮的触发函数
          async ADDGOODS(){
              this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                  return this.$AlertMessage.info('请填写必要的表单项！');
                }
                //添加逻辑
                this.addForm.goods_cat_copy=this.addForm.goods_cat_copy.join(',');
              
                //处理动态属性
                this.manyTableList.forEach(item=>{
                  //attr_Vals数组用join方法转字符串
                  //当attr_Vals不是数组的时候调用join会出现join is not a function
                  if(Array.isArray(item.attr_vals)==Array){
                    const newList={attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')};
                    this.addForm.attr.push(newList);
                  }
                  else if((Array.isArray(item.attr_vals)!==Array)){
                    const newList={attr_id:item.attr_id,attr_value:[]};
                    this.addForm.attr.push(newList);
                  } 
                })
                //处理静态属性
                this.onlyTableList.forEach(item=>{
                  const newList={attr_id:item.attr_id,attr_value:item.attr_vals};
                  this.addForm.attr.push(newList);
                })
                console.log(this.addForm);
                //发起请求
                const {data:res}=await this.$http.post('goods',this.addForm);
                if(res.meta.status!==201){
                  return this.$AlertMessage.error('添加商品失败')
                }
                else{
                  this.$AlertMessage.success('添加商品成功');
                  this.$router.push('/goods');

                }




              })

          }
        }

    }
</script>

<style lang="less" scoped>
  .el-steps{
    margin-top:30px;
    // font-size: 18px;
  }
  .el-tabs{
    margin-top:20px;

  }
  .el-checkBox{
    margin-right: 5px !important;
  }
  .el-upload__tip{
    font-size:20px;
    color: coral;
    font-weight:bold;
  }
  .addGoodsBtn{
    // right: 0;
    margin-top: 10px;
    float: right;
  }

</style>