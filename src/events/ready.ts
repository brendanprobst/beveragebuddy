require("dotenv").config();
import { Events } from "discord.js";
import activeIntervals from "../activeUserCollection";

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: any) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		console.log("Here we go!");
		activeIntervals.each((interval) => clearInterval(interval));
		activeIntervals.clear();
		client.channels.cache.get(process.env.CHANNEL_ID).send("Hello World!");
	},
};
