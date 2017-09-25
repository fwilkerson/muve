import deuce from '../../../dist/deuce';

import {fetchArticles, model} from './model';
import view from './view';

deuce(view, model, document.getElementById('root'));

if (model.route.path === '/type') {
	fetchArticles(model.type);
}
