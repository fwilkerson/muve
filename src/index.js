import patch from './patch';

let render = () => {};

function muve(view, init, target) {
	let prev;

	render = model => {
		let temp = view(model);
		patch(target, temp, prev);
		prev = temp;
	};

	prev = view(init);
	patch(target, prev);
}

export function interact(model, log) {
	return {
		getModel: () => model,
		setModel: (update, name) => {
			model = Object.assign({}, model, update);
			render(model);
			if (log && name) log(name, update);
		}
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
