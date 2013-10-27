chrome.runtime.onMessage.addListener(function (request, sender, callback) {
	switch (request.action) {
		case constants.messageActions.popupGetExtensionState:
			callback(utilities.currentState);
			break;
		case constants.messageActions.togglePersistence:
			switch (utilities.currentState) {
				case constants.pageActionState.enabled:
					persistence.disable();
					break;
				case constants.pageActionState.disabled:
					persistence.enable();
					break;
			}

			utilities.pageAction.set(utilities.currentState);
			break;
		case constants.messageActions.forceSave:
			if (confirm("Warning: Force saving will overwrite whatever you have saved! Continue?")) {
				persistence.save(null, true);
			}

			break;
		case constants.messageActions.delete:
			if (confirm("SUPER WARNING: Are you sure you want to delete your save data? This cannot be undone!")) {
				persistence.delete();
			}

			break;
	}
});