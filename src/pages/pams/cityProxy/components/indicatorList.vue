<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form" inline>
          <div class="fr">
            <FormItem>
              <Input v-model="query.name" type="text" placeholder="搜索代理商">
              <Icon type="search" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="loadList">查询</Button>
            </FormItem>
          </div>
          <FormItem label="" :label-width="20">
            <i-select clearable v-model="query.status" style="width: 120px;" placeholder="选择状态">
              <Option v-for="(item,index) in statusOption" :key="index" :value="item.value">{{item.label}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="" :label-width="20">
            <i-select clearable v-model="query.provinceId" style="width: 120px;" placeholder="选择省份">
              <Option v-for="(item,index) in provinceList" :key="index" :value="item.provinceId">{{item.provinceName}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="" :label-width="20">
            <i-select clearable v-model="query.cityId" style="width: 120px;" placeholder="选择城市" :disabled="!(''+query.provinceId)">
              <Option v-for="(item,index) in cityList" :key="index" :value="item.cityId">{{item.cityName}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="">
            <i-select clearable v-model="query.proxyType" style="width: 120px;" placeholder="选择代理商类型">
              <Option v-for="(item,index) in proxyTypeList" :key="index" :value="item.value">{{item.label}}</Option>
            </i-select>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <i-table :columns="indicatorColumns" :data="tableParams.list"></i-table>
        <div class="page-wrapper cf">
          <Page :total="tableParams.total" show-sizer show-elevator :current="currentPage" @on-change="onPageChange" @on-page-size-change="onPageSizeChange">
          </Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tableMixin from "@/mixins/table-mixin"
  import {
    quarterColumn,
    yearColumn
  } from "../cityProxyTable";
  import {OMS} from '@/constants'
  export default {
    data() {
      return {
        query: {
          provinceId:'',
          cityId:'',
          status:'',
          name:'',
          checkType:'',
          proxyType:''
        },
        proxyTypeList:[
          {
            label:'全部',
            value:''
          },
          {
            label:OMS.CITY_PROXY_TYPE_GOLD_LABEL,
            value:3
          },
          {
            label:OMS.CITY_PROXY_TYPE_SILVER_LABEL,
            value:2
          },
          {
            label:OMS.CITY_PROXY_TYPE_CU_LABEL,
            value:1
          }
        ],
        statusOption:[
          {
            label:'全部',
            value:''
          },
          {
            label:'待处理',
            value:0
          },
          {
            label:'处理',
            value:1
          }
        ],
        indicatorColumns: [],
        provinceList:[],
        cityList:[]
      }
    },
    props: {
      id: {
        type: Number,
        default: 0
      },
      checkType: {
        type: Number,
        default: 0
      }
    },
    created() {
      if (this.checkType == 1) {
        this.indicatorColumns = quarterColumn(this)
      } else {
        this.indicatorColumns = yearColumn(this)
      }
      this.getProvinceList()
      this.loadList()
    },
    mixins: [tableMixin],
    watch:{
      'query.provinceId'(val){
        if(val){
          this.getCityList()
        }
      }
    },
    methods: {
      async loadList() {
        let vm = this
        vm.query.checkType = this.checkType
        let result = await this.$pmsApi.cityProxy.getIndicator(vm.assignQuery(this.query))
        vm.initialTableData(result.totalNum, result.dataList)
      },
      async getCityList() {
        this.cityList = []
        this.query.cityId=""
        let result = await thi.$commonApi.provinceCity.cityList({provinceId:this.query.provinceId})
        this.cityList = result
      },
      async getProvinceList() {
        let result = await this.$commonApi.provinceCity.provinceList()
        this.provinceList = result
      },
    }
  }
</script>