import deuce, {h} from '../lib/deuce';

import {fetchArticles, model} from './model';
import view from './view';

fetchArticles(model.type);

deuce(view, model, document.getElementById('root'));
