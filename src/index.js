import emitter from './emitter';
import patch from './patch';

const DISPATCH = 'DISPATCH';

function muve(view, init, target) {
	target = target || document.body;
	let prev;

	emitter.on(DISPATCH, model => {
		let temp = view(model);
		patch(target, temp, prev);
		prev = temp;
	});

	prev = view(init || {});
	patch(target, prev);
}

export function dispatcher(model, subscriber) {
	return {
		dispatch: (update, name) => {
			model = Object.assign({}, model, update);
			emitter.emit(DISPATCH, model);
			if (subscriber && name) subscriber(name, update);
		},
		getModel: () => Object.assign({}, model)
	};
}

const stack = [];

export function h(type, attributes, ...args) {
	let child, i;
	const children = [];
	attributes = attributes || {};

	for (i = args.length; i--; ) {
		stack.push(args[i]);
	}

	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--; ) {
				stack.push(child[i]);
			}
		} else if (child != null && child !== true && child !== false) {
			if (typeof child === 'number') child = String(child);
			children.push(child);
		}
	}
	if (typeof type === 'function') {
		return type(Object.assign({}, attributes, {children}));
	} else return {type, attributes, children};
}

export default muve;
