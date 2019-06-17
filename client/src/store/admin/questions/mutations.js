const GET_QUESTION = (state, questions) => {
	state.questions = questions;
};

const GET_QUESTION_REPLIES = (state, dataReplies) => {
	for (const question of state.questions) {
		if (question.id === dataReplies.id) {
			Object.assign(question, { replies: dataReplies.replies });
			return;
		}
	}
};

const SEND_QUESTION_REPLY = (state, reply) => {
	for (const question of state.questions) {
		if (question.id === reply.question_id) {
			question.replies.push(reply.data);
			return;
		}
	}
};

const REPLACE_SUCCESS_QUESTION_REPLY = (state, resReply) => {
	const question = state.questions.find(q => q.id === resReply.question_id);
	const reply = question.replies.find(rl => rl.id === resReply.id);
	Object.assign(reply, resReply);
};

const REMOVE_ERROR_QUESTION_REPLY = (state, infoErrReply) => {
	const question = state.questions.find(q => q.id === infoErrReply.question_id);
	question.replies.filter(r => r.id !== infoErrReply.temp_id);
};

const RESET = (state) => {
	state.questions = [];
};

export default {
	GET_QUESTION,
	GET_QUESTION_REPLIES,
	SEND_QUESTION_REPLY,
	REPLACE_SUCCESS_QUESTION_REPLY,
	REMOVE_ERROR_QUESTION_REPLY,
	RESET
};
