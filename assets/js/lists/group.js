var initDetailedViewTable = function() {
    var _format = function(d) {
        return '<table class="table table-inline">' + '<tr>' + '<td>' + data.items[0].name +  ' <span class="label label-important">ALERT!</span></td>' + '<td>USD ' + data.items[0].price + '</td>' + '</tr>' + '<tr>' + '<td>' + data.items[1].name + '</td>' + '<td>USD ' + data.items[1].price + '</td>' + '</tr>' + '<tr>' + '<td>' + data.items[2].name + '</td>' + '<td>USD ' + data.items[2].price + '</td>' + '<td></td><td></td><td></td><td></td></tr>' + '</table>';
    }
    
    var table = $('#detailedTable');

    $('#detailedTable tbody').on('click', 'tr', function() {
        if ($(this).hasClass('shown') && $(this).next().hasClass('row-details')) {
            $(this).removeClass('shown');
            $(this).next().remove();
            return;
        }
        var tr = $(this).closest('tr');
        var row = table.DataTable().row(tr);
        $(this).parents('tbody').find('.shown').removeClass('shown');
        $(this).parents('tbody').find('.row-details').remove();
        row.child(_format(row.data())).show();
        tr.addClass('shown');
        tr.next().addClass('row-details');
    });
    
    document.getElementById('detailedTable').onmouseover = function(eventObject) {
		var elTarget = eventObject.target;

		if (elTarget.nodeType == 3) {
			elTarget = elTarget.parentNode;
		}
		
		if (elTarget.clientWidth < elTarget.scrollWidth) {
			elTarget.title = elTarget.textContent;
		} else {
			elTarget.title = '';
		}
	};
	
	document.getElementById('detailedTable').onmousewheel = function(eventObject) {
		var elParent = this.parentNode.parentNode.parentNode.parentNode;
		
		console.log(elParent);
		
		if (!eventObject.ctrlKey && elParent.scrollWidth > elParent.clientWidth) {
            var delta = eventObject.wheelDelta / 20;

			var result = elParent.scrollLeft + delta;
			
			elParent.scrollLeft = Math.min(Math.max(0, result), elParent.scrollWidth - elParent.clientWidth);
			
            return false;
        }

	};
    
	return table;
};
