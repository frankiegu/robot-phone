
import {fmt} from '@/util'
export const cityColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center', width : 70,title:'序号'}, 
        {title: '城市',key: 'cityName'}, 
        {title: '市级代理名称',key: 'name'}, 
        {title: '联系人',key: 'contactsName'}, 
        {title: '联系电话',key: 'contactsMobile',width : 100},
        {title: '开通时间',key: 'createTime', width : 180,
        render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }
        }
    ]
};
export const provinColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center', width : 70,title:'序号'}, 
        {title: '省份',key: 'provinceName',}, 
        {title: '省级代理名称',key: 'name'}, 
        {title: '联系人',key: 'contactsName'}, 
        {title: '联系电话',key: 'contactsMobile',width : 100},
        {title: '开通时间',key: 'createTime', width : 180,
        render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }
        },
    ]
};
export const portColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center', minWidth : 70,title:'序号'}, 
        {title: '描述',minWidth : 150,key: 'describeContent'}, 
        {title: '端口数',key: 'consumePortCount',minWidth : 80,align:"center"}, 
        {title: '剩余可用年端口数',key: 'curPortCount',minWidth : 140,align:"center"}, 
        {title: '剩余可用月端口数',key: 'curMonthPortCount',minWidth : 140,align:"center"}, 
        {title: '创建时间',key: 'createTime', minWidth : 150,
        render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.createTime)}</span>
            )
        }},
    ]
};
