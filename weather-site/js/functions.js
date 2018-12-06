/* *************************************
 *  Weather Site JavaScript Functions
 ************************************* */
//console.log('My javascript is being read.');

const temp = 23;
const speed = 2.3;
const direction = "W"; //Set your own value
const condition ="Rain"; //Set your own value
 //call function build wind chill
 buildWC(speed, temp);
 //call function windDial
 windDial(direction);

 //call function get condition
 let keyword = getCondition(condition);
 //call the cuntion change summary image
 changeSummaryImage(keyword);

// Get location code from API
function getCode(LOCALE) {
    const API_KEY = '4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL';
    const URL = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + API_KEY + '&q=' + LOCALE;
    console.log(URL);
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {
            console.log('Json object from getCode function:');
            console.log(data);
            const locData = {}; // Create an empty object
            locData['key'] = data.Key; // Add the value to the object
            locData['name'] = data.LocalizedName;
            locData['postal'] = data.PrimaryPostalCode;
            locData['state'] = data.AdministrativeArea.LocalizedName;
            locData['stateAbbr'] = data.AdministrativeArea.ID;
            locData['geoposition'] = LOCALE;
            locData['elevation'] = data.GeoPosition.Elevation.Imperial.Value;
            getWeather(locData);
        })
        .catch(error => console.log('There was a getCode error: ', error))
} // end getCode function

/* URL to request city data using latitude and longitude */
/* "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL&q=43.816667%2C-111.783333&language=en-us&details=false&toplevel=false" */


// Get Current Weather data from API
function getWeather(locData) {
    const API_KEY = '4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL';
    const CITY_CODE = locData['key']; // We're getting data out of the object
    const URL = "https://dataservice.accuweather.com/currentconditions/v1/" + CITY_CODE + "?apikey=" + API_KEY + "&details=true";
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {
            console.log('Json object from getWeather function:');
            console.log(data); // Let's see what we got back
            // Start collecting data and storing it
            locData['currentTemp'] = data[0].Temperature.Imperial.Value;
            locData['summary'] = data[0].WeatherText;
            locData['windSpeed'] = data[0].Wind.Speed.Imperial.Value;
            locData['windUnit'] = data[0].Wind.Speed.Imperial.Unit;
            locData['windDirection'] = data[0].Wind.Direction.Localized;
            locData['windGust'] = data[0].WindGust.Speed.Imperial.Value;
            locData['pastLow'] = data[0].TemperatureSummary.Past12HourRange.Minimum.Imperial.Value;
            locData['pastHigh'] = data[0].TemperatureSummary.Past12HourRange.Maximum.Imperial.Value;
            getHourly(locData); // Send data to getHourly function
            buildPage(locData); // Send data to buildPage function
        })
        .catch(error => console.log('There was an error: ', error))
} // end getWeather function

// Get next 12 hours of forecast data from API
function getHourly(locData) {
    const API_KEY = '4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL';
    const CITY_CODE = locData['key'];
    const URL = "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/" + CITY_CODE + "?apikey=" + API_KEY;
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {
            console.log('Json object from getHourly function:');
            console.log(data); // See what we got back
            // Get the first hour in the returned data
            let date_obj = new Date(data[0].DateTime);
            let nextHour = date_obj.getHours(); // returns 0 to 23
            // Store into the object
            locData["nextHour"] = nextHour;
            // Counter for the forecast hourly temps
            var i = 1;
            // Get the temps for the next 12 hours
            data.forEach(function (element) {
                let temp = element.Temperature.Value;
                let hour = 'hourTemp' + i;
                locData[hour] = temp; // Store hour and temp to object
                // New hiTemp variable, assign value from previous 12 hours
                let hiTemp = locData.pastHigh;
                // New lowTemp variable, assign value from previous 12 hours
                let lowTemp = locData.pastLow;
                // Check current forecast temp to see if it is 
                // higher or lower than previous hi or low
                if (temp > hiTemp) {
                    hiTemp = temp;
                } else if (temp < lowTemp) {
                    lowTemp = temp;
                }

                // Replace stored low hi and low temps if they changed
                if (hiTemp != locData.pastHigh) {
                    locData["pastHigh"] = hiTemp; // When done, this is today's high temp
                }
                if (lowTemp != locData.pastLow) {
                    locData["pastLow"] = lowTemp; // When done, this is today's low temp
                }
                i++; // Increase the counter by 1
            }); // ends the foreach method
            console.log('Finished locData object and data:');
            console.log(locData);

        })
        .catch(error => console.log('There was an error: ', error))

} // end getHourly function

