$(document).ready(function(){
	var links = Array();

	if(navigator.onLine) {
		$('#no-internet').hide();
		$('#wrapper').show();
	} else {
		$('#no-internet').show();
		$('#wrapper').hide();
	}

	//when user clicks share tabs button, get all the tab urls and store it to global 'links' array
	$('#shareTab').click(function(){
		chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, function (tabs) {
    		tabs.forEach(function(tab){
	    		links.push(tab.url);
		  	});
			sendlink();
		});
	});

	//function to send data to the server
	function sendlink()
	{
		$.ajax({
		    type: 'POST',
		    crossDomain: true,
		    data: {'links': JSON.stringify(links)},
		    url: 'http://tabshare.tk/',
		    success: function(msg) {
		      $('#generatedLink').html(msg);
		      $('#something').remove();
		      $('#wrapper').css('padding-top', '20px');
		      $('#info').removeClass('hidden');
		      $('#generatedLink').attr('class','large');
		    }
		});
		links = Array();
	}

	//fetch data from server and open tabs in a new window
	$('#sharedlink').keydown(function(e) {
	    if (e.keyCode == 13) {
	        var value = $.trim($(this).val());
	        if (value.indexOf('http://') != 0)
    			value = 'http://' + value;
	        $.ajax({
			  url: value,
			  dataType: 'json',
			  success: function(msg){
			  	chrome.windows.create({
			  		url:msg
			  	});
			  },
			});
	    }
	});
});
