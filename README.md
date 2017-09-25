# Deuce

Deuce is a continuation of the work I did on [franken-app](https://github.com/fwilkerson/franken-app). The main differences between the two is Deuce supports JSX and the event system no longer requires an id be assigned to an element with an event. Deuce is also smaller and faster than franken-app thanks to a rewrite of the virtual dom and decoupling some concepts.

## Quick Start

```javascript
import deuce, {h, dispatcher} from 'deuce';

// Deuce starts with a model
const model = {
	counter: 0
};

// dispatcher creates functions for interacting with the model
const {dispatch, getModel} = dispatcher(model);

function updateCounter(value) {
	const {counter} = getModel();

	// Validate that the count can be changed
	if (value < 0 && counter < 1) return;

	// update the model with the new counter
	dispatch({counter: counter + value});
}

// for simplicity we will update the counter every second
setInterval(() => updateCounter(1), 1000);

// The view function represents the model
function view(model) {
	return <h2>{model.counter}</h2>;
}

// Finally give the view, model, and target element to deuce
deuce(view, model, document.getElementById('root'));
```

For more in depth examples check out the demo folder.