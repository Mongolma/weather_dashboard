$(document).ready(function () {
  //openweathermap api key
  var apiKey = "6719a1c17ec54a51ccadca006bafca4a";

  //activating search btn
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();

    //assigning search value to city
    var city = $("#search").val().trim();
    //return if trying to search empty input
    if (!city) {
      return;
    }

    // display search history
    saveHistory(city);
    // when search button clicked get weather function works
    getWeather(city);
  });

  //Get UVI
  function getUVI(lat, lon) {
    var uvi = 0;
    var queryUrl2 =
      "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryUrl2,
      method: "GET",
      async: false,
      success: function (response) {
        uvi = response.value;
      },
    });
    return uvi;
  }

  //getting weather from http://api.openweathermap.org
  function getWeather(city) {
    var queryUrl1 =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      apiKey;

    $.ajax({
      url: queryUrl1,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      //assigning latitude information got it from open weather map
      var lat = response.city.coord.lat;

      //assigning longtitude information got it from open weather map
      var lon = response.city.coord.lon;
      console.log(response.city.coord.lon);

      var uVI = getUVI(lat, lon);
      updateWeather(response, uVI);
    });
  }

  function updateWeather(response, uVI) {
    $("#city").html(
      "<h2>" +
        response.city.name +
        "   (" +
        response.list[0].dt_txt +
        ")" +
        "</h2>"
    );

    // $("#weather").append(`${response.list[i].weather[0].icon}`);

    $("#temp").html(`Temp: ${response.list[0].main.temp}  °F`);
    $("#humidity").html(`Humid: ${response.list[0].main.humidity} %`);
    $("#wind").html(`Wind: ${response.list[0].wind.speed} MPH`);
    $("#uv").html(`UVI: ${uVI} `);

    console.log("line 80 " + response.list[0]);
    //5days forecast boxes
    //clearing it
    $(".fiveBox").empty();

    //looping through 5 days data from open weather map & get dates from moment.js
    var icon1 = $("<img><br>");
    var firstIcon = response.list[0].weather[0].icon;
    icon1.attr("src", "http://openweathermap.org/img/w/" + firstIcon + ".png");

    $("#weather").html(icon1);

    for (var i = 1; i < 6; i++) {
      var date = moment()
        .add(i + 1, "days")
        .format("M/D/YYYY");

      var fiveDiv = $("<div id='fiveBoxCss'>");
      var fiveDate = $("<h6>");
      fiveDate.html(date);
      // var icon = $("<br><i><br>");
      var icon = $("<img><br>");
      var fiveTemp = $("<br><span>");
      fiveTemp.html("Temp: " + response.list[i].main.temp + " °F" + "<br>");
      var fiveHumadity = $("<span>");
      fiveHumadity.html(`Humidity:  ${response.list[i].main.humidity}  %`);
      var fiveUV = $("<span>");
      fiveUV.html("<br>" + "UV: " + uVI + "<br>");
      console.log(response);

      var weatherIcon = response.list[i].weather[0].icon;
      icon.attr(
        "src",
        "http://openweathermap.org/img/w/" + weatherIcon + ".png"
      );

      fiveDiv.append(fiveDate, icon, fiveTemp, fiveHumadity, fiveUV);
      $(".fiveBox").append(fiveDiv);
    }
  }

  function saveHistory(city) {
    if (localStorage.getItem("searchHistory")) {
      var history = JSON.parse(localStorage.getItem("searchHistory"));
      //stopping city presents more than once
      if (history.indexOf(city) === -1) {
        // push city to history
        history.push(city);
        //saving history to local storage
        localStorage.setItem("searchHistory", JSON.stringify(history));
      }
    } else {
      //or save [city] to localstorage
      localStorage.setItem("searchHistory", JSON.stringify([city]));
    }
    searchCityList();
  }

  //list for last 8 searches
  function searchCityList() {
    if (localStorage.getItem("searchHistory")) {
      //retrieve search history and initialize in var city list
      var cityList = JSON.parse(localStorage.getItem("searchHistory"));
      //clearing div from appending all the time
      $("#cityListSrch").empty();
      //creating list for searched cities
      for (
        var i = cityList.length - 1;
        i >= 0 && i != cityList.length - 3;
        i--
      ) {
        var lists = $("<li>");
        lists.addClass("list-group-item");
        var listItem = $("<p>").text(cityList[i]);
        listItem.addClass("searchCity");
        lists.append(listItem);
        $("#cityListSrch").append(lists);
      }
    }
  }
});
