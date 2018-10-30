const koa = require('koa')

// 引入ejs模板引擎
const ejs = require('ejs')
// 引入pug模板引擎
const pug = require('pug')

const app = new koa()

const { htmlTpl, ejsTpl, pugTpl } = require('./tpl')

app.use(async (ctx, next) => {
    ctx.type = 'text/html;charset=utf-8'
    ctx.body = pug.render(pugTpl, { // 向ejsTpl传入变量
        you: 'Luke',
        me: 'Scott'
    })
})


// 启动服务器
app.listen(3000, ctx => {
    console.log('启动成功');
})