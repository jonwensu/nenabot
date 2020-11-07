const dotenv = require("dotenv");
// const firebase = require("firebase/app");

dotenv.config();

const {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_DATABASE_URL,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_APP_ID,
} = process.env;

const config = {
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	databaseURL: FIREBASE_DATABASE_URL,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	appId: FIREBASE_APP_ID,
	appName: "ekyc-mock-server",
};

var database = null;

module.exports = {
	config,
	// init: () => {
	// 	firebase.initializeApp(config);
	// 	database = firebase.database();
	// },
};
