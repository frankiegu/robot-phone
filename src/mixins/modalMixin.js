export default{
    data(){
        return{
            
        }
    },
    props: {
        value: {
          type: Boolean,
          default: false
        },
        pObj:{
            type:Object,
            default:()=>{}
        }
    },
    methods:{
        dialogClose() {
            this.$emit("input", false);
        }
    }
}