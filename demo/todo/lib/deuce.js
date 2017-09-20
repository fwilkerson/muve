const events = new Map();

var emitter = {
	on(eventName, handler) {
		const handlers = events.get(eventName) || [];
		events.set(eventName, handlers.concat(handler));
	},
	emit(eventName, event) {
		const handlers = events.get(eventName) || [];
		handlers.forEach(handler => handler(event));
	}
};

function setAttribute(node, name, curr, prev) {
	if (name[0] == 'o' && name[1] == 'n') {
		name = name.toLowerCase().substring(2);
		if (curr) {
			if (!prev) node.addEventListener(name, delegateEvent);
		} else {
			node.removeEventListener(name, delegateEvent);
		}
		node._listeners = node._listeners || {};
		node._listeners[name] = curr;
	} else {
		try {
			node[name] = curr;
		} catch (e) {}
		if (curr) node.setAttribute(name, curr);
		else node.removeAttribute(name);
	}
}

function delegateEvent(e) {
	return this._listeners[e.type](e);
}

function createNode(vnode) {
	if (typeof vnode === 'string') return document.createTextNode(vnode);

	const node = document.createElement(vnode.type);

	vnode.children = [].concat(vnode.children || []);
	vnode.children.forEach(c => c && node.appendChild(createNode(c)));
	Object.keys(vnode.attributes || {}).forEach(k =>
		setAttribute(node, k, vnode.attributes[k])
	);

	return node;
}

function patch(node, curr, prev, index) {
	const child =
		node.childNodes[index || 0] ||
		node.childNodes[node.childNodes.length - 1];

	if (!prev && curr) {
		node.appendChild(createNode(curr));
	} else if (!curr) {
		node.removeChild(child);
	} else if (
		typeof curr !== typeof prev ||
		(typeof curr === 'string' && curr !== prev) ||
		curr.type !== prev.type
	) {
		node.replaceChild(createNode(curr), child);
	} else if (curr.type) {
		patchAttributes(child, curr.attributes, prev.attributes);
		curr.children = [].concat(curr.children || []);
		const length = Math.max(curr.children.length, prev.children.length);
		for (let i = 0; i < length; i++) {
			patch(child, curr.children[i], prev.children[i], i);
		}
	}
}

function patchAttributes(node, curr, prev) {
	curr = curr || {};
	prev = prev || {};
	const attr = Object.assign({}, prev, curr);
	Object.keys(attr).forEach(k => setAttribute(node, k, curr[k], prev[k]));
}

const DISPATCH = 'DISPATCH';

function deuce(view, init, target) {
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

function dispatcher(model, subscriber) {
	let piece;
	return (update, name) => {
		model = Object.assign({}, model, (piece = update(model)));
		emitter.emit(DISPATCH, model);
		if (subscriber) subscriber(name || 'anonymous', piece);
	};
}

const stack = [];

function h(type, attributes, ...args) {
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

export {dispatcher, h};
export default deuce;
