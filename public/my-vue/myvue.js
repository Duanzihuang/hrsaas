const em = new EventEmitter()

/**
 * 模板编译器
 * 编译模板、解析替换DOM、订阅数据改变事件、执行更新DOM操作
 * @param {*} el 节点
 * @param {*} vm Vue实例
 */
function Compiler (el, vm) {
  this.vm = vm
  this.compile(document.querySelector(el))
}

/**
 * 编译元素节点：处理 v-if、v-text、v-html 等指令
 * @param {}} node
 */
Compiler.prototype.compileElement = function (node) {
  //   console.log(`元素`, node)
  // console.log(node.attributes)
  Array.from(node.attributes).forEach(attr => {
    // console.log(attr)
    const { name, value: propKey } = attr

    if (!name.startsWith('v-')) {
      return
    }

    // 以 v- 开头的才解析
    // v-html、v-text、v-if、v-model
    if (name === 'v-model') {
      // 将 input 的 value 设置为 v-model 绑定的数据
      node.value = this.vm[propKey]

      em.$on(propKey, () => {
        node.value = this.vm[propKey]
      })

      // 监听原生的oninput事件，视图发生改变之后，更改模型数据
      node.oninput = () => {
        this.vm[propKey] = node.value
      }
    } else if (name.startsWith('v-on:')) {
      const eventType = name.split(':')[1]

      /**
      node[`on${eventType}`] = () => {
        this.vm[propKey]()
      }
      */
      node.addEventListener(eventType, () => {
        this.vm[propKey]()
      })
    }
  })
}

Compiler.prototype.compileText = function (node) {
  //   console.log(`文本`, node)
  const content = node.textContent
  //   console.log(content)
  const reg = /\{\{(.+)\}\}/
  const matched = reg.exec(content)
  if (matched) {
    const propKey = matched[1].trim()

    //将文本的节点的内容设置为所绑的数据值
    node.textContent = this.vm[propKey]

    // 绑定 message 的就监听 message 事件
    // 绑定 foo 的就监听 foo 事件
    em.$on(propKey, () => {
      node.textContent = this.vm[propKey]
    })
  }
}

Compiler.prototype.compile = function (el) {
  //   console.log(el.childNodes)
  el.childNodes.forEach(node => {
    // console.log(node.nodeType, node)
    if (node.nodeType === 1) {
      // 如果是元素节点，则编译处理元素
      this.compileElement(node)
      // 如果是元素节点，则递归处理元素节点
      this.compile(node)
    } else {
      // 如果是文本节点，则编译处理文本
      this.compileText(node)
    }
  })
}

/**
 * options
 *  el
 *  data
 *  methods
 * @param {*} options
 */
function Vue (options) {
  //1、数据劫持，当数据发生变化的时候，发布数据改变的通知
  const { data } = options

  // 遍历 data 数据，将其中的成员通过数据劫持的方式添加到 Vue 实例上
  for (const key in data) {
    Object.defineProperty(this, key, {
      get () {
        // console.log(`${key} 被访问了~`)
        return data[key]
      },
      set (newValue) {
        if (newValue !== data[key]) {
          // console.log(`${key} 被修改了~`)
          data[key] = newValue

          // 当数据发生改变，通过事件发布器对外发布一个事件
          em.$emit(key)
        }
      }
    })
  }

  // Object.assign 把第2个参数之后的所有对象成员合并到第1个参数对象
  Object.assign(this, options.methods)

  //2、模板编译，订阅数据的改变，数据改变，更新 DOM
  // 将指定的模板和数据进行编译
  new Compiler(options.el, this)
}

/**
 * 事件触发器
 * 数据和DOM之间的桥梁
 */
function EventEmitter () {
  // 用户保存，事件类型及其回调函数
  // {a: [回调函数1,回调函数2],b:[回调函数1]}
  this.subs = {}
}

EventEmitter.prototype.$on = function (eventType, callback) {
  this.subs[eventType] = this.subs[eventType] || []
  this.subs[eventType].push(callback)
}

//...args是剩余参数
EventEmitter.prototype.$emit = function (eventType, ...args) {
  const subs = this.subs[eventType]
  if (subs) {
    subs.forEach(callback => {
      // ...args展开运算符
      callback(...args)
    })
  }
}
