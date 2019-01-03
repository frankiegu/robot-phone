<template>
 <div>
   <Breadcrumb separator=">">
      <BreadcrumbItem :key="index" v-for="(item,index) in levelList">{{item.meta.title}}</BreadcrumbItem>
    </Breadcrumb>
 </div>
</template>

<script>

 export default {
   data () {
     return {
             levelList:null
     }
   },
    watch: {
    $route(){
      this.getBreadcrumb();
    }
  },
  created () {
    this.getBreadcrumb();
  },
  methods:{
     getBreadcrumb(){
      let matched = this.$route.matched.filter(item=>{
        if(item.name){
          return true;
        }
      })
       console.log('matched',matched);
      const first = matched[0]
      if(first && first.name !== 'omsHomeIndex'){
        matched = [{path:'home',meta:{title:'首页'}}].concat(matched);
      }
      this.levelList = matched;
      console.log('levelList',this.levelList);
    },
  },
   components: {

   }
 }
</script>

<style>

 
</style>
