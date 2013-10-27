var utilities = {
	pageAction: {
		set: function(state) {
			utilities.currentState = state || utilities.pageAction.calculateState();
			chrome.runtime.sendMessage({
				action: constants.message_actions.pageAction_enable,
				state: utilities.currentState
			});

			return utilities.currentState;
		},
		calculateState: function() {
			var search = window.location.search; // ?slot=X
			var state = constants.pageAction_state.enabled;

			if (search.match(/^\?slot=([1-4])$/)) {
				state = constants.pageAction_state.disabled;
			}

			return state;
		}
	},
	injectSaveJs: function() {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL('src/inject/sync.js');
		document.head.appendChild(script);
	},
	injectLoadJs: function(loadedData) {
		var script = document.createElement('script');
		var data = document.createTextNode('Main.reloadEverythingFromFile("'+loadedData+'");');

		script.onload = function() {
			this.parentNode.removeChild(this);
		};

		script.appendChild(data);
		document.body.appendChild(script);
	},
	injectImmediateSaveJs: function() {
		var script = document.createElement('script');
		var data = document.createTextNode('_candybox2sync_setup();');

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
	userSettings: {
		localSlotSync: null
	},
	currentState: null
};