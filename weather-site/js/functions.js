/* *************************************
 *  Weather Site JavaScript Functions
 ************************************* */
//console.log('My javascript is being read.');


/* *************************************
 *   Function get condition
 ************************************* */

function getCondition(condition) {
    console.log(condition);

    if (condition.includes("cloud") || condition.includes("cloudy") || condition.includes("Party Cloudy") ||
        condition.includes("Overcast")) {
        let keyword = "cloud";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("clear") || condition.includes("Sunny")) {
        let keyword = "clear";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("fog") || condition.includes("misty")) {
        let keyword = "fog";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("rain") || condition.includes("rainy") || condition.includes("wet weather")) {
        let keyword = "rain";
        console.log(keyword);
        return (keyword);
    } else if (condition.includes("snow") || condition.includes("snowy") || condition.includes("freezing")) {
        let keyword = "snow";
        console.log(keyword);
        return (keyword);
    }
}

/* *************************************
 *   Function change Summary Image
 ************************************* */


// Get location code from API
function getCode(LOCALE) {
    const API_KEY = '4Rv2CjA4GQnBDGrZYKmg9WEC8SxyYhmL';
    const URL = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + API_KEY + '&q=' + LOCALE;
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
            document.getElementById("currentTemp").innerHTML = locData['currentTemp'];
            locData['summary'] = data[0].WeatherText;
            locData['windSpeed'] = data[0].Wind.Speed.Imperial.Value;
            document.getElementById("speed").innerHTML = locData['windSpeed']
            locData['windUnit'] = data[0].Wind.Speed.Imperial.Unit;
            locData['windDirection'] = data[0].Wind.Direction.Localized;
            document.getElementById("Direction").innerHTML = locData['windDirection']
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
            var d = new Date();
            var n = d.getHours();
            var myAside = document.querySelector('aside');
            var myul = document.createElement('ul');
            myul.className = "hourlytemp";
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

                var myli = document.createElement('li');
                myli.textContent = n + "hrs: " + temp + "F";
                if (n == 23) {
                    n = -1;
                }
                n = n + 1;
                myul.appendChild(myli);

                // Replace stored low hi and low temps if they changed
                if (hiTemp != locData.pastHigh) {
                    locData["pastHigh"] = hiTemp; // When done, this is today's high temp
                }
                if (lowTemp != locData.pastLow) {
                    locData["pastLow"] = lowTemp; // When done, this is today's low temp
                }
                i++; // Increase the counter by 1
            }); // ends the foreach method
            myAside.appendChild(myul);
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
            const temp = locData.hourTemp1;
            const speed = locData.windSpeed;
            const direction = locData.windDirection; //Set your own value
            const condition = locData.summary; //Set your own value

            //JSON DATA GENERAL

            document.getElementById("currentTemp").innerHTML = locData.hourTemp1;
            document.getElementById("city").innerHTML = locData.name;
            document.getElementById("locState").innerHTML = locData.state;
            document.getElementById("codpostal").innerHTML = locData.postal;
            document.getElementById("elev").innerHTML = locData.elevation;
            document.getElementById("location").innerHTML = locData.geoposition;
            document.getElementById("highTemo").innerHTML = locData.postHgh;
            document.getElementById("lowTemp").innerHTML = locData.postLow;
            document.getElementById("direction").innerHTML = locData.windDirection;
            document.getElementById("conditionWeather").innerHTML = locData.summary

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

            //call the cuntion change summary image
            changeSummaryImage(keyword);

        })
        .catch(error => console.log('There was an error: ', error))

}

function changeSummaryImage(keyword) {
    console.log(keyword);
    const currentWeather = document.getElementById("curWeather");
    switch (keyword) {
        case "cloud":
            console.log("cloud");
            currentWeather.setAttribute("class", "cloud"); //"cloud" is the CSS rule selector
            break;
        case "clear":
            currentWeather.setAttribute("class", "clear");
            break;
        case "snow":
            console.log("class: snow");
            currentWeather.setAttribute("class", "snow");
            break;
        case "fog":
            currentWeather.setAttribute("class", "fog");
            break;
        case "rain":
            currentWeather.setAttribute("class", "rain");
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