import deuce, {dispatcher, h} from '../lib/deuce';

/* MODEL */

let model = {
	todo: '',
	todos: [{id: 1, text: 'Write Documentation', completed: false}],
	visible: 'All'
};

/* VIEW */

const view = model => (
	<Layout>
		<h2 class="title">Deuce Todos</h2>
		<input
			type="text"
			class="input is-large"
			value={model.todo}
			onInput={e => updateTodo(e.target.value)}
			onKeyDown={e => e.keyCode === 13 && addTodo(e.target.value)}
		/>
		<div class="has-text-right">
			<FilterLink text="All" visible={model.visible} />
			<FilterLink text="Incomplete" visible={model.visible} />
			<FilterLink text="Complete" visible={model.visible} />
		</div>
		<hr style="background-color: transparent" />
		{getVisibleTodos(model).map(todo => <Todo {...todo} />)}
	</Layout>
);

const Layout = ({children}) => (
	<section class="section">
		<div class="container">
			<div class="columns">
				<div class="column is-one-quarter" />
				<div class="column is-half">{children}</div>
			</div>
		</div>
	</section>
);

const FilterLink = ({text, visible}) => (
	<a
		class={visible === text ? 'has-text-weight-bold' : ''}
		style="margin: 0 0.25em;"
		onClick={() => updateVisible(text)}
	>
		{text}
	</a>
);

const Todo = ({id, text, completed}) => (
	<div class="notification is-primary">
		<button class="delete" onClick={() => deleteTodo(id)} />
		<a
			class="is-size-5"
			style={`text-decoration: ${completed ? 'line-through' : 'none'}`}
			onClick={() => toggleTodo(id)}
		>
			{text}
		</a>
	</div>
);

/* UPDATE */

const {dispatch, getModel} = dispatcher(model, (type, piece) => {
	console.log(type, piece, getModel());
});

function updateTodo(value) {
	dispatch(() => ({todo: value}), 'UPDATE_TODO');
}

let iterator = 1;

function addTodo(value) {
	iterator += 1;
	dispatch(({todos}) => ({
		todo: '',
		todos: [...todos, {id: iterator, text: value, completed: false}]
	}));
}

function deleteTodo(id) {
	dispatch(({todos}) => ({todos: todos.filter(todo => todo.id !== id)}));
}

function toggleTodo(id) {
	dispatch(model => ({
		todos: model.todos.map(
			todo =>
				todo.id === id
					? Object.assign({}, todo, {completed: !todo.completed})
					: todo
		)
	}));
}

function updateVisible(value) {
	dispatch(() => ({visible: value}));
}

/* UTILITIES */

function getVisibleTodos(model) {
	switch (model.visible) {
		case 'All':
			return model.todos;
		case 'Complete':
			return model.todos.filter(x => x.completed);
		case 'Incomplete':
		default:
			return model.todos.filter(x => !x.completed);
	}
}

/* RENDER */

deuce(view, model, document.getElementById('root'));
