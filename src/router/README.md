## 在左侧菜单显现的路由，由接口返回的 id 进行标识（非 common 部分）
{
  path: 'manager',
  name: 'clientManager',
  title: '客户管理',
  meta: {
    id: '99' // id 类型为 string
  },
  component: resolve => {
    require(['@/pages/ems/client/Manager.vue'], resolve)
  }
}

## 在左侧菜单显现的路由（没有 id 的菜单）
{
  path: 'person',
  name: 'emsPersonSetting',
  meta: {
    pass: true
  },
  components: {
    person: resolve => {
      require(['@/pages/ems/home/Person.vue'], resolve)
    }
  }
}

## 不在左侧菜单显现的路由
### 定义（如新增、编辑页面等）
路由定义时添加 inline: true 参数

    {
      path: 'test',
      name: 'marketingTest',
      title: '任务测试',
      inline: true, // 不在左侧菜单显现
      component: resolve => {
        require(['@/pages/ems/marketing/components/task/detail.vue'], resolve)
      }
    }

### 使用（跳转到不在左侧菜单展示的页面）
引入 '@/util/util'

    import Util from '@/util/util'
    // ...

    // 传入 vm 和 路由 name
    Util.openPage(this, 'marketingTest')



## 不同系统首页的路由设置

不同系统返回的路由数组 index.js 第一个为 home 路由
即：emsRouter[0]