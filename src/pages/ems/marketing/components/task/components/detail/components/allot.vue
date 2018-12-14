<template>
  <div>
    <div class="block">
      <div class="block-body">
        <!-- <p>共选择 {{clientList.length}} 位客户
          <a href="javascript: void(0);"
             class="primary"
             @click="exportExcel">导出到Excel</a>
        </p> -->
        <p class="title">是否向销售人员展示完整的电话号码？</p>
        <div class="plate mt-10 fleX">
          <div class="plate-item"
               :class="{active: allot.isHide === 0}"
               @click="() => allot.isHide = 0">
            <p>如：13855556666</p>
          </div>
          <div class="plate-item"
               :class="{active: allot.isHide === 1}"
               @click="() => allot.isHide = 1">
            <p>如：138****6666</p>
          </div>
        </div>
        <div class="fleX">
          <p class="width">完整显示</p>
          <p class="width">脱敏显示</p>
        </div>
        <div class="fleX">
          <div>推送人员:</div>
          <Select filterable  v-model="allot.employeeId" clearable style="width:250px">
        <Option v-for="v in table.list" :key="v.id" :value="v.id">{{v.employeeName}}-{{v.mobile }}</Option>
    </Select>
        </div>
      </div>
    </div>
    <!-- <div class="text-c">
      <Button type="ghost"
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
    </div> -->
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import clientApi from '@/api/ems/client'
import employeeApi from '@/api/ems/employee'
import { exportXlsx } from '@/util'

export default {
  mixins: [indexMixin],
  props: {
    clientList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      params: {
        pageSize: 999999,
        nameMobile: ''
      },
      allot: {
        isHide: 1,
        employeeId: ''
      }
    }
  },
  methods: {
    getApi() {
      return employeeApi
    },
    exportExcel() {
      if (this.clientList.length) {
        exportXlsx(['号码', '姓名'], ['mobile', 'userName'], this.clientList, '未分配客户导出表')
      }
    },
    cancel() {
      this.$emit('on-cancel')
    },
    submit() {
      let data = Object.assign({}, this.allot)
      if (!data.employeeId) {
        return this.warning('请选择销售人员')
      }
      data.calls = this.clientList.map(v => v.id)
      clientApi.allotEmployee(data).then(() => {
        this.success('分配成功')
        this.$emit('after-submit')
      })
    }
  }
}
</script>
