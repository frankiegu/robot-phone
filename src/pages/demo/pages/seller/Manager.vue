<template>
  <div>
    <Button type="primary"
            @click="() => auth.show = true">权限设置</Button>
    <Modal v-model="auth.show"
           title="权限设置">
      <p class="text-c">已选择 3 个权限</p>
      <div class="tree">
        <Tree :data="auth.data"
              show-checkbox></Tree>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: {
        show: false,
        data: [{
          title: 'parent 1',
          expand: true,
          children: [{
              title: 'parent 1-1',
              expand: true,
              children: [{
                  title: 'leaf 1-1-1'
                }, {
                  title: 'leaf 1-1-2'
                }]
            }, {
              title: 'parent 1-2',
              expand: true,
              children: [{
                  title: 'leaf 1-2-1'
                }, {
                  title: 'leaf 1-2-1'
                }, {
                  title: 'leaf 1-2-1'
                }, {
                  title: 'leaf 1-2-1'
                }, {
                  title: 'leaf 1-2-1'
                }
              ]
            }
          ]
        }]
      }
    }
  }
}
</script>
