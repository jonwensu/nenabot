import dotenv from 'dotenv';

dotenv.config();

const {
	BOT_TOKEN,
	BOT_PREFIX,
	OWNER_ID,
	BOT_ACTIVITY_NAME,
	BOT_ACTIVITY_TYPE,
	QUESTION_DURATION = 0,
	PARTICIPANT_WAIT_DURATION = 0,
	NEXT_QUESTION_DELAY = 0,
	MAX_ROUNDS = 0,
	API_BASE_URL,
	DB_URL,
	DB_NAME,
} = process.env;

export default {
	commandPrefix: BOT_PREFIX,
	owner: OWNER_ID,
	token: BOT_TOKEN,
	dbUrl: DB_URL || '',
	dbName: DB_NAME || '',
	activity: {
		name: BOT_ACTIVITY_NAME,
		type: BOT_ACTIVITY_TYPE,
	},
	api: {
		baseURL: API_BASE_URL,
	},
	commands: {
		emoji: {
			questionDuration: +QUESTION_DURATION,
			participantWaitDuration: +PARTICIPANT_WAIT_DURATION,
			nextQuestionDelay: +NEXT_QUESTION_DELAY,
			maxRounds: +MAX_ROUNDS,
		},
	},
};
