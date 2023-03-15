/**
 * 输入内容验证（表单内容验证）
 */

/**
 * 判断输入内容是否为空
 */
 export const isEmpty = (str) => {
	return str.trim() == ''
}

/**
 * 匹配手机号mobile
 */
 export const isMobile = (str) => {
	const reg = /^(1[3456789]\d{9})$/
	return reg.test(str)
}

/**
 * 匹配Email
 */
 export const isEmail = (str) => {
	if(str == null || str == '') return false
	let result = str.match(/^\w+([-+.]\w+)@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
	if(result == null) return false
	return true
}

/**
 * 判断是否为数值类型
 */
 export const isNumber = (str) => {
	if(isDouble(str) || isInteger(str)) return true
	return false
}

/**
 * 匹配double货float
 */
export const isDouble = (str) => {
	if(str == null || str == '') return false
	let result = str.match(/^[-\+]?\d+(\.\d+)?$/)
	if(result == null) return false
	return true
}

/**
 * 匹配integer
 */
export const isInteger = (str) => {
	if(str == null || str == '') return false
	let result = str.match(/^[-\+]?\d+$/)
	if(result == null) return false
	return true
}