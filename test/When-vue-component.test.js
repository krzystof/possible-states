/* eslint-env jest */
import {mount} from '@vue/test-utils'
import {When, default as PossibleStates} from '../lib'

describe('<When/>', () => {
  test('renders the content when it matches', () => {
    const wrapper = mount({
      template: `
        <div>
          <When :state="ui" of="yes">
            <div>Hello!</div>
          </When>
        </div>
      `,
      components: {
        When
      },
      data() {
        return {
          ui: PossibleStates('yes')
        }
      }
    })

    expect(wrapper.html()).toContain('Hello!')
  })

  test('does not render the content when it does not matches', () => {
    const wrapper = mount({
      template: `
        <div>
          <When :state="ui" of="no">
            <div>Hello!</div>
          </When>
        </div>
      `,
      components: {
        When
      },
      data() {
        return {
          ui: PossibleStates('yes')
        }
      }
    })

    expect(wrapper.html()).not.toContain('Hello!')
  })

  test('pass data as scoped slots when passed in', () => {
    const wrapper = mount({
      template: `
        <div>
          <When :state="ui" of="full">
            <div slot-scope="{text}">{{text}}</div>
          </When>
        </div>
      `,
      components: {
        When
      },
      data() {
        return {
          ui: PossibleStates('empty', 'full<text>').toFull('Some text')
        }
      }
    })

    expect(wrapper.html()).toContain('Some text')
  })
})
