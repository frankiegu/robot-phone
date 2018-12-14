const table = {
    data () {
        return {
            tableParams: {
                list: [],
                selectList: [],
                pageNum: 1,//页码
                pageSize: 10,//每页数量
                total: 0,
                isCheckBoxClick: false, // 点击复选框标示
            },
        }
    },
    watch: {
    },
    computed: {
        hasSelect () {
            return !!this.tableParams.selectList.length
        },
        tableSelectLength () {
            return this.tableParams.selectList.length
        },
        currentPage () {
            return this.tableParams.pageNum
        },
        selectedIds () {
            return this.tableParams.selectList.map(item => {
                return item[this.pk]
            })
        },
    },
    methods: {
        loadList () {
            this.$Message.info('请在页面实例重写loadList')
        },
        onSearch () {
            // 重置
            this.tableParams.selectList = [] 
            this.tableParams.pageNum = 1
            this.loadList()
        },
        initialTableData(total, list) {
            const tableParams = this.tableParams
            tableParams.total = total
            tableParams.list = list
          },
        // 表单重置
        onReset () {
            if (this.$refs.searchForm) {
                this.$refs.searchForm.resetFields()
                if (this.onRangeChange && typeof (this.onRangeChange) === 'function') {
                    this.rangeTime = []
                    this.onRangeChange([])
                }
            }
        },
        onSelectionChange (selection) {
            this.tableParams.selectList = Object.freeze(selection)
            this.tableParams.isCheckBoxClick = true
        },
        onPageChange (p) {
            this.tableParams.pageNum = p
            this.loadList()
        },
        onPageSizeChange (pz) {
            this.tableParams.pageSize = pz
            this.onSearch()
        },
        assignQuery (query) {
            return { pageNum: this.tableParams.pageNum, pageSize: this.tableParams.pageSize, ...query }
        },
    },
    created () {
        // this.loadList()
    },
    // beforeRouteEnter (to, from, next){
    // 	next(vm => { vm.loadList() })
    // }
}


export default table