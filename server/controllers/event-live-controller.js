const EventModel = requireWrp('models/event');
const EventRoleModel = requireWrp('models/event-role');
const Roles = requireDir('resources/roles/');

module.exports = {
	async getEvent({ io, socket, code }) {
		const result = {};

		try {
			const Event = new EventModel();
			const EventRole = new EventRoleModel();
			// find event
			let ioEvent = io.$fn.getEvent(code);
			let event = ioEvent;
			if (!event) {
				event = await Event.findByCode(code).exec();
				if (!event) {
					throw { expected: socket.$fn.t('eventNotFound') };
				}
				else {
					ioEvent = io.$fn.addEvent(event);
				}
			}
			result.event = event;

			// check user role
			if (socket.$fn.isAuthenticated()) {
				const eventRole = await EventRole.findRole({
					event_id: result.event.id,
					user_id: socket.$fn.getUser().id
				}).exec();
				result.role = Roles[eventRole ? eventRole.role : 'guest'];
			}
			else {
				result.role = Roles.guest;
			}
			socket.$fn.setRole(result.role);
			socket.$fn.setEventCode(result.event.code);

			// join role room
			socket.join(ioEvent.rooms.main);
			if (['host', 'moderator'].includes(result.role.name)) {
				socket.join(ioEvent.rooms.admin);
			}
			else {
				socket.join(ioEvent.rooms.guest);
			}
		}
		catch (error) {
			return socket.$fn.handleError(error);
		}

		return socket.emit('get_event', result);
	}
};
