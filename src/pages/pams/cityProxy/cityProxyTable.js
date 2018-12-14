import {fmt} from '@/util'
export const firmColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center',title:'序号',width : 80}, 
        {title: '企业名称',key: 'name', width : 150}, 
        // {title: '售价(元)',key: 'amt', width : 150}, 
        {title: '开通端口数',key: 'cardAllCount'}, 
        {title: '机器坐席数',key: 'robotCount'}, 
        {title: '人工坐席数',key: 'employeeCount'},
        {title: '固定坐席数',key: 'fixedCount'},
        {title: '开通时间',key: 'createTime', width : 180,render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }}, 
    ]
};
export const portColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center',title:'序号'}, 
        {title: '描述',key: 'describeContent', }, 
        {title: '端口数',key: 'consumePortCount', width : 130,align:"center"}, 
        {title: '剩余年端口数',key: 'curPortCount',width : 130,align:"center"},
        {title: '剩余月端口数',key: 'curMonthPortCount',width : 130,align:"center"},
        {title: '创建时间',key: 'createTime', width : 150,render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }}, 
    ]
};
