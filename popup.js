$(document).ready(function(){
	var links = Array();
	var title = '';
	var isPrivate = false;

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
			title = $('#title').val();
			if ($.trim(title) == '') {
				$( "#title" ).addClass("invalid");
				$('#title').prop('placeholder', 'Please enter the title');
				return;
			}
			$('input[name="isPrivate"]:checked').each(function() {
				isPrivate = this.value;
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
			data: {'links': JSON.stringify(links), 'title': title, 'isPrivate': isPrivate},
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
	        if (value.indexOf('tabshare.tk') != 0)
    			value = 'tabshare.tk/' + value;
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

	// select all text when clicke on generated link
	$("#generatedLink").on('mouseup', function() { 
		var sel, range;
		var el = $(this)[0];
		if (window.getSelection && document.createRange) {
		  sel = window.getSelection();
		  if(sel.toString() == ''){ 
			 window.setTimeout(function(){
				range = document.createRange();
				range.selectNodeContents(el);
				sel.removeAllRanges();
				sel.addRange(range);
			},1);
		  }
		}else if (document.selection) {
			sel = document.selection.createRange();
			if(sel.text == ''){
				range = document.body.createTextRange();
				range.moveToElementText(el);
				range.select();
			}
		}
	});
});
