import test from 'tape';
import jsdom from 'jsdom-global';

import deuce, {dispatcher} from '../src';
import data from './data/listings.json';

test('deuce renders without state', t => {
	const dispose = jsdom();

	deuce(() => ({type: 'h2', attributes: {}, children: ['Hello, World']}));

	t.equal(
		document.querySelector('h2').innerHTML,
		'Hello, World',
		'deuce rendered without state'
	);

	dispose();
	t.end();
});

const {dispatch, getModel} = dispatcher({count: 0});
const increment = () => {
	const {count} = getModel();
	dispatch({count: count + 1});
};
const decrement = () => {
	const {count} = getModel();
	dispatch({count: count - 1});
};

const view = model => ({
	type: 'div',
	attributes: {},
	children: [
		{type: 'h2', attributes: {}, children: [`${model.count}`]},
		{
			type: 'button',
			attributes: {onClick: increment},
			children: ['+']
		},
		{
			type: 'button',
			attributes: {onClick: decrement},
			children: ['-']
		}
	]
});

test('counter', t => {
	const dispose = jsdom();
	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	deuce(view, {count: 0});

	const buttons = document.querySelectorAll('button');
	const counter = document.querySelector('h2');
	buttons[0].dispatchEvent(event);
	t.equal(counter.innerHTML, '1', 'count was incremented');
	buttons[0].dispatchEvent(event);
	t.equal(counter.innerHTML, '2', 'count was incremented');
	buttons[0].dispatchEvent(event);
	t.equal(counter.innerHTML, '3', 'count was incremented');
	buttons[1].dispatchEvent(event);
	t.equal(counter.innerHTML, '2', 'count was decremented');

	dispose();
	t.end();
});

const Listings = actions => model => {
	return {
		type: 'div',
		attributes: {},
		children: [Actions(model, actions), List(model)]
	};
};

function Actions(model, actions) {
	return {
		type: 'div',
		attributes: {style: 'margin: 1em; text-align: right;'},
		children: [
			{
				type: 'button',
				attributes: {id: 'btnMore', style: 'margin: 0 0.5em;'},
				children: ['More']
			},
			{
				type: 'button',
				attributes: {
					id: 'btnRestart',
					style: 'margin: 0 0.5em;',
					onClick: actions.updateResults
				},
				children: ['Restart']
			}
		]
	};
}

function List(model) {
	return {
		type: 'ul',
		attributes: {style: 'list-style: none; margin: 1em; padding: 0;'},
		children: model.results.map(Link)
	};
}

function Link(data) {
	return {
		type: 'li',
		attributes: {
			style: 'margin: 0.5em 0; padding: 0.5em; border: 0.5px solid #777;'
		},
		children: [
			{
				type: 'a',
				attributes: {href: data.url, target: '_blank'},
				children: [data.title]
			},
			SubLink(data)
		]
	};
}

function SubLink({created, subreddit}) {
	const createDate = new Date(0);
	createDate.setSeconds(created);
	return {
		type: 'div',
		attributes: {style: 'margin-top: 0.25em;'},
		children: [
			`r/${subreddit}`,
			{
				type: 'span',
				attributes: {style: 'margin-left: 0.5em;'},
				children: [`(${createDate.toLocaleDateString()})`]
			}
		]
	};
}

test('stress test', function(t) {
	const dispose = jsdom(`<div id='root'></div>`);

	const model = {results: data.concat(data)};
	const {dispatch, getModel} = dispatcher(model);

	const actions = {
		updateResults: () => {
			const {results} = getModel();
			dispatch({results: results.concat(results)});
		}
	};
	deuce(Listings(actions), model, document.querySelector('#root'));

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	t.equal(
		document.querySelector('#root ul').childElementCount,
		data.length * 2,
		'listings were rendered'
	);

	document.querySelector('#btnRestart').dispatchEvent(event);

	t.equal(
		document.querySelector('#root ul').childElementCount,
		data.length * 4,
		'listings were doubled'
	);

	dispose();
	t.end();
});

test('remove/replace/append test', function(t) {
	const dispose = jsdom(`<div id='root'></div>`);

	const model = {results: data.slice(0, 5)};
	const {dispatch, getModel} = dispatcher(model, (name, update) => {
		t.equal(name, 'UPDATE_RESULTS', 'name is returned from subscribe');
		t.ok(update, 'piece of model being updated is returned');
	});
	const actions = {
		updateResults: () =>
			dispatch({results: data.slice(3, 8)}, 'UPDATE_RESULTS')
	};
	deuce(Listings(actions), model, document.querySelector('#root'));

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	let links = document.querySelectorAll('#root ul li a');
	let listings = data.slice(0, 5);

	links.forEach(link => {
		t.ok(
			listings.some(y => link.innerHTML === y.title),
			'link matches listing title'
		);
	});

	document.querySelector('#btnRestart').dispatchEvent(event);

	links = document.querySelectorAll('#root ul li a');
	listings = data.slice(3, 8);

	links.forEach(link => {
		t.ok(
			listings.some(y => link.innerHTML === y.title),
			'link matches listing title'
		);
	});

	dispose();
	t.end();
});

test('remove all and append', function(t) {
	const dispose = jsdom(`<div id='root'></div>`);

	const model = {results: data.slice(0, 5)};
	const {dispatch, getModel} = dispatcher(model);
	const actions = {
		updateResults: () => dispatch({results: data.slice(6, 15)})
	};
	deuce(Listings(actions), model, document.querySelector('#root'));

	const event = document.createEvent('HTMLEvents');
	event.initEvent('click', true, true);

	let links = document.querySelectorAll('#root ul li a');
	let listings = data.slice(0, 5);

	links.forEach(link => {
		t.ok(
			listings.some(y => link.innerHTML === y.title),
			'link matches listing title'
		);
	});

	document.querySelector('#btnRestart').dispatchEvent(event);

	links = document.querySelectorAll('#root ul li a');
	listings = data.slice(6, 15);

	t.deepEqual(
		getModel(),
		{results: listings},
		'getModel returns the correct state'
	);

	links.forEach(link => {
		t.ok(
			listings.some(y => link.innerHTML === y.title),
			'link matches listing title'
		);
	});

	dispose();
	t.end();
});
