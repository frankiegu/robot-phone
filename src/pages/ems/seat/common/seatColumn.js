import Util from '@/util/util'
import { getCallResultLabel } from '@/constants'

export const robotColumn = (context) => {
  let vm = context
  return [
    { type: 'index', align: 'center', width: 70, title: '序号' },
    { title: '客户号码', key: 'mobile', width: 150 },
    { title: '客户姓名', key: 'userName' },
    {
      title: '呼叫结果',
      key: 'callResult',
      render: (h, params) => {
        let className = ['text-primary', 'text-success', 'text-warning', 'text-error', 'fc-def']

        return (<
          span class = { className[params.row.callResult] } > { getCallResultLabel(params.row.callResult) } < /span>
        )
      }
    },
    { title: '客户等级', key: 'userLevel' },
    {
      title: '呼叫时间',
      key: 'callStartTime',
      width: 180,
      render: (h, param) => {
        return h('span', Util.msToDate(param.row.callStartTime, 'yyyy-MM-dd hh:mm'))
      }
    }
  ]
}
export const manualColumn = (context) => {
  let vm = context
  return [
    { type: 'index', align: 'center', width: 70, title: '序号' },
    { title: '客户号码', key: 'employeeName', width: 150 },
    { title: '客户号码', key: 'mobile', width: 150 },
    { title: '客户姓名', key: 'userName' },
    { title: '呼叫结果', key: 'callResult' },
    { title: '客户等级', key: 'userLevel' },
    {
      title: '呼叫时间',
      key: 'callStartTime',
      width: 180,
      render: (h, param) => {
        return h('span', Util.msToDate(param.row.callStartTime, 'yyyy-MM-dd hh:mm'))
      }
    }
  ]
}
