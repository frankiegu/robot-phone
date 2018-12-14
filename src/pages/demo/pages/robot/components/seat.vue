<template>
  <div>
    <div class="text-r">
      <Button type="success">新增</Button>
    </div>
    <div>
      <Form :label-width="70">
        <div class="seat">
          <div class="seat-item">
            <i class="seat-num">1</i>
            <Input placeholder="Enter something..."
                   class="seat-ipt" />
            <a href="javascript: void(0)"
               class="seat-btn-del">删除</a>
          </div>
          <div class="seat-item">
            <i class="seat-num">2</i>
            <Input placeholder="Enter something..."
                   class="seat-ipt" />
            <a href="javascript: void(0)"
               class="seat-btn-del">删除</a>
          </div>
          <div class="seat-item">
            <i class="seat-num">13</i>
            <Input placeholder="Enter something..."
                   class="seat-ipt" />
            <a href="javascript: void(0)"
               class="seat-btn-del">删除</a>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
export default {

}
</script>
