<template>
  <div>
    <div class="clear">
      <p class="fs-18">已选 {{city.selectedList.length}}</p>
      <div class="fr">
        <ButtonGroup>
          <Button :type="city.params.type === 0 ? 'primary' : 'default'"
                  @click="filterLevel(0)">所有城市</Button>
          <Button :type="city.params.type === 1 ? 'primary' : 'default'"
                  @click="filterLevel(1)">已分配</Button>
          <Button :type="city.params.type === 2 ? 'primary' : 'default'"
                  @click="filterLevel(2)">未分配</Button>
        </ButtonGroup>
      </div>
      <div style="overflow: hidden;">
        <p class="mt-5">
          <span>共{{city.allCount}}个城市</span>
          <span class="ml-15">已分配城市：{{city.selectedCount}}</span>
          <span class="ml-15">未分配城市：{{city.unselecCount}}</span>
        </p>
      </div>
    </div>
    <div class="mt-20">
      <city-level-selection v-model="city.selectedList"
                            ref="selection"
                            :level="entity.level"
                            @dataChange="changeSelection" />
    </div>
    <div class="mt-20 form-btns">
      <Button type="ghost"
              style="margin-right: 8px"
              @click="cancel">取消</Button>
      <Button type="primary"
              @click="submit">确定</Button>
    </div>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import { CityLevelSelection } from '@/components/packages/oms/cityLevel'
import systemConfigApi from '@/api/oms/systemConfig'

export default {
  mixins: [formMixin],
  components: {
    CityLevelSelection
  },
  data() {
    return {
      entity: {
        level: null
      },
      city: {
        params: {
          type: 0
        },
        selectedList: [],
        allCount: 0,
        selectedCount: 0,
        unselecCount: 0
      }
    }
  },
  methods: {
    changeSelection(data) {
      this.city.allCount = data.originalList.length
      this.city.selectedCount = data.selectedList.length
      this.city.unselecCount = this.city.allCount - this.city.selectedCount
    },
    filterLevel(type) {
      this.city.params.type = type
      switch (type) {
        case 0:
          this.$refs.selection.filterLevel()
          break
        case 1:
          this.$refs.selection.filterLevel(true)
          break
        case 2:
          this.$refs.selection.filterLevel(false)
          break
      }
    },
    submit() {
      let entity = {
        cityLevelList: this.city.selectedList.map(v => {
          return {
            cityId: v.cityId
          }
        }),
        level: this.entity.level
      }
      systemConfigApi.updateLevelCity(entity).then(data => {
        this.$emit('after-submit', data, entity)
      })
    }
  }
}
</script>
