import deuce, {dispatcher, h} from '../lib/deuce';

let iterator = 1;

let model = {
	todo: '',
	todos: [{id: 1, text: 'Write Documentation', completed: false}],
	visible: 'All'
};

const getVisibleTodos = model => {
	switch (model.visible) {
		case 'All':
			return model.todos;
		case 'Complete':
			return model.todos.filter(x => x.completed);
		default:
			return model.todos.filter(x => !x.completed);
	}
};

const dispatch = dispatcher(model);

function updateTodo(value) {
	dispatch(() => ({todo: value}));
}

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

const updateVisible = value => dispatch(() => ({visible: value}));

const Layout = props => (
	<section class="section">
		<div class="container">
			<div class="columns">
				<div class="column is-one-quarter" />
				<div class="column is-half">{props.children}</div>
			</div>
		</div>
	</section>
);

const FilterLink = props => (
	<a
		class={`${props.visible === props.text ? 'has-text-weight-bold' : ''}`}
		style="margin: 0 0.25em;"
		onClick={() => updateVisible(props.text)}
	>
		{props.text}
	</a>
);

const Todos = props =>
	props.todos.map(todo => (
		<div class="notification is-primary">
			<button class="delete" onClick={() => deleteTodo(todo.id)} />
			<a
				class="is-size-5"
				style={`text-decoration: ${todo.completed
					? 'line-through'
					: 'none'}`}
				onClick={() => toggleTodo(todo.id)}
			>
				{todo.text}
			</a>
		</div>
	));

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
			<FilterLink visible={model.visible} text="All" />
			<FilterLink visible={model.visible} text="Incomplete" />
			<FilterLink visible={model.visible} text="Complete" />
		</div>
		<hr style="background-color: transparent" />
		<Todos todos={getVisibleTodos(model)} />
	</Layout>
);

deuce(view, model, document.getElementById('root'));
