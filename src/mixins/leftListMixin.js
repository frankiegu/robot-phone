export default{
    data(){
        return{
            itemPage:{
                pageNum:1,//页码
                pageSize:10,
                totalNum:0
            },
            itemList:[],
            cardId:null,
            activedId:null
        }
    },
    methods:{
        getItemList(){
            this.$Message.info('请在页面实例重写getItemList') 
        },
        onItemPageChange(pSize){
            this.itemPage.pageNum = pSize
            this.getItemList()
        },
        initItemData(total,list){
            this.itemPage.totalNum = total
            this.itemList = list
        },
        assignItemQuery(query = {}) {
            return { pageNum: this.itemPage.pageNum, pageSize: this.itemPage.pageSize, ...query }
        },
        onSearch(){
            this.itemPage.pageNum = 1    
            this.getItemList()
        },
    }
}