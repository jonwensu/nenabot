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

module.exports = {
	bold,
	italic,
	underline,
	strike,
	spoiler,
	code,
	mentionAuthor,
	doRoll,
	pick,
	shuffle
};
