utilities.injectScriptFile('src/inject/aop.js');
utilities.injectScriptFile('src/inject/sync.js');

var state = utilities.pageAction.set();

if (state == constants.pageActionState.enabled) {
	persistence.load(function(data) {
		persistence.setState(data);
		persistence.enable(persistence.onTickComplete);
	}, true);
}