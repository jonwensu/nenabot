class Game {
	totalRounds = 0;
	pool = [];
	round = 0;
	participants = [];

	constructor(pool, totalRounds) {
		this.pool = pool.map((p) => ({ ...p, done: false }));
		this.totalRounds = !totalRounds ? pool.length : totalRounds;
	}

	addParticipant = ({ id, tag }) =>
		this.participants.push({
			id,
			tag,
			score: 0,
		});

	currentEmoji = () => this.pool[this.round];

	markDone = () => {
		this.pool[this.round] = {
			...this.pool[this.round],
			done: true,
		};
	};

	nextRound = () => this.round++;

	isLastRound = () => this.round === this.totalRounds - 1;

	addScore = (participant) => {
		this.participants = this.participants.reduce((acc, curr) => {
			if (participant === curr.id) {
				return [
					...acc,
					{
						...curr,
						score: +curr.score + 1,
					},
				];
			}

			return [...acc, curr];
		}, []);
	};
}

module.exports = Game;
