import {h} from '../lib/deuce';

import {category} from './update.js';

const view = model => (
	<main>
		<Header active={model.type} />
		<section class="section">
			<div class="container">
				{model.articles.map(article => <Article {...article} />)}
			</div>
		</section>
	</main>
);

const Header = props => (
	<nav class="navbar has-shadow">
		<div class="container">
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
