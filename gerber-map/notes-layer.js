(function () {

    var commentMarkers = {};
    var rulerMarkers = {};
    var lastRulerId = 0;
    var lastCommentId = 0;
    var isToolsOn = false;
    var startLatlng = null;
    var _map = null;
    var usedToolType = null;
    var commentsStorage;
    var rulerStorage;
    var popupCreator;
    var setPopupCreatorCommentId;

    // gerber viewer tools namespace
    L.GvNotesTools = {};

    L.GvNotesTools.NotesToolsControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            _map = map;

            var control = L.DomUtil.create('div', 'leaflet-control');

            var circleControl = L.DomUtil.create('div', 'map-tool comment', control);
            circleControl.innerHTML = '<div>Comment</div>';

            L.DomEvent.addListener(circleControl, 'click', function (e) {
                usedToolType = 'circle';
                onClickControl(e);
            });

            var rulerControl = L.DomUtil.create('div', 'map-tool measure', control);
            rulerControl.innerHTML = '<div>Measure</div>';

            L.DomEvent.addListener(rulerControl, 'click', function (e) {
                usedToolType = 'ruler';
                onClickControl(e);
            });

            return control;
        }
    });

    L.GvNotesTools.NotesLayer = L.Class.extend({

        initialize: function (map) {
            _map = map;
            commentsStorage = new MarkerStorage('comments.json');
            rulerStorage = new MarkerStorage('lines.json');
        },
        onRemove: function (map) {
        },
        onAdd: function (map) {
            this._initStorages();
            this._initPopupCreator();
        },
        _initStorages: function () {
            var overlays;

            var maxCommentId = lastCommentId;
            commentMarkers = commentsStorage.getAll();
            commentMarkers.forEach(function (marker) {
                if (marker._id > maxCommentId) {
                    maxCommentId = marker._id;
                }
                overlays = addComment(marker);
                addCommentPopup(marker, overlays[0]);
            });
            lastCommentId = maxCommentId;

            var maxRulerId = lastRulerId;
            rulerMarkers = rulerStorage.getAll();
            rulerMarkers.forEach(function (marker) {
                if (marker._id > maxRulerId) {
                    maxRulerId = marker._id;
                }
                overlays = addRuler(marker);
                addRulerPopup(marker, overlays[0]);
            });
            lastRulerId = maxRulerId;
        },
        _initPopupCreator: function () {
            var content = L.DomUtil.create('div', 'popup-comment');
            content.innerHTML =
                '<div class="number-circle"><span id="markerId"></span></div>' +
                '<select id="commentType">' +
                '   <option value="Problem">Problem</option>' +
                '   <option value="Suggestion">Suggestion</option>' +
                '</select>' +
                '<br/>' +
                '<textarea placeholder="Write a description" autofocus maxlength="500"></textarea>' +
                '<br/>' +
                '<input type="button" value="Save">' +
                '<input type="button" value="Cancel">'
            ;

            popupCreator = L.popup()
                .setContent(content);

            setPopupCreatorCommentId = function (markerIdContent) {
                markerId.innerHTML = markerIdContent;
            };

            var markerId = content
                .getElementsByClassName('number-circle')[0]
                .getElementsByTagName('span')[0];
            var select = content.getElementsByTagName('select')[0];
            var textarea = content.getElementsByTagName('textarea')[0];
            var inputs = content.getElementsByTagName('input');

            L.DomEvent.addListener(inputs[0], 'click', function (e) {
                markerId.innerHTML = (++lastCommentId);
                var endLatlng = popupCreator.getLatLng();
                var distanceMeters = endLatlng.distanceTo(startLatlng);// in meters
                var commentMarker = {
                    _id: lastCommentId,
                    _centerLatlng: startLatlng,
                    _radius: distanceMeters * 1000,
                    title: select.value,
                    body: textarea.value,
                    author: 'jimb@jim.com',
                    date: _formatDate(new Date())
                };
                commentsStorage.saveOne(commentMarker);
                var overlays = addComment(commentMarker);
                addCommentPopup(commentMarker, overlays[0]);
                // .openOn(_map);

                popupCreator._close();
                _clearPopupCreator();
                startLatlng = null;
            });
            L.DomEvent.addListener(inputs[1], 'click', function (e) {
                popupCreator._close();
                _clearPopupCreator();
                startLatlng = null;
            });

            function _clearPopupCreator() {
                select.value = 'Problem';
                textarea.value = '';
                markerId.innerHTML = '';
            }

        }
    });

    function onClickControl(e) {
        if (!isToolsOn) {
            _map.dragging.disable();
            isToolsOn = true;
            setCursor();
            _map.once('mousedown', onMousedown);
        } else {
            _map.dragging.enable();
            isToolsOn = false;
            resetCursor();
            _map.off('mousedown', onMousedown);
        }
    }

    function setCursor() {
        var leafletContainer = document.getElementsByClassName('leaflet-container');
        leafletContainer[0].classList.add('crosshair-cursor');

        var leafletClickable = document.getElementsByClassName('leaflet-clickable');
        for (var i = 0; i < leafletClickable.length; ++i) {
            leafletClickable[i].classList.add('crosshair-cursor');
        }
    }

    function resetCursor() {
        var leafletContainer = document.getElementsByClassName('leaflet-container');
        leafletContainer[0].classList.remove('crosshair-cursor');

        var leafletClickable = document.getElementsByClassName('leaflet-clickable');
        for (var i = 0; i < leafletClickable.length; ++i) {
            leafletClickable[i].classList.remove('crosshair-cursor');
        }
    }

    function onMousedown(e) {
        _map.once('mouseup', onMouseup);
        _map.on('mousemove', onMousemove);
        startLatlng = e.latlng;
    }

    function onMouseup(e) {
        if (!isToolsOn) {
            return;
        }

        _removeDrawableElements();

        if (startLatlng) {
            var endLatlng = e.latlng;

            if (usedToolType === 'circle') {
                setPopupCreatorCommentId(lastCommentId + 1);
                popupCreator
                    .setLatLng(endLatlng)
                    .openOn(_map);
            } else  /*if (usedToolType === 'ruler')*/ {
                var distanceMeters = endLatlng.distanceTo(startLatlng);// in meters
                var rulerMarker = {
                    _id: ++lastRulerId,
                    _startLatlng: startLatlng,
                    _endLatlng: endLatlng,
                    reason: 'reason',
                    distance: distanceMeters * 1000
                };
                rulerStorage.saveOne(rulerMarker);
                var overlays = addRuler(rulerMarker);
                addRulerPopup(rulerMarker, overlays[0])
                    .openOn(_map);
                startLatlng = null;
            }
        }

        _map.off('mousemove', onMousemove);
        _map.dragging.enable();
        isToolsOn = false;
        resetCursor();
    }

    var drawableElements = [];

    function _removeDrawableElements() {
        if (drawableElements.length > 0) {
            drawableElements.forEach(function (drawableElement) {
                _map.removeLayer(drawableElement);
            });
        }
    }

    function onMousemove(e) {
        _removeDrawableElements();

        var endLatlng = e.latlng;
        var distanceMeters = endLatlng.distanceTo(startLatlng);// in meters

        if (usedToolType === 'circle') {
            var commentMarker = {
                _id: null,
                _centerLatlng: startLatlng,
                _radius: distanceMeters * 1000
            };
            drawableElements = addComment(commentMarker);
        } else  /*if (usedToolType === 'ruler')*/ {
            var rulerMarker = {
                _id: null,
                _startLatlng: startLatlng,
                _endLatlng: endLatlng
                // ,distance: distanceMeters * 1000
            };
            drawableElements = addRuler(rulerMarker);
        }
    }

    function addComment(marker) {
        var circle = L.circle(marker._centerLatlng, marker._radius / 1000, {
            color: "orange",
            fillOpacity: 0.0,
            opacity: 1
        });
        circle.addTo(_map);
        return [circle];
    }

    function addRuler(marker) {
        var tailOptions = {
            opacity: 1,
            color: 'black',
            weight: 1,
            fillColor: 'black',
            fillOpacity: 1
        };
        var radius = 3;

        var startTail = L.circleMarker(marker._startLatlng, tailOptions)
            .setRadius(radius)
            .addTo(_map);

        var endTail = L.circleMarker(marker._endLatlng, tailOptions)
            .setRadius(radius)
            .addTo(_map);

        var line = L.polyline([marker._startLatlng, marker._endLatlng], {
            opacity: 1,
            color: 'black',
            weight: 3
        });
        line.addTo(_map);
        return [line, startTail, endTail];
    }

    function addCommentPopup(marker, overlay/*Path class*/) {
        var content = L.DomUtil.create('div', 'popup-comment');
        content.innerHTML =
            '<div class="comment-header">' +
            '   <div class="number-circle"><span>' + marker._id + '</span></div>' +
            '   <h4>' + marker.title + '</h4>' +
            '</div>' +
            '<p class="comment-description"><b>' + marker.body + '</b></p>' +
            '<div class="comment-info"><b>Author:</b> ' + marker.author + '</div>' +
            '<div class="comment-info"><b>Date:</b> ' + marker.date + '</div>';

        var popup = L.popup()
            .setLatLng(marker._centerLatlng)
            .setContent(content);

        overlay.bindPopup(popup);

        return popup;
    }

    function addRulerPopup(marker, overlay/*Path class*/) {
        var content = L.DomUtil.create('div', 'popup-comment');
        content.innerHTML = '<b>Distance:</b>' + marker.distance.toFixed(2) + ' mm';

        var middle = L.latLng(
            (marker._endLatlng.lat + marker._startLatlng.lat) / 2,
            (marker._endLatlng.lng + marker._startLatlng.lng) / 2
        );

        var popup = L.popup()
            .setLatLng(middle)
            .setContent(content);

        overlay.bindPopup(popup);

        return popup;
    }

    function MarkerStorage(storageName) {
        var _this = this;
        this._storageName = storageName;
        this._markers = {};// map: markerId -> marker
        _getMarkers();

        this.getAll = _getMarkers;
        this.saveOne = _saveMarker;
        this.removeOne = _removeMarker;

        function _getMarkers() {
            return JSON.parse(localStorage.getItem(_this._storageName)) || [];
        }

        function _saveMarker(marker) {
            _this._markers = _getMarkers();
            var foundPos = _findPosition(marker._id);
            if (foundPos === null) {
                _this._markers.push(marker);
            } else {
                _this._markers[foundPos] = marker;
            }
            localStorage.setItem(_this._storageName, JSON.stringify(_this._markers));
        }

        function _removeMarker(markerId) {
            _this._markers = _getMarkers();
            var foundPos = _findPosition(markerId);
            if (foundPos !== null) {
                _this._markers.splice(foundPos, 1);
                localStorage.setItem(_this._storageName, JSON.stringify(_this._markers));
            }
        }

        function _findPosition(markerId) {
            var foundPos = null;
            _this._markers.some(function (marker, pos) {
                var match = marker._id === markerId;
                if (match) {
                    foundPos = pos;
                }
                return match;
            });
            return foundPos;
        }
    }

    function _formatDate(date) {
        var d = date.getDate();
        var y = date.getFullYear();
        var m = date.getMonth();
        return (m + 1).toString() + '/' + d + '/' + y;
    }
})();