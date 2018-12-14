<template>
  <login :adminType="adminType">
    <FormItem slot="adminType"
              prop="admin_type">
      <Select v-model="adminType">
        <Option v-for="v in adminTypeList"
                :key="v.value"
                :value="v.value">{{v.label}}</Option>
      </Select>
    </FormItem>
  </login>
</template>

<script>
import Login from './components/login'
import { SYSTEM } from '@/constants'
import {
  ADMIN_TYPE_OMS,
  ADMIN_TYPE_PAMS,
  ADMIN_TYPE_CAMS,
  ADMIN_TYPE_EMS,
  ADMIN_TYPE_STAFF,
  ADMIN_TYPE_OMS_LABEL,
  ADMIN_TYPE_PAMS_LABEL,
  ADMIN_TYPE_CAMS_LABEL,
  ADMIN_TYPE_EMS_LABEL,
  ADMIN_TYPE_STAFF_LABEL
} from '@/constants/src/system'

export default {
  components: {
    Login
  },
  data() {
    return {
      adminType: ADMIN_TYPE_EMS,
      adminTypeList: [
        { value: ADMIN_TYPE_OMS, label: ADMIN_TYPE_OMS_LABEL },
        { value: ADMIN_TYPE_PAMS, label: ADMIN_TYPE_PAMS_LABEL },
        { value: ADMIN_TYPE_CAMS, label: ADMIN_TYPE_CAMS_LABEL },
        { value: ADMIN_TYPE_EMS, label: ADMIN_TYPE_EMS_LABEL },
        { value: ADMIN_TYPE_STAFF, label: ADMIN_TYPE_STAFF_LABEL }
      ]
    }
  }
}
</script>
