/**
 * 枚举类
 * Enum.IMAGE.name                => "图片"
 * Enum.getNameByKey('IMAGE')     => "图片"
 * Enum.getValueByKey('IMAGE')    => 10
 * Enum.getNameByValue(10)        => "图片"
 * Enum.getData()                 => [{key: "IMAGE", name: "图片", value: 10}]
 */
 class Enum {
	constructor(params) {
		const keyArr = []
		const valueArr = []
		
		if(!Array.isArray(params)) {
			throw new Error('params is not an array!')
		}
		
		params.map(el => {
			if(!el.key || !el.name) return
			
			// 保存key值组成的数组，方便A.getName(name)类型的调用
			keyArr.push(el.key)
			valueArr.push(el.value)
			// 根据key生成不同属性值，以便A.B.name类型的调用
			this[el.key] = el
			if(el.key !== el.value) this[el.value] = el
		})
		 // 保存源数组
		this.data = params
		this.keyArr = keyArr
		this.valueArr = valueArr
		
		// 防止被修改
		// Object.freeze(this)
	}
	
	// 根据key获取对象
	keyOf(key) {
		return this.data[this.keyArr.indexOf(key)]
	}
	
	// 根据value获取对象
	valueOf(val) {
		return this.data[this.valueArr.indexOf(val)]
	}
	
	// 根据key获取name
	getNameByKey(key) {
		const obj = this.keyOf(key)
		if(!obj) {
			throw new Error('No enum constant' + key)
		}
		return obj.name
	}
	
	// 根据value获取name
	getNameByValue(value) {
		const obj = valueOf(value)
		if(!obj) {
			throw new Error('No enum constant' + value)
		}
		return obj.name
	}
	
	// 根据key获取value
	getNameByValue(key) {
		const obj = valueOf(key)
		if(!obj) {
			throw new Error('No enum constant' + key)
		}
		return obj.key
	}
	
	// 返回源数组
	getData() {
		return this.data
	}
}

export default Enum