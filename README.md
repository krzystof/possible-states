# Possible States

> A tiny library to deal with states, destroy booleans and useless data

[![Build Status](https://travis-ci.org/krzystof/possible-states.svg?branch=master)](https://travis-ci.org/krzystof/possible-states)


## Todos
- add a vuejs wrapper


## Goal

This was written with user interface in mind, but can be used anywhere.
I wanted a cleaner way to deal with user interface states in React and
Vue code. It's a way to get Enum types in javascript without having to
use typescript or flow.

A few problems you might have experienced:

**Implicit states and unreadable logic in the jsx / html template**

```jsx
{this.isLoaded() && !this.state.errors ? (
  <p>
    Status: {this.response.status}
  </p>
) : null}
```

By defining a `Success` state, that could be simplified.
That was a simple example, but we know that if clauses can get pretty
narly…


**Booleans proliferation and other data type choices**

isLoading, hasFetched, isDeleting, isEditing, these kind of booleans
seems to be everywhere. Sometimes it's worse, sometimes we use the fact
that a variable is null or undefined to mean implicitely that the ui is
not in a particular state.
I want a way to state clearly what the UI is doing.


**The impossible sometimes happens**

I bet you had a button with a loading indicator spinning forever, long
after the server crashed. That is an impossible state. After the crash,
some flags needs to be set to true, some other to false, some errors
must be set, … With a static type system, that could be dealt with
automatically.
Unfortunately, javascript isn't one of them.


**Some fields are not always used**

Why bother with an `error` attribute when everything went well?


## Installation

```
npm save possible-states
// or
yarn add possible-states
```

## Usage

Create an object that holds the logic for state transition.

The transition functions `toOk` and `toError` are defined automatically.

```
import PossibleStates from 'possible-states'

// the default value is the first argument we passed to this function:
let ui = PossibleStates('ok', 'error')

ui.current() === 'ok'

ui = ui.toError()

ui.current() === 'error'
```

The possible state object is **immutable**. Whenever a transition function
is called, a new object gets created.

Clean up logic in jsx with the **when** function.

In the previous case, we would also have a `whenOk` and `whenError`
function that would accept a callback and run it whenever the state
matches.

Use it to clean up if-else statements that are getting out of hand:

```jsx
// before

{this.loaded && !this.state.errors ? (
  <p>
    Status: this.response.status
  </p>
) : null}

// after

this.ui.whenSuccess(({status}) => (
  <p>
    Status: {status}
  </p>
))
```

For more checks and control, use the **caseOf** function.

```js
const users = PossibleStates('waiting', 'loading', 'success', 'failure')

// ... handle the fetching and transitions somewhere

users.caseOf({
  waiting: () => <p>Blank layout</p>,
  loading: () => <Spinner/>,
  success: () => <UsersList />,
  failure: () => <ErrorMessage />,
})
```

The library will force you to handle all the cases you have defined.
If we are only interested in a couple clauses, use `_` as a catch all clause:

```js
users.caseOf({
  success: () => <UsersList />,
  _: () => <Whatever />,
})
```

That's cool, but what is cooler is to define the data contained, so you don't have to deal with
it in a separate field.
Use the `name<data1, data2>` syntax for that.

- The initial state cannot hold data
- The data must be passed as arguments when transitioning to that state (or an error is thrown)
- The data will be passed as an argument to the callbacks used in `when` and `caseOf`

```js
this.state.ui = PossibleStates('wait', 'ok<result>', 'error<reason>')

this.state.ui = this.state.ui.toOk({whatever: 'goes here'})

this.state.ui.whenOk((data) => (
  <div>
    {data.whatever} // <-- 'goes here'
  </div>
))

// or

this.state.ui.caseOf({
  ok: data => <div>data.whatever</div>  // <-- only the ok clause will receive the data as an argument
  _: () => <div>nothing</div>
})
```

## Contributing

Be nice.

Add tests. If you are not sure how, let me know and we can figure it out.

Submit a PR from a branch named `fix-xxxxxxx` or `feature-xxxxxx`. Not from `master`.

Make sure `yarn test` and `yarn lint` pass.

Write meaningful commit messages. If needed, squash commits before opening your PR.

Don't hesitate to contact me for anything!


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (©) 2018-present, Christophe Graniczny
