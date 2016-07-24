"use strict";

function sendSettings(settings){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	chrome.tabs.sendMessage(tabs[0].id, settings, function(response) {
	    console.log(response);
	});
    });
}

$( document ).ready(function(){
    var settings = {};
    settings["fps"] = parseFloat($('#fps').val());
    settings["active"] = true;

    $('#fps').change(function(){
	settings.fps = parseFloat($(this).val());
	sendSettings(settings);
    });

    $('#active').change(function(){
	settings.active = this.checked;
	sendSettings(settings);
    });

})
