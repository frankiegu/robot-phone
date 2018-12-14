export default{
    data(){
        return{
            seatPage:{
                pageNum:1,//页码
                pageSize:10,
                totalNum:0
            },
            seatList:[],
            cardId:null,
            activedId:null
        }
    },
    methods:{
        getMobileList(){
            this.$Message.info('请在页面实例重写getMobileList') 
        },
        onSeatPageChange(pSize){
            this.seatPage.pageNum = pSize
            this.getSeatList()
        },
        initSeatData(total,list){
            this.seatPage.totalNum = total
            this.seatList = list
        },
        assignSeatQuery(query = {}) {
            return { pageNum: this.seatPage.pageNum, pageSize: this.seatPage.pageSize, ...query }
        },
    }
}