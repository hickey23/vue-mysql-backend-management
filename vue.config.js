// vue.config.js
//////////////////////////////////////////////////////////////
module.exports = {
    devServer: {
      overlay: {
        warnings: false, //不显示警告
        errors: false,	//不显示错误
      }
    },
    lintOnSave:false, //关闭eslint检查
    //开启代理服务器
    //第一种方式
    // devServer:{
    //   proxy:'http://127.0.0.1:5000'//也可以在server.js中设置请求头，允许全部访问
    // },
    devServer:{
      host: '0.0.0.0', //0.0.0.0改成自己的IP地址
      port: '8081',
      proxy:{
        '/liujiong':{
          target:'http://127.0.0.1:5000',//也可以在server.js中设置请求头，允许全部访问
          pathRewrite:{'^/liujiong':''},
          ws:true,//用于支持websocket，默认true
          changeOrigin:true,//默认true
        }
      },
      
    }
  }
  