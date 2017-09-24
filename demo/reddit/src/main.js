import deuce, {h} from '../lib/deuce';

import {fetchArticles, model} from './model';
import view from './view';

deuce(view, model, document.getElementById('root'));

if (model.route.path === '/type') {
	fetchArticles(model.type);
}
