<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form" inline>
          <div class="fr">
            <FormItem>
              <i-input style="width:230px;" search @on-search="loadList" v-model="query.name" type="text" placeholder="搜索代理商">
              </i-input>
            </FormItem>
           
          </div>
          <FormItem label="">
            <i-select clearable v-model="query.status" @on-change='loadList' style="width: 230px;" placeholder="选择状态">
              <Option v-for="(item,index) in statusOption" :key="index" :value="item.value">{{item.label}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="">
            <i-select clearable v-model="query.provinceId" @on-change='loadList' style="width: 230px;" placeholder="选择省份">
              <Option v-for="(item,index) in provinceList" :key="index" :value="item.provinceId">{{item.provinceName}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="">
            <i-select clearable v-model="query.cityId" @on-change='loadList' style="width: 230px;" placeholder="选择城市" :disabled="!(''+query.provinceId)">
              <Option v-for="(item,index) in cityList" :key="index" :value="item.cityId">{{item.cityName}}</Option>
            </i-select>
          </FormItem>
          <FormItem label="">
            <i-select clearable v-model="query.proxyType" @on-change='loadList' style="width: 230px;" placeholder="选择代理商类型">
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

    <!-- 处理模态框 -->
    <dealModal v-show="dealShow" ref="deal" :close="editClose" :confirm="editConfirm" :visible="dealShow"></dealModal>
  </div>
</template>

<script>
import API from '@/api/index'
  import tableMixin from "@/mixins/table-mixin"
  import dealModal from "./dealModal.vue"
  import {
    quarterColumn,
    yearColumn
  } from "../cityProxyTable";
  import {OMS} from '@/constants'
  export default {
    components:{
      dealModal
    },
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
        cityList:[],
        dealShow:false,
        form:''
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
        let result = await this.$omsApi.cityProxy.getIndicator(vm.assignQuery(this.query))
        vm.initialTableData(result.totalNum, result.dataList)
      },
      async getCityList() {
        this.cityList = []
        this.query.cityId=""
        let result = await this.$omsApi.cityProxy.getCityList(this.query.provinceId)
        this.cityList = result
      },
      async getProvinceList() {
        let result = await this.$omsApi.cityProxy.listProvince()
        this.provinceList = result
      },
      editDeal(id){
        this.dealShow=true;
        this.$refs.deal.visible=true
        this.form=this.$refs.deal.form
        this.form.id=id
        
      },
      editClose(){
        this.dealShow=false;
      },
      editConfirm(){
        this.$Modal.confirm({
        title: "<p class='fc'>提示</p>",
        content: `<p class='fc'>确定要处理该项年度达标记录吗？</p>`,
        onOk: () => {
            this.form.bonus=Number(this.form.bonus)
          API.oms.cityProxy.editIndicatorStatus(this.form).then(res=>{
             this.$Message.success(`处理成功，奖励金额为${this.form.bonus}`)
             this.loadList()
             this.$refs.deal.clickCancel()
          })
          this.visible = true;
        }
      });
      },
    }
  }
</script>