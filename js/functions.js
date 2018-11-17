/* *************************************
*  Weather Site JavaScript Functions
************************************* */
//console.log('My javascript is being read.');

// Variables for Function Use
const temp = 31;
const speed = 5;
const direction = "SW"; //Set your own value
const condition = "rain" //Set your own value

/* *************************************
*   Function get condition
************************************* */
//call function get condition
function getCondition(condition){
    console.log(condition);

    if(condition.includes("cloud") || condition.includes("cloudy") || condition.includes("Party Cloudy")
     || condition.includes("Overcast")){
        let keyword = "cloud";
        console.log(keyword);
        return(keyword);
    }
    else if(condition.includes("clear") || condition.includes("Sunny")){
        let keyword = "clear";
        console.log(keyword);
        return(keyword);
    }
    else if(condition.includes("fog") || condition.includes("misty")){
        let keyword = "fog";
        console.log(keyword);
        return(keyword);
    }
    else if(condition.includes("rain") || condition.includes("rainy") || condition.includes("wet weather")){
        let keyword = "rain";
        console.log(keyword);
        return(keyword);
    }
    else if(condition.includes("snow") || condition.includes("snowy") || condition.includes("freezing")){
        let keyword = "snow";
        console.log(keyword);
        return(keyword);
    }
}


let keyword = getCondition(condition);
/* *************************************
*   Function change Summary Image
************************************* */
//call the cuntion change summary image
changeSummaryImage(keyword);
function changeSummaryImage(keyword){
    console.log(keyword);
    const currentWeather = document.getElementById("curWeather");
    switch (keyword){
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
//call function windDial
windDial(direction);

// Calculate the Wind Dial
function windDial(direction){
    // Get the container
    const dial = document.getElementById("dial");
    console.log(direction);
    // Determine the dial class
    switch (direction){
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
//call function build wind chill
buildWC(speed, temp);

// Calculate the Windchill
function buildWC(speed, temp){
    const feelTemp = document.getElementById('feelTemp');

    // Compute the windchill
    let wc = 35.74 + 0.6215 * temp - 35.75 * Math.pow(speed, 0.16) + 0.4275 * temp * Math.pow(speed, 0.16);
    console.log(wc);
   
    // Round the answer down to integer
    wc = Math.floor(wc);
   
    // If chill is greater than temp, return the temp
    wc = (wc > temp)?temp:wc;
   
    // Display the windchill
    console.log(wc);
    // wc = 'Feels like '+wc+'°F';
    feelTemp.innerHTML = wc;
}

