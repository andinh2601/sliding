const Event = requireWrp('models/event');
const EventUser = requireWrp('models/event-user');
const { nextStringOf } = requireWrp('modules/common');

// generate new event code
let getEventCode;
Event.findLastOf('id', { select: 'code' })
	.exec()
	.then((lastEvent) => {
		console.warn(`Last event code: ${lastEvent.code}`);
		getEventCode = (function* () {
			const codeBone = 'abcdefghijklmnopqrstuvwxyz0123456789';
			let code = 'aaa';
			if (lastEvent) {
				code = nextStringOf(lastEvent.code, codeBone);
			}
			while (true) {
				yield code;
				code = nextStringOf(code, codeBone);
			}
		}());
	})
	.catch((error) => {
		console.error(error);
		return process.exit(1);
	});

const ctrl = {
	async query(req, res, next) {
		const rules = {
			limit: 'integer|between:0,50',
			offset: 'integer|min:0',
			order: 'alpha_dash'
		};
		if (!res.$v.rif(rules)) return;

		const opt = req.query;
		const result = {};
		try {
			const events = await EventUser.findEventsByUserId(req.user.id, {
				order: opt.order,
				limit: Number(opt.limit || 10),
				offset: Number(opt.offset || 0)
			}).exec();
			result.events = events;
		}
		catch (error) {
			return next(error);
		}
		return res.sendwm(result);
	},

	async create(req, res, next) {
		const rules = {
			name: 'string|required|max:100',
			description: 'string',
			allow_search: 'boolean',
			require_auth: 'boolean',
			start_at: 'date|required',
			end_at: 'date|required|after_or_equal:start_at'
		};
		if (!res.$v.rif(rules)) return;

		const info = req.body;
		const result = {};
		try {
			// generate new code
			info.code = getEventCode.next().value;

			const event = await Event.create(info).exec(1);
			await EventUser.create({
				user_id: req.user.id,
				event_id: event.id,
				role: 'host'
			}).exec();
			result.code = event.code;
		}
		catch (error) {
			return next(error);
		}

		return res.sendwm(result);
	}
};

module.exports = ctrl;
