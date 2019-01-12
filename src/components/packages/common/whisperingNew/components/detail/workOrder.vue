<template>
  <div>
    <Button type="primary" @click="newWorkorder(0,0)" class="mb-10">新增工单</Button>
    <Table :columns="table.columns2" :data="table.list"></Table>
    <ms-pagination
      :pageNum="params.pageNum"
      :pageSize="params.pageSize"
      :total="params.totalNum"
      @change="list"
    />
    <!-- 新建编辑工单 -->
    <Modal v-model="isShow" :title="num==1?'编辑工单':'新建工单'">
      <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
        <FormItem prop="item" label="工单项">
          <i-input type="text" v-model="formInline.item" placeholder="请输入工单项"></i-input>
        </FormItem>
        <FormItem label="初始值">
          <i-input type="text" v-model="formInline.defaultValue" placeholder="请输入初始值"></i-input>
        </FormItem>
        <FormItem label="描述">
          <i-input type="text" v-model="formInline.remark" placeholder="请添加描述"></i-input>
        </FormItem>
        
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelModel">取消</Button>
        <Button type="primary" @click="handleSubmit('formInline')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { indexMixin } from '@/mixins'
import whisperingDetailMixin from './whisperingDetailMixin'
import whisperingNewApi from '@/api/common/whisperingNewApi'
import { fmt } from '@/util'
export default {
  mixins: [indexMixin, whisperingDetailMixin],
  data() {
    return {
      num:0,
      params: {
        pageNum: 1,
        pageSize: 10,
        totalNum: 0,
        whisperingId: this.data.id
      },
      isShow:false,
      table: {
        columns2: [
          {
            title: "工单项",
            key: "item"
          },
          {
            title: "初始值",
            key: "defaultValue"
          },
          {
            title: "描述",
            key: "remark"
          },

          {
            title: "操作",
            key: "action",
            render: (h, { row, column, index }) => {
              return h("div", [
               <a href="javascript: void(0)" class="c-success mr20" onClick={() => this.showEdite(row,1)}>编辑</a>,
                <a href="javascript: void(0)" class="c-danger" onClick={() => this.deleteWork(row)}>删除</a>
              ]);
            }
          }
        ]
      },
      formInline: {
                     whisperingId: this.data.id,
                    item: '',
                    defaultValue: '',
                    remark:'',
                    id:''
                },
                ruleInline: {
                    item: [
                        { required: true, message: 'Please fill in the user name', trigger: 'blur' }
                    ]
                   
                }
    }
  },
  components: {},
  methods: {
    newWorkorder(num,str2){
     this.num = num;
        this.isShow = true;
    },
    cancelModel(){
      this.isShow = false;
    },
    showEdite(row,num){
      this.formInline = row;
      this.num = num;
      this.isShow = true;
      let data =this.formInline;
      whisperingNewApi.editeWorker(data).then((res)=>{
                          this.isShow = true;
                         this.init();
                        });
    },
    deleteWork(row){
      this.$Modal.confirm({
                    title: '删除工单',
                    content: '<p>确认要删除工单吗</p>',
                    onOk: () => {
                        let data = {id:row.id};
                        whisperingNewApi.deleteWorker(row.id).then((res)=>{
                          this.init();
                        });
                    },
                    onCancel: () => {
                       
                    }
                });
    },
    list() {},
    handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {                       
                        let data = this.formInline;
                        if(data.id){
                          whisperingNewApi.editeWorker(data).then((res)=>{
                        });
                        }
                       else{
                          whisperingNewApi.addWorkorder(data).then((res)=>{
                        });
                       }
                         this.isShow = false;
                         this.init();

                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            getApi() {
      return whisperingNewApi
    },
    refreshTaskDetail(data) {
      this.params.whisperingId = data.id
      this.search()
    },
    list(pageNum, pageSize) {
      this.setPageNumSize(pageNum, pageSize)
      let params = Object.assign({}, this.params)
      whisperingNewApi.workorderList(params).then(page => {
        this.setTableList(page.dataList)
        this.setPagination(page)
      })
    }
  }
};
</script>

<style>
</style>
