import test from 'tape';
import jsdom from 'jsdom-global';

import createNode from '../src/createNode';

test('can create node from vnode', t => {
	const dispose = jsdom();
	const vnode = {type: 'div'};
	const node = createNode(vnode);

	t.ok(node, 'node has value');

	t.equal(node.nodeName.toLowerCase(), vnode.type, 'vnode type matches node');

	dispose();
	t.end();
});

test('can create vnode w/ children', t => {
	const dispose = jsdom();
	const vnode = {
		type: 'div',
		children: [{type: 'h2', children: 'Hello, World'}]
	};
	const node = createNode(vnode);

	t.equal(
		node.children[0].nodeName.toLowerCase(),
		vnode.children[0].type,
		'vnode child matches node child'
	);

	dispose();
	t.end();
});

test('can create vnode w/ class attributes', t => {
	const dispose = jsdom();

	const vnode = {
		type: 'button',
		attributes: {class: 'button'},
		children: ['click me!']
	};
	const node = createNode(vnode);

	t.equal(
		node.classList[0],
		vnode.attributes.class,
		'vnode class attribute matches node classList'
	);

	dispose();
	t.end();
});
