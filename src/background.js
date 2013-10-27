chrome.runtime.onMessage.addListener(function (request, sender, callback) {
	var response = null;

	if (sender.tab) {
		switch (request.action) {
			case constants.messageActions.pageActionEnable:
				updatePageActionIcon(sender.tab.id, request.state);
				chrome.pageAction.show(sender.tab.id);
				break;
		}
	}

	if (response !== null) {
		callback(response);
	}
});

var updatePageActionIcon = function(tabId, state) {
	var icon;

	switch (state) {
		case constants.pageActionState.disabled:
			icon = constants.icons.disabled.default;
			break;
		case constants.pageActionState.enabled:
			icon = constants.icons.enabled.default;
			break;
		case constants.pageActionState.error:
			icon = constants.icons.error.default;
	}

	if (icon) {
		chrome.pageAction.setIcon({
			tabId: tabId,
			path: icon
		});
	}
};