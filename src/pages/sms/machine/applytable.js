
export const applyColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center', width : 80,title:'序号'}, 
        {title: '市级代理名称',key: 'cityProxyName', width : 150}, 
        {title: '企业名称',key: 'adminName', render: (h,params) =>{
            return (
            <span class="text-link" onClick={vm.toDetail.bind(vm,params.row)}>{params.row.adminName}</span>)
        }}, 
        {title: '开通机器坐席数',key: 'robotCount'},
        {title: '开通人工坐席数',key: 'humanCount'},
        {title: '开通固定坐席数',key: 'fixedCount'},
        {title: '状态',key: 'status',render:(h, params) => {
            const maps = ['审批中','已开通', '拒绝']
            let className
            switch (params.row.status) {
                case 0:
                    className = ''
                    break;
                case 1:
                    className = 'text-success'
                    break;
                case 2:
                    className = 'text-error'
                    break;
                default:
                    className = ''
                    break;
            }
            return (
                <span class={className}>{maps[params.row.status]}</span>
            )
        } },
        {title: '操作', width : 250,render:(h, params) => {
            let row = params.row
            let html
            if(params.row.status==0){
                html =  <div>
                            <i-button type="primary" class="mr10" onClick={vm.toApply.bind(vm,row)}>开通</i-button>
                            <i-button type="error" class="mr10" onClick={vm.reject.bind(vm,row)}>拒绝</i-button>
                        </div>
                        
            }else if(params.row.status==1){
                html = <i-button type="default" onClick={vm.toDetail.bind(vm,row)}>详情</i-button>
                        
            }else{
                html =''
            }
                  return(
                        <div>{html}</div>
                  )
                }
            },
    ]
};

