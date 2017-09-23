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
	isBusy: false,
	route: {}
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
	dispatch(() => ({type}));
	if (model.type !== type) {
		fetchArticles(type);
	}
}

export function goToComments(id) {
	const route = {path: '/comments', id};
	history.pushState(route, `/comments/${id}`, `/comments/${id}`);
	dispatch(() => ({route}), 'GO_TO_COMMENTS');
}

export function registerRouter(event) {
	dispatch(() => ({route: event.state || {path: '/'}}));
}

function logUpdates(name, piece) {
	console.log(name, piece);
}
