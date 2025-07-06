import { mount } from '@vue/test-utils'
import DifyChatbot from '../DifyChatbot.vue'

describe('DifyChatbot', () => {
  it('renders properly', () => {
    const wrapper = mount(DifyChatbot, {
      props: {
        apiKey: 'test-api-key',
      },
    })

    expect(wrapper.classes()).toContain('dify-chatbot')
  })

  it('applies dark theme when specified', () => {
    const wrapper = mount(DifyChatbot, {
      props: {
        apiKey: 'test-api-key',
        theme: 'dark',
      },
    })

    expect(wrapper.classes()).toContain('dark')
  })

  // Add more test cases as needed
})
