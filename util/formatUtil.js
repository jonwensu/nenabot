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

module.exports = {
	bold,
	italic,
	underline,
	strike,
	spoiler,
	code,
	mentionAuthor,
};
