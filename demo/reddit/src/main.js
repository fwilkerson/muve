import muve from 'muve';

import {fetchArticles, model} from './model';
import view from './view';

muve(view, model, document.getElementById('root'));

if (model.route.path === '/type') {
	fetchArticles(model.type);
}
