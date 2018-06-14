function generateTransitionHelpers(initialState, states, parsedStates) {
  return states.filter(s => s !== initialState).reduce((transitions, state) => {
    // todo remove the arrow function and use the this binding to resolve the initialState instead of passing it here!

    return ({...transitions,
      [buildFnName('to', state)]: () => {
        const otherStateTransitions = states.filter(s => s !== state)

        return PossibleStates(state, ...otherStateTransitions)
      }})
  }, {})
}

function buildFnName(prefix, name) {
  return prefix + name.slice(0, 1).toUpperCase() + name.slice(1)
}

function generateWhenHelpers(currentState, states) {
  // refactor to using this
  const buildFnBody = state => callback => currentState === state ? callback() : null

  return states.reduce(
    (helpers, state) => ({...helpers, [buildFnName('when', state)]: buildFnBody(state)}),
    {}
  )
}

function caseOf(clauses) {
  const casesCovered = Object.keys(clauses)
  const notCovered = this.allStates.filter(state => !casesCovered.includes(state))

  if (notCovered.length > 0 && !casesCovered.includes('_')) {
    throw Error('All cases are not covered in a "caseOf" clause')
  }

  const cb = clauses[this.currentState] || clauses['_']

  return cb()
}

function PossibleStates(initialState, ...states) {
  if (!initialState) {
    throw Error('No values passed when constructing a new PossibleStates')
  }

  const containsData = typeDefinition => typeDefinition.match(/<.*>/)

  if (initialState.match(/<.*>/)) {
    throw Error('The initial state cannot contain data')
  }

  const parsedStates = states.map(state => {
    if (!containsData(state)) {
      return {name: state}
    }

    const [name, typeDefs] = state.match(/^(.*)<(.*)>$/).slice(1)

    return {name, data: typeDefs.split(',')}
  })

  const allStates = [initialState, ...states]

  return {
    currentState: initialState,
    allStates,
    ...generateTransitionHelpers(initialState, allStates, parsedStates),
    ...generateWhenHelpers(initialState, allStates),
    caseOf
  }
}

export default PossibleStates
