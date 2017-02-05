(function () {

    var commentMarkers = {};
    var rulerMarkers = {};
    var lastMarkerId = 0;
    var isToolsOn = false;
    var startLatlng = null;
    var _map = null;
    var usedToolType = null;
    var commentsStorage;
    var rulerStorage;
    var popupCreator;

    // gerber viewer tools namespace
    L.GvNotesTools = {};

    L.GvNotesTools.NotesToolsControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        onAdd: function (map) {
            _map = map;

            var control = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

            var circleControl = L.DomUtil.create('div', 'map-tool comment', control);
            L.DomEvent.addListener(circleControl, 'click', function (e) {
                usedToolType = 'circle';
                onClickControl(e);
            });

            var rulerControl = L.DomUtil.create('div', 'map-tool measure', control);
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
            var overlay, marker, id;
            var maxId = lastMarkerId;

            commentMarkers = commentsStorage.getAll();
            for (id in commentMarkers) {
                if (commentMarkers.hasOwnProperty(id)) {
                    if (id > maxId) {
                        maxId = id;
                    }
                    marker = commentMarkers[id];
                    overlay = addComment(marker);
                    addCommentPopup(marker, overlay);
                }
            }

            rulerMarkers = rulerStorage.getAll();
            for (id in rulerMarkers) {
                if (rulerMarkers.hasOwnProperty(id)) {
                    if (id > maxId) {
                        maxId = id;
                    }
                    marker = rulerMarkers[id];
                    overlay = addRuler(marker);
                    addRulerPopup(marker, overlay);
                }
            }

            lastMarkerId = maxId;
        },
        _initPopupCreator: function () {
            var content = L.DomUtil.create('div', 'popup-creator');
            content.innerHTML =
                '<div class="number-circle"><span id="markerId">' + (lastMarkerId + 1) + '</span></div>' +
                '<select id="commentType">' +
                '   <option value="Problem">Problem</option>' +
                '   <option value="Suggestion">Suggestion</option>' +
                '</select>' +
                '<br/>' +
                '<textarea placeholder="Write a description" autofocus></textarea>' +
                '<br/>' +
                '<input type="button" value="Save">' +
                '<input type="button" value="Cancel">'
            ;

            popupCreator = L.popup()
                .setContent(content);

            var markerId = content
                .getElementsByClassName('number-circle')[0]
                .getElementsByTagName('span')[0];
            var select = content.getElementsByTagName('select')[0];
            var textarea = content.getElementsByTagName('textarea')[0];
            var inputs = content.getElementsByTagName('input');

            L.DomEvent.addListener(inputs[0], 'click', function (e) {
                markerId.innerHTML = ++lastMarkerId;
                var endLatlng = popupCreator.getLatLng();
                var distanceMeters = endLatlng.distanceTo(startLatlng);// in meters
                var commentMarker = {
                    _id: lastMarkerId,
                    _centerLatlng: startLatlng,
                    _radius: distanceMeters * 1000,
                    title: select.value,
                    body: textarea.value,
                    author: 'jimb@jim.com',
                    date: _formatDate(new Date())
                };
                commentsStorage.saveOne(commentMarker);
                var overlay = addComment(commentMarker);
                addCommentPopup(commentMarker, overlay);
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

        if (drawableElement) {
            _map.removeLayer(drawableElement);
        }


        if (startLatlng) {
            var endLatlng = e.latlng;
            var distanceMeters = endLatlng.distanceTo(startLatlng);// in meters
            var overlay;

            if (usedToolType === 'circle') {
                popupCreator
                    .setLatLng(endLatlng)
                    .openOn(_map);
            } else  /*if (usedToolType === 'ruler')*/ {
                var rulerMarker = {
                    _id: ++lastMarkerId,
                    _startLatlng: startLatlng,
                    _endLatlng: endLatlng,
                    reason: 'reason',
                    distance: distanceMeters * 1000
                };
                rulerStorage.saveOne(rulerMarker);
                overlay = addRuler(rulerMarker);
                addRulerPopup(rulerMarker, overlay)
                    .openOn(_map);
                startLatlng = null;
            }
        }

        _map.off('mousemove', onMousemove);
        _map.dragging.enable();
        isToolsOn = false;
        resetCursor();
    }

    var drawableElement;

    function onMousemove(e) {
        if (drawableElement) {
            _map.removeLayer(drawableElement);
        }

        var endLatlng = e.latlng;
        var distanceMeters = endLatlng.distanceTo(startLatlng);// in meters

        if (usedToolType === 'circle') {
            var commentMarker = {
                _id: null,
                _centerLatlng: startLatlng,
                _radius: distanceMeters * 1000
            };
            drawableElement = addComment(commentMarker);
        } else  /*if (usedToolType === 'ruler')*/ {
            var rulerMarker = {
                _id: ++lastMarkerId,
                _startLatlng: startLatlng,
                _endLatlng: endLatlng
                // ,distance: distanceMeters * 1000
            };
            drawableElement = addRuler(rulerMarker);
        }
    }

    function addComment(marker) {
        var circle = L.circle(marker._centerLatlng, marker._radius / 1000, {
            "color": "white",
            "fillOpacity": 0.0
        });
        circle.addTo(_map);
        return circle;
    }

    function addRuler(marker) {
        var line = L.polyline([marker._startLatlng, marker._endLatlng], {
            "color": "black"
        });
        line.addTo(_map);
        return line;
    }

    function addCommentPopup(marker, overlay/*Path class*/) {
        var content = L.DomUtil.create('div', 'editable-note');
        content.innerHTML =
            '<h4>' + marker.title + '</h4>' +
            '<b>' + marker.body + '</b><br/>' +
            '<span><b>Author:</b> ' + marker.author + '</span><br/>' +
            '<span><b>Date:</b> ' + marker.date + '</span>'
        // +'<input type="submit" value="Save">'
        // +'<input type="button" value="Remove">'
        ;

        // var commentInput = content.children[0];
        // var saveBtn = content.children[1];
        // var removeBtn = content.children[2];
        //
        // L.DomEvent.addListener(saveBtn, 'click', function (e) {
        //     overlay.closePopup();
        //     note.commentBody = commentInput.value;
        //     saveNote(note);
        // });
        // L.DomEvent.addListener(removeBtn, 'click', function (e) {
        //     overlay.closePopup();
        //     _map.removeLayer(overlay);
        //     removeNote(note.id);
        // });

        var popup = L.popup()
            .setLatLng(marker._centerLatlng)
            .setContent(content);

        overlay.bindPopup(popup);

        return popup;
    }

    function addRulerPopup(marker, overlay/*Path class*/) {
        var content = L.DomUtil.create('div', 'editable-note');
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
            return JSON.parse(localStorage.getItem(_this._storageName)) || {};
        }

        function _saveMarker(marker) {
            _this._markers = _getMarkers();
            _this._markers[marker._id] = marker;
            localStorage.setItem(_this._storageName, JSON.stringify(_this._markers));

        }

        function _removeMarker(id) {
            _this._markers = _getMarkers();
            delete _this._markers[id];
            localStorage.setItem(_this._storageName, JSON.stringify(_this._markers));
        }
    }

    function _formatDate(date) {
        var d = date.getDate();
        var y = date.getFullYear();
        var m = date.getMonth();
        return (m + 1).toString() + '/' + d + '/' + y;
    }
})();