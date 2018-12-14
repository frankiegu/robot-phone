<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        创建话术
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
                话术模板
              </div>
              <div class="board-body">
                <div class="node">
                  <div class="node-header">
                    <div class="fr">
                      <a href="javascript: void(0);"
                         class="node-header-btn">
                        +新增
                      </a>
                    </div>
                    <Icon type="arrow-up-b"></Icon>
                    主流程
                  </div>
                  <div class="node-body">
                    <a href="javascript: void(0)"
                       class="node-item active">话术1</a>
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                  </div>
                </div>
                <div class="node">
                  <div class="node-header">
                    <div class="fr">
                      <a href="javascript: void(0);"
                         class="node-header-btn">
                        +新增
                      </a>
                    </div>
                    <Icon type="arrow-up-b"></Icon>
                    主流程
                  </div>
                  <div class="node-body">
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                    <a href="javascript: void(0)"
                       class="node-item">话术1</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="task-r">
            <div class="board board-primary">
              <div class="board-body">
                <Form :label-width="60"
                      style="overflow: hidden;">
                  <Row :gutter="20">
                    <i-col :span="12">
                      <FormItem label="话术分类">
                        <Select>
                          <Option value="beijing">New York</Option>
                          <Option value="shanghai">London</Option>
                          <Option value="shenzhen">Sydney</Option>
                        </Select>
                      </FormItem>
                    </i-col>
                    <i-col :span="12">
                      <FormItem label="话术名称">
                        <Input placeholder="Enter something..." />
                      </FormItem>
                    </i-col>
                  </Row>
                  <div class="block">
                    <div class="block-header clear">
                      <div class="fr">
                        <Button type="error"
                                size="small">删除对话</Button>
                        <Button type="primary"
                                size="small">保存</Button>
                      </div>
                      <b>话术1</b>
                      <Icon type="edit"></Icon>
                    </div>
                    <div class="block-body">
                      <b class="fs-20">Ai语音</b>
                      <i-input type="textarea"
                               :rows="4" />
                      <Upload action="//jsonplaceholder.typicode.com/posts/"
                              class="mt-15">
                        <Button type="info"
                                icon="ios-cloud-upload-outline">上传语音</Button>
                        <p slot="tip">支持mav和mp3格式</p>
                      </Upload>
                      <div class="audio">
                        <i class="icon icon-download"></i>
                        <div class="audio-file">
                          <audio controls />
                        </div>
                      </div>
                      <div class="text-r mt-10">
                        <Button type="primary"
                                size="small">添加回复</Button>
                      </div>
                    </div>
                    <hr class="mt-20 mb-20" />
                    <div class="block block-gray ml-20 mr-20">
                      <div class="block-header clear">
                        <div class="fr">
                          <Checkbox>挽回语句</Checkbox>
                          <Button type="error"
                                  size="small">删除对话</Button>
                        </div>
                        <b>回复A</b>
                        <Icon type="edit"></Icon>
                      </div>
                      <div class="block-body">
                        <Form :label-width="80">
                          <FormItem label="关键字">
                            <Input placeholder="请输入关键字，多个关键字用英文“  ；”隔开" />
                          </FormItem>
                          <FormItem>
                            <div class="tag-container">
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                              <Tag type="border"
                                   closable>标签一</Tag>
                            </div>
                          </FormItem>
                          <FormItem label="回复语音">
                            <i-input type="textarea"
                                     :rows="4" />
                            <Upload action="//jsonplaceholder.typicode.com/posts/"
                                    class="mt-20">
                              <Button type="info"
                                      icon="ios-cloud-upload-outline">上传语音</Button>
                              <p slot="tip">支持mav和mp3格式</p>
                            </Upload>
                            <div class="audio">
                              <i class="icon icon-download"></i>
                              <div class="audio-file">
                                <audio controls />
                              </div>
                            </div>
                          </FormItem>
                        </Form>
                      </div>
                    </div>
                  </div>
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
export default {

}
</script>
