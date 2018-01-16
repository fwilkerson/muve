import test from 'tape';
import jsdom from 'jsdom-global';

import hydrateAttributes from '../src/hydrateAttributes';

test('skips if vnode is a string', t => {
	const node = {test: 'fakeNode'};
	const result = hydrateAttributes(node, 'test');

	t.deepEqual(node, {test: 'fakeNode'}, 'node is unchanged');
	t.end();
});

test('given a node, attributes will be updated', t => {
	const dispose = jsdom();

	document.body.appendChild(document.createElement('div'));

	hydrateAttributes(document.body, {
		type: 'div',
		attributes: {class: 'a-css-class'},
		children: []
	});

	const node = document.querySelector('div.a-css-class');

	t.true(node != null, 'class attribute was set');

	dispose();
	t.end();
});

test('give a node with children, child attributes will be updated', t => {
	const dispose = jsdom('<div><a>click me</a></div>');

	let clicked = false;

	hydrateAttributes(document.body, {
		type: 'div',
		attributes: {class: 'a-css-class'},
		children: [
			{
				type: 'a',
				attributes: {
					onClick: () => {
						clicked = true;
					}
				},
				children: ['click me']
			}
		]
	});

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	document.querySelector('div.a-css-class > a').dispatchEvent(event);

	t.true(clicked, 'on click attribute was handled');
	dispose();
	t.end();
});
