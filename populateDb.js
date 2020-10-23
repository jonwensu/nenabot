const dbConfig = require("./data/dbConfig");
const questions = require("./data/pastokq").map((q) => q.trim());

const firebase = require("firebase/app");
require("firebase/database");

firebase.initializeApp(dbConfig);
const database = firebase.database();
const BASE_REF = "/questions";

const execute = () => {
	database.ref(BASE_REF).set(null);
	database.ref(BASE_REF).set(questions);
};

execute();
