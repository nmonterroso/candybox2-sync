var constants = {
	messageActions: {
		pageActionEnable: "pageActionEnable",
		popupGetExtensionState: 'popupGetExtensionState',
		togglePersistence: 'togglePersistence',
		forceSave: 'forceSave',
		delete: 'deleteData'
	},
	pageActionState: {
		disabled: 'disabled',
		enabled: 'enabled',
		error: 'error'
	},
	commMessage: {
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
	},
	icons: {
		enabled: {
			default: chrome.extension.getURL("images/icons/enabled.png"),
			list: {

			}
		},
		disabled: {
			default: chrome.extension.getURL("images/icons/disabled.png"),
			list: {

			}
		},
		error: {
			default: chrome.extension.getURL('images/icons/error.png'),
			list: {

			}
		}
	}
};