import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'

import getters from '@/store/getters'
import mutations from '@/store/mutations'
import Home from '@/components/Home'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Home.vue component', () => {
  let wrapper

  beforeEach(() => {
    jest.useFakeTimers()
    const state = {
      timers: [
        {id: 't1', time: 300, sound: 'chime', status: 'ready'},
        {id: 't2', time: 600, sound: 'whoosh', status: 'ready'}
      ],
      order: 'man'
    }
    const store = new Vuex.Store({ state, getters, mutations })
    wrapper = shallowMount(Home, { store, localVue })
  })

  it('contains "Add another timer" link', () => {
    const button = wrapper.find('.add')
    expect(button.text()).toBe('Add another timer')
  })

  it('when timers order set to "man" renders no additional controls', () => {
    const ctl = wrapper.find('.globalControls')
    expect(ctl.element.style.display).toBe('none')
  })

  it('when timers order set to "all" renders additional controls', () => {
    wrapper.vm.$store.commit('setOrder', 'all')
    const ctl = wrapper.find('.globalControls')
    expect(ctl.element.style.display).toBe('')
  })

  describe('global start/stop button', () => {
    let button

    beforeEach(() => {
      wrapper.vm.$store.commit('setOrder', 'all')
      button = wrapper.find('.globalStartStop')
    })

    it('enabled when status "ready"', () => {
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('display "Start" when status "ready"', () => {
      expect(button.text()).toBe('Start')
    })

    it('enabled when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('display "Stop" when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      expect(button.text()).toBe('Stop')
    })

    it('set status to "paused" if clicked when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      button.trigger('click')
      expect(wrapper.vm.status).toBe('paused')
    })

    it('enabled when status "paused"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'paused')
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('disabled when staus "completed"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'completed')
      expect(button.attributes().disabled).toBe('disabled')
    })
  })

  describe('global reset button', () => {
    let button

    beforeEach(() => {
      wrapper.vm.$store.commit('setOrder', 'all')
      button = wrapper.find('.globalReset')
    })

    it('disabled when status "ready"', () => {
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('disabled when status "active"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'active')
      expect(button.attributes().disabled).toBe('disabled')
    })

    it('enabled when status "paused"', () => {
      const state = {
        timers: [
          {id: 't1', time: 300, sound: 'chime', status: 'paused'},
          {id: 't2', time: 600, sound: 'whoosh', status: 'paused'}
        ],
        order: 'all'
      }
      const store = new Vuex.Store({ state, getters, mutations })
      wrapper = shallowMount(Home, { store, localVue })
      expect(wrapper.vm.$store.getters.getGlobalStatus).toBe('paused')
      expect(wrapper.find('.globalReset').attributes().disabled).toBeUndefined()
    })

    it('enabled when status "completed"', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'completed')
      expect(wrapper.vm.$store.getters.getGlobalStatus).toBe('completed')
      expect(button.attributes().disabled).toBeUndefined()
    })

    it('set status to "ready" if clicked', () => {
      wrapper.vm.$store.commit('setGlobalStatus', 'completed')
      button.trigger('click')
      expect(wrapper.vm.status).toBe('ready')
    })
  })
})
