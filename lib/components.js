export const When = {
  render() {
    if (this.state.current() !== this.of) {
      return null
    }

    if (this.$scopedSlots.default) {
      return this.$scopedSlots.default(this.state.data())
    }

    return this.$slots.default[0]
  },

  props: ['state', 'of']
}

export const CaseOf = {
  render() {
    if (this.$scopedSlots[this.state.current()]) {
      return this.$scopedSlots[this.state.current()](this.state.data())
    }

    if (this.$slots[this.state.current()]) {
      return this.$slots[this.state.current()][0]
    }

    return this.$slots.default[0]
  },

  props: ['state']
}
