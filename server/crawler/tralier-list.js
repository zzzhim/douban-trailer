const url = `https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=`

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
    await page.goto(url, { // 使用page.goto(url)打开url。
        waitUntil: 'networkidle2' // waitUntil:满足什么条件认为页面跳转完成，默认是load事件触发时 networkidle2:只有2个网络连接时触发（至少500毫秒后）
    })

    // 等待3000毫秒再往下进行
    await sleep(3000)

    await page.waitForSelector('.more')  // 会等待 class 为 more 的节点出现。

    for (let i = 0; i < 1; i++) {
        await sleep(3000)

        await page.click('.more') // 点击按钮一次
    }

    const result = await page.evaluate(() => { // 为了获取它们，我们首选需要使用page.evaluate()函数。该函数可以让我们使用内置的DOM选择器
        var $ = window.$
        var items = $('.list-wp a')
        var links = []

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)
                let doubanId = it.find('div').data('id')
                let title = it.find('.title').text()
                let rate = Number(it.find('.rate').text())
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')

                links.push({
                    doubanId,
                    title,
                    rate,
                    poster
                })
            })
        }

        return links
    })

    browser.close() // 将浏览器关闭。

    // console.log(result);

    process.send({ result }) // 发送一个对象  消息可以通过 [process.on('message')] 事件接收。
    process.exit(0) // 以结束状态码code指示Node.js同步终止进程
})()

