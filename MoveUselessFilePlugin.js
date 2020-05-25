const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

class MoveUselessFilePlugin {
    constructor ({
        root = './src',
        target = './deprecated',
        logInfo = false,
        exclude = [] 
    }) {
        this.ops = {
            root,
            target,
            logInfo,
            exclude: (Array.isArray(exclude) ? exclude : [exclude])
                .filter(ex => ex instanceof RegExp || typeof ex === 'string')
        }
    }

    apply (compiler) {
        // const done = stats => {
        // 	const json = stats.toJson({
        // 		chunks: false,
        // 		assets: false,
        // 		source: false,
        // 		exclude: [/node_modules/]
        // 	})
        // 	fs.writeFileSync('./demo.json', JSON.stringify(
        // 		// [
        // 		// 	...json.modules
        // 		// 		.filter(item => item.id.indexOf('/node_modules/') === -1)
        // 		// 		.map(item => item.id)
        // 		// ],
        // 		json,
        // 		null,
        // 		2
        // 	))
        // }

        // if (compiler.hooks) {
        //   compiler.hooks.done.tapAsync('webpack-bundle-analyzer', done);
        // } else {
        //   compiler.plugin('done', done);
        // }
        const callback = async (compilation, done) => {
            const d = new Date().valueOf()
            this.getUnusedFiles(compilation)
                .then(() => {
                    this.ops.logInfo && console.log('[useless-file-plugin]: take times:', (new Date().valueOf() - d) / 1000 + 'ms')
                })
            done && done()
        }

        if (compiler.hooks) {
            compiler.hooks.afterEmit.tapAsync('MoveUselessFilePlugin', callback)
        } else {
            compiler.plugin('after-emit', callback)
        }
    }

    async getUnusedFiles (compilation) {
        const { root, target, exclude, logInfo } = this.ops
        const pattern = root + '/**/*'

        const depFiles = this.getFileDependencies(compilation)
        const allFiles = await this.getAllFiles(pattern)
        let unUsed = allFiles
                .filter(item =>
                    !~depFiles.indexOf(item) &&
                    !exclude.some(ex => ex instanceof RegExp ? ex.test(item) : ~item.indexOf(ex))
                )

        // 存储移除的代码所在的目录，若移除代码后目录空了则删除空目录
        const {	push, getList } = mkList()
        return Promise.all(
            unUsed.map(file => {
                const filePath = lowerCase(path.resolve(file))
                const originDir = lowerCase(path.resolve(root))
                const targetDir = lowerCase(path.resolve(target))
                push(getDir(file))
                return fs.move(filePath, filePath.replace(originDir, targetDir))
            })
        ).then(res => {
            getList().forEach(dirPath => {
                isEmptyDir(dirPath) && fs.rmdirSync(dirPath)
            })
            logInfo && console.log('[useless-file-plugin]: 已将未用到的文件已移动到 ' + target + ' 目录', unUsed)
        })
    }

    getFileDependencies (compilation) {
        const fileDependencies = [...compilation.fileDependencies]
                .filter(file => !~file.indexOf('node_modules'))

        // console.log(fileDependencies)
        // fs.writeFileSync('./demo.json', JSON.stringify(
        // 		fileDependencies,
        // 		null,
        // 		2
        // ))
        return fileDependencies
    }

    getAllFiles (pattern) {
        return new Promise((resolve, reject) => {
      glob(pattern, {
        nodir: true
      }, (err, files) => {
        if (err) {
          throw err
        }
        const out = files.map(item => path.resolve(item))
        resolve(out)
      })
    })
    }
}

function lowerCase (str) {
    return str.slice(0, 1).toLowerCase() + str.slice(1)
}

function getDir (str) {
    return path.resolve(str, '../')
}
function isEmptyDir (str) {
    try {
        const stat = fs.statSync(str)
        return stat.isDirectory() && fs.readdirSync(str).length === 0
    } catch (error) {
        return false
    }
}

// 去重的数组
function mkList () {
    const cache = {}
    const arr = []
    return {
        push (item) {
            if (!cache[item]) {
                arr.unshift(item)
                cache[item] = true
            }
        },
        getList () {
            return arr
        }
    }
}

module.exports = MoveUselessFilePlugin