var persistence = {
	external: chrome.storage.sync,
	cas: 0, // compare and swap key, so multiple windows don't try to overwrite
	timer: 0,
	load: function(callback, loadData) {
		persistence.external.get([constants.saveKeyDataNumKeys, constants.saveKeyCas], function(items) {
			if (!items[constants.saveKeyCas]) {
				callback({});
				return;
			}

			var numKeys = items[constants.saveKeyDataNumKeys] || 1,
				remainingKeys = [],
				result = {};

			result[constants.saveKeyCas] = items[constants.saveKeyCas];

			if (!loadData) {
				callback(result);
				return;
			}

			for (var i = 0; i < numKeys; ++i) {
				remainingKeys.push(constants.saveKeyData+i);
			}

			persistence.external.get(remainingKeys, function(items) {
				if (!items[constants.saveKeyData+"0"] || remainingKeys.length != Object.keys(items).length) {
					callback(result);
					return;
				}

				result[constants.saveKeyData] = "";
				for (var i = 0; i < remainingKeys.length; ++i) {
					result[constants.saveKeyData] += items[remainingKeys[i]];
				}

				callback(result);
			})
		});
	},
	save: function(callback) {
		callback = callback || function() {};

		persistence.load(function(items) {
			if (!items[constants.saveKeyCas] || items[constants.saveKeyCas] == persistence.cas) {
				var saveData = persistence._generateSaveData();

				persistence.external.set(saveData, function() {
					if (chrome.runtime.lastError) {
						callback(false, chrome.runtime.lastError);
					} else {
						persistence.cas = saveData[constants.saveKeyCas];
						callback(true);
					}
				});
			} else {
				callback(false);
			}
		}, false);
	},
	setState: function(state) {
		if (!state[constants.saveKeyCas]) {
			return;
		}

		persistence.cas = state[constants.saveKeyCas];

		if (!state[constants.saveKeyData]) {
			return;
		}

		utilities.injectScriptRaw('Main.reloadEverythingFromFile("'+state[constants.saveKeyData]+'");');
	},
	enable: function(callback) {
		var _callback = function() {
			persistence.save(function(success, errorMessage) {
				if (!success) {
					utilities.error(errorMessage);
				}

				callback(success);
			});
		};

		persistence.timer = setInterval(_callback, constants.saveInterval);
	},
	disable: function() {
		if (persistence.timer > 0) {
			clearInterval(persistence.timer);
		}
	},
	_generateSaveData: function() {
		utilities.injectScriptRaw("_candybox2sync_setup();");
		var rawSaveData = document.getElementById('_candybox2_sync_data').innerHTML,
			data = {};

		for (var i = 0, size = 0, offset = 0, length = rawSaveData.length; offset < length; offset += constants.saveDataMaxLength, ++i, ++size) {
			data[constants.saveKeyData+i] = rawSaveData.slice(offset, constants.saveDataMaxLength + offset);
		}

		data[constants.saveKeyCas] = Math.floor((Math.random()*1000000)+1);
		data[constants.saveKeyDataNumKeys] = size;

		return data;
	}
};