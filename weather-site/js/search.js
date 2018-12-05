'use strict';

// Get the query element from the DOM
const QUERY = document.getElementById("query");

// Listen for search entries, get matching locations
QUERY.addEventListener("keyup", function () {
    let searchValue = QUERY.value;
    // Call the processJSON function to request data and build results
    processJSON(searchValue);
   }); // ends the eventListener

