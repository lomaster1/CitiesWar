// Вспомогательные методы.
var Utils = {

  // Генерирует случайное число в пределах [min,max].
  getRandom: function (min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    return Math.round(rand);
  },

  createId: function () {
    return Utils.getRandom(10000000, 99999999);
  },

  getRandomColor: function(initColor) {
    return initColor.replace(/RR/g, Utils.getRandom(0, 255)).replace(/GG/g, Utils.getRandom(0, 255)).replace(/BB/g, Utils.getRandom(0, 255));
  },

  geometry: {
    isInCircle: function (cx, cy, cr, x, y) {
      return (Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) < Math.pow(cr, 2);
    },
    isCirclesIntersect: function (x, y, r, x2, y2, r2) {
      return (Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2) <= Math.pow(r2 + r, 2));
    }
  }


};