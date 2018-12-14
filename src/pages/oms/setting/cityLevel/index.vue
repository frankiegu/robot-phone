<template>
  <div>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              城市等级列表
            </div>
            <div class="panel-body">
              <p class="nodata"
                 v-show="!table.list.length">暂无数据</p>
              <ul class="list"
                  v-show="table.list.length">
                <li v-for="item in table.list"
                    :key="item.level"
                    :class="{active: detail.entity.level === item.level}"
                    @click="showDetail(item)">
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">
                        {{item.level | value(['', '一线城市', '二线城市', '三线城市', '四线城市'])}}
                      </p>
                      <div class="list-item-info">
                        <span>城市 {{item.cityCount || 0}}</span>
                        <span class="ml-5">代理商 {{item.proxyCount || 0}}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <mod-detail @toggleFullScreen="toggleFullScreen"
                      :fullScreen="fullScreen"
                      :data="detail.entity"
                      @after-update="afterUpdate" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import { ProvinceSelect } from '@/components/packages/oms/select'
import systemConfigApi from '@/api/oms/systemConfig'
import ModDetail from './detail'

export default {
  mixins: [indexMixin],
  components: {
    ProvinceSelect,
    ModDetail
  },
  data() {
    return {
      params: {
        cityName: ''
      },
      fullScreen: false,
      cityLevelList: []
    }
  },
  methods: {
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      return systemConfigApi.listCityLevel(params).then(data => {
        this.setTableList(data)
      })
    },
    search() {
      this.table.selection = []
      this.list(1).then(() => {
        if (this.table.list.length) {
          this.showDetail(this.table.list[0])
        }
      })
    },
    changeSort(sort) {
      this.params.sort = sort
      this.list()
    },
    toggleFullScreen(val) {
      this.fullScreen = val
    },
    afterUpdate() {
      let index = this.table.list.indexOf(this.detail.entity)
      this.list().then(() => {
        if (index > -1) {
          let entity = this.table.list[index]
          if (entity) {
            this.showDetail(entity)
          }
        }
      })
    }
  }
}
</script>
