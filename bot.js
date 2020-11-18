require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const firebase = require("firebase/app");
require("firebase/database");

const hiddenCommands = ["emoji", "inom", "paninda", "listemoji"];

const { config: dbConfig } = require("./data/dbConfig");
const cron = require("./helper/cron");

firebase.initializeApp(dbConfig);
const database = firebase.database();

const { BOT_ACTIVITY_NAME, BOT_ACTIVITY_TYPE } = process.env;

// Create a Discord.Client() instance.
const client = new Discord.Client({
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
client.database = database;

client.activity = { name: BOT_ACTIVITY_NAME, type: BOT_ACTIVITY_TYPE };

// Load all commands into the client's commands object from the /commands/ folder.
client.commands = {};
fs.readdir("./commands", (err, files) => {
	try {
		files.forEach((file) => {
			const prop = require(`./commands/${file}`);
			const name = file.split(".")[0];

			const hidden = hiddenCommands.includes(name);

			client.commands[name] = { ...prop, hidden };
		});
	} catch (err) {
		console.log(err);
	}
});

// Load all commands into the client's events object from the /events/ folder.
client.events = {};
fs.readdir("./events", (err, files) => {
	try {
		files.forEach((file) => {
			const eventName = file.split(".")[0];
			const prop = require(`./events/${file}`);

			client.events[eventName] = prop;
			client.on(eventName, prop.bind(null, client));
		});
	} catch (err) {
		console.log(err);
	}
});

// Initiate the connection with Discord using the token located in the client's settings object.
client.login(process.env.BOT_TOKEN).then(() => {
	client.database = database;
	console.log("logged In");
	cron.execute(client);
});

// Catch and report discord.js errors.
client.on("error", (err) => console.error(err));
client.on("warn", (err) => console.warn(err));
// client.on('debug', (err) => console.info(err))

// Catch and report UnhandledPromiseRejectionWarnings.
process.on("unhandledRejection", (error) =>
	console.error("Uncaught Promise Rejection", error)
);
