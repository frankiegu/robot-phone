import {
  addEventListener,
  removeEventListener
} from 'vma-vue-assist/dist/static/js/utils'
const clickoutsideContext = '@@clickoutsideContext'

export default {
  /*
   @param el 指令所绑定的元素
   @param binding {Object} 
   @param vnode vue编译生成的虚拟节点
   */
  bind(el, binding, vnode) {
    const documentHandler = function (e) {
      if (!vnode.context || el.contains(e.target)) {
        return false
      }
      if (binding.expression) {
        let contextMethod = vnode.context[el[clickoutsideContext].methodName]
        if (typeof contextMethod === 'function') {
          contextMethod(e)
        } else {
          throw new Error(`binding.expression[${binding.expression}] is not a function`)
        }
      } else {
        let bindingMethod = el[clickoutsideContext].bindingFn
        if (typeof bindingMethod === 'function') {
          bindingMethod(e)
        } else {
          throw new Error(`binding.value[${binding.value}] is not a function`)
        }
      }
    }
    el[clickoutsideContext] = {
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    }
    setTimeout(() => {
      addEventListener(document, 'click', documentHandler)
    }, 0)
  },
  update(el, binding) {
    el[clickoutsideContext].methodName = binding.expression
    el[clickoutsideContext].bindingFn = binding.value
  },
  unbind(el) {
    removeEventListener(document, 'click', el[clickoutsideContext].documentHandler)
  }
}
