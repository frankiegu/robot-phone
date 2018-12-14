export default nextModule => {
  // 1主流程 2辅助流程 3特殊流程
  return ['', '主流程', '辅助流程', '特殊流程', '指定流程节点'][nextModule]
}
