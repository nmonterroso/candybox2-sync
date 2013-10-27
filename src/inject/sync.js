var candybox2SyncGame = null;

var _candybox2sync_setup = function() {
	if (candybox2SyncGame == null) {
		return;
	}

	var save = new Save(candybox2SyncGame);

	save.clickedFileSave();
	$('#_candybox2_sync_data').html(save.fileSaveTextareaContent);
	window.postMessage({
		type: "page2SyncExtension",
		message: "sync_data_setup_complete"
	}, "*");
};

$(document).ready(function() {
	$('body').append("<div id='_candybox2_sync_data' style='display: none;'></div>");
	$.aop.before({target: Keyboard, method: "setGame"}, function(arguments) {
		candybox2SyncGame = arguments[0];
	});
});