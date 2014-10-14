// Модель солдат.
var Soldiers = function (city, x, y, count) {
  var me = this;

  me._id = Utils.createId();

  me.city = city;

  me.x = x;
  me.y = y;
  me.count = count;
  me.speed = 1;

  me.view = null;
};

// Отправляет солдат к координате (x, y).
Soldiers.prototype.goTo = function (x, y) {
  var me = this;
  var goResult;

  var dist = Math.sqrt(Math.pow(me.x - x, 2) + Math.pow(me.y - y, 2));
  var goTime = 1500 + dist * (1 / me.speed);

  if (me.view) {
    goResult = me.view.goTo(x, y, goTime);
  } else {
    goResult = $.Deferred();
    setTimeout(function () {
      goResult.resolve();
    }, goTime);
  }

  goResult.done(function () {
    //TODO Менять в процессе движения.
    me.x = x;
    me.y = y;
    for (var i = 0; i < me.city.world.cities.length; i++) {
      me.unformInCity(me.city.world.cities[i]);
    }
  });

  return goResult;
};

// Расформировывает солдат в городе. Если население в городе меньше чем солдат, то захватыват город.
Soldiers.prototype.unformInCity = function (city) {
  var me = this;

  if (!city || !city.isInCity(me.x, me.y)) return false;

  // Если это свои, то увеличиваем население, если нет уменьшаем.
  if (city.user && me.city.user && city.user.name == me.city.user.name) {
    city._changePopulation(me.count);
  } else {
    city._changePopulation(-me.count);

    // Захват города.
    if (city.population <= 0) {
      city.user = me.city.user;
      city.population = -city.population;
    }
  }

  if (city.view) city.view.update();

  // Удаление солдат из мира.
  city.world.removeSoldiers(me);

  return true;
};