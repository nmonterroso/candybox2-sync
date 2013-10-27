$(document).ready(function() {
	var currentTab = null;

	chrome.tabs.getSelected(null, function(tab) {
		currentTab = tab;

		chrome.tabs.sendMessage(
			tab.id,
			{ action: constants.message_actions.popupGetExtensionState },
			function(response) {
				var img = $('#option-toggle img'),
					description = $('#option-toggle .option-text');

				switch (response) {
					case constants.pageActionState.enabled:
						src = constants.icons.disabled.default;
						text = 'Disable';
						break;
					case constants.pageActionState.disabled:
						src = constants.icons.enabled.default;
						text = 'Enable'
						break;
				}

				img.attr('src', src);
				description.text(text);
			}
		);
	});

	$('#option-toggle').click(function() {
		chrome.tabs.sendMessage(currentTab.id, { action: constants.message_actions.togglePersistence });
		window.close();
	});
});