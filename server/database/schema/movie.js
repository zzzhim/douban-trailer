const mongoose = require('mongoose')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const MovieSchema = new Schema({
    doubanId: String,
    rate: Number,
    title: String,
    summary: String,
    video: String,
    poster: String,
    cover: String,

    // 图床文件id
    videoKey: String,
    posterKey: String,
    coverKey: String,

    rawTitle: String,
    movieTypes: [String],
    pubdate: Mixed,
    year: Number,
    
    tags: [String],

    meta: {
        createdAt: {
            type: Date,
            dafault: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }
})

MovieSchema.pre('save', next => {
    if(this.isNew) {
        // 如果是新数据就设置为当前系统时间
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    }else {
        // 如果这条数据不是新数据就更新时间
        this.meta.updatedAt = Date.now()
    }
    next()
})

mongoose.model('Movie', MovieSchema)