import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import activeIntervals from "./activeUserCollection";

const stopMessages = [
	"The steam fades away, signaling a tranquil pause.",
	"The cozy mug takes a rest, its whispers subdued.",
	"As the last sip settles, the warm symphony concludes.",
	"The comforting warmth recedes, leaving serene silence in its wake.",
	"The drink's embrace softens, bidding farewell to lively conversations.",
	"With the final taste savored, a gentle hush befalls the scene.",
	"As the swirls of warmth subside, stillness emerges gracefully.",
	"The mug's song of warmth fades, replaced by a serene melody.",
	"The journey of sips reaches its destination, leaving tranquility behind.",
	"The last drop vanishes, bestowing peaceful serenity upon the moment.",
	"The steam dance gracefully bows out, leaving behind a sense of calm.",
	"As the comforting ritual concludes, a quiet embrace fills the air.",
	"The warmth of the drink recedes, its presence acknowledged in peaceful stillness.",
	"The final sip bids adieu, enveloping the space in tranquil quietude.",
	"The last taste of warmth lingers briefly, then fades away, leaving gentle serenity.",
	"With the comforting sips now at rest, a calmness takes hold, gently enveloping the surroundings.",
	"The mug stands empty, whispers hushed, and a moment of tranquility prevails.",
	"The warmth in every drop dissipates, as the final sip is savored, leaving behind a peaceful pause.",
	"The comforting ritual gently concludes, leaving a sense of quietude and contentment.",
	"The last sip brings closure, and a serene ambiance embraces the moment.",
	"As the warmth in each sip bids adieu, silence and tranquility settle in.",
];
module.exports = {
	data: new SlashCommandBuilder()
		.setName("stop")
		.setDescription("Stop receiving messages"),
	async execute(interaction: CommandInteraction) {
		const user = interaction.user;

		if (user && activeIntervals.has(user.id)) {
			// Clear the interval for the user and stop the messages
			const intervalId = activeIntervals.get(user.id);
			clearInterval(intervalId);
			activeIntervals.delete(user.id);
			const message =
				stopMessages[Math.floor(Math.random() * stopMessages.length)] +
				" Bye now :)";

			await interaction.reply(message);
		} else {
			await interaction.reply("You are not currently receiving messages.");
		}
	},
};
