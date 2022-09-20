<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 点击首页跳转到/hello页面 -->
            <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入查询的订单">
            <el-button icon="el-icon-search" slot="append"></el-button>
          </el-input>      
        </el-col>
      </el-row>
      <!-- //订单列表表格 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.pay_status"
              @change="switchStatusChange(scope.row.pay_status)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button  type="primary" size="mini" class="btn" @click="showLocationDialog">
              <i class="el-icon-edit"></i>
            </el-button>
            <!-- 定位按钮 -->
            <el-button  size="mini" type="success" class="btn" @click="showProgressDialog">
              <i class="el-icon-location"></i>
            </el-button>
             
          </template>
        </el-table-column>
      </el-table>

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
        :total="total"
        >
      </el-pagination>
      <!-- ////////////////////////////////////////////////// -->
      <!-- //修改对话框 -->
      <el-dialog
        title="编辑地址"
        :visible.sync="showDialogVisible"
        width="50%"
        @close="closeDialog"
        >
          <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
            <!-- prop是验证规则属性,指定具体的校验规则 -->
            <el-form-item label="省市区/县" prop="address_provice">
              <el-cascader
                    v-model="addressForm.address_province"
                    :options="cityData"
                    :props="{ expandTrigger: 'hover'}"
                    >
              </el-cascader>  
            </el-form-item>
            <el-form-item label="详细地址" prop="address_detail">
              <el-input v-model="addressForm.address_detail"></el-input>
            </el-form-item>

          </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="showDialogVisible= false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- //////////////////////////////////////// -->
      <el-dialog
        title="物流进度"
        :visible.sync="ProgressVisible"
        width="50%"
        >
        <!-- <span>这是一段信息</span> -->
        <!-- //timeline时间线 -->
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in logisticsInformation"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ProgressVisible = false">取 消</el-button>
          <el-button type="primary" @click="ProgressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
    import cityData from './citydata.js'
    export default {
        name:'OrderList',
        data(){
          return {
            queryInfo:{
              query:'',
              pagenum:1,
              pagesize:10,
            },
            //
            total:0,
            //用来接收服务器返回的订单数据
            orderList:[],
            //展示对话框布尔值
            showDialogVisible:false,
            //
            addressForm:{
              address_provice:[],
              address_detail:'',
              
            },
            addressFormRules:{
              address_province:[
                {required:true,message:'请选择省市区县',trigger:'blur'}
              ],
              address_detail:[
              {required:true,message:'请选择详细地区',trigger:'blur'}

              ]
            },
            cityData:cityData,
            ProgressVisible:false,
            //物流信息数组
            logisticsInformation:[],
            //
            reverse:false,
          }
        },
        created(){
          // vue.js中created方法是一个生命周期钩子函数，一个vue实例被生成后会调用这个函数
          // created 钩子函数在实例被创建之后被调用
          this.getOrderList();
        },
        methods: {
          async getOrderList(){
            const {data:res}=await this.$http.get('orders',{params:this.queryInfo});
            if(res.meta.status!==200){
              return this.$AlertMessage.error('获取订单列表失败');
            }
            this.total=res.data.total;
            this.orderList=res.data.goods;
            console.log('OrderList中返回的res:',res);
            for(var i=0;i<this.orderList.length;i++){
              if(this.orderList[i].pay_status="0"){
                this.orderList[i].pay_status=false
              }
              else if(this.orderList[i].pay_status="1"){
                this.orderList[i].pay_status=true
              }
              
            }
            console.log(this.orderList);
          },
          //开关状态改变触发的函数
          switchStatusChange(paystatus){
            // console.log('@@@@@@@@@@@@@@@@@@@@@@@',paystatus)
            paystatus=!paystatus;
            console.log('this.scope_row.pay_status:',paystatus);
            
          },
          //pagesize发生变化会触发函数
          handleSizeChange(newsize){
            this.queryInfo.pagesize=newsize;
            this.getOrderList();


          },
          //当前页码发生变化出发函数
          handleCurrentChange(newpage){
            this.queryInfo.pagenum=newpage;
            this.getOrderList();


          },
          //show dialog
          showLocationDialog(){
            this.showDialogVisible=true;

          },
          closeDialog(){
            this.$refs.addressFormRef.resetFields()
          },
          //查询物流对话框
          async showProgressDialog(){
            console.log(111);
            const{data:res}=await this.$http.get('/kuaidi/1106975712662');
            if(res.meta.status!==200){
              return this.$AlertMessage.error('获取物流信息失败')
            }
            
            this.logisticsInformation=res.data;
            console.log(this.logisticsInformation);
            this.ProgressVisible=true;
          }
        },

    }
</script>

<style lang="less" scoped>
  .btn{
    width: 55px;
  }
  .el-cascader{
    width:100%;
  }


</style>