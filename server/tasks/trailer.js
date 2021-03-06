const cp = require('child_process')

const { resolve } = require('path')

; (async () => {
    const script = resolve(__dirname, '../crawler/video')
    const child = cp.fork(script, []) // 启动一个子进程运行script
    let invoked = false

    child.on('error', err => { // 如果程序出现错误  抛出错误
        if (invoked) return
        invoked = true

        console.log(err);
    })

    child.on('exit', code => { // 接收 process.exit(0)
        if (invoked) return
        invoked = true
        let err = code === 0 ? null : new Error('exit code' + code)

        console.log(err);
    })

    child.on('message', data => { // 接收  process.send({ result }) 发送过来的事件
        console.log(data);
    })
})()