export default class FlowItem {
  static instances = []
  static getTypeMap = {}
  static nodeTypeMap = {}

  getType = 0
  nodeType = 0
  list = null
  title = '流程'
  constructor({
    getType,
    nodeType,
    title
  }) {
    this.getType = getType
    this.nodeType = nodeType
    this.list = []
    this.title = title

    FlowItem.addItem(this)
  }

  static clear() {
    FlowItem.instances = []
    FlowItem.getTypeMap = {}
    FlowItem.nodeTypeMap = {}
  }
  static addItem(instance) {
    FlowItem.instances.push(instance)
    FlowItem.getTypeMap[instance.getType] = instance
    FlowItem.nodeTypeMap[instance.nodeType] = instance
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
      if (FlowItem.getTypeMap[v.moduleType]) {
        FlowItem.getTypeMap[v.moduleType].list.push(v)
      }
    })
  }
}
