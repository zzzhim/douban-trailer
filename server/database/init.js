const mongoose = require('mongoose')
const db = 'mongodb://localhost/douban-trailer'

const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

module.exports = {
    initSchemas() {
        // 同步的执行./schema下的所有js文件
        glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
        // glob(__dirname + '/schema' + '**/*.js', (err, files) => {
        //     files.forEach(val => {
        //         require(val)
        //     })
        // })
    },
    connect() {
        let maxConnectTimes = 0

        return new Promise((resolve, reject) => {
            if (process.env.NODE_ENV !== 'production') {
                mongoose.set('debug', true)
            }

            mongoose.connect(db)

            mongoose.connection.on('disconnected', () => {
                if (maxConnectTimes < 5) {
                    mongoose.connect(db)
                    maxConnectTimes++
                } else {
                    throw new Error('数据库挂了,快去修吧少年')
                }
            })

            mongoose.connection.on('error', err => {
                if (maxConnectTimes < 5) {
                    mongoose.connect(db)
                    maxConnectTimes++
                } else {
                    throw new Error('数据库挂了,快去修吧少年')
                }
            })

            mongoose.connection.once('open', () => {
                // const Dog = mongoose.model('Dog', { name: String })
                // const doga = new Dog({
                //     name: '阿尔法'
                // })

                // doga.save().then(() => {
                //     console.log('wang');
                // })

                resolve()
                console.log('mongoDB 数据库连接成功')
            })
        })
    }
}
