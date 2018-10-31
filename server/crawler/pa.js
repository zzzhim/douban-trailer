const url = `https://movie.douban.com/tag/%E7%A7%91%E5%B9%BB?start=20&type=R`

const puppeteer = require('puppeteer')

const timer = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

!(async () => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
    });

    // console.log(browser);

    const page = await browser.newPage()

    await page.goto(url, { // 使用page.goto(url)打开url。
        waitUntil: 'networkidle2'
    })

    await timer(3000)

    const result = await page.evaluate(() => {
        
        var $ = window.$

        var items = $('.article .item')
        var links = []

        if (items.length >= 1) {
            items.each((index, item) => {
                let it = $(item)

                let rate = it.find('.pl2>a').text()
                let title = it.find('.pl').text()
                // let rate = Number(it.find('.rate').text())
                // nbg
                let poster = it.find('.nbg > img').attr('src').replace('s_ratio', 'l_ratio')
                links.push({
                    rate,
                    title,
                    poster
                    // rate
                })

            })
        }
        return links

    })

    browser.close() 
    // console.log(result);

})()