function buildPage(locData) {
    const API_KEY = '4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL';
    const CITY_CODE = locData['key'];
    const URL = "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/" + CITY_CODE + "?apikey=" + API_KEY;
    fetch(URL)
        .then(response => response.json())
        .then(function (data) {

            // Variables for Function Use
            const temp = locData.currentTemp;
            const speed = locData.windSpeed;
            const direction = locData.windDirection; //Set your own value
            const condition = locData.summary; //Set your own value

            //JSON DATA GENERAL

            document.getElementById("currentTemp").innerHTML = locData.currentTemp;
            document.getElementById("city").innerHTML = locData.name;
            document.getElementById("locState").innerHTML = locData.state;
            document.getElementById("codpostal").innerHTML = locData.postal;
            document.getElementById("Elev").innerHTML = locData.elevation;
            document.getElementById("location").innerHTML = locData.geoposition;
            document.getElementById("hTemp").innerHTML = locData.pastHigh;
            document.getElementById("lowTemp").innerHTML = locData.pastLow;
            document.getElementById("unit").innerHTML = locData.windDirection;
            document.getElementById("conditionWeather").innerHTML = locData.summary;

            //JSON FOR NEXT 12HRS
            var i = 1;
            var d = new Date();
            var n = d.getHours();
            console.log(n);

            var myAside = document.querySelector('aside');
            var myul = document.createElement('ul');
            myul.className = "hourlytemp";
            // Get the temps for the next 12 hours
            data.forEach(function (element) {
                let temp = element.Temperature.Value;
                var myli = document.createElement('li');
                myli.textContent = n + "hrs: " + temp + "F";
                if (n == 23) {
                    n = -1;
                }
                n = n + 1;
                myul.appendChild(myli);

                i++; // Increase the counter by 1
            }); // ends the foreach method
            myAside.appendChild(myul);

            //call function build wind chill
            buildWC(speed, temp);
            //call function windDial
            windDial(direction);

            //call function get condition
            let keyword = getCondition(condition);
            console.log("keyword:");
            console.log(keyword);
            //call the cuntion change summary image
            changeSummaryImage(keyword);
            document.getElementById("status").setAttribute("class", "hide");
            document.getElementsByTagName("MAIN")[0].setAttribute("class", "");

        })
        .catch(error => console.log('There was an error: ', error))

}

/* *************************************
 *   Function get condition
 ************************************* */

function getCondition(condition) {
    console.log(condition);

    if (condition.includes("Cloud") || condition.includes("Cloudy") || condition.includes("Party Cloudy") ||
        condition.includes("Overcast")) {
        let keyword = "cloud";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("Clear") || condition.includes("Sunny") || condition.includes("Mostly clear")) {
        let keyword = "clear";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("Fog") || condition.includes("misty")) {
        let keyword = "fog";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("Rain") || condition.includes("rainy") || condition.includes("wet weather")) {
        let keyword = "rain";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("Snow") || condition.includes("snowy") || condition.includes("freezing")) {
        let keyword = "snow";
        console.log(keyword);
        return (keyword);
    }
}


/* *************************************
 *   Function change Summary Image
 ************************************* */
