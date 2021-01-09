import { AxiosResponse } from 'axios';
import { Message, Snowflake, User } from 'discord.js';
import { CommandoClientOptions } from 'discord.js-commando';

/* ---- Config ---- */
type ConfigType = Partial<CommandoClientOptions> & {
	activity: {
		name: string;
		type: 'LISTENING' | 'PLAYING' | 'WATCHING';
	};
	api: {
		baseURL: string;
	};
	commands: {
		emoji: EmojiGameConfigType;
	};
};

/* ---- Command Group ---- */
enum CommandGroupKeys {
	'GENERAL',
	'FUN',
	'UTILITY',
	'GAME',
}

type CommandGroupType = {
	[key in CommandGroupKeys[keyof CommandGroupKeys]]: {
		name: string;
		description: string;
	};
};

/************************/
/**  Command ArgTypes  **/
/************************/

/* ---- Common ArgTypes ---- */
interface SingleUserArgType {
	target: User;
}

type AsyncCommandRunType = Promise<Message | Message[] | null>;
type CommandRunType = AsyncCommandRunType | null;

/* ---- Pautang ArgTypes ---- */
interface PautangArgType {
	item: string | null;
}

/* ---- Pastok ArgTypes ---- */
interface PastokRecentQuestionType {
	question: string;
	cooldown: number;
}

export interface PastokGetAllResponse extends AxiosResponse {
	data: {
		questions: string[];
	};
}

export interface EmojiGetAllResponse extends AxiosResponse {
	data: {
		questions: EmojiGameQuestion[];
	};
}

/* ---- Potchi ArgTypes ---- */
interface PotchiArgType {
	quantity: number;
}

/* ---- Pabili ArgTypes ---- */
interface PabiliArgType {
	paninda: string;
}

/* ---- Emoji Game ---- */
interface EmojiGameParticipant {
	id: string;
	username: string;
	score: number;
}

interface EmojiGameQuestion {
	question: string;
	answer: string;
	alias: string[];
	category: string;
	producerLocation: string;
	done: boolean = false;
}

interface EmojiGameConfigType {
	questionDuration: number;
	participantWaitDuration: number;
	nextQuestionDelay: number;
	maxRounds: number;
}

interface EmojiGameArgType {
	rounds: number;
}
