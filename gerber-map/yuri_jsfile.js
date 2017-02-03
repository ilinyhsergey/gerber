
(function($) {
'use strict';

	
	/* When cusotomer selected */
	$('#customer').change(function(){
		
		destoryMap();
		removeCrumb();
		
		if ($(this).val() == "customer1"){
			
			$("#customer_project").html('<option value=""></option><option value="gerber-map/data/customer-project_1/power_stage_rev1_2015-03-20.json?123">Customer1 Project</option>')
			$('.customer-title').text('Customer1');
		}
		else{
			$("#customer_project").html('<option value=""></option><option value="gerber-map/data/customer-project_2/power_stage_rev1_2015-03-20.json?123">Customer2 Project</option>')
			$('.customer-title').text('Customer2');
		}

	});

	/* When project selected */
	$('#customer_project').change(function(){
		var selectedText = $("#customer_project option:selected").text();
		var selectedOption = $("#customer_project option:selected").val();
		$('.project-title').text('> ' + selectedText);
		$('.board-viewer').attr("data-board-url", selectedOption);
		loadViewers();
	});

	/*Map destory */
	
	function destoryMap(){
		$('.board-viewer').remove();
		$('#map-section').html('<div class="board-viewer" data-board-url=""><div class="map"></div><ul class="notes"></ul></div>');
	}
	function removeCrumb(){
		$('.project-title').text('');
	}
	/*end*/

})(jQuery);