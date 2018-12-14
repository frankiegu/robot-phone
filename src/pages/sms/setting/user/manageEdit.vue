<template>
  <Modal v-model="visible"
         :title="title"
         :loading="loading">
    <div class="edit">
      <Form :label-width="120"
            ref="form"
            :rules="rules"
            :model="form">
        <FormItem label="管理员账号"
                  prop="account">
          <Input type="text"
                 v-model="form.account"
                 :disabled="disabledShow" />
        </FormItem>
        <FormItem label="管理员密码"
                  prop="password">
          <Input type="text"
                 placeholder="请输入6-18位的密码"
                 v-model="form.password"
                 :maxlength="18" />
        </FormItem>
        <FormItem label="管理员姓名"
                  prop="name">
          <Input type="text"
                 v-model="form.name" />
        </FormItem>
        <FormItem label="管理员电话"
                  prop="mobile">
          <Input type="text"
                 v-model="form.mobile"
                 :maxlength="11" />
        </FormItem>

        <FormItem label="联系地址"
                  prop="contacts_address">
          <Input type="text"
                 v-model="form.contacts_address" />
        </FormItem>
        <!-- <FormItem label="联系人名字" prop="contacts_name">
          <Input type="text" v-model="form.contacts_name"/>
        </FormItem>
        <FormItem label="联系人电话" prop="contacts_mobile">
          <Input type="text" v-model="form.contacts_mobile"/>
        </FormItem> -->
        <FormItem label="备注"
                  prop="remarks">
          <Input v-model="form.remarks"
                 type="textarea"
                 :rows="4"></Input>
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button size="large"
              @click="handleClose">取消</Button>
      <Button type="info"
              size="large"
              @click="handleConfirm">确认</Button>
    </div>
  </Modal>
</template>

<script>
import API from '@/api/index'
import Util from '@/util/util'
import { watchDateToTimestamp } from '@/util'
import { mobileValidator, passwordValidator } from '@/assets/javascripts/asyncValidator/validators'
export default {
  name: 'manageEdit',
  props: {
    close: Function,
    confirm: Function
  },
  data() {
    return {
      form: {
        account: '',
        name: '',
        contacts_mobile: '',
        password: '',
        remarks: '',
        contacts_name: '',
        mobile: '',
        contacts_address: '',
      },
      disabledShow: false,
      dateRange: '',
      title: '',
      type: 'add',
      rules: {
        account: [
          { required: true, message: '请输入管理员账号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }

        ],
        mobile: [
          { required: true, message: '请输入管理手机号', trigger: 'blur' },
          { validator: mobileValidator }
        ],
        password: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          { validator: passwordValidator }

        ]
      },
      visible: true,
      loading: true,
      error: false
    }
  },
  created() {
    this.$watch('dateRange', function (n) {
      if (typeof n == 'object') {
        this.form.born_time = n ? n.getTime() : ''
      }
    })
  },
  methods: {
    init(type, data) {
      this.type = type
      if (type === 'add') {
        this.disabledShow = false
        this.form = {}
        this.title = '添加管理人员'

      } else if (type === 'edit') {
        this.disabledShow = true

        this.form = {
          id: data.id,
          name: data.name,
          mobile: data.mobile,
          password: data.password,
          contacts_name: data.contactsName,
          account: data.account,
          contacts_mobile: data.contactsMobile,
          remarks: data.remarks,
          contacts_address: data.contactsAddress,
        }
        this.dateRange = data.bornTime ? Util.msToDate(data.bornTime, 'yyyy-MM-dd') : ''
        this.title = '编辑管理人员'
      }
      this.visible = true
    },
    handleClose() {
      this.dateRange = ''
      this.close()
      this.$refs.form.resetFields()
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.confirm(this.type, this.form).finally(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          setTimeout(() => {
            this.loading = true;
          }, 0)
          return false
        }
      })
    }
  }
}
</script>
