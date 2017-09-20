import {dispatcher} from '../lib/deuce';

import service from './service';

export const category = {
	hot: 'hot',
	new: 'new',
	rising: 'rising'
};

export const model = {
	articles: [],
	type: category.hot,
	isBusy: true
};

const {dispatch, getModel} = dispatcher(model, logUpdates);

export function fetchArticles(type) {
	dispatch(() => ({isBusy: true}), 'FETCHING_ARTICLES');
	service
		.get('r/javascript', type)
		.then(articles =>
			dispatch(() => ({articles, isBusy: false}), 'RECEIVE_ARTICLES')
		);
}

export function updateType(type) {
	const model = getModel();
	dispatch(() => ({type}), 'UPDATE_TYPE');
	if (model.type !== type) {
		fetchArticles(type);
	}
}

function logUpdates(name, piece) {
	console.log(name, piece);
}
