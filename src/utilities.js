var utilities = {
	pageAction: {
		set: function(state) {
			utilities.currentState = state || utilities.pageAction.calculateState();
			chrome.runtime.sendMessage({
				action: constants.messageActions.pageActionEnable,
				state: utilities.currentState
			});

			return utilities.currentState;
		},
		calculateState: function() {
			var state = constants.pageActionState.enabled;

			if (utilities.isSlotPage()) {
				state = constants.pageActionState.disabled;
			}

			return state;
		}
	},
	reloadCurrent: function() {
		utilities.injectScriptFile('src/inject/forceReload.js');
		persistence._generateSaveData(function(saveData) {
			var state = {};
			state[constants.save.keys.data] = utilities.joinSaveKeys(saveData, saveData[constants.save.keys.numKeys]);
			state[constants.save.keys.cas] = saveData[constants.save.keys.cas];

			persistence.setState(state);
			persistence.cas = 0;
		}, '_candybox2sync_forceData');
	},
	joinSaveKeys: function(items, length) {
		var result = "";

		for (var i = 0; i < length; ++i) {
			result += items[constants.save.keys.data+i];
		}

		return result;
	},
	isSlotPage: function() {
		var search = window.location.search; // ?slot=X
		return search.match(/^\?slot=([1-4])$/);
	},
	injectScriptFile: function(scriptPath) {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL(scriptPath);
		document.head.appendChild(script);
	},
	injectScriptRaw: function(js) {
		var script = document.createElement('script');
		var data = document.createTextNode(js);

		script.onload = function() {
			this.parentNode.removeChild(this);
		};

		script.appendChild(data);
		document.body.appendChild(script);
	},
	error: function(message) {
		utilities.log("ERROR", message);
	},
	log: function(type, message) {
		console.log("candybox2-sync", type+":", message);
	},
	currentState: null
};