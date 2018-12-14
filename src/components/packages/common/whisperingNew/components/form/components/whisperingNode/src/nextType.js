export default nextType => {
  // 1肯定 2否定 3未识别 4分支 5问题管理跳转 
  return ['', '肯定跳转', '否定跳转', '未识别跳转', '分支跳转', '问题管理跳转'][nextType]
}
