<template>
  <div class="board" style="box-shadow:none;
    border-radius: 0;padding-top:0;">
    <div class="board-header" style="margin-left:0;padding-left:20px;background-color: #f5f8fb;">
      {{title}}
      <!-- 主流程、辅助流程才允许编辑/删除 -->
      <template v-if="[1, 2].includes(entity.module)">
        <Button  type="primary"
                size="small"
                class="ml-10 fr"
                @click="showUpdateModule">编辑模板</Button>
        <Button class="ml-10 fr" type="error"
                size="small"
                @click="showDelModule">删除模板</Button>
      </template>
      <div class="fr" style="margin-top:-1px;">
        <template v-if="!isUnidentifiedRepeatModule">
          <Button type="primary"
                  size="small"
                  @click="addNode">添加节点</Button>
        </template>
      </div>
    </div>
    <div class="board-body" style="padding-left:0;padding-right:0;">
      <div v-show="shouldShowKeyWord || table.list.length"
           >
        <!-- 显示关键字编辑 -->
        <whispering-key-node v-if="shouldShowKeyWord"
                             :data="entity"
                             @showUpdateKey="showUpdateKey" />
        <!-- 显示其他流程 -->
        <whispering-node v-for="v in table.list"
                         :key="v.id"
                         :data="v"
                         @showUpdate="entity => showForm(entity.id)"
                         @showDel="entity => showDel(entity.id)" />
      </div>
      <p class="nodata"
         v-show="!(shouldShowKeyWord || table.list.length)">暂无数据</p>
    </div>
    <!-- 编辑模板节点 -->
    <Modal  class-name="vertical-center-modal" :mask-closable="false" width="1050px" v-model="form.show" :title="form.entity.id ? '编辑模板节点' : '新增模板节点'">
        <template v-if="form.show">
        <whispering-node-form ref="nodeForm" :data="form.entity"
                              @after-submit="afterSubmitForm"
                              @on-cancel="cancelForm" />
      </template>
      <div slot="footer">
          <Button 
          type="text"
              style="margin-right: 8px"
              @click="cancelForm">取消</Button>
      <Button type="primary"
              @click="submitForm">确定</Button>
      </div>
    </Modal>
    <ms-panel v-model="key.show"
              title="编辑关键字">
      <template v-if="key.show">
        <key :data="key.entity"
             @after-submit="afterSubmitKey"
             @on-cancel="cancelKey" />
      </template>
    </ms-panel>
  </div>
</template>

<script>
import { detailMixin, indexMixin } from '@/mixins'
import WhisperingNode from '../whisperingNode'
import WhisperingKeyNode from '../whisperingNode/keyNode'
import WhisperingNodeForm from '../whisperingNode/form'
import whisperingNewNodeApi from '@/api/common/whisperingNewNodeApi'
import nodeEntity from '../whisperingNode/src/entity'
import Key from './components/form/key'

export default {
  mixins: [detailMixin, indexMixin],
  components: {
    WhisperingNode,
    WhisperingKeyNode,
    WhisperingNodeForm,
    Key
  },
  data() {
    return {
      key: {
        show: false,
        entity: {}
      }
    }
  },
  computed: {
    title() {
      return `${this.entity.moduleTitle}: ${this.entity.name}`
    },
    // 是否为特殊流程/重复模块
    isUnidentifiedRepeatModule() {
      return [3].includes(this.entity.module) && [8].includes(this.entity.type)
    },
    // 是否需要显示关键字
    // 特殊流程->等待/客户忙/脏话/重复 需要显示关键字配置
    // 1-挽回 2-未识别 3-等待 4-超时 5-客户忙 6-脏话 7-转接人工 8-重复
    shouldShowKeyWord() {
      return [3].includes(this.entity.module) && [3, 5, 6, 8].includes(this.entity.type)
    }
  },
  methods: {
    cancelForm(){
      this.form.show= false;
    },
    submitForm(){
      this.$refs.nodeForm.submit();
    },
    getApi() {
      return whisperingNewNodeApi
    },
    afterEntity(entity) {
      this.search()
    },
    list(pageNum, pageSize) {
      if (!this.data.id) {
        return false
      }
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params, {
        id: this.data.id
      })
      return whisperingNewNodeApi.list(params).then(data => {
        this.table.list = data
      })
    },
    showUpdateModule() {
      this.$emit('showUpdate', this.entity)
    },
    showDelModule() {
      this.$emit('showDel', this.entity)
    },
    addNode() {
      this.showForm({
        isEnd: 0,
        isInterrupt: 0,
        isTogether: 0,
        isTransfer: 0,
        module: this.data.module,
        parentId: this.data.id,
        whisperingId: this.data.whisperingId
      })
    },
    showUpdateKey(entity) {
      this.key.entity = {
        id: entity.id,
        keyWord: entity.keyWord || ''
      }
      this.key.show = true
    },
    afterSubmitKey() {
      this.list()
      this.$emit('afterSubmitKey')
      this.key.show = false
    },
    cancelKey() {
      this.key.show = false
    }
  }
}
</script>
