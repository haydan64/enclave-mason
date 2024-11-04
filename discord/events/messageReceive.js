const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		console.log(message);
		// Check if the message is from a specific channel (replace with your channel ID)
		const targetChannelId = '778866185562357780';

		// Ensure the message is not from a bot and is in the correct channel
		if (message.channel.id === targetChannelId && !message.author.bot) {
			// Your logic for handling the message
			console.log(`Message received in the target channel: ${message.content}`);

			// You can reply to the message, do some processing, etc.
			message.reply('Message received!');
		}
	},
};