<template>
    <indicator-list :check-type="checkType"></indicator-list>
</template>

<script>
import indicatorList from './components/indicatorList'
    export default {
        data() {
            return{
                checkType:2
            }
        },
        created() {
        },
        components:{
            indicatorList
        },
        methods: {
            
        },
        mounted() {
        },
    }
</script>