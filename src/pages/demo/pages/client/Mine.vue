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
      </div>
      <div class="task">
        <div class="task-l divide-item">
          <div class="panel">
            <div class="panel-header">
              任务列表
              <div class="panel-header-tools">
                <Dropdown class="panel-header-dropdown mr-5">
                  <a href="javascript:void(0)">
                    顺序排列
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem>驴打滚</DropdownItem>
                    <DropdownItem>炸酱面</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <Button type="primary"
                        icon="plus">创建任务</Button>
              </div>
            </div>
            <div class="panel-body">
              <ul class="list">
                <li class="active">
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        任务数: 2
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">13855556666</p>
                      <div class="list-item-info">
                        蔡依林
                        <i class="icon icon-female"></i>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        <i class="icon icon-phone"></i> 1320次
                        <p>
                          <span class="c-danger">30</span>天后到期</p>
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">13855556666</p>
                      <div class="list-item-info">
                        周杰伦
                        <i class="icon icon-male"></i>
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div class="list-item">
                    <div class="list-item-ext">
                      <div class="list-item-ext-text">
                        <i class="icon icon-phone"></i> 1320次
                      </div>
                    </div>
                    <div class="list-item-main">
                      <p class="list-item-title">小学</p>
                      <div class="list-item-info">
                        <ins class="keyword-item">平台</ins>
                        <em>582人次</em>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <Page class="pagination"
                    :total="100"
                    show-sizer
                    simple />
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
          <div class="panel">
            <div class="panel-header">
              <i class="icon icon-enlarge panel-header-icon"
                 :class="fullScreen ? 'icon-narrow' : 'icon-enlarge'"
                 @click="() => fullScreen = !fullScreen"></i>
              任务详情
              <Dropdown class="panel-header-dropdown ml-5">
                <a href="javascript:void(0)">
                  下拉菜单
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem>驴打滚</DropdownItem>
                  <DropdownItem>炸酱面</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <div class="panel-header-tools">
                <Button type="primary">编辑</Button>
                <Button type="error">删除</Button>
                <Button type="primary"><i class="icon icon-phone"></i> 呼叫</Button>
              </div>
            </div>
            <div class="panel-body">
              <Tabs value="1">
                <TabPane label="基础信息"
                         name="1">
                  <div class="task-detail">
                    <h1>13855556666
                      <em class="keyword-item keyword-warning">B级</em>
                      <div class="fr">
                        <Button type="primary">
                          <i class="icon icon-phone"></i> 呼叫(累计6次)
                        </Button>
                        <Button type="default">
                          已分配(刘德华)
                        </Button>
                        <i-switch>
                          <span slot="open">开启</span>
                          <span slot="close">关闭</span>
                        </i-switch>
                      </div>
                    </h1>
                    <sub>周杰伦/男</sub>
                    <div class="keyword mt-30">
                      <ins class="keyword-item">有意向客户</ins>
                      <ins class="keyword-item">客户标签</ins>
                      <ins class="keyword-item">有钱</ins>
                    </div>
                    <hr class="mt-20">
                    <div class="mt-20">
                      <Row>
                        <Col span="8">
                        <p>ID: 44555</p>
                        </Col>
                        <Col span="8">
                        <p>机器坐席号码: 13855556666</p>
                        </Col>
                        <Col span="8">
                        <p>话术模板: 微码自售机器人(模板1)</p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="8">
                        <p>启动方式: 定时启动</p>
                        </Col>
                        <Col span="8">
                        <p>启动时间: 2018-12-12 12:12:12</p>
                        </Col>
                        <Col span="8">
                        <p>外呼时间: 每天08:00-12:00 14:00-18:00</p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="通话记录"
                         name="2">
                  使用iview Table，参考 demo/pages/marketing/Task.vue
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
