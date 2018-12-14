export default {
	props: {
		data: {
			type: Object,
			default() {
				return {}
			}
		}
	},
	watch: {
		data(val) {
			this.refreshMessageDetail(val)
		}
	},
	methods: {
		refreshMessageDetail() {}
	}
}