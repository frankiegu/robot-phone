<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Form class="panel-form"
              inline>
          <div class="fr">
            <FormItem>
              <Input type="text">
              <Icon type="search"
                    slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary">查询</Button>
            </FormItem>
          </div>
          <FormItem label="Select"
                    :label-width="50">
            <Select style="width: 120px;">
              <Option value="1">分配状态</Option>
            </Select>
          </FormItem>
          <FormItem label="Select"
                    :label-width="50">
            <Select style="width: 120px;">
              <Option value="1">客户登记</Option>
            </Select>
          </FormItem>
          <FormItem label="Select"
                    :label-width="50">
            <Select style="width: 120px;">
              <Option value="1">呼叫结果</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="panel">
      <div class="panel-body">
        <Table :columns="table.columns"
               :data="table.data"></Table>
        <Page class="pagination"
              :total="100"
              show-sizer />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: {
        columns: [{
          type: 'index',
          width: 60,
          align: 'center',
          title: '序号'
        }, {
          title: 'ID',
          key: '1'
        }, {
          title: '主叫号码',
          key: '2'
        }, {
          title: '客户号码',
          key: '3'
        }, {
          title: '呼叫结果',
          key: '4'
        }, {
          title: '客户等级',
          key: '5'
        }, {
          title: '通话时长',
          key: '6'
        }, {
          title: '通话轮次',
          key: '7'
        }, {
          title: '呼叫时间',
          key: '8'
        }, {
          title: '分配状态',
          key: '9'
        }],
        data: Array(10).fill('1').map(v => {
          return {
            '1': 152344,
            '2': '13855556666',
            '3': '等待中',
            '4': '02:35',
            '5': 'A级',
            '6': '02:35',
            '7': 5,
            '8': '2018-12-12 12:12:12',
            '9': '未分配'
          }
        })
      }
    }
  }
}
</script>
