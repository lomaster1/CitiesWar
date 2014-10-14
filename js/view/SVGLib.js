var SVGLib = function () {
  this._collection = {};
};

SVGLib.prototype.load = function (packs) {
  var me = this;
  var loadingPack = [];
  for (var packName in packs) {
    loadingPack.push(me._loadPack(packName, packs[packName]));


  }
  for (var i = 0; i < packs.length; i++) {
  };
  return $.when.apply(this, loadingPack).promise();
};

SVGLib.prototype._loadPack = function (packName, packFiles) {
  var me = this;
  var svg = [];

  var loader = [];
  for (var i = 0; i < packFiles.length; i++) {
    loader[i] = $.Deferred();
    Snap.load('/svg/' + packName + '/' + packFiles[i], (function (loaderIndex) {
      return function (f) {
        var g = f.select("g");
        svg.push(g);
        loader[loaderIndex].resolve();
      }
    })(i));
  }

  return $.when.apply(this, loader).done(function () {
    me._collection[packName] = svg;
  }).promise();
};

SVGLib.prototype.get = function (packName, index) {
  if (typeof index === 'undefined') {
    return this._collection[packName];
  } else {
    if (index == -1) {
      index = Utils.getRandom(0, this._collection[packName].length - 1);
    }
    return this._collection[packName][index].clone();
  }
};

window.svgLib = new SVGLib();