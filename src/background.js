chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var response = null;

	if (sender.tab) {
		switch (request.action) {
			case constants.message_actions.pageAction_enable:
				chrome.pageAction.show(sender.tab.id);
				updatePageActionIcon(request.state);
				break;
			case constants.tabs_actions.inject:
				injectPageJs(sender.tab.id);
				break;
		}
	}

	if (response !== null) {
		sendResponse(response);
	}
});

var updatePageActionIcon = function(state) {
	switch (state) {
		case constants.pageAction_state.disabled:
			break;
		case constants.pageAction_state.enabled:
			break;
		default:
			return;
	}
};