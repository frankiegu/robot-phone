<template>
  <div class="panel">
    <div class="panel-header">
      开通端口
      <div class="panel-header-tools">
        <Icon type="close"
              class="panel-close"></Icon>
      </div>
    </div>
    <div class="panel-body">
      <div class="task">
        <div class="task-l">
          <div class="board board-primary">
            <div class="board-header">
              企业信息
            </div>
            <div class="board-body">
              <Form :label-width="70">
                <FormItem label="开通企业"
                          class="mb-10">
                  <Select>
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
                <FormItem label="坐席单价"
                          class="mb-10">
                  <i-input placeholder="Enter something...">
                    <span slot="append">万元</span>
                  </i-input>
                </FormItem>
                <FormItem label="市级代理:"
                          class="mb-10">
                  华晨代理有限公司
                </FormItem>
                <FormItem label="剩余端口:"
                          class="mb-10">
                  53
                </FormItem>
              </Form>
            </div>
            <div class="board-header">
              通话信息
            </div>
            <div class="board-body">
              <Form :label-width="70">
                <FormItem label="快递名称"
                          class="mb-10">
                  <Select>
                    <Option value="beijing">New York</Option>
                    <Option value="shanghai">London</Option>
                    <Option value="shenzhen">Sydney</Option>
                  </Select>
                </FormItem>
                <FormItem label="快递单号"
                          class="mb-10">
                  <i-input placeholder="Enter something..." />
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
        <div class="task-r">
          <div class="board board-primary">
            <div class="board-header">
              开通机器坐席
              <span class="fr">合计数量:4</span>
            </div>
            <div class="board-body">
              <seat />
            </div>
            <div class="board-header mt-20">
              开通人工坐席
              <span class="fr">合计数量:4</span>
            </div>
            <div class="board-body">
              <seat />
            </div>
            <div class="board-header">
              选择端口
            </div>
            <div class="board-body">
              <div class="seat-table">
                <div class="seat-col">
                  <h2>机器坐席：5个</h2>
                  <seat-table class="seat-col-table" />
                </div>
                <div class="seat-col">
                  <h2>机器坐席：5个</h2>
                  <seat-table class="seat-col-table" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Seat from './components/seat'
import SeatTable from './components/seatTable'

export default {
  components: {
    Seat,
    SeatTable
  }
}
</script>
