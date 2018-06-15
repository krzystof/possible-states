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
    if (this.$scopedSlots[this.ui.current()]) {
      return this.$scopedSlots[this.ui.current()](this.ui.data())
    }

    if (this.$slots[this.ui.current()]) {
      return this.$slots[this.ui.current()][0]
    }

    return this.$slots.default[0]
  },

  props: ['ui']
}
