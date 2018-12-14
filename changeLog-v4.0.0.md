## 修改原来的功能点

* 在@api/base.js 新增 updateStatu 方法,改变状态的公共方法。把ems里的接口去掉改变，调用此方法。
### 在ems/seller/Manager
```javascript
1. 增加搜索为空时为‘暂无数据’。
2. 在watch内'date.begin'和'date.end'中调用this.handleSearch()。
3. handleReset方法中把变量clt.password='123456',再把clt传给updateEmployee。
4. 在getClients方法中把if中的‘this.selectedId = this.dataList[0].id,
this.getClientDetail(this.selectedId)’提出来。解决搜索是右边版块实时更新
5. 修改了操作完成后更语义化的提示
```
### 在ems/seller/setting
1. 在vue-tree中把 ‘idsWithParent:false //获取只包含叶子节点（所有目录被过滤掉）’

### 修改运营商后台里的检索状态和搜索为空时提示正确的信息
1. 在omg/cityProxy  在components 添加dealModal.vue， 修改cityProxy.js和indicatorList解决指标管理里中的处理功能，

### 添加数字验证
1. 在assets/javascripts/asyncValidator/validators/src/numbert添加

### 有列表和列表详情时间查询时
1.添加监听
```javascript
 watch: {
    queryCreateTime: {
      handler(n){
        this.query.startTime = n[0] ? n[0].getTime() : ''
        this.query.endTime = n[1] ? n[1].getTime() : ''
        this.handlerSearch()
      },
      deep: true
    },
```
### 修改各个后台缺失的状态查询，以及搜索时有对应的列表详情