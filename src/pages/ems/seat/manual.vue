<template>
  <div>
      <manual-seat :card-type="cardType"></manual-seat>
  </div>
</template>
<script>
import manualSeat from './common/index'
    export default{
        data(){
            return{
                cardType:2
            }
        },
        components:{manualSeat},
        methods:{

        }
    }
</script>