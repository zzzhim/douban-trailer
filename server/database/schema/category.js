const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie' // 指向关系,指向Movie
    }],

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

categorySchema.pre('save', function (next) {
    if (this.isNew) {
        // 如果是新数据就设置为当前系统时间
        this.meta.createdAt = this.meta.updatedAt = Date.now()
    } else {
        // 如果这条数据不是新数据就更新时间
        this.meta.updatedAt = Date.now()
    }
    next()
})

mongoose.model('Category', categorySchema)