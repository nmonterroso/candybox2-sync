var constants = {
	message_actions: {
		pageActionEnable: "pageActionEnable"
	},
	pageAction_state: {
		disabled: 'disabled',
		enabled: 'enabled',
		error: 'error'
	},
	comm_message: {
		type: "page2SyncExtension",
		saveReady: "sync_data_setup_complete"
	},
	save: {
		interval: 300000, // 5 minutes
		maxLength: 3000, // amount of data per entry (there's a limit)
		keys: {
			data: "data",
			cas: "cas",
			numKeys: "numKeys"
		}
	}
};