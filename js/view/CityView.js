var EMPTY_CITY_COLOR = '#999';
var CITY_AREA_COLOR = 'rgba(220,220,220,0.2)';

// Представление города.
var CityView = function (city) {
  var me = this;

  me.city = city;
  city.view = me;

  me._isSelected = false;

  me.area = null;
  me.population = null;
  me.selection = null;
  me.arrow = null;
};

// Отрисовка города.
CityView.prototype.render = function () {
  var me = this;
  var city = me.city;
  var paper = city.world.view.paper;

  // Область города.
  me.area = Snap.set();
  me.area.push(paper.circle(city.x, city.y, city.r).attr({ id: 'area', fill: CITY_AREA_COLOR }));

  var buildingsCounts = [0, 7, 13, 21, 30, 40];
  var cx = city.x;
  var cy = city.y;
  var size = Math.floor(city.r / 25);

  for (var areaIndex = 0; areaIndex < size; areaIndex++) {
    var areaBuildingsCount = buildingsCounts[areaIndex];

    var r = areaIndex * 35;
    for (var bNum = 0; bNum < areaBuildingsCount; bNum++) {
      var x = cx + r * Math.cos(Snap.rad(bNum * (360 / areaBuildingsCount))) - 16;
      var y = cy + r * Math.sin(Snap.rad(bNum * (360 / areaBuildingsCount))) - 16;
      var b = svgLib.get('buildings', -1);
      b.attr({
        transform: 'T' + x + ',' + y + 'S1.2'
      });
      paper.append(b);
      me.area.push(b);
    }
  }

  // Текст с населением.
  me.population = paper.text(city.x - 10, city.y + 5, city.population);
  me.population.attr({
    'font-size': '14px',
    'font-weight': '600',
    'fill': '#f00'
  });

  // Выделение.
  me.selection = paper.circle(city.x, city.y, city.r + 10);
  me.selection.attr({
    fill: 'none',
    stroke: 'rgba(0,0,255,1)',
    opacity: 0
  });

  me.arrow = paper.path('M' + city.x + ',' + city.y + 'L' + city.x + ',' + city.y);
  me.arrow.attr({
    stroke: '#000'
  });
  me.arrow.addClass('hide');

  // Навешиваем событие для возможности отправлять отряды солдат.
  me._bindGoToEvent();

  // Обновляем информацию о населении и цвете.
  me.update();
};

// Навешивает событие для возможности отправлять отряды солдат.
CityView.prototype._bindGoToEvent = function () {
  var me = this;
  var city = me.city;
  var paper = city.world.view.paper;

  var citySet = paper.g();
  citySet.add(me.area);
  citySet.add(me.population);

  // Направление движения.
  var destination;

  citySet.drag(function onDragMove(dx, dy, x, y) {
    destination = { x: x, y: y };

    // Меняем направление стрелочки.
    for (var i = 0; i < city.world.cities.length; i++) {
      var otherCityView = city.world.cities[i].view;
      if (otherCityView._isSelected) {
        otherCityView.arrow.removeClass('hide');
        otherCityView.arrow.attr({
          path: 'M' + otherCityView.city.x + ',' + otherCityView.city.y + 'L' + x + ',' + y
        });
      } else {
        otherCityView.arrow.addClass('hide');
      }
    };

  }, function onDragStart(x, y) {
    destination = { x: 0, y: 0 };

    // Если этот город не выделен, то снимаем со всех остальных, а его выделяем.
    if (!me._isSelected) {
      city.world.view.deselectAllCities();
      me.setSelection(true);
    }

    city.world.view.setGlobalSelection(false);
  }, function onDragEnd() {
    // Со всех выделенных городов отправляем отрады солдат.
    for (var i = 0; i < city.world.cities.length; i++) {
      if (city.world.cities[i].view._isSelected) {
        city.world.cities[i].view.arrow.addClass('hide');
        city.world.cities[i].formSoldiersAndGoTo(destination.x, destination.y);
      }
    }

    city.world.view.deselectAllCities();

    city.world.view.setGlobalSelection(true);
  });
};

// Выделяет город.
CityView.prototype.setSelection = function (isOn) {
  var me = this;
  me._isSelected = isOn;
  if (isOn) {
    me.selection.animate({
      opacity: 0.5
    }, 300);
  } else {
    me.selection.animate({
      opacity: 0
    }, 200);
  }
};

CityView.prototype.update = function () {
  this.updatePopulation();
  this.updateCityColor();
}

// Обновляет информацию о населении и цвете.
CityView.prototype.updatePopulation = function () {
  var me = this;
  var city = me.city;
  me.population.attr({
    'text': city.population
  });
};

CityView.prototype.updateCityColor = function () {
  var me = this;
  var city = me.city;
  me.area.forEach(function (b) {
    if (b.attr('id') != 'area') {
      b.attr({
        fill: Utils.getRandomColor((city.user ? city.user.color : EMPTY_CITY_COLOR))
      });
    }
  });
};

// Создает представление солдат.
CityView.prototype.createSoldiersView = function (t) {
  var tView = new SoldiersView(t);
  tView.render();
};