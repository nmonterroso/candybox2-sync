var _candybox2sync_setup = function() {
	var e = $('#_candybox2_sync_data'),
		saveData = "";

	for (var c in Saving.getAllBools()) {
		if (saveData != "") {
			saveData += ","
		}
		saveData += "bool " + c + "=" + Saving.boolToString(Saving.getAllBools()[c])
	}
	for (var c in Saving.getAllNumbers()) {
		if (saveData != "") {
			saveData += ","
		}
		saveData += "number " + c + "=" + Saving.numberToString(Saving.getAllNumbers()[c])
	}
	for (var c in Saving.getAllStrings()) {
		if (saveData != "") {
			saveData += ","
		}
		saveData += "string " + c + "=" + Saving.getAllStrings()[c]
	}

	e.html(saveData);
};

$(document).ready(function() {
	$('body').append("<div id='_candybox2_sync_data' style='display: none;'></div>");
	setInterval(_candybox2sync_setup, 15000);
});