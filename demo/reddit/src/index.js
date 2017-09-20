import deuce, {h} from '../lib/deuce';

import {fetchArticles, model} from './update';
import view from './view';

deuce(view, model, document.getElementById('root'));

fetchArticles();
