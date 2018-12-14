<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Tabs value="1">
          <TabPane label="代理设置"
                   name="1">
            <div class="pb-20">
              <h2 class="panel-tit panel-tit-primary">代理费用设置</h2>
              <Form class="mt-20 clear"
                    inline
                    :label-width="60">
                <Row>
                  <Col :span="8">
                  <FormItem label="金牌代理">
                    <i-input placeholder="Enter something..." />
                  </FormItem>
                  <span class="ivu-form-item-append">元/端口</span>
                  </Col>
                  <Col :span="8">
                  <FormItem label="银牌代理">
                    <i-input placeholder="Enter something..." />
                  </FormItem>
                  <span class="ivu-form-item-append">元/端口</span>
                  </Col>
                  <Col :span="8">
                  <FormItem label="铜牌代理">
                    <i-input placeholder="Enter something..." />
                  </FormItem>
                  <span class="ivu-form-item-append">元/端口</span>
                  </Col>
                </Row>
              </Form>
              <h2 class="panel-tit panel-tit-primary">代理端口数量</h2>
              <Row class="mt-20"
                   :gutter="30">
                <Col :span="12">
                <cube />
                </Col>
                <Col :span="12">
                <cube />
                </Col>
              </Row>
              <Row class="mt-20"
                   :gutter="30">
                <Col :span="12">
                <cube />
                </Col>
                <Col :span="12">
                <cube />
                </Col>
              </Row>
              <p class="help-block mt-20">提示：该设置为不同等级代理商每张卡的代理费用，不同等级的城市在相同类型代理的</p>
            </div>
            <div class="form-btns">
              <Button type="primary">确定</Button>
            </div>
          </TabPane>
          <TabPane label="代理返利设置"
                   name="1" />
          <TabPane label="指导价设置"
                   name="1" />
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Cube from './components/cube'

export default {
  components: {
    Cube
  }
}
</script>
