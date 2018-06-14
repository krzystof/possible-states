# Possible States

> A tiny library to deal with UI states

## todos

- immutable
- when
- caseOf
- state which contains stuff

## Goal


## Installation

## Usage

this.state.ui = PossibleStates('wait', 'loading', 'success', 'failure')

this.setState({ ui: this.state.ui.loading() })

this.state.ui.whenLoading(() => (
  <div>
    Hello!
  </div>
))



## Contributing

## License
