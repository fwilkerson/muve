function setAttribute(node, name, curr, prev) {
	if (name.slice(0, 2) == 'on') {
		name = name.toLowerCase().substring(2);
		if (curr) {
			if (!prev) node.addEventListener(name, delegateEvent);
		} else {
			node.removeEventListener(name, delegateEvent);
		}
		node._listeners = node._listeners || {};
		node._listeners[name] = curr;
	} else if (name == 'style') {
		if (curr) {
			const styles = Object.assign({}, prev, curr);
			for (let i in styles) {
				node.style[i] = curr[i] || '';
			}
		} else node.style.cssText = '';
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
