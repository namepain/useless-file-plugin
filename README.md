## 一个移动无用文件到指定目录的 webpack 插件

```javascript
const MoveUselessFilePlugin = require('useless-file-plugin')

plugins: [
	new MoveUselessFilePlugin({
			root?: './src',						// 源码目录
			target?: './deprecated',   // 无用文件移动到的目标目录
			logInfo?: false,           // 打印移动的文件的信息
			exclude?: []               // 排除的文件， Array<Reg|String> | Reg | String
	})
]
```