// Модель мира.
var World = function (width, height) {
  var me = this;

  me.view = null;

  me.width = width;
  me.height = height;

  // Города.
  me.cities = [];
  // Солдаты.
  me.soldiers = [];
};

World.prototype.addUsers = function (users) {
  var me = this;

  var userCityR = 120;
  //FIXME: убрать  деления, вынести  (me.width / 2) из под цикла
  var a = me.width / 2 - userCityR; //120 - величина города пользователя.
  var b = me.height / 2 - userCityR; //120 - величина города пользователя.

  var angle = 360 / users.length;

  for (var i = 0 ; i < users.length; i++) {
    var x1 = a * Math.cos(Snap.rad(angle * i)) + (me.width / 2);
    var y1 = b * Math.sin(Snap.rad(angle * i)) + (me.height / 2);
    me._createCity(x1, y1, userCityR, users[i]);
  }

  // Генерируем 13 пустых городов.
  me._generateEmptyCities(13);
};

World.prototype.addSoldiers = function (soldiers) {
  this.soldiers.push(soldiers);
};

World.prototype.removeSoldiers = function (soldiers) {
  var me = this;
  for (var j = 0; j < me.soldiers.length; j++) {
    if (me.soldiers[j]._id == soldiers._id) {
      me.soldiers.splice(j, 1);
      break;
    }
  }
};

// Генерирует n пустых городов.
World.prototype._generateEmptyCities = function (n) {
  var me = this;
  var generatedCount = 0;
  var isCollision;

  while (generatedCount < n) {
    var r = Utils.getRandom(50, 90);
    var x = Utils.getRandom(r, me.width - r);
    var y = Utils.getRandom(r, me.height - r);

    isCollision = false;
    for (var k = 0; k < me.cities.length; k++) {
      var x2 = me.cities[k].x;
      var y2 = me.cities[k].y;
      var r2 = me.cities[k].r + 10;
      if (Utils.geometry.isCirclesIntersect(x, y, r, x2, y2, r2)) {
        isCollision = true;
      }
    }
    if (!isCollision) {
      me._createCity(x, y, r);
      generatedCount += 1;
    }
  }
};

// Создает модель города.
World.prototype._createCity = function (x, y, r, user) {
  var me = this;
  var city = new City(me, x, y, r, user || null);
  me.cities.push(city);
};