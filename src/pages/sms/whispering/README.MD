
import WhisperingFormPanel from './formPanel'

export default {
  components: {
    WhisperingFormPanel
  },
  data() {
    return {
      whispering: {
        show: false,
        entity: {
          // 话术ID，有ID为编辑，否则为新增
          id: '',
          // 企业ID
          adminId: ''
        }
      }
    }
  },
  methods: {
    listWhispering() { }
  }
}

<whispering-form-panel v-model="whispering.show" 
                       :data="whispering.entity"
                       @close="listWhispering" />