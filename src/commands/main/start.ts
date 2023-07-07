import { CommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import activeIntervals from "./activeUserCollection";
const reminderMessages = [
	"Sip now or forever hold your cold beverage.",
	"A beverage un-sipped is a beverage wasted.",
	"Don't wait too long, take a sip and keep going strong!",
	"A warm sip keeps the cold away.",
	"Pause. Sip. Enjoy. Repeat.",
	"Beverages are meant to be sipped, not left to chill.",
	"Embrace the warmth of your beverage, one sip at a time.",
	"A refreshing sip keeps the chill at bay.",
	"Inhale, exhale, and take a sip while it's still warm.",
	"Savor the moment, sip by sip.",
	"Don't let your drink grow cold. Take a sip and be bold!",
	"Time waits for no beverage. Take a sip and savor.",
	"Life is short, sip your drink while it's warm!",
	"Sip now, thank yourself later.",
	"Stay cozy, sip frequently.",
	"Let the warmth of your beverage fuel your day.",
	"Sip smart, sip often.",
	"Don't let your drink become a chilly memory. Sip it up!",
	"A warm sip is like a hug for your taste buds.",
	"Remember, a cold drink is just a sip away from being warm.",
	"Take a moment to sip, and let the worries slip.",
];
async function sendHighlightedMessage(
	user: any,
	content: string
): Promise<Message> {
	const message = await user.send(`<@${user.id}> ${content}`);
	return message;
}

async function editLastMessage(user: any, content: string): Promise<void> {
	const dmChannel = user.dmChannel;
	if (!dmChannel) return;

	const messages = await dmChannel.messages.fetch({ limit: 1 });

	if (messages.length == 1) {
		const lastMessage = messages[0];
		await lastMessage.edit(lastMessage.content.replace("<@.*>/", ""));
	}
}
// Define a collection to store active intervals for each user
module.exports = {
	data: new SlashCommandBuilder()
		.setName("start")
		.setDescription("Start receiving messages at a specified interval")
		.addIntegerOption((option) =>
			option
				.setName("interval")
				.setDescription("The interval in minutes")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		const user = interaction.user;
		if (user && !activeIntervals.has(user.id)) {
			//@ts-expect-error
			const _interval = interaction.options.getInteger("interval");
			let interval = _interval ?? 4;
			// Convert minutes to milliseconds
			const intervalMs = interval * 60000; // FOR DEV ONLY, revert to 60000 * interval;

			await interaction.reply(
				`<@${
					user.id
				}> I see you're enjoying a nice warm beverage. You will send a reminder to take a sip every ${interval} minute${
					interval !== 1 ? "s" : ""
				}. Hope you enjoy your beverage!`
			);

			// Set up an interval to send subsequent messages
			const intervalId = setInterval(async () => {
				const message =
					reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
				await sendHighlightedMessage(user, message);
				await new Promise((resolve) => setTimeout(resolve, intervalMs - 5000));
				await editLastMessage(user, message);
			}, intervalMs);
			activeIntervals.set(user.id, intervalId);
		} else {
			await interaction.reply(
				`<@${user.id}> You are already receiving messages. Please use the "/stop" command to stop receiving messages.`
			);
		}
	},
};
