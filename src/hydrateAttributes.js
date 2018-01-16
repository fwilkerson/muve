function hydrateAttributes(node, vnode, index) {
	if (typeof vnode === 'string') return;
	const child = node.childNodes[index || 0];

	Object.keys(vnode.attributes).forEach(k =>
		setAttribute(child, k, vnode.attributes[k])
	);

	vnode.children = [].concat(vnode.children);
	const length = vnode.children.length;
	for (let i = 0; i < length; i++) {
		hydrateAttributes(child, vnode.children[i], i);
	}
}

export default hydrateAttributes;
