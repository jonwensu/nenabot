const Discord = require("discord.js");

function bold(str) {
	return `**${str}**`;
}

function italic(str) {
	return `*${str}*`;
}

function underline(str) {
	return `__${str}__`;
}

function strike(str) {
	return `~~${str}~~`;
}

function spoiler(str) {
	return `||${str}||`;
}

function code(str) {
	return "`" + str + "`";
}

function mentionAuthor({ author: { id: authorId } }) {
	return `<@${authorId}>`;
}

function doRoll(max) {
	return Math.floor(Math.random() * max);
}

function doRollRange(mn, mx) {
	const min = Math.ceil(mn);
	const max = Math.floor(mx);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rateRoll(rate) {
	return doRoll(100) < rate;
}

function pick(pool) {
	return pool[doRoll(pool.length)];
}

function shuffle(b) {
	const a = b.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function createEmbedMessage(color = "#0099ff", title) {
	return new Discord.MessageEmbed({ color, title });
}

function getEmoji(client, name, fallback = ":smile:") {
	return client.emojis.cache.find((emoji) => emoji.name === name) || fallback;
}

module.exports = {
	bold,
	italic,
	underline,
	strike,
	spoiler,
	code,
	mentionAuthor,
	doRoll,
	doRollRange,
	pick,
	shuffle,
	createEmbedMessage,
	getEmoji,
	rateRoll,
};
