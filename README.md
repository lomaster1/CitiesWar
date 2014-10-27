#CitiesWar

Game in Galcon style written on JavaScript with [http://snapsvg.io/](Snap.svg)

##How to write AI
* Create ai_name.js in /js/ai/ folder.
* Write AI:
```javascript
(function () {
  var dist = Utils.geometry.distance;
  
  /**
   * Main AI function
   * @param {Array of CityModel} myCities
   * @param {Array of CityModel} otherCities
   * CityModel = {
   *   userName: 'string - Owner username (empty if city is neutral)',
   *   x: 'int - x-coordinate',
   *   y: 'int - y-coordinate',
   *   r: 'int - city radius',
   *   population: 'int - city population'
   * }
   * Only myCities has goTo method which send half of city population to another city.
   * @example https://github.com/lomaster1/CitiesWar/blob/master/js/ai/bot1.js
   */
  function myBot(myCities, otherCities) {
    // Your AI here.
  }

  //Register AI.
  window.<ai_name> = myBot;
})();
```
* Add it in index.html
```javascript
var game = new Game(width, height, [{
    name: '<ai_name>',
    color: 'rgb(0,GG,0)'
   }, ...], 10); //10 - game speed.
```
##History
#####v1.0 - 25.10.2014
* Allow write custom strategy
* Add simple bot

#####v0.9 - 14.10.2014
* Initial commit

##Links
* [http://snapsvg.io/](Snap.svg)
* [http://www.flaticon.com/](Many Free vector icons)
