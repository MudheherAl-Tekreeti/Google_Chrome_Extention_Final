//This is how I get the date and time to display at the top.
var timeId;
var dateId;
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//This is the time & date function
function setTimeAndDate() {
    var date = new Date();
    var minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    var time = date.getHours() + ":" + minutes;
    var date = days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
    var timeElement = document.getElementById("time");
    var dateElement = document.getElementById("date");
    timeElement.innerHTML = time;
    dateElement.innerHTML = date;
    console.log("time", time);
    console.log("date", date);
}
// This is the listener that waits until the extention upens for it to load the Date and Time
document.addEventListener("DOMContentLoaded",function(dcle) {setTimeAndDate();});
// This is the listener that waits until the extention upens for it to load the access token and profile data
document.addEventListener("DOMContentLoaded", function() {
chrome.runtime.sendMessage({message : 'get_access_token'});
chrome.runtime.sendMessage({message : 'get_profile'});
});
