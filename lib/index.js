function zip(keys, values) {
  if (keys.length !== values.length) {
    throw Error(`Incorrect number of arguments, expected: ${keys.length}, arguments received: ${values.join(', ')}`)
  }

  return keys.reduce((all, key, idx) => ({...all, [key]: values[idx]}), {})
}

function generateTransitionHelpers(currentState, parsedStates) {
  const buildFnBody = state => (...args) => {
    return PossibleStatesContainer({current: state, data: zip(state.data, args), allStates: parsedStates})
  }

  return parsedStates
    .filter(s => s.name !== currentState.name)
    .reduce(
      (transitions, state) => ({...transitions, [buildFnName('to', state.name)]: buildFnBody(state)}),
      {}
    )
}

function buildFnName(prefix, name) {
  return prefix + name.slice(0, 1).toUpperCase() + name.slice(1)
}

function generateWhenHelpers(currentState, parsedStates) {
  const buildFnBody = state => callback => currentState.name === state ? callback() : null

  return parsedStates
    .reduce(
      (helpers, state) => ({...helpers, [buildFnName('when', state.name)]: buildFnBody(state.name)}),
      {}
    )
}

function caseOf(clauses) {
  const casesCovered = Object.keys(clauses)
  const notCovered = this.originalStates.filter(state => !casesCovered.includes(state))

  if (notCovered.length > 0 && !casesCovered.includes('_')) {
    throw Error('All cases are not covered in a "caseOf" clause')
  }

  const cb = clauses[this.currentState.name] || clauses['_']

  return cb()
}

function PossibleStatesContainer({current, allStates, data}) {
  const originalStates = allStates.map(s => s.name)

  return {
    currentState: current, // @TODO make this private stuff
    originalStates,
    ...generateTransitionHelpers(current, allStates),
    ...generateWhenHelpers(current, allStates),
    caseOf,
    data: () => ({...data})
  }
}

function PossibleStates(...allStates) {
  if (!allStates.length === 0) {
    throw Error('No values passed when constructing a new PossibleStates')
  }

  const containsData = typeDefinition => typeDefinition.match(/<.*>/)

  if (allStates[0].match(/<.*>/)) {
    throw Error('The initial state cannot contain data')
  }

  const parsedStates = allStates.map(state => {
    if (!containsData(state)) {
      return {name: state, data: []}
    }

    const [name, typeDefs] = state.match(/^(.*)<(.*)>$/).slice(1)

    return {name, data: typeDefs.split(',')}
  })

  return PossibleStatesContainer({current: parsedStates[0], allStates: parsedStates})
}

export default PossibleStates
