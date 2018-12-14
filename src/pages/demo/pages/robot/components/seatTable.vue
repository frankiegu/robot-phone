<template>
  <div>
    <Table :columns="columns"
           :data="data" />
    <Modal v-model="device.show"
           title="修改设备号">
      <ms-lazy :initial="device.show">
        <Form :label-width="70">
          <FormItem label="设备号">
            <Select>
              <Option value="beijing">New York</Option>
              <Option value="shanghai">London</Option>
              <Option value="shenzhen">Sydney</Option>
            </Select>
          </FormItem>
          <div class="text-c">
            <Button type="ghost"
                    style="margin-right: 8px"
                    @click="cancelDevice">取消</Button>
            <Button type="primary"
                    @click="cancelDevice">确定</Button>
          </div>
        </Form>
      </ms-lazy>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [{
        title: '坐席号码',
        key: 'mobile'
      }, {
        title: '设备号',
        key: 'device',
        render: (h, { row, column, index }) => {
          return h('a', {
            on: {
              click: () => {
                this.showDeviceModal(row)
              }
            }
          }, row.device)
        }
      }, {
        title: '端口号',
        key: 'num',
        render: (h, { row, column, index }) => {
          return h('a', {
            on: {
              click: () => {
                this.showNumModal(row)
              }
            }
          }, row.num)
        }
      }],
      data: [{
        mobile: '13400998877',
        device: 1,
        num: 1
      }, {
        mobile: '13400998877',
        device: 1,
        num: 1
      }, {
        mobile: '13400998877',
        device: 1,
        num: 1
      }, {
        mobile: '13400998877',
        device: 1,
        num: 1
      }, {
        mobile: '13400998877',
        device: 1,
        num: 1
      }],
      device: {
        show: false
      }
    }
  },
  methods: {
    showDeviceModal() {
      this.device.show = true
    },
    cancelDevice() {
      this.device.show = false
    },
    showNumModal() {

    }
  }
}
</script>
