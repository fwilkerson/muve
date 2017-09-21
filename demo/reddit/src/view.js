import {h} from '../lib/deuce';

import {category, goToComments, registerRouter, updateType} from './model.js';

const view = model => (
	<main>
		<Header active={model.type} />
		<Router model={model}>
			<Route exact path="/" view={home} />
			<Route path="/comments/:id" view={comments} />
		</Router>
		{model.isBusy && <Loading />}
	</main>
);

const Loading = props => (
	<div style="position: fixed; bottom: 2rem; right: 2rem; z-index: 1">
		<span class="icon is-large has-text-primary">
			<i class="fa fa-spinner fa-3x fa-pulse" />
		</span>
	</div>
);

const Header = props => (
	<nav class="navbar has-shadow">
		<div class="container" style="display: flex;">
			<div class="navbar-tabs" style="margin: auto;">
				{Object.keys(category).map(key => (
					<HeaderLink active={props.active} text={key} />
				))}
			</div>
		</div>
	</nav>
);

const HeaderLink = props => (
	<a
		class={
			props.active === props.text
				? 'navbar-item is-tab is-active'
				: 'navbar-item is-tab'
		}
		onClick={() => updateType(props.text)}
	>
		{props.text}
	</a>
);

const Router = props => {
	if (!props.children) return; // Error?

	if (!window.onpopstate) window.onpopstate = registerRouter;

	const match = props.children.find(matchRoute);

	if (match) {
		if (match.forward) {
			history.pushState(
				{route: match.forward},
				match.forward,
				match.forward
			);
		}
		return match.view(props.model);
	} else {
		// Not Found?
	}
};

function matchRoute(route) {
	const currentPath = window.location.pathname;
	if (route.exact) {
		return currentPath === route.path || currentPath === route.forward;
	}

	let partial = currentPath.match(/[^\/]+/g)[0];

	return (
		partial === route.path.match(/[^\/]+/g)[0] ||
		partial === (route.forward && route.forward.match(/[^\/]+/g)[0])
	);
}

const Route = props => props;

const home = model => (
	<section class="section">
		<div class="container">
			{model.articles.map(article => <Article {...article} />)}
		</div>
	</section>
);

const Article = props => (
	<article class="media box">
		<figure class="media-left has-text-grey">
			<span class="icon">
				<i class="fa fa-arrow-up" />
			</span>
			<br />
			<p class="has-text-centered">{props.score}</p>
			<span class="icon">
				<i class="fa fa-arrow-down" />
			</span>
		</figure>
		<div class="media-content">
			<div class="content">
				<p>
					<a>{props.title}</a>
					<br />
					<small class="is-size-7">
						submitted on&nbsp;
						{new Date(
							new Date(0).setSeconds(props.created)
						).toLocaleDateString()}
						&nbsp;by&nbsp;
					</small>
					<em class="size-is-7">/u/{props.author}</em>
					<br />
					<small>
						<a
							onClick={() => goToComments(props.id)}
							class="has-text-grey"
						>
							{props.comments} comments
						</a>
					</small>
				</p>
			</div>
		</div>
	</article>
);

const comments = model => (
	<section class="section">
		<div class="container">
			<h2 class="title">Comments go here</h2>
		</div>
	</section>
);

export default view;
