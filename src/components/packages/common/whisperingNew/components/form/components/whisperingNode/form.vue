<template>
  <div style="max-height:30rem;overflow:auto;">
    <Row>
    <!-- 主流程/辅助流程 -->
    <template v-if="[1, 2].includes(entity.module)">
     <div class="fleX">
        <div style="width:50%;">
         <info  :data="entity"
              ref="info" />
      </div>
      
       <div style="width:50%;">
          <branch :data="entity"
                ref="branch" />
       </div>
     </div>
    </template>
    <template v-else-if="[3].includes(entity.module)">
      <div>
         <info :data="entity"
              showLabel
              ref="info" />
      </div>
    </template>
  </Row>
  </div>
</template>

<script>
import { formMixin } from '@/mixins'
import entity from './src/entity'
import Info from './components/form/info'
import Branch from './components/form/branch'
import whisperingNewNodeApi from '@/api/common/whisperingNewNodeApi'

export default {
  mixins: [formMixin],
  components: {
    Info,
    Branch
  },
  data() {
    return {
      entity: entity({
        isEnd: 0,
        isInterrupt: 0,
        isTogether: 0,
        isTransfer: 0
      })
    }
  },
  methods: {
    submit() {
      let promises = []
      if (this.$refs.info) {
        //获取录音文件列表数据
        this.$refs.info.switchType();
        promises.push(this.$refs.info.validate())
      }
      if (this.$refs.branch) {
        promises.push(this.$refs.branch.validate())
      }
      Promise.all(promises).then(([info, nextNodeList = []]) => {
        info.nextNodeList = nextNodeList
        whisperingNewNodeApi.saveOrUpdate(info).then(data => {
          this.$emit('after-submit', data, info)
        })
      }).catch(err => { })
    }
  }
}
</script>
