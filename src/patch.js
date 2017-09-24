import createNode from './createNode';
import setAttribute from './setAttribute';

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
		curr.children = [].concat(curr.children);
		const length = Math.max(curr.children.length, prev.children.length);
		for (let i = 0; i < length; i++) {
			patch(child, curr.children[i], prev.children[i], i);
		}
	}
}

function patchAttributes(node, curr, prev) {
	const attr = Object.assign({}, prev, curr);
	Object.keys(attr).forEach(k => setAttribute(node, k, curr[k], prev[k]));
}

export default patch;
