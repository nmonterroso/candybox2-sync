utilities.injectSaveJs();

var state = utilities.pageAction.set();

if (state == constants.pageAction_state.enabled) {
	persistence.load(function(data) {
		persistence.setState(data);
		persistence.enable(function(saved) {
			if (!saved) {
				// TODO: how to notify the user?
			}
		});
	}, true);
}