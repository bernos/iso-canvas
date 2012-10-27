define(function() {
  var Plotter = function() {};

  Plotter.prototype.mapToWorld = function(ptMap, iTileWidth, iTileHeight) {
    return {
      x : (ptMap.x * iTileWidth) + ((ptMap.y & 1) * iTileWidth / 2),
      y : ptMap.y * (iTileHeight / 2)
    };
  };

  return Plotter;
});