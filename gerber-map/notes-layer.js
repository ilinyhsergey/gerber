(function () {

    var notes = {};
    var lastPopupId = 0;
    var isToolsOn = false;
    var startLatlng = null;
    var _map = null;
    var usedToolType = null;

    // gerber viewer notes tools namespace
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
        },
        onRemove: function (map) {
        },
        onAdd: function (map) {
            notes = getNotes();
            var overlay;
            var maxId = lastPopupId;

            for (var id in notes) {
                if (notes.hasOwnProperty(id)) {
                    if (id > maxId) {
                        maxId = id;
                    }
                    var note = notes[id];
                    if (note.type === 'circle') {
                        overlay = addCommentCircle(note);
                    } else /*if (note.type === 'ruler')*/ {
                        overlay = addCommentRuler(note);
                    }
                    addCommentPopup(note, overlay);
                }
            }

            lastPopupId = maxId;
        }
    });

    function onClickControl(e) {
        if (!isToolsOn) {
            _map.dragging.disable();
            isToolsOn = true;
            setCursor('default');
            _map.once('mousedown', onMousedown);
        } else {
            _map.dragging.enable();
            isToolsOn = false;
            resetCursor();
            _map.off('mousedown', onMousedown);
        }
    }

    var savedCursorValue = null;
    function setCursor(cursorValue) {
        var leafletContainer = document.getElementsByClassName('leaflet-container');
        savedCursorValue = leafletContainer[0].style.cursor;
        leafletContainer[0].style.cursor = cursorValue;
    }
    function resetCursor() {
        var leafletContainer = document.getElementsByClassName('leaflet-container');
        leafletContainer[0].style.cursor = savedCursorValue;
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
            var newNode = {
                id: ++lastPopupId,
                type: usedToolType,
                startLatlng: startLatlng,
                endLatlng: endLatlng,
                distance: distanceMeters * 1000,// store in mm
                commentBody: ''
            };
            var overlay;

            if (usedToolType === 'circle') {
                overlay = addCommentCircle(newNode);
            } else  /*if (usedToolType === 'ruler')*/ {
                overlay = addCommentRuler(newNode);
            }
            addCommentPopup(newNode, overlay).openOn(_map);
            saveNote(newNode);

            startLatlng = null;
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
        var tmpNode = {
            id: ++lastPopupId,
            type: usedToolType,
            startLatlng: startLatlng,
            endLatlng: endLatlng,
            distance: distanceMeters * 1000,// store in mm
            commentBody: ''
        };

        if (usedToolType === 'circle') {
            drawableElement = addCommentCircle(tmpNode);
        } else  /*if (usedToolType === 'ruler')*/ {
            drawableElement = addCommentRuler(tmpNode);
        }
    }

    function addCommentCircle(note) {
        var circle = L.circle(note.startLatlng, note.distance / 1000, {
            "color": "white",
            "fillOpacity": 0.0
        });
        circle.addTo(_map);
        return circle;
    }

    function addCommentRuler(note) {
        var line = L.polyline([note.startLatlng, note.endLatlng], {
            "color": "black"
        });
        line.addTo(_map);
        return line;
    }

    function addCommentPopup(note, overlay/*Path class*/) {
        var content = L.DomUtil.create('div', 'editable-note');
        content.innerHTML =
            '<input id="i_' + note.id + '" type="text" value="' + note.commentBody + '" placeholder="Add a comment">' +
            '<input type="submit" value="Save">' +
            '<input type="button" value="Remove">';

        var commentInput = content.children[0];
        var saveBtn = content.children[1];
        var removeBtn = content.children[2];

        L.DomEvent.addListener(saveBtn, 'click', function (e) {
            overlay.closePopup();
            note.commentBody = commentInput.value;
            saveNote(note);
        });
        L.DomEvent.addListener(removeBtn, 'click', function (e) {
            overlay.closePopup();
            _map.removeLayer(overlay);
            removeNote(note.id);
        });

        var popup = L.popup()
            .setLatLng(note.startLatlng)
            .setContent(content);

        overlay.bindPopup(popup);

        return popup;
    }

    function saveNote(note) {
        notes[note.id] = note;
        localStorage.setItem('notes.json', JSON.stringify(notes));
    }

    function removeNote(id) {
        delete notes[id];
        localStorage.setItem('notes.json', JSON.stringify(notes));
    }

    function getNotes() {
        return JSON.parse(localStorage.getItem('notes.json')) || {};
    }

})();