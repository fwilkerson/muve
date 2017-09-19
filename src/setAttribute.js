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

export default setAttribute;
