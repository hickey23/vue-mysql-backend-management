<template>
  <div>
    <h2>hello world</h2>
    <el-button type="info" @click="exit()">退出</el-button>
  </div>
  
</template>

<script>
    export default {
        name:'Home',
        methods:{
          exit(){
            //清空token
            window.sessionStorage.clear();
            //跳转到login页面
            this.$router.push('/login');
            alert('返回登录界面！');
          }
        }
    }
</script>

<style>

</style>