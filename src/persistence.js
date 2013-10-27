var persistence = {
	external: chrome.storage.sync,
	cas: 0, // compare and swap key, so multiple windows don't try to overwrite
	timer: 0,
	load: function(callback, loadData) {
		persistence.external.get([constants.save.keys.numKeys, constants.save.keys.cas], function(items) {
			if (!items[constants.save.keys.cas]) {
				callback({});
				return;
			}

			var numKeys = items[constants.save.keys.numKeys] || 1,
				remainingKeys = [],
				result = {};

			result[constants.save.keys.cas] = items[constants.save.keys.cas];

			if (!loadData) {
				callback(result);
				return;
			}

			for (var i = 0; i < numKeys; ++i) {
				remainingKeys.push(constants.save.keys.data+i);
			}

			persistence.external.get(remainingKeys, function(items) {
				if (!items[constants.save.keys.data+"0"] || remainingKeys.length != Object.keys(items).length) {
					callback(result);
					return;
				}

				result[constants.save.keys.data] = "";
				for (var i = 0; i < remainingKeys.length; ++i) {
					result[constants.save.keys.data] += items[remainingKeys[i]];
				}

				callback(result);
			})
		});
	},
	save: function(callback) {
		callback = callback || function() {};

		persistence.load(function(items) {
			if (!items[constants.save.keys.cas] || items[constants.save.keys.cas] == persistence.cas) {
				persistence._generateSaveData(function(saveData) {
					if (saveData == null) {
						callback(false);
					}

					persistence.external.set(saveData, function() {
						if (chrome.runtime.lastError) {
							callback(false, chrome.runtime.lastError);
						} else {
							persistence.cas = saveData[constants.save.keys.cas];
							callback(true);
						}
					});
				});
			} else {
				callback(false);
			}
		}, false);
	},
	setState: function(state) {
		if (!state[constants.save.keys.cas]) {
			return;
		}

		persistence.cas = state[constants.save.keys.cas];

		if (!state[constants.save.keys.data]) {
			return;
		}

		var script = '' +
			'$.aop.before({target: Keyboard, method: "setGame"}, function(args) {' +
				'candybox2SyncGame = args[0]' +
			'});' +
			'Main.reloadEverythingFromFile("'+state[constants.save.keys.data]+'");';

		utilities.injectScriptRaw(script);
	},
	enable: function(callback) {
		callback = callback || persistence.onTickComplete;

		var _callback = function() {
			persistence.save(function(success, errorMessage) {
				if (!success) {
					utilities.error(errorMessage);
				}

				callback(success);
			});
		};

		persistence.timer = setInterval(_callback, constants.save.interval);
		utilities.currentState = constants.pageActionState.enabled;
	},
	disable: function() {
		if (persistence.timer > 0) {
			clearInterval(persistence.timer);
			utilities.currentState = constants.pageActionState.disabled;
			persistence.timer = 0;
		}
	},
	onTickComplete: function(saved) {
		if (!saved) {
			// TODO: how to notify the user?
		}
	},
	_generateSaveData: function(callback) {
		var cb = function(event) {
			if (event.source != window) {
				return;
			}

			if (event.data.type && event.data.type == constants.commMessage.type) {
				window.removeEventListener("message", cb, false);

				var rawSaveData = document.getElementById('_candybox2_sync_data').innerHTML,
					maxLength = constants.save.maxLength;
					data = {};

				for (var i = 0, size = 0, offset = 0, length = rawSaveData.length; offset < length; offset += maxLength, ++i, ++size) {
					data[constants.save.keys.data+i] = rawSaveData.slice(offset, maxLength + offset);
				}

				data[constants.save.keys.cas] = Math.floor((Math.random()*1000000)+1);
				data[constants.save.keys.numKeys] = size;

				callback(data);
			}
		};

		window.addEventListener("message", cb, false);
		utilities.injectScriptRaw("_candybox2sync_setup();");
	}
};