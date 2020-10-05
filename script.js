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

  function getUVI(lat, lon) {
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
    }).then(function (response) {
      console.log(response);
    });
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

      updateWeather(response);
      getUVI(lat, lon);
    });
  }

  function updateWeather(response) {
    $("#city").html(
      "<h2>" +
        response.city.name +
        "   (" +
        response.list[0].dt_txt +
        ")" +
        "</h2>"
    );
    $("#weather").html(response.list[0].weather[0].main + "    ");

    var icon = $("<i>");
    var weatherIcon = response.list[0].weather[0].main;

    console.log(response.list[0].weather[0].main);

    if (weatherIcon === "Clear") {
      icon.addClass("fas fa-sun");
    } else if (weatherIcon === "Clouds") {
      icon.addClass("fas fa-cloud");
    } else if (weatherIcon === "Snow") {
      icon.addClass("fas fa-snow");
    } else if (weatherIcon === "Drizzle") {
      icon.addClass("fas fa-cloud-drizzle");
    } else if (weatherIcon === "Rain") {
      icon.addClass("fas fa-cloud-showers-heavy");
    }

    $("#weather").append(icon);

    $("#temp").html(response.list[0].main.temp + " °F");
    $("#humidity").html(response.list[0].main.humidity + " %");
    $("#wind").html(response.list[0].wind.speed + " MPH");
    console.log("line 80 " + response.list[0]);
    //5days forecast boxes
    //clearing it
    $(".fiveBox").empty();

    //looping through 5 days data from open weather map & get dates from moment.js
    for (var i = 1; i < 6; i++) {
      var date = moment()
        .add(i + 1, "days")
        .format("M/D/YYYY");

      var fiveDiv = $("<div id='fiveBoxCss'>");
      var fiveDate = $("<h6>");
      fiveDate.html(date);
      var icon = $("<br><i><br>");
      var fiveTemp = $("<br><span>");
      fiveTemp.html("Temp: " + response.list[i].main.temp + " °F" + "<br>");
      var fiveHumadity = $("<span>");
      fiveHumadity.html(
        "<br>" + "Humidity: " + response.list[i].main.humidity + " %" + "<br>"
      );

      fiveDiv.append(fiveDate, icon, fiveTemp, fiveHumadity);
      $(".fiveBox").append(fiveDiv);

      var weatherIcon = response.list[0].weather[0].main;

      if (weatherIcon === "Clear") {
        icon.addClass("fas fa-sun");
      } else if (weatherIcon === "Rain") {
        icon.addClass("fas fa-cloud-showers-heavy");
      } else if (weatherIcon === "Snow") {
        icon.addClass("fas fa-snowflake");
      } else if (weatherIcon === "Drizzle") {
        icon.addClass("fas fa-cloud-drizzle");
      } else if (weatherIcon === "Clouds") {
        icon.addClass("fas fa-cloud");
      }
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
      for (var i = 0; i < cityList.length; i++) {
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
