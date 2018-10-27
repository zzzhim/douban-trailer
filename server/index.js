const koa = require('koa')

const app = new koa()

app.use(async (ctx, next) => {
    ctx.body = '电影首页'
})

// 启动服务器
app.listen(3000, ctx => {
    console.log('启动成功');
})