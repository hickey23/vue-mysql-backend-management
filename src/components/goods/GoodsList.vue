<template>
  <div>
    <!-- //面包屑导航区 -->
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
                    <el-input placeholder="请输入内容" v-model= "queryInfo.query" :clearable="true" @clear="getGoodsList()">
                      <el-button slot="append" icon="el-icon-search" @click="getGoodsList()"></el-button>
                    </el-input>
            </el-col>
            <el-col :span="4" class="addGoodsListBtn">
                <el-button type="primary" @click="goAddPage()">添加分类</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column label="索引" type="index" width="90"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="120"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="商品创建时间" prop="add_time">
                        <!-- {{computedTime}} -->
                        <span v-for="(item,index) in this.GoodsList.add_time">
                            {{item}}
                        </span>
                        <!-- {{Com}} -->
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template v-slot="scope">
                        <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="small">修改</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteGoods(scope.row)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

            </el-table>
        </el-row>
        <!-- 页面尾部 -->
        <!-- 这个page-sizes是可选择的跳转多少页数。一次跳转，1页，2页，5页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            
            :page-sizes="[1,2,3,4,5,6,7,8,9,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            background>
        </el-pagination>  
        
        <!-- //删除商品信息对话框 -->
        

    </el-card>
  </div>
</template>

<script>
    export default {
        name:'GoodsList',
        data(){
            return{
                //商品列表数据
                goodsList:[],
                ////查询数据
                queryInfo:{
                    query:'',
                    pagenum:1,
                    pagesize:10,
                },
                total:0,
                goods:[],
                //定义一个添加时间列表
                addTimeList:[],
                GoodsList:[],
                //控制删除对话框布尔值
                deleteDialogVisible:false,

            }
        },
        created(){
            this.getGoodsList();
        },
        methods:{
            async getGoodsList(){
                const{data:res}=await this.$http.get('goods',{params:this.queryInfo});
                if(res.meta.status!==200){
                    return this.$AlertMessage.error('获取商品信息失败')
                }
                else{
                    this.$AlertMessage.success('获取商品信息成功');
                    this.goodsList=res.data.goods;
                    this.GoodsList=res.data.goods;
                    this.total=res.data.total;
                    this.goods=res.data.goods;
                    // this.addTimeList=res.data.goods.add_time;
                    //往数组后面加元素

                    //每次进来之前清空一下数组
                    this.addTimeList=[];
                    for(var i=0;i<this.goodsList.length;i++){
                        
                        this.addTimeList.push(this.goodsList[i].add_time);
                        // console.log(i);
                    }
                    console.log("商品列表中的this.addTimeList:",this.addTimeList);
                    // console.log("商品列表中的this.goodsList:",this.goodsList,this.goodsList.length);
                    //////////////////////////////////////
                    //////////////////////////////////////
                    for(var j=0;j<this.addTimeList.length;j++){
                        this.$dayjs(Number);
                        // console.log("j",j);
                        // console.log(this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss'));
                        // return this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss');
                        // var arr=[];
                        // arr.push(this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss'));
                        this.GoodsList=this.goodsList;
                        this.GoodsList[j].add_time=this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss');
                    }
                    console.log('this.GoodsList:',this.GoodsList);
                    // console.log('arr:',arr);
                }
            },
            //页面pagesize发生变化出发的函数
            handleSizeChange(newSize){
                console.log('newSize:',newSize);
                this.queryInfo.pagesize=newSize;
                this.getGoodsList();

            },
            //控制页面数改变的函数-
            handleCurrentChange(newPage){
                console.log('newPage:',newPage);
                this.queryInfo.pagenum=newPage;
                this.getGoodsList();

            },
            //展示删除对话框函数
            showDeleteDialog(){
                this.deleteDialogVisible=!this.deleteDialogVisible;
            },
            
            //删除商品信息
            async deleteGoods(scope_row){
                const confirmResult=await this.$confirm('此操作将永久删除该商品信息,是否继续','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning',
                }).catch(error=>{
                    return error
                })
                if(confirmResult!=='confirm'){
                    this.$AlertMessage.error('删除商品信息失败')
                }
                else if(confirmResult=='confirm'){
                    const {data:res}=await this.$http.delete(`goods/${scope_row.goods_id}`)
                    if(res.meta.status!==200){
                        return this.$AlertMessage.info('服务器返回数据失败，删除失败')
                    }
                    this.$AlertMessage.success('服务器返回数据成功,删除商品信息成功');
                    this.deleteDialogVisible=false;
                    this.getGoodsList();

                }
            },
            //点击添加按钮跳转到添加商品页面
            goAddPage(){
                //router.push跳转
                // 想要导航到不同的 URL，可以使用 router.push 方法。
                // 这个方法会向 history 栈添加一个新的记录，所以，当用户点击浏览器后退按钮时，会回到之前的 URL。
                this.$router.push('/goods/add');
            }
        },
        computed:{
            computedTime(){
                // this.$dayjs().format(String);
                for(var j=0;j<this.addTimeList.length;j++){
                    this.$dayjs(Number);
                    // console.log("j",j);
                    console.log(this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss'));
                    // return this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss');
                    var arr=[];
                    arr.push(this.$dayjs(this.addTimeList[j]).format('YYYY-MM-DD-HH:mm:ss'));
                    this.GoodsList=this.goodsList;
                    this.GoodsList[j].add_time=arr[j];
                    return this.GoodsList[j].add_time
                    

                }      
            },
            // Com(){
            //     for(var a=0;a<10;a++){
            //         console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
            //         console.log('a:',a);

            //     } 
            // },
        }

    }
</script>

<style lang="less" scoped>
    .addGoodsListBtn{
        margin-left:30px;
    }
</style>