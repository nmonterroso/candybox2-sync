chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	var response = null;

	if (sender.tab) {
		switch (request.action) {
			case constants.message_actions.pageActionEnable:
				updatePageActionIcon(sender.tab.id, request.state);
				chrome.pageAction.show(sender.tab.id);
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

var updatePageActionIcon = function(tabId, state) {
	var icon;

	switch (state) {
		case constants.pageAction_state.disabled:
			icon = 'images/icons/disabled.png';
			break;
		case constants.pageAction_state.enabled:
			icon = 'images/icons/enabled.png';
			break;
		case constants.pageAction_state.error:
			icon = 'images/icons/error.png';
	}

	if (icon) {
		chrome.pageAction.setIcon({
			tabId: tabId,
			path: icon
		});
	}
};