(function () {
  var dist = Utils.geometry.distance;

  //Находит ближайший город.
  function getNearCity(my, cities) {
    var cMin = null;
    var min = 10000000;
    for (var i = 0; i < cities.length; i++) {
      var d = dist(my.x, my.y, cities[i].x, cities[i].y);
      if (d < min) {
        min = d;
        cMin = i;
      }
    }
    return (cMin !== null ? cities[cMin] : null);
  }

  var isStop = false;

  function bot1(myCities, otherCities) {
    //This is game loop - он вызывается бесконечно много раз.

    if (!isStop) {
      //isStop = true;

      for (var myIndex = 0 ; myIndex < myCities.length; myIndex++) {
        if (myCities[myIndex].population > 70) {
          var near = getNearCity(myCities[myIndex], otherCities);
          if (near) {
            myCities[myIndex].goTo(near);
          }
        }
      }
    }
  }

  //ОБЯЗАТЕЛЬНО НУЖНО ЗАРЕГИСТРИРОВАТЬ СВОЮ СТРАТЕГИЮ В WINDOW! (имя должно совпадать с именем пользователя).
  window.bot1 = bot1;
})();
