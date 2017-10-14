import test from 'tape';
import jsdom from 'jsdom-global';

import muve, {interact} from '../src';

test('conditional style obj', function(t) {
	const dispose = jsdom(`<div id='root'></div>`);

	const model = {styleObject: true};

	const {getModel, setModel} = interact(model);

	muve(
		model => ({
			type: 'div',
			attributes: {style: model.styleObject && {backgroundColor: 'blue'}},
			children: ['Test']
		}),
		model,
		document.getElementById('root')
	);

	t.equal(
		document.querySelector('#root > div').style.cssText,
		'background-color: blue;',
		'style object was rendered'
	);

	setModel({styleObject: false});

	t.equal(
		document.querySelector('#root > div').style.cssText,
		'',
		'style object was rendered'
	);

	dispose();
	t.end();
});
