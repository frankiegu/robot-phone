export default class FlowItem {
  static instances = []
  static moduleMap = {}

  module = 0
  list = null
  title = '流程'
  constructor({
    module,
    title
  }) {
    this.module = module
    this.list = []
    this.title = title

    FlowItem.addItem(this)
  }

  static clear() {
    FlowItem.instances = []
    FlowItem.moduleMap = {}
  }
  static addItem(instance) {
    FlowItem.instances.push(instance)
    FlowItem.moduleMap[instance.module] = instance
  }
  static getListFirstItem() {
    for (let flow of this.instances) {
      if (flow.list.length) {
        return flow.list[0]
      }
    }
    return null
  }
  static clearData() {
    for (let flow of FlowItem.instances) {
      flow.list = []
    }
  }
  static addData(data) {
    FlowItem.clearData()
    data.forEach(v => {
      if (FlowItem.moduleMap[v.module]) {
        FlowItem.moduleMap[v.module].list.push(v)
      }
    })
  }
}
