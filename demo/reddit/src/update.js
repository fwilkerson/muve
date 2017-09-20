import {dispatcher} from '../lib/deuce';

import api from './api';

export const category = {
	hot: 'hot',
	new: 'new',
	rising: 'rising'
};

export const model = {
	articles: [
		{
			created: 1505566957,
			id: 't3_70f4qj',
			subreddit: 'javascript',
			title: 'Update: Do we need a JavaScriptHelp subreddit?',
			url:
				'https://www.reddit.com/r/javascript/comments/70f4qj/update_do_we_need_a_javascripthelp_subreddit/'
		}
	],
	type: category.hot
};

const {dispatch, getModel} = dispatcher(model);

export function fetchArticles() {
	const {type} = getModel();

	api('r/javascript', type).then(articles => {
		console.log(articles);
		dispatch(() => ({articles}));
	});
}
