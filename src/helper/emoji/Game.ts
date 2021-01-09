import { Snowflake, User } from 'discord.js';
import { EmojiGameParticipant, EmojiGameQuestion } from '../../typings';

export default class Game {
	totalRounds = 0;
	pool: EmojiGameQuestion[] = [];
	round = 0;
	participants: EmojiGameParticipant[] = [];

	constructor(pool: EmojiGameQuestion[], totalRounds: number) {
		this.pool = pool.map((p) => ({ ...p, done: false }));
		this.totalRounds = !totalRounds ? pool.length : totalRounds;
	}

	addParticipant({ id, username }: { id: string; username: string }): number {
		return this.participants.push({
			id,
			username,
			score: 0,
		});
	}

	currentEmoji(): EmojiGameQuestion {
		return this.pool[this.round];
	}

	markDone(): void {
		this.pool[this.round] = {
			...this.pool[this.round],
			done: true,
		};
	}

	nextRound(): void {
		this.round++;
	}

	isLastRound(): boolean {
		return this.round === this.totalRounds - 1;
	}

	addScore(participant: Snowflake): void {
		this.participants = this.participants.reduce(
			(acc: EmojiGameParticipant[], curr) => {
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
			},
			[]
		);
	}
}
