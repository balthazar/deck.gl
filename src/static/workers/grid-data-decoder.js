importScripts('./util.js');
var COORDINATE_PRECISION = 5;

onmessage = function(e) {
  var lines = e.data.text.split('\n');
  var result = [];

  lines.forEach(function(line) {
    if (!line) return;
    var coords = decodeCoords(line);
    for (var i = 0; i < coords.length; i += 2) {
      result.push({
        position: {x: coords[i], y: coords[i + 1]}
      });
    }
  });
  postMessage({action: 'add', data: result});
};

function decodeCoords(str) {
  var multiplyer = Math.pow(10, COORDINATE_PRECISION);
  return decodeNumberArr(str, 90, 32, 4).map(function(x) {
    return x / multiplyer - 180;
  });
}
