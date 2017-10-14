import {interact} from '../../../dist/muve.js';

import {getInitialRoute} from './router';
import service from './service';

export const category = {
	hot: 'hot',
	new: 'new',
	controversial: 'controversial'
};

const initialRoute = getInitialRoute(category.hot);

export const model = {
	articles: [],
	type: initialRoute.type || category.hot,
	isBusy: false,
	route: initialRoute
};

const {getModel, setModel} = interact(model, logger);

export function fetchArticles(type) {
	setModel({isBusy: true});
	service.querySubreddit('r/javascript', type).then(articles => {
		setModel({articles, isBusy: false}, 'RECEIVE_ARTICLES');
	});
}

export function updateType(type) {
	const model = getModel();
	const route = {path: '/type', type};
	history.pushState(route, `/type/${type}`, `/type/${type}`);
	setModel({type, route});
	if (model.type !== type || model.articles.length === 0) {
		fetchArticles(type);
	}
}

export function goToComments(id) {
	const route = {path: '/comments', id};
	history.pushState(route, `/comments/${id}`, `/comments/${id}`);
	setModel({route});
}

export function updateRoute(event) {
	const {type, articles} = getModel();
	if (
		event.state &&
		event.state.type &&
		(event.state.type !== type || articles.length === 0)
	) {
		updateType(event.state.type);
	} else {
		setModel({route: event.state || {path: window.location.pathname}});
	}
}

function logger(name, piece) {
	console.log(name, piece, getModel());
}
