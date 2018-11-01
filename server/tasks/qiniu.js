// const movies = [{
//     video:'http://vt1.doubanio.com/201810312110/47a18400c65c4022c66d7e416b9504ba/view/movie/M/402380333.mp4',
//     doubanId: '26290410',
//     poster:'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2537884431.jpg',
//     cover:'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2533173724.webp'
// }]

// const qiniu = require('qiniu')
// const nanoid = require('nanoid')
// const config = require('../config')

// const bucket = config.qiniu.bucket
// const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)

// const cfg = new qiniu.conf.Config()
// const client = new qiniu.rs.BucketManageer(mac, cfg)

// const uploadToQiniu = async (url, key) => {
//     return new Promise((resolve, reject) => {
//         client.fetch(url, bucket, key, (err, ret, info) => {
//             if (err) {
//                 reject(err)
//             }
//             else {
//                 if (info.statusCode === 200) {
//                     resolve({ key })
//                 } else {
//                     reject(info)
//                 }
//             }
//         })
//     })
// }

//     ; (async () => {
//         let movies = await Movie.find({
//             $or: [
//                 { videoKey: { $exists: false } },
//                 { videoKey: null },
//                 { videoKey: '' }
//             ]
//         }).exec()


//         for (let i = 0; i < movies.length; i++) {
//             let movie = movies[i]

//             if (movie.video && !movie.videoKey) {
//                 try {
//                     let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
//                     let coverData = await uploadToQiniu(movie.cover, nanoid() + '.png')
//                     let posterData = await uploadToQiniu(movie.poster, nanoid() + '.png')

//                     console.log(videoData)
//                     console.log(movie)

//                     if (videoData.key) {
//                         movie.videoKey = videoData.key
//                     }
//                     if (coverData.key) {
//                         movie.coverKey = coverData.key
//                     }
//                     if (posterData.key) {
//                         movie.posterKey = posterData.key
//                     }

//                     await movie.save()
//                 } catch (err) {
//                     console.log(err)
//                 }
//             }
//         }
//     })()


