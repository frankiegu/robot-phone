<template>
  <div class="frame">
    <frame-header class="frame-header" />
    <div class="frame-body">
      <frame-nav class="frame-nav" />
      <div class="frame-wrapper">
        <frame-control class="frame-control" />
        <div class="frame-main">
          <router-view class="container" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FrameHeader from './frame/header'
import FrameNav from './frame/nav'
import FrameControl from './frame/control'

export default {
  components: {
    FrameHeader,
    FrameNav,
    FrameControl
  }
}
</script>
