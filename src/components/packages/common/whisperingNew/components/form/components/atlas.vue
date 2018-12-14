<template>
  <div :id="id"
       style="height: 100%;"></div>
</template>

<script>
import { detailMixin } from '@/mixins'
import Treant from '@/assets/javascripts/vendors/treant'
import uuid from 'uuid'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import getNextModuleLabel from './whisperingNode/src/nextModule'
import getNextTypeLabel from './whisperingNode/src/nextType'

export default {
  mixins: [detailMixin],
  data() {
    return {
      chart: null,
      id: `atlas-${uuid()}`
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    afterEntity(entity) {
      this.getAll(entity)
    },
    getAll(entity) {
      if (entity && entity.id) {
        whisperingNewApi.getAll(entity.id).then(data => {
          let mainList = []
          let asideList = []
          let specialList = []
          let questionList = []
          data.forEach(v => {
            switch (v.module) {
              case 1:
                mainList.push(v)
                break
              case 2:
                asideList.push(v)
                break
              case 3:
                specialList.push(v)
                break
              case 4:
                questionList.push(v)
                break
            }
          })
          this.generalAtlas({
            mainList,
            asideList,
            specialList,
            questionList
          })
        })
      }
    },
    generalAtlas({
      mainList,
      asideList,
      specialList,
      questionList
    }) {
      let config = {
        chart: {
          container: `#${this.id}`,
          rootOrientation: 'WEST', // NORTH || EAST || WEST || SOUTH
          hideRootNode: true,
          levelSeparation: 20,
          siblingSeparation: 40,
          subTeeSeparation: 30,
          connectors: {
            type: 'bCurve'
          },
          node: {
            HTMLclass: 'nodeExample1',
            collapsable: true
          }
        },
        nodeStructure: {
          children: [{
            text: {
              name: '主流程'
            },
            children: this.transferModuleList(mainList)
          }, {
            text: {
              name: '辅助流程'
            },
            children: this.transferModuleList(asideList)
          }, {
            text: {
              name: '特殊流程'
            },
            children: this.transferModuleList(specialList)
          }, {
            text: {
              name: '问答'
            },
            children: this.transferModuleList(questionList)
          }]
        }
      }
      
      this.chart = new Treant(config, function (tree) {
        tree.positionTree()
      })
    },
    transferModuleList(list) {
      return list.map(v => {
        let children = []
        if (v.nodeList && v.nodeList.length) {
          children = this.transferChildNodeList(v.nodeList)
        }
        return {
          text: this.transferModule(v),
          children
        }
      })
    },
    transferChildNodeList(list) {
      return list.map(v => {
        let children = []
        if (v.nextNodeList && v.nextNodeList.length) {
          children = this.transferNextNodeList(v.nextNodeList)
        }
        return {
          text: this.transferChildNode(v),
          children,
          stackChildren: true
        }
      })
    },
    transferNextNodeList(list) {
      return list.map(v => {
        return {
          text: this.transferNextNode(v)
        }
      })
    },
    transferModule(data) {
      return {
        name: data.name,
        title: '话术模板'
      }
    },
    transferChildNode(data) {
      return {
        name: data.name,
        title: '话术节点'
      }
    },
    transferNextNode(data) {
      return {
        name: `${getNextModuleLabel(data.nextModule)}/${data.nextNodeName}`,
        title: '跳转分支'
      }
    }
  }
}
</script>
