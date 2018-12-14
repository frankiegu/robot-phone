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
                <Button type="primary"
                        icon="plus">创建任务</Button>
              </div>
            </div>
            <div class="panel-body">
              <div class="card">
                <div class="card-item card-primary active">
                  <div class="card-header">北京房产销售1</div>
                  <div class="card-body">
                    <div class="task-pg task-pg-primary">
                      <div class="task-pg-strip">
                        <div class="task-pg-strip-desc">进行中</div>
                        <div class="task-pg-strip-bar">
                          <em>
                            <ins style="width: 60%;" />
                          </em>
                        </div>
                      </div>
                      <p class="task-pg-info">进度 325/1000</p>
                    </div>
                    <p>机器坐席号码: 13855556666</p>
                    <p>周杰伦创建于 2018-12-12 12:12:12</p>
                  </div>
                </div>
                <div class="card-item card-warning">
                  <div class="card-header">北京房产销售2</div>
                  <div class="card-body">
                    <div class="task-pg warning">
                      <div class="task-pg-strip">
                        <div class="task-pg-strip-desc">已暂停</div>
                        <div class="task-pg-strip-bar">
                          <em>
                            <ins style="width: 60%;" />
                          </em>
                        </div>
                      </div>
                      <p class="task-pg-info">进度 325/1000</p>
                    </div>
                    <p>机器坐席号码: 13855556666</p>
                    <p>周杰伦创建于 2018-12-12 12:12:12</p>
                  </div>
                </div>
                <div class="card-item card-danger">
                  <div class="card-header">北京房产销售2</div>
                  <div class="card-body">
                    <div class="task-pg danger">
                      <div class="task-pg-strip">
                        <div class="task-pg-strip-desc">已结束</div>
                        <div class="task-pg-strip-bar">
                          <em>
                            <ins style="width: 100%;" />
                          </em>
                        </div>
                      </div>
                      <p class="task-pg-info">进度 325/1000</p>
                    </div>
                    <p>机器坐席号码: 13855556666</p>
                    <p>周杰伦创建于 2018-12-12 12:12:12</p>
                  </div>
                </div>
              </div>
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
              <div class="panel-header-tools">
                <Button type="primary"
                        @click="() => word.show = true">修改话术模板</Button>
                <Button type="primary"
                        @click="() => distribute.show = true">分配客户</Button>
                <Button type="primary">终止任务</Button>
              </div>
            </div>
            <div class="panel-body">
              <Tabs value="1">
                <TabPane label="基础信息"
                         name="1">
                  <div class="task-detail">
                    <h1>北京房产销售任务1
                      <em class="c-primary">进行中</em>
                      <em class="c-danger">已结束</em>
                    </h1>
                    <sub>
                      <b>周杰伦创建于 2018-12-12 12:12:12</b>
                      <em class="ml-10">共呼出3120次</em>
                    </sub>
                    <div class="keyword mt-30">
                      <ins class="keyword-item">外呼进度 33%</ins>
                      <ins class="keyword-item">电话接通率 80%</ins>
                    </div>
                    <div class="mt-20">
                      <Row>
                        <Col span="8">
                        <p><b>ID: 44555</b></p>
                        </Col>
                        <Col span="8">
                        <p><b>机器坐席号码: 13855556666</b></p>
                        </Col>
                        <Col span="8">
                        <p><b>话术模板: 微码自售机器人(模板1)</b></p>
                        </Col>
                      </Row>
                      <Row>
                        <Col span="8">
                        <p><b>启动方式: 定时启动</b></p>
                        </Col>
                        <Col span="8">
                        <p><b>启动时间: 2018-12-12 12:12:12</b></p>
                        </Col>
                        <Col span="8">
                        <p><b>外呼时间: 每天08:00-12:00 14:00-18:00</b></p>
                        </Col>
                      </Row>
                    </div>
                    <div class="block">
                      <div class="block-header">
                        关联回复
                      </div>
                      <div class="block-body">
                        <Form :label-width="100">
                          <FormItem label="关联回复ID:">
                            <p>526853
                              <Button type="ghost"
                                      class="ml-20">重新关联</Button>
                            </p>
                          </FormItem>
                          <FormItem label="语音:">
                            <div class="audio">
                              <div class="audio-file">
                                <audio controls />
                              </div>
                            </div>
                          </FormItem>
                          <FormItem label="文本:">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</p>
                          </FormItem>
                          <FormItem label="拨号时间">
                            <div class="tag">
                              <div class="tag-item">周一</div>
                              <div class="tag-item">周二</div>
                              <div class="tag-item">周三</div>
                              <div class="tag-item">周四</div>
                              <div class="tag-item">周五</div>
                            </div>
                          </FormItem>
                          <FormItem label="排除日期">
                            <div class="tag tag-ghost">
                              <div class="tag-item">2018-12-12</div>
                              <div class="tag-item">2018-12-12</div>
                              <div class="tag-item">2018-12-12</div>
                              <div class="tag-item">2018-12-12</div>
                              <div class="tag-item">2018-12-12</div>
                            </div>
                          </FormItem>
                        </Form>
                      </div>
                    </div>
                    <div class="databar mt-20">
                      <ul class="databar-item">
                        <li class="databar-title">接听状态
                          <Icon type="help-circled"
                                class="ml-5 c-primary"></Icon>
                        </li>
                        <li>
                          <em class="c-primary">325通</em>
                          已接通
                        </li>
                        <li>
                          <em class="c-warning">256通</em>
                          无法接通
                        </li>
                        <li>
                          <em class="c-danger">0通</em>
                          拒接
                        </li>
                        <li>
                          <em class="c-info">0通</em>
                          外呼失败
                        </li>
                      </ul>
                      <ul class="databar-item">
                        <li class="databar-title">接听状态</li>
                        <li>
                          <em>325通</em>
                          已接通
                        </li>
                        <li>
                          <em>256通</em>
                          无法接通
                        </li>
                        <li>
                          <em>0通</em>
                          拒接
                        </li>
                        <li>
                          <em>0通</em>
                          外呼失败
                        </li>
                      </ul>
                      <ul class="databar-item">
                        <li class="databar-title">接听状态</li>
                        <li>
                          <em class="c-primary">325通</em>
                          已接通
                        </li>
                        <li>
                          <em class="c-warning">256通</em>
                          无法接通
                        </li>
                        <li>
                          <em class="c-danger">0通</em>
                          拒接
                        </li>
                        <li>
                          <em class="c-info">0通</em>
                          外呼失败
                        </li>
                      </ul>
                      <ul class="databar-item">
                        <li class="databar-title">接听状态</li>
                        <li>
                          <em class="c-primary">325通</em>
                          已接通
                        </li>
                        <li>
                          <em class="c-warning">256通</em>
                          无法接通
                        </li>
                        <li>
                          <em class="c-danger">0通</em>
                          拒接
                        </li>
                        <li>
                          <em class="c-info">0通</em>
                          外呼失败
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabPane>
                <TabPane label="通话记录"
                         name="2">标签二的内容</TabPane>
                <TabPane label="呼叫日志"
                         name="3">
                  <Form inline>
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
                  </Form>
                  <div class="tool">
                    <div class="tool-btns">
                      <Button type="success">导出</Button>
                    </div>
                    <h2>分配客户给销售人员</h2>
                  </div>
                  <Table :columns="table.columns"
                         :data="table.data"
                         class="table"></Table>
                  <Page class="pagination"
                        :total="100"
                        show-sizer />
                </TabPane>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Modal v-model="distribute.show"
           title="分配客户给销售人员"
           class-name="modal-lg">
      <distribute />
    </Modal>

    <Modal v-model="word.show"
           title="修改话术模板"
           class-name="modal-nm">
      <div class="task-detail padding-10">
        <h3>请选择话术模板</h3>
        <p class="help-block">注: 修改话术模板后，将从下一个呼叫电话开始，使用修改后的话术模板</p>
        <div class="plate mt-20"
             style="max-height: 300px; overflow: auto;">
          <div class="plate-item active">
            <h3>微码自售机器人(版本1)</h3>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
          </div>
          <div class="plate-item active">
            <h3>微码自售机器人(版本1)</h3>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
          </div>
          <div class="plate-item active">
            <h3>微码自售机器人(版本1)</h3>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
          </div>
          <div class="plate-item active">
            <h3>微码自售机器人(版本1)</h3>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
            <p>营销模板简介,营销模板简介,</p>
          </div>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script>
import Distribute from './components/Distribute'

export default {
  components: {
    Distribute
  },
  data() {
    return {
      fullScreen: false,
      distribute: {
        show: false
      },
      word: {
        show: false
      },
      table: {
        columns: [{
          type: 'index',
          // width: 60,
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