function changeSummaryImage(keyword) {
    console.log("keyword in changesummaryimage");
    console.log(keyword);
    const currentWeather = document.getElementById("curWeather");
    const imagebox = document.getElementById("imagebox");
    switch (keyword) {
        case "cloud":
            console.log("cloud");
            currentWeather.setAttribute("class", "cloud"); //"cloud" is the CSS rule selector
            imagebox.setAttribute("src", "images/clouds_300.jpg");
            break;
        case "clear":
            currentWeather.setAttribute("class", "clear");
            imagebox.setAttribute("src", "images/clear_300.jpg");
            break;
        case "snow":
            console.log("class: snow");
            currentWeather.setAttribute("class", "snow");
            imagebox.setAttribute("src", "images/snow_300.jpg");
            break;
        case "fog":
            currentWeather.setAttribute("class", "fog");
            imagebox.setAttribute("src", "images/fog_300.jpg");
            break;
        case "rain":
            currentWeather.setAttribute("class", "rain");
            imagebox.setAttribute("src", "images/rain_300.jpg");
            break;
    }
}


/* *************************************
 *   Wind Dial Function
 ************************************* */

// Calculate the Wind Dial
function windDial(direction) {
    // Get the container
    const dial = document.getElementById("dial");
    console.log(direction);
    // Determine the dial class
    switch (direction) {
        case "North":
        case "N":
            dial.setAttribute("class", "n"); //"n" is the CSS rule selector
            break;
        case "NE":
        case "NNE":
        case "ENE":
            dial.setAttribute("class", "ne");
            break;
        case "NW":
        case "NNW":
        case "WNW":
            dial.setAttribute("class", "nw");
            break;
        case "South":
        case "S":
            dial.setAttribute("class", "s");
            break;
        case "SE":
        case "SSE":
        case "ESE":
            dial.setAttribute("class", "se");
            break;
        case "SW":
        case "SSW":
        case "WSW":
            dial.setAttribute("class", "sw");
            break;
        case "East":
        case "E":
            dial.setAttribute("class", "e");
            break;
        case "West":
        case "W":
            dial.setAttribute("class", "w");
            break;
    }
}



/* *************************************
 *   Wind Chill Function
 ************************************* */

//this function will calculate a wind chill temperature


// Calculate the Windchill
function buildWC(speed, temp) {

    console.log("speed:");
    console.log(speed);
    console.log("temp");
    console.log(temp);
    const feelTemp = document.getElementById('feelTemp');

    // Compute the windchill
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);

    // Round the answer down to integer
    wc = Math.floor(wc);

    // If chill is greater than temp, return the temp
    wc = (wc > temp) ? temp : wc;

    // Display the windchill
    console.log(wc);
    // wc = 'Feels like '+wc+'°F';
    feelTemp.innerHTML = wc;
}

// Get location info, based on city key, from API
function getLocationByKey(cityKey) {
    const API_KEY = '4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL';
    const URL = 'https://dataservice.accuweather.com/locations/v1/'+cityKey+'?apikey='+API_KEY;
    fetch(URL)
     .then(response => response.json())
     .then(function (data) {
      console.log('Json object from getLocationByKey function:');
      console.log(data);
      const locData = {}; // Create an empty object
      locData['key'] = data.Key; // Add the value to the object
      locData['name'] = data.LocalizedName;
      locData['postal'] = data.PrimaryPostalCode;
      locData['state'] = data.AdministrativeArea.LocalizedName;
      locData['stateAbbr'] = data.AdministrativeArea.ID;
      let lat = data.GeoPosition.Latitude;
      let long = data.GeoPosition.Longitude;
      const LOCALE = lat+', '+long;
      locData['geoposition'] = LOCALE;
      locData['elevation'] = data.GeoPosition.Elevation.Imperial.Value;
      getWeather(locData);
      })
     .catch(error => console.log('There was a getLocationByKey error: ', error))
    } // end getLocationByKey function