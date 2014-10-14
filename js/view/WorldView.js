// Представление мира.
var WorldView = function (world) {
  var me = this;

  me.world = world;
  world.view = me;

  // Полотно для рисования.
  me.paper = Snap(me.world.width, me.world.height);

  // Режим выделения.
  me._isGlobalSelectionOn = true;

  me._generateLandscape('trees', 80, 'rgb(0,GG,0)');
  me._generateLandscape('animals', 20, 'rgb(RR,GG,BB)');

  // Создаем представления городов.
  me._createCitiesView();
};

// Генерируем ладшафт.
WorldView.prototype._generateLandscape = function (collName, count, color) {
  var me = this;
  var landItemSize = Utils.getRandom(40, 60);

  for (var i = 0; i < count; i++) {
    var landItem = me.paper.g().add(svgLib.get(collName, -1));

    var box = landItem.getBBox();
    var scale = Math.min(landItemSize / box.width, landItemSize / box.height);

    var x, y, isDotValid;
    do {
      x = Utils.getRandom(0, me.world.width - landItemSize);
      y = Utils.getRandom(0, me.world.height - landItemSize);
      isDotValid = me._isLandscapeItemInCities(x, y, landItemSize);
    } while (!isDotValid);

    landItem.attr({
      transform: 'S' + scale + 'T' + (x - 50) + ',' + (y - 50), //опытным путем выяснил что элемент после трасформации находится не там где хотелось, поэтому -50.
      fill: Utils.getRandomColor(color)
    });

    me.paper.append(landItem);
  }
};

WorldView.prototype._isLandscapeItemInCities = function (x, y, size) {
  var me = this;
  for (var i = 0; i < me.world.cities.length; i++) {
    var city = me.world.cities[i];
    if (Utils.geometry.isInCircle(city.x, city.y, city.r + size, x, y)) {
      return false;
    }
  }
  return true;
},

// Создает представления городов.
WorldView.prototype._createCitiesView = function () {
  var me = this;
  for (var i = 0; i < me.world.cities.length; i++) {
    new CityView(me.world.cities[i]);
  }
};

// Отрисовка мира.
WorldView.prototype.render = function () {
  var me = this;

  // Отрисовка городов.
  for (var i = 0; i < me.world.cities.length; i++) {
    me.world.cities[i].view.render();
  }

  // Навешиваем событие глобального выделения и выделяем города и в процессе выделения.
  me._bindGlobalSelection(function OnSelection(selection) {
    for (var i = 0; i < me.world.cities.length; i++) {
      var city = me.world.cities[i];

      var cityX1 = (city.x - city.r);
      var cityY1 = (city.y - city.r);
      var cityX2 = (city.x + city.r);
      var cityY2 = (city.y + city.r);

      var isCitySelected = (selection.x1 <= cityX1 && selection.y1 <= cityY1 && selection.x2 >= cityX2 && selection.y2 >= cityY2);
      city.view.setSelection(isCitySelected);
    }
  });
};

// Навешивает событие для глобального выделения.
WorldView.prototype._bindGlobalSelection = function (onSelectionCallback) {
  var me = this;
  var paper = me.paper;

  var selection;
  var isSelectionStarted = false;

  var rectStart = { x: 0, y: 0 };
  var rect = paper.rect(0, 0, 0, 0);
  rect.attr({
    fill: 'rgba(0,0,255,0.3)',
    stroke: 'rgba(0,0,255,0.5)'
  });
  rect.addClass('hide');
  $(paper.node).on('mousedown', function onDragStart(ev) {
    if (me._isGlobalSelectionOn) {
      selection = { x1: 0, y1: 0, x2: 0, y2: 0 };

      var x = ev.pageX;
      var y = ev.pageY;
      rectStart.x = x;
      rectStart.y = y;
      rect.attr({
        x: x,
        y: y,
        width: 1,
        height: 1
      });
      rect.removeClass('hide');
      isSelectionStarted = true;
    } else {
      rect.addClass('hide');
      isSelectionStarted = false;
    }
  }).on('mousemove', function onDragMove(ev) {
    if (me._isGlobalSelectionOn && isSelectionStarted) {
      var x = ev.pageX;
      var y = ev.pageY;

      var x1 = Math.min(rectStart.x, x);
      var y1 = Math.min(rectStart.y, y);
      var w = Math.abs(rectStart.x - x);
      var h = Math.abs(rectStart.y - y);

      selection = {
        x1: x1,
        y1: y1,
        x2: x1 + w,
        y2: y1 + h
      };

      rect.attr({
        x: x1,
        y: y1,
        width: w,
        height: h
      });

      if (me._isGlobalSelectionOn && $.isFunction(onSelectionCallback)) {
        onSelectionCallback(selection);
      }
    } else {
      rect.addClass('hide');
      isSelectionStarted = false;
    }
  }).on('mouseup', function onDragEnd(ev) {
    rect.addClass('hide');
    isSelectionStarted = false;

    if (me._isGlobalSelectionOn && isSelectionStarted && $.isFunction(onSelectionCallback)) {
      onSelectionCallback(selection);
    }
  });
};

// Включает или выключает режим глобального выделения.
WorldView.prototype.setGlobalSelection = function (isOn) {
  this._isGlobalSelectionOn = isOn;
};

// Снимает выделение со всех городов.
WorldView.prototype.deselectAllCities = function (isOn) {
  var me = this;
  for (var i = 0; i < me.world.cities.length; i++) {
    me.world.cities[i].view.setSelection(false);
  };
};