/**
 * Zip two arrays together, combining the keys of the
 * first with the values of the second one.
 */
function zip(keys, values) {
  if (keys.length !== values.length) {
    throw Error(`Incorrect number of arguments, expected: ${keys.length}, arguments received: ${values.join(', ')}`)
  }

  return keys.reduce((all, key, idx) => ({...all, [key]: values[idx]}), {})
}

/**
 * Tiny helper to create toSomething and whenSomething
 * function names easily.
 */
function buildFnName(prefix, name) {
  return prefix + name.slice(0, 1).toUpperCase() + name.slice(1)
}

/**
 * Dynamically generate the transition to___() functions
 * that returns a new immutable PossibleStatesContainer.
 */
function generateTransitionHelpers(currentState, parsedStates) {
  const buildFnBody = state => (...args) => {
    return PossibleStatesContainer({current: state, data: zip(state.data, args), allStates: parsedStates})
  }

  return parsedStates.reduce(
    (transitions, state) => ({...transitions, [buildFnName('to', state.name)]: buildFnBody(state)}),
    {}
  )
}

/**
 * Dynamically generate the when__() functions
 */
function generateWhenHelpers(currentState, currentData, parsedStates) {
  const buildFnBody = state => callback => currentState.name === state ? callback(currentData) : null

  return parsedStates
    .reduce(
      (helpers, state) => ({...helpers, [buildFnName('when', state.name)]: buildFnBody(state.name)}),
      {}
    )
}

/**
 * The main data structure passed to the clients.
 */
function PossibleStatesContainer({current, allStates, data}) {
  return {
    caseOf(clauses) {
      const casesCovered = Object.keys(clauses)
      const notCovered = allStates.map(({name}) => name).filter(state => !casesCovered.includes(state))

      if (notCovered.length > 0 && !casesCovered.includes('_')) {
        throw Error('All cases are not covered in a "caseOf" clause')
      }

      const cb = clauses[current.name] || clauses['_']

      return cb(data)
    },

    current() {
      return current.name
    },

    data() {
      return {...data}
    },

    ...generateTransitionHelpers(current, allStates),
    ...generateWhenHelpers(current, data, allStates),
  }
}

/**
 * A function to parse the users definition and create
 * the corresponding Container.
 * The only exposed function to users.
 */
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

    return {name, data: typeDefs.split(',').map(def => def.trim())}
  })

  return PossibleStatesContainer({current: parsedStates[0], allStates: parsedStates})
}

export * from './components'

export default PossibleStates
