




		var mousePosition;

		var onTimelineMouseMove = function (eventObject) {
            var x = eventObject.clientX;
			var elSlider = document.getElementById('neural-timeline-slider');
			
			var currentScrollPosition = +elSlider.value;

			elSlider.value = currentScrollPosition - (x - mousePosition);
			

			elSlider.onchange();

            mousePosition = [x];

            return false;
      	};

        var onTimelineMouseUp = function () {
			document.body.className = document.body.className.replace(/ dragging/g, ''); 
            document.documentElement.onmousemove = null;
            document.documentElement.onmouseup = null;
        };

      	var onTimelineMouseDown = function (eventObject) {
			var x = eventObject.clientX;
            var y = eventObject.clientY;

            mousePosition = [x];

            document.documentElement.onmousemove = onTimelineMouseMove;
            document.documentElement.onmouseup = onTimelineMouseUp;

            return false;
			
      };

	function getTimelineCellsPhase(phaseName, first) {
		var stageCount = stages[phaseName].length, result = '';

		for (var i = 0; i < stageCount; i++) {
		 	result += '<td class="day stage' + (i ? '' : ' monday') + ((first && !i) ? ' first' : '') + '"></td>';
		}

		return result;
	}

	function getTimelineCellsWeek() {
		return '<td class="day monday"></td><td class="day"></td><td class="day"></td><td class="day"></td><td class="day"></td><td class="day"></td><td class="day"></td>';
	}

	function getTimelineCellsDay() {
		return '<td class="hour midnight"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td><td class="hour"></td>';
	}

	function getTimelineCellsQuarter() {
		return '<td class="month january"></td><td class="month"></td><td class="month"></td>';
	}

	function getTimelineCellsYear() {
		return '<td class="quarter quarter-first"></td><td class="quarter"></td><td class="quarter"></td><td class="quarter"></td>';
	}

	function getTimelineHeaders(weekNumber, first) {
		var timeUnit = dateMode == 5 ? 'Phase ' : (dateMode == 1 ? 'W' : 'Q');

		if (dateMode == 3) {
			timeUnit = '';
		}

		var colSpan;

		switch (dateMode) {
		case 1:
			colspan = 7;
			break;
		case 2:
			colspan = 3;
			break;
		case 3:
			colspan = 4;
		}

		return '<td colspan="' + colspan + '" class="week' + (first ? ' first' : '') + '">' + timeUnit + weekNumber + '</td>';
	}

	function getTimelineHeadersPhases(phaseName, first) {
		var colSpan = stages[phaseName].length;

		return '<td colspan="' + colSpan + '" class="week' + (first ? ' first' : '') + '">' + phaseName + '</td>';
	}

	function getTimelineHeadersDays(dateTime, weekNumber, first) {

		dateTime = dateTime.toString().split(' ');
		dateTime.pop();
		dateTime.pop();
		dateTime.pop();
		dateTime = dateTime.join(' ');

		return '<td colspan="24" class="week' + (first ? ' first' : '') + '">' + dateTime + ' (W' + weekNumber + ')</td>';
	}

	function getTimelineHeadersDay(first) {
		return '<td class="hour-header midnight' + (first ? ' first' : '') + '">12:00</td><td class="hour-header">1:00</td><td class="hour-header">2:00</td><td class="hour-header">3:00</td><td class="hour-header">4:00</td><td class="hour-header">5:00</td><td class="hour-header">6:00</td><td class="hour-header">7:00</td><td class="hour-header">8:00</td><td class="hour-header">9:00</td><td class="hour-header">10:00</td><td class="hour-header">11:00</td><td class="hour-header">12:00</td><td class="hour-header">1:00</td><td class="hour-header">2:00</td><td class="hour-header">3:00</td><td class="hour-header">4:00</td><td class="hour-header">5:00</td><td class="hour-header">6:00</td><td class="hour-header">7:00</td><td class="hour-header">8:00</td><td class="hour-header">9:00</td><td class="hour-header">10:00</td><td class="hour-header">11:00</td>';
	}

	function getTimelineHeadersYear(first) {
		return '<td class="quarter-header quarter-first' + (first ? ' first' : '') + '">' + 1 + '</td><td class="quarter-header">2</td><td class="quarter-header">3</td><td class="quarter-header">4</td>';
	}

	function getTimelineHeadersQuarter(quarterNumber, first) {
		var months;

		switch(quarterNumber) {
		case 1:
			months = ['JAN', 'FEB', 'MAR'];
			break;
		case 2:
			months = ['APR', 'MAY', 'JUN'];
			break;
		case 3:
			months = ['JUL', 'AUG', 'SEP'];
			break;
		case 4:
			months = ['OCT', 'NOV', 'DEC'];
		}

		return '<td class="month-header january' + (first ? ' first' : '') + '">' + months[0] + '</td><td class="month-header">' + months[1] + '</td><td class="month-header">' + months[2] + '</td>';
	}

	function getTimelineHeadersPhase(phaseName, first) {
		var stageCount = stages[phaseName].length, result = '';

		for (var i = 0; i < stageCount; i++) {
		 	result += '<td title="' + stages[phaseName][i] + '" class="day-header stage ' + (i ? '' : ' monday') + ((first && !i) ? ' first' : '') + '"><span>' + stages[phaseName][i] + '</span></td>';
		}

		return result;
	}

	function getTimelineHeadersWeek(first, dateWeekStarts) {
		var dateWeekEnds = addDays(dateWeekStarts, 6);

		var dateWeekStartsPlusOne = addDays(dateWeekStarts, 1);
		var dateWeekStartsPlusTwo = addDays(dateWeekStarts, 2);
		var dateWeekStartsPlusThree = addDays(dateWeekStarts, 3);
		var dateWeekStartsPlusFour = addDays(dateWeekStarts, 4);
		var dateWeekStartsPlusFive = addDays(dateWeekStarts, 5);

		dateWeekStarts = dateWeekStarts.toString().split(' ');
		dateWeekStarts.pop();
		dateWeekStarts.pop();
		dateWeekStarts.pop();
		dateWeekStarts = dateWeekStarts.join(' ');

		dateWeekStartsPlusOne = dateWeekStartsPlusOne.toString().split(' ');
		dateWeekStartsPlusOne.pop();
		dateWeekStartsPlusOne.pop();
		dateWeekStartsPlusOne.pop();
		dateWeekStartsPlusOne = dateWeekStartsPlusOne.join(' ');

		dateWeekStartsPlusTwo = dateWeekStartsPlusTwo.toString().split(' ');
		dateWeekStartsPlusTwo.pop();
		dateWeekStartsPlusTwo.pop();
		dateWeekStartsPlusTwo.pop();
		dateWeekStartsPlusTwo = dateWeekStartsPlusTwo.join(' ');

		dateWeekStartsPlusThree = dateWeekStartsPlusThree.toString().split(' ');
		dateWeekStartsPlusThree.pop();
		dateWeekStartsPlusThree.pop();
		dateWeekStartsPlusThree.pop();
		dateWeekStartsPlusThree = dateWeekStartsPlusThree.join(' ');

		dateWeekStartsPlusFour = dateWeekStartsPlusFour.toString().split(' ');
		dateWeekStartsPlusFour.pop();
		dateWeekStartsPlusFour.pop();
		dateWeekStartsPlusFour.pop();
		dateWeekStartsPlusFour = dateWeekStartsPlusFour.join(' ');

		dateWeekStartsPlusFive = dateWeekStartsPlusFive.toString().split(' ');
		dateWeekStartsPlusFive.pop();
		dateWeekStartsPlusFive.pop();
		dateWeekStartsPlusFive.pop();
		dateWeekStartsPlusFive = dateWeekStartsPlusFive.join(' ');

		dateWeekEnds = dateWeekEnds.toString().split(' ');
		dateWeekEnds.pop();
		dateWeekEnds.pop();
		dateWeekEnds.pop();
		dateWeekEnds = dateWeekEnds.join(' ');

		return '<td class="day-header monday' + (first ? ' first' : '') + '" title="' + dateWeekStarts + '">MON</td><td class="day-header" title="' + dateWeekStartsPlusOne + '">TUE</td><td class="day-header" title="' + dateWeekStartsPlusTwo + '">WED</td><td class="day-header" title="' + dateWeekStartsPlusThree + '">THU</td><td class="day-header" title="' + dateWeekStartsPlusFour + '">FRI</td><td class="day-header" title="' + dateWeekStartsPlusFive + '">SAT</td><td class="day-header sunday" title="' + dateWeekEnds + '">SUN</td>';
	}

	function addDays(date, days) {
    	var result = new Date(date);
    	result.setDate(result.getDate() + days);
    	return result;
	}

	function onTimelineKeyDown(eventObject) {
		var offset, keyCode = eventObject.keyCode, ctrlKey = eventObject.ctrlKey;

		switch (keyCode) {
		case 37:
			offset = 102 * (ctrlKey ? 7 : 1);
			
			break;
		case 39:
			offset = -102 * (ctrlKey ? 7 : 1);
		}

		if (offset) {
			document.getElementById('neural-timeline-slider').value = '' + (document.getElementById('neural-timeline-container').scrollLeft + offset);

			document.getElementById('neural-timeline-container').scrollLeft = +document.getElementById('neural-timeline-slider').value;

			updateFakeSlider();
		
			updateMiniMap();

			return false;

		}

	}

	function cloneMap() {
		var elTableClone = document.getElementById('neural-timeline-container').getElementsByTagName('table')[0].cloneNode(true);

		elTableClone.id = '';

		var elMiniMap = document.getElementById('neural-timeline-minimap');

		var elMiniMapClones = elMiniMap.getElementsByTagName('table');

		if (elMiniMapClones.length) {
			elMiniMapClones[0].parentNode.removeChild(elMiniMapClones[0]);
		}

		elMiniMap.appendChild(elTableClone);
	}

	function toggleGroup(groupIndex) {
		var els = document.getElementById('neural-timeline-captions-container').getElementsByTagName('tbody');

		els[groupIndex + 1].className = els[groupIndex + 1].className ? '' : 'neural-collapsed'; 

		els = document.getElementById('neural-timeline-totals-container').getElementsByTagName('tbody');

		els[groupIndex + 1].className = els[groupIndex + 1].className ? '' : 'neural-collapsed'; 

		els = document.getElementById('neural-timeline-container').getElementsByTagName('tbody');

		els[groupIndex + 2].className = els[groupIndex + 2].className ? '' : 'neural-collapsed';

		window.setTimeout(function() {
			window.onresize();
			updateFakeSlider();
			updateMiniMap();
			cloneMap();
			updateYearCaption();
		}, 1);
	}

	var dateMode = 1;

	function setDateMode(dateModeNew) {
		dateMode = dateModeNew;

		var els = document.getElementById('neural-timeline-tabs').getElementsByTagName('span'), elsLength = els.length;

		for (var i = 1; i < elsLength; i++) {
			els[i].className = (i == dateModeNew + 1) ? 'neural-timeline-tab neural-active' : 'neural-timeline-tab';
		}

		window.setTimeout(function() {

			populateTimeline(true);

			window.onresize();

			// FIXME: Figure currently viewed date

			if (dateMode != 5 && dateMode != 3 && dateMode != 2) {
				scrollToNow();
			}

			updateFakeSlider();

			updateMiniMap();

			updateYearCaption();

		}, 1);
	}

	var dateStart, dateEnd;

	function populateTimeline(noRefresh) {

		var customerFilter = $('#neural-select-timeline-customer').val() || [], programFilter = $('#neural-select-timeline-program').val() || [];

		phases = []; stages = {};
	
		for (var i in data.orders) {
			var order = data.orders[i];
	
			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
				var phase = data.orders[i].phaseName;
		
				if (phases.indexOf(phase) == -1) {
					phases.push(phase);
					stages[phase] = [];
				}
			}
		}
	
		for (var i in data.orders) {
			var order = data.orders[i];
	
			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
				var stage = data.orders[i].stageName;
				var phase = data.orders[i].phaseName;
		
				if (stages[phase].indexOf(stage) == -1) {
					stages[phase].push(stage);
				}
			}
		}

		var orders = data.orders;

		document.getElementById('neural-timeline').className += ' loading';
		
		if (5 == dateMode) {
			document.getElementById('neural-timeline').parentNode.parentNode.parentNode.className += ' neural-stages';
		} else {
			document.getElementById('neural-timeline').parentNode.parentNode.parentNode.className = document.getElementById('neural-timeline').parentNode.parentNode.parentNode.className.replace(/ neural-stages/g, '');
		}

		var el = document.getElementById('neural-timeline-captions-container'), html = '<table class="neural-timeline-captions"><tbody><tr><td style="padding:0">&nbsp;</td></tr><tr><td class="day-header' + (dateMode == 5 ? ' stage' : '') + '">&nbsp;</td></tr></tbody><tbody>';

		el.innerHTML = '';

		var groupName, groupIndex = 0;
		
		var firstInGroup, lastInGroup, firstInTable = true;

		for (var i in orders) {
			var order = orders[i], groupChanged = false, htmlGroupName = '';

			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
				if (groupName && order.group != groupName) {
					html += '</tbody><tbody>';
					groupChanged = true;
					groupIndex++;
				}
	
				if (!groupName || groupChanged) {
					firstInGroup = true;
					htmlGroupName = '<span title="' + order.group + '" onclick="toggleGroup(' + groupIndex + ')" class="neural-timeline-group-caption">' + order.group + '</span>';
				}
	
				groupName = order.group;
	
				var htmlRow = '<tr><td class="neural-timeline-order' + (firstInGroup ? (firstInTable ? ' first very-first' : ' first') : '') + '" id="neural-order-' + i + '" onclick="' + ((dateMode == 5) ? '' : 'scrollToOrder(&quot;' + i + '&quot;)') + '">' + htmlGroupName + '<div id="neural-timeline-group-caption-' + i + '">' + i + '</div></td></tr>';
				
				html += htmlRow;

				firstInTable = firstInGroup = false;
			}
		}

		html += '</tbody></table>';

		el.innerHTML = html;



		var el = document.getElementById('neural-timeline-totals-container'), html = '<table class="neural-timeline-totals"><tbody><tr><td style="padding:0">&nbsp;</td></tr><tr><td class="day-header' + (dateMode == 5 ? ' stage' : '') + '">Total</td></tr></tbody><tbody>';

		el.innerHTML = '';

		var groupName, groupIndex = 0;
		
		var firstInGroup, lastInGroup, firstInTable = true;

		groupName = '';

		for (var i in orders) {
			var order = orders[i], groupChanged = false, htmlGroupName = '';

			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
				if (groupName && order.group != groupName) {
					html += '</tbody><tbody>';
					groupChanged = true;
					groupIndex++;
				}
	
				if (!groupName || groupChanged) {
					firstInGroup = true;
					//htmlGroupName = '<span title="' + order.group + '" onclick="toggleGroup(' + groupIndex + ')" class="neural-timeline-group-caption">' + 0 + '</span>';
				}
	
				groupName = order.group;
	
				var htmlRow = '<tr id="' + (firstInGroup ? 'neural-group-' + order.group.replace(/\s/g, '_') : '') + '"><td class="neural-timeline-total' + (firstInGroup ? (firstInTable ? ' first very-first' : ' first') : '') + '" id="neural-total-' + i + '" onclick="' + ((dateMode == 5) ? '' : 'scrollToOrder(&quot;' + i + '&quot;)') + '">' + '<span>' + 0 + '</span></td></tr>';
				
				html += htmlRow;

				firstInTable = firstInGroup = false;
			}
		}

		html += '</tbody><tfoot><tr><td style="padding:0;font-size:35px;border:none;">&nbsp;</td></tr><tr><td id="neural-timeline-grand-total">(Grand Total)</td></tr></tfoot></table>';

		el.innerHTML = html;






		el = document.getElementById('neural-timeline-container');

		html = '<table id="neural-timeline" class="neural neural-timeline"><tbody>';

		var dateToday = new Date();
		dateStart = dateToday;
		dateEnd = dateToday;

		var yearStart, yearEnd;

		for (var i in orders) {
			var order = orders[i];

			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
				var dateOrder = new Date(orders[i].timestamp);
	
				if (dateOrder < dateStart) {
					dateStart = dateOrder;
				} else if (dateOrder > dateEnd) {
					dateEnd = dateOrder;
				}
			}
		}

		console.log('Orders start on: ', dateStart);
		console.log('Orders end on: ', dateEnd);

		//if (dateMode) {
			var yearStart = dateStart.getFullYear();
			var yearEnd = dateEnd.getFullYear();
	
			console.log('Start year: ', yearStart);
			console.log('End year: ', yearEnd);
	
			dateStart = new Date('01/01/' + yearStart);
			dateEnd = new Date('12/31/' + yearEnd);
		//}
		
		console.log('Timeline starts on: ', dateStart);
		console.log('Timeline ends on: ', dateEnd);

		if (dateMode != 2 && dateMode != 3) {
			while (dateStart.getDay() != 1) {
				dateStart = addDays(dateStart, -1);
			}
	
			while (dateEnd.getDay() !== 0) {
				dateEnd = addDays(dateEnd, 1);
			}
		}

		console.log('Timeline adjusted to start on Monday: ', dateStart);
		console.log('Timeline adjusted to end on Sunday: ', dateEnd);

		var numberOfWeeks = Math.round(((dateEnd - dateStart)/(1000 * 60 * 60 * 24)) / 7);

		var numberOfYears = dateEnd.getFullYear() - dateStart.getFullYear() + 1;

		console.log('Number of weeks: ' + numberOfWeeks);

		html += '<tr>'

		// FIXME: May be 52nd week, not 53rd

		var currentYear = dateStart.getFullYear(), weekIndex = dateStart.getMonth() == 11 ? 53 : 1;

		var firstWeek = true;







		if (dateMode == 5) {
			for (i = 0; i < phases.length; i++) {
				html += getTimelineHeadersPhases(phases[i], !i);
			}
		} else if (dateMode == 3) {
			for (i = 0; i < numberOfYears; i++) {
				html += getTimelineHeaders(dateStart.getFullYear() + i, firstWeek);
				firstWeek = false;
			}
		} else if (dateMode == 2) {
			for (i = 0; i < numberOfYears * 4; i++) {
				var dateWeekStarts = addDays(dateStart, i * 7);
	
				if (dateWeekStarts.getFullYear() != currentYear) {
					weekIndex = 1;
					currentYear++;
				}
	
				html += getTimelineHeaders(weekIndex++, firstWeek);
				firstWeek = false;
			}
		} else if (dateMode) {
			for (i = 0; i < numberOfWeeks; i++) {
				var dateWeekStarts = addDays(dateStart, i * 7);
	
				if (dateWeekStarts.getFullYear() != currentYear) {
					weekIndex = 1;
					currentYear++;
				}
	
				html += getTimelineHeaders(weekIndex++, firstWeek);
				firstWeek = false;
			}
		} else {
			for (i = 0; i < numberOfWeeks * 7; i++) {
				var dateOfDay = addDays(dateStart, i);

				var weekIndexChanged = false;
	
				if (dateOfDay.getFullYear() != currentYear && i > 6) {
					weekIndex = 1;
					weekIndexChanged = true;
					currentYear++;
				}

				html += getTimelineHeadersDays(dateOfDay, weekIndex, firstWeek);

				if ((i % 7) == 6 && !weekIndexChanged) {
					weekIndex++
				}

				firstWeek = false;
			}
		}

		
		html += '</tr>';

		html += '<tr>'
		
		firstWeek = true;

		if (dateMode == 5) {
			for (i = 0; i < phases.length; i++) {
				html += getTimelineHeadersPhase(phases[i], !i);
			}
		} else if (dateMode == 3) {
			for (i = 0; i < numberOfYears; i++) {
				html += getTimelineHeadersYear(firstWeek);
				firstWeek = false;
			}
		} else if (dateMode == 2) {
			for (i = 0; i < numberOfYears * 4; i++) {
				html += getTimelineHeadersQuarter((i % 4) + 1, firstWeek);
				firstWeek = false;
			}
		} else if (dateMode) {
			for (i = 0; i < numberOfWeeks; i++) {
				html += getTimelineHeadersWeek(firstWeek, addDays(dateStart, i * 7));
				firstWeek = false;
			}
		} else {
			for (i = 0; i < numberOfWeeks * 7; i++) {
				html += getTimelineHeadersDay(firstWeek, addDays(dateStart, i));
				firstWeek = false;
			}
		}
		

		html += '</tr></tbody><tbody>';

		var rows = {}, rowIndex = 0;

		var groupName, groupTotals = {};

		for (i in orders) {
			var order = orders[i];
			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
	
				if (groupName && order.group != groupName) {
					html += '</tbody><tbody>';
				}
	
				groupName = order.group;
	
				rows[i] = rowIndex;
	
				rowIndex++;
	
				html += '<tr id="neural-timeline-group-' + groupName.replace(/\s/g, '_') + '">';
	
				if (dateMode == 5) {
					for (j = 0; j < phases.length; j++) {
						html += getTimelineCellsPhase(phases[j]);
					}
				} else if (dateMode == 3) {
					for (j = 0; j < numberOfYears; j++) {
						html += getTimelineCellsYear();
					}
				} else if (dateMode == 2) {
					for (j = 0; j < numberOfYears * 4; j++) {
						html += getTimelineCellsQuarter();
					}
				} else if (dateMode) {
					for (j = 0; j < numberOfWeeks; j++) {
						html += getTimelineCellsWeek();
					}
				} else {
					for (j = 0; j < numberOfWeeks * 7; j++) {
						html += getTimelineCellsDay();
					}
				}
	
				html += '</tr>';
			}
		}

		var footerCellHtml = '';

		html += '</tbody><tfoot><tr style="visibility:hidden"><td class="day" style="border:none;font-size:35px;">&nbsp;</td></tr>';


		for (i in orders) {
			var order = orders[i];
			//if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
	
				//if (groupName && order.group != groupName) {
				//	html += '</tbody><tbody>';
				//}
	
				groupName = order.group;
	
				//rows[i] = rowIndex;
	
				//rowIndex++;
	
				html += '<tr>'
	
				if (dateMode == 5) {
					for (j = 0; j < phases.length; j++) {
						html += getTimelineCellsPhase(phases[j]);
					}
				} else if (dateMode == 3) {
					for (j = 0; j < numberOfYears; j++) {
						html += getTimelineCellsYear();
					}
				} else if (dateMode == 2) {
					for (j = 0; j < numberOfYears * 4; j++) {
						html += getTimelineCellsQuarter();
					}
				} else if (dateMode) {
					for (j = 0; j < numberOfWeeks; j++) {
						html += getTimelineCellsWeek();
					}
				} else {
					for (j = 0; j < numberOfWeeks * 7; j++) {
						html += getTimelineCellsDay();
					}
				}
	
				html += '</tr>';
			//}

			break;
		}




		html += '</tfoot></table>';

		el.innerHTML = html;

		var timeUnit = dateMode ? 'day' : 'hour';

		if (dateMode == 3) {
			timeUnit = 'quarter';
		} else if (dateMode == 2) {
			timeUnit = 'month';
		}

		if (dateMode == 5) {
			document.getElementById('neural-timeline').style.width = (document.getElementById('neural-timeline').getElementsByClassName(timeUnit + '-header').length * 102) + 'px';
		} else {
			document.getElementById('neural-timeline').style.width = (document.getElementById('neural-timeline').getElementsByClassName(timeUnit + '-header').length * 102) + 'px';
		}
		
		
		var columnTotals = [], rowTotals = {};

		for (var i in orders) {
			var order = orders[i];
			if ((customerFilter.indexOf(order.customerId) != -1) || (programFilter.indexOf(order.programId) != -1)) {
				var orderDate = new Date(order.timeStamp);
				var status = order.status;
				var className;
	
				switch(status) {
					case 1:
						className = 'errored';
						break;
					case 2:
						className = 'finding';
						break;
					case 3:
						className = 'found';
						break;
					case 4:
						className = 'indeterminate';
						break;
				}
	
				var rowIndex = rows[i];
				
				if (dateMode == 5) {
					var phase = order.phaseName, stage = order.stageName;

					var columnIndex = 0;

					var phaseIndex = phases.indexOf(phase);
					for (var j = 0; j < phaseIndex; j++) {
						columnIndex += stages[phases[j]].length;
					}

					columnIndex += stages[phase].indexOf(stage);

				} else if (dateMode == 3) {
					var orderDate = new Date(order.timestamp);
					var orderYear = orderDate.getFullYear();

					var yearsDiff = orderYear - yearStart;

					var columnIndex = yearsDiff * 4 + Math.floor(orderDate.getMonth() / 4);
				} else if (dateMode == 2) {
					var startMonth = dateStart.getMonth();
					var columnIndex = new Date(order.timestamp).getMonth() - startMonth;
				} else {
					var columnIndex = Math.round((new Date(order.timestamp) - dateStart)/(1000 * 60 * 60 * 24));
				}
	
				if (!dateMode) {
					columnIndex *= 24;
	
					console.log('Hours', new Date(order.timestamp).getHours());
	
					columnIndex += new Date(order.timestamp).getHours();
				}
	
				var elRow = document.getElementById('neural-timeline').getElementsByTagName('tr')[rowIndex + 2];
	
				if (elRow) {
	
					var elCell = elRow.getElementsByTagName('td')[columnIndex];
	
					if (elCell) {
						columnTotals[columnIndex] = columnTotals[columnIndex] || 0;
						columnTotals[columnIndex] += order.costActual || 0;

						if (!groupTotals[order.group]) {
							groupTotals[order.group] = [];
						}

						groupTotals[order.group][columnIndex] = groupTotals[order.group][columnIndex] || 0;
						groupTotals[order.group][columnIndex] += order.costActual || 0;

						elCell.innerHTML = '<span>' + (order.costActual || 0).toLocaleString() + '</span>';
						rowTotals[i] = rowTotals[i] || 0;
						rowTotals[i] += order.costActual || 0;
						elCell.className = 'day ' + className;
						elCell.title = i + ': ' + new Date(order.timestamp) + ' (' + className + ')';
					}
				}
			}
		}

		var els = el.getElementsByTagName('tfoot')[0].getElementsByTagName('td');

		for (i = 1; i < els.length; i++) {
			if (typeof columnTotals[i - 1] != 'undefined') {
				els[i].textContent = (columnTotals[i - 1] || 0).toLocaleString();
			}
		}

		var grandTotal;

		for (i in rowTotals) {
			grandTotal = grandTotal || 0;
			grandTotal += rowTotals[i];
			document.getElementById('neural-total-' + i).innerHTML = '<span>' + rowTotals[i].toLocaleString() + '</span>';
		}
		
		if (typeof grandTotal == 'undefined') {
			document.getElementById('neural-timeline-button-update').disabled = true;
			document.getElementById('neural-timeline-container').tabIndex = -1;
			document.getElementsByClassName('neural-timeline-container-outer')[0].className += ' empty';
		} else {
			document.getElementById('neural-timeline-button-update').disabled = false;
			document.getElementById('neural-timeline-container').tabIndex = 0;
			document.getElementsByClassName('neural-timeline-container-outer')[0].className = document.getElementsByClassName('neural-timeline-container-outer')[0].className.replace(/ empty/g, '');
		}
		

		for (i in groupTotals) {
			el = document.getElementById('neural-timeline-group-' + i.replace(/\s/g, '_'));
			els = el.getElementsByTagName('td');
			
			var groupTotal = 0;

			for (var j = groupTotals[i].length; j--;) {
				if (typeof groupTotals[i][j] != 'undefined') {
					var elTotal = document.createElement('span');
					elTotal.className = 'neural-group-total';
					groupTotal += (groupTotals[i][j] || 0);
					elTotal.textContent = (groupTotals[i][j] || 0).toLocaleString();
	
					els[j].appendChild(elTotal);
					
				}

			}
			
			elTotal = elTotal.cloneNode(true);
			elTotal.textContent = groupTotal.toLocaleString();
			
			document.getElementById('neural-group-' + i.replace(/\s/g, '_')).getElementsByTagName('td')[0].appendChild(elTotal);
			
		}		

		document.getElementById('neural-timeline-grand-total').textContent = typeof grandTotal == 'undefined' ? '' : grandTotal.toLocaleString();

		console.log(groupTotals);

		cloneMap();

		// TODO: Break into two functions (populate and update)

		if (noRefresh) {
			return;
		}

		var cells = document.getElementById('neural-timeline').getElementsByTagName('td');

		var affectedCells = [];
		var affectedCells2 = [];

		for (var i = Math.round(cells.length / 3); i--;) {
			var cellIndex = Math.floor(Math.random() * cells.length);

			var cell = cells[cellIndex];

			if (cell.className == 'day' || cell.className == 'day stage' || cell.className == 'day monday' || cell.className == 'day stage monday' || cell.className == 'hour' || cell.className == 'month' || cell.className == 'month january' || cell.className == 'quarter') {
				cell.className += ' loading1';
				if (Math.random() > .5) {
					cell.className += ' blink';
				} else if (Math.random() > .5) {
					cell.className += ' blink2';
				}
				affectedCells.push(cell);
			}
		}

		for (var i = Math.round(cells.length / 5); i--;) {
			var cellIndex = Math.floor(Math.random() * cells.length);

			var cell = cells[cellIndex];

			if (cell.className == 'day' || cell.className == 'day stage' || cell.className == 'day monday' || cell.className == 'day stage monday' || cell.className == 'hour' || cell.className == 'month' || cell.className == 'month january' || cell.className == 'quarter') {
				cell.className += ' loading2';
				if (Math.random() > .5) {
					cell.className += ' blink';
				} else if (Math.random() > .5) {
					cell.className += ' blink2';
				}
				affectedCells.push(cell);
			}
		}


		for (var i = Math.round(cells.length / 9); i--;) {
			var cellIndex = Math.floor(Math.random() * cells.length);

			var cell = cells[cellIndex];

			if (cell.className == 'day' || cell.className == 'day stage' || cell.className == 'day monday' || cell.className == 'day stage monday' || cell.className == 'hour' || cell.className == 'month' || cell.className == 'month january' || cell.className == 'quarter') {
				cell.className += ' loading3';
				if (Math.random() > .3) {
					cell.className += ' blink';
				} else if (Math.random() > .3) {
					cell.className += ' blink2';
				}
				affectedCells.push(cell);
			}
		}


		for (var i = 700; i--;) {
			var cellIndex = Math.floor(Math.random() * cells.length);

			var cell = cells[cellIndex];

			if (cell.className == 'day' || cell.className == 'day stage' || cell.className == 'day monday' || cell.className == 'day stage monday' || cell.className == 'hour' || cell.className == 'month' || cell.className == 'month january' || cell.className == 'quarter') {
				cell.className += ' loading1';
				if (Math.random() > .5) {
					cell.className += ' blink';
				} else if (Math.random() > .5) {
					cell.className += ' blink2';
				}
				affectedCells2.push(cell);
			}
		}

		for (var i = 350; i--;) {
			var cellIndex = Math.floor(Math.random() * cells.length);

			var cell = cells[cellIndex];

			if (cell.className == 'day' || cell.className == 'day stage' || cell.className == 'day monday' || cell.className == 'day stage monday' || cell.className == 'hour' || cell.className == 'month' || cell.className == 'month january' || cell.className == 'quarter') {
				cell.className += ' loading2';
				if (Math.random() > .5) {
					cell.className += ' blink';
				} else if (Math.random() > .5) {
					cell.className += ' blink2';
				}
				affectedCells2.push(cell);
			}
		}


		for (var i = 100; i--;) {
			var cellIndex = Math.floor(Math.random() * cells.length);

			var cell = cells[cellIndex];

			if (cell.className == 'day' || cell.className == 'day stage' || cell.className == 'day monday' || cell.className == 'day stage monday' || cell.className == 'hour' || cell.className == 'month' || cell.className == 'month january' || cell.className == 'quarter') {
				cell.className += ' loading3';
				if (Math.random() > .3) {
					cell.className += ' blink';
				} else if (Math.random() > .3) {
					cell.className += ' blink2';
				}
				affectedCells2.push(cell);
			}
		}
		
		window.setTimeout(function() {
			var timeUnit = dateMode ? (dateMode == 2 ? 'month' : 'day') : 'hour';

			if (dateMode == 3) {
				timeUnit = 'quarter';
			}

			for (var i = affectedCells.length; i--;) {
				affectedCells[i].className = timeUnit + ' loading2';
			};

			window.setTimeout(function() {
				for (var i = affectedCells.length; i--;) {
					affectedCells[i].className = timeUnit + ' loading3';
				};

					
				window.setTimeout(function() {
					for (var i = affectedCells.length; i--;) {
						affectedCells[i].className = timeUnit;
					};

					document.getElementById('neural-timeline').className = document.getElementById('neural-timeline').className.replace(/ loading/, '');
				}, 300);
			}, 400);
		}, 500);

		window.setTimeout(function() {
			var timeUnit = dateMode ? (dateMode == 2 ? 'month' : 'day') : 'hour';
		
			for (var i = affectedCells2.length; i--;) {
				affectedCells2[i].className = timeUnit + ' loading2';
			};

			window.setTimeout(function() {
				for (var i = affectedCells2.length; i--;) {
					affectedCells2[i].className = timeUnit + ' loading3';
				};

					
				window.setTimeout(function() {
					for (var i = affectedCells2.length; i--;) {
						affectedCells2[i].className = timeUnit;
					};

					document.getElementById('neural-timeline').className = document.getElementById('neural-timeline').className.replace(/ loading/, '');
				}, 500);
			}, 400);
		}, 300);
	}
	
					var data = {
						orders: {
							"1003751": {
								timestamp: '2016-01-05T12:00Z',
								status: 1,
								group: 'Zero Demand',
								phaseName: 'Plan',
								stageName: 'Get Documents',
								customerId: 'customer1',
								programName: 'My Program',
								programId: 'program1',
								costActual: 3000
							}, "1003752": {
								timestamp: '2016-01-05T12:00Z',
								status: 1,
								group: 'Zero Demand',
								phaseName: 'Plan',
								stageName: 'Review Documents',
								customerId: 'customer1',
								programName: 'My Program',
								programId: 'program1',
								costActual: 30000
							}, "1003753": {
								timestamp: '2016-01-02T00:00Z',
								status: 2,
								group: 'Zero Demand',
								phaseName: 'Plan',
								stageName: 'Meeting Workshop 1',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1',
								costActual: 45000
							}, "1003754": {
								timestamp: '2016-04-05T16:00Z',
								status: 3,
								group: 'Zero Demand',
								phaseName: 'Plan',
								stageName: 'Meeting Workshop 2',
								customerId: 'customer1',
								programName: 'My Program',
								programId: 'program1'
							}, "1003755": {
								timestamp: '2016-04-05T16:00Z',
								status: 3,
								group: 'Zero Demand',
								phaseName: 'Plan',
								stageName: 'Return Draft',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003756": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'Zero Demand',
								phaseName: 'Plan',
								stageName: 'Update Draft',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003757": {
								timestamp: '2016-01-05T12:00Z',
								status: 1,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Issue Change Requests',
								customerId: 'customer1',
								programName: 'My Program',
								programId: 'program1'
							}, "1003758": {
								timestamp: '2016-01-05T12:00Z',
								status: 1,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Clean Up',
								customerId: 'customer1',
								programName: 'My Program',
								programId: 'program1'
							}, "1003759": {
								timestamp: '2016-01-01T14:00Z',
								status: 2,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Ship',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003760": {
								timestamp: '2016-04-05T16:00Z',
								status: 3,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 3',
								customerId: 'customer1',
								programName: 'My Program',
								programId: 'program1'
							}, "1003761": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 4',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003762": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 5',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003763": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 6',
								customerId: 'customer2',
								programName: 'My Program'
							}, "1003764": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 7',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003765": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 8',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}, "1003766": {
								timestamp: '2016-04-05T18:00Z',
								status: 4,
								group: 'E-Systems',
								phaseName: 'Define',
								stageName: 'Stage 9',
								customerId: 'customer2',
								programName: 'My Program',
								programId: 'program1'
							}
						}			
					};



					var isLeapYear = function() {
					    var year = this.getFullYear();
					    if((year & 3) != 0) return false;
					    return ((year % 100) != 0 || (year % 400) == 0);
					};
					
					// Get Day of Year
					var getDOY = function() {
					    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
					    var mn = this.getMonth();
					    var dn = this.getDate();
					    var dayOfYear = dayCount[mn] + dn;
					    if(mn > 1 && this.isLeapYear()) dayOfYear++;
					    return dayOfYear;
					};


				window.onresize = function() {
					var elContainer = document.getElementById('neural-timeline-container');
					document.getElementById('neural-timeline-slider').max = elContainer.scrollWidth - elContainer.clientWidth;
				}
				
				
				
				
						function updateMiniMap() {
			var el = document.getElementById('neural-timeline-minimap');
			var elTimeline = document.getElementById('neural-timeline');
			var elTimelineViewport = document.getElementById('neural-timeline-minimap-viewport'); 

			var width = elTimeline.clientWidth * .05;
			var height = elTimeline.clientHeight * .05;

			el.style.height = height + 'px';
			el.style.width = width + 'px';

			if (elTimeline.offsetWidth > elTimeline.parentNode.clientWidth) {
				width = elTimeline.parentNode.clientWidth * .05;
			}

			elTimelineViewport.style.height = height + 'px';
			elTimelineViewport.style.width = width + 'px';

			elTimelineViewport.style.left = (elTimeline.parentNode.scrollLeft * .05) + 'px';
		}

		function updateFakeSlider() {
			var elSlider = document.getElementById('neural-timeline-slider');

			$('#neural-timeline-slider2').val((+elSlider.value * 100) / +elSlider.max);
		}

		function updateYearCaption() {
			var year = dateStart.getFullYear();
			
			var v = +$('#neural-timeline-slider2').val();

			var daysToAdd = ((dateEnd - dateStart) * v)/(100000 * 60 * 60 * 24);

			daysToAdd = Math.round(daysToAdd * (document.getElementById('neural-timeline-container').scrollWidth - document.getElementById('neural-timeline-container').clientWidth) / document.getElementById('neural-timeline-container').scrollWidth);


			var d = addDays(dateStart, daysToAdd);

			for (var i in data.orders) {
				var programName = data.orders[i].programName;
				break;
			}

			if (3 == dateMode) {
				document.getElementById('neural-timeline-year').textContent = '';
			} else {
				document.getElementById('neural-timeline-year').textContent = dateMode == 5 ? 'My Phases' : d.getFullYear();
			}

			
		}

		function scrollToOrder(orderId) {
			scrollToDate(new Date(data.orders[orderId].timestamp));
		}

		function scrollToDate(dateTime) {
			var oldDateTime = dateTime;

			dateTime = new Date(oldDateTime.getFullYear(), oldDateTime.getMonth(), oldDateTime.getDate(), 0, 0, 0);

			scrollToDay(Math.round((dateTime - dateStart)/(1000 * 60 * 60 * 24)) + 1, oldDateTime.getHours());
		}

		function scrollToNow() {
			scrollToDate(new Date());
		}

		function scrollToDay(day, hour) {
			var timeUnit = dateMode ? (dateMode == 2 ? 'month' : 'day') : 'hour';

			if (dateMode) {
				var cellIndex = day - 1;
			} else {
				cellIndex = (day - 1) * 24 + (hour || 0);
			}

			var elDay = document.getElementById('neural-timeline').getElementsByClassName(timeUnit)[cellIndex];

			document.getElementById('neural-timeline-slider').value = '' + elDay.offsetLeft;

			document.getElementById('neural-timeline-container').scrollLeft = +document.getElementById('neural-timeline-slider').value;
		}
	
	var phases = [], stages = {};	

		window.onload = function() {
			// Theme takes a long time to load and initialize, so content hidden until ready.
			// Using load event to expose bloat and see progress as it is removed. Difference between ready and load will approach 0 for most pages.
			// Also to make sure all of the theme plugins are ready. Most will be removed in future. 

			document.documentElement.className += ' ready';

			document.getElementById('neural-timeline-container').onmousedown = onTimelineMouseDown;

			document.getElementById('neural-timeline-container').onkeydown = onTimelineKeyDown;

			document.getElementById('neural-timeline-container').focus();

			document.getElementById('neural-timeline-container').onmouseover = function (eventObject) {
				var elTarget = eventObject.target;

				/* if (elTarget.tagName.toLowerCase() == 'td' && elTarget.className.indexOf('-header') != -1 && elTarget.className.indexOf('stage') != -1) {
					elTarget.title = (elTarget.scrollWidth > elTarget.clientWidth) ? elTarget.textContent : '';
				}*/
			}

			document.getElementById('neural-timeline-container').onmousewheel = function (eventObject) {
		        if (!eventObject.ctrlKey) {
		            var delta = eventObject.wheelDelta / 20;
		
					var elSlider = document.getElementById('neural-timeline-slider');

		            var currentScrollPosition = +elSlider.value;

					elSlider.value = currentScrollPosition + delta;

					elSlider.onchange();

					if ((delta > 0 && currentScrollPosition != +elSlider.value) || (delta < 0 && currentScrollPosition)) {
						return false;
					}
		        }
		    };

			var direction = $("body").hasClass("rtl") ? "rtl" : "ltr";
			 
	        $(".nouislider_element").each(function(index) {
	            var val = $(this).attr('data-value') || 0;
	            
	            $(this).noUiSlider({
	                direction: direction,
	                start: val,
	                connect: "lower",
	                range: {
	                    'min': this.getAttribute('min') || 0,
	                    'max': this.getAttribute('max') || 100
	                }
	            });
	        });

			$('#neural-select-timeline-customer,#neural-select-timeline-program').on('change', function() {
				populateTimeline(true);

				window.onresize();

				if (dateMode != 5 && dateMode != 3 && dateMode != 2) {
					scrollToNow();
				}
	
				updateFakeSlider();
	
				updateMiniMap();

				updateYearCaption();
			});

			populateTimeline(true);

			window.onresize();

			if (dateMode != 5 && dateMode != 3 && dateMode != 2) {
				scrollToNow();
			}

			updateFakeSlider();

			updateMiniMap();

			updateYearCaption();

			$('#neural-timeline-slider2').on('change', function() {
				var el = document.getElementById('neural-timeline-slider');

				el.value = '' + Math.round(($(this).val() * el.max) / 100);

				document.getElementById('neural-timeline-container').scrollLeft = +el.value;

				updateYearCaption();

				updateMiniMap();
			});
		};