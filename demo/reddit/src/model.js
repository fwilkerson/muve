import {interact} from 'muve';

import service from './service';

export const category = {
  hot: 'hot',
  new: 'new',
  controversial: 'controversial',
};

const initialRoute = getInitialRoute(category.hot);

export const model = {
  articles: [],
  type: initialRoute.type || category.hot,
  isBusy: false,
  route: initialRoute,
};

const {getModel, setModel} = interact(model);

export function fetchArticles(type) {
  setModel({isBusy: true});
  service.querySubreddit('r/javascript', type).then(articles => {
    setModel({articles, isBusy: false});
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

export function getInitialRoute(defaultCategory) {
  if (history.state) return history.state;

  if (window.location.pathname === '/') {
    const route = {path: '/type', type: defaultCategory};
    history.pushState(
      route,
      `/type/${defaultCategory}`,
      `/type/${defaultCategory}`
    );
    return route;
  } else return {path: window.location.pathname};
}
