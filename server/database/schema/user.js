const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const Mixed = Schema.Types.Mixed

const SALT_WORK_FACTOR = 10
const MAX_LOING_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000

const UserSchema = new Schema({
    username: {
        unique: true, // 设置数据为唯一
        required: true, // 必选参数
        type: String, // 类型为字符串
    },
    email: {
        unique: true, 
        required: true, // 必选参数
        type: String,
    },
    password: {
        unique: true,
        required: true, // 必选参数
        type: String,
    },
    loginAttempts: {
        type: Number,
        required: true, // 必选参数
        default: 0 // 默认值为0
    },
    lockUntil: Number,
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

UserSchema.pre('save', function (next) {
    let user = this

    if (!user.isModified('password')){
        return next()
    }

    // 对密码进行加盐加密
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err)
        }
        // 第二个参数为盐
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error)
            }

            this.password = hash

            next()
        })
    })

    next()
})
// 虚拟字段
UserSchema.virtual('isLocked').get(function () {
    // 判断是否继续锁定
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

UserSchema.methods = { // 实例方法
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            // 对密码进行比较
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) {
                    resolve(isMatch)
                }else {
                    reject(err)
                }
            })
        })
    },
    // 来判断当前用户是否超过了登录次数
    incLoginAttepts: function(user) {
        return new Promise((resolve, reject) => {
            // 判断锁定是否超过有效期
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        // 超过之后重新计算
                        loginAttempts: 1
                    },
                    $unset: {
                        // 超过之后重新计算
                        lockUntil: 1
                    }
                }, (err) => {
                    if (!err) {
                        resolve(true)
                    }else {
                        reject(err)
                    }
                })
            }else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                }

                if (this.loginAttempts + 1 >= MAX_LOING_ATTEMPTS && !this.isLocked) {
                    updates.$set = {
                        // 锁定时间
                        lockUntil: Date.now() + LOCK_TIME
                    }
                }

                this.update(updates, err => {
                    if (!err) {
                        resolve(true)
                    }else {
                        reject(err)
                    }
                })
            }
        })
    }
}

mongoose.model('User', UserSchema)