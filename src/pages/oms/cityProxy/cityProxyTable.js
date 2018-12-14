import {fmt} from '@/util'
export const quarterColumn =  (context)=>{
    let vm = context
    return [
        {key: 'adminId',title:'代理商ID'}, 
        {title: '市级代理名称',key: 'proxyName'}, 
        {title: '代理城市',key: 'cityName'}, 
        {title: '初始代理端口数',key: 'cardInitCount'}, 
        {title: '累计购买端口数',key: 'cardAllCount'},
        {title: '超出指标',key: 'indicator'},
        {title: '奖励金额(万元)',key: 'bonus'},
        {title: '处理时间',key: 'updateTime', render: (h, params) => {
            return h('span', fmt.date(params.row.updateTime))
        }},
        {title: '状态',key: 'status',
        render: (h, params) => {
            let type = {
              "0": "待处理",
              "1": "已处理",
            };
            return h("span", type[`${params.row.status}`]);
          }
        },
        {title: '操作', render:(h,params)=>{
            return (
                <i-button
                  size="small"
                  class="ivu-btn-primary"
                  disabled={params.row.status == 1}
                  onClick={() => {
                      vm.editDeal(params.row.id)
                    }}
                >
                  {" "}
                  处理{" "}
                </i-button>
              );
            
        }},
    ]
};
export const yearColumn =  (context)=>{
    let vm = context
    return [
        {key: 'adminId',title:'代理商ID'}, 
        {title: '市级代理名称',key: 'proxyName', }, 
        {title: '代理城市',key: 'cityName'}, 
        {title: '初始代理端口数',key: 'cardInitCount'}, 
        {title: '累计购买端口数',key: 'cardAllCount'},
        {title: '超出指标',key: 'indicator', },
        {title: '奖励金额(万元)',key: 'bonus', },
        {title: '处理时间',key: 'updateTime', render: (h, params) => {
            return h('span', fmt.date(params.row.updateTime))
        }},
        {title: '状态',key: 'status',
        render: (h, params) => {
            let type = {
              "0": "待处理",
              "1": "已处理",
            };
            return h("span", type[`${params.row.status}`]);
          }
        },
        {title: '操作', render:(h,params)=>{
            return (
                <i-button
                  size="small"
                  class="ivu-btn-primary"
                  disabled={params.row.status == 1}
                  onClick={() => {
                    vm.editDeal(params.row.id)
                  }}
                >
                  {" "}
                  处理{" "}
                </i-button>
              );
            
        }},
    ]
};
export const firmColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center',title:'序号'}, 
        {title: '企业名称',key: 'name', width : 150}, 
        // {title: '售价(元)',key: 'amt', width : 150}, // 隐藏该项
        {title: '开通端口数',key: 'cardAllCount'}, 
        {title: '机器坐席数',key: 'robotCount'}, 
        {title: '人工坐席数',key: 'employeeCount'},
        {title: '固定坐席数',key: 'fixedCount'},
        {title: '开通时间',key: 'createTime', width : 180,render:(h,params)=>{
            return h('span', fmt.date(params.row.createTime))
        }}, 
    ]
};
export const portColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center',title:'序号',minWidth: 110}, 
        {title: '描述',key: 'describeContent', minWidth: 150,align:"center"}, 
        {title: '端口数',key: 'consumePortCount', minWidth: 150,align:"center"}, 
        {title: '剩余年端口数',key: 'curPortCount',minWidth: 150,align:"center"},
        {title: '剩余月端口数',key: 'curMonthPortCount',minWidth: 150,align:"center"},
        {title: '开通时间',key: 'createTime', minWidth: 180,render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }}, 
    ]
};
