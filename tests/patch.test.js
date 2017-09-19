import test from 'tape';
import jsdom from 'jsdom-global';
import sinon from 'sinon';

import patch from '../src/patch';

test('can patch vnode without children', t => {
	const dispose = jsdom(`<div id="root"></div>`);
	const node = document.querySelector('#root');
	const vnode = {type: 'div'};

	patch(node, vnode);

	t.ok(document.querySelector('#root>div'), 'node without children rendered');

	patch(node, {type: 'div', attributes: {id: 'test'}}, vnode);

	t.ok(document.querySelector('#test'), 'patched node without children');

	dispose();
	t.end();
});

test('can add child <em>!</em> to h2', t => {
	const dispose = jsdom(`<div id="root"></div>`);
	const node = document.querySelector('#root');
	const vnode = {
		type: 'div',
		children: [{type: 'h2', children: 'Hello, World'}]
	};
	const update = {
		type: 'div',
		children: [
			{
				type: 'h2',
				children: ['Hello, World', {type: 'em', children: '!'}]
			}
		]
	};

	patch(node, vnode);

	t.equal(
		document.querySelector('#root div>h2').innerHTML,
		'Hello, World',
		'vnode rendered'
	);

	patch(node, update, vnode);

	t.equal(
		document.querySelector('#root div>h2>em').innerHTML,
		'!',
		'patch was rendered'
	);

	t.equal(
		document.querySelector('#root div>h2').childNodes[0].textContent,
		'Hello, World',
		'patch was not destructive'
	);

	dispose();
	t.end();
});

test('can replace h2 with ul', t => {
	const dispose = jsdom(`<div id="root"></div>`);
	const node = document.querySelector('#root');
	const vnode = {
		type: 'div',
		children: [{type: 'h2', children: 'Hello, World'}]
	};
	const update = {
		type: 'div',
		children: [
			{
				type: 'ul',
				children: [
					{type: 'li', children: {type: 'a', children: 'click me!'}}
				]
			}
		]
	};

	patch(node, vnode);

	t.equal(
		document.querySelector('#root div>h2').innerHTML,
		'Hello, World',
		'vnode rendered'
	);

	patch(node, update, vnode);

	t.equal(
		document.querySelector('#root ul>li>a').innerHTML,
		'click me!',
		'patched replace and create'
	);

	dispose();
	t.end();
});

test('can handle conditional render', t => {
	const dispose = jsdom(`<div id="root"></div>`);
	const node = document.querySelector('#root');
	const vnode = {
		type: 'ul',
		children: [
			{type: 'li', children: '1'},
			null && {type: 'li', children: '2'}
		]
	};
	const updated = {
		type: 'ul',
		children: [
			{type: 'li', children: '1'},
			true && {type: 'li', children: '2'}
		]
	};

	patch(node, vnode);

	t.equal(
		document.querySelector('#root ul').children.length,
		1,
		'ignored the null child'
	);

	patch(node, updated, vnode);

	t.equal(
		document.querySelector('#root ul').children.length,
		2,
		'patched the second li in'
	);

	dispose();
	t.end();
});

test('can add & remove onclick', t => {
	const dispose = jsdom(`<div id="root"></div>`);
	const node = document.querySelector('#root');
	const callback = sinon.spy();
	const vnode = {
		type: 'div',
		attributes: {class: 'container'},
		children: [
			{
				type: 'button',
				attributes: {onClick: callback},
				children: 'click me!'
			}
		]
	};
	const update = {
		type: 'div',
		children: [
			{
				type: 'button',
				attributes: {onClick: null},
				children: 'click me!'
			}
		]
	};

	patch(node, vnode);

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	document.querySelector('.container>button').dispatchEvent(event);

	t.equal(callback.callCount, 1, 'onClick was executed');

	patch(node, update, vnode);

	document.querySelector('#root button').dispatchEvent(event);

	t.equal(callback.callCount, 1, 'click listener was removed');

	dispose();
	t.end();
});
