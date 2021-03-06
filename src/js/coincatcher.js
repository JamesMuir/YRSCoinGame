// the location of our coins. These are near Eastbourne Co-Hub for testing with.
var coins = [
  {
    'lat' : 50.77097,
    'lng' : 0.28219
  },
  {
    'lat' : 50.77145,
    'lng' : 0.28133
  },
  {
    'lat' : 50.77178,
    'lng' : 0.28067
  },
  {
    'lat' : 50.77228,
    'lng' : 0.28131
  },
  {
    'lat' : 50.77275,
    'lng' : 0.2819
  },
  {
    'lat' : 50.77348,
    'lng' : 0.2811
  },
  {
    'lat' : 50.77357,
    'lng' : 0.28034
  },
  {
    'lat' : 50.77311,
    'lng' : 0.27971
  },
  {
    'lat' : 50.77263,
    'lng' : 0.27842
  },
  {
    'lat' : 50.77211,
    'lng' : 0.27842
  },
  {
    'lat' : 50.77164,
    'lng' : 0.27782
  },
  {
    'lat' : 50.77126,
    'lng' : 0.27854
  },
  {
    'lat' : 50.77081,
    'lng' : 0.27942
  },
  {
    'lat' : 50.77059,
    'lng' : 0.28049
  }
];

// where we will store our google map.
var map;
// The current score
var score = 0;
// our error margin for deciding if we are near enough to a coin.
var nearenough = 0.0004;

function initialize() {
  // a debug variable that will be used to store an incremental count.
  var counter = 0;

  // options for Google Maps
  var mapOptions = {
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // create a google map using our map options from earlier.
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // add our coins to the map.
  addCoins(map);

  // Try HTML5 geolocation
  if(navigator.geolocation) {

    // create a marker for us.
    var pacmanimage = 'img/pacman.png';
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng( 0, 0 ),
      map: map,
      icon: pacmanimage
    });

    // update the game every 0.5 seconds
    setInterval(function() {

      // increment the counter to show we're working.
      document.getElementById('count').innerHTML = "" + counter++;

      // get the current location
      navigator.geolocation.getCurrentPosition(function(position) {

        // make sure the game is visible, and remove any error or loading screens.
        document.getElementById('loading').style.display = 'none';
        document.getElementById('game').style.visibility = 'visible';

        // show the current lat, long and score
        document.getElementById('lat').innerHTML = "" + position.coords.latitude;
        document.getElementById('lng').innerHTML = "" + position.coords.longitude;
        document.getElementById('coins').innerHTML = "" + score;

        // iterate over the coins array, looking for coins near our location.
        for (var i=0; i<coins.length; ++i) {
          // see how near we are to the current coin.
          var distancetocoin = distance(coins[i], {lat: position.coords.latitude, lng: position.coords.longitude});

          // if we are nearer than our error margin, then collect the coin and increase the score.
          if (distancetocoin < nearenough) {
            // remove the coin from the map.
            coins[i].marker.setMap(null);
            // remove the coin from the array of coins.
            coins.remove(i);
            // increase the score.
            score++;
          }
        }

        // update our current position on the map.
        var pos = new google.maps.LatLng(position.coords.latitude,
                                         position.coords.longitude);
        marker.setPosition(pos);
        map.panTo(pos);

      }, function() {
        // an error occured.
        handleNoGeolocation(true);
      },{
        maximumAge: 500,
        enableHighAccuracy: true
      });
    }, 500);
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}

// we use this if we get an error.
function handleNoGeolocation(errorFlag) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('game').style.visibility = 'visible';
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

// add coins to a map.
function addCoins(map) {
  var image = 'img/Coin.png';
  for(var i=0; i<coins.length; ++i) {
    var coin = coins[i];
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng( coin.lat, coin.lng ),
      map: map,
      icon: image
    });
    coins[i].marker = marker;
  }
}

// the distance between two co-ordinates (using Pythagoras's rule)
function distance(a,b) {
  return Math.sqrt(((b.lat - a.lat) * (b.lat - a.lat)) + ((b.lng - a.lng) * (b.lng - a.lng)));
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// add the map to the page when loaded.
google.maps.event.addDomListener(window, 'load', initialize);