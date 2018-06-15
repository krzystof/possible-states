/* eslint-env jest */
import {mount} from '@vue/test-utils'
import {CaseOf, default as PossibleStates} from '../lib'

describe('<CaseOf/>', () => {
  test('renders the matching slot', () => {
    const wrapper = mount({
      template: `
        <div>
          <CaseOf :ui="ui">
            <div slot="yes">yeah</div>
            <div slot="no">nope</div>
          </CaseOf>
        </div>
      `,
      components: {
        CaseOf
      },
      data() {
        return {
          ui: PossibleStates('yes')
        }
      }
    })

    expect(wrapper.html()).toContain('yeah')
    expect(wrapper.html()).not.toContain('nope')
  })

  test('renders the matching slot with arguments', () => {
    const wrapper = mount({
      template: `
        <div>
          <CaseOf :ui="ui">
            <div slot="no">nope</div>
            <div slot="yes" slot-scope="{text}">{{text}}</div>
          </CaseOf>
        </div>
      `,
      components: {
        CaseOf
      },
      data() {
        return {
          ui: PossibleStates('no', 'yes<text>').toYes('holy moly')
        }
      }
    })

    expect(wrapper.html()).toContain('holy moly')
  })

  test.only('fall backs to the default slot', () => {
    const wrapper = mount({
      template: `
        <div>
          <CaseOf :ui="ui">
            <div>fallback here</div>
            <div slot="no">nope</div>
          </CaseOf>
        </div>
      `,
      components: {
        CaseOf
      },
      data() {
        return {
          ui: PossibleStates('no', 'yes<text>').toYes('holy moly')
        }
      }
    })

    expect(wrapper.html()).toContain('fallback here')
  })
})
