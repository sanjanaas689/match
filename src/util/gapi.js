// Client ID and API key from the Developer Console
var CLIENT_ID = process.env.REACT_APP_GAPI_CLIENT_ID;
var API_KEY = process.env.REACT_APP_GAPI_API_KEY;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// // Only when google is loaded, we can trigger the client load
// window.addEventListener("google-loaded", handleClientLoad);

/**
 *  On load, called to load the auth2 library and API client library.
 */
export function handleClientLoad(callbackFunction) {
    window.gapi.load('client:auth2', () => initClient(callbackFunction));
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient(callbackFunction) {
    window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        console.log("Initialized gapi client correctly.")
        // Listen for sign-in state changes.
        window.gapi.auth2.getAuthInstance().isSignedIn.listen((status) => updateSigninStatus(status, callbackFunction));

        // Handle the initial sign-in state.
        updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), callbackFunction);
    }, function (error) {
        let errorString = JSON.stringify(error, null, 2);
        console.log(errorString);
        throw errorString;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn, callbackFunction) {
    if (isSignedIn) {
        // We can program this to be dynamic later, for now hard-coded
        getData('1B6rSsKKJBj3KJ5haz_VGbaquMSPKd-pZd6w_lcrFg0I');
        let user = window.gapi.auth2.getAuthInstance().currentUser.get();
        callbackFunction(user);
    } else {
        callbackFunction(null);
    }
}

/**
 *  Sign in the user upon button click.
 */
export function handleAuthClick() {
    window.gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
export function handleSignoutClick() {
    window.gapi.auth2.getAuthInstance().signOut();
}

/**
 * https://docs.google.com/spreadsheets/d/1B6rSsKKJBj3KJ5haz_VGbaquMSPKd-pZd6w_lcrFg0I/edit
 */
function getData(spreadsheetId) {
    console.log("Getting data!")
    window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        // Select entire sheet range
        range: 'A1:ZZ', 
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            console.log(range);
        } else {
            console.log('No data found.');
        }
    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}
