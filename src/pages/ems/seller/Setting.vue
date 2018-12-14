<template>
  <Modal v-model="visible"
    title="权限设置"
    :loading="loading"
    :closable="false"
    :mask-closable="false"
    @on-cancel="handleClose"
    @on-ok="handleConfirm">
    <p class="text-c">已选择 {{ checkedIds.length }} 个权限</p>
      <div v-if="idsReady" class="tree">
        <!-- <Tree show-checkbox
          empty-text="暂无菜单数据"
          :data="menuList">
        </Tree> -->
        <vue-tree id="vueTree" v-model="checkedIds" :tree-data="menuList" :options="options"></vue-tree>
      </div>
  </Modal>
</template>

<script>
import API from '@/api/index'

const API_EMPLOYEE = API.ems.employee

export default {
  name: 'employeeEdit',
  props: {
    close: Function,
    confirm: Function
  },
  data() {
    return {
      rowMenuList: [],
      menuList: [],
      checkedIds: [],
      // ids: [],
      eId: '',
      visible: true,
      loading: true,
      idsReady: false,
      options: {
        depthOpen: 1,
        openIcon: 'ivu-icon ivu-icon-arrow-right-b',
        closeIcon: 'ivu-icon ivu-icon-arrow-down-b',
        checkedIcon: '',
        uncheckedIcon: '',
        halfCheckedIcon: '',
        // idsWithParent:false //获取只包含叶子节点（所有目录被过滤掉）
      }
    }
  },
  methods: {
    init(id) {
      this.eId = id
      this.visible = true
      API_EMPLOYEE.getMenuList(id)
        .then(res => {
          this.rowMenuList = res
          this.menuList = this.formatTree(res)
          this.idsReady = true;
        })
    },
    formatTree(arr) {
      const data = []
      const ids = []
      arr.forEach(node => {
        node.label = node.title
        if (node.parentId === 0) {
          node.children = []
          data.push(node)
          // 加入首页
          if (node.isExist && node.title === '首页') {
            ids.push(node.id)
          }
        } else {
          // 加入二级菜单
          if (node.isExist) {
            ids.push(node.id)
          }
          data.forEach((p, i) => {
            p.label = p.title
            if (p.id === node.parentId) {
              if (data[i].children) {
                data[i].children.push(node)
              } else {
                data[i].children = [node]
              }
            }
          })
        }
      })
      this.checkedIds = ids
      return data
    },

    handleClose() {
      this.close()
      this.rowMenuList = []
      this.menuList = []
      this.checkedIds = []
      this.idsReady = false
    },
    handleConfirm() {
      this.loading = false
      if (this.checkedIds.length === 0) {
        this.$Message.warning('销售人员的权限不能为0')
        return
      }
      API_EMPLOYEE.allotEmployee({admin_id: this.eId, menus: this.checkedIds.join(',')})
        .then(res => {
          this.confirm(this.eId)
          this.idsReady = false
          this.loading = true;
        }).catch(() => {
          this.loading = true;
        })
    }
  }
}
</script>

