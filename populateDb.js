const dbConfig = require("./data/dbConfig");
// const questions = require("./data/emoji/movie");
const questions = require("./data/pastokq");

const firebase = require("firebase/app");
require("firebase/database");

firebase.initializeApp(dbConfig);
const database = firebase.database();
const BASE_REF = "/questions";
// const BASE_REF = "/emojis/movie";

const execute = () => {
	// database.ref(BASE_REF).set(null);
	database.ref(BASE_REF).push(questions);
};

execute();
