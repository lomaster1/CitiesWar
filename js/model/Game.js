// Игра.
var Game = function (width, height, users, speed) {
  this.world = new World(width, height);
  this.users = users;
  this.speed = speed;

  this.world.globalSpeed = speed;

  this.bots = [];

  this.world.addUsers(users);

  var worldView = new WorldView(this.world);
  worldView.render();
};

// Начинает игру.
Game.prototype.start = function () {
  var me = this;
  for (var i = 0; i < me.users.length; i++) {
    var user = me.users[i];
    $.getScript('/js/ai/' + user.name + '.js').done((function (_user) {
      return function () {
        me.bots.push(setInterval(function () {
          if (window[_user.name]) {
            window[_user.name].call(null,
              me._getCitiesByUserName(_user.name, true), //Города пользователя.
              me._getCitiesByUserName(_user.name, false) //Чужие города.
            );
          }
        }, 10));
      }
    })(user));
  }
  var winInterval = setInterval(function () {
    var aliveUsers = [];
    for (var ci = 0; ci < me.world.cities.length; ci++) {
      var c = me.world.cities[ci];
      if (c.user && aliveUsers.indexOf(c.user.name) === -1) {
        aliveUsers.push(c.user.name);
      }
    }
    if (aliveUsers.length == 1) {
      me.stop();
      clearInterval(winInterval);
      alert(aliveUsers[0] + ' выиграл.');
    }
  }, 400);
};

// Останавливает игру.
Game.prototype.stop = function () {
  for (var i = 0; i < this.bots.length; i++) {
    clearInterval(this.bots[i]);
  }
};

// Получает города пользователя или наоборот не его.
Game.prototype._getCitiesByUserName = function (name, userOnly) {
  var me = this;
  var result = [];
  for (var ci = 0; ci < me.world.cities.length; ci++) {
    var c = me.world.cities[ci];
    if ((!userOnly && (c.user === null || c.user.name !== name)) || (userOnly && c.user && c.user.name === name)) {
      result.push(me._getCityProxy(c, userOnly));
    }
  }
  return result;
};

// Упращенный readonly-объект города.
Game.prototype._getCityProxy = function (city, isMy) {
  var cityProxy = {
    userName: (city.user ? city.user.name : ''),
    x: city.x,
    y: city.y,
    r: city.r,
    population: city.population
  };

  if (isMy) {
    cityProxy.goTo = function (otherCity) {
      if (otherCity) {
        return city.formSoldiersAndGoTo(otherCity.x, otherCity.y);
      }
      return false;
    };
  }

  return cityProxy;
};