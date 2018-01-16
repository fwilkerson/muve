# Muve

Muve is a micro library for building interactive javascript applications. Muve is built around a basic concept, changes to the model update the view. There are three parts to an application built with Muve; A model to represent the state of your application, functions that serve as an api for updating your model, and a view to describe that model.

<br/>

## Demos

A progressive web app that features routing, code-splitting, and gives an idea of how to structure larger apps.

[muve-forward](https://github.com/fwilkerson/muve-forward)

<br/>

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

For more in depth examples be sure to look at the demos.

<br/>


## API

In an attempt to keep things simple, muve exposes only three functions one of which is to enable the use of jsx.

### muve(view, init, target, hydrate) 

Initializes a muve application, this performs some setup and does the initial render of the view.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| view | Function | The entry point of your application | &nbsp; |
| init | Object | The initial model of your application | &nbsp; |
| target | HTMLElement | The element muve should attach itself to | &nbsp; |
| hydrate | Boolean | Set to true if the page was server rendered | &nbsp; |

#### Returns

- `Void`

<br/>

### h(type, attributes, children)

Used to convert jsx to js objects. Import this function in any file where you wish to use jsx.

<br/>

### interact(model, log?) 

Given your initial model, interact returns two functions for interacting with your model.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| model | Object | The initial model of your application | &nbsp; |
| log | Function? | Executed each time setModel is called with a name | &nbsp; |

#### Returns

- `Object`
	- getModel
	- setModel

<br/>

### getModel()

Returns the current model.

#### Returns

- `Object`

<br/>

### setModel(update, name?)

When executed the update will be applied to your application's model, your view function will be executed, and the DOM will be patched.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| update | Object | A part of your model you wish to change | &nbsp; |
| name | String? | Name your updates to have them logged | &nbsp; |

#### Returns

- `Void`
