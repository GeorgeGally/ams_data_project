function setScreen() {

  if (window.location.hash) {

    var screen_name = window.location.hash.substr(1).toLowerCase();
    console.log('screen: ', screen_name);
    if (screen_name == "central") {
      //widescreen - 2112x608
      resizeCanvas(ctx3, 2112, 608);
      resizeCanvas(ctx, 2112, 608);
      resizeCanvas(ctx2, 2112, 608);
      my_sticky = 60;
    } else if (screen_name == "leidseplein") {
      // 1632x608
      resizeCanvas(ctx3, 1632, 608);
      resizeCanvas(ctx, 1632, 608);
      resizeCanvas(ctx2, 1632, 608);
      my_sticky = 100;
    } else if (screen_name == "wtc") {
      // 768x384
      resize(768, 384);
      my_sticky = 100;
    } else {
      location.hash = "#default";
      my_sticky = 50;
      // normal

    }
  }
}





function minMaxLatLng(data) {

  var min_lat = 10000;
  var min_lng = 10000;
  var max_lat = -10000;
  var max_lng = -10000;


  for (var i = 0; i < data.length; i++) {
    var d = data[i];
    if (d.Latitude > max_lat) max_lat = parseFloat(d.Latitude);
    if (d.Latitude < min_lat) min_lat = parseFloat(d.Latitude);
    if (d.Longitude > max_lng) max_lng = parseFloat(d.Longitude);
    if (d.Longitude < min_lng) min_lng = parseFloat(d.Longitude);
  }
  return {
    min_lat: min_lat,
    max_lat: max_lat,
    min_lng: min_lng,
    max_lng: max_lng
  }
}

function load(url) {

  d3.csv(url, function(error, d) {

    if (error) console.log(error);
    data = d;
    afterLoad();
  });
}


function resizeCanvas(_ctx, _w, _h) {
  console.log(w);
  var c = document.getElementsByTagName('canvas');
  width = w = _w / DEVICE_SCALE;
  height = h = _h / DEVICE_SCALE;

  for (var i = 0; i < c.length; i++) {
    c[i].width = width;
    c[i].height = height;
  }
  _ctx.width = w;
  _ctx.height = h;
  _ctx.canvas.width = w;
  _ctx.canvas.height = h;
  console.log("resize: " + w + ":" + h);
  $('#canvas1').css({
    width: w + "px"
  });
  $('#canvas1').css({
    height: h + "px"
  });
  $('#canvas2').css({
    width: w + "px"
  });
  $('#canvas2').css({
    height: h + "px"
  });
  $('#canvas3').css({
    width: w + "px"
  });
  $('#canvas3').css({
    height: h + "px"
  });
}


function afterLoad() {
  for (var i = 2013; i <= 2016; i++) {
    years.push(i);
  }

  fixData(data);
  min_max = minMaxLatLng(data);
  addParticles(data)
  getTotals(data);

  last_trigger = frameCount = 0;
}

function getTotals(data) {
  for (var i = 0; i < years.length; i++) {
    //console.log(years[i]);
    var year_data = data.filter(p => p.Year == years[i]);
    var yr_total = 0;

    for (var j = 0; j < year_data.length; j++) {
      var d = year_data[j];
      yr_total += d.AQValue;
    }
    totals.push(yr_total);
  }

}





    function fixData(data) {
      for (var i = 0; i < data.length; i++) {
        var d = data[i];
        d.Year = parseInt(d.Year);
        d.AQValue = parseInt(d.AQValue);
      }
    }

    function checkIfAlreadySameXValue(x, year) {
      for (var i = 1; i < temp_particle.length; i++) {
        var p = temp_particle[i];
        if (p.x == x && p.year == year) return i;
      }
    }
