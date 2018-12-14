<template>
    <div>
        <robot-seat :card-type="cardType"></robot-seat>
    </div>
</template>
<script>
import robotSeat from './common'
export default {
    data() {
        return {
            cardType: 1
        }
    },
    components: { robotSeat },
    methods: {

    }
}
</script>