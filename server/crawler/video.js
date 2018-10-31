const base = `https://movie.douban.com/subject/`
const videoBase = `https://movie.douban.com/trailer/238333`
const doubanId = '26290410'

const puppeteer = require('puppeteer')

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    console.log('Start visit the target page');

    // 这行代码启动puppeteer，我们实际上启动了一个Chrome实例，并且和我们声明的browser变量绑定起来。因为我们使用了await关键字，该函数会暂停直到Promise完全被解析。也就是说成功创建Chrome实例或则报错。
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'], // 传递给 chrome 实例的其他参数，比如你可以使用”–ash-host-window-bounds=1024x768”
        dumpio: false // 是否将浏览器进程stdout和stderr导入到process.stdout和process.stderr中。默认为false
    })
    
    const page = await browser.newPage() // 我们在浏览器中创建一个新的页面，通过使用await关键字来等待页面成功创建。
    await page.goto(base + doubanId, { // 使用page.goto(url)打开url。
        waitUntil: 'networkidle2' // waitUntil:满足什么条件认为页面跳转完成，默认是load事件触发时 networkidle2:只有2个网络连接时触发（至少500毫秒后）
    })

    // 等待3000毫秒再往下进行
    await sleep(3000)

    const result = await page.evaluate(() => { // 为了获取它们，我们首选需要使用page.evaluate()函数。该函数可以让我们使用内置的DOM选择器
        var $ = window.$

        var it = $('.related-pic-video')

        if (it && it.length > 0) {
            var link = it.attr('href')
            var cover = $('.nbgnbg').find('img').attr('src')

            return{ 
                link,
                cover
            }
        }

        return {}
    })

    let video

    if (result.link) {
        await page.goto(result.link, {
            waitUntil: 'networkidle2'
        })
        await sleep(2000)

        video = await page.evaluate(() => {
            var $ = window.$

            var it = $('source')

            if (it && it.length > 0) {
                return it.attr('src') 
            }
            return ''
        })
    }
    
    const data = {
        video,
        doubanId,
        cover: result.cover
    }

    browser.close() // 将浏览器关闭。

    process.send({ data }) // 发送一个对象  消息可以通过 [process.on('message')] 事件接收。
    process.exit(0) // 以结束状态码code指示Node.js同步终止进程
})()

