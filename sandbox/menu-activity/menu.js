//get menu where clicks will occur
const MENULINK = document.getElementById("page-nav");


//intercept the menu link clicks 
MENULINK.addEventListener("click", function (evt) {


    //get the data values for state and city
    // see https://javascript.info/bubbling-and-capturing for evt.target explanation
    let cityName = evt.target.dataset["city"];
    let stateName = evt.target.dataset["state"];
    console.log(cityName);
    console.log(stateName);
    if (cityName != null) {
        evt.preventDefault();
    }

});

//get location code from weather.json file
//function getElementById  
//there is an ERROR IN THIS CODE AND THATS THE ONLY MISTAKE IN THIS SECTION      
function getdata(LOCALE) {
    let URL = 'script/weather.json'; // where you have saved weather.json 
    fetch(URL) // fetch is like go get this data from- remember dogs, they get things to us when we throw things
        .then(response => response.json()) // go get this and response should be in json
        .then(function (data) { // variable that is stored inside of json 
            console.log('Json object from getdata function:');
            console.log(data);
            console.log(data.LOCALE});
        //     const locData = {}; // Create an object
        //     locData['name'] = ;
        //     locData['postal'] = ;
        //     locData['state'] = ;
        //     locData['geoposition'] = ;
        //     locData['elevation'] = ;
        //     getWeather(locData);
         })
        .catch(error => console.log('There was a getCode error: ', error))
} // end getdata function