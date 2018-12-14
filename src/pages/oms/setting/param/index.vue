<template>
  <div>
    <div class="panel">
      <div class="panel-body">
        <Tabs v-model="tabName">
          <TabPane label="代理设置"
                   name="proxy">
            <ms-lazy :initial="tabName === 'proxy'">
              <proxy />
            </ms-lazy>
          </TabPane>
          <TabPane label="代理返利设置"
                   name="proxyPrice">
            <ms-lazy :initial="tabName === 'proxyPrice'">
              <proxy-price />
            </ms-lazy>
          </TabPane>
          <TabPane label="指导价设置"
                   name="guidePrice">
            <ms-lazy :initial="tabName === 'guidePrice'">
              <guide-price />
            </ms-lazy>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Proxy from './components/proxy'
import ProxyPrice from './components/proxyPrice'
import GuidePrice from './components/guidePrice'

export default {
  components: {
    Proxy,
    ProxyPrice,
    GuidePrice
  },
  data() {
    return {
      tabName: 'proxy'
    }
  }
}
</script>
