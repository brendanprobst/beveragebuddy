import activeIntervals from "./commands/main/activeUserCollection";

require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const token: string = process.env.DISCORD_TOKEN as string;

const client = new Client({ intents: [GatewayIntentBits.Guilds] }); // Create a new client instance
client.commands = new Collection(); // register a commands collection on the client
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file: any) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
			);
		}
	}
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file: any) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args: any) => event.execute(...args));
	} else {
		client.on(event.name, (...args: any) => event.execute(...args));
	}
}
// Event: When an error occurs
client.on("error", (error: string) => {
	console.error("An error occurred:", error);

	// Get your user ID (the bot owner)
	const ownerId = "420755374740602881";

	// Get your user object
	const ownerUser = client.users.cache.get(ownerId);

	// Send a DM to yourself with the error details
	ownerUser
		.send(`An error occurred:\n\`\`\`\n${error}\n\`\`\``)
		.catch(console.error); // Handle any error that occurs while sending the DM
});
client.on("start", () => {
	console.log("Here we go!");
	activeIntervals.each((interval) => clearInterval(interval));
	activeIntervals.clear();
});
// Log in to Discord with your client's token
client.login(token);
