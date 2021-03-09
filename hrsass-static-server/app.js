const Koa = require('koa')
const serve = require('koa-static')
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
const proxy = require('koa2-proxy-middleware')

const app = new Koa()
// 注册跨域代理中间件
app.use(
  proxy({
    targets: {
      // 代理哪个地址 代理以 /prod-api为开头的地址
      // (.*) means anything
      '/prod-api/(.*)': {
        target: 'http://ihrm-java.itheima.net/api', //后端服务器地址，将以prod-api为开头的内容代理到该地址
        changeOrigin: true,
        pathRewrite: {
          '/prod-api': ''
        }
      }
    }
  })
)
// 这句话 的意思是除接口之外所有的请求都发送给了 index.html
app.use(
  historyApiFallback({
    // 应该先使用 处理访问的中间件
    whiteList: ['/prod-api'] // prod-api 代理跨域的时候 表示不要帮我处理 /prod-api 由自己来处理
    // 这里的whiteList是 白名单的意思
  })
)
app.use(serve(__dirname + '/public')) // 将public下的代码静态化 再使用静态化服务
app.listen(3333, () => {
  console.log('server is started')
})
