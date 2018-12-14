<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form" inline>
          <div class="fr">
            <FormItem>
              <Input v-model="query.adminName" type="text" placeholder="搜索企业名称">
              <Icon type="search" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="onSearch">查询</Button>
            </FormItem>
          </div>
          <FormItem label="">
            <i-select clearable v-model="query.operatorId"  style="width: 120px;" placeholder="选择贴牌商">
              <Option v-for="(item,index) in operatorList" :key="index" :value="item.id">{{item.name}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="" :label-width="20">
            <i-select clearable v-model="query.provinceProxyId"   style="width: 120px;" placeholder="选择省代" :disabled="!query.operatorId">
              <Option v-for="(item,index) in provinceProxyList" :key="index" :value="item.id">{{item.name}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="" :label-width="20">
            <i-select clearable v-model="query.cityProxyId" style="width: 120px;"  @on-change='onSearch' placeholder="选择市代" :disabled="!(''+query.provinceProxyId&&''+query.operatorId)">
              <Option v-for="(item,index) in cityProxyList" :key="index" :value="item.id">{{item.name}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="" :label-width="20">
            <i-select clearable v-model="query.status" @on-change='onSearch' style="width: 120px;" placeholder="选择状态">
              <Option v-for="(item,index) in statusOption" :key="index" :value="item.value">{{item.label}}</Option>
            </i-select>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <i-table :columns="applycolumns" :data="tableParams.list"></i-table>
        <div class="page-wrapper cf">
          <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
          </Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    applyColumn
  } from './applytable'
  import tableMixin from '@/mixins/table-mixin'
  export default {
    data() {
      return {
        applycolumns: applyColumn(this),
        statusOption: [{
            value: "",
            label: "全部"
          },
          {
            value: 0,
            label: "审批中"
          },
          {
            value: 1,
            label: "已开通"
          },
          {
            value: 2,
            label: "拒绝"
          }
        ],
        query: {
          status: "",
          adminName: "",
          cityProxyId: "",
          provinceProxyId: "",
          operatorId: ""
        },
        operatorList: [],
        provinceProxyList: [],
        cityProxyList: []
      };
    },
    mounted() {
      this.loadList()
      this.getOperator()
      this.$watch('query.operatorId', function(val) {
        if(val){
          this.getProvinceList(val)
        }
      })
      this.$watch('query.provinceProxyId', function(val) {
        if(val){
          this.getCityList()
        }
      })
    },
    mixins: [tableMixin],
    methods: {
      async loadList() {
        let result = await this.$smsApi.machine.getMachineApplyList(this.assignQuery(this.query))
        this.initialTableData(result.totalNum, result.dataList)
      },
      async getCityList() {
        this.cityProxyList = []
        this.query.cityProxyId=""
        let result = await this.$smsApi.machine.getCityList({
          platformId: this.query.operatorId,
          provinceProxyId: this.query.provinceProxyId,
        })
        this.cityProxyList = result
      },
      async getOperator() {
        let result = await this.$smsApi.machine.getOperator()
        this.operatorList = result || []
      },
      async getProvinceList(id) {
        this.provinceProxyList = []
        this.query.provinceProxyId=""
        let result = await this.$smsApi.machine.getProvinceList(id)
        this.provinceProxyList = result
      },
      toApply(row) {
        this.$router.push({
          name: 'smsMachineApply',
          params: {
            id: row.id
          }
        })
      },
      async reject(row) {
        let vm = this
        this.$Modal.confirm({
          title: '系统提示',
          content: '<h1>确定要拒绝？</h1>',
          onOk: async function(){
            let result = await vm.$smsApi.machine.rejectApply(row.id)
            vm.loadList()
          },
          onCancel: () => {
          }
        });
        
      },
      toDetail(row) {
        this.$router.push({
          name: 'smsMachineApplyDetail',
          params:{detailId:row.id}
        })
      }
    }
  };
</script>
