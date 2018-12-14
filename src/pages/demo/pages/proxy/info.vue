<template>
  <div>
    <div class="divide"
         :class="{full: fullScreen}">
      <div class="divide-item">
        <div class="panel">
          <div class="panel-body">
            <Form class="panel-form"
                  inline>
              <div class="fr">
                <FormItem>
                  <i-input type="text">
                    <Icon type="search"
                          slot="prepend"></Icon>
                  </i-input>
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
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              代理商列表
            </div>
            <div class="panel-body">
              <ul class="list">
                <li class="active">
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        50/200
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">华晨代理公司</p>
                      <div class="list-item-info">
                        <ins class="medal medal-gold">金牌代理</ins> 北京市
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        50/200
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">华晨代理公司</p>
                      <div class="list-item-info">
                        <ins class="medal medal-sliver">金牌代理</ins> 北京市
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        50/200
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">华晨代理公司</p>
                      <div class="list-item-info">
                        <ins class="medal medal-bronze">金牌代理</ins> 北京市
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-item">
                    <div class="list-item-main">
                      <p class="list-item-title">
                        <b>设备123</b>
                        <span class="fs-12 c-primary">总坐席数: 1666</span>
                      </p>
                      <div class="list-item-info text-c">
                        <Row>
                          <Col :span="6">
                          <p class="fs-24">666</p>
                          <p class="fs-14">使用</p>
                          </Col>
                          <Col :span="6">
                          <p class="fs-24">1000</p>
                          <p class="fs-14">空闲</p>
                          </Col>
                          <Col :span="6">
                          <p class="fs-24">1000</p>
                          <p class="fs-14">机器坐席</p>
                          </Col>
                          <Col :span="6">
                          <p class="fs-24">666</p>
                          <p class="fs-14">人工坐席</p>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon"
                 :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                 @click="() => fullScreen = !fullScreen"></i>
              设备详情
              <div class="panel-header-tools">
                <Button type="primary">编辑</Button>
                <Button type="error">删除</Button>
              </div>
            </div>
            <div class="panel-body">
              <Tabs value="1">
                <TabPane label="基础信息"
                         name="1">
                  <div class="task-detail">
                    <h1>华晨代理公司
                      <ins class="medal medal-gold">金牌代理</ins>
                      <div class="fr">
                        <i-switch>
                          <span slot="open">开启</span>
                          <span slot="close">关闭</span>
                        </i-switch>
                      </div>
                    </h1>
                    <Row class="mt-20">
                      <Col span="4">
                      <p>ID: 44555</p>
                      </Col>
                      <Col span="4">
                      <p>北京市</p>
                      </Col>
                      <Col span="4">
                      <p>上级代理: 总平台</p>
                      </Col>
                    </Row>
                    <hr class="mt-20" />
                    <Row :gutter="60"
                         class="mt-20 nail nail-f-lg">
                      <Col span="6">
                      <div class="nail-item"
                           style="width: 100%;">
                        <h3>60</h3>
                        <p>剩余可开通端口数(个)</p>
                      </div>
                      </Col>
                      <Col span="6">
                      <div class="nail-item"
                           style="width: 100%;">
                        <h3>60</h3>
                        <p>已开通端口数(个)</p>
                      </div>
                      </Col>
                      <Col span="6">
                      <div class="nail-item"
                           style="width: 100%;">
                        <h3>60</h3>
                        <p>代理商总营业额(万)</p>
                      </div>
                      </Col>
                      <Col span="6">
                      <div class="nail-item"
                           style="width: 100%;">
                        <h3>60</h3>
                        <p>代理商利润(万)</p>
                      </div>
                      </Col>
                    </Row>
                    <Row :gutter="60"
                         class="mt-20">
                      <Col span="12">
                      <div class="case">
                        <div class="case-item">
                          <h3>60</h3>
                          <p>累计购买端口数(个)</p>
                        </div>
                        <div class="case-item">
                          <h3>60</h3>
                          <p>初始代理端口数(个)</p>
                        </div>
                      </div>
                      </Col>
                      <Col span="12">
                      <div class="case">
                        <div class="case-item">
                          <h3>60</h3>
                          <p>机器坐席数(个)</p>
                        </div>
                        <div class="case-item">
                          <h3>60</h3>
                          <p>人工坐席数(个)</p>
                        </div>
                      </div>
                      </Col>
                    </Row>
                    <hr class="mt-20" />
                    <div class="mt-20 padding-20">
                      <Row>
                        <Col span="8">
                        <p>创建时间: 2018-12-12 12:12:12</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="8">
                        <p>登录账号: admin</p>
                        </Col>
                        <Col span="8">
                        <p>绑定手机号: 13400998877</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="8">
                        <p>登录账号: admin</p>
                        </Col>
                        <Col span="8">
                        <p>绑定手机号: 13400998877</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <p>联系地址：北京市XXX路XXX号</p>
                        </Col>
                      </Row>
                    </div>

                  </div>
                </TabPane>
                <TabPane label="企业列表"
                         name="2">
                </TabPane>
                <TabPane label="端口记录"
                         name="3">
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fullScreen: false
    }
  }
}
</script>
