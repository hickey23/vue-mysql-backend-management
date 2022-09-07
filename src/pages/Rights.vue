<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 点击首页跳转到/hello页面 -->
            <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            <el-breadcrumb-item>权限详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 当el-table元素中注入data对象数组后，
        在el-table-column中用prop属性来对应对象中的键名即可填入数据，
        用label属性来定义表格的列名。可以使用width属性来定义列宽。 -->

        <!-- 这里后端返回的数据是一个对象数组：[{},{},{}] -->
        <el-table :data="rightsList"  border stripe>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column> 
            <el-table-column label="路径" prop="path"></el-table-column> 
            <el-table-column label="权限等级" prop="level">
                <template v-slot="scope">
                    <el-tag v-if="scope.row.level=='0'">一级权限</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level=='1'">二级权限</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.level=='2'">三级权限</el-tag>
                </template>
            </el-table-column> 
        </el-table>
    </el-card>

  </div>
</template>

<script>
    export default {
        name:'Rights',
        data(){
            return{
                rightsList:[]
            }
        },
        //在渲染DOM的时候调用getRightList函数
        created(){
            this.getRightsList();
        },
        methods:{
            async getRightsList(){
                const{data:res}=await this.$http.get('rights/list');
                if(res.meta.status!==200){
                    this.$AlertMessage.error('获取权限列表失败')
                }
                else{
                    console.log('res@@@@@@',res);
                    this.rightsList=res.data;
                }

            }
        }

    }
</script>

<style>

</style>