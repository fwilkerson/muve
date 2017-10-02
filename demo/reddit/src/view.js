import {h} from 'muve';

import {category, goToComments, updateRoute, updateType} from './model';
import {Router, Route} from './router';

const view = model => (
	<main>
		<Header active={model.type} />
		<Router model={model} routeChanged={updateRoute}>
			<Route path="/type/:type" view={home} />
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
					<a href={props.url} target="_blank">
						{props.title}
					</a>
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
			<h2 class="title">Comments for post {model.route.id}</h2>
		</div>
	</section>
);

export default view;
