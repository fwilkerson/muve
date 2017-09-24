import setAttribute from './setAttribute';

function createNode(vnode) {
	if (typeof vnode === 'string') return document.createTextNode(vnode);

	const node = document.createElement(vnode.type);

	vnode.children.forEach(c => node.appendChild(createNode(c)));
	Object.keys(vnode.attributes).forEach(k =>
		setAttribute(node, k, vnode.attributes[k])
	);

	return node;
}

export default createNode;
