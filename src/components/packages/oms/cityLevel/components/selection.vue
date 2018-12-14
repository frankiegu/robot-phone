<template>
  <div class="city-level-selection">
    <div class="city-level-letter-list">
      <p class="nodata text-c"
         v-show="data.letterList.length === 0">空</p>
      <a href="javascript: void(0);"
         v-show="data.letterList.length"
         v-for="v in data.letterList"
         :key="v"
         @click="goLetter(v)">{{v}}</a>
    </div>
    <div class="city-level-container"
         ref="container">
      <p class="nodata"
         v-show="data.list.length === 0">暂无数据</p>
      <div class="city-level-item"
           v-show="data.list.length"
           v-for="v in data.list"
           :key="v.letter"
           :id="'city-level-item-letter-' + v.letter">
        <div class="city-level-item-letter">{{v.letter}}</div>
        <div class="city-level-item-list">
          <Badge v-for="c in v.list"
                 :key="c.cityId"
                 :count="c.level"
                 class="city-level-item-city"
                 :class="'level-' + c.level">
            <a href="javascript: void(0)"
               :class="{
                // 当前已选城市
                'level-primary': computedSelectedList.indexOf(c) > -1,
                // 已被选择且不是当前已选的城市
                'level-gray': computedSelectedList.indexOf(c) === -1 && c.level,
                // 从当前已选中移除的城市
                'level-warning': computedSelectedList.indexOf(c) === -1 && c.level === level
                }"
               @click="selectCity(c)">{{c.cityName}}</a>
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemConfigApi from '@/api/oms/systemConfig'
import $ from 'jquery'

export default {
  model: {
    prop: 'selectedList',
    event: 'change'
  },
  props: {
    selectedList: {
      type: Array,
      default() {
        return []
      }
    },
    level: {
      type: Number
    }
  },
  data() {
    return {
      originalList: [],
      data: {
        list: [],
        letterList: []
      }
    }
  },
  computed: {
    computedSelectedList: {
      get() {
        return this.selectedList
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    getClass(v) {
      if (v.level) {
        if (this.computedSelectedList.indexOf(v) > -1) {
          return 'level-primary'
        } else {
          return 'level-gray'
        }
      }
      return ''
    },
    initData() {
      systemConfigApi.listLevelCity().then(data => {
        this.originalList = data
        this.handleData(data)
      })
    },
    handleData(data) {
      let letters = []
      let letterMap = {}
      let emptyList = []
      let selectedList = []
      // 按字母分组
      data.forEach(v => {
        if (v.quanPin) {
          let letter = v.quanPin.charAt(0).toUpperCase()
          let arr
          if (letterMap[letter]) {
            arr = letterMap[letter]
          } else {
            letters.push(letter)
            arr = letterMap[letter] = []
          }
          arr.push(v)
        } else {
          // 拼音不存在时放到emptyList
          emptyList.push(v)
        }
        if (v.level === this.level) {
          selectedList.push(v)
        }
      })

      // 字母排序
      letters.sort()
      // 城市排序
      let cityList = letters.map(letter => {
        return {
          letter,
          list: letterMap[letter].sort((v1, v2) => v1.quanPin - v2.quanPin)
        }
      })
      if (emptyList.length) {
        letters.push('其他')
        cityList.push({
          letter: '其他',
          list: emptyList
        })
      }

      this.computedSelectedList = selectedList
      this.data.letterList = letters
      this.data.list = cityList
      this.emitDataChange({
        originalList: data,
        list: cityList,
        selectedList: selectedList,
        letterList: letters
      })
    },
    goLetter(v) {
      let id = 'city-level-item-letter-' + v
      let $target = $('#' + id)
      let $container = $(this.$refs.container)
      $container.animate({
        scrollTop: $container.scrollTop() + $target.position().top
      }, 300)
    },
    selectCity(v) {
      let index = this.computedSelectedList.indexOf(v)
      if (index === -1) {
        if (!v.level) {
          this.computedSelectedList = this.computedSelectedList.concat([v])
        }
      } else {
        let list = this.computedSelectedList.slice(0)
        list.splice(index, 1)
        this.computedSelectedList = list
      }
    },
    emitDataChange(data) {
      this.$emit('dataChange', data)
    },
    filterLevel(isDis) {
      if (typeof isDis === 'boolean') {
        this.handleData(this.originalList.filter(v => {
          // 已分配
          if (isDis) {
            return !!v.level
          }
          // 未分配
          else {
            return !v.level
          }
        }))
      } else {
        this.handleData(this.originalList)
      }
    }
  }
}
</script>
