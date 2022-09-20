<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- 点击首页跳转到/hello页面 -->
            <el-breadcrumb-item :to="{ path: '/hello' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //卡片视图区 -->
    <el-card>
        <div id="main" style="width: 600px;height:400px;float: left;"></div>
        <div id="right" class="right" style="width: 600px;height:400px;float: right;"></div>

    </el-card>
  </div>
</template>

<script>
    // import echarts from 'echarts'
    import * as echarts from 'echarts'
    export default {
        name:'Reports',
        data(){
            return{
                chartsData:{},
                //////
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                        boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                        type: 'value'
                        }
                    ]
                }

            }
        },
        created(){
            // this.getEchartsPic();

        },
        //DOM元素被渲染完毕了，初始化图片
        async mounted(){
            var myChart1 = echarts.init(document.getElementById('main'));
            var myChart2 = echarts.init(document.getElementById('right'));
            console.log('mychart1:',myChart1);
            console.log('mychart2:',myChart2);
            //准备数据
            // 指定图表的配置项和数据
            var option = {
                title: {
                text: 'ECharts 入门示例'
                },
                tooltip: {},
                legend: {
                data: ['销量']
                },
                xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                },
                yAxis: {},
                series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart1.setOption(option);
            /////////////////////////////////////////////////////////////////////
            const{data:res}=await this.$http.get('reports/type/1');
            if(res.meta.status!==200){
                return this.$AlertMessage.error('返回图表信息失败')
            }
            this.$AlertMessage.success('返回图表信息成功');
            this.chartsData=res.data;
            console.log('返回的chartsData:',this.chartsData);
            //把this.options和返回的数据进行合并
            const mergeData={...this.options,...this.chartsData};
            console.log('mergeData:',mergeData);
            // 使用刚指定的配置项和数据显示图表。
            myChart2.setOption(mergeData);
        },
        methods:{
            // async getEchartsPic(){
            //     const{data:res}=await this.$http.get('reports/type/1');
            //     if(res.meta.status!==200){
            //         return this.$AlertMessage.error('返回图表信息失败')
            //     }
            //     this.$AlertMessage.success('返回图表信息成功');
            //     this.chartsData=res.data;
            //     console.log('返回的chartsData:',this.chartsData);

            // }

        }

    }
</script>

<style lang="less" scoped>

</style>