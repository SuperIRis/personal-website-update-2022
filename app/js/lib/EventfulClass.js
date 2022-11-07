export default class EventfulClass {
	constructor() {
		this.events = [];
	}
	addEventListener(name, callback) {
		this.events.push({ name, callback });
	}

	removeEventListener(name) {
		this.events = this.events.filter((event) => event.name !== name);
	}

	removeAllEventListeners() {
		this.events.length = 0;
	}

	trigger(name, data) {
		this.events.forEach((event) => event.name === name && event.callback(data));
	}
}
