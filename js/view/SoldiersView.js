// Представление солдат.
var SoldiersView = function (soldiers) {
  var me = this;

  me.soldiers = soldiers;
  soldiers.view = me;

  me.x = soldiers.x - 15;
  me.y = soldiers.y - 32;
  me.size = soldiers.count / 30;

  me._soldierStartPath = '';
  me._soldierEndPath = '';
  me.soldier = null;
};

// Отрисовка солдат.
SoldiersView.prototype.render = function () {
  var me = this;

  me.soldier = svgLib.get('airplanes', -1);

  //Начальные координаты и размер.
  me.soldier.transform('T' + me.x + ',' + me.y + 'S' + me.size);

  //Добавляем на карту.
  me.soldiers.city.world.view.paper.append(me.soldier);
};

// Отправка солдат к координате (x,y).
SoldiersView.prototype.goTo = function (x, y, gotoTime) {
  var me = this;
  var result = $.Deferred();

  var endX = x - 15;
  var endY = y - 32;

  //Угол.
  var angle = -Snap.angle(me.x, me.y - 32, endX, endY, me.x, me.y);
  me.soldier.transform('T' + me.x + ',' + me.y + 'S' + me.size + 'R' + angle);

  me.soldier.animate({
    transform: ('T' + endX + ',' + endY + 'S' + me.size + 'R' + angle)
  }, gotoTime, mina.linear, function () {
    this.remove();
    result.resolve();
  });

  return result;
};