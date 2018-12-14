<template>
  <Tabs v-model="tabName"
        style="margin: 0 15px;"
        type="card"
        v-if="initial">
    <TabPane label="肯定跳转"
             name="sure">
      <jump :allModuleList="moduleList"
            :data="node.sure.entity"
            showLabel
            ref="sureJump" />
    </TabPane>
    <TabPane label="否定跳转"
             name="deny">
      <jump :allModuleList="moduleList"
            :data="node.deny.entity"
            showLabel
            ref="denyJump" />
    </TabPane>
    <!-- 五期未完成屏蔽
    <TabPane label="未识别跳转"
             name="unidentified">
      <jump :allModuleList="moduleList"
            :data="node.unidentified.entity"
            :showKeyWord="false"
            ref="unidentifiedJump" />
    </TabPane>
    -->
    <TabPane label="分支跳转"
             name="branch">
      <Button type="primary"
              @click="addBranch">添加分支跳转</Button>
      <div v-show="node.branch.list.length"
           style="max-height: 480px; overflow: auto;">
        <Row class="mt20"
             v-for="(v, i) in node.branch.list"
             :key="i">
          <i-col :span="20">
            <jump :allModuleList="moduleList"
                  :data="v"
                  :showEnable="false"
                  ref="branchJump" />
          </i-col>
          <i-col :span="4"
                 class="text-c">
            <Button type="warning"
                    @click="removeBranch(i)">移除</Button>
          </i-col>
          <div style="margin: 0 10%; border-bottom: 1px dashed #ccc; clear: left;"></div>
        </Row>
      </div>
      <p class="nodata mt20"
         v-show="!node.branch.list.length">暂无分支跳转</p>
    </TabPane>
  </Tabs>
</template>

<script>
import { formMixin } from '@/mixins'
import Jump from './components/jump'
import jumpEntity from './components/jump/src/entity'
import whisperingNewNodeApi from '@/api/common/whisperingNewNodeApi'

export default {
  mixins: [formMixin],
  components: {
    Jump
  },
  data() {
    return {
      tabName: 'sure',
      initial: false,
      node: {
        sure: {
          entity: this.getJumpEntity(1)
        },
        deny: {
          entity: this.getJumpEntity(2)
        },
        unidentified: {
          entity: this.getJumpEntity(3)
        },
        branch: {
          list: []
        }
      },
      moduleList: []
    }
  },
  methods: {
    getJumpEntity(nextType) {
      return jumpEntity({
        isValid: 0,
        nextType: nextType,
        nodeId: this.data.id,
        whisperingId: this.data.whisperingId,
        isValid: 1
      })
    },
    afterEntity(entity) {
      if (this.initial === false && entity.whisperingId) {
        this.listModule().then(() => {
          this.initial = true

          setTimeout(() => {
            // 分支分组
            if (entity.nextNodeList && entity.nextNodeList.length) {
              entity.nextNodeList.forEach(v => {
                switch (v.nextType) {
                  case 1:
                    this.node.sure.entity = v
                    break
                  case 2:
                    this.node.deny.entity = v
                    break
                  case 3:
                    this.node.unidentified.entity = v
                    break
                  case 4:
                    this.node.branch.list.push(v)
                }
              })
            }
          }, 0)
        })
      }
    },
    listModule() {
      // 模块中只包含 1-主流程 2-辅助流程 3-特殊流程 4-问答
      // 需要添加 4-当前流程节点
      return Promise.all([
        whisperingNewNodeApi.listModule({
          whisperingId: this.data.whisperingId
        }),
        whisperingNewNodeApi.list({
          id: this.data.parentId,
          pageNum: 1,
          pageSize: 999999
        })
      ]).then(([moduleList, nodeList]) => {
        // 五期未完成屏蔽
        // 跳转特殊流程去除不可用流程
        // this.moduleList = moduleList.filter(v => [1, 2, 3].includes(v.module))
        this.moduleList = moduleList.filter(v => [1, 2].includes(v.module) || (3 === v.module && v.type === 1))
          .concat([{
            id: 0,
            module: 4,
            name: '下一个节点'
          }].concat(nodeList.map(v => {
            return {
              id: v.id,
              module: 4,
              name: v.name
            }
          })))
      })
    },
    addBranch() {
      let len = this.node.branch.list.push(this.getJumpEntity(4))
      setTimeout(() => {
        this.$refs.branchJump[len - 1].$el.scrollIntoViewIfNeeded()
      }, 0)
    },
    removeBranch(index) {
      this.node.branch.list = this.$refs.branchJump.filter((v, i) => i !== index).map(v => v.getEntity())
    },
    validate() {
      return new Promise((resolve, reject) => {
        let promises = [
          this.$refs.sureJump.validate('sure'),
          this.$refs.denyJump.validate('deny')
          // 五期未完成屏蔽
          // this.$refs.unidentifiedJump.validate('unidentified')
        ]
        if (this.node.branch.list.length) {
          promises = promises.concat(this.$refs.branchJump.map(v => v.validate('branch')))
        }
        Promise.all(
          promises
        ).then(data => {
          resolve(data.filter(v => !!v))
        }, ({ key, name }) => {
          if (name && this.tabName !== name) {
            this.tabName = name
          }
          if (name === 'branch') {
            this.$refs.branchJump[index].$el.scrollIntoViewIfNeeded()
          }
          reject(key, name)
        })
      })
    }
  }
}
</script>
