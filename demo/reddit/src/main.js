import muve from '../../../dist/muve.js';

import {fetchArticles, model} from './model';
import view from './view';

muve(view, model, document.getElementById('root'));

if (model.route.path === '/type') {
	fetchArticles(model.type);
}
