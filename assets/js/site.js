				function initializeApp() {
				
					// Theme takes a long time to load and initialize, so content hidden until ready.
					// Using load event to expose bloat and see progress as it is removed. Difference between ready and load will approach 0 for most pages.
					// Also to make sure all of the theme plugins are ready. Most will be removed in future. 
		
					document.documentElement.className += ' ready';
		
					$('.custom-tag-input').tagsinput({});
		
					$('#rtl-switch').on('change', function() {
						if (document.body.className.indexOf(' rtl') == -1) {
							document.body.className += ' rtl';
						} else {
							document.body.className = document.body.className.replace(/ rtl/g, '');
						}
					});
		
					document.getElementById('notification-option1').onclick = function (e) {
		                document.getElementById('notification-heading1').style.height = document.getElementById('notification-heading1').offsetHeight + 'px';
		                window.setTimeout(function () {
		                    document.getElementById('notification-heading1').className += ' hidden2';
		                }, 10);
		            };
		
		            document.getElementById('notification-option2').onclick = function (e) {
		                document.getElementById('notification-heading2').style.height = document.getElementById('notification-heading2').offsetHeight + 'px';
		                window.setTimeout(function () {
		                    document.getElementById('notification-heading2').className += ' hidden2';
		                }, 10);
		            };
		
		            document.getElementById('notification-option3').onclick = function (e) {
		                document.getElementById('notification-heading3').style.height = document.getElementById('notification-heading3').offsetHeight + 'px';
		                window.setTimeout(function () {
		                    document.getElementById('notification-heading3').className += ' hidden2';
		                }, 10);
		            };
		
		            document.getElementById('notification-option4').onclick = function (e) {
		                document.getElementById('notification-heading4').style.height = document.getElementById('notification-heading4').offsetHeight + 'px';
		                window.setTimeout(function () {
		                    document.getElementById('notification-heading4').className += ' hidden2';
		                }, 10);
		            };
		            
		            $('.switchery-small').on('click', function() {
		            	var el = this.parentNode.getElementsByTagName('input')[0];
		            	
		            	if (el.checked) {
		            		this.className = this.className.replace(/ off/g, '');
		            	} else {
		            		this.className += ' off';
		            	}
		            });
		            
		            $('.switchery-small').each(function(i, el) {
		            	var elInput = this.parentNode.getElementsByTagName('input')[0];
		            	
		            	if (elInput.checked) {
		            		el.className = this.className.replace(/ off/g, '');
		            	} else {
		            		el.className += ' off';
		            	}
		            });
		            
		            $('[data-pages="search"]').search({
			            // Bind elements that are included inside search overlay
			            searchField: '#overlay-search',
			            closeButton: '.overlay-close',
			            suggestions: '#overlay-suggestions',
			            brand: '.brand',
			             // Callback that will be run when you hit ENTER button on search box
			            onSearchSubmit: function(searchString) {
			                console.log("Search for: " + searchString);
			            },
			            // Callback that will be run whenever you enter a key into search box. 
			            // Perform any live search here.  
			            onKeyEnter: function(searchString) {
			                console.log("Live search for: " + searchString);
			                var searchField = $('#overlay-search');
			                var searchResults = $('.search-results');
			
			                /* 
			                    Do AJAX call here to get search results
			                    and update DOM and use the following block 
			                    'searchResults.find('.result-name').each(function() {...}'
			                    inside the AJAX callback to update the DOM
			                */
			
			                // Timeout is used for DEMO purpose only to simulate an AJAX call
			                clearTimeout($.data(this, 'timer'));
			                searchResults.fadeOut("fast"); // hide previously returned results until server returns new results
			                var wait = setTimeout(function() {
			
			                    searchResults.find('.result-name').each(function() {
			                        if (searchField.val().length != 0) {
			                            $(this).html(searchField.val());
			                            searchResults.fadeIn("fast"); // reveal updated results
			                        }
			                    });
			                }, 500);
			                
			                $(this).data('timer', wait);
			            }
			        });
			        
			        // Ugly Pages hack. TODO: Remove and replace with something competent (or bypass altogether)
			        
			        $('.panel-collapse label').on('click', function(e) {
			        	e.stopPropagation();
			   		});
			    }
			    
			    function onBadgeMouseOver(eventObject) {
			    	var elTarget = eventObject.target;
			    	
			    	if (elTarget !== this && elTarget.tagName.toLowerCase() == 'span') {
			    		elTarget.title = elTarget.scrollWidth > elTarget.clientWidth ? elTarget.textContent : '';
			    	}
			    }
			    			
				// Call initially (before drawing) and after closing alert popup
			
				function populateManagementBadges(selectedId) {
					var el = document.getElementById('neural-management-badges');
					
					if (!el.onmouseover) {
						el.onmouseover = onBadgeMouseOver;
					}
					
					document.getElementById('neural-management-badges').innerHTML = '';

					var html = '';

					for (var i in data) {
					
						// FIXME: HTML encode name and ID

						if (!selectedId || selectedId == i) {
							var name = data[i][2];
							html += '<div data-id="' + i + '" data-name="' + name + '" class="neural-management-badge" onclick="onBadgeClick(this);"><span style="margin-left: 10px;width: 160px;overflow: hidden;text-overflow: ellipsis;display: block;white-space: nowrap;">' + name + '</span><span class="neural-management-badge-status">Status</span><span class="neural-badge badge-first">1st</span><span class="neural-badge badge-second">2nd</span><span class="neural-avatar neural-avatar-first" id="neural-avatar1"><span class="neural-avatar-status neural-success"></span></span><span class="neural-avatar neural-avatar-second" id="neural-avatar2"><span class="neural-avatar-status neural-failure"></span></span></div>';
						}
					}

					document.getElementById('neural-management-badges').innerHTML = html;
				}

				function onSuggestClick(eventObject) {
					var target = eventObject.target;

					if (3 == target.nodeType) {
						target = target.parentNode;
					}

					if ('neural-search-suggest-item' == target.className) {
						document.getElementById('search-organization-people').value = document.getElementById('search-organization-people2').value = target.textContent;						
						onOrderSearchKeyUp(eventObject);
						document.getElementById('neural-search-suggest').className = '';
					}
				};

				function onOrderSearchKeyUp(eventObject) {
					if (eventObject.keyCode == 27) {
						document.getElementById('neural-search-suggest').className = '';
						return;
					}

					var value = document.getElementById('search-organization-people2').value.replace(/\s+$/, '').toLowerCase();
					var els = document.getElementsByClassName('node');

					var foundSomething = false;

					var customersSuggested = {}, vendorsSuggested = {}, orderIdsSuggested = {}, orderItemIdsSuggested = {};
					var customersHtml = vendorsHtml = orderIdsHtml = orderItemIdsHtml = '';

					var stationsToShow = {};

					for (var i in dataOrders.orders) {
						var filtered = false;
						
						var order = dataOrders.orders[i];
						var name = order.name;
						var orderItems = {};
						for (o in dataOrders.items) {
							var item = dataOrders.items[o];

							if (item.orderId == name) {
								orderItems[o] = item;
							}		
						}

						console.log(order);
						console.log(orderItems);

						var customerFilter = document.getElementById('neural-filter-role').value.replace(/^\s+/, '').replace(/\s+$/, '');
						var orderIdFilter = document.getElementById('neural-filter-skill').value.replace(/^\s+/, '').replace(/\s+$/, '');
						var orderItemIdFilter = document.getElementById('neural-filter-responsibility').value.replace(/^\s+/, '').replace(/\s+$/, '');
						var vendorFilter = document.getElementById('neural-filter-location').value.replace(/^\s+/, '').replace(/\s+$/, '');

						if (customerFilter && order.customer.toLowerCase() != customerFilter) {
							filtered = true;
						} else if (orderIdFilter && id != orderIdFilter) {
							filtered = true;
						} else if (orderItemIdFilter) {
							var foundMatchingItemId = false;

							for (o in orderItems) {
								if (o == orderItemIdFilter) {
									foundMatchingItemId = true;
								}
							}

							if (!foundMatchingItemId) {
								filtered = true;
							}
						} else if (vendorFilter && order.vendor.toLowerCase() != vendorFilter) {
							filtered = true;
						}

						// If not filtered by filter controls...

						if (!filtered) {

							filtered = value && name.indexOf(value) == -1;

							if (filtered) {
								filtered = order.customer.toLowerCase().indexOf(value) == -1 && order.vendor.toLowerCase().indexOf(value) == -1 && i.toLowerCase().indexOf(value) == -1;

								if (filtered) {

									for (o in orderItems) {
										if (o.toLowerCase().indexOf(value) != -1) {
											filtered = false;
										}
									}

								}

							}

						}

						if (!filtered) {
								foundSomething = true;

								stationsToShow[i] = true;

								// TODO: HTML encode name

								if (!customersSuggested.hasOwnProperty(order.customer)) {	
									customersSuggested[order.customer] = true;
									customersHtml += '<div class="neural-search-suggest-item">' + order.customer + '</div>';
								}

								if (!vendorsSuggested.hasOwnProperty(order.vendor)) {
									vendorsSuggested[order.vendor] = true;
									vendorsHtml += '<div class="neural-search-suggest-item">' + order.vendor + '</div>';
								}

								if (!orderIdsSuggested.hasOwnProperty(i)) {	
									orderIdsSuggested[i] = true;
									orderIdsHtml += '<div class="neural-search-suggest-item">' + i + '</div>';
								}

								for (o in orderItems) {
									if (!orderItemIdsSuggested.hasOwnProperty(o)) {
										orderItemIdsSuggested[o] = true;
	
										orderItemIdsHtml += '<div class="neural-search-suggest-item">' + o + '</div>';
									}
								}
							}
					}

					if (foundSomething && value) {
						var result = '<div class="neural-search-suggest-category">Customers</div>' + customersHtml + '<div class="neural-search-suggest-category">Order ID</div>' + orderIdsHtml + '<div class="neural-search-suggest-category">Order Items</div>' + orderItemIdsHtml + '<div class="neural-search-suggest-category">Vendors</div>' + vendorsHtml

						document.getElementById('neural-search-suggest').innerHTML = result;
						document.getElementById('neural-search-suggest').className = 'shown';
					} else {
						document.getElementById('neural-search-suggest').className = '';
					}

					var els = document.getElementsByClassName('marker');

					for (var i = els.length; i--;) {
						el = els[i];
						var elDot = el.getElementsByTagName('circle')[0];

						var visibilityNew = stationsToShow[elDot.id] ? '' : 'hidden';

						el.style.visibility = visibilityNew;

						var elLinks = document.getElementsByClassName('path');

						/*for (var l = elLinks.length; l--;) {
							if (!elLinks[l].className && elLinks[l].id) {
								var ids = elLinks[l].id.split('-');
								if (ids[0] == elDot.id || ids[1] == elDot.id) {
									elLinks[l].style.visibility = visibilityNew;
									document.getElementById('backdrop-' + elLinks[l].id).style.visibility = visibilityNew;	
								}
							}
						}*/
					}
				}

				function onSearchKeyUp(elInput, autoSuggest, offsets) {
					var value = elInput.value.toLowerCase().replace(/^\s+/, '').replace(/\s+$/, '');
					var id = elInput.id.slice(7);
					
					var els = document.getElementById('neural-' + id).getElementsByClassName('neural-management-badge');

					var isPeopleSearch = elInput.id != 'search-management-badges';

					if (isPeopleSearch) {
						var roleFilter = document.getElementById('neural-filter-role').value.replace(/^\s+/, '').replace(/\s+$/, '');
						var skillFilter = document.getElementById('neural-filter-skill').value.replace(/^\s+/, '').replace(/\s+$/, '');
						var responsibilityFilter = document.getElementById('neural-filter-responsibility').value.replace(/^\s+/, '').replace(/\s+$/, '');
						var locationFilter = document.getElementById('neural-filter-location').value.replace(/^\s+/, '').replace(/\s+$/, '');
					} else {
						var elMap = document.getElementById('map2').style.visibility == 'hidden' ? document.getElementById('map') : document.getElementById('map2');
					}

					var foundSomething = false;

					var peopleSuggested = {}, skillsSuggested = {}, responsibilitiesSuggested = {}, rolesSuggested = {};
					var peopleHtml = skillsHtml = responsibilitiesHtml = rolesHtml = '';
					
					for (var i = els.length; i--;) {
						var el = els[i];

						var filtered = false;

						var name = el.getAttribute('data-name').toLowerCase(), idStation = el.getAttribute('data-id');

						if (isPeopleSearch) {

							var role = el.getAttribute('data-role').toLowerCase();
							var phone = el.getAttribute('data-phone').toLowerCase();
							var responsibilities = el.getAttribute('data-responsibilities').toLowerCase().split(',');
							var skills = el.getAttribute('data-skills').toLowerCase().split(',');
	
							var location = '';
	
							if (-1 != phone.indexOf('-513-')) {
								location = 'cincinnati';
							} else if (-1 != phone.indexOf('-650-')) {
								location = 'san jose';
							}

							if (roleFilter && role != roleFilter) {
								filtered = true;
							} else if (locationFilter && location != locationFilter) {
								filtered = true;
							} else if (skillFilter && skills.indexOf(skillFilter) == -1) {
								filtered = true;
							} else if (responsibilityFilter && responsibilities.indexOf(responsibilityFilter) == -1) {
								filtered = true;
							}
						}

						// If not filtered by filter controls...

						if (!filtered) {

							// Filtered if no name, role, phone or location input match

							filtered = name.indexOf(value) == -1;
							
							if (!isPeopleSearch) {
								filtered = filtered && idStation.toLowerCase().indexOf(value) == -1;
							}

							if (filtered && isPeopleSearch) {
								filtered = role.indexOf(value) == -1 && phone.indexOf(value) == -1 && location.indexOf(value) == -1;
							}

							// If couldn't find a match...

							if (filtered && isPeopleSearch) {

								// Loop through skills and responsibilities

								skills.forEach(function(d) {
									if (d.indexOf(value) != -1) {
										filtered = false;
									}
								});
												
								responsibilities.forEach(function(d) {
									if (d.indexOf(value) != -1) {
										filtered = false;
									}
								});								
							}
						}

						if (filtered) {
							el.className = 'neural-management-badge filtered';
						} else {
							if (isPeopleSearch) {
								foundSomething = true;

								// TODO: HTML encode name

								if (!peopleSuggested.hasOwnProperty(name)) {	
									peopleSuggested[name] = true;
									peopleHtml += '<div class="neural-search-suggest-item">' + name + '</div>';
								}

								if (!rolesSuggested.hasOwnProperty(role)) {	
									rolesSuggested[role] = true;
									rolesHtml += '<div class="neural-search-suggest-item">' + role + '</div>';
								}

								for (j = skills.length; j--;) {
									if (!skillsSuggested.hasOwnProperty(skills[j])) {
										skillsSuggested[skills[j]] = true;
	
										skillsHtml += '<div class="neural-search-suggest-item">' + skills[j] + '</div>';
									}
								}
	
								for (j = responsibilities.length; j--;) {
									if (!responsibilitiesSuggested.hasOwnProperty(responsibilities[j])) {
										responsibilitiesHtml += '<div class="neural-search-suggest-item">' + responsibilities[j] + '</div>';

										responsibilitiesSuggested[responsibilities[j]] = true;
									}
								}
							} else {
								var offsetX, offsetY;
								
								if (offsets) {
									offsetX = offsets[0];
									offsetY = offsets[1];
								}
			    
			    				if (!document.getElementById('neural-setting-search-all').checked) {
			    				
				    				var elStation = document.getElementById('google-' + idStation);
				    				
				    				if (elStation) {
				    					var x = parseFloat(elStation.parentNode.style.left) + (offsetX || 0);
										var y = parseFloat(elStation.parentNode.style.top) + (offsetY || 0);
							    	
							    		filtered = !(x < elMap.clientWidth && y < elMap.clientHeight && x > -20 && y > -20);
				    				}
			    				}
							}
							
							el.className = 'neural-management-badge ' + (filtered ? ' filtered' : '');
						}
					}

					if (foundSomething && value && autoSuggest) {
						var result = '<div class="neural-search-suggest-category">Customers</div>' + peopleHtml + '<div class="neural-search-suggest-category">Order ID</div>' + responsibilitiesHtml + '<div class="neural-search-suggest-category">Order Items</div>' + rolesHtml + '<div class="neural-search-suggest-category">Vendors</div>' + skillsHtml

						document.getElementById('neural-search-suggest').innerHTML = result;
						document.getElementById('neural-search-suggest').className = 'shown';
					} else {
						document.getElementById('neural-search-suggest').className = '';
					}

					// *** Only show orders with customers on this filtered list
				}

				function toggleQuickView(tabIndex, keepOpen) {
					var el = document.getElementById('builder');

					var totalTabstrips = el.getElementsByClassName('nav-tabs').length;

					var tabstrips = [], footers = [], panels1 = [], panels2 = [], toggles = [];

					var panelIndex = '';

					for (var i = totalTabstrips; i--;) {
						if (i) {
							panelIndex = String(i + 1);
						} else {
							panelIndex = '';
						}

						tabstrips.unshift(document.getElementById('tabstrip' + (i + 1)));
						toggles.unshift(document.getElementById('builder-toggle' + (i + 1)));
						footers.unshift(document.getElementById('quickview-footer' + (i + 1)));

						panels1.unshift(document.getElementById('tabLayouts' + panelIndex));
						panels2.unshift(document.getElementById('tabThemes' + panelIndex));
					}

					if (-1 == el.className.indexOf(' open')) {
						el.className += ' open';

						tabstrips.forEach(function(el, i) {
							el.style.display = i == tabIndex ? '' : 'none';
						});

						footers.forEach(function(el, i) {
							el.style.display = i == tabIndex ? '' : 'none';
						});

						panels1.forEach(function(el, i) {
							el.style.display = i == tabIndex ? '' : 'none';
						});

						panels2.forEach(function(el, i) {
							el.style.display = i == tabIndex ? '' : 'none';
						});
					} else {
						if (!keepOpen && panels1[tabIndex].style.display != 'none') {
							el.className = el.className.replace(/ open/g, '');
							hideContactPane();
						} else {
							tabstrips.forEach(function(el, i) {
								el.style.display = i == tabIndex ? '' : 'none';
							});
	
							footers.forEach(function(el, i) {
								el.style.display = i == tabIndex ? '' : 'none';
							});
	
							panels1.forEach(function(el, i) {
								el.style.display = i == tabIndex ? '' : 'none';
							});
	
							panels2.forEach(function(el, i) {
								el.style.display = i == tabIndex ? '' : 'none';
							});
						}
					}

					el.className = el.className.replace(/ neural-organization/g, '').replace(/ neural/g, '');

					if (tabIndex) {
						if (tabIndex == 1) {
							el.className += ' neural';
						} else {
							el.className += ' neural-organization';
						}
					}

					toggles.forEach(function(el, i) {
						if (i == tabIndex) {
							el.className += ' pressed';
						} else {
							el.className = el.className.replace(/ pressed/g, '');
						}
					})

					synchronizeTabPanes();

					// If Organization tab and not closing QuickView...

					if (2 == tabIndex && -1 != el.className.indexOf(' open')) {
						var el = document.getElementById('neural-organization-people');
						
						// If any people selected...

						if (el.getElementsByClassName('selected').length) {
							showContactPane();
						}
					} else {
						hideContactPane();
					}
				}

				// Called after switching outer tabs

				function synchronizeTabPanes() {
					var els = document.getElementById('builder').getElementsByClassName('tab-pane');
					
					for (var i = els.length; i--;) {
						var el = els[i];

						if (el.id != 'tabContent') {

							var elButton = document.getElementById('button-' + el.id);

							el.className = elButton.parentNode.className.indexOf('active') == -1 ? 'tab-pane' : 'tab-pane active';

							var elButton = document.getElementById('button-' + el.id);

							el.className = elButton.parentNode.className.indexOf('active') == -1 ? 'tab-pane' : 'tab-pane active';
						}
					}
				}

				function switchTabs(el) {
					var tabId = el.id.slice(7);
					var elPane = document.getElementById(tabId);

					var totalTabstrips = el.parentNode.parentNode.parentNode.getElementsByClassName('nav-tabs').length;

					var tabstrips = [], footers = [], panels1 = [], panels2 = [], toggles = [];

					var panelIndex = '';

					for (var i = totalTabstrips; i--;) {
						if (i) {
							panelIndex = String(i + 1);
						} else {
							panelIndex = '';
						}

						tabstrips.unshift(document.getElementById('tabstrip' + (i + 1)));
						toggles.unshift(document.getElementById('builder-toggle' + (i + 1)));
						footers.unshift(document.getElementById('quickview-footer' + (i + 1)));

						panels1.unshift(document.getElementById('tabLayouts' + panelIndex));
						panels2.unshift(document.getElementById('tabThemes' + panelIndex));
					}

					var elParent = el.parentNode.parentNode;
					var els = elParent.getElementsByTagName('a');

					for (var i = els.length; i--;) {
						els[i].parentNode.className = els[i] === el ? 'active': '';
					}

					panels1.forEach(function(elPanel) {
						elPanel.className = elPanel.id === tabId ? 'tab-pane active' : 'tab-pane';
					});

					panels2.forEach(function(elPanel) {
						elPanel.className = elPanel.id === tabId ? 'tab-pane active' : 'tab-pane';
					});
				}

				function onBadgeClick(el) {
					if (document.getElementById('neural-setting-alerts').checked) {
						el.className += ' selected';
						var elParent = el.parentNode;
	
						var els = elParent.getElementsByTagName('div');
	
						for (i = els.length; i--;) {
							if (els[i] !== el) {
								els[i].className = els[i].className.replace(/ selected/g, '');
							}
						}
	
						//el.style.backgroundPosition = '40000px 8px';					
					}
				}

				function onContactClick(el) {
					onBadgeClick(el);

					var name = el.getAttribute('data-name');
					var role = el.getAttribute('data-role');
					var phone = el.getAttribute('data-phone');

					document.getElementById('neural-contact-name').textContent = name;
					document.getElementById('neural-contact-role').textContent = role;
					document.getElementById('neural-contact-phone').textContent = phone;

					showContactPane();					
				}

				function showContactPane() {
					document.getElementById('neural-contact-pane').className = 'shown';
				}

				function hideContactPane() {
					document.getElementById('neural-contact-pane').className = '';
				}

				function toggleFirstQuickView() {
					toggleQuickView(0);
				}

				function toggleThirdQuickView() {
					toggleQuickView(2);
				}

				function toggleSecondQuickView() {
					toggleQuickView(1);
				}
				
				function toggleDesignerPinned() {
					var el = document.body, className = el.className;
					
					if (className.indexOf(' neural-designer-pinned') == -1) {
						el.className += ' neural-designer-pinned';
					} else {
						el.className = el.className.replace(/ neural-designer-pinned/g, '');
					}
				}
				
				function toggleDesigner() {
					var el = document.body, className = el.className;
					
					if (className.indexOf(' neural-designer-open') == -1) {
						el.className += ' neural-designer-open';
					} else {
						el.className = el.className.replace(/ neural-designer-open/g, '');
					}
					
				}

				
								function shuffle (array) {
					  var i = 0
					    , j = 0
					    , temp = null
					
					  for (i = array.length - 1; i > 0; i -= 1) {
					    j = Math.floor(Math.random() * (i + 1))
					    temp = array[i]
					    array[i] = array[j]
					    array[j] = temp
					  }
					}
				
					function scrambleText(text) {
						var a = text.split('');
				
						//a = a.reverse();
				
						shuffle(a);
				
						return a.join('');
					}
				
					function scrambleElement(el, text) {
						var text = el.textContent;
				
						el.setAttribute('data-text', text);
				
						el.textContent = scrambleText(text);
					}
					
					function scrambleElementsByClassName(className) {
						var els = document.getElementsByClassName(className);
						
						for (var i = els.length; i--;) {
							scrambleElement(els[i]);
						}
					}
					
					function unscrambleElementsByClassName(className) {
						var els = document.getElementsByClassName(className);
						
						for (var i = els.length; i--;) {
							unscrambleElement(els[i]);
						}
					}
				
					function unscrambleElement(el) {
						el.textContent = el.getAttribute('data-text');
				    }
				
					function onUnlockButtonClick() {
						var password = document.getElementById('neural-unprotect-password').value;
						if ('test' == password) {
							unscrambleElementsByClassName('neural-data');
							pageLocked = false;
							document.getElementById('neural-protect').textContent = 'PROTECT INFORMATION';
							document.getElementById('neural-protect').className = 'neural-protect unlocked';
						} else {
							window.alert('Access denied!');
						}
					}
				
					function unlockPage() {
						$('#neural-dialog-password').modal('show');
						window.setTimeout(function() {
							document.getElementById('neural-unprotect-password').focus();
							document.getElementById('neural-unprotect-password').select();
						}, 500);
						
						//password = window.prompt('Please enter the password to unprotect information.');
					}
				
function navigateToBookmark(id) {
	window.location.href = '#' + id;
}
				
function toggleCompactPerspective() {
	if (document.documentElement.className.indexOf('neural-compact neural-compact-minimal') == -1) {
		document.documentElement.className += ' neural-compact neural-compact-minimal';
	} else {
		document.documentElement.className = document.documentElement.className.replace(/ neural-compact neural-compact-minimal/, '');
	}
}


				function toggleHiddenFields() {
					var el = document.getElementById('neural-hidden-fields');
					var elButton = document.getElementById('neural-button-hidden-fields');
					var elCaption = document.getElementById('neural-hidden-fields-caption');

					if (!el.style.height) {
						el.style.height = el.offsetHeight + 'px';
					}

					elButton.className = el.className ? '' : 'neural-active';

					document.getElementById('neural-caption-hide-fields').textContent = elButton.className ? 'Show Fields' : 'Hide Fields'; 

					window.setTimeout(function() {

						if (el.className) {
							document.body.className = document.body.className.replace(/ neural-hidden-fields-hidden/, '');
						} else {
							document.body.className += ' neural-hidden-fields-hidden';
						}

						el.className = el.className ? '' : 'neural-hidden';
					}, 1);
				}
