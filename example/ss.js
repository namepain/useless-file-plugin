const fs = require('fs')
const path = require('path')

const filePath = path.resolve('D:\\code\\TTT______\\xl__test\\src\\GXB\\ss\\ss\\ss\\tt.js')
const originDir = path.resolve('./src')
const targetDir = path.resolve('./target')

console.log(
	originDir,
	'\n',
	targetDir,
	'\n',
	lowerCase(filePath).replace(originDir, targetDir)
)

function lowerCase (str) {
	return str.slice(0, 1).toLowerCase() + str.slice(1)
}

console.log(isEmptyDir(getDir(filePath)))

function getDir (str) {
	return path.resolve(str, '../')
}
function isEmptyDir (str) {
	const stat = fs.statSync(str)
	return stat.isDirectory() && fs.readdirSync(str).length === 0
}

console.log(getDir(filePath), isEmptyDir('./src/GXB/ss/ss/ss'))