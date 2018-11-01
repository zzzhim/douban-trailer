const koa = require('koa')

const views = require('koa-views')

const { resolve } = require('path')
const connect = require('./database/init')

const app = new koa()

;(async () => {
    await connect()
})()

app.use(views(resolve(__dirname, './views'), {
    extension: 'pug' // 只要后缀是pug的文件  就会被识别为模板文件
}))

app.use(async (ctx, next) => {
    await ctx.render('index', {
        you: 'Luke',
        me: 'Scott'
    })
})
// 启动服务器
app.listen(3000, ctx => {
    console.log('启动成功');
})