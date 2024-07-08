const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

 /*  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8080', // 后端服务的地址和端口
        changeOrigin: true,
        pathRewrite: {
          '^/': '' // 代理所有路径
        }
      }
    }
  } */
}
)
