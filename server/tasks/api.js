// http://api.douban.com/v2/movie/subject/1764796

const rp = require('request-promise-native')

async function fetchMovie (item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`

    const res = await rp(url)

    return res
}

;(async () => {
    let movies =[
        {
            doubanId: 30156486,
            title: '传说 第二季',
            rate: 7.1,
            poster:'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2528937907.jpg'
        },
        {
            doubanId: 30164695,
            title: 'Ingress',
            rate: 7.6,
            poster:'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2527411392.jpg' 
        }
    ]

    movies.map(async movie => {
        let movieData = await fetchMovie(movie)

        try {
            movieData = JSON.parse(movieData)
            console.log(movieData.tags)
            console.log(movieData.summary)
        } catch (err) {
            console.log(err)
        }
    })
})()



