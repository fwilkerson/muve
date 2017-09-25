import {dispatcher} from '../../../dist/deuce';

import service from './service';

export const category = {
	hot: 'hot',
	new: 'new',
	controversial: 'controversial'
};

const initialRoute = getInitialRoute();

export const model = {
	articles: [],
	type: initialRoute.type || category.hot,
	isBusy: false,
	route: initialRoute
};

const {dispatch, getModel} = dispatcher(model, logger);

export function fetchArticles(type) {
	dispatch({isBusy: true});
	service
		.get('r/javascript', type)
		.then(articles => dispatch({articles, isBusy: false}));
}

export function updateType(type) {
	const model = getModel();
	const route = {path: '/type', type};
	history.pushState(route, `/type/${type}`, `/type/${type}`);
	dispatch({type, route});
	if (model.type !== type || model.articles.length === 0) {
		fetchArticles(type);
	}
}

export function goToComments(id) {
	const route = {path: '/comments', id};
	history.pushState(route, `/comments/${id}`, `/comments/${id}`);
	dispatch({route});
}

export function registerRouter(event) {
	dispatch({route: event.state || {path: window.location.pathname}});
}

function getInitialRoute() {
	if (history.state) return history.state;

	if (window.location.pathname === '/') {
		const route = {path: '/type', type: category.hot};
		history.pushState(
			route,
			`/type/${category.hot}`,
			`/type/${category.hot}`
		);
		return route;
	} else return {path: window.localStorage.pathname};
}

function logger(name, piece) {
	console.log(name, piece, getModel());
}
