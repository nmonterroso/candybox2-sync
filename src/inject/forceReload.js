var _candybox2sync_forceData = function() {
	saveData = "";
	
	for (var c in Saving.getAllBools()) {
		if (saveData != "") {
			saveData += ", "
		}
		saveData += "bool " + c + "=" + Saving.boolToString(Saving.getAllBools()[c])
	}
	for (var c in Saving.getAllNumbers()) {
		if (saveData != "") {
			saveData += ", "
		}
		saveData += "number " + c + "=" + Saving.numberToString(Saving.getAllNumbers()[c])
	}
	for (var c in Saving.getAllStrings()) {
		if (saveData != "") {
			saveData += ", "
		}
		saveData += "string " + c + "=" + Saving.getAllStrings()[c]
	}

	$('#_candybox2_sync_data').html(saveData);

	window.postMessage({
		type: "page2SyncExtension",
		message: "sync_data_setup_complete"
	}, "*");
};