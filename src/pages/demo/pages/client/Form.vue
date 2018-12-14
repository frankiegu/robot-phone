<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        编辑客户
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
                进阶设置
              </div>
              <div class="board-body">
                <p>客户等级</p>
                <div class="keyword">
                  <ins class="keyword-item keyword-primary">A级</ins>
                  <ins class="keyword-item keyword-success">B级</ins>
                  <ins class="keyword-item keyword-info">C级</ins>
                  <ins class="keyword-item keyword-default">D级</ins>
                  <ins class="keyword-item keyword-warning">E级</ins>
                  <ins class="keyword-item keyword-danger">F级</ins>
                </div>
                <p class="mt-10">客户标签</p>
                <div class="keyword">
                  <ins class="keyword-item keyword-default">有意向</ins>
                  <ins class="keyword-item keyword-default">房子</ins>
                  <ins class="keyword-item keyword-default">房子</ins>
                  <ins class="keyword-item keyword-default">房子</ins>
                  <ins class="keyword-item keyword-default">房子</ins>
                  <ins class="keyword-item keyword-default">房子</ins>
                  <ins class="keyword-item keyword-default">房子</ins>
                </div>
              </div>
            </div>
          </div>
          <div class="task-r">
            <div class="board board-primary">
              <div class="board-header">
                基础信息
              </div>
              <div class="board-body">
                <Form :label-width="120"
                      style="overflow: hidden;">
                  <FormItem label="营销任务名称">
                    <Input placeholder="Enter something..." />
                  </FormItem>
                  <FormItem label="Select">
                    <Select>
                      <Option value="beijing">New York</Option>
                      <Option value="shanghai">London</Option>
                      <Option value="shenzhen">Sydney</Option>
                    </Select>
                  </FormItem>
                  <FormItem>
                    <Button type="ghost"
                            style="margin-right: 8px">取消</Button>
                    <Button type="primary">确定</Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userAvtor from '@/assets/images/avtor.jpg'

export default {
  data() {
    return {
      userAvtor
    }
  }
}
</script>
