<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        创建营销任务
        <div class="panel-header-tools">
          <Icon type="close"
                class="panel-close"></Icon>
        </div>
      </div>
      <div class="panel-body">
        <Form :label-width="120">
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
          <FormItem label="请选择话术版本"
                    required>
            <div class="plate"
                 style="max-height: 300px; overflow: auto;">
              <div class="plate-item active">
                <h3>微码自售机器人(版本1)</h3>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
              </div>
              <div class="plate-item">
                <h3>微码自售机器人(版本1)</h3>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
              </div>
              <div class="plate-item">
                <h3>微码自售机器人(版本1)</h3>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
              </div>
              <div class="plate-item">
                <h3>微码自售机器人(版本1)</h3>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
                <p>营销模板简介,营销模板简介,</p>
              </div>
            </div>
          </FormItem>
          <Row>
            <i-col :span="12">
              <FormItem label="营销对象">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                  <Button type="ghost"
                          icon="ios-cloud-upload-outline">导入</Button>
                  <p slot="tip">注: 仅支持导入Excel格式文件。点击
                    <a href="javascript: void(0)"
                       class="c-primary">获取模板</a>
                  </p>
                </Upload>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem label="关键字短信">
                <RadioGroup v-model="entity.status">
                  <Radio :label="1">
                    <span>开启</span>
                  </Radio>
                  <Radio :label="0">
                    <span>关闭</span>
                  </Radio>
                </RadioGroup>
                <Select v-model="entity.select">
                  <Option value="">请选择</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <Row>
            <i-col :span="12">
              <FormItem label="时间模板">
                <i-input placeholder="Enter something...">
                  <Button slot="append">创建模板</Button>
                </i-input>
              </FormItem>
            </i-col>
            <i-col :span="12">
              <FormItem>
                <span slot="label">
                  <Tooltip content="这是疑问的内容"
                           placement="top">
                    <Icon type="help-circled"
                          class="pointer" />
                  </Tooltip>
                  初筛微信推送
                </span>
                <CheckboxGroup v-model="entity.checkbox">
                  <Checkbox label="A"></Checkbox>
                  <Checkbox label="B"></Checkbox>
                  <Checkbox label="C"></Checkbox>
                  <Checkbox label="D"></Checkbox>
                  <Checkbox label="E"></Checkbox>
                  <Checkbox label="F"></Checkbox>
                </CheckboxGroup>
                <p class="help-block">注：未勾选不发送短信</p>
                <Select v-model="entity.selectList"
                        multiple>
                  <Option :value="1">周杰伦</Option>
                  <Option :value="2">刘德华</Option>
                  <Option :value="3">梁朝伟</Option>
                  <Option :value="4">黄渤</Option>
                </Select>
              </FormItem>
            </i-col>
          </Row>
          <FormItem>
            <Button type="ghost"
                    style="margin-right: 8px">取消</Button>
            <Button type="primary">确定</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entity: {
        status: 1,
        select: '',
        checkbox: [],
        selectList: [1, 2, 3, 4]
      }
    }
  }
}
</script>
