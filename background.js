const API_KEY = "AIzaSyAl7eBLqtKkqyo6Ncs5_hjeCFHeydZC5eQ";
let user_sign_in = false;
let resultData = '';
// This gives the extention permission to work on any http page
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { schemes:['http','https']}
        })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
/*This function gets the authentication token of the user and gets the user information to
allow them to sign in and give permission for me to access the google calendar*/
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
/*This initialy gets the access token which is a unique token that gives the extention
authorization to your email and calendar*/
        if (request.message === 'get_access_token'){
          chrome.identity.getAuthToken({ interactive: true }, function(auth_token) {
            console.log(auth_token);
              var init = {
                'method' : 'GET',
                'async'  : true,
                'headers': {
                  'Authorization' : 'Bearer ' + auth_token,
                  'Content-Type': 'application/json'
                },
                'contentType': 'json'
              };
/*This gets the date and time of the class using a link from the
google api to convert it into json format*/
              var d = new Date();
              fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?&orderBy=startTime&singleEvents=true&timeMin=' + ISODateString(d) + '&maxResults=40', init)
              .then((response) => response.json())
              .then(function(data) {
                var len = 4;
                var ctr = 0;
                resultData = '';
//This is a for loop that filters the items that the user gets
                  for(itm = 0; itm<data.items.length;itm++){
//Filters it by the single creator
                    if(data.items[itm].creator.email == 'calendarmanager@acsamman.edu.jo'){
//Slices the time because its around 20 digits long
                      var slicedTime = data.items[itm].start.dateTime.slice( 11, 16);
//This is what gets put out to the client side
                      resultData += '<div class= "col-2"><p class = "text-center">' + slicedTime + '</p></div><div class= "col-10"><h6 small class = "text-center">' + data.items[itm].summary + '</h6 small></div>';
                      ctr++;
                    };
                      if(ctr == len){
                      var views = chrome.extension.getViews({
                        type: "popup"
                      });
                      for (var i = 0; i < views.length; i++) {
                        views[i].document.getElementById('gridContainer').innerHTML = resultData;
                      }
                        return;
                    }
                  }
                });
          });
          sendResponse(true);
//Gets email adress and unique id assosiated with it
        }else if (request.message === 'get_profile'){
          chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function(user_info) {
              console.log(user_info);
            });
            sendResponse(true);
//This is the data collected after its narrowed down to its basic time and class
          }else if (request.message === 'get_result_date') {
              sendResponse(resultData);
              return true;
          }
      	});

      function ISODateString(d){
      function pad(n){return n<10 ? '0'+n : n}
      return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'}
