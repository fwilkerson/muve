import {h} from '../lib/deuce';

import {category, updateType} from './model.js';

const view = model => (
	<main>
		{model.isBusy && <Loading />}
		<Header active={model.type} />
		<section class="section">
			<div class="container">
				{model.articles.map(article => <Article {...article} />)}
			</div>
		</section>
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

const Article = props => (
	<article class="media box">
		<div class="media-content">
			<div class="content">
				<p>{props.title}</p>
			</div>
		</div>
	</article>
);

export default view;
