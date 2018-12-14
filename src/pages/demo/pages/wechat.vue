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
              企业二维码
              <div class="panel-header-tools">
                <Button type="primary"
                        @click="showWechat">绑定微信</Button>
              </div>
            </div>
            <div class="panel-body">
              <div class="qrcode-container">
                <img :src="qrcode">
                <a href="javascript: void(0);"
                   class="qrcode-download">点击下载二维码</a>
              </div>
              <p class="text-c">
                说明<br /> 扫描二维码 - 关注公众号 - 微信用户列表<br /> - 审核通过 - 到销售人员管理中绑定微信
              </p>
            </div>
          </div>
        </div>
        <div class="task-r divide-main">
        </div>
      </div>
    </div>

    <Modal v-model="wechat.show"
           title="绑定微信">
      <p class="text-c">请选择微信用户</p>
      <ul class="collection"
          style="margin: .5rem auto;">
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪</p>
            <em>
              <Checkbox :value="true" />
            </em>
          </label>
        </li>
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪会飞的猪会飞的猪会飞的猪会飞的猪</p>
            <em>
              <Checkbox value />
            </em>
          </label>
        </li>
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪</p>
            <em>
              <Checkbox value />
            </em>
          </label>
        </li>
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪</p>
            <em>
              <Checkbox value />
            </em>
          </label>
        </li>
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪</p>
            <em>
              <Checkbox value />
            </em>
          </label>
        </li>
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪</p>
            <em>
              <Checkbox value />
            </em>
          </label>
        </li>
        <li>
          <label class="collection-user">
            <img :src="avtor">
            <p>会飞的猪</p>
            <em>
              <Checkbox value />
            </em>
          </label>
        </li>
      </ul>
    </Modal>

  </div>
</template>

<script>
import qrcode from '@/assets/images/qrcode.png'
import avtor from '@/assets/images/avtor.jpg'

export default {
  data() {
    return {
      qrcode,
      avtor,
      fullScreen: false,
      wechat: {
        show: false
      }
    }
  },
  methods: {
    showWechat() {
      this.wechat.show = true
    }
  }
}
</script>
