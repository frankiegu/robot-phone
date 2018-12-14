import {
  exportXlsx
} from '@/util'

import {
  arrToMap
} from '@/util'

export default {
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10
      },
      page: {
        totalNum: 0
      },
      table: {
        columns: [],
        list: [],
        selection: []
      },
      form: {
        show: false,
        entity: {
          id: ''
        }
      },
      detail: {
        show: false,
        entity: {
          id: ''
        }
      },
      type: '', // 白名单类型
      exportNumList: [], // 导出表格规定数据列表
      exportSize: 20000 // 导出，默认数据为30000
    }
  },
  computed: {
    tableListMap() {
      return arrToMap(this.table.list)
    },
    tableSelectionMap() {
      return arrToMap(this.table.selection)
    }
  },
  mounted() {
    // 初始化服务端数据完成后再执行ready
    new Promise(new Proxy(this.initData, this)).then(() => {
      this.init()
    })
  },
  methods: {
    /**
         * 初始化服务端数据
         * @param {any} resolve Promise.resolve
         * @param {any} reject Promise.reject
         */
    initData(resolve, reject) {
      resolve()
    },
    /**
         * 初始化构造
         */
    init() {
      this.initValidate()
      this.initReady()
      this.search()
    },
    /**
         * 初始化表单验证
         */
    initValidate() {},
    /**
         * 初始化完成ready
         */
    initReady() {},
    /**
         * 提供service
         */
    getApi() {
      throw new Error('请重写getApi提供api')
    },
    /**
         * 查询前执行，可更改查看参数
         * @param {any} params
         */
    beforeList(params) {},
    /**
         * 查询成功后执行，可更改list
         * @param {any} list
         */
    afterList(list) {},
    /**
         * 删除成功后执行
         */
    afterDel() {
      this.success('删除成功')
      this.list()
    },
    /**
         * 更新数据成功后执行
         * @param {any} data
         * @param {any} label
         */
    afterUpdateData(data, label) {
      this.list()
    },
    getListApi(params) {
      return this.getApi().list(params)
    },
    /**
         * 查询列表数据
         * @param {any} pageNum
         * @param {any} pageSize
         */
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      if (this.beforeList(params) !== false) {
        return this.getListApi(params).then(page => {
          // 总数据不为0，当前页数据为0，往前跳一页
          if (page.totalNum > 0 && page.dataList.length == 0) {
            // 异步问题，要return
            return this.list(this.params.pageNum - 1, pageSize)
          } else {
            this.dealTotalNum(page.totalNum)

            this.afterList(page.dataList)
            this.setTableList(page.dataList)
            this.setPagination(page)
          }
        })
      } else {
        return Promise.resolve()
      }
    },
    /**
         * 重载列表的当前页
         * @param {any} index ,数组下标
         */
    listAndDetail(index) {
      this.list().then(() => {
        if (this.page.totalNum === 0) {
          // 总数据为0

          this.detail.entity = {
            id: ''
          }
        } else if (typeof index === 'number') {
          // 选择特定位置
          if (this.table.list[index]) {
            this.showDetail(this.table.list[index].id)
          }
        } else {
          if (this.detail.entity.id) {
            // 判断之前选中的是否还存在于该页面
            if (this.table.list.some(v => v.id === this.detail.entity.id)) {
              this.showDetail(this.detail.entity.id)
            } else {
              this.showDetail(this.table.list[0].id)
            }
          }
        }
      })
    },
    setPageNumSize(pageNum, pageSize) {
      if (!isNaN(+pageNum)) {
        this.params.pageNum = +pageNum
      }
      if (!isNaN(+pageSize)) {
        this.params.pageSize = +pageSize
      }
    },
    /**
         * 设置列表数据
         * @param {any} list
         */
    setTableList(list) {
      if (this.table.selection.length && this.$refs['table']) {
        let $table = this.$refs['table']
        let section = this.table.selection
        let map = {}
        list.forEach(v => {
          map[v.id] = v
        })
        // 支持翻页后选中状态保持
        for (let i = 0, l = section.length; i < l; i++) {
          let v = section[i]
          if (map[v.id]) {
            section.splice(i, 1, map[v.id])
            map[v.id]._checked = true
          }
        }
      }
      if (this.type) {
        list.forEach((item) => {
          if (item.type !== this.type && item.type) {
            item._disabled = true
          }
        })
      }
      this.table.list = list
    },
    filterDelete(type) {
      this.type = type
    },
    /**
         * 设置分页
         * @param {any} page
         */
    setPagination(page) {
      this.page.totalNum = page.totalNum
    },
    /**
         * 查询列表第一页
         */
    search() {
      this.table.selection = []
      this.list(1)
    },
    delaySearch() {
      setTimeout(() => {
        this.search()
      }, 0)
    },
    /**
         * 显示新增/编辑
         * @param {any} entity
         */
    showForm(entityOrId) {
      if (!entityOrId || typeof entityOrId === 'object') {
        this.form.entity = entityOrId || {}
        this.form.show = true
      } else {
        this.getApi().get(entityOrId).then(data => {
          this.showForm(data)
        })
      }
    },
    /**
         * 新增/编辑成功后执行
         * @param {any} entity
         */
    afterSubmitForm(data, entity) {
      this.form.show = false
      this.list()
      this.success(`${entity.id ? '编辑' : '新增'}成功`)
    },
    /**
         * 取消新增/编辑
         */
    cancelForm() {
      this.form.show = false
    },
    /**
         * 显示详情
         * @param {any} entity
         */
    showDetail(entityOrId) {
      if (typeof entityOrId !== 'object') {
        this.getApi().get(entityOrId).then(data => {
          this.detail.entity = data || {
            id: ''
          }
          this.detail.show = true
        })
      } else {
        this.detail.entity = entityOrId || {
          id: ''
        }
        this.detail.show = true
      }
    },
    /**
         * 显示删除
         * @param {any} id
         * @param {string} [content='删除操作不可恢复，确认继续删除?']
         */
    showDel(id, content = '删除操作不可恢复，确认继续删除?') {
      this.$Modal.confirm({
        title: '确认删除',
        content,
        onOk: (action, instance) => {
          this.getApi().del(id).then(() => {
            this.afterDel()
          })
        }
      })
    },
    /**
         * 更新数据
         * @param {any} data
         * @param {any} label
         */
    updateData(data, label) {
      this.getApi().update(data).then(() => {
        this.success(`${label}成功`)
        this.afterUpdateData(data, label)
      })
    },
    /**
         * 处理table的选中事件
         * @param {*} data
         */
    handleTableSelection(data) {
      let selection = this.table.selection
      let list = this.table.list
      let dataMap = arrToMap(data)

      list.forEach(v => {
        let selectionItem = this.tableSelectionMap[v.id]
        if (!dataMap[v.id]) {
          if (selectionItem) {
            selection.splice(selection.indexOf(selectionItem), 1)
          }
        } else {
          if (!selectionItem) {
            selection.push(v)
          }
        }
      })
    },
    /**
         * 获取表格选中列的id数组
         * @returns
         */
    getTableSelection() {
      return this.table.selection.map(v => v.id)
    },
    /**
         * 批量删除
         */
    showBatchDel() {
      let ids = this.getTableSelection()
      if (ids.length) {
        this.showDel(ids, `确定删除已选择的[${ids.length}]条数据?`)
      } else {
        this.info('请先选择数据')
      }
    },
    /**
         * 导入后执行函数
         */
    afterImport() {
      this.list()
    },
    /**
         * 导出
         */
    exportFile() {
      let headers = []
      let keys = []
      let columnValueMap = {}
      this.table.columns.forEach(v => {
        if (v.key) {
          headers.push(v.title || '')
          keys.push(v.key)
          if (v.value && typeof v.value === 'function') {
            columnValueMap[v.key] = v.value
          }
        }
      })
      let list = this.table.list.map(v => keys.map(k => {
        if (columnValueMap[k]) {
          return columnValueMap[k](v)
        } else {
          return v[k]
        }
      }))
      exportXlsx(headers, keys, list)
    },
    dealTotalNum(totalNum) {
      this.exportNumList = []
      if (totalNum < this.exportSize) {
        if (totalNum === 0 || totalNum === null) {
          this.exportNumList = []
        } else {
          this.exportNumList = [`0~~${totalNum}`]
        }
      } else {
        // 倍数
        let multiple = parseInt(totalNum / this.exportSize)

        // 余数
        let remainder = totalNum % this.exportSize
        for (let i = 0; i < multiple; i++) {
          this.exportNumList.push(`${i * this.exportSize}~~${(i + 1) * this.exportSize}`)
        }
        this.exportNumList.push(`${multiple * this.exportSize}~~${multiple * this.exportSize + remainder}`)
      }
    }
  }
}
