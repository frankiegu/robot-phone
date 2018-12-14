import {fmt} from '@/util'
export const firmColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center',title:'序号'}, 
        {title: '城市',key: 'cityName', width : 150}, 
        {title: '市级代理名称',key: 'name', width : 150}, 
        {title: '代理类型',key: 'cityProxyType',render:(h,params)=>{
            let typeMap=['铜牌','银牌','金牌']
            return(
                <span>{typeMap[params.row.cityProxyType-1]}</span>
            )
        }}, 
        {title: '联系人',key: 'contactsName'}, 
        {title: '联系电话',key: 'contactsMobile'},
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
        {type: 'index', align: 'center',title:'序号',minWidth:100,}, 
        {title: '描述',key: 'describeContent', minWidth : 150}, 
        {title: '端口数',key: 'consumePortCount', minWidth : 100}, 
        {title: '剩余年端口数',key: 'curPortCount',minWidth : 150,align:"center"},
        {title: '剩余月端口数',key: 'curMonthPortCount',minWidth : 150,align:"center"},
        {title: '用途',key: 'useType',minWidth : 150,render:(h,params)=>{
            return(
                <span>{params.row.useType==1?'支出':'收入'}</span>
            )
        }},
        {title: '开通时间',key: 'createTime', minWidth : 180,render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }}, 
    ]
};
