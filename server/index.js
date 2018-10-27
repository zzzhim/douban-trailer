const koa = require('koa')

const app = new koa()

const { normal } = require('./tpl/index')

app.use(async (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = normal
})

// 启动服务器
app.listen(3000, ctx => {
    console.log('启动成功');
})