chrome.runtime.onMessage.addListener(function (request, sender, callback) {
	switch (request.action) {
		case constants.message_actions.popupGetExtensionState:
			callback(utilities.currentState);
			break;
		case constants.message_actions.togglePersistence:
			switch (utilities.currentState) {
				case constants.pageActionState.enabled:
					persistence.disable();
					break;
				case constants.pageActionState.disabled:
					persistence.enable();
					break;
			}

			utilities.pageAction.set(utilities.currentState);
	}
});