<template>
    <div class="div">
      <!-- //展示路由组件 -->
      <router-view></router-view>
    </div>
</template>

<script>
    import Login from './components/Login';
    import Home from './components/Home'
    export default {
      name: 'App',
      components:{Login,Home},
    }
</script>

<style>
    .div{
      height: 100%;
      margin: 0;
      padding: 0;
    }
</style>
