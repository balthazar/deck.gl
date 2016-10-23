importScripts('./util.js');
var FLUSH_LIMIT = 6000;
var result = [];
var count = 0;
var vertexCount = 0;

onmessage = function(e) {
  var lines = e.data.text.split('\n');

  lines.forEach(function(line) {
    if (!line) return;

    var feature = {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: line.slice(1).split('\x01').map(function(str) {
          var coords = decodePolyline(str);
          vertexCount += coords.length;
          return [coords];
        })
      },
      properties: {
        value: line[0] * 1
      }
    };

    result.push(feature);
    count++;

    if (result.length >= FLUSH_LIMIT) {
      flush();
    }
  });

  if (e.data.event === 'load') {
    flush();
    postMessage({action: 'end'});
  }
};

function flush() {
  postMessage({
    action: 'add',
    data: [{
      type: 'FeatureCollection',
      features: result
    }],
    meta: {count: count, vertexCount: vertexCount}
  });
  result = [];
}

function decodeCoords(str) {
  var multiplyer = Math.pow(10, COORDINATE_PRECISION);
  return decodeNumberArr(str, 90, 32, 4).map(function(x) {
    return x / multiplyer - 180;
  });
}
