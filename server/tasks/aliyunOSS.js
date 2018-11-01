const movies = [{ // 测试
    video: 'http://vt1.doubanio.com/201810312110/47a18400c65c4022c66d7e416b9504ba/view/movie/M/402380333.mp4',
    doubanId: '26290410',
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2537884431.jpg',
    cover: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2533173724.webp'
}]

let OSS = require('ali-oss')
const fs = require('fs')
const request = require('request')

const bucket = require('../config/index')

const client = new OSS(bucket)

;(async() => {
    async function put(fileName) {
        try {
            // 上传文件到阿里云OSS
            await client.put(fileName, __dirname + `/imgs/${fileName}`);
            console.log(`上传成功: ${fileName}`)

        } catch (e) {
            console.log('上传失败')
            console.log(e)
        }
    }

    movies.forEach(item => {
        for (let val in item) {
            if (!(item[val] == item.doubanId)) {
                let url = item[val]
                let arr = url.split('/')
                let imgName = arr[arr.length - 1] // 获取文件名

                let ends = request.get(url) // 获取

                ends.pipe(fs.createWriteStream(__dirname + `/imgs/${imgName}`)) // 写入

                ends.on('end', () => { // 写入后
                    put(imgName).then(val => {
                        // 当文件上传到阿里云OSS后 删除文件
                        fs.unlink(__dirname + `/imgs/${imgName}`, function (err) {
                            if (err){
                                console.log(err);
                            }
                            console.log('文件删除成功');
                        })
                    })
                })
            }
        }
    })
})()
