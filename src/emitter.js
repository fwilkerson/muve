const events = new Map();

export default {
	on(eventName, handler) {
		const handlers = events.get(eventName) || [];
		events.set(eventName, handlers.concat(handler));
	},
	emit(eventName, event) {
		const handlers = events.get(eventName) || [];
		handlers.forEach(handler => handler(event));
	}
};
