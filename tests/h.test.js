import test from 'tape';

import {h} from '../src';

test('create vnode with no attributes or children', t => {
	const vnode = h('div');

	t.deepEqual(
		vnode,
		{type: 'div', attributes: {}, children: []},
		'created vnode'
	);

	t.end();
});

test('create vnode with attributes', t => {
	const vnode = h('div', {class: 'container', onClick: () => {}});

	t.deepEqual(
		JSON.stringify(vnode),
		JSON.stringify({
			type: 'div',
			attributes: {class: 'container', onClick: () => {}},
			children: []
		}),
		'created vnode with attributes'
	);

	t.end();
});

test('create vnode with numeric child', t => {
	let vnode = h('div', null, 0);

	t.deepEqual(
		vnode,
		{type: 'div', attributes: {}, children: ['0']},
		'converts numeric child to string and wraps in array'
	);

	vnode = h('div', null, 1);

	t.deepEqual(
		vnode,
		{type: 'div', attributes: {}, children: ['1']},
		'converts numeric child to string and wraps in array'
	);

	t.end();
});

test('create vnode with type function', t => {
	const Custom = props => ({
		type: 'div',
		attributes: {class: props.class},
		children: props.children
	});

	const vnode = h(Custom, {class: 'test'}, 'Custom Child');

	t.deepEqual(
		vnode,
		{type: 'div', attributes: {class: 'test'}, children: ['Custom Child']},
		'rendered function type'
	);

	t.end();
});

test('create vnode with array of children', t => {
	const vnode = h('ul', null, [h('li', null, false), h('li', null, 'two')]);

	t.deepEqual(vnode, {
		type: 'ul',
		attributes: {},
		children: [
			{type: 'li', attributes: {}, children: []},
			{type: 'li', attributes: {}, children: ['two']}
		]
	});

	t.end();
});
