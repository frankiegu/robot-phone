import {
  export_json_to_excel
} from '@/assets/javascripts/xlsx/Export2Excel'
import date from './date'

/**
 * 将数据导出到excel
 * @param headers 表头数据，如: ['ID', '姓名', '性别']
 * @param keys 表头对应的key，如: ['id', 'name', 'sex']
 * @param list keys的数据，如: [{}, {}, {}] 或 [[], [], []]
 * @param title excel名称
 */
export default (headers = [], keys = [], list = [], title = "Excel导出表") => {
  let now = new Date()
  export_json_to_excel(headers, list.map(v => {
    // 当传递的不是二维数组时，遍历keys生成对应的数据数组
    if (!Array.isArray(v)) {
      return keys.map(k => v[k] || '')
    }
    return v
  }), `${title}-${date.format(now, 'yyyyMMddHHmmss')}-${now.getTime()}`)
}
