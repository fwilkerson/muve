# Muve

Muve is a micro library for building interactive javascript applications. Muve is built around one concept, changes to the model update the view. There are three parts to an application built with Muve; A model to represent the state of your application, functions that serve as an api for updating your model, and a view to describe that model.

## Quick Start

`npm i --save muve` &nbsp; or &nbsp; `yarn add muve`

```javascript
import muve, {h, interact} from 'muve';

// The model
const model = {counter: 0};

// interact creates helpers for checking & changing the model.
const {getModel, setModel} = interact(model);

function updateCounter(value) {
	const {counter} = getModel();

	// Validate that the count can be changed
	if (value < 0 && counter < 1) return;

	// update the model with the new counter
	setModel({counter: counter + value});
}

// The view function represents the model
function view(model) {
	return <h2>{model.counter}</h2>;
}

// Finally give the view, model, and target element to muve
muve(view, model, document.getElementById('root'));

// for simplicity we will update the counter every second
setInterval(() => updateCounter(1), 1000);
```