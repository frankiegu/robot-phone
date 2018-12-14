import {fmt, duration } from "@/util";
import {getCallResultLabel} from '@/constants'
export const recordColumn =  (context)=>{
    let vm = context
    return [
        {type: 'index', align: 'center', width : 70,title:'序号'}, 
        {title: '客户号码',key: 'mobile', width : 150}, 
        {title: '呼叫结果',key: 'callResult',render:(h,params)=>{
            return(
                <span>{getCallResultLabel(params.row.callResult)}</span>
            )
        }}, 
        {title: '客户等级',key: 'userLevel',render:(h,params)=>{
            return(
                <span>{params.row.userLevel?params.row.userLevel+'级':'无'}</span>
            )
        }},
        {title: '通话轮次',key: 'callCount'},
        {title: '呼叫时间',key: 'callStartTime', width : 180, render:(h,params)=>{
            return(
                <span>{fmt.date(params.row.callStartTime)}</span>
            )
        }},
    ]
};

