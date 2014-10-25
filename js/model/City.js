// Модель города.
var City = function (world, x, y, r, user) {
  var me = this;

  me._id = Utils.createId();

  me.world = world;

  // Координаты.
  me.x = x;
  me.y = y;
  // Радиус. Чем больше город тем быстрее растет население.
  me.r = r;
  // Население.
  me.population = r;

  // Начать увеличивать население.
  me.growPopulation();

  me.user = user;

  me.view = null;
};

// Осужествляет рост населения. 
City.prototype.growPopulation = function () {
  var me = this;

  if (me.user !== null) {
    me._changePopulation(1);
  }

  setTimeout(function () {
    me.growPopulation();
  }, (1500 - me.r * 10) / me.world.globalSpeed);
};

// Изменяет население города на count человек.
City.prototype._changePopulation = function (count) {
  var me = this;
  me.population += count;
  if (me.view) me.view.updatePopulation();
};

// Проверяет принадлежит ли точка (x, y) этому городу.
City.prototype.isInCity = function (x, y) {
  return Utils.geometry.isInCircle(this.x, this.y, this.r, x, y);
};

// Формирует отряд солдат. 
City.prototype.formSoldiers = function (needCount) {
  var me = this;

  if (needCount <= 0) return null;

  var count = Math.min(me.population, needCount);
  me._changePopulation(-count);

  var s = new Soldiers(me, me.x, me.y, count);
  if (me.view) me.view.createSoldiersView(s);

  me.world.addSoldiers(s);

  return s;
};

// Формирует и отправляет отряд солдат к точке (x, y).
City.prototype.formSoldiersAndGoTo = function (x, y) {
  var me = this;
  // Отправляем сотдат на город.
  for (var i = 0; i < me.world.cities.length; i++) {
    var otherCity = me.world.cities[i];
    if (otherCity.isInCity(x, y)) {
      var s = me.formSoldiers(Math.round(me.population * 0.5));
      if (s) {
        s.goTo(otherCity.x, otherCity.y);
        return true;
      }
    }
  }
  return false;
};
