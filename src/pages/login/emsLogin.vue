<template>
  <login :adminType="adminType" />
</template>

<script>
import Login from './components/login'
import { SYSTEM } from '@/constants'

export default {
  components: {
    Login
  },
  data() {
    return {
      adminType: SYSTEM.ADMIN_TYPE_EMS
    }
  }
}
</script>
